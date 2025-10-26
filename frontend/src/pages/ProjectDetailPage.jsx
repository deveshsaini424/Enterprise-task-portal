import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  Calendar,
  Users,
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import ManageTeamModal from "../components/ManageTeamModal";
import ChatPanel from "../components/ChatPanel";
import EditProjectModal from "../components/EditProjectModal";

const formatDate = (dateString) => {
  if (!dateString) return "No deadline";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectRes = await api.get(`/api/projects/${projectId}`);
        setProject(projectRes.data);

        const tasksRes = await api.get(`/api/tasks/project/${projectId}`);
        setTasks(tasksRes.data);
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 403)
        ) {
          navigate("/app/projects", { replace: true });
        } else {
          setError("Failed to load project details.");
          console.error("Load Error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [api, projectId, navigate]);

  const handleTeamUpdate = (newTeam) => {
    setProject((prevProject) => ({
      ...prevProject,
      team: newTeam,
    }));
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== deletedTaskId)
    );
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleDeleteProject = async () => {
    const isCreator = project?.creator?._id === user?._id;

    // removed debug logs

    const isAdmin = user?.role === "admin";

    if (!isCreator && !isAdmin) {
      setError("Only the project creator or an admin can delete this project.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this project and all its tasks? This action cannot be undone."
      )
    ) {
      setDeleteLoading(true);
      setError(null);
      try {
        await api.delete(`/api/projects/${projectId}`);
        navigate("/app/projects", { replace: true });
      } catch (err) {
        console.error("Delete Error:", err);
        if (err.response && err.response.status === 403) {
          setError(
            "Permission denied. Only the project creator or admin can delete."
          );
        } else {
          setError(
            `Failed to delete project: ${
              err.response?.data?.message || err.message
            }`
          );
        }
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-indigo-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && !project && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!project && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-lg font-medium text-gray-600">
            Project not found or access denied.
          </p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const canDelete =
    project?.creator?._id === user?._id || user?.role === "admin";

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/app/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-6 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to all projects
          </Link>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 wrap-break-word mb-2">
                      {project.name}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 wrap-break-word leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2.5 rounded-xl shadow-md border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <Edit size={18} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2.5 rounded-xl shadow-md border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <Users size={18} />
                  <span className="hidden sm:inline">Team</span>
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={deleteLoading || !canDelete}
                  className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl shadow-md border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    canDelete
                      ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                  title={
                    !canDelete
                      ? "Only creator or admin can delete"
                      : "Delete Project"
                  }
                >
                  {deleteLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                <div className="shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Deadline
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100">
                <div className="shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Team
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {project.team.length} Members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-100">
                <div className="shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Tasks
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {tasks.length} Total
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <KanbanBoard
                tasks={tasks}
                project={project}
                onTaskCreated={handleTaskCreated}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </div>

            <div className="lg:col-span-1">
              <ChatPanel projectId={projectId} />
            </div>
          </div>

          {isTeamModalOpen && (
            <ManageTeamModal
              project={project}
              onClose={() => setIsTeamModalOpen(false)}
              onTeamUpdate={handleTeamUpdate}
            />
          )}
          {isEditModalOpen && (
            <EditProjectModal
              project={project}
              onClose={() => setIsEditModalOpen(false)}
              onProjectUpdate={handleProjectUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

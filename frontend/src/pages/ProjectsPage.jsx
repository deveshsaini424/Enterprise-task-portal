import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, Calendar, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';

const formatDate = (dateString) => {
  if (!dateString) return 'No deadline';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ProjectsPage = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/projects');
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects.');
        console.error(err);
      } finally { 
        setLoading(false);
      }
    };
    fetchProjects();
  }, [api]);

  const handleProjectCreated = (newProject) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Projects
              </h1>
              <p className="text-gray-600">Manage and track your team projects</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <Plus size={20} />
              Create Project
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link 
                  to={`/app/project/${project._id}`} 
                  key={project._id} 
                  className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block border border-white/20 hover:scale-[1.02] hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="shrink-0 w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 truncate group-hover:text-indigo-600 transition-colors duration-300">
                    {project.name}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis line-clamp-3 text-sm">
                    {project.description || 'No description provided.'}
                  </p>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex items-center gap-3 bg-indigo-50 px-3 py-2 rounded-lg">
                      <div className="shrink-0 w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Users size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{project.team.length} Members</span>
                    </div>
                    <div className="flex items-center gap-3 bg-red-50 px-3 py-2 rounded-lg">
                      <div className="shrink-0 w-6 h-6 bg-red-100 rounded-md flex items-center justify-center">
                        <Calendar size={14} className="text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{formatDate(project.deadline)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white/80 backdrop-blur-lg p-12 rounded-2xl shadow-xl border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl mb-6">
                <Briefcase size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No Projects Found</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first project and invite your team to collaborate!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Plus size={20} />
                Create Your First Project
              </button>
            </div>
          )}

          {isModalOpen && (
            <CreateProjectModal 
              onClose={() => setIsModalOpen(false)}
              onProjectCreated={handleProjectCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
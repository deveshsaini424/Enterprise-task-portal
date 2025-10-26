import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // <-- Removed .jsx
import {
  X,
  Loader2,
  Trash2,
  Calendar,
  User,
  Tag,
  AlignLeft,
} from "lucide-react";

const TaskDetailModal = ({
  task,
  projectTeam,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    assignee: task.assignee?._id || "",
    priority: task.priority,
    status: task.status,
    deadline: task.deadline ? task.deadline.split("T")[0] : "", // Format for date input
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        assignee: formData.assignee || null,
        deadline: formData.deadline || null,
      };

      // Call the UPDATE API
      const { data } = await api.put(`/api/tasks/${task._id}`, payload);

      // Find the assignee object to pass back
      const updatedAssignee = projectTeam.find((m) => m._id === data.assignee);
      onTaskUpdate({ ...data, assignee: updatedAssignee });
      onClose();
    } catch (err) {
      setError("Failed to update task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      setError(null);
      try {
        // Call the DELETE API
        await api.delete(`/api/tasks/${task._id}`);
        onTaskDelete(task._id); // Pass the ID of the deleted task
        onClose();
      } catch (err) {
        setError("Failed to delete task.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      {/* Modal Content */}
      <div
        onClick={handleModalContentClick}
        className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl m-4 max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {/* Title Input */}
            <div className="flex-1 mr-4">
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-3xl font-bold text-gray-800 border-b-2 border-transparent focus:border-blue-500 focus:outline-none py-2"
                placeholder="Task Title"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={28} />
            </button>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <AlignLeft size={16} /> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add more details..."
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <Tag size={16} /> Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label
                htmlFor="assignee"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <User size={16} /> Assignee
              </label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {projectTeam.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <Calendar size={16} /> Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              Delete Task
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailModal;

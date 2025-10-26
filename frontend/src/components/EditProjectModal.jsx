import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Removed .jsx
import { X, Loader2 } from 'lucide-react';

const EditProjectModal = ({ project, onClose, onProjectUpdate }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    deadline: project.deadline ? project.deadline.split('T')[0] : '', // Format for date input
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Project name is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline || null,
      };
      
      // Call the UPDATE API
      const { data } = await api.put(`/api/projects/${project._id}`, payload);
      
      onProjectUpdate(data); // Pass the updated project back
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to update project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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
        className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl m-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={28} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="name" // Make sure name matches state key
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description" // Make sure name matches state key
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline" // Make sure name matches state key
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
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
              {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;


import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Corrected path
import { X, Loader2, UserPlus, Trash2 } from "lucide-react";

const ManageTeamModal = ({ project, onClose, onTeamUpdate }) => {
  const { api } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [team, setTeam] = useState(project.team || []);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users");
        setAllUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Could not load user list.");
      }
    };
    fetchUsers();
  }, [api]);

  // Handle adding a user
  const handleAddUser = async () => {
    if (!selectedUser) {
      setError("Please select a user to add.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/projects/${project._id}/team/add`, {
        userId: selectedUser,
      });
      setTeam(data.team); // Update local team state
      onTeamUpdate(data.team); // Update parent component
      setSelectedUser(""); // Reset dropdown
    } catch (err) {
      setError("Failed to add user. They may already be on the team.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a user
  const handleRemoveUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(
        `/api/projects/${project._id}/team/remove`,
        { userId }
      );
      setTeam(data.team);
      onTeamUpdate(data.team);
    } catch (err) {
      setError("Failed to remove user.");
    } finally {
      setLoading(false);
    }
  };

  // This stops the modal from closing when clicking inside
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Filter out users already on the team from the dropdown
  const availableUsers = allUsers.filter(
    (user) => !team.some((teamMember) => teamMember._id === user._id)
  );

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
          <h2 className="text-3xl font-bold text-gray-800">Manage Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={28} />
          </button>
        </div>

        {/* Add User Form */}
        <div className="mb-6">
          <label
            htmlFor="userSelect"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Add Team Member
          </label>
          <div className="flex gap-2">
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user...</option>
              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {/* Current Team List */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current Team</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {team.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      member.image ||
                      `https://placehold.co/40x40/E2E8F0/4A5568?text=${member.name[0]}`
                    }
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                {/* Don't allow removing the project creator */}
                {member._id !== project.creator && (
                  <button
                    onClick={() => handleRemoveUser(member._id)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeamModal;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2, Trash2, UserCog, ShieldCheck, User, Users, Sparkles } from 'lucide-react';

const AdminPage = () => {
    const { api, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null); 
                const { data } = await api.get('/api/users');
                setUsers(data);
            } catch (err) {
                setError('Failed to load users.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [api]);

    const handleDeleteUser = async (userIdToDelete) => {
        if (currentUser?._id === userIdToDelete) {
            alert("You cannot delete yourself.");
            return;
        }

        const userToDelete = users.find(u => u._id === userIdToDelete);
        if (userToDelete?.role === 'admin') {
             alert("Cannot delete other admin users.");
             return;
        }

        if (window.confirm(`Are you sure you want to delete user ${userToDelete?.name || userIdToDelete}? This action cannot be undone.`)) {
            setDeleteLoading(userIdToDelete); 
            setError(null);
            try {
                await api.delete(`/api/users/${userIdToDelete}`);
                setUsers((prevUsers) => prevUsers.filter(u => u._id !== userIdToDelete));
            } catch (err) {
                setError(`Failed to delete user: ${err.response?.data?.message || err.message}`);
                console.error(err);
            } finally {
                setDeleteLoading(null); 
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
                    <p className="text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-xl max-w-md">
                    <strong className="font-bold text-lg">Error!</strong>
                    <p className="mt-2">{error} Please try again later.</p>
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
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <UserCog className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">Manage and monitor all users</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-xl shadow-md border border-white/20">
                            <Users size={18} className="text-indigo-600" />
                            <span className="text-sm font-semibold text-gray-700">
                                Total Users: <span className="text-indigo-600">{users.length}</span>
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-sm text-red-800 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-white/20">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-linear-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-white/80 transition-all duration-200 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="shrink-0 h-11 w-11">
                                                        <img 
                                                            className="h-11 w-11 rounded-xl object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-colors duration-200 shadow-sm" 
                                                            src={user.image || `https://placehold.co/44x44/E2E8F0/4A5568?text=${user.name[0]}`} 
                                                            alt={user.name} 
                                                            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/44x44/E2E8F0/4A5568?text=${user.name[0]}`}}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                                                        <div className="text-xs text-gray-500 sm:hidden">{user.email}</div> 
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-xl shadow-sm ${
                                                    user.role === 'admin' 
                                                    ? 'bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200' 
                                                    : 'bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                                }`}>
                                                    {user.role === 'admin' ? <ShieldCheck size={14}/> : <User size={14}/>}
                                                    {user.role === 'admin' ? 'Admin' : 'Employee'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={currentUser?._id === user._id || deleteLoading === user._id || user.role === 'admin'} 
                                                    className={`transition-all duration-200 p-2.5 rounded-xl ${
                                                        currentUser?._id === user._id || user.role === 'admin' 
                                                        ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                                        : 'text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md'
                                                    }`}
                                                    title={currentUser?._id === user._id ? "Cannot delete yourself" : user.role === 'admin' ? "Cannot delete other admins" : "Delete User"}
                                                >
                                                    {deleteLoading === user._id 
                                                        ? <Loader2 className="animate-spin" size={20}/> 
                                                        : <Trash2 size={20} />
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && !loading && (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
                                    <Users size={32} className="text-indigo-600" />
                                </div>
                                <p className="text-gray-600 font-medium">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
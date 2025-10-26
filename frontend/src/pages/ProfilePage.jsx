import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Removed .jsx
import { Loader2, Edit, Save, X } from 'lucide-react';

const ProfilePage = () => {
    const { user: authUser, api, login } = useAuth(); // Get user from auth, api, and login func
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);

    // Store initial form data to compare on save
    const [initialFormData, setInitialFormData] = useState({});
    // Form data state
    const [formData, setFormData] = useState({
        phoneNumber: '',
        age: '',
        fatherNumber: '',
    });

    useEffect(() => {
        const fetchFullProfile = async () => {
            if (!authUser) {
                setLoading(false);
                setError("User not authenticated.");
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Fetch the full profile including extra details
                const response = await api.get(`/api/users/${authUser.email}`);
                setUserProfile(response.data);
                // Initialize form data
                const initialData = {
                    phoneNumber: response.data.phoneNumber || '',
                    age: response.data.age || '',
                    fatherNumber: response.data.fatherNumber || '',
                };
                setFormData(initialData);
                setInitialFormData(initialData); // Store initial state
            } catch (err) {
                setError("Could not fetch user profile.");
                console.error("Could not fetch user profile", err);
                // Fallback to auth user data if fetch fails
                setUserProfile(authUser);
                 const initialData = {
                    phoneNumber: authUser.phoneNumber || '',
                    age: authUser.age || '',
                    fatherNumber: authUser.fatherNumber || '',
                };
                 setFormData(initialData);
                setInitialFormData(initialData);
            } finally {
                setLoading(false);
            }
        };
        fetchFullProfile();
    }, [api, authUser]); // Depend on authUser as well

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Simple check if anything changed
        if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            setIsEditing(false); // Nothing to save
            return;
        }

        setSaveLoading(true);
        setError(null);
        try {
            const payload = {
                email: userProfile.email, // Use email from fetched profile
                phoneNumber: formData.phoneNumber || "",
                // Ensure age is a number or null
                age: formData.age ? parseInt(formData.age, 10) : null,
                fatherNumber: formData.fatherNumber || "",
            };
            // Call the UPDATE API
            const response = await api.put(
                "/api/users/update",
                payload
            );
            setUserProfile(response.data); // Update displayed profile
            setInitialFormData(formData); // Update initial state after save

            // Crucially, update the AuthContext user if necessary
            // (Only basic fields are usually in AuthContext, but good practice)
            login(response.data, localStorage.getItem('token'));

            setIsEditing(false);
        } catch (err) {
            setError("Could not save details.");
            console.error("Failed to save details:", err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData); // Reset form to initial state
        setIsEditing(false);
        setError(null);
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error && !userProfile) { // Show error only if profile couldn't load at all
         return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg font-medium text-red-600">{error}</p>
            </div>
        );
    }

    // Fallback if authUser exists but profile fetch failed partially
    const displayUser = userProfile || authUser;
    if (!displayUser) return null; // Should ideally redirect if no user

    // Reusable component for profile fields
    const ProfileField = ({ label, value, name, type = "text", editingValue }) => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200">
            <p className="text-md font-medium text-gray-600 mb-1 sm:mb-0">{label}</p>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={editingValue || ""}
                    onChange={handleChange}
                    className="w-full sm:w-1/2 mt-1 sm:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            ) : (
                <p className="text-md font-semibold text-gray-800">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </p>
            )}
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-full">
             <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Profile</h1>

            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto">
                 {/* Display save error if it occurs */}
                 {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="flex flex-col sm:flex-row items-center mb-8 pb-8 border-b border-gray-200">
                     <img
                        className="h-24 w-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0"
                        src={displayUser.image || `https://placehold.co/96x96/E2E8F0/4A5568?text=${displayUser.name[0]}`}
                        alt="Profile"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 text-center sm:text-left">{displayUser.name}</h2>
                        <p className="text-lg text-gray-500 text-center sm:text-left">{displayUser.email}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <ProfileField
                        label="Phone Number"
                        name="phoneNumber"
                        value={userProfile?.phoneNumber} // Display from fetched profile
                        editingValue={formData.phoneNumber} // Edit form data
                    />
                    <ProfileField
                        label="Age"
                        name="age"
                        value={userProfile?.age}
                        editingValue={formData.age}
                        type="number"
                    />
                    <ProfileField
                        label="Father's Number"
                        name="fatherNumber"
                        value={userProfile?.fatherNumber}
                        editingValue={formData.fatherNumber}
                    />
                </div>

                {/* Action Buttons */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={saveLoading}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md"
                            >
                                {saveLoading ? <Loader2 className="animate-spin" /> : <Save size={18}/>} Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5 transition-transform"
                        >
                            <Edit size={18} /> Edit Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;


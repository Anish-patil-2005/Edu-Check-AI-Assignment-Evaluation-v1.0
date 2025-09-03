// src/components/Profile/MyProfile.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const MyProfile = () => {
  const { user,logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Please log in to view your profile.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md"
            src="../../../public/8847419.png"
            alt="User Avatar"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <span className="text-gray-600 dark:text-gray-400 capitalize">
            {user.role}
          </span>
        </div>

        {/* Info Section */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Profile Information
          </h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{user.name}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span className="capitalize">{user.role}</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          
          <button onClick={()=>logout()} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

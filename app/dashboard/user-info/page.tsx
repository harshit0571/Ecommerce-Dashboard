"use client";
import React from "react";
import { useUser } from "@/context/UserProvider";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "@/firebase"; // Assuming you have initialized Firebase auth

const UserInfo = () => {
  const { user, setUser } = useUser();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle sign-out error
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-max">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <FaUserCircle size={60} className="text-gray-400 mr-4" />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-green-300 shadow-inner">
            <p className="text-gray-600">
              <strong>Role:</strong> {user.role}
            </p>
          </div>
          <div
            className="p-4 bg-red-400 rounded-lg cursor-pointer hover:bg-red-300 shadow-inner"
            onClick={handleSignOut}
          >
            <p className="text-gray-100 text-center">
              <strong>Sign out</strong>
            </p>
          </div>
          {/* Add more user info fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

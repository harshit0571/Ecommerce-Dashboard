"use client";
import { useUser } from "@/context/UserProvider";
import { db } from "@/firebase";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  email: string;
  verification: boolean;
  role: string;
}

const Page: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">(
    "all"
  );
  const { user } = useUser();

  useEffect(() => {
    const getMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "members"));
        const membersData: Member[] = [];
        querySnapshot.forEach((doc) => {
          membersData.push({ id: doc.id, ...doc.data() } as Member);
        });
        setMembers(membersData);
        setFilteredMembers(membersData); // Initialize filtered members with all members
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    getMembers();
  }, []);

  useEffect(() => {
    // Filter members based on the selected filter
    if (filter === "all") {
      setFilteredMembers(members);
    } else if (filter === "verified") {
      const verifiedMembers = members.filter((member) => member.verification);
      setFilteredMembers(verifiedMembers);
    } else if (filter === "unverified") {
      const unverifiedMembers = members.filter(
        (member) => !member.verification
      );
      setFilteredMembers(unverifiedMembers);
    }
  }, [members, filter]);

  const handleToggleVerification = async (
    memberId: string,
    currentVerificationStatus: boolean
  ) => {
    try {
      // Check if the current user's email matches the member's email
      if (
        user?.email === members.find((member) => member.id === memberId)?.email
      ) {
        console.log("You cannot modify your own verification status.");
        return;
      }

      // Update the verification status of the member in Firestore
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        verification: !currentVerificationStatus, // Toggle the verification status
      });

      // Update local state to reflect the change
      const updatedMembers = members.map((member) =>
        member.id === memberId
          ? { ...member, verification: !currentVerificationStatus }
          : member
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      // Check if the current user's email matches the member's email
      if (
        user?.email === members.find((member) => member.id === memberId)?.email
      ) {
        console.log("You cannot modify your own role.");
        return;
      }

      // Update the role of the member in Firestore
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        role: newRole,
      });

      // Update local state to reflect the change
      const updatedMembers = members.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleFilterClick = (
    selectedFilter: "all" | "verified" | "unverified"
  ) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Members List</h1>
      <div className="mb-8">
        <button
          className={`mr-4 ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("all")}
        >
          All Users
        </button>
        <button
          className={`mr-4 ${
            filter === "verified"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("verified")}
        >
          Verified Users
        </button>
        <button
          className={`mr-4 ${
            filter === "unverified"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("unverified")}
        >
          Unverified Users
        </button>
      </div>
      <div>
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <p className="text-lg font-semibold">{member.name}</p>
            <p className="text-gray-600">{member.email}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4">
                <label
                  htmlFor={`role_${member.id}`}
                  className="mr-2 font-semibold"
                >
                  Role:
                </label>
                <select
                  id={`role_${member.id}`}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                >
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                  <option value="super admin">Super Admin</option>
                </select>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${
                  member.verification
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
                onClick={() =>
                  handleToggleVerification(member.id, member.verification)
                }
              >
                {member.verification ? "Remove" : "Verify"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

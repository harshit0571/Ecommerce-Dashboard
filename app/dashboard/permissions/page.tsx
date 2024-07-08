"use client";
import { db } from "@/firebase";
import { doc, updateDoc, collection, QuerySnapshot, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  email: string;
  verification: boolean;
  role: string;
  // Add more fields as needed
}

const Page: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

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
      const unverifiedMembers = members.filter((member) => !member.verification);
      setFilteredMembers(unverifiedMembers);
    }
  }, [members, filter]);

  const handleToggleVerification = async (memberId: string, currentVerificationStatus: boolean) => {
    try {
      // Update the verification status of the member in Firestore
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        verification: !currentVerificationStatus, // Toggle the verification status
      });

      // Update local state to reflect the change
      const updatedMembers = members.map((member) =>
        member.id === memberId ? { ...member, verification: !currentVerificationStatus } : member
      );
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
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

  const handleFilterClick = (selectedFilter: "all" | "verified" | "unverified") => {
    setFilter(selectedFilter);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Members List</h1>
      <div className="mb-4">
        <button
          className={`mr-4 ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("all")}
        >
          All Users
        </button>
        <button
          className={`mr-4 ${
            filter === "verified" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("verified")}
        >
          Verified Users
        </button>
        <button
          className={`mr-4 ${
            filter === "unverified" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          } px-4 py-2 rounded-lg`}
          onClick={() => handleFilterClick("unverified")}
        >
          Unverified Users
        </button>
      </div>
      <div>
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-gray-100 p-4 mb-2 rounded-lg">
            <p>
              <strong>Name:</strong> {member.name}
            </p>
            <p>
              <strong>Email:</strong> {member.email}
            </p>
            <p>
              <strong>Verification:</strong>{" "}
              {member.verification ? "Verified" : "Not Verified"}
            </p>
            <p>
              <strong>Role:</strong> {member.role}
            </p>
            <div className="mt-2">
              <label htmlFor={`role_${member.id}`} className="mr-2 font-semibold">
                Change Role:
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
              className={`px-4 py-2 rounded-lg mt-2 ${
                member.verification ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
              onClick={() => handleToggleVerification(member.id, member.verification)}
            >
              {member.verification ? "Unverify" : "Verify"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

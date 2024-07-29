"use client";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";

const DashboardPage: React.FC = () => {
  const { user } = useUser(); // Assuming user context is used for authentication or user-specific data
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    fetchOrdersData();
    fetchUsersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const orderSnapshot = await getDocs(ordersCollection);
      
      let total = 0;
      let count = 0;
      
      orderSnapshot.docs.forEach(doc => {
        const orderData = doc.data();
        total += orderData.discountedPrice; // Assuming `discountedPrice` is the total price for the order
        count += 1;
      });
      
      setTotalSales(total);
      setTotalOrders(count);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const fetchUsersData = async () => {
    try {
      const usersCollection = collection(db, "users"); // Replace "users" with your actual users collection name
      const userSnapshot = await getDocs(usersCollection);
      const userCount = userSnapshot.size;
      setTotalUsers(userCount);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-600">${totalSales.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Total Orders</h3>
            <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Total Users</h3>
            <p className="text-2xl font-bold text-yellow-600">{totalUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  oID: string;
  orderDetails: { pID: string; size: string; quantity: number }[];
  discountedPrice: number;
  products: any[];
}

const Page: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const orderSnapshot = await getDocs(ordersCollection);
      const orderList: any = await Promise.all(
        orderSnapshot.docs.map(async (docs) => {
          const orderData = docs.data();
          const products = await Promise.all(
            orderData.orderDetails.map(async (item: any) => {
              try {
                const productDoc = await getDoc(doc(db, "Products", item.pID));
                return productDoc.exists() ? productDoc.data() : null;
              } catch (error) {
                console.error(
                  `Failed to fetch product with pid ${item.pID}:`,
                  error
                );
                return null;
              }
            })
          );
          const filteredProducts = products.filter(
            (product) => product !== null
          );
          return {
            oID: docs.id,
            ...orderData,
            products: filteredProducts,
          };
        })
      );
      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders(orders.filter((order) => order.oID !== id));
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.products.some((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-5 bg-neutral-100 min-h-screen">
      <div className="flex justify-between mb-5">
        <p className="text-2xl font-semibold">Orders</p>
      </div>
      <div className="flex justify-between gap-3 mb-5">
        <input
          type="text"
          placeholder="Search orders"
          className="p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {/* Add options dynamically based on categories */}
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>
      </div>
      <div className="flex flex-col space-y-4">
        {filteredOrders.map((order) => {
          const primaryProduct = order.products[0];
          const additionalItemsCount = order.products.length - 1;
          return (
            <div
              key={order.oID}
              className="flex items-center justify-between bg-neutral-200 p-4 rounded-lg shadow-md"
              onClick={() => router.push(`orders/${order.oID}`)}
            >
              <div className="flex flex-col">
                <h2 className="font-bold text-lg">{primaryProduct?.name}</h2>
                <p className="text-sm text-gray-500">
                  Price: ${order.discountedPrice}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {order.orderDetails[0]?.size}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {order.orderDetails[0]?.quantity}
                </p>
                {additionalItemsCount > 0 && (
                  <p className="text-gray-600 text-sm">
                    +{additionalItemsCount} more item
                    {additionalItemsCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;

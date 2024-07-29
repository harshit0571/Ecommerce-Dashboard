"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/firebase";
import { log } from "console";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(orderId,"dsdss")

    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const orderDoc = doc(db, "orders", orderId as string);
        const orderSnapshot = await getDoc(orderDoc);
        console.log(orderSnapshot, "dssd");

        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data();

          const products = await Promise.all(
            orderData.orderDetails.map(async (item: any) => {
              try {
                const productDoc = doc(db, "Products", item.pID);
                const productSnapshot = await getDoc(productDoc);
                return productSnapshot.exists() ? productSnapshot.data() : null;
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
          setOrder({ ...orderData, products: filteredProducts });
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setError("Failed to fetch order. Please try again later.");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }
  console.log(order, "ysdsdd");

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  console.log(order, "ysdsdd");
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <p className="text-lg font-medium mb-2">Order ID: {orderId}</p>
        <p className="text-lg font-medium mb-2">
          Total Price: ${order?.totalPrice?.toFixed(2)}
        </p>
        <p className="text-lg font-medium mb-2">
          Discounted Price: ${order?.discountedPrice?.toFixed(2)}
        </p>
        <p className="text-lg font-medium mb-2">
          Date Ordered: {new Date(order?.date).toLocaleDateString()}
        </p>
        <p className="text-lg font-medium mb-2">
          User Id: {order?.uid}
        </p>
        <Link href="/orders">
          <p className="text-blue-500 hover:underline">Back to Orders</p>
        </Link>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      {order.products.map((product: any, index: number) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md mb-4 flex"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-24 h-24 rounded-lg border border-gray-300"
          />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-md mb-1">
              Size: {order.orderDetails[index]?.size}
            </p>
            <p className="text-md mb-1">
              Quantity: {order.orderDetails[index]?.quantity}
            </p>
            <p className="text-md text-red-500">
              Price: ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetailsPage;

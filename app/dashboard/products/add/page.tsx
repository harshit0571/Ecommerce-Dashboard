"use client";
import React from "react";
import ProductForm from "@/components/ProductForm";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";

const page = () => {
  const router = useRouter();
  const addProduct = async (data: any) => {
    try {
      console.log(data,"yo");
      // user.role === "support" ? (data.listed = false) : (data.listed = true);
      await addDoc(collection(db, "Products"), data);
      router.push("/dashboard/products");
    } catch (error) {}
  };
  return (
    <div className="w-full h-full">
      <ProductForm
        productData={undefined} // pass this only when editing
        onSubmit={addProduct}
        type="Add"
      />
    </div>
  );
};

export default page;

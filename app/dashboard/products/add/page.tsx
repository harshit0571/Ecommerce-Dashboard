"use client";
import React from "react";
import ProductForm from "@/components/ProductForm";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const addProduct = async (data: any) => {
    try {
      console.log(data);
      await addDoc(collection(db, "Products"), data);
      router.push("/dashboard/products");
    } catch (error) {}
  };
  return (
    <div className="w-full h-full">
      <ProductForm
        productData={undefined} // pass this only when editing
        onSubmit={addProduct}
        type="add"
      />
    </div>
  );
};

export default page;

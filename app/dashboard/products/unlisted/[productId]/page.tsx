"use client";
import ProductForm from "@/components/ProductForm";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { productId } = useParams();
  console.log(productId, "params");
  const [product, setProduct] = useState<any>();
  useEffect(() => {
    const getProduct = async () => {
      const docRef = await getDoc(doc(db, "Products", productId.toString()));
      console.log(docRef.data());
      setProduct(docRef.data());
    };
    getProduct();
  }, [productId]);
  console.log(product);
  const router = useRouter();
  const updateProduct = async (product: any) => {
    try {
      const docRef = doc(db, "Products", productId.toString());
      await updateDoc(docRef, product);
      router.push("/dashboard/products");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {product && (
        <ProductForm
          onSubmit={updateProduct}
          type="List"
          productData={product}
        />
      )}
    </div>
  );
};

export default page;

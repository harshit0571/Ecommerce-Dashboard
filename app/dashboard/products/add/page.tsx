"use client";
import React from "react";
import ProductForm from "@/components/ProductForm";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const updateTagsWithProductId = async (tags: any, productId: string) => {
    try {
      for (const tag of tags) {
        const tagRef = doc(db, "tags", tag.id);
        const tagDoc = await getDoc(tagRef);

        if (tagDoc.exists()) {
          await updateDoc(tagRef, {
            pids: arrayUnion(productId),
          });
        } else {
          console.error(`Tag with id ${tag} does not exist`);
        }
      }
    } catch (error) {
      console.error("Error updating tags with productId: ", error);
    }
  };
  const addProduct = async (data: any) => {
    try {
      console.log(data, "yo");
      // user.role === "support" ? (data.listed = false) : (data.listed = true);
      await addDoc(collection(db, "Products"), data).then((doc) =>
        updateTagsWithProductId(data.tags, doc.id)
      );

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

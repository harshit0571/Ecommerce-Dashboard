"use client";
import React from "react";
import { MdAddBox } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import ProductForm from "@/components/ProductForm";

const page = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full flex justify-between pt-10 px-10">
        <div className="flex items-center gap-2">
          <MdAddBox size={25} />
          <p className="text-2xl ">Add New Product</p>
        </div>
        <div>
          <button className="flex p-2 px-4 gap-2 items-center justify-center bg-green-300 rounded-full border-2 border-slate-700 hover:bg-white cursor-pointer">
            <FaCheck size={15} />
            <p> Add Product</p>
          </button>
        </div>
      </div>

      <ProductForm   productData={undefined} // pass this only when editing
  onSubmit={()=>{}}
/>
    </div>
  );
};

export default page;

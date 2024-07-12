"use client";
import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const ProductForm = () => {
  const [showAddButton, setShowAddButton] = useState(false);
  const [ImagesStore, setImagesStore] = useState([]);
  return (
    <div className="flex px-10 mt-8 gap-5">
      <div className="w-[70%] bg-neutral-100 rounded-lg flex flex-col p-3 gap-5">
        <h1 className="text-lg font-semibold">General Information</h1>
        <div className="flex flex-col gap-1">
          <p>Name Product</p>
          <input
            type="text"
            className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Description of Product</p>
          <textarea className="bg-neutral-200 p-2 min-h-[100px] rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
      <div className="w-[30%] bg-neutral-100 rounded-lg flex flex-col p-3 gap-5">
        <h1 className="text-lg font-semibold">Upload Images</h1>
        <div className="flex flex-col gap-3 relative">
          {showAddButton && (
            <div className="absolute flex flex-col z-50 justify-center items-center bg-neutral-300 p-3 rounded-xl bottom-0 w-full transition-all duration-150">
              <input
                type="text"
                className="bg-white p-2 ring-black ring-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="add image url"
              />
              <button className="p-2 mt-3 w-full bg-slate-700 text-white font-semibold h-max rounded-full ">
                Add image
              </button>
              <button
                className=" w-max h-max rounded-full font-semibold text-red-500 "
                onClick={() => {
                  setShowAddButton(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
          <div className="w-full h-[250px] bg-neutral-200 rounded-md"></div>
          <div className="flex gap-2 overflow-auto w-full">
            <div
              className="bg-neutral-100 h-[50px] w-[50px] rounded-md flex justify-center items-center hover:bg-neutral-300 cursor-pointer border-dotted border-2 border-slate-400"
              onClick={() => {
                setShowAddButton(true);
              }}
            >
              <FaPlusCircle color="light-green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

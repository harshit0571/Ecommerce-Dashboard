"use client";
import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const ProductForm = () => {
  const [showAddButton, setShowAddButton] = useState(false);
  const [ImagesStore, setImagesStore] = useState<string[]>([]);
  const [imageUrlVal, setImageUrlVal] = useState("");
  const [displayImage, setDisplayImage] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stock, setStock] = useState<{ [size: string]: number }>({});
  const [gender, setGender] = useState("");

  const handleImagesAdd = (imageurl: string) => {
    setImagesStore((images) => [...images, imageurl]);
    setShowAddButton(false);
    setImageUrlVal("");
  };

  const handleSizeClick = (size: string) => {
    setSelectedSizes((sizes) =>
      sizes.includes(size) ? sizes.filter((s) => s !== size) : [...sizes, size]
    );
  };

  const handleStockChange = (size: string, quantity: number) => {
    setStock((prevStock) => ({ ...prevStock, [size]: quantity }));
  };

  return (
    <div className="flex px-10 mt-8 gap-5 pb-5">
      <div className="w-[70%] rounded-lg flex h-max flex-col gap-5">
        <div className="flex-col p-3 gap-5 bg-neutral-100  rounded-lg flex">
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
          <div className="flex flex-col">
            <h1>Size</h1>
            <p className="text-gray-400 text-sm">Pick available sizes</p>
            <div className="flex gap-2 mt-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  className={`p-2 bg-neutral-300 rounded-md cursor-pointer hover:bg-green-200 ${
                    selectedSizes.includes(size) ? "bg-green-200" : ""
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1>Gender</h1>
            <div className="flex gap-2 mt-1">
              {["Male", "Female", "Unisex"].map((g) => (
                <div key={g} className="flex items-center gap-1">
                  <input
                    type="radio"
                    id={g}
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    className="cursor-pointer"
                  />
                  <label htmlFor={g} className="cursor-pointer">
                    {g}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-neutral-100 p-3 rounded-lg gap-5">
          <h1 className="text-lg font-semibold">Pricing And Stock</h1>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <div className="flex flex-col flex-grow gap-1">
                <p>Price</p>
                <input
                  type="number"
                  className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex flex-col flex-grow gap-1">
                <p>Discount</p>
                <input
                  type="number"
                  className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2>Stock</h2>
              {selectedSizes.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <p className="w-12">{size}</p>
                  <input
                    type="number"
                    value={stock[size] || ""}
                    onChange={(e) =>
                      handleStockChange(size, Number(e.target.value))
                    }
                    className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black flex-grow"
                    placeholder={`Stock for ${size}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[30%] h-max bg-neutral-100 rounded-lg flex flex-col p-3 gap-5">
        <h1 className="text-lg font-semibold">Upload Images</h1>
        <div className="flex flex-col gap-3 relative">
          {showAddButton && (
            <div className="absolute flex flex-col z-50 justify-center items-center bg-neutral-300 p-3 rounded-xl bottom-0 w-full transition-all duration-150">
              <input
                type="text"
                className="bg-white w-full p-2 ring-black ring-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="add image url"
                value={imageUrlVal}
                onChange={(e) => {
                  setImageUrlVal(e.target.value);
                }}
              />
              <button
                className="p-2 mt-3 w-full bg-slate-700 text-white font-semibold h-max rounded-full "
                onClick={() => handleImagesAdd(imageUrlVal)}
              >
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
          <div className="w-full h-[250px] bg-neutral-200 rounded-md">
            <img
              src={ImagesStore.length > 0 ? ImagesStore[displayImage] : ""}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-auto w-full">
            {ImagesStore.map((image, index) => (
              <div
                key={index}
                className={`bg-neutral-100 h-[50px] w-[50px] rounded-md flex justify-center items-center hover:bg-neutral-300 cursor-pointer ${
                  index === displayImage ? "border-black border-2" : ""
                }`}
                onClick={() => setDisplayImage(index)}
              >
                <img src={image} className="w-full h-full object-cover" />
              </div>
            ))}
            <div
              className="bg-neutral-100 h-[50px] w-[50px] rounded-md flex justify-center items-center hover:bg-neutral-300 cursor-pointer border-dotted border-2 border-slate-400"
              onClick={() => setShowAddButton(true)}
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

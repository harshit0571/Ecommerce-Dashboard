"use client";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaCheck, FaPlusCircle } from "react-icons/fa";
import { MdAddBox, MdCancel } from "react-icons/md";

interface Category {
  name: string;
  subcategories: string[];
}

interface ProductFormProps {
  productData?: {
    name: string;
    description: string;
    price: number;
    discount: number;
    stock: { [size: string]: number };
    gender: string;
    images: string[];
    category: string;
    subcategories: string[];
    sizes: string[];
    listed?: boolean;
  };
  onSubmit: (data: any) => void;
  type: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productData,
  onSubmit,
  type,
}) => {
  const [showAddButton, setShowAddButton] = useState(false);
  const [ImagesStore, setImagesStore] = useState<string[]>(
    productData?.images || []
  );
  const [imageUrlVal, setImageUrlVal] = useState("");
  const [displayImage, setDisplayImage] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    productData?.sizes || []
  );
  const [stock, setStock] = useState<{ [size: string]: number }>(
    productData?.stock || {}
  );
  const [gender, setGender] = useState(productData?.gender || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState(
    productData?.category || ""
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    productData?.subcategories || []
  );
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || 0);
  const [discount, setDiscount] = useState(productData?.discount || 0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList: Category[] = [];
      for (const doc of categorySnapshot.docs) {
        const subcategoriesCollection = collection(
          db,
          "categories",
          doc.data().name,
          "subcategories"
        );
        const subcategorySnapshot = await getDocs(subcategoriesCollection);
        const subcategories = subcategorySnapshot.docs.map(
          (subDoc) => subDoc.data().name as string
        );
        categoryList.push({ name: doc.data().name as string, subcategories });
      }
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

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

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories((prevSubcategories) =>
      prevSubcategories.includes(subcategory)
        ? prevSubcategories.filter((sub) => sub !== subcategory)
        : [...prevSubcategories, subcategory]
    );
  };

  const handleSubmit = () => {
    const formData = {
      name,
      description,
      price,
      discount,
      stock,
      gender,
      images: ImagesStore,
      category: selectedParentCategory,
      subcategories: selectedSubcategories,
      sizes: selectedSizes,
      listed: true,
    };
    onSubmit(formData);
    console.log(formData, "form");
  };

  return (
    <div>
      <div className="w-full flex justify-between pt-10 px-10">
        <div className="flex items-center gap-2">
          <MdAddBox size={25} />
          <p className="text-2xl ">
            {type === "edit" ? "Edit Product" : "Add New Product"}
          </p>
        </div>
        <div>
          <button
            className="flex p-2 px-4 gap-2 items-center justify-center bg-green-300 rounded-full border-2 border-slate-700 hover:bg-white cursor-pointer"
            onClick={() => {
              handleSubmit();
            }}
          >
            <FaCheck size={15} />
            <p> {type === "edit" ? "Edit Product" : "Add Product"}</p>
          </button>
        </div>
      </div>
      <div className="flex px-10 mt-8 gap-5 pb-5">
        <div className="w-[70%] rounded-lg flex h-max flex-col gap-5">
          <div className="flex-col p-3 gap-5 bg-neutral-100 rounded-lg flex">
            <h1 className="text-lg font-semibold">General Information</h1>
            <div className="flex flex-col gap-1">
              <p>Name Product</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Description of Product</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-neutral-200 p-2 min-h-[100px] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
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
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-neutral-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    min={0}
                  />
                </div>
                <div className="flex flex-col flex-grow gap-1">
                  <p>Discount</p>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    min={0}
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
                      min={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-max rounded-lg flex flex-col gap-5">
          <div className="bg-neutral-100 rounded-lg flex flex-col w-full p-3 gap-5">
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

          <div className="h-max w-full bg-neutral-100 rounded-lg flex flex-col p-3 gap-1">
            <h1 className="text-lg font-semibold">Categories</h1>
            <p className="text-gray-400">Choose parent category</p>
            <select
              className="bg-neutral-200 p-2 rounded-md"
              value={selectedParentCategory}
              onChange={(e) => setSelectedParentCategory(e.target.value)}
            >
              <option disabled value="">
                Please select a category
              </option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
            {selectedParentCategory !== "" &&
              categories
                .find((cat) => cat.name === selectedParentCategory)
                ?.subcategories.map((sub) => (
                  <div key={sub} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={sub}
                      value={sub}
                      checked={selectedSubcategories.includes(sub)}
                      onChange={() => handleSubcategoryChange(sub)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={sub} className="cursor-pointer">
                      {sub}
                    </label>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

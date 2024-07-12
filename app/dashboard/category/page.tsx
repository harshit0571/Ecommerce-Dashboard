"use client";
import { db } from "@/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Category {
  name: string;
  subcategories: string[];
}

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [category, setCategory] = useState("");

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
      console.log(categoryList, "d");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const toggleSubcategories = (categoryName: string) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };

  const handleSelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setDropdownOpen(false);
  };

  const addCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a parent category");
      return;
    }
    if (category === "") {
      alert("Please enter a category name");
      return;
    }

    try {
      if (selectedCategory === "no parent") {
        const ref = collection(db, "categories");
        await addDoc(ref, { name: category });
      } else {
        const ref = collection(
          db,
          "categories",
          selectedCategory,
          "subcategories"
        );
        await addDoc(ref, { name: category });
      }
      alert("Category added successfully");
      setCategory("");
      setSelectedCategory(null);
      fetchCategories(); // Refresh categories after adding a new one
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("Error adding category: " + (error as Error).message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Category</h1>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-300 rounded-l-lg focus:outline-none"
            placeholder="Enter category name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <div className="relative flex-grow">
            <button
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-left"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCategory || "Select a category"}
            </button>
            {dropdownOpen && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10 max-h-60 overflow-y-auto">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect("no parent")}
                >
                  No parent
                </li>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(category.name)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="p-4 bg-slate-700 text-white rounded-r-lg hover:bg-slate-700 transition duration-300"
            onClick={addCategory}
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <ul className="list-none">
          {categories.map((category, index) => (
            <li key={index} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-gray-900 font-medium text-lg"
                onClick={() => toggleSubcategories(category.name)}
              >
                <span>{category.name}</span>
                <span>{expandedCategory === category.name ? "-" : "+"}</span>
              </div>
              {expandedCategory === category.name && (
                <ul className="ml-6 mt-2 list-disc transition-all duration-300 ease-in-out">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex} className="text-gray-600">
                      {subcategory}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;

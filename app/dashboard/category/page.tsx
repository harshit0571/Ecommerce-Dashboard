"use client";
import { db } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList: Category[] = [];
      for (const docSnap of categorySnapshot.docs) {
        const categoryId = docSnap.id;
        const subcategoriesCollection = collection(
          db,
          "categories",
          categoryId,
          "subcategories"
        );
        const subcategorySnapshot = await getDocs(subcategoriesCollection);
        const subcategories = subcategorySnapshot.docs.map(
          (subDoc) => subDoc.data().name as string
        );
        categoryList.push({ 
          id: categoryId, 
          name: docSnap.data().name as string, 
          subcategories 
        });
      }
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const toggleSubcategories = (categoryId: string) => {
    setExpandedCategory(
      expandedCategory === categoryId ? null : categoryId
    );
  };

  const handleSelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setDropdownOpen(false);
  };

  const addCategory = async () => {
    if (categoryName === "") {
      alert("Please enter a category name");
      return;
    }

    try {
      if (selectedCategoryId === "no parent" || selectedCategoryId === null) {
        const ref = collection(db, "categories");
        await addDoc(ref, { name: categoryName });
      } else {
        const ref = collection(
          db,
          "categories",
          selectedCategoryId,
          "subcategories"
        );
        await addDoc(ref, { name: categoryName });
      }
      alert("Category added successfully");
      setCategoryName("");
      setSelectedCategoryId(null);
      fetchCategories(); // Refresh categories after adding a new one
    } catch (error) {
      console.error("Error adding category: ", error);
      alert("Error adding category: " + (error as Error).message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Category</h1>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            className="p-4 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="relative">
            <button
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none bg-white text-gray-700 text-left"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name || "Select a category" : "Select a category"}
            </button>
            {dropdownOpen && (
              <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect("no parent")}
                >
                  No parent
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={addCategory}
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <ul className="list-none">
          {categories.map((category) => (
            <li key={category.id} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => toggleSubcategories(category.id)}
              >
                <span>{category.name}</span>
                <span>{expandedCategory === category.id ? "-" : "+"}</span>
              </div>
              {expandedCategory === category.id && (
                <ul className="ml-4 mt-2 list-disc">
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

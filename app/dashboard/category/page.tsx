"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase"; // Ensure you have the Firebase config and initialization
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Category {
  id: string;
  name: string;
}

const CategoryForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData: Category[] = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, name: doc.data().name });
        });
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim() === "") return;

    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: categoryName.trim(),
      });

      const newCategory: Category = {
        id: docRef.id,
        name: categoryName.trim(),
      };

      setCategories([...categories, newCategory]);
      setCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container m-auto px-4 py-8 w-full">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Category Management
      </h1>
      <form onSubmit={handleAddCategory} className="mb-8 max-w-lg mx-auto">
        <div className="mb-4">
          <label
            htmlFor="categoryName"
            className="block text-lg font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category name"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Category
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Categories
      </h2>
      <ul className="list-disc list-inside max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow-md"
          >
            <span className="text-lg font-medium text-gray-800">
              {category.name}
            </span>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryForm;

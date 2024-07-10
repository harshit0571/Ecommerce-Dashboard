"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { db } from "@/firebase";
import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  label: string;
  category: string[];
  stock: number;
  price: number;
  images: string[];
  description: string;
  listed: boolean;
  date: string;
}

interface Category {
  id: string;
  name: string;
}



const AddProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State to hold products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData: Category[] = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, name: doc.data().name });
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = [];

        for (const Doc of querySnapshot.docs) {
          const productData = Doc.data() as Product;
          productData.id = Doc.id;

          // Fetch categories based on IDs stored in productData.category
          const categories: string[] = [];
          for (const categoryId of productData.category) {
            const catDocRef = doc(db, "categories", categoryId);
            const catDoc = await getDoc(catDocRef);

            if (catDoc.exists()) {
              const catData = catDoc.data() as Category;
              categories.push(catData.name);
            } else {
              console.warn(`Category with ID ${categoryId} does not exist`);
            }
          }

          productData.category = categories;
          productsData.push(productData);
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 ">Listed Product</h1>
        <div className="flex gap-3">
          <button className="block  bg-green-400 p-2 rounded-lg text-center text-white hover:underline">
            Requests
          </button>
          <Link
            href="products/add"
            className="block bg-blue-400 p-2 rounded-lg text-center text-white hover:underline"
          >
            Add Another Product
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AddProduct;

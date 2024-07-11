"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductProvider";

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

const ProductList: React.FC = () => {
  const { products } = useProducts();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [showListed, setShowListed] = useState(true);

  useEffect(() => {
    setDisplayProducts(products.filter((prod) => prod.listed === showListed));
  }, [products, showListed]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 ">
          {showListed ? "Listed Products" : "Unlisted Products"}
        </h1>
        <div className="flex gap-3">
          <button
            className={`block p-2 rounded-lg text-center text-white ${
              showListed ? "bg-red-400" : "bg-green-400"
            } hover:underline`}
            onClick={() => setShowListed(!showListed)}
          >
            {showListed ? "Show Unlisted Products" : "Show Listed Products"}
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
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            listed={product.listed}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

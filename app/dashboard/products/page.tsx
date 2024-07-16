"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: { [size: string]: number };
}

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "Products");
      const productSnapshot = await getDocs(productsCollection);
      const productList: Product[] = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5 bg-neutral-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Products List</h1>
      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search products"
          className="p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {/* Add options dynamically based on categories */}
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>
      </div>
      <div className="flex flex-col space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between bg-neutral-200 p-4 rounded-lg shadow-md"
          >
            <div className="flex flex-col">
              <h2 className="font-bold text-lg">{product.name}</h2>
              <p className="text-sm text-gray-500">Price: ${product.price}</p>
              <p className="text-sm text-gray-500">
                Stock:{" "}
                {Object.values(product.stock).reduce(
                  (acc, curr) => acc + curr,
                  0
                )}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(product.id)}
                className="bg-slate-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

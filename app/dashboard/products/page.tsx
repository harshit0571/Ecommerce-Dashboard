"use client";
import React, { Suspense, useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Adjust the number of products per page as needed
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "Products");
      const productSnapshot = await getDocs(productsCollection);
      const productList: Product[] = productSnapshot.docs
        .filter((doc) => doc.data().listed)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="p-5 bg-neutral-100 min-h-screen">
      <div className="flex justify-between mb-5">
        <p className="text-2xl font-semibold">Products</p>
        <div className="flex gap-3 items-center">
          <Link
            href={"products/unlisted"}
            className="flex p-2 px-4 gap-2 items-center justify-center bg-slate-600  border-2 border-slate-700 hover:bg-slate-300 cursor-pointer text-white hover:text-slate-700"
          >
            Unlisted Products
          </Link>
          <Link
            href={"products/add"}
            className="flex p-2 px-4 gap-2 items-center justify-center bg-green-300  border-2 border-slate-700 hover:bg-white cursor-pointer"
          >
            Add Products
          </Link>
        </div>
      </div>
      <div className="flex justify-between gap-3 mb-5">
        <input
          type="text"
          placeholder="Search products"
          className="p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Suspense fallback="...loading">
        <div className="flex flex-col space-y-4">
          {currentProducts.map((product) => (
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
      </Suspense>
      <div className="flex justify-between mt-5">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-slate-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-slate-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;

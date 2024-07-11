"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { db } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useUser } from "@/context/UserProvider";
import { useProducts } from "@/context/ProductProvider";
import { useRouter } from "next/navigation";

interface Product {
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

interface ProductContextType {
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

const AddProduct: React.FC = () => {
  const [label, setLabel] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [stock, setStock] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([""]);
  const [description, setDescription] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const categoryId = e.target.value;
    console.log(categoryId);
    setCategory((prevCategory) =>
      prevCategory.includes(categoryId)
        ? prevCategory.filter((catId) => catId !== categoryId)
        : [...prevCategory, categoryId]
    );
  };
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const { setProducts } = useProducts();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("hey");
    try {
      const product: Product = {
        label,
        category,
        stock: Number(stock),
        price: Number(price),
        images: images.filter((url) => url), // Filter out empty strings
        description,
        date: new Date().toISOString(),
        listed: user?.role === "support" ? false : true,
      };
      console.log(product, "harshit");
      await addDoc(collection(db, "products"), product).then((docRef) => {
        const newProduct: ProductContextType = { ...product, id: docRef.id };
        setProducts((prevProducts: ProductContextType[]) => [
          ...prevProducts,
          newProduct,
        ]);
      });

      setLabel("");
      setCategory([]);
      setStock("");
      setPrice("");
      setImages([""]);
      setDescription("");
      alert("Product added successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error adding product");
    }
  };

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData: Category[] = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, name: doc.data().name });
        });
        setCategoriesData(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-slate-700 mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="w-full border border-slate-300 rounded p-2 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <div className="flex flex-wrap">
            {categoriesData.map((cat, index) => (
              <label key={index} className="mr-4 mb-2 text-slate-700">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={category.includes(cat.id)}
                  onChange={handleCategoryChange}
                  className="mr-1"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            className="w-full border border-slate-300 rounded p-2 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full border border-slate-300 rounded p-2 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-slate-300 rounded p-2 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Images
          </label>
          {images.map((image, index) => (
            <input
              key={index}
              type="text"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
              className="w-full border border-slate-300 rounded p-2 mb-2 text-slate-700"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="w-full bg-slate-500 text-white py-2 rounded hover:bg-slate-600"
          >
            Add Another Image
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

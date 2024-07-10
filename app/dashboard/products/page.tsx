"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { db } from "@/firebase";
import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useUser } from "@/context/UserProvider";

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

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.images[0]}
        alt={product.label}
        className="w-full h-64 object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{product.label}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {product.category.join(", ")}
          </span>
          <span className="text-lg font-bold text-blue-500">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

const AddProduct: React.FC = () => {
  const [label, setLabel] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [stock, setStock] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([""]);
  const [description, setDescription] = useState<string>("");
  const [categories] = useState<string[]>([
    "Electronics",
    "Books",
    "Clothing",
    "Sports",
    "Furniture",
  ]);
  const [products, setProducts] = useState<Product[]>([]); // State to hold products
  const [categoriesData, setCategoriesData] = useState<Category[]>([]); // State to hold categories

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const categoryId = e.target.value;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const product: Product = {
        id: "",
        label,
        category,
        stock: Number(stock),
        price: Number(price),
        images: images.filter((url) => url), // Filter out empty strings
        description,
        date: new Date().toISOString(),
        listed: false,
      };
      const docRef = await addDoc(collection(db, "products"), product);
      setLabel("");
      setCategory([]);
      setStock("");
      setPrice("");
      setImages([""]);
      setDescription("");
      alert("Product added successfully!");

      product.id = docRef.id; // Update product with generated ID
      setProducts([...products, product]); // Update products state with new product
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error adding product");
    }
  };

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

  const { user } = useUser();
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AddProduct;

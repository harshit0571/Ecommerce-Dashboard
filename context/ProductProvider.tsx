"use client";
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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

interface ProductContext {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  deleteProduct: (docId: string) => void;
}

interface Category {
  id: string;
  name: string;
}

const ProductContext = createContext<ProductContext>({
  products: [],
  setProducts: () => {},
  loading: true,
  deleteProduct: () => {},
});

export const useProducts = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: Product[] = [];

      for (const Doc of querySnapshot.docs) {
        const productData = Doc.data() as Product;
        productData.id = Doc.id;

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
    setLoading(false);
  };

  const deleteProduct = async (docId: string) => {
    console.log(docId);
    try {
      await deleteDoc(doc(db, "products", docId)).then(() => {
        setProducts(products.filter((product) => product.id !== docId));
        console.log(products);
      });
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ setProducts, products, loading, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider };

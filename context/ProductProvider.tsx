"use client";
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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

interface ProductContext {
  products: ProductContextType[];
  setProducts: (products: ProductContextType[]) => void;
  loading: boolean;
  deleteProduct: (docId: string) => void;
  toggleListing: (docId: string, listingStatus: boolean) => void;
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
  toggleListing: () => {},
});

export const useProducts = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductContextType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: ProductContextType[] = [];

      for (const Doc of querySnapshot.docs) {
        const productData = Doc.data() as ProductContextType;
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
    try {
      await deleteDoc(doc(db, "products", docId)).then(() => {
        setProducts(products.filter((product) => product.id !== docId));
        console.log(products);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleListing = async (docId: string, listingStatus: boolean) => {
    try {
      const docRef = doc(db, "products", docId);
      await updateDoc(docRef, {
        listed: !listingStatus,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === docId
            ? { ...product, listed: !listingStatus }
            : product
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ setProducts, products, loading, deleteProduct, toggleListing }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider };

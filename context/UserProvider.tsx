"use client";
import { db } from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});
export const useUser = () => {
  return useContext(UserContext);
};
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const data = JSON.parse(storedUser);
        const docRef = doc(db, "members", data.email);
        const docData = await getDoc(docRef);
        console.log(docData.data(), "harshit");
        setUser(docData.data());
        localStorage.setItem("user", JSON.stringify(docData.data()));
        console.log("user called");
      }

      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };

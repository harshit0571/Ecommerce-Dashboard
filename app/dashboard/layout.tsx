"use client";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  console.log(user);
  const router = useRouter();
  if (!user) {
    router.push("/login");
  }
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;

"use client";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, loading } = useUser();
  console.log(user);
  const router = useRouter();
  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    } else if (user) {
      if (user.role == "support") {
        router.push("/dashboard/user-info");
      }
    }
  }, [user, loading]);
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="h-full overflow-auto w-full">{children}</div>
    </div>
  );
};

export default layout;

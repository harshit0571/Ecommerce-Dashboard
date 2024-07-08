import Sidebar from "@/components/Sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;

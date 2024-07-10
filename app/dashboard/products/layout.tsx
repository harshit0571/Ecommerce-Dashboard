import { ProductProvider } from "@/context/ProductProvider";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ProductProvider>{children}</ProductProvider>;
};

export default layout;

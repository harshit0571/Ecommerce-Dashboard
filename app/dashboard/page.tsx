"use client";
import { useUser } from "@/context/UserProvider";
import React from "react";

const page = () => {
  const { user } = useUser();
  console.log(user);
  return <div>page</div>;
};

export default page;

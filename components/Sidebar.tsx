import { useUser } from "@/context/UserProvider";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { FaProductHunt, FaUser } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

import { MdVerifiedUser, MdSettings, MdShoppingCart } from "react-icons/md";

const sidebarItems = [
  {
    icon: <AiFillDashboard size={30} className="m-auto" />,
    label: "Dashboard",
    visible: ["super admin", "admin"],
    href: "/dashboard",
  },
  {
    icon: <FaProductHunt size={30} className="m-auto" />,
    label: "Products",
    visible: ["super admin", "support", "admin"],
    href: "/dashboard/products",
  },
  {
    icon: <MdCategory size={30} className="m-auto" />,
    label: "Categories",
    visible: ["super admin", "support", "admin"],
    href: "/dashboard/category",
  },
  {
    icon: <MdShoppingCart size={30} className="m-auto" />,
    label: "Orders",
    visible: ["super admin", "admin"],
    href: "/dashboard/user-info",
  },
  {
    icon: <FaUser size={30} className="m-auto" />,
    label: "Profile",
    visible: ["super admin", "support", "admin"],
    href: "/dashboard/user-info",
  },
  {
    icon: <MdVerifiedUser size={30} className="m-auto" />,
    label: "Permissions",
    visible: ["super admin"],
    href: "/dashboard/permissions",
  },
  {
    icon: <MdSettings size={30} className="m-auto" />,
    label: "Settings",
    visible: ["super admin", "support", "admin"],
    href: "/dashboard/user-info",
  },
];

const Sidebar = () => {
  const { user, loading } = useUser();
  console.log(user, "fdfddf");
  return (
    <div className="bg-slate-800 w-max overflow-auto text-white">
      <div className="bg-red-400 p-2  h-[50px] ">
        <p className="text-xl font-semibold">ShopEase</p>
      </div>
      <div className="gap-5 flex flex-col justify-start overflow-auto p-4 items-center">
        {!loading &&
          sidebarItems
            .filter((item) => item.visible.includes(user?.role))
            .map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="gap-1 flex flex-col hover:text-green-300 cursor-pointer items-center"
              >
                {item.icon}
                <p>{item.label}</p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Sidebar;

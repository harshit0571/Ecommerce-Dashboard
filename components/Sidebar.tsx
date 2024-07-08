import React from "react";
import { AiFillDashboard } from "react-icons/ai";
import { FaProductHunt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import { MdSettings, MdShoppingCart } from "react-icons/md";

const sidebarItems = [
  {
    icon: <AiFillDashboard size={30} className="m-auto" />,
    label: "Dashboard",
  },
  { icon: <FaProductHunt size={30} className="m-auto" />, label: "Products" },
  { icon: <MdShoppingCart size={30} className="m-auto" />, label: "Orders" },
  { icon: <MdSettings size={30} className="m-auto" />, label: "Settings" },
  { icon: <FaUser size={30} className="m-auto" />, label: "Roles" },
];

const Sidebar = () => {
  return (
    <div className="bg-slate-800 text-white">
      <div className="bg-red-400 p-2 h-[50px]">
        <p className="text-xl font-semibold">ShopEase</p>
      </div>
      <div className=" gap-10 flex flex-col justify-start p-4  items-center">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="gap-1 flex flex-col hover:text-red-400 cursor-pointer items-center"
          >
            {item.icon}
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

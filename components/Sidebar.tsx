import { useUser } from "@/context/UserProvider";
import React from "react";
import { AiFillDashboard } from "react-icons/ai";
import { FaProductHunt, FaUser } from "react-icons/fa";
import { MdVerifiedUser, MdSettings, MdShoppingCart } from "react-icons/md";

const sidebarItems = [
  {
    icon: <AiFillDashboard size={30} className="m-auto" />,
    label: "Dashboard",
    visible: ["super admin", "admin"],
  },
  {
    icon: <FaProductHunt size={30} className="m-auto" />,
    label: "Products",
    visible: ["super admin", "support", "admin"],
  },
  {
    icon: <MdShoppingCart size={30} className="m-auto" />,
    label: "Orders",
    visible: ["super admin", "admin"],
  },
  {
    icon: <FaUser size={30} className="m-auto" />,
    label: "User Info",
    visible: ["super admin", "support", "admin"],
  },
  {
    icon: <MdVerifiedUser size={30} className="m-auto" />,
    label: "Permissions",
    visible: ["super admin"],
  },
  {
    icon: <MdSettings size={30} className="m-auto" />,
    label: "Settings",
    visible: ["super admin", "support", "admin"],
  },
];

const Sidebar = () => {
  const { user } = useUser();

  return (
    <div className="bg-slate-800 text-white">
      <div className="bg-red-400 p-2 h-[50px]">
        <p className="text-xl font-semibold">ShopEase</p>
      </div>
      <div className="gap-10 flex flex-col justify-start p-4 items-center">
        {sidebarItems
          .filter((item) => item.visible.includes(user?.role))
          .map((item, index) => (
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

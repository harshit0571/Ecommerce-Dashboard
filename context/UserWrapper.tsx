import React, { ReactNode } from "react";
import { UserProvider } from "./UserProvider";

const UserWrapper = ({ children }: { children: ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default UserWrapper;

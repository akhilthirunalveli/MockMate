import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext.jsx";
import Navbar from "../../Navbar/Navbar.jsx";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div
      className="min-h-screen bg-dots-dark"
      style={{
        opacity: 1,
      }}
    >
      <Navbar />
      <main className="pt-28 pb-6">{user && <div>{children}</div>}</main>
    </div>
  );
};

export default DashboardLayout;

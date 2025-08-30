import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext.jsx";
import Navbar from "../../Navbar/Navbar.jsx";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div
      className="min-h-screen"
      style={{
        opacity: 1,
        backgroundImage: "radial-gradient(#e5e5e5 0.5px,#080708 0.5px)",
        backgroundSize: "21px 21px",
      }}
    >
      <Navbar />
      <main className="pt-28 pb-6">{user && <div>{children}</div>}</main>
    </div>
  );
};

export default DashboardLayout;

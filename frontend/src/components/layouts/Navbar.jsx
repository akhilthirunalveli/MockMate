import React from 'react'
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 px-9 py-6"
      style={{
        opacity: 1,
        backgroundImage: "radial-gradient(#ffffff 0.5px,rgba(0, 0, 0, 0) 0.5px)",
        backgroundSize: "21px 21px",
      }}>
      <div className="max-w-8xl mx-auto ">
        <div className="bg-transparent text-white backdrop-blur-xl rounded-[30px] shadow-lg shadow-black/[0.03] border border-gray-200/50">
          <div className="container mx-auto flex items-center justify-between gap-5 h-16 px-8">
            <Link to="/dashboard">
              <h2
                className="text-3xl font-medium text-white"
                style={{ fontFamily: "'anta', cursive"}}>
                Mockmate
              </h2>
            </Link>
            <ProfileInfoCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
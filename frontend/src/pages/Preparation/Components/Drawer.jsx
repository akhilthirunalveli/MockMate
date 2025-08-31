import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return <div
      className={`fixed top-[100px] right-0 z-40 h-[calc(100dvh-64px)] p-4 overflow-y-auto transition-transform bg-black w-full md:w-[40vw] shadow-2xl shadow-cyan-800/10 border-r border-l-gray-800 scrollbar-hide ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        /* Hide scrollbar for Chrome, Safari and Opera */
        WebkitScrollbar: 'none',
        /* Hide scrollbar for IE, Edge and Firefox */
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1
          id="drawer-right-label"
          className="flex items-center text-base font-semibold text-white"
        >
          {title}
        </h1>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-white bg-transparent hover:text-red-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Body Content */}
      <div className="text-sm text-white mx-3 mb-6">{children}</div>
    </div>
};

export default Drawer;

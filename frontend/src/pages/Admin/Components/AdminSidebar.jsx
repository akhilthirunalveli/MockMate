import React, { useState } from "react";
import { baseStyles, ConnectionStatus } from "./AdminUI";
import {
    DashboardSquare01Icon,
    UserGroupIcon,
    Comment01Icon,
    Megaphone01Icon,
    Logout01Icon
} from 'hugeicons-react';
import { BASE_URL } from "../../../constants/apiPaths";

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, connectionStatus }) => {
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
        { key: "analytics", label: "Dashboard", icon: <DashboardSquare01Icon size={20} /> },
        { key: "users", label: "Users", icon: <UserGroupIcon size={20} /> },
        { key: "sessions", label: "Sessions", icon: <Comment01Icon size={20} /> },
        { key: "broadcast", label: "Broadcast", icon: <Megaphone01Icon size={20} /> },
    ];

    return (
        <div
            style={{
                width: isHovered ? "280px" : "80px",
                height: "100vh",
                backgroundColor: "#050505",
                borderRight: "1px solid #222",
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem 1rem",
                position: "fixed",
                left: 0,
                top: 0,
                fontFamily: baseStyles.fontFamily,
                zIndex: 1000,
                transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                overflow: "hidden",
                boxShadow: isHovered ? "10px 0 50px rgba(0,0,0,0.5)" : "none"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Section */}
            <div style={{
                marginBottom: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: isHovered ? "flex-start" : "center",
                // gap: "1rem", // Removed gap to prevent alignment issues
                paddingLeft: isHovered ? "0.5rem" : "0",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                height: "40px"
            }}>
                <img src="/Logo.svg" alt="M" style={{ width: "32px", height: "32px", flexShrink: 0 }} />
                <h1 style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: 0,
                    marginLeft: isHovered ? "1rem" : "0",
                    opacity: isHovered ? 1 : 0,
                    maxWidth: isHovered ? "200px" : "0",
                    overflow: "hidden",
                    transform: isHovered ? "translateX(0)" : "translateX(10px)",
                    transition: "all 0.3s ease"
                }}>
                    MockMate
                </h1>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        title={!isHovered ? item.label : ""}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: isHovered ? "flex-start" : "center",
                            // gap: "1.2rem",
                            padding: "0.9rem",
                            backgroundColor: activeTab === item.key ? "#222" : "transparent",
                            color: activeTab === item.key ? "#fff" : "#666",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: activeTab === item.key ? "600" : "500",
                            transition: "all 0.2s ease",
                            textAlign: "left",
                            fontFamily: baseStyles.fontFamily,
                            whiteSpace: "nowrap",
                            position: "relative"
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== item.key) {
                                e.currentTarget.style.backgroundColor = "#111";
                                e.currentTarget.style.color = "#ccc";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== item.key) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#666";
                            }
                        }}
                    >
                        <span style={{ fontSize: "1.2rem", flexShrink: 0, width: "24px", display: "flex", justifyContent: "center" }}>{item.icon}</span>
                        <span style={{
                            marginLeft: isHovered ? "1.2rem" : "0",
                            opacity: isHovered ? 1 : 0,
                            maxWidth: isHovered ? "150px" : "0",
                            overflow: "hidden",
                            transform: isHovered ? "translateX(0)" : "translateX(10px)",
                            transition: "all 0.3s ease",
                            transitionDelay: isHovered ? "0.1s" : "0s"
                        }}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Footer Section: Connection Status and Logout */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div style={{ padding: isHovered ? "0" : "0.5rem 0", display: "flex", justifyContent: "center", width: "100%" }}>
                    <ConnectionStatus status={connectionStatus} url={BASE_URL} collapsed={!isHovered} />
                </div>

                <button
                    onClick={onLogout}
                    title={!isHovered ? "Logout" : ""}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isHovered ? "flex-start" : "center",
                        // gap: "1.2rem",
                        padding: "0.9rem",
                        backgroundColor: "#220a0a", // Solid dark red background
                        color: "#ff4444",
                        border: "none", // No border
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        fontFamily: baseStyles.fontFamily,
                        whiteSpace: "nowrap",
                        width: "100%", // Full width
                        boxSizing: "border-box"
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = "#330a0a"; // Solid hover change
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = "#220a0a";
                    }}
                >
                    <span style={{ fontSize: "1.2rem", flexShrink: 0, width: "24px", display: "flex", justifyContent: "center" }}><Logout01Icon size={20} /></span>
                    <span style={{
                        marginLeft: isHovered ? "1.2rem" : "0",
                        opacity: isHovered ? 1 : 0,
                        maxWidth: isHovered ? "150px" : "0",
                        overflow: "hidden",
                        transform: isHovered ? "translateX(0)" : "translateX(10px)",
                        transition: "all 0.3s ease"
                    }}>
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

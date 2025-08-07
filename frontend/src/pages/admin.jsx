import React, { useState, useEffect, Suspense, lazy } from "react";
import { BASE_URL } from "../utils/apiPaths";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

// Constants
const ADMIN_CODE = "1110";
const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];

// Utility function to load Google Fonts
const loadGoogleFonts = () => {
  if (!document.querySelector('link[href*="Montserrat"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

// Load fonts on module import
loadGoogleFonts();

// Base styles
const baseStyles = {
  fontFamily: "'Montserrat', sans-serif",
  cardBase: {
    backgroundColor: "#000000",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "clamp(1rem, 3vw, 2rem)",
  },
  glassMorphism: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
  }
};

// Skeleton Components
const SkeletonLoader = ({ height = "clamp(250px, 40vw, 300px)" }) => (
  <div style={{ 
    width: "100%", 
    height, 
    backgroundColor: "#2a2a2a", 
    borderRadius: "clamp(6px, 2vw, 8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 1.5s ease-in-out infinite"
  }}>
    <div style={{ color: "#666", fontSize: "clamp(12px, 3vw, 14px)" }}>Loading...</div>
  </div>
);

const CardSkeleton = () => (
  <div style={{
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "clamp(6px, 2vw, 8px)",
    padding: "clamp(1.2rem, 4vw, 1.5rem)",
    animation: "pulse 1.5s ease-in-out infinite",
    minHeight: "clamp(120px, 20vw, 150px)"
  }}>
    {[
      { height: "clamp(18px, 5vw, 24px)", width: "100%" },
      { height: "clamp(14px, 4vw, 18px)", width: "70%" },
      { height: "clamp(12px, 3.5vw, 16px)", width: "50%" }
    ].map((style, index) => (
      <div 
        key={index}
        style={{ 
          height: style.height, 
          backgroundColor: "#333", 
          borderRadius: "clamp(3px, 1vw, 4px)", 
          marginBottom: "clamp(0.4rem, 2vw, 0.6rem)",
          width: style.width
        }}
      />
    ))}
  </div>
);

// Reusable Components
const Card = ({ children, style = {}, ...props }) => (
  <div style={{ ...baseStyles.cardBase, ...style }} {...props}>
    {children}
  </div>
);

const StatsCard = ({ value, label, subtitle, color }) => (
  <Card style={{ textAlign: "center" }}>
    <div style={{ 
      color, 
      fontSize: "clamp(2rem, 6vw, 3rem)",
      fontWeight: "700",
      marginBottom: "0.5rem"
    }}>
      {value}
    </div>
    <div style={{ 
      color: "#ccc", 
      fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
      fontWeight: "500" 
    }}>
      {label}
    </div>
    <div style={{ 
      color: "#888", 
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
      marginTop: "0.5rem" 
    }}>
      {subtitle}
    </div>
  </Card>
);

const ChartCard = ({ title, children, height = "clamp(250px, 40vw, 300px)" }) => (
  <Card>
    <h3 style={{ 
      color: "white", 
      marginBottom: "1rem",
      fontFamily: baseStyles.fontFamily,
      fontWeight: "500",
      fontSize: "clamp(1rem, 3vw, 1.3rem)",
      textAlign: "center"
    }}>
      {title}
    </h3>
    <div style={{ width: "100%", height, minWidth: "250px", minHeight: "250px" }}>
      {children}
    </div>
  </Card>
);

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false, 
  style = {},
  ...props 
}) => {
  const variants = {
    primary: { backgroundColor: "#007bff", hoverColor: "#0056b3" },
    danger: { backgroundColor: "#dc3545", hoverColor: "#c82333" },
    tab: { backgroundColor: "#333", hoverColor: "#444", border: "1px solid #555" }
  };

  const variantStyle = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "clamp(0.35rem, 1.5vw, 0.45rem) clamp(0.7rem, 2.5vw, 0.9rem)",
        borderRadius: "20px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: baseStyles.fontFamily,
        fontWeight: "500",
        fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.6 : 1,
        color: "white",
        border: "none",
        ...variantStyle,
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && variantStyle.hoverColor) {
          e.target.style.backgroundColor = variantStyle.hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = variantStyle.backgroundColor;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const ConnectionStatus = ({ status, url }) => {
  const statusConfig = {
    connected: { color: "#28a745", icon: "✓", text: "Connected" },
    failed: { color: "#dc3545", icon: "✗", text: "Disconnected" },
    testing: { color: "#ffc107", icon: "⏳", text: "Testing..." }
  };

  const config = statusConfig[status] || statusConfig.testing;

  return (
    <div style={{ 
      marginBottom: "clamp(0.6rem, 2vw, 0.8rem)", 
      padding: "clamp(0.4rem, 2vw, 0.6rem) clamp(0.6rem, 2.5vw, 0.8rem)", 
      borderRadius: "clamp(6px, 1.5vw, 10px)", 
      backgroundColor: config.color,
      color: "white",
      fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
      fontWeight: "500",
      fontFamily: baseStyles.fontFamily
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.2rem, 0.8vw, 0.4rem)" }}>
        <div style={{ fontWeight: "600" }}>
          Backend: {config.icon} {config.text}
        </div>
        {status === "connected" && url && (
          <div style={{ 
            fontSize: "clamp(0.6rem, 1.6vw, 0.7rem)", 
            opacity: "0.85",
            wordBreak: "break-all",
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.9)"
          }}>
            {url}
          </div>
        )}
      </div>
    </div>
  );
};

const TabNavigation = ({ activeTab, setActiveTab, setLoadedTabs, tabs }) => (
  <div style={{ 
    marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", 
    display: "flex", 
    flexWrap: "nowrap", 
    gap: "clamp(0.3rem, 1.2vw, 0.4rem)",
    width: "100%",
    overflowX: "auto",
    scrollbarWidth: "thin",
    WebkitOverflowScrolling: "touch"
  }}>
    {tabs.map(({ key, label, count }) => (
      <Button
        key={key}
        variant="tab"
        onClick={() => {
          setActiveTab(key);
          setLoadedTabs(prev => new Set([...prev, key]));
        }}
        style={{
          backgroundColor: activeTab === key ? "#000000ff" : "#000000ff",
          border: activeTab === key ? "2px solid #ffffffff" : "1px solid #000000ff",
          minWidth: "fit-content",
          padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)",
          fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
          color: activeTab === key ? "#ffffff" : "#ccc",
          fontWeight: activeTab === key ? "600" : "500"
        }}
      >
        {label}{count !== undefined ? ` (${count})` : ''}
      </Button>
    ))}
  </div>
);

// Login Component
const LoginPage = ({ onLogin }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      onLogin();
      setError("");
    } else {
      setError("Invalid access code. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setCode("");
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(value);
    if (error) setError("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "#000000",
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      fontFamily: baseStyles.fontFamily,
      position: "relative",
      paddingTop: "clamp(30vh, 31vh, 32vh)",
      paddingBottom: "2rem",
      boxSizing: "border-box"
    }}>
      {/* Background blur elements */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "20%",
        width: "200px",
        height: "200px",
        background: "linear-gradient(45deg, rgba(0, 123, 255, 0.3), rgba(40, 167, 69, 0.3))",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float1 6s ease-in-out infinite"
      }} />
      
      <div style={{
        position: "absolute",
        top: "60%",
        right: "15%",
        width: "150px",
        height: "150px",
        background: "linear-gradient(45deg, rgba(255, 193, 7, 0.3), rgba(220, 53, 69, 0.3))",
        borderRadius: "50%",
        filter: "blur(50px)",
        animation: "float2 8s ease-in-out infinite"
      }} />

      <div style={{
        ...baseStyles.glassMorphism,
        padding: "3rem 2.5rem",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        animation: isShaking ? "shake 0.5s ease-in-out" : "none",
        position: "relative",
        zIndex: 10
      }}>
        <h1 style={{
          color: "rgba(255, 255, 255, 0.95)",
          marginBottom: "0.5rem",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          fontWeight: "700",
          fontFamily: baseStyles.fontFamily,
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
        }}>
          Admin Access
        </h1>
        
        <p style={{
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "2rem",
          fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
        }}>
          Enter 4-digit access code
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2rem"
          }}>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 1) {
                    const newCode = code.split("");
                    newCode[index] = value;
                    const updatedCode = newCode.join("").slice(0, 4);
                    setCode(updatedCode);
                    if (error) setError("");
                    
                    // Auto-focus next input
                    if (value && index < 3) {
                      const nextInput = e.target.parentElement.children[index + 1];
                      if (nextInput) nextInput.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace to move to previous input
                  if (e.key === "Backspace" && !code[index] && index > 0) {
                    const prevInput = e.target.parentElement.children[index - 1];
                    if (prevInput) prevInput.focus();
                  }
                }}
                placeholder="•"
                style={{
                  width: "3rem",
                  height: "3rem",
                  padding: "0",
                  fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                  textAlign: "center",
                  background: "#000000",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "2px solid #353535ff",
                  borderRadius: "12px",
                  color: "white",
                  fontFamily: baseStyles.fontFamily,
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 1)";
                  e.target.style.boxShadow = "0 0 20px rgba(43, 43, 43, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ffffff";
                  e.target.style.boxShadow = "none";
                }}
                maxLength="1"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div style={{
              color: "rgba(220, 53, 69, 0.9)",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              padding: "0.5rem",
              background: "rgba(220, 53, 69, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(220, 53, 69, 0.3)",
              borderRadius: "8px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 4}
            style={{
              width: "100%",
              padding: "1rem",
              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
              fontWeight: "600",
              background: code.length === 4 
                ? "linear-gradient(135deg, rgba(0, 123, 255, 0.8), rgba(0, 86, 179, 0.8))"
                : "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "white",
              border: code.length === 4 
                ? "1px solid rgba(0, 123, 255, 0.3)" 
                : "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              cursor: code.length === 4 ? "pointer" : "not-allowed",
              fontFamily: baseStyles.fontFamily,
              transition: "all 0.3s ease",
              opacity: code.length === 4 ? 1 : 0.6,
              boxShadow: code.length === 4 ? "0 8px 25px rgba(0, 123, 255, 0.2)" : "none"
            }}
            onMouseEnter={(e) => {
              if (code.length === 4) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 35px rgba(0, 123, 255, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (code.length === 4) {
                e.target.style.transform = "translateY(0px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0, 123, 255, 0.2)";
              }
            }}
          >
            Access Dashboard
          </button>
        </form>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, -20px) rotate(-120deg); }
          66% { transform: translate(25px, 25px) rotate(-240deg); }
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          height: 4px;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        div[style*="overflowX: auto"] {
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

// Lazy load user tab
const UsersTab = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        default: ({ users, handleDeleteUser }) => (
          <div>
            <h2 style={{ 
              color: "white", 
              marginBottom: "1rem",
              fontFamily: baseStyles.fontFamily,
              fontWeight: "600",
              fontSize: "clamp(1.5rem, 4vw, 2rem)"
            }}>
              All Registered Users
            </h2>
            <div style={{ 
              display: "grid", 
              gap: "1rem", 
              gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
            }}>
              {users.map((user) => (
                <Card key={user._id} style={{ backgroundColor: "#1a1a1a", color: "white" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start", 
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "1rem"
                  }}>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <h3 style={{ 
                        margin: "0 0 0.5rem 0", 
                        color: "#007bff",
                        fontSize: "clamp(1rem, 3vw, 1.2rem)",
                        fontFamily: baseStyles.fontFamily,
                        fontWeight: "600",
                        wordBreak: "break-word"
                      }}>
                        {user.name}
                      </h3>
                      <p style={{ 
                        margin: "0 0 0.5rem 0", 
                        color: "#ccc",
                        fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                        wordBreak: "break-word"
                      }}>
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteUser(user._id)}
                      style={{
                        padding: "clamp(6px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                        fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                        minWidth: "fit-content",
                        flexShrink: "0"
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                  <div style={{ fontSize: "14px", color: "#999" }}>
                    <p style={{ margin: "0.25rem 0" }}><strong>ID:</strong> {user._id}</p>
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      });
    }, 100); // Small delay to ensure proper initialization
  })
);

// Lazy load sessions tab
const SessionsTab = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        default: ({ sessions }) => (
          <div>
            <h2 style={{ 
              color: "white", 
              marginBottom: "1rem",
              fontFamily: baseStyles.fontFamily,
              fontWeight: "600",
              fontSize: "clamp(1.5rem, 4vw, 2rem)"
            }}>
              All Interview Sessions
            </h2>
            <div style={{ 
              display: "grid", 
              gap: "1rem", 
              gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
            }}>
              {sessions.map((session) => (
                <Card key={session._id} style={{ backgroundColor: "#1a1a1a", color: "white" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ 
                      margin: "0 0 0.5rem 0", 
                      color: "#28a745",
                      fontSize: "clamp(1rem, 3vw, 1.2rem)",
                      fontFamily: baseStyles.fontFamily,
                      fontWeight: "600"
                    }}>
                      {session.role || 'Unknown Role'}
                    </h3>
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "0.5rem", 
                      marginBottom: "0.5rem" 
                    }}>
                      <span style={{ 
                        backgroundColor: "#007bff", 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: "12px", 
                        fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                        fontWeight: "500"
                      }}>
                        {session.experience || 'Unknown'}
                      </span>
                      <span style={{ 
                        backgroundColor: "#6f42c1", 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: "12px", 
                        fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                        fontWeight: "500"
                      }}>
                        {session.difficulty || 'Unknown'}
                      </span>
                    </div>
                    {session.user && (
                      <p style={{ 
                        margin: "0.5rem 0", 
                        color: "#ccc",
                        fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)"
                      }}>
                        <strong>User:</strong> {session.user.name || 'Unknown'}
                      </p>
                    )}
                  </div>
                  <div style={{ fontSize: "14px", color: "#999" }}>
                    <p style={{ margin: "0.25rem 0" }}><strong>ID:</strong> {session._id}</p>
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Created:</strong> {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    {session.endTime && (
                      <p style={{ margin: "0.25rem 0" }}>
                        <strong>Completed:</strong> {new Date(session.endTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      });
    }, 100);
  })
);

// Lazy load questions tab
const QuestionsTab = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        default: ({ groupedQuestions, expandedGroups, toggleGroupExpansion }) => (
          <div>
            <h2 style={{ 
              color: "white", 
              marginBottom: "1rem",
              fontFamily: baseStyles.fontFamily,
              fontWeight: "600",
              fontSize: "clamp(1.5rem, 4vw, 2rem)"
            }}>
              Questions by User
            </h2>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              {Object.entries(groupedQuestions).map(([userId, { user, questions }]) => {
                const isExpanded = expandedGroups.has(userId);
                const questionCount = questions.length;
                
                return (
                  <div key={userId} style={{ width: "100%" }}>
                    {/* User Header - Collapsible */}
                    <Card 
                      style={{ 
                        backgroundColor: "#2a2a2a", 
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        marginBottom: isExpanded ? "0.5rem" : "0"
                      }}
                      onClick={() => toggleGroupExpansion(userId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#333";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#2a2a2a";
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.5rem"
                      }}>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <h3 style={{ 
                            margin: "0 0 0.25rem 0", 
                            color: "#007bff",
                            fontSize: "clamp(1.1rem, 3.2vw, 1.3rem)",
                            fontFamily: baseStyles.fontFamily,
                            fontWeight: "600",
                            wordBreak: "break-word"
                          }}>
                            {user.name}
                          </h3>
                          {user.email && (
                            <p style={{ 
                              margin: "0", 
                              color: "#ccc",
                              fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                              wordBreak: "break-word"
                            }}>
                              {user.email}
                            </p>
                          )}
                        </div>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.5rem",
                          flexShrink: "0"
                        }}>
                          <span style={{ 
                            backgroundColor: "#28a745", 
                            padding: "0.25rem 0.5rem", 
                            borderRadius: "12px", 
                            fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                            fontWeight: "500",
                            color: "white"
                          }}>
                            {questionCount} question{questionCount !== 1 ? 's' : ''}
                          </span>
                          <span style={{ 
                            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                            color: "#ccc",
                            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease"
                          }}>
                            ▶
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Questions Grid - Collapsible Content */}
                    {isExpanded && (
                      <div style={{ 
                        display: "grid", 
                        gap: "1rem", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(400px, 100%), 1fr))",
                        paddingLeft: "1rem",
                        borderLeft: "3px solid #007bff",
                        animation: "slideDown 0.3s ease-out"
                      }}>
                        {questions.map((question) => (
                          <Card key={question._id} style={{ backgroundColor: "#1a1a1a", color: "white" }}>
                            <div style={{ marginBottom: "1rem" }}>
                              <h4 style={{ 
                                margin: "0 0 0.5rem 0", 
                                color: "#ffc107",
                                fontSize: "clamp(0.9rem, 2.8vw, 1rem)",
                                fontFamily: baseStyles.fontFamily,
                                fontWeight: "600",
                                lineHeight: "1.4"
                              }}>
                                {question.question || 'No question text'}
                              </h4>
                              {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                                <div style={{ marginTop: "0.5rem" }}>
                                  <p style={{ 
                                    color: "#ccc", 
                                    fontSize: "clamp(0.75rem, 2.2vw, 0.85rem)",
                                    margin: "0 0 0.25rem 0",
                                    fontWeight: "500"
                                  }}>
                                    Follow-up Questions:
                                  </p>
                                  <ul style={{ 
                                    margin: "0", 
                                    paddingLeft: "1rem", 
                                    color: "#aaa",
                                    fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)"
                                  }}>
                                    {question.followUpQuestions.slice(0, 3).map((followUp, index) => (
                                      <li key={index} style={{ marginBottom: "0.25rem" }}>
                                        {followUp}
                                      </li>
                                    ))}
                                    {question.followUpQuestions.length > 3 && (
                                      <li style={{ color: "#666", fontStyle: "italic" }}>
                                        +{question.followUpQuestions.length - 3} more...
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                              {question.session && (
                                <div style={{ 
                                  marginTop: "0.5rem",
                                  padding: "0.5rem",
                                  backgroundColor: "#2a2a2a",
                                  borderRadius: "6px"
                                }}>
                                  <p style={{ 
                                    margin: "0", 
                                    color: "#ccc",
                                    fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)"
                                  }}>
                                    <strong>Session:</strong> {question.session.role || 'Unknown Role'}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)", color: "#999" }}>
                              <p style={{ margin: "0.25rem 0" }}>
                                <strong>Generated:</strong> {new Date(question.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )
      });
    }, 100);
  })
);

// Main Dashboard Component
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [expandedQuestionGroups, setExpandedQuestionGroups] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState("testing");
  const [loadedTabs, setLoadedTabs] = useState(new Set(["analytics"]));

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Test backend connectivity
  const testConnection = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
      
      setConnectionStatus(response.ok ? "connected" : "failed");
      return response.ok;
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("failed");
      return false;
    }
  };

  // Data fetching effect
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      const isConnected = await testConnection();
      if (!isConnected) {
        setError("Cannot connect to backend server. Please check if the server is running.");
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        // Fetch all data in parallel
        const [usersResponse, sessionsResponse, questionsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/auth/users`, { headers }),
          fetch(`${BASE_URL}/api/sessions/all`, { headers }),
          fetch(`${BASE_URL}/api/questions/all`, { headers })
        ]);

        // Process responses
        const [usersData, sessionsData, questionsData] = await Promise.all([
          usersResponse.json(),
          sessionsResponse.json(),
          questionsResponse.json()
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        setQuestions(Array.isArray(questionsData) ? questionsData : []);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Event handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("adminAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const response = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user");
      }
      
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  const toggleUserExpansion = (userId) => {
    const newExpandedUsers = new Set(expandedUsers);
    if (newExpandedUsers.has(userId)) {
      newExpandedUsers.delete(userId);
    } else {
      newExpandedUsers.add(userId);
    }
    setExpandedUsers(newExpandedUsers);
  };

  const toggleQuestionGroupExpansion = (userId) => {
    const newExpandedGroups = new Set(expandedQuestionGroups);
    if (newExpandedGroups.has(userId)) {
      newExpandedGroups.delete(userId);
    } else {
      newExpandedGroups.add(userId);
    }
    setExpandedQuestionGroups(newExpandedGroups);
  };

  // Data processing functions
  const getUsersByMonth = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthCounts = {};
    
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      name: month,
      value: count,
      percentage: ((count / users.length) * 100).toFixed(1)
    }));
  };

  const getSessionsByExperience = () => {
    const experienceCounts = {};
    sessions.forEach(session => {
      const level = session.experience || 'Unknown';
      experienceCounts[level] = (experienceCounts[level] || 0) + 1;
    });

    return Object.entries(experienceCounts).map(([level, count]) => ({
      name: level,
      value: count
    }));
  };

  const getQuestionsOverTime = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthCounts = {};
    
    questions.forEach(question => {
      if (question.createdAt) {
        const date = new Date(question.createdAt);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });

    return Object.entries(monthCounts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, count]) => ({
        name: month,
        questions: count
      }));
  };

  // Group questions by user
  const groupedQuestions = questions.reduce((acc, question) => {
    const userId = question.session?.user?._id || 'unknown';
    const userName = question.session?.user?.name || 'Unknown User';
    const userEmail = question.session?.user?.email || '';
    
    if (!acc[userId]) {
      acc[userId] = {
        user: { name: userName, email: userEmail, _id: userId },
        questions: []
      };
    }
    acc[userId].questions.push(question);
    return acc;
  }, {});

  // Calculate stats
  const getThisMonthCount = (data) => 
    data.filter(item => new Date(item.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length;

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const chartData = getUsersByMonth();
  const sessionData = getSessionsByExperience();
  const questionTimeData = getQuestionsOverTime();

  const tabs = [
    { key: "analytics", label: "Analytics" },
    { key: "users", label: "Users", count: users.length },
    { key: "sessions", label: "Sessions", count: sessions.length },
    { key: "questions", label: "Questions", count: questions.length }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      fontFamily: baseStyles.fontFamily,
      margin: "0",
      padding: "0"
    }}>
      <div style={{ 
        padding: "clamp(1.5rem, 2vw, 1.5rem)", 
        minHeight: "100vh",
        boxSizing: "border-box",
        maxWidth: "100vw",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(0.75rem, 2vw, 1rem)",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <h1 style={{ 
            color: "white", 
            margin: "0",
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            fontWeight: "700",
            fontFamily: baseStyles.fontFamily
          }}>
            Dashboard
          </h1>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <ConnectionStatus status={connectionStatus} url={BASE_URL} />
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setLoadedTabs={setLoadedTabs}
          tabs={tabs}
        />

        {loading ? (
          <div style={{ 
            display: "grid", 
            gap: "1rem", 
            gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))",
            marginBottom: "1.5rem"
          }}>
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <Card style={{ color: "#ff6b6b", textAlign: "center", padding: "2rem" }}>
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        ) : (
          <>
            {/* Tab Content */}
            {activeTab === "analytics" && loadedTabs.has("analytics") && (
              <div>
                <h2 style={{ 
                  color: "white", 
                  marginBottom: "1.5rem",
                  fontFamily: baseStyles.fontFamily,
                  fontWeight: "600",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)"
                }}>
                  Analytics Dashboard
                </h2>
                
                {/* Stats Cards */}
                <div style={{ 
                  display: "grid", 
                  gap: "1rem", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                  marginBottom: "1.5rem"
                }}>
                  <StatsCard 
                    value={users.length}
                    label="Total Users"
                    subtitle={`+${getThisMonthCount(users)} this month`}
                    color="#007bff"
                  />
                  <StatsCard 
                    value={sessions.length}
                    label="Total Sessions"
                    subtitle={`+${getThisMonthCount(sessions)} this month`}
                    color="#28a745"
                  />
                  <StatsCard 
                    value={questions.length}
                    label="Total Questions"
                    subtitle={`+${getThisMonthCount(questions)} this month`}
                    color="#ffc107"
                  />
                  <StatsCard 
                    value={sessions.length > 0 ? (questions.length / sessions.length).toFixed(1) : 0}
                    label="Avg Questions/Session"
                    subtitle="Platform efficiency"
                    color="#dc3545"
                  />
                </div>

                {/* Charts */}
                <div style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))",
                  marginBottom: "1.5rem"
                }}>
                  <ChartCard title="User Registrations by Month" height="clamp(300px, 50vw, 400px)">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percentage }) => `${percentage}%`}
                            outerRadius="80%"
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "#ffffffff",
                              border: "1px solid #555",
                              borderRadius: "8px",
                              color: "white"
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <p style={{ color: "#ccc" }}>No data available</p>
                      </div>
                    )}
                  </ChartCard>

                  <ChartCard title="Sessions by Experience Level">
                    {sessionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <BarChart data={sessionData}>
                          <CartesianGrid/>
                          <XAxis dataKey="name" tick={{}} />
                          <YAxis tick={{}} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "#000000ff",
                              border: "1px solid #555",
                              borderRadius: "8px",
                              color: "white"
                            }}
                          />
                          <Bar dataKey="value" fill="#007bff" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <p style={{ color: "#ccc" }}>No data available</p>
                      </div>
                    )}
                  </ChartCard>
                </div>

                {/* Line Chart */}
                <ChartCard title="Questions Generated Over Time" height="350px">
                  {questionTimeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                      <LineChart data={questionTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" tick={{ fill: 'white' }} />
                        <YAxis tick={{ fill: 'white' }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "#2a2a2a",
                            border: "1px solid #555",
                            borderRadius: "8px",
                            color: "white"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="questions" 
                          stroke="#28a745" 
                          strokeWidth={3}
                          dot={{ fill: "#28a745", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <p style={{ color: "#ccc" }}>No data available</p>
                    </div>
                  )}
                </ChartCard>
              </div>
            )}

            {activeTab === "users" && loadedTabs.has("users") && (
              <Suspense fallback={
                <div style={{ 
                  background: 'transparent',
                  minHeight: '200px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div 
                    className="animate-spin rounded-full h-8 w-8 border-2 border-transparent"
                    style={{
                      borderTopColor: 'rgba(59, 130, 246, 0.2)',
                      borderRightColor: 'rgba(59, 130, 246, 0.1)',
                    }}
                  ></div>
                </div>
              }>
                <UsersTab users={users} handleDeleteUser={handleDeleteUser} />
              </Suspense>
            )}

            {activeTab === "sessions" && loadedTabs.has("sessions") && (
              <Suspense fallback={
                <div style={{ 
                  background: 'transparent',
                  minHeight: '200px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div 
                    className="animate-spin rounded-full h-8 w-8 border-2 border-transparent"
                    style={{
                      borderTopColor: 'rgba(59, 130, 246, 0.2)',
                      borderRightColor: 'rgba(59, 130, 246, 0.1)',
                    }}
                  ></div>
                </div>
              }>
                <SessionsTab sessions={sessions} />
              </Suspense>
            )}

            {activeTab === "questions" && loadedTabs.has("questions") && (
              <Suspense fallback={
                <div style={{ 
                  background: 'transparent',
                  minHeight: '200px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div 
                    className="animate-spin rounded-full h-8 w-8 border-2 border-transparent"
                    style={{
                      borderTopColor: 'rgba(59, 130, 246, 0.2)',
                      borderRightColor: 'rgba(59, 130, 246, 0.1)',
                    }}
                  ></div>
                </div>
              }>
                <QuestionsTab 
                  groupedQuestions={groupedQuestions} 
                  expandedGroups={expandedQuestionGroups}
                  toggleGroupExpansion={toggleQuestionGroupExpansion}
                />
              </Suspense>
            )}

            {/* Other tabs can be added here */}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

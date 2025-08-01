import React, { useEffect, useState, lazy, Suspense } from "react";
import { BASE_URL } from "../utils/apiPaths";

// Import Recharts components directly to avoid lazy loading timing issues
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line 
} from "recharts";

// Loading skeleton component for charts
const ChartSkeleton = ({ height = "300px" }) => (
  <div style={{ 
    width: "100%", 
    height, 
    backgroundColor: "#2a2a2a", 
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 1.5s ease-in-out infinite"
  }}>
    <div style={{ color: "#666", fontSize: "14px" }}>Loading chart...</div>
    <style jsx>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
      }
    `}</style>
  </div>
);

// Card skeleton component
const CardSkeleton = () => (
  <div style={{
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "1.5rem",
    animation: "pulse 1.5s ease-in-out infinite"
  }}>
    <div style={{ 
      height: "20px", 
      backgroundColor: "#333", 
      borderRadius: "4px", 
      marginBottom: "0.5rem" 
    }}></div>
    <div style={{ 
      height: "16px", 
      backgroundColor: "#333", 
      borderRadius: "4px", 
      width: "70%",
      marginBottom: "0.5rem" 
    }}></div>
    <div style={{ 
      height: "14px", 
      backgroundColor: "#333", 
      borderRadius: "4px", 
      width: "50%" 
    }}></div>
  </div>
);

// Lazy load tab components
const UsersTab = lazy(() => Promise.resolve({ 
  default: ({ users, handleDeleteUser }) => (
    <div>
      <h2 style={{ 
        color: "white", 
        marginBottom: "1rem",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: "600",
        fontSize: "clamp(1.5rem, 4vw, 2rem)"
      }}>All Registered Users</h2>
      <div style={{ 
        display: "grid", 
        gap: "1rem", 
        gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))",
        width: "100%"
      }}>
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1.5rem",
              color: "white",
            }}
          >
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
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "600",
                  wordBreak: "break-word"
                }}>{user.name}</h3>
                <p style={{ 
                  margin: "0 0 0.5rem 0", 
                  color: "#ccc",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                  wordBreak: "break-word"
                }}>{user.email}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user._id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "clamp(6px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "500",
                  minWidth: "fit-content",
                  flexShrink: "0",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
              >
                Delete
              </button>
            </div>
            <div style={{ fontSize: "14px", color: "#999" }}>
              <p style={{ margin: "0.25rem 0" }}><strong>ID:</strong> {user._id}</p>
              <p style={{ margin: "0.25rem 0" }}><strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}));

if (!document.querySelector('link[href*="Montserrat"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Login Component
const LoginPage = ({ onLogin }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === "1110") {
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
      fontFamily: "'Montserrat', sans-serif",
      position: "relative",
      paddingTop: "clamp(10vh, 15vh, 20vh)",
      paddingBottom: "2rem",
      boxSizing: "border-box"
    }}>
      {/* Background blur elements for glass effect */}
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
      }}></div>
      
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
      }}></div>

      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
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
          fontFamily: "'Montserrat', sans-serif",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
        }}>Admin Access</h1>
        
        <p style={{
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "2rem",
          fontSize: "clamp(0.9rem, 2.5vw, 1rem)"
        }}>Enter 4-digit access code</p>

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={handleCodeChange}
            placeholder="••••"
            style={{
              width: "100%",
              padding: "1rem",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              color: "white",
              marginBottom: "1rem",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.5rem",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0, 123, 255, 0.5)";
              e.target.style.boxShadow = "0 0 20px rgba(0, 123, 255, 0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.target.style.boxShadow = "none";
            }}
            maxLength="4"
            autoFocus
          />

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
              fontFamily: "'Montserrat', sans-serif",
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
      `}</style>
    </div>
  );
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState("testing");
  const [loadedTabs, setLoadedTabs] = useState(new Set(["analytics"])); // Track which tabs have been loaded

  // Check for existing authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Test backend connectivity
  const testConnection = async () => {
    try {
      console.log("Testing connection to:", BASE_URL);
      
      // Try a simple GET request first
      const response = await fetch(`${BASE_URL}/api/auth/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add no-cors mode as fallback, but prefer cors
        mode: 'cors'
      });
      
      console.log("Connection test response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      setConnectionStatus(response.ok ? "connected" : "failed");
      return response.ok;
    } catch (error) {
      console.error("Connection test failed:", error);
      
      // Try with a different approach if CORS fails
      try {
        console.log("Trying alternative connection test...");
        const img = new Image();
        img.onload = () => setConnectionStatus("partial");
        img.onerror = () => setConnectionStatus("failed");
        img.src = `${BASE_URL}/favicon.ico?t=${Date.now()}`;
        
        setConnectionStatus("failed");
        return false;
      } catch (secondError) {
        console.error("Alternative connection test also failed:", secondError);
        setConnectionStatus("failed");
        return false;
      }
    }
  };

  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      // First test connection
      const isConnected = await testConnection();
      if (!isConnected) {
        setError("Cannot connect to backend server. Please check if the server is running.");
        setLoading(false);
        return;
      }
      
      try {
        // Get auth token from localStorage if available
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // Fetch users
        console.log("Fetching users from:", `${BASE_URL}/api/auth/users`);
        const usersResponse = await fetch(`${BASE_URL}/api/auth/users`, { headers });
        console.log("Users response status:", usersResponse.status);
        
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          throw new Error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}. Response: ${errorText}`);
        }
        const usersData = await usersResponse.json();
        console.log("Users data:", usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);

        // Fetch sessions
        console.log("Fetching sessions from:", `${BASE_URL}/api/sessions/all`);
        const sessionsResponse = await fetch(`${BASE_URL}/api/sessions/all`, { headers });
        console.log("Sessions response status:", sessionsResponse.status);
        
        if (!sessionsResponse.ok) {
          const errorText = await sessionsResponse.text();
          throw new Error(`Failed to fetch sessions: ${sessionsResponse.status} ${sessionsResponse.statusText}. Response: ${errorText}`);
        }
        const sessionsData = await sessionsResponse.json();
        console.log("Sessions data:", sessionsData);
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);

        // Fetch questions
        console.log("Fetching questions from:", `${BASE_URL}/api/questions/all`);
        const questionsResponse = await fetch(`${BASE_URL}/api/questions/all`, { headers });
        console.log("Questions response status:", questionsResponse.status);
        
        if (!questionsResponse.ok) {
          const errorText = await questionsResponse.text();
          throw new Error(`Failed to fetch questions: ${questionsResponse.status} ${questionsResponse.statusText}. Response: ${errorText}`);
        }
        const questionsData = await questionsResponse.json();
        console.log("Questions data:", questionsData);
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("adminAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their sessions and questions.")) {
      return;
    }

    try {
      console.log("Deleting user with ID:", userId);
      
      // Get auth token from localStorage if available
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();
      console.log("Delete response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete user");
      }
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
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

  // Process user data for pie chart (users by month)
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

  // Process sessions data for bar chart
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

  // Process questions data for line chart (questions over time)
  const getQuestionsOverTime = () => {
    const monthCounts = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
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

  const chartData = getUsersByMonth();
  const sessionData = getSessionsByExperience();
  const questionTimeData = getQuestionsOverTime();
  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#000000",
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      transition: "background 0.3s, color 0.3s",
      fontFamily: "'Montserrat', sans-serif",
      margin: "0",
      padding: "0"
    }}>
      <div style={{ 
        padding: "clamp(1.5rem, 2vw, 1.5rem)", 
        width: "100%", 
        minHeight: "100vh",
        boxSizing: "border-box",
        maxWidth: "100vw",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(0.75rem, 2vw, 1rem)",
          flexWrap: "wrap",
          gap: "1rem",
          width: "100%"
        }}>
          <h1 style={{ 
            color: "white", 
            textAlign: "left", 
            margin: "0",
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            fontWeight: "700",
            fontFamily: "'Montserrat', sans-serif"
          }}>Dashboard</h1>

          <button
            onClick={handleLogout}
            style={{
              padding: "clamp(0.35rem, 1.5vw, 0.45rem) clamp(0.7rem, 2.5vw, 0.9rem)",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "500",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            Logout
          </button>
        </div>

        {/* Connection Status Indicator */}
        <div style={{ 
          marginBottom: "clamp(0.6rem, 2vw, 0.8rem)", 
          padding: "clamp(0.4rem, 2vw, 0.6rem) clamp(0.6rem, 2.5vw, 0.8rem)", 
          borderRadius: "clamp(6px, 1.5vw, 10px)", 
          display: "block",
          width: "100%",
          maxWidth: "100%",
          backgroundColor: connectionStatus === "connected" ? "#28a745" : connectionStatus === "failed" ? "#dc3545" : "#ffc107",
          color: "white",
          fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
          fontWeight: "500",
          fontFamily: "'Montserrat', sans-serif",
          boxSizing: "border-box"
        }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "clamp(0.2rem, 0.8vw, 0.4rem)",
            alignItems: "flex-start"
          }}>
            <div style={{
              fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
              fontWeight: "600"
            }}>
              Backend: {connectionStatus === "connected" ? "✓ Connected" : connectionStatus === "failed" ? "✗ Disconnected" : "⏳ Testing..."}
            </div>
            {connectionStatus === "connected" && (
              <div style={{ 
                fontSize: "clamp(0.6rem, 1.6vw, 0.7rem)", 
                opacity: "0.85",
                wordBreak: "break-all",
                lineHeight: "1.3",
                fontWeight: "400",
                color: "rgba(255, 255, 255, 0.9)"
              }}>
                {BASE_URL}
              </div>
            )}
          </div>
        </div>
      
      <div style={{ 
        marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", 
        display: "flex", 
        flexWrap: "nowrap", 
        gap: "clamp(0.3rem, 1.2vw, 0.4rem)",
        justifyContent: "flex-start",
        width: "100%",
        overflowX: "auto",
        scrollbarWidth: "thin",
        WebkitOverflowScrolling: "touch"
      }}>

        <button
          onClick={() => {
            setActiveTab("analytics");
            setLoadedTabs(prev => new Set([...prev, "analytics"]));
          }}
          style={{
            padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)",
            backgroundColor: activeTab === "analytics" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "20px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
            minWidth: "fit-content"
          }}
        >
          Analytics
        </button>
        <button
          onClick={() => {
            setActiveTab("users");
            setLoadedTabs(prev => new Set([...prev, "users"]));
          }}
          style={{
            padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)",
            backgroundColor: activeTab === "users" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "20px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
            minWidth: "fit-content"
          }}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("sessions");
            setLoadedTabs(prev => new Set([...prev, "sessions"]));
          }}
          style={{
            padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)",
            backgroundColor: activeTab === "sessions" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "20px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
            minWidth: "fit-content"
          }}
        >
          Sessions ({sessions.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("questions");
            setLoadedTabs(prev => new Set([...prev, "questions"]));
          }}
          style={{
            padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 2.5vw, 14px)",
            backgroundColor: activeTab === "questions" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "20px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
            minWidth: "fit-content"
          }}
        >
          Questions ({questions.length})
        </button>

      </div>

      {loading ? (
        <div style={{ color: "white", fontFamily: "'Montserrat', sans-serif", padding: "2rem" }}>
          <div style={{ 
            display: "grid", 
            gap: "1rem", 
            gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))",
            marginBottom: "1.5rem"
          }}>
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div style={{ color: "#ff6b6b", fontFamily: "'Montserrat', sans-serif", textAlign: "center", padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Error Loading Dashboard</h3>
          <div style={{ marginBottom: "1rem", backgroundColor: "#1a1a1a", padding: "1rem", borderRadius: "8px", border: "1px solid #333", textAlign: "left" }}>
            <strong>Error Details:</strong>
            <pre style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#ccc", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error}</pre>
          </div>
          <div style={{ marginBottom: "1rem", backgroundColor: "#1a1a1a", padding: "1rem", borderRadius: "8px", border: "1px solid #333", textAlign: "left" }}>
            <strong>Backend URL:</strong> <code style={{ color: "#007bff" }}>{BASE_URL}</code><br/>
            <strong>Expected Endpoints:</strong>
            <ul style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#ccc" }}>
              <li><code>{BASE_URL}/api/auth/users</code></li>
              <li><code>{BASE_URL}/api/sessions/all</code></li>
              <li><code>{BASE_URL}/api/questions/all</code></li>
            </ul>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "1rem" }}>
            Please check the browser console (F12) for more details.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Retry
            </button>
            <button 
              onClick={() => testConnection()} 
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Test Connection
            </button>
            <button 
              onClick={() => window.open(`${BASE_URL}/api/auth/users`, '_blank')} 
              style={{
                backgroundColor: "#6f42c1",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Open API Directly
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Show loading placeholder for tabs that haven't been loaded yet */}
          {(activeTab !== "analytics" && !loadedTabs.has(activeTab)) && (
            <div style={{ 
              display: "grid", 
              gap: "1rem", 
              gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))"
            }}>
              {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {activeTab === "users" && loadedTabs.has("users") && (
            <Suspense fallback={
              <div style={{ 
                display: "grid", 
                gap: "1rem", 
                gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
              }}>
                {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            }>
              <UsersTab users={users} handleDeleteUser={handleDeleteUser} />
            </Suspense>
          )}
          {activeTab === "sessions" && loadedTabs.has("sessions") && (
            <div>
              <h2 style={{ 
                color: "white", 
                marginBottom: "1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "600",
                fontSize: "clamp(1.5rem, 4vw, 2rem)"
              }}>All Sessions</h2>
              <div style={{ 
                display: "grid", 
                gap: "1rem", 
                gridTemplateColumns: "repeat(auto-fill, minmax(min(400px, 100%), 1fr))",
                width: "100%"
              }}>
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      padding: "1.5rem",
                      color: "white",
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      <h3 style={{ margin: "0 0 0.5rem 0", color: "#007bff" }}>{session.role}</h3>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#ccc", fontSize: "14px" }}>
                        <strong>User:</strong> {session.user ? `${session.user.name} (${session.user.email})` : "Unknown User"}
                      </p>
                    </div>
                    <div style={{ marginBottom: "1rem", fontSize: "14px", color: "#999" }}>
                      <p style={{ margin: "0.25rem 0" }}><strong>Session ID:</strong> {session._id}</p>
                      <p style={{ margin: "0.25rem 0" }}><strong>Experience:</strong> {session.experience}</p>
                      <p style={{ margin: "0.25rem 0" }}><strong>Topics to Focus:</strong> {session.topicsToFocus}</p>
                      <p style={{ margin: "0.25rem 0" }}><strong>Number of Questions:</strong> {session.questions ? session.questions.length : 0}</p>
                      <p style={{ margin: "0.25rem 0" }}><strong>Created:</strong> {new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "questions" && loadedTabs.has("questions") && (
            <div>
              <h2 style={{ 
                color: "white", 
                marginBottom: "1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "600",
                fontSize: "clamp(1.5rem, 4vw, 2rem)"
              }}>All Questions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {Object.values(groupedQuestions).map((userGroup) => (
                  <div
                    key={userGroup.user._id}
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => toggleUserExpansion(userGroup.user._id)}
                      style={{
                        padding: "clamp(0.8rem, 3vw, 1rem)",
                        backgroundColor: "#2a2a2a",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: expandedUsers.has(userGroup.user._id) ? "1px solid #333" : "none",
                        flexWrap: "wrap",
                        gap: "0.5rem"
                      }}
                    >
                      <div style={{ flex: "1", minWidth: "0" }}>
                        <h3 style={{ 
                          margin: "0", 
                          color: "#007bff", 
                          fontFamily: "'Montserrat', sans-serif", 
                          fontSize: "clamp(1rem, 3vw, 1.2rem)",
                          fontWeight: "600",
                          wordBreak: "break-word"
                        }}>
                          {userGroup.user.name}
                        </h3>
                        <p style={{ 
                          margin: "0.25rem 0 0 0", 
                          color: "#ccc", 
                          fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                          wordBreak: "break-word"
                        }}>
                          {userGroup.user.email} • {userGroup.questions.length} questions
                        </p>
                      </div>
                      <span style={{ 
                        color: "#ccc", 
                        fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                        flexShrink: "0",
                        minWidth: "24px",
                        textAlign: "center"
                      }}>
                        {expandedUsers.has(userGroup.user._id) ? "−" : "+"}
                      </span>
                    </div>

                    {/* Questions List - Expandable */}
                    {expandedUsers.has(userGroup.user._id) && (
                      <div style={{ padding: "clamp(0.8rem, 3vw, 1rem)" }}>
                        <div style={{ 
                          display: "grid", 
                          gap: "1rem", 
                          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                          width: "100%"
                        }}>
                          {userGroup.questions.map((question) => (
                            <div
                              key={question._id}
                              style={{
                                backgroundColor: "#333",
                                border: "1px solid #444",
                                borderRadius: "8px",
                                padding: "clamp(0.8rem, 3vw, 1rem)",
                                color: "white",
                              }}
                            >
                              <div style={{ marginBottom: "0.75rem" }}>
                                <h4 style={{ 
                                  margin: "0 0 0.5rem 0", 
                                  color: "#007bff", 
                                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                                  fontFamily: "'Montserrat', sans-serif",
                                  fontWeight: "600"
                                }}>
                                  {question.session?.role || "N/A"}
                                </h4>
                                <p style={{ 
                                  margin: "0", 
                                  color: "#ddd", 
                                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                                  lineHeight: "1.4",
                                  wordBreak: "break-word"
                                }}>
                                  {question.question || "N/A"}
                                </p>
                              </div>
                              <div style={{ 
                                fontSize: "clamp(0.7rem, 2vw, 0.8rem)", 
                                color: "#999" 
                              }}>
                                <p style={{ 
                                  margin: "0.25rem 0",
                                  wordBreak: "break-word"
                                }}>
                                  <strong>Note:</strong> {question.note || "-"}
                                </p>
                                <div style={{ 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: "0.5rem"
                                }}>
                                  <span style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
                                    <strong>Pinned:</strong> {question.isPinned ? "Yes" : "No"}
                                  </span>
                                  <span style={{ 
                                    fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                                    flexShrink: "0"
                                  }}>
                                    {new Date(question.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Dashboard */}
          {activeTab === "analytics" && loadedTabs.has("analytics") && (
            <div>
              <h2 style={{ 
                color: "white", 
                marginBottom: "1.5rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "600",
                fontSize: "clamp(1.5rem, 4vw, 2rem)"
              }}>Analytics Dashboard</h2>
              
              {/* Summary Stats Cards Row */}
              <div style={{ 
                display: "grid", 
                gap: "1rem", 
                gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                marginBottom: "1.5rem",
                width: "100%"
              }}>
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <div style={{ 
                    color: "#007bff", 
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    fontWeight: "700",
                    marginBottom: "0.5rem"
                  }}>{users.length}</div>
                  <div style={{ 
                    color: "#ccc", 
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
                    fontWeight: "500" 
                  }}>Total Users</div>
                  <div style={{ 
                    color: "#888", 
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
                    marginTop: "0.5rem" 
                  }}>+{users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month</div>
                </div>
                
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <div style={{ 
                    color: "#28a745", 
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    fontWeight: "700",
                    marginBottom: "0.5rem"
                  }}>{sessions.length}</div>
                  <div style={{ 
                    color: "#ccc", 
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
                    fontWeight: "500" 
                  }}>Total Sessions</div>
                  <div style={{ 
                    color: "#888", 
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
                    marginTop: "0.5rem" 
                  }}>+{sessions.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month</div>
                </div>
                
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <div style={{ 
                    color: "#ffc107", 
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    fontWeight: "700",
                    marginBottom: "0.5rem"
                  }}>{questions.length}</div>
                  <div style={{ 
                    color: "#ccc", 
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
                    fontWeight: "500" 
                  }}>Total Questions</div>
                  <div style={{ 
                    color: "#888", 
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
                    marginTop: "0.5rem" 
                  }}>+{questions.filter(q => new Date(q.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month</div>
                </div>
                
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <div style={{ 
                    color: "#dc3545", 
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    fontWeight: "700",
                    marginBottom: "0.5rem"
                  }}>{sessions.length > 0 ? (questions.length / sessions.length).toFixed(1) : 0}</div>
                  <div style={{ 
                    color: "#ccc", 
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", 
                    fontWeight: "500" 
                  }}>Avg Questions/Session</div>
                  <div style={{ 
                    color: "#888", 
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
                    marginTop: "0.5rem" 
                  }}>Platform efficiency</div>
                </div>
              </div>

              {/* Charts Row */}
              <div style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))",
                marginBottom: "1.5rem",
                width: "100%"
              }}>
                {/* User Registration Pie Chart */}
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <h3 style={{ 
                    color: "white", 
                    marginBottom: "1rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: "500",
                    fontSize: "clamp(1rem, 3vw, 1.3rem)",
                    textAlign: "center"
                  }}>User Registrations by Month</h3>
                  
                  {chartData.length > 0 ? (
                    <div style={{ 
                      width: "100%", 
                      height: "clamp(250px, 40vw, 300px)",
                      minWidth: "250px",
                      minHeight: "250px"
                    }}>
                      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${percentage}%`}
                            outerRadius="80%"
                            fill="#d7c246ff"
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
                            formatter={(value) => [`${value} users`, "Count"]}
                          />
                          <Legend 
                            wrapperStyle={{ color: "white", fontSize: "clamp(10px, 2vw, 12px)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: "clamp(250px, 40vw, 300px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ color: "#ccc", textAlign: "center" }}>No data available</p>
                    </div>
                  )}
                </div>

                {/* Sessions by Experience Level Bar Chart */}
                <div style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
                }}>
                  <h3 style={{ 
                    color: "white", 
                    marginBottom: "1rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: "500",
                    fontSize: "clamp(1rem, 3vw, 1.3rem)",
                    textAlign: "center"
                  }}>Sessions by Experience Level</h3>
                  
                  {sessionData.length > 0 ? (
                    <div style={{ 
                      width: "100%", 
                      height: "clamp(250px, 40vw, 300px)",
                      minWidth: "250px",
                      minHeight: "250px"
                    }}>
                      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <BarChart data={sessionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: 'white', fontSize: 'clamp(8px, 1.5vw, 12px)' }}
                            axisLine={{ stroke: '#555' }}
                          />
                          <YAxis 
                            tick={{ fill: 'white', fontSize: 'clamp(8px, 1.5vw, 12px)' }}
                            axisLine={{ stroke: '#555' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "#2a2a2a",
                              border: "1px solid #555",
                              borderRadius: "8px",
                              color: "white"
                            }}
                          />
                          <Bar dataKey="value" fill="#002145ff" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: "clamp(250px, 40vw, 300px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ color: "#ccc", textAlign: "center" }}>No data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions Over Time Line Chart */}
              <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "2rem",
                background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
              }}>
                <h3 style={{ 
                  color: "white", 
                  marginBottom: "1.5rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "500",
                  fontSize: "1.3rem",
                  textAlign: "center"
                }}>Questions Generated Over Time</h3>
                
                {questionTimeData.length > 0 ? (
                  <div style={{ 
                    width: "100%", 
                    height: "350px",
                    minWidth: "300px",
                    minHeight: "350px"
                  }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                      <LineChart data={questionTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: 'white', fontSize: 12 }}
                          axisLine={{ stroke: '#555' }}
                        />
                        <YAxis 
                          tick={{ fill: 'white', fontSize: 12 }}
                          axisLine={{ stroke: '#555' }}
                        />
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
                  </div>
                ) : (
                  <div style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#ccc", textAlign: "center" }}>No data available</p>
                  </div>
                )}
              </div>

              {/* Recent Activity Panel */}
              <div style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "clamp(1rem, 3vw, 2rem)",
                background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
              }}>
                <h3 style={{ 
                  color: "white", 
                  marginBottom: "1.5rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "500",
                  fontSize: "clamp(1rem, 3vw, 1.3rem)"
                }}>Recent Activity</h3>
                
                <div style={{ 
                  display: "grid", 
                  gap: "1rem", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))"
                }}>
                  {/* Recent Users */}
                  <div>
                    <h4 style={{ 
                      color: "#007bff", 
                      marginBottom: "1rem", 
                      fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: "600"
                    }}>Latest Users</h4>
                    <div style={{ 
                      maxHeight: "clamp(200px, 40vh, 300px)", 
                      overflowY: "auto" 
                    }}>
                      {users.slice(-10).reverse().map(user => (
                        <div key={user._id} style={{ 
                          padding: "clamp(0.4rem, 2vw, 0.5rem)", 
                          marginBottom: "0.5rem", 
                          backgroundColor: "#333", 
                          borderRadius: "6px",
                          fontSize: "clamp(0.8rem, 2vw, 0.9rem)"
                        }}>
                          <div style={{ 
                            color: "white", 
                            fontWeight: "500",
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            wordBreak: "break-word"
                          }}>{user.name}</div>
                          <div style={{ 
                            color: "#ccc", 
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" 
                          }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Sessions */}
                  <div>
                    <h4 style={{ 
                      color: "#28a745", 
                      marginBottom: "1rem", 
                      fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: "600"
                    }}>Latest Sessions</h4>
                    <div style={{ 
                      maxHeight: "clamp(200px, 40vh, 300px)", 
                      overflowY: "auto" 
                    }}>
                      {sessions.slice(-10).reverse().map(session => (
                        <div key={session._id} style={{ 
                          padding: "clamp(0.4rem, 2vw, 0.5rem)", 
                          marginBottom: "0.5rem", 
                          backgroundColor: "#333", 
                          borderRadius: "6px",
                          fontSize: "clamp(0.8rem, 2vw, 0.9rem)"
                        }}>
                          <div style={{ 
                            color: "white", 
                            fontWeight: "500",
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            wordBreak: "break-word"
                          }}>{session.role}</div>
                          <div style={{ 
                            color: "#ccc", 
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                            wordBreak: "break-word"
                          }}>{session.user?.name || 'Unknown'}</div>
                          <div style={{ 
                            color: "#888", 
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" 
                          }}>{new Date(session.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Questions */}
                  <div>
                    <h4 style={{ 
                      color: "#ffc107", 
                      marginBottom: "1rem", 
                      fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: "600"
                    }}>Latest Questions</h4>
                    <div style={{ 
                      maxHeight: "clamp(200px, 40vh, 300px)", 
                      overflowY: "auto" 
                    }}>
                      {questions.slice(-10).reverse().map(question => (
                        <div key={question._id} style={{ 
                          padding: "clamp(0.4rem, 2vw, 0.5rem)", 
                          marginBottom: "0.5rem", 
                          backgroundColor: "#333", 
                          borderRadius: "6px",
                          fontSize: "clamp(0.8rem, 2vw, 0.9rem)"
                        }}>
                          <div style={{ 
                            color: "white", 
                            fontWeight: "500", 
                            marginBottom: "0.25rem",
                            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                            wordBreak: "break-word",
                            lineHeight: "1.3"
                          }}>
                            {question.question?.substring(0, 50)}...
                          </div>
                          <div style={{ 
                            color: "#ccc", 
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
                            wordBreak: "break-word"
                          }}>{question.session?.user?.name || 'Unknown'}</div>
                          <div style={{ 
                            color: "#888", 
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" 
                          }}>{new Date(question.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      </div>
      <style>{`
        /* Custom scrollbar styling for tab navigation */
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
        
        /* Firefox scrollbar styling */
        div[style*="overflowX: auto"] {
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

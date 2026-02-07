
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/apiPaths.js";
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
import { Card, StatsCard, ChartCard, Button, SkeletonLoader, CardSkeleton, ConnectionStatus, TabNavigation, baseStyles } from "./Components/AdminUI.jsx";
import UsersTab from "./Components/UsersTab.jsx";
import SessionsTab from "./Components/SessionsTab.jsx";
import BroadcastTab from "./Components/BroadcastTab.jsx";
import AdminSidebar from "./Components/AdminSidebar.jsx";

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE;
// Premium Solid Colors (No Gradients)
const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];

// Utility function to load Google Fonts
const loadGoogleFonts = () => {
  if (!document.querySelector('link[href*="Montserrat"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Anta&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};
loadGoogleFonts();

import { toast } from "react-hot-toast";

const LoginPage = ({ onLogin }) => {
  const [code, setCode] = useState("");
  const [isWarping, setIsWarping] = useState(false);
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: -9999, y: -9999 });

  // Handle Input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      // Trigger Warp Animation
      setIsWarping(true);
      setTimeout(() => {
        onLogin();
      }, 1500); // Wait for animation
    } else {
      toast.error("ACCESS DENIED");
      setCode("");
    }
  };

  // Canvas Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Configuration
    const GRID_SPACING = 30; // Distance between dots
    const DOT_SIZE = 1.5;
    const MOUSE_RADIUS = 150;
    const RETURN_SPEED = 0.05; // How fast dots return to origin
    const WARP_SPEED_MULTIPLIER = 0.2; // Acceleration during warp

    // Resize Handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize Grid Particles
    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(canvas.width / GRID_SPACING);
      const rows = Math.ceil(canvas.height / GRID_SPACING);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * GRID_SPACING,
            y: j * GRID_SPACING,
            originX: i * GRID_SPACING,
            originY: j * GRID_SPACING,
            vx: 0,
            vy: 0,
            size: DOT_SIZE,
            color: 'rgba(50, 50, 50, 0.3)' // Initial dim color
          });
        }
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & Draw Particles
      particles.forEach(p => {
        let dx = mouseRef.current.x - p.x;
        let dy = mouseRef.current.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Interaction Logic
        if (isWarping) {
          // WARP MODE: All dots suck into center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          let dxWarp = centerX - p.x;
          let dyWarp = centerY - p.y;
          p.x += dxWarp * WARP_SPEED_MULTIPLIER;
          p.y += dyWarp * WARP_SPEED_MULTIPLIER;
          p.color = `rgba(255, 255, 255, ${Math.random()})`; // Flicker white
        } else {
          // NORMAL MODE: Mouse Repulsion/Attraction
          if (distance < MOUSE_RADIUS) {
            const angle = Math.atan2(dy, dx);
            const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            const pushX = Math.cos(angle) * force * 5; // Push strength
            const pushY = Math.sin(angle) * force * 5;

            // Move dot away from mouse
            p.vx -= pushX;
            p.vy -= pushY;

            // Highlight near mouse
            p.color = `rgba(255, 255, 255, ${force + 0.2})`;
          } else {
            p.color = 'rgba(60, 60, 60, 0.4)'; // Reset to subtle grey
          }

          // Physics: Spring back to origin
          p.vx += (p.originX - p.x) * RETURN_SPEED;
          p.vy += (p.originY - p.y) * RETURN_SPEED;

          // Dampening (Friction)
          p.vx *= 0.90;
          p.vy *= 0.90;

          p.x += p.vx;
          p.y += p.vy;
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse Listeners
    const handleMouseMove = (e) => {
      if (!isWarping) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave); // Reset on exit

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarping]);

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "#000",
      fontFamily: "'Montserrat', sans-serif" // Ensure premium font
    }}>
      {/* 1. Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      {/* 2. Login Container (Centered) */}
      <div style={{
        position: "relative",
        zIndex: 10,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: isWarping ? 0 : 1, // Fade out on success
        transition: "opacity 0.8s ease-out",
        pointerEvents: isWarping ? "none" : "auto"
      }}>

        {/* Glass Card */}
        <div style={{
          background: "rgba(0, 0, 0, 1)", // Very dark glass
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "2rem 3rem",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)", // Deep shadow
          textAlign: "center",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
          maxWidth: "400px",
          width: "90%"
        }}>

          {/* Logo */}
          {/* Logo */}
          <div style={{ marginBottom: "1.5rem" }}>
            <img
              src="/Logo.svg"
              alt="MockMate Logo"
              style={{
                width: "80px",
                height: "auto",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "0.25rem",
            }}>
              System Access
            </h1>
            <p style={{ color: "#666", fontSize: "0.9rem", fontWeight: 500 }}>
              SECURE ENVIRONMENT
            </p>
          </div>

          {/* Input Field (Hidden visually, functionality preserved for mobile keyboard) */}
          {/* We use a custom visualizer for the code */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                border: code[idx]
                  ? "1px solid rgba(255, 255, 255, 0.23)"  // Filled state
                  : "1px solid rgba(255, 255, 255, 0.1)", // Empty state
                backgroundColor: code[idx]
                  ? "rgba(255, 255, 255, 0.04)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                color: "#fff",
                transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}>
                {code[idx] ? "•" : ""}
              </div>
            ))}
          </div>

          {/* Hidden Input to Capture Keystrokes */}
          <input
            type="tel" // Use tel for numeric keypad on mobile
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setCode(val);
            }}
            style={{
              position: "absolute",
              opacity: 0,
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              cursor: "default"
            }}
          />

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={code.length !== 4}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: code.length === 4
                ? "#fff"
                : "rgba(255,255,255,0.05)",
              color: code.length === 4 ? "#000" : "rgba(255,255,255,0.3)",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: code.length === 4 ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              transform: code.length === 4 ? "scale(1)" : "scale(0.98)"
            }}
          >
            {isWarping ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>

        </div>

      </div>
    </div >
  );
};



// Main Dashboard Component
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(null); // New state for advanced analytics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  // Removed expandedQuestionGroups state as QuestionsTab is removed
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
        const [usersResponse, sessionsResponse, questionsResponse, analyticsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/auth/users`, { headers }),
          fetch(`${BASE_URL}/api/sessions/all`, { headers }),
          fetch(`${BASE_URL}/api/questions/all`, { headers }),
          fetch(`${BASE_URL}/api/admin/analytics`, { headers }) // Fetch new analytics
        ]);

        // Process responses
        const [usersData, sessionsData, questionsData, analyticsData] = await Promise.all([
          usersResponse.json(),
          sessionsResponse.json(),
          questionsResponse.json(),
          analyticsResponse.json()
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
        setAdvancedAnalytics(analyticsData);

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

  const handleBanUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/ban`, {
        method: "POST",
        headers,
      });

      if (!response.ok) throw new Error("Failed to update ban status");

      const data = await response.json();

      setUsers(users.map(user =>
        user._id === userId ? { ...user, isBanned: data.isBanned } : user
      ));
    } catch (error) {
      alert("Failed to ban/unban user: " + error.message);
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
    data.filter(item => new Date(item.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

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
    { key: "broadcast", label: "Broadcast" }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      fontFamily: baseStyles.fontFamily,
      display: "flex"
    }}>
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setLoadedTabs(prev => new Set([...prev, tab]));
      }} onLogout={handleLogout} connectionStatus={connectionStatus} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: "80px", // Collapsed Sidebar width
        padding: "clamp(2rem, 3vw, 3rem)", // More padding for professional feel
        minHeight: "100vh",
        boxSizing: "border-box",
        maxWidth: "calc(100vw - 80px)",
        overflow: "hidden",
        backgroundColor: "#000000" // Ensure background is solid black
      }}>
        {/* Connection Status removed from here as it is now in Sidebar */}

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

                {advancedAnalytics && advancedAnalytics.popularTopics && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "white", marginBottom: "1rem", fontFamily: baseStyles.fontFamily }}>Popular Topics</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {advancedAnalytics.popularTopics.map((topic, index) => (
                        <span key={index} style={{
                          backgroundColor: "#222",
                          color: "#fff",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          border: "1px solid #333"
                        }}>
                          {topic._id} <span style={{ color: "#888", marginLeft: "0.5rem" }}>({topic.count})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
                              backgroundColor: "#000",
                              border: "1px solid #333",
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
                          <CartesianGrid />
                          <XAxis dataKey="name" tick={{}} />
                          <YAxis tick={{}} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#000",
                              border: "1px solid #333",
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
                            backgroundColor: "#000",
                            border: "1px solid #333",
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
              <UsersTab
                users={users}
                handleDeleteUser={handleDeleteUser}
                handleBanUser={handleBanUser}
                sessions={sessions}
                questions={questions}
              />
            )}

            {activeTab === "sessions" && loadedTabs.has("sessions") && (
              <SessionsTab sessions={sessions} />
            )}

            {activeTab === "broadcast" && (
              <BroadcastTab />
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

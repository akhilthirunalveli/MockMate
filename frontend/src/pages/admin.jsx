import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

if (!document.querySelector('link[href*="Montserrat"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  useEffect(() => {

    fetch("/api/auth/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load users."));

    fetch("/api/sessions/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sessions");
        return res.json();
      })
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load sessions."));

    fetch("/api/questions/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load questions."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their sessions and questions.")) {
      return;
    }

    try {
      console.log("Deleting user with ID:", userId);
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000000",
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      padding: "0 4vw",
      transition: "background 0.3s, color 0.3s",
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{ 
        position: "fixed",
        top: "0",
        padding: "3rem 3rem", 
        width: "100%", 
        height: "100%",
        overflowY: "auto",
        zIndex: 1000,
        maxWidth: "100vw"
      }}>
        <h1 style={{ 
          color: "white", 
          textAlign: "left", 
          marginBottom: "1.5rem",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: "700",
          fontFamily: "'Montserrat', sans-serif"
        }}>Dashboard</h1>
      
      <div style={{ 
        marginBottom: "1.5rem", 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "0.5rem",
        justifyContent: "flex-start"
      }}>

        <button
          onClick={() => setActiveTab("analytics")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "analytics" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            minWidth: "fit-content"
          }}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "users" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            minWidth: "fit-content"
          }}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "sessions" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            minWidth: "fit-content"
          }}
        >
          Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "questions" ? "#000000ff" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            minWidth: "fit-content"
          }}
        >
          Questions ({questions.length})
        </button>

      </div>

      {loading ? (
        <p style={{ color: "white", fontFamily: "'Montserrat', sans-serif" }}>Loading...</p>
      ) : error ? (
        <p style={{ color: "#ff6b6b", fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
      ) : (
        <>
          {activeTab === "users" && (
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
          )}
          {activeTab === "sessions" && (
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
          {activeTab === "questions" && (
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
          {activeTab === "analytics" && (
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
                    <div style={{ width: "100%", height: "clamp(250px, 40vw, 300px)" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${percentage}%`}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "#2a2a2a",
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
                    <div style={{ width: "100%", height: "clamp(250px, 40vw, 300px)" }}>
                      <ResponsiveContainer width="100%" height="100%">
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
                          <Bar dataKey="value" fill="#007bff" />
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
                  <div style={{ width: "100%", height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
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
                      maxHeight: "clamp(150px, 30vh, 200px)", 
                      overflowY: "auto" 
                    }}>
                      {users.slice(-5).reverse().map(user => (
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
                      maxHeight: "clamp(150px, 30vh, 200px)", 
                      overflowY: "auto" 
                    }}>
                      {sessions.slice(-5).reverse().map(session => (
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
                      maxHeight: "clamp(150px, 30vh, 200px)", 
                      overflowY: "auto" 
                    }}>
                      {questions.slice(-5).reverse().map(question => (
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
    </div>
  );
};

export default AdminDashboard;

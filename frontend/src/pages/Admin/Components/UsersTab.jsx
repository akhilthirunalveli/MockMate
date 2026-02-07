import React from "react";
import { Card, baseStyles } from "./AdminUI";
import { BsTrash, BsSlashCircle, BsCheckCircle, BsEye } from "react-icons/bs";

const UsersTab = ({ users, handleDeleteUser, handleBanUser, sessions = [], questions = [] }) => {
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Filter data for selected user
  const userSessions = selectedUser ? sessions.filter(s => s.user?._id === selectedUser._id) : [];
  const userQuestions = selectedUser ? questions.filter(q => q.session?.user?._id === selectedUser._id) : [];

  return (
    <>
      <div>
        <h2 style={{
          color: "#fff",
          marginBottom: "2rem",
          fontFamily: baseStyles.fontFamily,
          fontWeight: 500,
          fontSize: "1.75rem",
          letterSpacing: "-0.5px",
          borderBottom: "1px solid #222",
          paddingBottom: "1rem"
        }}>
          Users Directory <span style={{ color: "#444", marginLeft: "0.5rem", fontSize: "1rem" }}>{users.length} total</span>
        </h2>
        <div style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
        }}>
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                backgroundColor: "#050505",
                border: "1px solid #222",
                borderRadius: "12px",
                padding: "1.5rem",
                transition: "border-color 0.2s ease",
                position: "relative",
                cursor: "default"
              }}

            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem"
              }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <h3 style={{
                      margin: 0,
                      color: user.isBanned ? "#666" : "#fff",
                      textDecoration: user.isBanned ? "line-through" : "none",
                      fontSize: "1.1rem",
                      fontFamily: baseStyles.fontFamily,
                      fontWeight: 600,
                      letterSpacing: "-0.3px"
                    }}>
                      {user.name}
                    </h3>
                    {user.isBanned && (
                      <span style={{
                        fontSize: "0.7rem",
                        backgroundColor: "#220a0a",
                        color: "#ff4444",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}>BANNED</span>
                    )}
                  </div>
                  <p style={{
                    margin: 0,
                    color: "#666",
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                    lineHeight: "1.4"
                  }}>
                    {user.email}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    title="View Details"
                    style={{
                      backgroundColor: "transparent",
                      color: "#fff",
                      border: "1px solid #333",
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#000";
                      e.currentTarget.style.borderColor = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "#333";
                    }}
                  >
                    <BsEye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    title="Delete User"
                    style={{
                      backgroundColor: "transparent",
                      color: "#666",
                      border: "1px solid #333",
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#220a0a"; // Subtle dangerous background
                      e.currentTarget.style.color = "#ff4444";
                      e.currentTarget.style.borderColor = "#ff4444";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#666";
                      e.currentTarget.style.borderColor = "#333";
                    }}
                  >
                    <BsTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleBanUser(user._id)}
                    title={user.isBanned ? "Unban User" : "Ban User"}
                    style={{
                      backgroundColor: "transparent",
                      color: user.isBanned ? "#28a745" : "#666",
                      border: `1px solid ${user.isBanned ? "#28a745" : "#333"}`,
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = user.isBanned ? "#28a745" : "#220a0a";
                      e.currentTarget.style.color = user.isBanned ? "#fff" : "#ff4444";
                      e.currentTarget.style.borderColor = user.isBanned ? "#28a745" : "#ff4444";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = user.isBanned ? "#28a745" : "#666";
                      e.currentTarget.style.borderColor = user.isBanned ? "#28a745" : "#333";
                    }}
                  >
                    {user.isBanned ? <BsCheckCircle size={16} /> : <BsSlashCircle size={16} />}
                  </button>
                </div>
              </div>

              <div style={{
                fontSize: "0.8rem",
                color: "#444",
                borderTop: "1px solid #1a1a1a",
                paddingTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "monospace"
              }}>
                <span style={{
                  color: "#555",
                  letterSpacing: "0.5px"
                }}>
                  ID: {user._id.slice(-6).toUpperCase()}
                </span>
                <span style={{ color: "#555" }}>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal - Clean & Minimal */}
      {selectedUser && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.9)", // Darker overlay for focus
          backdropFilter: "blur(2px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem"
        }} onClick={() => setSelectedUser(null)}>
          <div style={{
            backgroundColor: "#050505",
            border: "1px solid #333",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "700px", // Slightly narrower for better reading
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "2.5rem",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8)" // Very soft, deep shadow only for modal
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
              <div>
                <h2 style={{ margin: 0, color: "#fff", fontFamily: baseStyles.fontFamily, fontWeight: 600, fontSize: "1.8rem" }}>{selectedUser.name}</h2>
                <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: "none", border: "1px solid #333", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#fff"; }}
              >✕</button>
            </div>

            <div style={{ display: "grid", gap: "3rem" }}>
              {/* Sessions Section */}
              <div>
                <h3 style={{ color: "#fff", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.5rem" }}>
                  Session History <span style={{ color: "#444", fontSize: "0.8rem", marginLeft: "0.5rem" }}>{userSessions.length}</span>
                </h3>
                {userSessions.length > 0 ? (
                  <div style={{ display: "grid", gap: "0" }}>
                    {userSessions.slice(0, 5).map((session, idx) => (
                      <div key={session._id} style={{
                        padding: "1rem 0",
                        borderBottom: idx !== userSessions.slice(0, 5).length - 1 ? "1px solid #1a1a1a" : "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <div style={{ color: "#ddd", fontWeight: 500, marginBottom: "0.25rem" }}>{session.role || "Untitled Session"}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {new Date(session.createdAt).toLocaleDateString()} • {session.difficulty}
                          </div>
                        </div>
                        <div style={{
                          fontSize: "0.75rem",
                          color: session.endTime ? "#444" : "#888",
                          border: `1px solid ${session.endTime ? "#222" : "#333"}`,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          backgroundColor: session.endTime ? "transparent" : "#111"
                        }}>
                          {session.endTime ? "Done" : "Active"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#444", fontStyle: "italic" }}>No activity recorded.</p>
                )}
              </div>

              {/* Questions Section */}
              <div>
                <h3 style={{ color: "#fff", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.5rem" }}>
                  Question Log <span style={{ color: "#444", fontSize: "0.8rem", marginLeft: "0.5rem" }}>{userQuestions.length}</span>
                </h3>
                {userQuestions.length > 0 ? (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {userQuestions.slice(0, 5).map(q => (
                      <div key={q._id} style={{
                        padding: "1rem",
                        backgroundColor: "#0a0a0a",
                        borderRadius: "8px",
                        border: "1px solid #1a1a1a"
                      }}>
                        <p style={{ margin: 0, color: "#ccc", lineHeight: "1.5", fontSize: "0.95rem" }}>"{q.question}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#444", fontStyle: "italic" }}>No questions logged.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTab;

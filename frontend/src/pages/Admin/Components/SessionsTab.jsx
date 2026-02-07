import React, { useState } from "react";
import { Card, baseStyles } from "./AdminUI";

const SessionsTab = ({ sessions = [] }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

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
          All Sessions <span style={{ color: "#444", marginLeft: "0.5rem", fontSize: "1rem" }}>{sessions.length} total</span>
        </h2>

        {sessions.length === 0 ? (
          <div style={{ color: "#444", fontStyle: "italic", padding: "2rem", border: "1px dashed #222", borderRadius: "12px" }}>
            No sessions found.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
          }}>
            {sessions.map((session) => (
              <div
                key={session._id}
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
                  marginBottom: "1rem"
                }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}>
                    <h3 style={{
                      margin: 0,
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontFamily: baseStyles.fontFamily,
                      fontWeight: 600,
                      letterSpacing: "-0.3px"
                    }}>
                      {session.role || 'Untitled Session'}
                    </h3>
                    {session.user && (
                      <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem" }}>
                        {session.user.name}
                      </p>
                    )}
                  </div>

                  <div style={{
                    fontSize: "0.75rem",
                    color: session.endTime ? "#444" : "#ffc107",
                    border: `1px solid ${session.endTime ? "#222" : "#ffc10740"}`,
                    padding: "4px 10px",
                    borderRadius: "100px",
                    backgroundColor: session.endTime ? "transparent" : "#ffc10710",
                    whiteSpace: "nowrap"
                  }}>
                    {session.endTime ? "Completed" : "In Progress"}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                  {session.difficulty && (
                    <span style={{ fontSize: "0.75rem", color: "#666", border: "1px solid #222", padding: "2px 8px", borderRadius: "4px", background: "#0a0a0a" }}>
                      {session.difficulty}
                    </span>
                  )}
                  {session.experience && (
                    <span style={{ fontSize: "0.75rem", color: "#666", border: "1px solid #222", padding: "2px 8px", borderRadius: "4px", background: "#0a0a0a" }}>
                      {session.experience} Exp
                    </span>
                  )}
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
                  <span style={{ letterSpacing: "0.5px", color: "#555" }}>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleExpand(session._id)}
                    style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "0.8rem", padding: 0, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#888"}
                    onMouseLeave={e => e.target.style.color = "#444"}
                  >
                    {expanded[session._id] ? "Less" : "Details"}
                  </button>
                </div>

                {expanded[session._id] && (
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed #222", color: "#666", fontSize: "0.85rem", lineHeight: "1.5" }}>
                    <div style={{ marginBottom: "0.5rem" }}><strong>ID:</strong> {session._id}</div>
                    {session.summary ? (
                      <div><strong>Summary:</strong> {session.summary}</div>
                    ) : (
                      <div style={{ fontStyle: "italic", color: "#444" }}>No summary available.</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SessionsTab;

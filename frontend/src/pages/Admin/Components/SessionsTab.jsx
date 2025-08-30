import React from "react";
import { Card, baseStyles } from "./AdminUI";

import { useState } from "react";

const iconStyle = {
  display: "inline-block",
  width: "1.2em",
  textAlign: "center",
  marginRight: "0.4em"
};

const SessionsTab = ({ sessions }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const getStatus = (session) => {
    if (session.endTime) return "Completed";
    return "Ongoing";
  };

  return (
    <div>
      <h2 style={{
        color: "#fff",
        marginBottom: "1.5rem",
        fontFamily: baseStyles.fontFamily,
        fontWeight: 600,
        fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
        letterSpacing: "-1px",
        borderBottom: "2px solid #222",
        paddingBottom: "0.5rem"
      }}>
        All Interview Sessions
      </h2>
      <div style={{
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
      }}>
        {sessions.map((session) => {
          const status = getStatus(session);
          return (
            <Card
              key={session._id}
              style={{
                backgroundColor: "#111",
                color: "#fff",
                border: "1.5px solid #333",
                boxShadow: "0 2px 12px 0 #0006",
                transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer"
              }}
              onClick={() => toggleExpand(session._id)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#181818";
                e.currentTarget.style.border = "1.5px solid #555";
                e.currentTarget.style.boxShadow = "0 4px 18px 0 #000a";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#111";
                e.currentTarget.style.border = "1.5px solid #333";
                e.currentTarget.style.boxShadow = "0 2px 12px 0 #0006";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7em" }}>
                  <span style={{ fontWeight: 600, fontSize: "clamp(1.1rem, 3vw, 1.3rem)", color: "#fff" }}>{session.role || 'Unknown Role'}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7em" }}>
                  <span style={{ color: status === "Completed" ? "#fff" : "#bbb", fontWeight: 500 }}>{status}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.7em", marginBottom: "0.7rem", flexWrap: "wrap" }}>
                <span style={{
                  background: "#222",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "0.22rem 0.7rem",
                  fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center"
                }}>
                  Experience: {session.experience || 'Unknown'}
                </span>
                <span style={{
                  background: "#222",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "0.22rem 0.7rem",
                  fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center"
                }}>
                  Difficulty: {session.difficulty || 'Unknown'}
                </span>
              </div>
              {session.user && (
                <div style={{ marginBottom: "0.7rem", color: "#bbb", fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
                  <strong>User:</strong> {session.user.name || 'Unknown'}
                </div>
              )}
              {/* Timeline/progress bar */}
              <div style={{ width: "100%", height: 6, background: "#222", borderRadius: 4, margin: "0.7rem 0 1rem 0", overflow: "hidden" }}>
                <div style={{
                  width: status === "Completed" ? "100%" : "60%",
                  height: "100%",
                  background: status === "Completed" ? "#fff" : "linear-gradient(90deg, #fff 60%, #444 100%)",
                  transition: "width 0.5s"
                }} />
              </div>
              {/* Expandable details */}
              {expanded[session._id] && (
                <div style={{ fontSize: "13px", color: "#888", borderTop: "1px solid #222", paddingTop: "0.7rem" }}>
                  <p style={{ margin: "0.25rem 0" }}><strong>ID:</strong> {session._id}</p>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Created:</strong> {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  {session.endTime && (
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Completed:</strong> {new Date(session.endTime).toLocaleDateString()}
                    </p>
                  )}
                  {session.summary && (
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Summary:</strong> {session.summary}
                    </p>
                  )}
                </div>
              )}
              <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.9em", color: "#bbb", cursor: "pointer", textDecoration: "underline dotted" }}>
                  {expanded[session._id] ? "Hide details ▲" : "Show details ▼"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SessionsTab;

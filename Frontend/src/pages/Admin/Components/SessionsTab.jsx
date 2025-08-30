import React from "react";
import { Card, baseStyles } from "./AdminUI";

const SessionsTab = ({ sessions }) => (
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
);

export default SessionsTab;

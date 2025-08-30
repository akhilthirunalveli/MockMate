import React from "react";
import { Card, baseStyles, Button } from "./AdminUI";

const UsersTab = ({ users, handleDeleteUser }) => (
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
);

export default UsersTab;

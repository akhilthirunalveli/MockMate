import React from "react";
import { Card, baseStyles, Button } from "./AdminUI";


const UsersTab = ({ users, handleDeleteUser }) => (
  <div>
    <h2 style={{
      color: "#fff",
      marginBottom: "1.5rem",
      fontFamily: baseStyles.fontFamily,
      fontWeight: 600,
      fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
      letterSpacing: "-1px",
    }}>
      All Registered Users
    </h2>
    <div style={{
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(350px, 100%), 1fr))"
    }}>
      {users.map((user) => (
        <Card
          key={user._id}
          style={{
            backgroundColor: "#111",
            color: "#fff",
            border: "1.5px solid #333",
            boxShadow: "0 2px 12px 0 #0006",
            transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
            position: "relative",
            overflow: "hidden"
          }}
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
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.2rem",
            flexWrap: "wrap",
            gap: "1.2rem"
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                margin: "0 0 0.4rem 0",
                color: "#fff",
                fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                fontFamily: baseStyles.fontFamily,
                fontWeight: 600,
                wordBreak: "break-word",
                letterSpacing: "-0.5px"
              }}>
                {user.name}
              </h3>
              <p style={{
                margin: 0,
                color: "#bbb",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                wordBreak: "break-word",
                fontWeight: 400
              }}>
                {user.email}
              </p>
            </div>
            <Button
              variant="bw"
              onClick={() => handleDeleteUser(user._id)}
              style={{
                padding: "clamp(6px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                minWidth: "fit-content",
                flexShrink: 0,
                backgroundColor: "#fff",
                color: "#111",
                border: "1.5px solid #222",
                fontWeight: 600,
                boxShadow: "0 1px 4px #0002"
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = "#222";
                e.target.style.color = "#fff";
                e.target.style.border = "1.5px solid #fff";
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = "#111";
                e.target.style.border = "1.5px solid #222";
              }}
            >
              Delete
            </Button>
          </div>
          <div style={{ fontSize: "13px", color: "#888", borderTop: "1px solid #222", paddingTop: "0.7rem" }}>
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

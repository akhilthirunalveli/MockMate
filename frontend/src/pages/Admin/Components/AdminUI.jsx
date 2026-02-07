// Reusable UI components for Admin Dashboard
import React from "react";

export const baseStyles = {
  fontFamily: "'Montserrat', sans-serif",
  cardBase: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "16px",
    padding: "clamp(1.5rem, 3vw, 2rem)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  glassMorphism: {
    background: "#0a0a0a",
    border: "1px solid #3333331c",
    borderRadius: "20px",
  }
};

export const Card = ({ children, style = {}, ...props }) => (
  <div style={{ ...baseStyles.cardBase, ...style }} {...props}>
    {children}
  </div>
);

export const StatsCard = ({ value, label, subtitle, color }) => (
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

export const ChartCard = ({ title, children, height = "clamp(250px, 40vw, 300px)" }) => (
  <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <h3 style={{
      color: "white",
      marginBottom: "1rem",
      fontFamily: baseStyles.fontFamily,
      fontWeight: "500",
      fontSize: "clamp(1rem, 3vw, 1.3rem)",
      textAlign: "center",
      flexShrink: 0
    }}>
      {title}
    </h3>
    <div style={{ width: "100%", flex: 1, minHeight: "250px", height: "100%" }}>
      {children}
    </div>
  </Card>
);

export const Button = ({
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
    tab: { backgroundColor: "#000000ff", hoverColor: "#000000ff", border: "1px solid #555" }
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

export const SkeletonLoader = ({ height = "clamp(250px, 40vw, 300px)" }) => (
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

export const CardSkeleton = () => (
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

export const ConnectionStatus = ({ status, url, collapsed }) => {
  const statusConfig = {
    connected: { color: "#28a745", icon: "✓", text: "Connected" },
    failed: { color: "#dc3545", icon: "✗", text: "Disconnected" },
    testing: { color: "#ffc107", icon: "⏳", text: "Testing..." }
  };
  const config = statusConfig[status] || statusConfig.testing;

  if (collapsed) {
    return (
      <div
        title={`Backend: ${config.text}`}
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: config.color,
          margin: "0 auto"
        }}
      />
    );
  }

  return (
    <div style={{
      width: "100%", // Full width
      padding: "0.9rem", // Match button padding
      borderRadius: "12px",
      backgroundColor: "#111",
      color: "white",
      fontSize: "0.85rem",
      fontWeight: "500",
      fontFamily: baseStyles.fontFamily,
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: config.color,
        flexShrink: 0
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ fontWeight: "600", color: config.color }}>
          {config.text}
        </div>
        {status === "connected" && url && (
          <div style={{
            fontSize: "0.7rem",
            color: "#666",
            wordBreak: "break-all"
          }}>
            {url.replace(/^https?:\/\//, '')}
          </div>
        )}
      </div>
    </div>
  );
};

export const TabNavigation = ({ activeTab, setActiveTab, setLoadedTabs, tabs }) => (
  <div
    style={{
      marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)",
      display: "flex",
      flexWrap: "wrap",
      gap: "clamp(0.3rem, 1.2vw, 0.4rem)",
      width: "100%",
      alignItems: "stretch"
    }}
  >
    {tabs.map(({ key, label, count }) => (
      <Button
        key={key}
        variant="tab"
        onClick={() => {
          setActiveTab(key);
          setLoadedTabs(prev => new Set([...prev, key]));
        }}
        style={{
          backgroundColor: activeTab === key ? "#fff" : "#181818",
          color: activeTab === key ? "#111" : "#fff",
          border: activeTab === key ? "2px solid #fff" : "1.5px solid #333",
          fontWeight: activeTab === key ? 700 : 500,
          boxShadow: activeTab === key ? "0 2px 8px #0004" : "none",
          padding: "8px 18px",
          fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
          minWidth: 100,
          flex: "1 1 120px",
          transition: "all 0.18s"
        }}
        onMouseEnter={e => {
          e.target.style.backgroundColor = activeTab === key ? "#fff" : "#222";
          e.target.style.color = activeTab === key ? "#111" : "#fff";
          e.target.style.border = activeTab === key ? "2px solid #fff" : "1.5px solid #555";
        }}
        onMouseLeave={e => {
          e.target.style.backgroundColor = activeTab === key ? "#fff" : "#181818";
          e.target.style.color = activeTab === key ? "#111" : "#fff";
          e.target.style.border = activeTab === key ? "2px solid #fff" : "1.5px solid #333";
        }}
      >
        {label}{count !== undefined ? ` (${count})` : ''}
      </Button>
    ))}
    <style>{`
      @media (max-width: 600px) {
        .admin-tab-nav-btn {
          min-width: 90px !important;
          font-size: 0.98rem !important;
          flex: 1 1 100px !important;
        }
      }
    `}</style>
  </div>
);

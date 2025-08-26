// Reusable UI components for Admin Dashboard
import React from "react";

export const baseStyles = {
  fontFamily: "'Montserrat', sans-serif",
  cardBase: {
    backgroundColor: "#000000",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "clamp(1rem, 3vw, 2rem)",
  },
  glassMorphism: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
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
  <Card>
    <h3 style={{ 
      color: "white", 
      marginBottom: "1rem",
      fontFamily: baseStyles.fontFamily,
      fontWeight: "500",
      fontSize: "clamp(1rem, 3vw, 1.3rem)",
      textAlign: "center"
    }}>
      {title}
    </h3>
    <div style={{ width: "100%", height, minWidth: "250px", minHeight: "250px" }}>
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
    tab: { backgroundColor: "#333", hoverColor: "#444", border: "1px solid #555" }
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

export const ConnectionStatus = ({ status, url }) => {
  const statusConfig = {
    connected: { color: "#28a745", icon: "✓", text: "Connected" },
    failed: { color: "#dc3545", icon: "✗", text: "Disconnected" },
    testing: { color: "#ffc107", icon: "⏳", text: "Testing..." }
  };
  const config = statusConfig[status] || statusConfig.testing;
  return (
    <div style={{ 
      marginBottom: "clamp(0.6rem, 2vw, 0.8rem)", 
      padding: "clamp(0.4rem, 2vw, 0.6rem) clamp(0.6rem, 2.5vw, 0.8rem)", 
      borderRadius: "clamp(6px, 1.5vw, 10px)", 
      backgroundColor: config.color,
      color: "white",
      fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
      fontWeight: "500",
      fontFamily: baseStyles.fontFamily
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.2rem, 0.8vw, 0.4rem)" }}>
        <div style={{ fontWeight: "600" }}>
          Backend: {config.icon} {config.text}
        </div>
        {status === "connected" && url && (
          <div style={{ 
            fontSize: "clamp(0.6rem, 1.6vw, 0.7rem)", 
            opacity: "0.85",
            wordBreak: "break-all",
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.9)"
          }}>
            {url}
          </div>
        )}
      </div>
    </div>
  );
};

export const TabNavigation = ({ activeTab, setActiveTab, setLoadedTabs, tabs }) => (
  <div style={{ 
    marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", 
    display: "flex", 
    flexWrap: "nowrap", 
    gap: "clamp(0.3rem, 1.2vw, 0.4rem)",
    width: "100%",
    overflowX: "auto",
    scrollbarWidth: "thin",
    WebkitOverflowScrolling: "touch"
  }}>
    {tabs.map(({ key, label, count }) => (
      <Button
        key={key}
        variant="tab"
        onClick={() => {
          setActiveTab(key);
          setLoadedTabs(prev => new Set([...prev, key]));
        }}
        // ...existing code...
style={{
  backgroundColor: activeTab === key ? "#000" : "#000000ff",
  border: "1px solid #000",
  padding: "6px 12px",
  fontSize: "0.85rem",
  fontWeight: activeTab === key ? "600" : "500",
  minWidth: 80
}}
// ...existing code...
      >
        {label}{count !== undefined ? ` (${count})` : ''}
      </Button>
    ))}
  </div>
);

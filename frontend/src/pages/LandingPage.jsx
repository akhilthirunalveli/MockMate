import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import GeminiLogo from "../assets/gemini-color.svg"; // add this line
import GithubLogo from "../assets/github.png"; // add GitHub logo import

const TYPEWRITER_TEXT = "MockMate";
const TYPING_SPEED = 100; // smoother, slightly faster
const SUBTITLE_TEXT = 'Ace Interviews with ';
const SUBTITLE_PILL = 'AI-Powered';
const SUBTITLE_END = ' Learning';
const SUBTITLE_FULL = SUBTITLE_TEXT + SUBTITLE_PILL + SUBTITLE_END;
const SUBTITLE_TYPING_SPEED = 28; // smoother, slightly faster

function LandingPage() {
  const [displayedText, setDisplayedText] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const bgColor = "#000000";
  const textColor = "#fff";
  const subtitleColor = "#fff";
  const pillBorder = "1.5px solid #3b82f6";
  const pillText = "#1d4ed8";
  const buttonBg = "#000";
  const buttonText = "#fff";

  useEffect(() => {
    let isMounted = true;

    function typeWriter(index = 0) {
      if (!isMounted) return;
      setDisplayedText(TYPEWRITER_TEXT.slice(0, index + 1));
      if (index < TYPEWRITER_TEXT.length - 1) {
        setTimeout(() => typeWriter(index + 1), TYPING_SPEED);
      } else {
        setTimeout(() => typeSubtitle(), 250); // shorter delay before subtitle
      }
    }

    function typeSubtitle(subIndex = 0) {
      if (!isMounted) return;
      setDisplayedSubtitle(SUBTITLE_FULL.slice(0, subIndex + 1));
      if (subIndex < SUBTITLE_FULL.length - 1) {
        setTimeout(() => typeSubtitle(subIndex + 1), SUBTITLE_TYPING_SPEED);
      } else {
        setTimeout(() => {
          setShowAll(true);
          setTimeout(() => setShowButton(true), 300); // slightly faster button
        }, 250);
      }
    }

    typeWriter();

    return () => { isMounted = false; };
  }, []);

  // Replace handleCTA with modal logic
  function handleCTA() {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor,
      backgroundImage: "radial-gradient(#222 1px, #000000 1px)",
      backgroundSize: "20px 20px",
      padding: "0 5vw",
      transition: "background 0.3s, color 0.3s"
    }}>
      {!showAll ? (
        <>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            color: textColor,
            lineHeight: 1.1,
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "95vw"
          }}>
            {displayedText}
            {displayedText.length === TYPEWRITER_TEXT.length && (
              <span style={{ borderRight: "2px solid #333", animation: "blink 1s steps(1) infinite" }}>&nbsp;</span>
            )}
          </h1>
          {displayedText.length === TYPEWRITER_TEXT.length && (
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1.1rem, 4vw, 2rem)",
              fontWeight: 300,
              marginBottom: "2rem",
              color: subtitleColor,
              lineHeight: 1.2,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
              flexWrap: "wrap",
              maxWidth: "95vw"
            }}>
              {/* Render subtitle with pill if enough chars */}
              {displayedSubtitle.length <= SUBTITLE_TEXT.length
                ? displayedSubtitle
                : <>
                    {SUBTITLE_TEXT}
                    <span style={{
               fontFamily: "'Montserrat', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2em",
              padding: "0.25em 0.7em",
              borderRadius: "999px",
              background: "transparent",
              border: pillBorder,
              color: pillText,
              fontWeight: 600,
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              margin: "0 0.25em",
              position: "relative",
              backgroundImage: "linear-gradient(120deg, transparent 0%, #dbeafe 20%, #60A5FA 40%, #1D4ED8 50%, #60A5FA 60%, #dbeafe 80%, transparent 100%)",
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shine 2s linear infinite"
                    }}>
                      {/* Add Gemini SVG before AI */}
                      {displayedSubtitle.length > SUBTITLE_TEXT.length && (
                        <img
                          src={GeminiLogo}
                          alt="Gemini"
                          style={{
                            height: "1.2em",
                            width: "1.2em",
                            marginRight: "0.1em",
                            verticalAlign: "middle",
                            display: "inline-block"
                          }}
                        />
                      )}
                      {SUBTITLE_PILL.slice(0, Math.max(0, displayedSubtitle.length - SUBTITLE_TEXT.length))}
                    </span>
                    {displayedSubtitle.length > SUBTITLE_TEXT.length + SUBTITLE_PILL.length
                      ? SUBTITLE_END.slice(0, displayedSubtitle.length - SUBTITLE_TEXT.length - SUBTITLE_PILL.length)
                      : null}
                  </>
              }
            </h2>
          )}
        </>
      ) : (
        <>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            color: textColor,
            lineHeight: 1.1,
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "95vw"
          }}>
            MockMate
          </h1>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(1.1rem, 4vw, 2rem)",
            fontWeight: 300,
            marginBottom: "2rem",
            color: subtitleColor,
            lineHeight: 1.2,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5em",
            flexWrap: "wrap",
            maxWidth: "95vw"
          }}>
            Ace Interviews with
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2em",
              padding: "0.25em 0.7em",
              borderRadius: "999px",
              background: "transparent",
              border: pillBorder,
              color: pillText,
              fontWeight: 600,
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              margin: "0 0.25em",
              position: "relative",
              backgroundImage: "linear-gradient(120deg, transparent 0%, #dbeafe 20%, #60A5FA 40%, #1D4ED8 50%, #60A5FA 60%, #dbeafe 80%, transparent 100%)",
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shine 2s linear infinite"
            }}>
              {/* Add Gemini SVG before AI */}
              <img
                src={GeminiLogo}
                alt="Gemini"
                style={{
                  height: "1.2em",
                  width: "1.2em",
                  marginRight: "0.1em",
                  verticalAlign: "middle",
                  display: "inline-block"
                }}
              />
              AI-Powered
            </span>
            Learning
          </h2>
          {showButton && (
            <div style={{ display: "flex", flexDirection: "row", gap: "0.5em", alignItems: "center", justifyContent: "center", width: "auto", flexWrap: "nowrap" }}>
              {user ? (
                <button
                  style={{
                    background: "#000",
                    border: "2px solid #fff",
                    borderRadius: "10em",
                    padding: "0.4em 1.6em",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    minWidth: "180px",
                    textAlign: "center",
                    boxShadow: "0 2px 16px 0 rgba(0, 0, 0, 0)",
                    cursor: "pointer",
                    outline: "none",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5em"
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  {user.profileImageUrl || user.photoURL ? (
                    <img
                      src={user.profileImageUrl || user.photoURL}
                      alt="profile"
                      style={{
                        width: "2.5em",
                        height: "2.5em",
                        borderRadius: "90%",
                        objectFit: "cover",
                        marginRight: "0.9em"
                      }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      style={{
                        width: "2.5em",
                        height: "2.5em",
                        borderRadius: "90%",
                        marginRight: "0.9em",
                        backgroundColor: user?.name ? 
                          ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'][
                            Math.abs(user.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 10
                          ] : '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}
                    >
                      {user?.name ? 
                        (() => {
                          const words = user.name.trim().split(' ').filter(word => word.length > 0);
                          if (words.length === 0) return 'U';
                          if (words.length === 1) return words[0][0].toUpperCase();
                          return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                        })() : 'U'
                      }
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.08em", color: "#fff" }}>
                      {user.name || user.email}
                    </span>
                    <span style={{ fontWeight: 400, fontSize: "0.97em", color: "#cbd5e1" }}>
                      {user.email}
                    </span>
                  </div>
                  <span style={{ marginLeft: "0.3em", fontSize: "2.4em", color: "#fff", display: "flex", alignItems: "center" }}>
                  &#x203A;
                  </span>
                </button>
              ) : (
                <button
                  className="colorful-gradient-btn"
                  style={{
                    width: "auto",
                    maxWidth: "190px",
                    minWidth: "90px",
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    margin: 0,
                    fontWeight: 700,
                    outline: "none",
                    color: "#fff",
                    boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
                    padding: "0.6em 2.2em",
                    borderRadius: "999px",
                    cursor: "pointer",
                    letterSpacing: "0.03em"
                  }}
                  onClick={handleCTA}
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </>
      )}
      {/* Add this block for the credit */}
      <div
        className="credit-bar"
        style={{
          position: "fixed",
          right: "1.5vw",
          bottom: "1.2vw",
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          background: "rgba(0,0,0,0.12)",
          color: "#b6b6b6",
          fontSize: "1.05em",
          fontWeight: 400,
          borderRadius: "999px",
          padding: "0.35em 1.1em 0.35em 0.7em",
          zIndex: 99,
          opacity: 0.45,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          transition: "opacity 0.2s, background 0.2s, color 0.2s",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
      >
        Developed By
        <img
          src={GithubLogo}
          alt="GitHub"
          style={{
            height: "1.25em",
            width: "1.25em",
            marginRight: "0.3em",
            verticalAlign: "middle",
            opacity: 0.45,
            filter: "grayscale(0.7)",
            transition: "filter 0.2s, opacity 0.2s",
            userSelect: "none",
            pointerEvents: "none"
          }}
        />
        akhilthirunalveli
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap');
          @keyframes blink {
            0%, 100% { border-color: transparent }
            50% { border-color: #333 }
          }
          @keyframes text-shine {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          @keyframes shine {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          .colorful-gradient-btn {
            background: linear-gradient(90deg, #ff6a00, #ee0979, #00c3ff,rgb(0, 74, 25),rgb(0, 98, 80), #ff6a00);
            background-size: 300% 100%;
            background-position: 0% 0%;
            color: #fff;
            border: none;
            outline: none;
            font-weight: 700;
            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.18);
            transition: background-position 0.5s, box-shadow 0.3s, color 0.3s, transform 0.18s cubic-bezier(0.4,0.2,0.2,1);
            border-radius: 999px; /* <--- Make corners fully rounded */
          }
          .colorful-gradient-btn:hover, .colorful-gradient-btn:focus {
            background-position: 100% 0;
            color: #fff;
            box-shadow: 0 4px 24px 0 rgba(0,0,0,0.22);
            transform: scale(1.045);
          }
          .credit-bar:hover {
            opacity: 1;
            background: rgba(0,0,0,0.38);
            color: #fff;
          }
          .credit-bar:hover img {
            filter: none;
            opacity: 1;
          }
          .credit-bar, .credit-bar * {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
        `}
      </style>
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;

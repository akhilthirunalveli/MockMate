import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from 'react-spinners';
import Modal from "../Preparation/Components/Modal.jsx";
import { UserContext } from "../../context/userContext.jsx";
import GeminiLogo from "../../assets/gemini-color.svg";
import GithubLogo from "../../assets/github.png";

import Login from "../Auth/Login.jsx";
import SignUp from "../Auth/SignUp.jsx";
import ForgotPassword from "../Auth/ForgotPassword.jsx";
import UserProfileButton from "./Components/UserProfileButton.jsx";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Ensure we're on the client side before proceeding with dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run animations on server side

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
  }, [isClient]);

  // Replace handleCTA with modal logic
  function handleCTA() {
    if (!user) {
      setIsLoading(true);
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  }

  // Common font family class
  const fontMontserrat = "font-['Montserrat',sans-serif]";

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-dots-dark px-[5vw] transition-[background,color] duration-300">
      {!showAll ? (
        <>
          <h1 className={`${fontMontserrat} text-[clamp(2rem,7vw,3rem)] font-medium mb-4 text-white leading-[1.1] text-center max-w-[95vw] break-words`}>
            {displayedText}
            {displayedText.length === TYPEWRITER_TEXT.length - 1 && (
              <span className="border-r-2 border-[#333] animate-blink">&nbsp;</span>
            )}
          </h1>
          {displayedText.length === TYPEWRITER_TEXT.length - 1 && (
            <h2 className={`${fontMontserrat} text-[clamp(1.1rem,4vw,2rem)] font-light mb-8 text-white leading-[1.2] text-center flex items-center justify-center gap-[0.5em] flex-wrap max-w-[95vw]`}>
              {/* Render subtitle with pill if enough chars */}
              {displayedSubtitle.length <= SUBTITLE_TEXT.length
                ? displayedSubtitle
                : <>
                  {SUBTITLE_TEXT}
                  <span className={`${fontMontserrat} inline-flex items-center justify-center gap-[0.2em] px-[0.7em] py-[0.25em] rounded-full bg-transparent border-[1.5px] border-blue-500 text-blue-700 font-semibold text-[clamp(0.9rem,3vw,1.1rem)] mx-[0.25em] relative bg-[linear-gradient(120deg,transparent_0%,#dbeafe_20%,#60A5FA_40%,#1D4ED8_50%,#60A5FA_60%,#dbeafe_80%,transparent_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine`}>
                    {/* Add Gemini SVG before AI */}
                    {displayedSubtitle.length > SUBTITLE_TEXT.length && (
                      <img
                        src={GeminiLogo}
                        alt="Gemini"
                        className="h-[1.2em] w-[1.2em] mr-[0.1em] align-middle inline-block"
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
          <h1 className={`${fontMontserrat} text-[clamp(2rem,7vw,3rem)] font-medium mb-4 text-white leading-[1.1] text-center max-w-[95vw] break-words`}>
            MockMate
          </h1>
          <h2 className={`${fontMontserrat} text-[clamp(1.1rem,4vw,2rem)] font-light mb-8 text-white leading-[1.2] text-center flex items-center justify-center gap-[0.5em] flex-wrap max-w-[95vw]`}>
            Ace Interviews with
            <span className={`${fontMontserrat} inline-flex items-center justify-center gap-[0.2em] px-[0.7em] py-[0.25em] rounded-full bg-transparent border-[1.5px] border-blue-500 text-blue-700 font-semibold text-[clamp(0.9rem,3vw,1.1rem)] mx-[0.25em] relative bg-[linear-gradient(120deg,transparent_0%,#dbeafe_20%,#60A5FA_40%,#1D4ED8_50%,#60A5FA_60%,#dbeafe_80%,transparent_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shine`}>
              {/* Add Gemini SVG before AI */}
              <img
                src={GeminiLogo}
                alt="Gemini"
                className="h-[1.2em] w-[1.2em] mr-[0.1em] align-middle inline-block"
              />
              AI-Powered
            </span>
            Learning
          </h2>
          {showButton && (
            <div className="flex flex-row gap-[0.5em] items-center justify-center w-auto flex-nowrap">
              {user ? (
                <UserProfileButton
                  user={user}
                  onClick={() => navigate("/dashboard")}
                />
              ) : (
                <button
                  className="colorful-gradient-btn w-auto max-w-[190px] min-w-[90px] text-[clamp(0.9rem,2.5vw,1.1rem)] m-0 font-bold outline-none text-white shadow-[0_2px_16px_0_rgba(0,0,0,0.18)] px-[2.2em] py-[0.6em] rounded-full cursor-pointer tracking-[0.03em] hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.22)] hover:scale-[1.045] focus:shadow-[0_4px_24px_0_rgba(0,0,0,0.22)] focus:scale-[1.045] border-[5px] border-black"
                  onClick={handleCTA}
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
          setIsLoading(false);
        }}
        hideHeader
        isDark
        isLoading={isLoading}
      >
        <div>
          {currentPage === "login" && (
            <Login
              setCurrentPage={setCurrentPage}
              onClose={() => setOpenAuthModal(false)}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
          {currentPage === "signup" && (
            <SignUp
              setCurrentPage={setCurrentPage}
              onClose={() => setOpenAuthModal(false)}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
          {currentPage === "forgotPassword" && (
            <ForgotPassword
              setCurrentPage={setCurrentPage}
              onClose={() => setOpenAuthModal(false)}
              onLoadingComplete={() => setIsLoading(false)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;

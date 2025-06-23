import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {

  return (
    <div className="bg-black relative overflow-hidden">
      {/* Repeating MOCKMATE background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              rgba(0,0,0,0.1) 30px,
              rgba(0,0,0,0.1) 60px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 200px,
              rgba(0,0,0,0.05) 200px,
              rgba(0,0,0,0.05) 400px
            )
          `,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundRepeat: "repeat",
            backgroundSize: "120px 3px",
            opacity: 0.06,
            fontWeight: 700,
            fontSize: "0.80rem",
            letterSpacing: "0.15em",
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}>

          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} style={{ width: "90%", display: "flex", justifyContent: "center" }}>
              {Array.from({length: 15}).map((_, col) => (
                <span key={col} style={{ margin: "0 8px 5px 6px" }}>MOCKMATE</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-15 md:px-14 relative z-10">
        <div className="h-[200px] flex flex-col justify-center relative z-10">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl text-white font-medium">{role}</h2>
                  <p className="text-sm text-medium text-white mt-4">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <div className="text-[12px] font-semibold text-black bg-white px-3 py-1 rounded-full">
              Experience: {experience} {experience == 1 ? "Year" : "Years"}
            </div>

            <div className="text-[12px] font-semibold text-black bg-white px-3 py-1 rounded-full">
              {questions} Q&A
            </div>

            <div className="text-[12px] font-semibold text-black bg-white px-3 py-1 rounded-full">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;

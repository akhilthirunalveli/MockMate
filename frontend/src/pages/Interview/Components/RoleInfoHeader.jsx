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
            opacity: 0.03,
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
              {Array.from({ length: 15 }).map((_, col) => (
                <span key={col} style={{ margin: "0 8px 5px 6px" }}>MOCKMATE</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 relative z-10">
        <div className="h-[150px] sm:h-[180px] md:h-[200px] flex flex-col justify-center relative z-10 py-4 sm:py-0">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div className="w-full text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-tight">{role}</h2>
                  <p className="text-xs sm:text-sm text-medium text-white mt-2 sm:mt-3 md:mt-4 leading-relaxed">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-5">
            <div className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-black bg-white px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              Experience: {experience} {experience == 1 ? "Year" : "Years"}
            </div>

            <div className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-black bg-white px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              {questions} Q&A
            </div>

            <div className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-black bg-white px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;

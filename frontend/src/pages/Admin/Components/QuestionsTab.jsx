import React from "react";
import { Card, baseStyles } from "./AdminUI";

const QuestionsTab = ({ groupedQuestions, expandedGroups, toggleGroupExpansion }) => (
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
      Questions by User
    </h2>
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      {Object.entries(groupedQuestions).map(([userId, { user, questions }]) => {
        const isExpanded = expandedGroups.has(userId);
        const questionCount = questions.length;
        return (
          <div key={userId} style={{ width: "100%" }}>
            {/* User Header - Collapsible */}
            <Card
              style={{
                backgroundColor: "#000000ff",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: isExpanded ? "0.5rem" : "0",
                border: "1.5px solid #333",
                boxShadow: "0 2px 12px 0 #0006"
              }}
              onClick={() => toggleGroupExpansion(userId)}

            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <h3 style={{
                    margin: "0 0 0.25rem 0",
                    color: "#fff",
                    fontSize: "clamp(1.1rem, 3.2vw, 1.3rem)",
                    fontFamily: baseStyles.fontFamily,
                    fontWeight: 600,
                    wordBreak: "break-word"
                  }}>
                    {user.name}
                  </h3>
                  {user.email && (
                    <p style={{
                      margin: 0,
                      color: "#bbb",
                      fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                      wordBreak: "break-word"
                    }}>
                      {user.email}
                    </p>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flexShrink: 0
                }}>
                  <span style={{
                    backgroundColor: "#222",
                    padding: "0.25rem 0.7rem",
                    borderRadius: "12px",
                    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                    fontWeight: 500,
                    color: "#fff"
                  }}>
                    {questionCount} question{questionCount !== 1 ? 's' : ''}
                  </span>
                  <span style={{
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    color: "#bbb",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontWeight: 700
                  }}>
                    {isExpanded ? '›' : '▶'}
                  </span>
                </div>
              </div>
            </Card>
            {/* Questions Grid - Collapsible Content */}
            {isExpanded && (
              <div style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(400px, 100%), 1fr))",
                paddingLeft: "1rem",
                borderLeft: "3px solid #222",
                animation: "slideDown 0.3s ease-out"
              }}>
                {questions.map((question) => (
                  <Card
                    key={question._id}
                    style={{
                      backgroundColor: "#181818",
                      color: "#fff",
                      border: "1.5px solid #333",
                      boxShadow: "0 2px 12px 0 #0006",
                      transition: "box-shadow 0.2s, border 0.2s, background 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#222";
                      e.currentTarget.style.border = "1.5px solid #555";
                      e.currentTarget.style.boxShadow = "0 4px 18px 0 #000a";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#181818";
                      e.currentTarget.style.border = "1.5px solid #333";
                      e.currentTarget.style.boxShadow = "0 2px 12px 0 #0006";
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{
                        margin: "0 0 0.5rem 0",
                        color: "#fff",
                        fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)",
                        fontFamily: baseStyles.fontFamily,
                        fontWeight: 600,
                        lineHeight: 1.4
                      }}>
                        {question.question || 'No question text'}
                      </h4>
                      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <p style={{
                            color: "#bbb",
                            fontSize: "clamp(0.75rem, 2.2vw, 0.85rem)",
                            margin: "0 0 0.25rem 0",
                            fontWeight: 500
                          }}>
                            Follow-up Questions:
                          </p>
                          <ul style={{
                            margin: 0,
                            paddingLeft: "1rem",
                            color: "#aaa",
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)"
                          }}>
                            {question.followUpQuestions.slice(0, 3).map((followUp, index) => (
                              <li key={index} style={{ marginBottom: "0.25rem" }}>
                                {followUp}
                              </li>
                            ))}
                            {question.followUpQuestions.length > 3 && (
                              <li style={{ color: "#666", fontStyle: "italic" }}>
                                +{question.followUpQuestions.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      {question.session && (
                        <div style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem",
                          backgroundColor: "#222",
                          borderRadius: "6px"
                        }}>
                          <p style={{
                            margin: 0,
                            color: "#bbb",
                            fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)"
                          }}>
                            <strong>Session:</strong> {question.session.role || 'Unknown Role'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)", color: "#999" }}>
                      <p style={{ margin: "0.25rem 0" }}>
                        <strong>Generated:</strong> {new Date(question.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    <style>{`
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export default QuestionsTab;

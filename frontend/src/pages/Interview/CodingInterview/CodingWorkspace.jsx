import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodingWorkspace = ({ socket, room }) => {
  const [code, setCode] = useState('// Welcome to the Live Coding Environment\n\nfunction solution() {\n  \n}');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (!socket) return;

    const handleReceiveData = (data) => {
      if (!data || data.author === socket.id) return;

      if (data.type === 'CODE_UPDATE') {
        setCode(data.code);
      } else if (data.type === 'LANGUAGE_UPDATE') {
        setLanguage(data.language);
      }
    };

    socket.on('receive_message', handleReceiveData);

    return () => {
      socket.off('receive_message', handleReceiveData);
    };
  }, [socket]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket && room) {
      socket.emit('send_message', {
        room,
        author: socket.id,
        type: 'CODE_UPDATE',
        code: value
      });
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (socket && room) {
      socket.emit('send_message', {
        room,
        author: socket.id,
        type: 'LANGUAGE_UPDATE',
        language: newLang
      });
    }
  };

  const getFilename = () => {
    switch (language) {
      case 'javascript': return 'solution.js';
      case 'python': return 'solution.py';
      case 'java': return 'Solution.java';
      case 'cpp': return 'solution.cpp';
      default: return 'solution';
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#333] relative pointer-events-auto flex flex-col">
      {/* Ultra Minimal Header */}
      <div className="h-10 w-full bg-[#1A1A1A] flex items-center justify-between px-4 border-b border-[#2D2D2D] shrink-0">
        {/* Mac Controls */}
        <div className="flex gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]"></div>
        </div>

        {/* Faint Minimal Language Selector */}
        <div className="flex items-center relative">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-transparent text-white/50 hover:text-white transition-colors pl-2 pr-2 py-1 text-[11px] font-semibold outline-none cursor-pointer appearance-none w-full z-10"
          >
            <option value="javascript" className="bg-[#2D2D2D] text-white">JavaScript</option>
            <option value="python" className="bg-[#2D2D2D] text-white">Python</option>
            <option value="java" className="bg-[#2D2D2D] text-white">Java</option>
            <option value="cpp" className="bg-[#2D2D2D] text-white">C++</option>
          </select>
          <div className="absolute right-1 text-white/50 pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            wordWrap: "on",
            padding: { top: 24, bottom: 24 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on"
          }}
          loading={
            <div className="flex items-center justify-center h-full w-full bg-[#1E1E1E] text-white/50 text-sm">
              Loading Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodingWorkspace;

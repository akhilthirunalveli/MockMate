import React, { useState, Suspense, lazy } from 'react';
import { LuCopy, LuCheck } from "react-icons/lu";

// Import style once
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Create stable lazy components
const PrismHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism
  }))
);

const OptimizedSyntaxHighlighter = ({ language, children, customStyle }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={copyCode}
          className="p-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
        </button>
      </div>
      
      <Suspense 
        fallback={
          <pre 
            className="bg-transparent p-4 rounded text-sm overflow-x-auto" 
            style={{ 
              background: 'transparent',
              border: 'none',
              color: 'rgba(107, 114, 128, 0.5)'
            }}
          >
            <code>{children}</code>
          </pre>
        }
      >
        <PrismHighlighter 
          language={language} 
          style={oneLight} 
          customStyle={{
            fontSize: 12.5,
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            ...customStyle
          }}
        >
          {children}
        </PrismHighlighter>
      </Suspense>
    </div>
  );
};

export default OptimizedSyntaxHighlighter;

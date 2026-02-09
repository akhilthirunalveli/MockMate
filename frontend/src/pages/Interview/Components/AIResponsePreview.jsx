import React, { useState, Suspense } from 'react'
import { Copy01Icon, Tick01Icon, CodeCircleIcon } from "hugeicons-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import OptimizedSyntaxHighlighter from '../../Preparation/Loader/OptimizedSyntaxHighlighter.jsx';
import { useNavigate } from 'react-router-dom';

const AIResponsePreview = ({ content }) => {
  const navigate = useNavigate();
  if (!content) return null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[14px] prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const isInline = !className;

              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, '')}
                  language={language}
                />
              ) : (
                <code className="px-1.5 py-0.5 bg-white/10 text-white rounded-md text-[13px] font-medium" {...props}>
                  {children}
                </code>
              );
            },
            p({ children }) {
              return <p className="mb-4 leading-6 text-white/80">{children}</p>;
            },
            strong({ children }) {
              return <strong className="text-white font-black">{children}</strong>;
            },
            em({ children }) {
              return <em className="text-white/70 italic">{children}</em>;
            },
            ul({ children }) {
              return <ul className="list-disc pl-5 space-y-2 my-4 text-white/70">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal pl-5 space-y-2 my-4 text-white/70">{children}</ol>;
            },
            li({ children }) {
              return <li className="mb-1 pl-1">{children}</li>;
            },
            blockquote({ children }) {
              return <blockquote className="border-l-4 border-indigo-500/50 bg-white/5 pl-4 py-2 italic my-6 rounded-r-xl text-white/60">{children}</blockquote>;
            },
            h1({ children }) {
              return <h1 className="text-2xl font-black text-white mt-8 mb-4 tracking-tight">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-xl font-black text-white mt-8 mb-3 tracking-tight">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold text-white mt-6 mb-2 tracking-tight">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-base font-bold text-white mt-5 mb-2">{children}</h4>;
            },
            a({ children, href }) {
              const isInternal = href?.startsWith('/') || (href && href.includes(window.location.host));
              const finalHref = isInternal && href.includes(window.location.host)
                ? new URL(href).pathname
                : href;

              return (
                <a
                  href={finalHref}
                  onClick={(e) => {
                    if (isInternal) {
                      e.preventDefault();
                      navigate(finalHref);
                    }
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 decoration-indigo-500/20 hover:decoration-indigo-500 transition-all"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-6 border border-white/5 bg-white/[0.01] rounded-xl">
                  <table className="min-w-full divide-y divide-white/5">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-white/[0.02]">{children}</thead>;
            },
            tbody({ children }) {
              return <tbody className="divide-y divide-white/[0.02]">{children}</tbody>;
            },
            tr({ children }) {
              return <tr>{children}</tr>;
            },
            th({ children }) {
              return <th className="px-4 py-2.5 text-left text-[11px] font-bold text-white/30 uppercase tracking-widest">{children}</th>;
            },
            td({ children }) {
              return <td className="px-4 py-2.5 text-sm text-white/60">{children}</td>;
            },
            hr() {
              return <hr className="my-8 border-white/5" />;
            },
            img({ src, alt }) {
              return <img src={src} alt={alt} className="my-6 max-w-full rounded-xl border border-white/5" />;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return <div className="relative my-6 rounded-xl overflow-hidden bg-white/[0.01] border border-white/5 group">
    <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
      <div className="flex items-center space-x-3">
        <CodeCircleIcon size={14} className="text-white/20" />
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
          {language || 'Code'}
        </span>
      </div>
      <button
        onClick={copyCode}
        className="text-white/20 hover:text-white transition-colors p-1"
        aria-label="Copy code"
      >
        {copied ? (
          <Tick01Icon size={14} className="text-emerald-500" />
        ) : (
          <Copy01Icon size={14} />
        )}
      </button>
    </div>

    <div className="p-2 overflow-x-auto scrollbar-hide">
      <OptimizedSyntaxHighlighter language={language}>
        {code}
      </OptimizedSyntaxHighlighter>
    </div>
  </div>
}


export default AIResponsePreview



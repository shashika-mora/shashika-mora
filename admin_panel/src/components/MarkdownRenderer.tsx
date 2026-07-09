import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="text-slate-300 leading-relaxed font-light space-y-6">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading text-3xl font-extrabold text-white mt-8 mb-4 border-b border-slate-800 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-2xl font-bold text-white mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-xl font-semibold text-slate-100 mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-4 text-slate-300 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 my-4 bg-slate-900/40 py-2 pr-2 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto text-sm text-slate-200 font-mono my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-slate-900 border border-slate-800 text-pink-400 font-mono text-sm px-1.5 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

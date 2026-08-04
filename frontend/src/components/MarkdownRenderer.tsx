import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content?: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div style={{ color: 'var(--dp-smoke)', lineHeight: 1.8, fontSize: '0.95rem' }} className="space-y-6">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                fontFamily: 'var(--font-heading, Georgia, serif)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#ffffff',
                marginTop: '32px',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                paddingBottom: '8px',
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontFamily: 'var(--font-heading, Georgia, serif)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: 'var(--dp-gold-bright)',
                marginTop: '28px',
                marginBottom: '12px',
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontFamily: 'var(--font-heading, Georgia, serif)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '24px',
                marginBottom: '10px',
              }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => <p style={{ marginBottom: '16px', color: 'var(--dp-smoke)', lineHeight: 1.8 }}>{children}</p>,
          ul: ({ children }) => <ul style={{ paddingLeft: '24px', marginBottom: '16px', listStyleType: 'disc' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: '24px', marginBottom: '16px', listStyleType: 'decimal' }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: '6px', color: 'var(--dp-smoke)' }}>{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--dp-gold-bright)', fontWeight: 600, textDecoration: 'underline', transition: 'color 0.2s' }}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: '4px solid var(--dp-red-bright)',
                paddingLeft: '18px',
                paddingTop: '8px',
                paddingBottom: '8px',
                margin: '20px 0',
                background: 'rgba(22, 18, 15, 0.85)',
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                color: 'var(--dp-gold-soft)',
                fontStyle: 'italic',
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            return !inline ? (
              <pre
                style={{
                  background: '#090807',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '6px',
                  padding: '18px 22px',
                  overflowX: 'auto',
                  fontSize: '0.85rem',
                  color: '#f5efea',
                  fontFamily: 'monospace',
                  margin: '18px 0',
                }}
              >
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                style={{
                  background: 'rgba(138, 13, 13, 0.3)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--dp-gold-bright)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
                {...props}
              >
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

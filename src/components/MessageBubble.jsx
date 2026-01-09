import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Landmark } from 'lucide-react';

export function MessageBubble({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-heritage-red-700 flex items-center justify-center shadow-heritage border-2 border-heritage-gold-400">
            <Landmark className="w-5 h-5 text-heritage-gold-300" />
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-elegant ${
          isUser
            ? 'bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-br-md border border-heritage-red-600'
            : 'bg-white text-heritage-earth-800 rounded-bl-md border border-heritage-earth-200'
        }`}
      >
        {/* Message Content with Markdown */}
        <div
          className={`text-sm leading-relaxed text-start prose prose-sm max-w-none ${
            isUser
              ? 'prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-heritage-gold-300'
              : 'prose-heritage prose-p:text-heritage-earth-800 prose-headings:text-heritage-earth-900 prose-strong:text-heritage-earth-900 prose-a:text-heritage-red-700'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Paragraphs
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

              // Headings
              h1: ({ children }) => (
                <h1 className="text-lg font-display font-bold mb-2 mt-3 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-display font-bold mb-2 mt-3 first:mt-0">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-display font-bold mb-1 mt-2 first:mt-0">{children}</h3>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="ml-2">{children}</li>,

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:no-underline font-medium ${
                    isUser
                      ? 'text-heritage-gold-300 hover:text-heritage-gold-200'
                      : 'text-heritage-red-700 hover:text-heritage-red-800'
                  }`}
                >
                  {children}
                </a>
              ),

              // Code
              code: ({ inline, children }) =>
                inline ? (
                  <code
                    className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                      isUser
                        ? 'bg-heritage-red-600 text-heritage-gold-200'
                        : 'bg-heritage-earth-100 text-heritage-red-700 border border-heritage-earth-200'
                    }`}
                  >
                    {children}
                  </code>
                ) : (
                  <pre
                    className={`p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 ${
                      isUser
                        ? 'bg-heritage-red-900/50 border border-heritage-red-600'
                        : 'bg-heritage-earth-50 border border-heritage-earth-200'
                    }`}
                  >
                    <code>{children}</code>
                  </pre>
                ),

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote
                  className={`border-l-4 pl-3 my-2 italic ${
                    isUser
                      ? 'border-heritage-gold-400 text-heritage-gold-100'
                      : 'border-heritage-gold-500 text-heritage-earth-600 bg-heritage-gold-50/50 py-1 rounded-r'
                  }`}
                >
                  {children}
                </blockquote>
              ),

              // Table
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th
                  className={`border px-2 py-1.5 font-semibold text-left ${
                    isUser
                      ? 'border-heritage-red-500 bg-heritage-red-600'
                      : 'border-heritage-earth-300 bg-heritage-earth-100'
                  }`}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  className={`border px-2 py-1.5 ${
                    isUser ? 'border-heritage-red-500' : 'border-heritage-earth-300'
                  }`}
                >
                  {children}
                </td>
              ),

              // Horizontal rule
              hr: () => (
                <hr
                  className={`my-3 ${
                    isUser ? 'border-heritage-red-500' : 'border-heritage-earth-200'
                  }`}
                />
              ),

              // Text formatting
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Streaming cursor */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-heritage-gold-500 animate-pulse rounded-sm" />
          )}
        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-heritage-earth-700 flex items-center justify-center shadow-elegant border-2 border-heritage-earth-500">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

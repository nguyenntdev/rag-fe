import { useState, useCallback, useRef } from "react";

// Dify API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://36.50.26.18:8080/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'app-HVz3697502NndbAD0bNmQ4zN';

// Generate a unique user ID for the session
const generateUserId = () => {
  const stored = localStorage.getItem('dify_user_id');
  if (stored) return stored;
  const newId = 'user-' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('dify_user_id', newId);
  return newId;
};

export function useStreamingChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI về di sản văn hóa tỉnh Cà Mau. Bạn có thể hỏi tôi về các di sản như Lễ Hội Đờn Ca Tài Tử hoặc bất kỳ di sản văn hóa nào khác.'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  // Store conversation_id for multi-turn conversations
  const conversationIdRef = useRef(null);
  const userIdRef = useRef(generateUserId());

  const streamFromBackend = useCallback(async (userMessage) => {
    setIsStreaming(true);
    setError(null);

    // Add empty assistant message for streaming
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '' }
    ]);

    try {
      // Build request body for Dify chat-messages API
      const requestBody = {
        inputs: {},
        query: userMessage,
        response_mode: 'streaming',
        user: userIdRef.current,
      };

      // Include conversation_id for multi-turn conversations
      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current;
      }

      const response = await fetch(`${API_BASE_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          // Skip empty lines
          if (!line.trim()) continue;

          // Handle SSE data format
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              // Handle Dify streaming format
              if (parsed.event === 'message') {
                // Store conversation_id for future messages
                if (parsed.conversation_id) {
                  conversationIdRef.current = parsed.conversation_id;
                }

                // Append the answer chunk
                if (parsed.answer) {
                  fullResponse += parsed.answer;

                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      content: fullResponse
                    };
                    return updated;
                  });
                }
              } else if (parsed.event === 'message_end') {
                // Message complete, could extract metadata here if needed
                if (parsed.conversation_id) {
                  conversationIdRef.current = parsed.conversation_id;
                }
              } else if (parsed.event === 'error') {
                throw new Error(parsed.message || 'API Error');
              }
            } catch (parseError) {
              // If JSON parsing fails, just continue
              if (parseError.message !== 'API Error') {
                console.warn('Failed to parse SSE data:', data);
              } else {
                throw parseError;
              }
            }
          }
        }
      }

    } catch (err) {
      console.error('Streaming error:', err);
      setError(err.message);

      // Update the last message with error
      const errorMessage = 'Xin lỗi, đã có lỗi xảy ra khi kết nối với server. Vui lòng thử lại sau.';
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: errorMessage
          };
        } else {
          updated.push({ role: 'assistant', content: errorMessage });
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);

    // Stream response from Dify API
    await streamFromBackend(text);
  }, [streamFromBackend]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Xin chào! Tôi là trợ lý AI về di sản văn hóa tỉnh Cà Mau. Bạn có thể hỏi tôi về các di sản như Lễ Hội Đờn Ca Tài Tử hoặc bất kỳ di sản văn hóa nào khác.'
      }
    ]);
    // Reset conversation for a fresh start
    conversationIdRef.current = null;
    setError(null);
  }, []);

  return { messages, isStreaming, sendMessage, error, clearMessages };
}

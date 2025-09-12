import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronDown, Bot, User } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "**Xin chào! Tôi là SupportBot** 🎉\n\nTôi có thể giúp bạn truy cập và duyệt web như một trình duyệt. Để tìm thông tin trên dawaco.com.vn, bạn cần tự mình truy cập trang web đó.\n\n### Tôi có thể giúp bạn với các câu hỏi của bạn!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Scroll to bottom when opening chat
    if (!isOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setLoading(true);

    try {
      // Gọi API backend NestJS
      const res = await axios.post("http://localhost:3000/chat", {
        message: currentInput,
        stream: true,
      });

      const { text: botText } = parseBackendResponse(res.data);

      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("API error:", err);

      // Fallback to predefined responses nếu API không hoạt động
      let fallbackResponse =
        "Cảm ơn bạn đã nhắn tin! Tôi ở đây để hỗ trợ bạn với mọi thắc mắc.";

      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        text: fallbackResponse,
      };

      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Parse backend response
  const parseBackendResponse = (response) => {
    let text = response.reply || response.text || response;

    return {
      text: text,
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-full md:w-96 h-[500px] flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <Bot className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Chatbot</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ChevronDown
                className="cursor-pointer hover:bg-purple-700 rounded p-1"
                size={24}
                onClick={toggleChat}
              />
              <X
                className="cursor-pointer hover:bg-purple-700 rounded p-1"
                size={24}
                onClick={toggleChat}
              />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-2 max-w-sm">
                    {message.type === "bot" && (
                      <div className="bg-purple-600 p-2 rounded-full flex-shrink-0">
                        <Bot className="text-white" size={16} />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <div className="text-sm prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-2">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-2">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="mb-1">{children}</li>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-lg font-bold mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-bold mb-1">
                                {children}
                              </h3>
                            ),
                            code: ({ children }) => (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                {children}
                              </code>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-gray-300 pl-2 italic">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {message.type === "user" && (
                      <div className="bg-gray-400 p-2 rounded-full flex-shrink-0">
                        <User className="text-white" size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-sm">
                  <div className="bg-purple-600 p-2 rounded-full flex-shrink-0">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div className="bg-white text-gray-600 border border-gray-200 p-3 rounded-lg">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

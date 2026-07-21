import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Send, 
  Sparkles, 
  Paperclip, 
  Smile, 
  Mic, 
  ChevronLeft, 
  MoreHorizontal,
  ArrowUp,
  MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isEmoji?: boolean;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Gilla_x's AI assistant. How can I assist you?"
    },
    {
      role: "user",
      content: "what can you do ?"
    },
    {
      role: "assistant",
      content: "😊",
      isEmoji: true
    },
    {
      role: "assistant",
      content: "Hi there! I'm here to help you with anything related to Gillax Creative, like scheduling, booking, custom campaigns, or any questions you might have. What would you like to know more about? 😊"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewNotification(false);
    }
  }, [messages, isOpen]);

  // Alert the user with a subtle notification bounce if the chat is unopened after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewNotification(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue("");
    }

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI Agent");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      // Add a placeholder message for the assistant
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...lastMessage,
                      content: lastMessage.content + parsed.text,
                    };
                    return updated;
                  }
                  return prev;
                });
              }
            } catch (err) {
              console.error("Error parsing streaming chunk", err);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry! It seems I lost connection with the projector room. You can contact Prince directly at Gillaxediting@gmail.com or chat on WhatsApp: https://wa.me/919646028153!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const QUICK_SUGGESTIONS = [
    { label: "Book Call 📅", prompt: "How do I book a meeting with Prince?" },
    { label: "WhatsApp Chat 💬", prompt: "What is Prince's WhatsApp number and direct contact info?" },
    { label: "Creative Stack 🛠️", prompt: "What editing tools, software, and engine does Prince use?" },
    { label: "Blip Footage 📦", prompt: "How do I share my raw video footage on Blip?" }
  ];

  // Formatting for bold text (**bold**) and urls
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|https?:\/\/[^\s\)]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-purple-400">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("http://") || part.startsWith("https://")) {
        const displayUrl = part.replace(/^(https?:\/\/)?(www\.)?/, "");
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-purple-400 hover:text-purple-300 font-mono font-bold break-all inline-block bg-purple-950/45 px-1.5 py-0.5 rounded transition-all border border-purple-800/40"
          >
            {displayUrl.length > 25 ? displayUrl.slice(0, 25) + "..." : displayUrl}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute bottom-20 right-0 w-[92vw] sm:w-[400px] h-[580px] max-h-[82vh] bg-neutral-950 border border-neutral-800/80 rounded-[28px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden text-white"
            id="ai-chatbot-window"
          >
            {/* Chat Header matching exactly the screenshot but in dark theme */}
            <div className="px-4 py-3.5 bg-neutral-950 border-b border-neutral-900 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Logo & Agent Name */}
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                    G
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                      Gilla_x AI
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 inline-block animate-pulse" />
                      Active Agent
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <button className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors">
                  <MoreHorizontal className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                  id="close-chatbot-btn"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Message Feed Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/40" id="chatbot-feed">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isEmoji = msg.isEmoji;
                
                return (
                  <React.Fragment key={index}>
                    {/* Render "New" separator before the final welcome message */}
                    {index === 3 && (
                      <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-neutral-900" />
                        <span className="mx-3 text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">
                          New
                        </span>
                        <div className="flex-grow border-t border-neutral-900" />
                      </div>
                    )}

                    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {isEmoji ? (
                        <div className="text-5xl my-1 select-none animate-bounce duration-1000">
                          {msg.content}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`max-w-[85%] rounded-[18px] p-3.5 text-xs leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.15)] ${
                            isUser
                              ? "bg-purple-600 text-white rounded-br-none font-medium"
                              : "bg-neutral-900 text-neutral-200 rounded-bl-none border border-neutral-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{renderFormattedText(msg.content)}</p>
                        </motion.div>
                      )}
                      
                      {/* Sub-label under message */}
                      {!isUser && !isEmoji && (
                        <span className="text-[9px] text-neutral-500 mt-1 ml-1 font-sans select-none">
                          Gilla_x AI • AI Agent • Just now
                        </span>
                      )}
                      {isUser && (
                        <span className="text-[9px] text-neutral-500 mt-1 mr-1 font-sans select-none">
                          You • Just now
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-[18px] rounded-bl-none p-3.5 text-xs shadow-sm w-28">
                    <div className="flex space-x-1.5 items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce duration-300" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce duration-300" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce duration-300" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips Suggestions */}
            <div className="px-3 py-2 bg-neutral-950 border-t border-neutral-900 overflow-x-auto no-scrollbar flex space-x-1.5 shrink-0 select-none">
              {QUICK_SUGGESTIONS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(chip.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-[10px] text-neutral-400 hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 disabled:opacity-40"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Container Compound Box - Matches Screenshot */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-900 shrink-0">
              <div className="border border-purple-500/50 hover:border-purple-500/80 rounded-2xl p-2.5 bg-neutral-900 transition-all flex flex-col space-y-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Message..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xs text-white placeholder-neutral-500 outline-none px-1.5"
                  id="chatbot-input-field"
                />
                
                {/* Tool Row inside input box */}
                <div className="flex items-center justify-between pt-1 select-none">
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 font-mono text-[9px] font-black tracking-tighter transition-colors cursor-pointer border border-neutral-800 leading-none">
                      GIF
                    </button>
                    <button className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      inputValue.trim() 
                        ? "bg-purple-600 text-white shadow-sm" 
                        : "bg-neutral-800 text-neutral-600"
                    }`}
                    id="send-chatbot-msg-btn"
                  >
                    <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Launcher Trigger */}
      <div className="relative">
        {hasNewNotification && !isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="absolute bottom-16 right-0 w-64 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] z-20 text-xs text-neutral-200 mb-2 font-sans cursor-pointer flex items-start space-x-2.5"
            onClick={() => {
              setIsOpen(true);
              setHasNewNotification(false);
            }}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shrink-0 mt-0.5 shadow-sm text-xs leading-none">
              G
            </div>
            <div className="space-y-1">
              <p className="font-bold text-purple-400 uppercase text-[10px] tracking-wider font-display">Gilla_x AI</p>
              <p className="text-[11px] leading-relaxed text-neutral-450 opacity-90">Need direct scheduling, WhatsApp, Gilla_x portfolio, or pricing? Chat with me here! 😊</p>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNewNotification(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer border relative ${
            isOpen
              ? "bg-neutral-950 border-neutral-800 text-white"
              : "bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 border-purple-400 text-white shadow-[0_8px_30px_rgba(147,51,234,0.4)]"
          }`}
          id="ai-chatbot-bubble-trigger"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}

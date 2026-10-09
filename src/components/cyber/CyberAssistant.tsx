"use client";

import React, { useState, useEffect } from "react";
import { Bot, Send, User, Terminal, Sparkles } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";
import { useLanguage } from "@/context/LanguageContext";

// Strips raw markdown so the chat is clean text
function formatChatText(text?: string) {
  if (!text) return "";
  return text.replace(/\*\*/g, "").replace(/### /g, "").replace(/---/g, "");
}

export function CyberAssistant() {
  const { currentLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([]);
  const [input, setInput] = useState("");

  const chatScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const displayedMessages = messages.length > 0
    ? messages
    : [{ role: "ai" as const, content: t("chat.greeting") }];

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    soundEngine.playClick();
    const currentList = messages.length > 0 ? messages : [{ role: "ai" as const, content: t("chat.greeting") }];
    const newMessages = [...currentList, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language: currentLanguage }) 
      });
      const data = await res.json();
      soundEngine.playTing();
      
      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, I am having trouble connecting to the neural network." }
        ]);
        return;
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: formatChatText(data.reply) || "Error connecting to AI Assistant." }
      ]);
    } catch {
      soundEngine.playTing();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I am having trouble connecting to the neural network." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="cyber-assistant" className="relative z-20 py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#00f0ff]/20 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-space font-black text-2xl text-white">MULTILINGUAL AI ASSISTANT</h2>
            <p className="font-mono text-xs text-[#00f0ff]">CYBERSATHI // NEURAL CHAT INTERFACE</p>
          </div>
        </div>

        <div className="cyber-hud-card rounded-3xl p-6 h-[500px] flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-md border border-[#00f0ff]/20">
          <div 
            ref={chatScrollContainerRef}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain scroll-smooth space-y-4 pr-2 custom-scrollbar"
          >
            {displayedMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-[#7000ff]/20 border border-[#7000ff]/50 text-[#7000ff]" : "bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff]"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm font-sans max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-neutral-900 border border-neutral-800 text-neutral-200" : "bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[#00f0ff]"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#00f0ff]/20 border border-[#00f0ff]/50 text-[#00f0ff]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl text-sm font-sans max-w-[80%] bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[#00f0ff]">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about digital safety..."
              className="flex-1 bg-black/60 border border-neutral-800 focus:border-[#00f0ff] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
            />
            <button
              aria-label="Send message"
              onClick={handleSend}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-6 py-3 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-[#00f0ff] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

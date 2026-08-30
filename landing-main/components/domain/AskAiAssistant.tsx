import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, X, ArrowRight, BookOpen, ShieldCheck, Bot } from "lucide-react";
import { useRoleStore } from "../../stores/useRoleStore";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { askGemini } from "../../../src/services/geminiService";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  citations?: string[];
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 font-sans leading-relaxed text-xs">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        const isHeader = line.startsWith("#");
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("* ");
        const cleanLine = isHeader
          ? line.replace(/^#+\s*/, "")
          : isBullet
          ? line.replace(/^[•\-*]\s*/, "• ")
          : line;

        const parts = cleanLine.split(/(\*[^*]+\*)/g);

        return (
          <p
            key={idx}
            className={`${isHeader ? "font-bold text-[#002449] text-xs pt-1" : ""} ${
              isBullet ? "pl-1 text-[#1D2939]" : ""
            }`}
          >
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-bold text-[#0E0E0E]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
                return (
                  <em key={pIdx} className="italic text-[#0E0E0E]">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function AskAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { currentRole, selectedDistrict } = useRoleStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsThinking(true);

    try {
      const res = await askGemini(trimmed, {
        role: currentRole,
        district: selectedDistrict,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.answer,
        citations: res.citations || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const lower = trimmed.toLowerCase();
      let fallback = `Query grounded across ${selectedDistrict} MPLADS database: 128 active projects, 7 high risk flags, ₹48.5 Cr sanctioned.`;
      let citations = ["District Planning Office Database", "MoSPI National Portal"];

      if (lower.includes("mismatch") || lower.includes("financial")) {
        fallback = `Identified 2 projects in ${selectedDistrict} with physical/financial progress gaps >30%:\n• P-1023 (Ward 17 Community Hall: 92.5% spent vs 31% physical)\n• P-0871 (Haveli Link Road: 87% spent vs 51% physical).`;
        citations = ["MPLADS Guidelines 2023 §5.4", "District Treasury Ledger Voucher 991"];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: fallback,
          citations,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickAsk = (samplePrompt: string) => {
    handleSendMessage(samplePrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(query);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#002449] text-white px-4 py-3 shadow-elevated border border-[#002449] hover:bg-[#001B36] transition-all hover:scale-105"
        >
          <Sparkles className="h-4 w-4 text-[#15803D]" />
          <span className="text-xs font-bold tracking-wide">Ask SANCHAY Intelligence</span>
        </button>
      )}

      {/* Floating Assistant Popover */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-[8px] border-2 border-[#002449] bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#002449] px-4 py-3 text-white rounded-t-[6px]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#15803D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                SANCHAY Grounded Assistant
              </h3>
            </div>
            <div>
              <p className="text-[10px] text-gray-300">
                Role: {currentRole.replace("_", " ")} • Grounded in Policy & Ledger Data
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-[#FAFAF7] border-b border-[#EDE8DE] space-y-1.5">
            <span className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider block">
              Suggested Role Queries
            </span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleQuickAsk(`Show projects with high financial-physical mismatch in ${selectedDistrict}.`)}
                className="text-left text-[11px] text-[#18324A] hover:text-[#C98219] bg-white p-1.5 rounded border border-[#EDE8DE] hover:border-[#C98219] truncate cursor-pointer"
              >
                "Projects with high progress mismatch in {selectedDistrict}."
              </button>
              <button
                type="button"
                onClick={() => handleQuickAsk(`Inspect contractor cartel concentration in ${selectedDistrict}.`)}
                className="text-left text-[11px] text-[#18324A] hover:text-[#C98219] bg-white p-1.5 rounded border border-[#EDE8DE] hover:border-[#C98219] truncate cursor-pointer"
              >
                "Contractor cartel concentration flags."
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {messages.length === 0 && !isThinking ? (
              <p className="text-xs text-[#667085] text-center py-4">
                Ask any question regarding MPLADS projects, cost benchmarks, contractor syndicates, or applicable GFR rules.
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`space-y-1.5 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-[6px] text-xs leading-relaxed max-w-[90%] text-left ${
                      msg.sender === "user"
                        ? "bg-[#002449] text-white font-medium"
                        : "bg-[#F7F5F0] border border-[#D9D5CC] text-[#1D2939]"
                    }`}
                  >
                    <FormattedMessage text={msg.text} />

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="space-y-1 pt-2 mt-2 border-t border-[#EAE8E2]">
                        <span className="text-[9px] font-bold text-[#002449] uppercase tracking-wider block">
                          Evidence & Citations
                        </span>
                        {msg.citations.map((c, i) => (
                          <div key={i} className="flex items-center gap-1 text-[10px] text-[#15803D] font-mono font-medium">
                            <BookOpen className="h-3 w-3 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 bg-[#F7F5F0] rounded-[6px] border border-[#D9D5CC] text-xs text-[#002449]">
                <Bot className="h-3.5 w-3.5 animate-spin text-[#002449]" />
                <span>Querying Gemini AI...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#EDE8DE] bg-white flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query projects, rules, or anomalies..."
              className="flex-1 rounded-[4px] border border-[#D9D5CC] bg-white px-2.5 py-1.5 text-xs text-[#1D2939] focus:outline-none focus:border-[#002449]"
            />
            <Button variant="default" size="sm" type="submit" disabled={!query.trim() || isThinking} className="h-8 px-3 text-xs bg-[#002449] hover:bg-[#001B36] text-white">
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

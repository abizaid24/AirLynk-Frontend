"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headset, X, Send, Loader2, PlaneTakeoff } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useConciergeStore } from "@/store/concierge-store";
import { toast } from "sonner";

const SUGGESTIONS = [
  "Best flights from Lahore to Tokyo next Friday",
  "What's the baggage allowance for Business class?",
  "Suggest a window seat with the best sunrise view",
];

export function ConciergeWidget() {
  const {
    isOpen,
    setOpen,
    messages,
    addMessage,
    sessionId,
    setSessionId,
  } = useConciergeStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen, sending]);

  async function send(message: string) {
    if (!message.trim() || sending) return;
    setInput("");
    addMessage({ role: "user", content: message, timestamp: new Date().toISOString() });
    setSending(true);
    try {
      const res = await aiService.chat({
        message,
        session_id: sessionId ?? undefined,
      });
      setSessionId(res.session_id);
      addMessage({ role: "assistant", content: res.reply, timestamp: res.timestamp });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full",
          "bg-aurora text-ink-fixed shadow-[0_6px_20px_-6px_rgba(20,13,5,0.55)]",
          "transition-transform hover:scale-105 active:scale-95"
        )}
        aria-label="Open AI Travel Concierge"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Headset className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel fixed bottom-24 right-6 z-40 flex h-[32rem] w-[23rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border-aurora/20"
          >
            <div className="aurora-glow flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-aurora/15 text-aurora">
                <Headset className="size-4.5" />
              </span>
              <div>
                <p className="font-display text-sm text-pearl">AI Travel Concierge</p>
                <p className="text-[11px] text-chrome-dim">Fares, baggage, seats, destinations</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <PlaneTakeoff className="size-8 text-chrome-dim" />
                  <p className="text-sm text-chrome-dim">
                    Ask me anything about flights, fares, or your trip.
                  </p>
                  <div className="flex flex-col gap-2 self-stretch">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-xl border border-border px-3 py-2 text-left text-xs text-chrome transition-colors hover:border-aurora/50 hover:text-aurora"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "self-end bg-aurora text-ink-fixed"
                          : "self-start border border-border bg-navy-800/60 text-pearl"
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex items-center gap-1.5 self-start rounded-2xl border border-border bg-navy-800/60 px-4 py-2.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="size-1.5 rounded-full bg-chrome"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your trip…"
                className="h-10 flex-1 rounded-full border border-input bg-navy-900/60 px-4 text-sm text-pearl placeholder:text-chrome-dim outline-none focus-visible:border-aurora"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aurora text-ink-fixed transition-opacity disabled:opacity-40"
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

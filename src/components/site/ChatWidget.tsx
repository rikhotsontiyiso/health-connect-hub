import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import avatarUrl from "@/assets/ai-assistant-avatar.png";

const QUICK_ACTIONS = [
  { label: "Book an appointment", to: "/appointments" },
  { label: "View our services", to: "/services" },
  { label: "Meet the doctors", to: "/doctors" },
  { label: "Contact the clinic", to: "/contact" },
] as const;

const QUICK_PROMPTS = [
  "What are your opening hours?",
  "Which medical aids do you accept?",
  "How do I prepare for my visit?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  }

  function handleQuickPrompt(text: string) {
    if (isLoading) return;
    sendMessage({ text });
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:brightness-110 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-3 z-50 flex h-[min(600px,calc(100vh-8rem))] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
            <img
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 rounded-full bg-white p-1 ring-1 ring-primary/20"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm leading-tight">Ubuntu Care Assistant</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Online · Replies instantly
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-background to-primary/[0.02]"
          >
            {messages.length === 0 && <Welcome onPrompt={handleQuickPrompt} />}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {status === "submitted" && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                Thinking…
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border bg-surface p-3 flex gap-2 items-end"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              placeholder="Ask about services, hours, doctors…"
              disabled={isLoading}
              className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 max-h-32 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:brightness-110 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="px-3 pb-2 text-[10px] text-muted-foreground text-center">
            AI assistant · Not medical advice. For emergencies call +27 72 345 6789.
          </p>
        </div>
      )}
    </>
  );
}

function Welcome({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl rounded-tl-sm bg-surface border border-border p-4 text-sm">
        <p className="font-medium">
          👋 Welcome to Ubuntu Family Healthcare Clinic!
        </p>
        <p className="mt-1.5 text-muted-foreground">
          I'm your virtual assistant. How can I help you today?
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Quick actions</p>
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium hover:border-primary hover:bg-primary/5 transition"
          >
            <span>{a.label}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
          </Link>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">Or ask me</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onPrompt(p)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:border-primary hover:bg-primary/5 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground whitespace-pre-wrap break-words">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <img
        src={avatarUrl}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="h-7 w-7 rounded-full bg-white p-0.5 ring-1 ring-primary/20 shrink-0 mt-0.5"
      />
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface border border-border px-3.5 py-2 text-sm whitespace-pre-wrap break-words leading-relaxed">
        {text || <span className="text-muted-foreground">…</span>}
      </div>
    </div>
  );
}

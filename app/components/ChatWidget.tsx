"use client";
import { useState, useRef, useEffect } from "react";
import { PROFILE } from "@/lib/content";

type Msg = { role: "user" | "bot"; text: string };
const A = PROFILE.accent;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm Debasish's assistant. Want to automate your business, build an app, or hire him? Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // lock body scroll while the fullscreen chat is open on mobile
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [msgs, loading, open]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 110) + "px";
  }, [input]);

  useEffect(() => {
    if (open)
      setTimeout(() => {
        taRef.current?.focus();
        scrollToBottom();
      }, 150);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    taRef.current?.focus();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: msgs.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      if (!res.ok) {
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            text: `Sorry, I hit a limit for a moment. Please try again, or email ${PROFILE.email}.`,
          },
        ]);
      } else {
        const data = await res.json();
        const reply = data?.reply?.trim();
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            text:
              reply ||
              `Sorry, I didn't catch that. Try again, or email ${PROFILE.email}.`,
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", text: `Network issue. Please email ${PROFILE.email}.` },
      ]);
    }

    setLoading(false);
    setTimeout(() => {
      taRef.current?.focus();
      scrollToBottom();
    }, 50);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // dvh = dynamic viewport height, shrinks when mobile keyboard opens,
  // so the input never hides behind the keyboard.
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        borderRadius: 0,
      }
    : {
        position: "fixed",
        bottom: 24,
        right: 24,
        width: "min(380px, calc(100vw - 32px))",
        height: "min(560px, calc(100vh - 90px))",
        borderRadius: 18,
      };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            zIndex: 1001,
            background: A,
            color: "#0d0d0f",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 28px ${A}66`,
          }}
        >
          {"\uD83D\uDCAC"}
        </button>
      )}

      {open && (
        <div
          style={{
            ...panelStyle,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
            background: "#141418",
            border: isMobile ? "none" : "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            animation: "chatIn .22s ease",
          }}
        >
          <style>{`@keyframes chatIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
          .chat-scroll::-webkit-scrollbar{width:4px}.chat-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:9px}
          @keyframes bnc{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>

          {/* Sticky header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              padding: "14px 16px",
              background: A,
              color: "#0d0d0f",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "#0d0d0f",
              }}
            >
              <img
                src={PROFILE.photo}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>
                Debasish&apos;s Assistant
              </div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>
                ● online · replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#0d0d0f",
                fontSize: 22,
                cursor: "pointer",
                padding: 4,
                lineHeight: 1,
              }}
            >
              {"\u2715"}
            </button>
          </div>

          {/* Scrollable messages - min-height:0 is the key so it scrolls inside flex */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  padding: "9px 13px",
                  borderRadius: 14,
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.role === "user" ? 14 : 4,
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background: m.role === "user" ? A : "rgba(255,255,255,0.07)",
                  color: m.role === "user" ? "#0d0d0f" : "#fff",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.07)",
                  padding: "10px 14px",
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  display: "flex",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "bnc 1s infinite",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "bnc 1s infinite .15s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "bnc 1s infinite .3s",
                  }}
                />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input - stays pinned at bottom */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              background: "rgba(255,255,255,0.03)",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => setTimeout(scrollToBottom, 300)}
              placeholder="Type a message"
              rows={1}
              style={{
                flex: 1,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#0d0d0f",
                color: "#fff",
                padding: "10px 14px",
                fontSize: 16,
                outline: "none",
                resize: "none",
                maxHeight: 110,
                overflowY: "auto",
                fontFamily: "inherit",
                lineHeight: 1.4,
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              aria-label="Send"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                background:
                  input.trim() && !loading ? A : "rgba(255,255,255,0.15)",
                color: "#0d0d0f",
                flexShrink: 0,
                fontSize: 16,
              }}
            >
              {"\u27A4"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

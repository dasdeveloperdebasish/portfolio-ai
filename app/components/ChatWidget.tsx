"use client";
import { useState, useRef, useEffect } from "react";
import { PROFILE } from "@/lib/content";

type Msg = { role: "user" | "bot"; text: string };
const A = PROFILE.accent;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, open]);

  // auto-grow the textarea up to a max height
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 110) + "px";
  }, [input]);

  // focus the input when the chat opens
  useEffect(() => {
    if (open) setTimeout(() => taRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: msgs.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "bot", text: `Network error. Email ${PROFILE.email}.` },
      ]);
    }
    setLoading(false);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          background: A,
          color: "#0d0d0f",
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 28px ${A}66`,
          transition: "transform .2s",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "\u2715" : "\uD83D\uDCAC"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            width: "min(370px, calc(100vw - 32px))",
            height: "min(540px, calc(100vh - 140px))",
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            overflow: "hidden",
            zIndex: 1000,
            background: "#141418",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            animation: "chatIn .22s ease",
          }}
        >
          <style>{`@keyframes chatIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
          .chat-scroll::-webkit-scrollbar{width:4px}.chat-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:9px}`}</style>

          <div
            style={{
              padding: "14px 16px",
              background: A,
              color: "#0d0d0f",
              display: "flex",
              alignItems: "center",
              gap: 10,
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
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.1 }}>
                Debasish&apos;s Assistant
              </div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>
                ● online · replies instantly
              </div>
            </div>
          </div>

          <div
            className="chat-scroll"
            style={{
              flex: 1,
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
                  className="dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "b 1s infinite",
                  }}
                />
                <span
                  className="dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "b 1s infinite .15s",
                  }}
                />
                <span
                  className="dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#888",
                    animation: "b 1s infinite .3s",
                  }}
                />
                <style>{`@keyframes b{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              background: "rgba(255,255,255,0.03)",
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type a message"
              rows={1}
              style={{
                flex: 1,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#0d0d0f",
                color: "#fff",
                padding: "10px 14px",
                fontSize: 14,
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
              aria-label="Send message"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                background:
                  input.trim() && !loading ? A : "rgba(255,255,255,0.15)",
                color: "#0d0d0f",
                flexShrink: 0,
                fontSize: 16,
                transition: "background .2s",
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

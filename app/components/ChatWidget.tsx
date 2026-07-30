"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { PROFILE } from "@/lib/content";

type Msg = { role: "user" | "bot"; text: string };
const A = PROFILE.accent;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // exact visible box, so the panel never gets pushed off-screen by the keyboard
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hey! I'm Debasish's assistant 👋 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pin the panel to the real visible area (shrinks/moves when keyboard opens)
  useEffect(() => {
    if (!open || !isMobile) {
      setBox(null);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setBox({ top: vv.offsetTop, height: vv.height });
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open, isMobile]);

  // lock page behind chat, restore scroll on close
  useEffect(() => {
    if (open && isMobile) {
      const y = window.scrollY;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        window.scrollTo(0, y);
      };
    }
  }, [open, isMobile]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(t);
  }, [msgs, loading, open, scrollToBottom]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  }, [input]);

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
            text: `Sorry, try again in a moment — or email ${PROFILE.email}.`,
          },
        ]);
      } else {
        const data = await res.json();
        const reply = data?.reply?.trim();
        setMsgs((m) => [
          ...m,
          {
            role: "bot",
            text: reply || "Sorry, didn't catch that. Could you say it again?",
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
    }, 60);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // mobile: exact pinned box. desktop: floating card.
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: box ? box.top : 0,
        left: 0,
        right: 0,
        height: box ? box.height : "100dvh",
        borderRadius: 0,
      }
    : {
        position: "fixed",
        bottom: 24,
        right: 24,
        width: "min(380px, calc(100vw - 32px))",
        height: "min(560px, calc(100vh - 90px))",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,.5)",
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
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            background: "#141418",
            overflow: "hidden",
          }}
        >
          <style>{`
            .cwb::-webkit-scrollbar{width:4px}.cwb::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:9px}
            @keyframes bnc{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
          `}</style>

          {/* header - fixed height, always visible */}
          <div
            style={{
              flex: "0 0 auto",
              background: A,
              color: "#0d0d0f",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>
                Debasish&apos;s Assistant
              </div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>● online</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#0d0d0f",
                fontSize: 24,
                cursor: "pointer",
                padding: "4px 6px",
                lineHeight: 1,
              }}
            >
              {"\u2715"}
            </button>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="cwb"
            style={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
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
          </div>

          {/* input */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              padding: 10,
              background: "rgba(255,255,255,.05)",
              borderTop: "1px solid rgba(255,255,255,.07)",
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
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#0d0d0f",
                color: "#fff",
                padding: "10px 14px",
                fontSize: 16,
                outline: "none",
                resize: "none",
                maxHeight: 96,
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

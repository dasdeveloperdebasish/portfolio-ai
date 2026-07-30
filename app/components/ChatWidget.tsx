"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { PROFILE } from "@/lib/content";

type Msg = { role: "user" | "bot"; text: string };
const A = PROFILE.accent;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [kb, setKb] = useState(0); // keyboard height, mobile only
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm Debasish's assistant. Want to automate your business, build an app, or hire him?",
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

  // FIX 3: measure the keyboard and lift ONLY the input bar by that amount.
  // The chat panel itself never moves, so messages stay where they are.
  useEffect(() => {
    if (!open || !isMobile) {
      setKb(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const hidden = window.innerHeight - vv.height - vv.offsetTop;
      setKb(hidden > 60 ? hidden : 0); // >60px means keyboard is up
    };
    onResize();
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, [open, isMobile]);

  // FIX 4: only lock the body while chat is open; restore scroll position after.
  useEffect(() => {
    if (open && isMobile) {
      const y = window.scrollY;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        window.scrollTo(0, y); // put the page back where it was
      };
    }
  }, [open, isMobile]);

  // FIX 4: scroll only the chat container, never the page.
  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // only auto-scroll the chat when it is actually open
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(t);
  }, [msgs, loading, open, scrollToBottom]);

  // keep newest message visible when keyboard opens/closes
  useEffect(() => {
    if (open) setTimeout(scrollToBottom, 120);
  }, [kb, open, scrollToBottom]);

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
    taRef.current?.focus(); // keyboard stays open

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
            text: reply || `Sorry, didn't catch that. Try again?`,
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
        <div className={isMobile ? "cw cw-m" : "cw cw-d"}>
          <style>{`
            .cw{position:fixed;z-index:1000;display:flex;flex-direction:column;background:#141418;overflow:hidden}
            .cw-d{bottom:24px;right:24px;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 90px));border-radius:18px;border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 60px rgba(0,0,0,.5)}
            .cw-m{top:0;left:0;right:0;bottom:0;border-radius:0}
            .cw-head{flex:0 0 auto;background:${A};color:#0d0d0f;display:flex;align-items:center;gap:10px;padding:14px 16px}
            .cw-m .cw-head{padding-top:calc(env(safe-area-inset-top,0px) + 14px)}
            .cw-body{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:8px;overscroll-behavior:contain}
            .cw-body::-webkit-scrollbar{width:4px}.cw-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:9px}
            .cw-foot{flex:0 0 auto;display:flex;gap:8px;align-items:flex-end;padding:10px;background:rgba(255,255,255,.05);border-top:1px solid rgba(255,255,255,.07);transition:margin-bottom .18s ease}
            @keyframes bnc{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
          `}</style>

          <div className="cw-head">
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

          <div ref={scrollRef} className="cw-body">
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

          {/* only this bar lifts with the keyboard */}
          <div
            className="cw-foot"
            style={{
              marginBottom: isMobile ? kb : 0,
              paddingBottom:
                isMobile && kb === 0
                  ? "calc(env(safe-area-inset-bottom,0px) + 10px)"
                  : 10,
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

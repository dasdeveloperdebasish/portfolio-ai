import { PROVIDER } from "@/lib/provider";
import { SYSTEM } from "@/lib/prompt";

export const runtime = "edge";

const MODEL = "openai/gpt-oss-120b";
const PHONE = "+91 70442 00115";
const WA = "https://wa.me/917044200115";
const EMAIL = "dasdeveloperdebasish@gmail.com";

const BUSY_REPLY = `I'm getting a lot of messages right now 🙏 Please reach Debasish directly — WhatsApp ${PHONE} (${WA}) or email ${EMAIL}. He replies fast!`;

// used only if the model returns literally nothing
const EMPTY_REPLY = `You can reach Debasish on WhatsApp ${PHONE} or email ${EMAIL} 🙂`;

async function saveLead(reply: string) {
  const match = reply.match(/LEAD_JSON:\s*(\{[\s\S]*?\})/);
  if (!match) return;
  try {
    const lead = JSON.parse(match[1]);
    const contact = String(lead.contact || "").trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const phone = contact.replace(/\D/g, "").slice(-10);
    const isPhone = /^[6-9]\d{9}$/.test(phone);
    const nameOk = /^[A-Za-z][A-Za-z\s.']{1,}$/.test(lead.name || "");
    if (nameOk && (isEmail || isPhone)) {
      console.log("[lead] saving:", lead);
      if (process.env.SHEET_URL) {
        const r = await fetch(process.env.SHEET_URL, {
          method: "POST",
          body: JSON.stringify(lead),
        });
        console.log("[lead] sheet:", await r.text());
      }
    } else {
      console.log("[lead] invalid:", lead);
    }
  } catch (e) {
    console.log("[lead] parse failed", e);
  }
}

export async function POST(req: Request) {
  let message = "";
  let history: unknown[] = [];

  try {
    const body = await req.json();
    message = body.message ?? "";
    history = Array.isArray(body.history) ? body.history.slice(-20) : [];
  } catch {
    return Response.json({ reply: EMPTY_REPLY });
  }

  if (!message.trim())
    return Response.json({ reply: "Go ahead, I'm listening 🙂" });

  const messages = [
    { role: "system", content: SYSTEM },
    ...history,
    { role: "user", content: message },
  ];

  let res: Response;
  try {
    res = await fetch(PROVIDER.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PROVIDER.key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6, // a bit more variety, less repetition
        frequency_penalty: 0.6, // discourages repeating the same lines
        presence_penalty: 0.3,
        messages,
      }),
    });
  } catch (e) {
    console.error("[groq] network error", e);
    return Response.json({ reply: BUSY_REPLY });
  }

  if (res.status === 429) {
    console.log("[groq] rate limited");
    return Response.json({ reply: BUSY_REPLY });
  }

  if (!res.ok) {
    console.error("[groq] error", res.status, await res.text());
    return Response.json({ reply: BUSY_REPLY });
  }

  const data = await res.json();
  let reply = data?.choices?.[0]?.message?.content?.trim() || "";

  await saveLead(reply);
  reply = reply.replace(/LEAD_JSON:[\s\S]*$/m, "").trim();

  // never show a confusion message - fall back to contact details instead
  if (!reply) reply = EMPTY_REPLY;

  return Response.json({ reply });
}

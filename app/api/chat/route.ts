import { PROVIDER } from "@/lib/provider";
import { SYSTEM } from "@/lib/prompt";

export const runtime = "edge";

// Tried in order. Each model has its own daily quota, so if the first
// is exhausted (429), we automatically fall back to the next.
const MODELS = [
  "openai/gpt-oss-120b", // strongest reasoning
  "llama-3.3-70b-versatile", // strong fallback, separate quota
];
async function callGroq(messages: unknown[]): Promise<Response | null> {
  for (const model of MODELS) {
    try {
      const res = await fetch(PROVIDER.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PROVIDER.key}`,
        },
        body: JSON.stringify({ model, temperature: 0.4, messages }),
      });

      // rate-limited on this model -> try the next one
      if (res.status === 429) {
        console.log(`[groq] ${model} rate-limited, trying next model`);
        continue;
      }
      // any other response (success or a real error) -> return it
      return res;
    } catch (e) {
      console.error(`[groq] ${model} network error`, e);
      continue; // try next model on network hiccup
    }
  }
  return null; // every model exhausted
}

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
        console.log("[lead] sheet response:", await r.text());
      }
    } else {
      console.log("[lead] invalid, not saved:", lead);
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
    return Response.json({
      reply: "Sorry, something went wrong. Please try again.",
    });
  }

  if (!message.trim()) {
    return Response.json({ reply: "Please type a message." });
  }

  const messages = [
    { role: "system", content: SYSTEM },
    ...history,
    { role: "user", content: message },
  ];

  const res = await callGroq(messages);

  // all models exhausted or unreachable
  if (!res) {
    return Response.json({
      reply:
        "I'm getting a lot of messages right now. Please email Debasish at dasdeveloperdebasish@gmail.com and he'll reply fast.",
    });
  }

  if (!res.ok) {
    console.error("[groq] error", res.status, await res.text());
    return Response.json({
      reply:
        "Sorry, I couldn't reply just now. Please email dasdeveloperdebasish@gmail.com.",
    });
  }

  const data = await res.json();
  let reply =
    data?.choices?.[0]?.message?.content?.trim() ||
    "Sorry, I didn't catch that — could you rephrase? Or email dasdeveloperdebasish@gmail.com.";

  // capture lead (if any) then strip the JSON line before replying
  await saveLead(reply);
  reply = reply.replace(/LEAD_JSON:[\s\S]*$/m, "").trim();

  return Response.json({ reply });
}

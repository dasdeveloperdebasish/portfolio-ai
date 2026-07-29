import { PROVIDER } from "@/lib/provider";
import { SYSTEM } from "@/lib/prompt";
export const runtime = "edge";

export async function POST(req: Request) {
  const { message, history = [] } = await req.json();
  try {
    const res = await fetch(PROVIDER.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${PROVIDER.key}` },
      body: JSON.stringify({ model: PROVIDER.model, temperature: 0.4, messages: [{ role: "system", content: SYSTEM }, ...history.slice(-20), { role: "user", content: message }] }),
    });
    if (res.status === 429) return Response.json({ reply: "I'm getting a lot of messages right now. Email dasdeveloperdebasish@gmail.com and he'll reply fast." });
    if (!res.ok) { console.error("API error", res.status, await res.text()); return Response.json({ reply: "Sorry, I couldn't reply. Email dasdeveloperdebasish@gmail.com." }); }
    const data = await res.json();
    let reply = data?.choices?.[0]?.message?.content ?? "Sorry, please email dasdeveloperdebasish@gmail.com.";
    const match = reply.match(/LEAD_JSON:\s*(\{[\s\S]*?\})/);
    if (match) {
      try {
        const lead = JSON.parse(match[1]);
        const contact = String(lead.contact || "").trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const phone = contact.replace(/\D/g, "").slice(-10);
        const isPhone = /^[6-9]\d{9}$/.test(phone);
        const nameOk = /^[A-Za-z][A-Za-z\s.']{1,}$/.test(lead.name || "");
        if (nameOk && (isEmail || isPhone)) {
          console.log("NEW LEAD:", lead);
          if (process.env.SHEET_URL) { const r = await fetch(process.env.SHEET_URL, { method: "POST", body: JSON.stringify(lead) }); console.log("SHEET:", await r.text()); }
        } else console.log("BAD LEAD:", lead);
      } catch (e) { console.log("parse fail", e); }
      reply = reply.replace(/LEAD_JSON:[\s\S]*$/m, "").trim();
    }
    return Response.json({ reply });
  } catch (err) { console.error(err); return Response.json({ reply: "Network problem. Email dasdeveloperdebasish@gmail.com." }); }
}

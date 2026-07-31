import "./globals.css";
import type { Metadata } from "next";
import { PROFILE } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://debasishbuilds.in"),
  title: `${PROFILE.name} — AI Application Engineer & Developer | AI Automation for Business`,
  description:
    "AI Application Engineer with 5+ years building production apps. I help businesses automate customer replies, bookings and leads with AI, and build custom mobile & web apps. Kolkata, India — remote worldwide.",
  keywords: [
    "AI Application Engineer",
    "AI automation for business",
    "AI chatbot developer India",
    "WhatsApp automation",
    "React Native developer India",
    "Next.js developer",
    "hire AI developer",
    "AI booking bot",
    "business automation Kolkata",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: `${PROFILE.name} — AI Application Engineer`,
    description:
      "I help businesses run themselves with AI. Plus custom mobile & web apps.",
    type: "website",
    locale: "en_IN",
    url: "https://debasishbuilds.in",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  url: "https://debasishbuilds.in",
  name: PROFILE.name,
  jobTitle: "AI Application Engineer & React Native Developer",
  email: PROFILE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressCountry: "IN",
  },
  sameAs: [PROFILE.linkedin, PROFILE.github],
  knowsAbout: [
    "AI Application Engineering",
    "Business Automation",
    "AI Chatbots",
    "React Native",
    "Next.js",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.0.0/dist/tabler-icons.min.css"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: "Thread timeline",
  description: "Email thread timeline — React + TypeScript port of the design mockup.",
};

// Runs synchronously in <head> before first paint: resolves the saved theme
// choice (light | dark | auto) to a concrete data-theme, so there's no flash
// of the wrong palette. "auto" follows the OS via prefers-color-scheme.
// See node_modules/next/dist/docs/.../preventing-flash-before-hydration.md
const themeScript = `(function(){try{var c=localStorage.getItem("theme")||"auto";var d=c==="dark"||(c!=="light"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Static, developer-authored string — no user input, so not an XSS vector. */}
        <InlineScript html={themeScript} />
      </head>
      <body className={instrumentSans.variable}>{children}</body>
    </html>
  );
}

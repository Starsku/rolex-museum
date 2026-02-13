import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Crown Archive | Rolex Virtual Museum",
  description: "A luxury digital showcase of Rolex heritage and horological excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-rolex-gold selection:text-white">
        {children}
      </body>
    </html>
  );
}

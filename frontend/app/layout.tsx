import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urban Risk Intelligence Platform",
  description: "AI-powered real-time monitoring and prediction of urban safety risks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
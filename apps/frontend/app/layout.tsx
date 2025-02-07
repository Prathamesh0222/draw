import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeWrapper } from "@/components/ThemeWrapper";

const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Drawtopia",
  description: "Drawtopia is a drawing app for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}

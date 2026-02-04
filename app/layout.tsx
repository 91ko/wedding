import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "혀나곤듀와 새부리의 결혼준비 💕",
  description: "행복한 결혼 준비를 위한 체크리스트",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen touch-manipulation">
        {children}
      </body>
    </html>
  );
}

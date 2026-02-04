"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md">
            💍 혀나곤듀와 새부리의 결혼준비 💍
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-medium">
            행복한 그날을 향해 한 걸음씩
          </p>
        </div>
        <nav className="flex justify-center gap-4">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              pathname === "/"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90"
            }`}
          >
            📋 체크리스트
          </Link>
          <Link
            href="/wedding-hall"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              pathname === "/wedding-hall"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90"
            }`}
          >
            🏰 웨딩홀 투어
          </Link>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-5xl">
        <div className="text-center mb-2 sm:mb-3 md:mb-4">
          <h1 className="text-lg sm:text-3xl md:text-5xl font-bold mb-0.5 sm:mb-1 md:mb-2 drop-shadow-md">
            💍 혀나곤듀와 새부리의 결혼준비 💍
          </h1>
          <p className="text-xs sm:text-base md:text-xl opacity-90 font-medium">
            행복한 그날을 향해 한 걸음씩
          </p>
        </div>
        <nav className="flex justify-center gap-2 sm:gap-4 flex-wrap">
          <Link
            href="/"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            📋 체크리스트
          </Link>
          <Link
            href="/wedding-hall"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/wedding-hall"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            🏰 라붐계약내용
          </Link>
          <Link
            href="/contract-photos"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/contract-photos"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            📄 계약서
          </Link>
          <Link
            href="/guest-list"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/guest-list"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            👥 하객 명단
          </Link>
          <Link
            href="/jeju-snap"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/jeju-snap"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            🌴 제주스냅
          </Link>
          <Link
            href="/studio-schedule"
            className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
              pathname === "/studio-schedule"
                ? "bg-white/30 text-white"
                : "hover:bg-white/20 text-white/90 active:bg-white/25"
            }`}
          >
            📷 스튜디오
          </Link>
        </nav>
      </div>
    </header>
  );
}

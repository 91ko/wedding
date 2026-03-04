"use client";

import Header from "@/components/Header";

export default function OutdoorSnapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              🌿 야외스냅 모음
            </h2>
          </div>
          <div className="w-full" style={{ height: "calc(100vh - 220px)" }}>
            <iframe
              src="/야외스냅모음.pdf"
              className="w-full h-full border-0"
              title="야외스냅 모음"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

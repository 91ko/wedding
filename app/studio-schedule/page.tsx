"use client";

import Header from "@/components/Header";

export default function StudioSchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-3xl">
        {/* 타이틀 */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-800 mb-1">
            📷 웨딩 스튜디오 촬영 일정
          </h2>
          <p className="text-sm sm:text-base text-violet-600 font-medium">
            2026.05.07 (목) | 고유 스튜디오
          </p>
        </div>

        {/* 타임테이블 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-violet-100">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-3">
            <h3 className="text-white font-bold text-base sm:text-lg">
              5월 7일 (목) 촬영 일정
            </h3>
            <p className="text-violet-100 text-xs sm:text-sm">헤어메이크업 → 스튜디오 촬영 → 사진 셀렉</p>
          </div>

          <div className="p-4 space-y-0">
            <TimelineItem
              time="06:50"
              title="헤어 & 메이크업"
              icon="💄"
              location="제이솜"
              details={[
                "오전 6시 50분까지 도착",
                "웨딩 헤어메이크업 진행",
              ]}
              color="pink"
            />
            <TimelineItem
              time="09:00"
              title="스튜디오 촬영"
              icon="📸"
              location="고유 스튜디오"
              details={[
                "오전 9시까지 도착",
                "웨딩 스튜디오 촬영 진행",
              ]}
              color="violet"
            />
            <TimelineItem
              time="~16:00"
              title="사진 셀렉"
              icon="🖼️"
              location="고유 스튜디오"
              details={[
                "당일 오후 4시경",
                "촬영 사진 셀렉 진행",
              ]}
              color="purple"
              isLast
            />
          </div>
        </div>

        {/* 시각적 타임바 */}
        <div className="mt-6 bg-white rounded-2xl shadow-md border border-violet-100 p-4 sm:p-6">
          <h4 className="font-bold text-sm sm:text-base text-violet-700 mb-4">하루 일정 한눈에 보기</h4>
          <div className="relative">
            {/* 시간 눈금 */}
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1 px-0.5">
              <span>6시</span>
              <span>8시</span>
              <span>10시</span>
              <span>12시</span>
              <span>14시</span>
              <span>16시</span>
              <span>18시</span>
            </div>
            {/* 타임바 배경 */}
            <div className="h-8 sm:h-10 bg-gray-100 rounded-full relative overflow-hidden">
              {/* 헤메 06:50 ~ 08:30 (약) */}
              <div
                className="absolute h-full bg-gradient-to-r from-pink-400 to-pink-300 rounded-l-full flex items-center justify-center"
                style={{ left: `${((6 + 50 / 60 - 6) / 12) * 100}%`, width: `${(1.67 / 12) * 100}%` }}
                title="헤어메이크업 06:50~08:30"
              >
                <span className="text-[9px] sm:text-[11px] text-white font-bold whitespace-nowrap">💄 헤메</span>
              </div>
              {/* 스튜디오 09:00 ~ 15:00 (약) */}
              <div
                className="absolute h-full bg-gradient-to-r from-violet-500 to-purple-400 flex items-center justify-center"
                style={{ left: `${((9 - 6) / 12) * 100}%`, width: `${(6 / 12) * 100}%` }}
                title="스튜디오 촬영 09:00~15:00"
              >
                <span className="text-[9px] sm:text-[11px] text-white font-bold whitespace-nowrap">📸 스튜디오 촬영</span>
              </div>
              {/* 셀렉 16:00 ~ 18:00 (약) */}
              <div
                className="absolute h-full bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-r-full flex items-center justify-center"
                style={{ left: `${((16 - 6) / 12) * 100}%`, width: `${(2 / 12) * 100}%` }}
                title="사진 셀렉 16:00~18:00"
              >
                <span className="text-[9px] sm:text-[11px] text-white font-bold whitespace-nowrap">🖼️ 셀렉</span>
              </div>
            </div>
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-white rounded-xl border-2 border-pink-200 p-3 sm:p-4 text-center">
            <span className="text-2xl sm:text-3xl">💄</span>
            <h4 className="font-bold text-sm sm:text-base text-pink-700 mt-1">헤어메이크업</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">제이솜</p>
            <p className="text-lg sm:text-xl font-bold text-pink-600 mt-1">06:50</p>
            <p className="text-[10px] sm:text-xs text-gray-400">까지 도착</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-violet-200 p-3 sm:p-4 text-center">
            <span className="text-2xl sm:text-3xl">📸</span>
            <h4 className="font-bold text-sm sm:text-base text-violet-700 mt-1">스튜디오 촬영</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">고유 스튜디오</p>
            <p className="text-lg sm:text-xl font-bold text-violet-600 mt-1">09:00</p>
            <p className="text-[10px] sm:text-xs text-gray-400">까지 도착</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-purple-200 p-3 sm:p-4 text-center">
            <span className="text-2xl sm:text-3xl">🖼️</span>
            <h4 className="font-bold text-sm sm:text-base text-purple-700 mt-1">사진 셀렉</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">고유 스튜디오</p>
            <p className="text-lg sm:text-xl font-bold text-purple-600 mt-1">~16:00</p>
            <p className="text-[10px] sm:text-xs text-gray-400">당일 오후</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* 타임라인 아이템 컴포넌트 */
function TimelineItem({
  time,
  title,
  icon,
  location,
  details,
  color,
  isLast = false,
}: {
  time: string;
  title: string;
  icon: string;
  location: string;
  details: string[];
  color: string;
  isLast?: boolean;
}) {
  const dotColors: Record<string, string> = {
    pink: "bg-pink-500",
    violet: "bg-violet-500",
    purple: "bg-purple-500",
  };

  const bgColors: Record<string, string> = {
    pink: "bg-pink-50",
    violet: "bg-violet-50",
    purple: "bg-purple-50",
  };

  const locationColors: Record<string, string> = {
    pink: "text-pink-600 bg-pink-100",
    violet: "text-violet-600 bg-violet-100",
    purple: "text-purple-600 bg-purple-100",
  };

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* 타임라인 라인 */}
      <div className="flex flex-col items-center w-12 sm:w-16 shrink-0">
        <span className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap">
          {time}
        </span>
        <div className={`w-3 h-3 rounded-full ${dotColors[color] || "bg-gray-400"} mt-1 shrink-0`} />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 min-h-[20px]" />}
      </div>

      {/* 내용 */}
      <div className={`${bgColors[color] || "bg-gray-50"} rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 mb-3 flex-1`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base sm:text-lg">{icon}</span>
          <span className="font-bold text-sm sm:text-base text-gray-800">{title}</span>
        </div>
        <span className={`inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full mb-1.5 ${locationColors[color] || "text-gray-600 bg-gray-100"}`}>
          📍 {location}
        </span>
        <ul className="space-y-0.5">
          {details.map((detail, i) => (
            <li key={i} className="text-xs sm:text-sm text-gray-600 pl-6">
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

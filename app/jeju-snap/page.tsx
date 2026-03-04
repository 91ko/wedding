"use client";

import Header from "@/components/Header";

export default function JejuSnapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-3xl">
        {/* 타이틀 */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800 mb-1">
            🌴 제주 야외스냅 여행
          </h2>
          <p className="text-sm sm:text-base text-sky-600 font-medium">
            2026.06.04 (목) ~ 2026.06.06 (토)
          </p>
        </div>

        {/* 타임테이블 */}
        <div className="space-y-6">
          {/* DAY 1 - 6/4 목요일 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-sky-100">
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-3">
              <h3 className="text-white font-bold text-base sm:text-lg">
                DAY 1 - 6월 4일 (목)
              </h3>
              <p className="text-sky-100 text-xs sm:text-sm">광주 → 제주 이동</p>
            </div>
            <div className="p-4 space-y-0">
              <TimelineItem
                time="18:00"
                endTime="18:44"
                title="광주 → 제주 비행"
                icon="✈️"
                details={[
                  "아시아나항공 OZ8147",
                  "무료수화물 20KG",
                ]}
                color="sky"
              />
              <TimelineItem
                time="19:00"
                title="제주 도착 & 이동"
                icon="🚗"
                details={["공항 → 숙소 이동"]}
                color="slate"
              />
              <TimelineItem
                time="~20:00"
                title="숙소 체크인"
                icon="🏨"
                details={[
                  "라마다 제주 시티홀",
                  "셀프체크인 (15시~)",
                  "SUV 주변주차장 이용",
                ]}
                color="indigo"
                isLast
              />
            </div>
          </div>

          {/* DAY 2 - 6/5 금요일 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-sky-100">
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-3">
              <h3 className="text-white font-bold text-base sm:text-lg">
                DAY 2 - 6월 5일 (금)
              </h3>
              <p className="text-orange-100 text-xs sm:text-sm">야외스냅 촬영 & 자유시간</p>
            </div>
            <div className="p-4 space-y-0">
              <TimelineItem
                time="10:00"
                title="렌트카 픽업"
                icon="🚗"
                details={["렌트 시작"]}
                color="amber"
              />
              <TimelineItem
                time="TBD"
                title="야외스냅 촬영"
                icon="📸"
                details={[
                  "필름블랭크 스튜디오",
                  "촬영비 50만원",
                  "예약금 15만원 입금 완료 ✅",
                ]}
                color="rose"
              />
              <TimelineItem
                time=""
                title="제주 자유시간"
                icon="🌊"
                details={["관광 / 맛집 탐방"]}
                color="teal"
                isLast
              />
            </div>
          </div>

          {/* DAY 3 - 6/6 토요일 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-sky-100">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3">
              <h3 className="text-white font-bold text-base sm:text-lg">
                DAY 3 - 6월 6일 (토)
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm">제주 → 광주 복귀</p>
            </div>
            <div className="p-4 space-y-0">
              <TimelineItem
                time="11:00"
                title="숙소 체크아웃"
                icon="🏨"
                details={["체크아웃 마감 11시"]}
                color="emerald"
              />
              <TimelineItem
                time="12:00"
                title="렌트카 반납"
                icon="🚗"
                details={["렌트카 반납"]}
                color="amber"
              />
              <TimelineItem
                time="13:10"
                endTime="14:05"
                title="제주 → 광주 비행"
                icon="✈️"
                details={[
                  "아시아나항공 OZ8144",
                  "무료수화물 20KG",
                ]}
                color="sky"
                isLast
              />
            </div>
          </div>
        </div>

        {/* 요약 카드들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {/* 숙소 */}
          <SummaryCard
            icon="🏨"
            title="숙소"
            items={[
              { label: "호텔", value: "라마다 제주 시티홀" },
              { label: "기간", value: "6/4 ~ 6/6 (2박)" },
              { label: "체크인", value: "15시~ (셀프)" },
              { label: "체크아웃", value: "11시" },
              { label: "주차", value: "SUV 주변주차장" },
            ]}
            color="indigo"
          />

          {/* 항공 */}
          <SummaryCard
            icon="✈️"
            title="항공"
            items={[
              { label: "항공사", value: "아시아나항공" },
              { label: "가는편", value: "OZ8147 18:00→18:44" },
              { label: "오는편", value: "OZ8144 13:10→14:05" },
              { label: "수화물", value: "20KG 무료" },
            ]}
            color="sky"
          />

          {/* 렌트카 */}
          <SummaryCard
            icon="🚗"
            title="렌트카"
            items={[
              { label: "픽업", value: "6/5 (금) 10:00" },
              { label: "반납", value: "6/6 (토) 12:00" },
            ]}
            color="amber"
          />

          {/* 촬영 */}
          <SummaryCard
            icon="📸"
            title="야외스냅 촬영"
            items={[
              { label: "스튜디오", value: "필름블랭크" },
              { label: "촬영비", value: "500,000원" },
              { label: "예약금", value: "150,000원 (입금완료)" },
              { label: "잔금", value: "350,000원" },
            ]}
            color="rose"
          />
        </div>
      </main>
    </div>
  );
}

/* 타임라인 아이템 컴포넌트 */
function TimelineItem({
  time,
  endTime,
  title,
  icon,
  details,
  color,
  isLast = false,
}: {
  time: string;
  endTime?: string;
  title: string;
  icon: string;
  details: string[];
  color: string;
  isLast?: boolean;
}) {
  const dotColors: Record<string, string> = {
    sky: "bg-sky-500",
    slate: "bg-slate-400",
    indigo: "bg-indigo-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    teal: "bg-teal-500",
    emerald: "bg-emerald-500",
  };

  const bgColors: Record<string, string> = {
    sky: "bg-sky-50",
    slate: "bg-slate-50",
    indigo: "bg-indigo-50",
    amber: "bg-amber-50",
    rose: "bg-rose-50",
    teal: "bg-teal-50",
    emerald: "bg-emerald-50",
  };

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* 타임라인 라인 */}
      <div className="flex flex-col items-center w-12 sm:w-16 shrink-0">
        <span className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap">
          {time}
        </span>
        {endTime && (
          <span className="text-[10px] sm:text-xs text-gray-400">~{endTime}</span>
        )}
        <div className={`w-3 h-3 rounded-full ${dotColors[color] || "bg-gray-400"} mt-1 shrink-0`} />
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 min-h-[20px]" />}
      </div>

      {/* 내용 */}
      <div className={`${bgColors[color] || "bg-gray-50"} rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 mb-3 flex-1`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base sm:text-lg">{icon}</span>
          <span className="font-bold text-sm sm:text-base text-gray-800">{title}</span>
        </div>
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

/* 요약 카드 컴포넌트 */
function SummaryCard({
  icon,
  title,
  items,
  color,
}: {
  icon: string;
  title: string;
  items: { label: string; value: string }[];
  color: string;
}) {
  const borderColors: Record<string, string> = {
    sky: "border-sky-200",
    indigo: "border-indigo-200",
    amber: "border-amber-200",
    rose: "border-rose-200",
  };

  const titleColors: Record<string, string> = {
    sky: "text-sky-700",
    indigo: "text-indigo-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColors[color] || "border-gray-200"} p-3 sm:p-4`}>
      <h4 className={`font-bold text-sm sm:text-base ${titleColors[color] || "text-gray-700"} mb-2 flex items-center gap-1.5`}>
        <span>{icon}</span> {title}
      </h4>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

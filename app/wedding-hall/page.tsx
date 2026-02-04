"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HallTourRow from "@/components/HallTourRow";
import {
  createInitialHallTourRows,
  WEDDING_HALL_TOUR_TIPS,
  type WeddingHallTourData,
  type HallTourRow as HallTourRowType,
} from "@/data/weddingHallTour";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const HALL_IDS = ["1", "2"] as const;
const FIRESTORE_PREFIX = "wedding-hall-tour-";
const DEFAULT_HALL_NAMES: Record<string, string> = {
  "1": "위더스",
  "2": "더시그너스",
};

function getDefaultData(hallId: string): WeddingHallTourData {
  return {
    hallName: DEFAULT_HALL_NAMES[hallId] ?? "웨딩홀",
    rows: createInitialHallTourRows(),
    updatedAt: new Date().toISOString(),
  };
}

export default function WeddingHallPage() {
  const [currentHallId, setCurrentHallId] = useState<"1" | "2">("1");
  const [dataByHall, setDataByHall] = useState<Record<string, WeddingHallTourData>>({
    "1": getDefaultData("1"),
    "2": getDefaultData("2"),
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const firestoreKey = (hallId: string) => `${FIRESTORE_PREFIX}${hallId}`;

  const saveToFirebase = async (hallId: string, newData: WeddingHallTourData) => {
    try {
      await setDoc(doc(db, "wedding", firestoreKey(hallId)), {
        ...newData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("웨딩홀 투어 Firebase 저장 실패:", error);
      localStorage.setItem(`wedding-hall-tour-${hallId}`, JSON.stringify(newData));
    }
  };

  useEffect(() => {
    setMounted(true);

    const unsubscribes = HALL_IDS.map((hallId) =>
      onSnapshot(
        doc(db, "wedding", firestoreKey(hallId)),
        (docSnapshot) => {
          setDataByHall((prev) => {
            const next = { ...prev };
            if (docSnapshot.exists()) {
              const raw = docSnapshot.data();
              const rows = Array.isArray(raw.rows)
                ? (raw.rows as HallTourRowType[])
                : createInitialHallTourRows();
              next[hallId] = {
                hallName: (raw.hallName as string) ?? DEFAULT_HALL_NAMES[hallId],
                rows,
                updatedAt: raw.updatedAt as string,
              };
            } else {
              const defaultData = getDefaultData(hallId);
              next[hallId] = defaultData;
              saveToFirebase(hallId, defaultData);
            }
            return next;
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("웨딩홀 투어 Firebase 리스너 오류:", error);
          const saved = localStorage.getItem(`wedding-hall-tour-${hallId}`);
          if (saved) {
            try {
              setDataByHall((prev) => ({
                ...prev,
                [hallId]: JSON.parse(saved),
              }));
            } catch {
              setDataByHall((prev) => ({
                ...prev,
                [hallId]: getDefaultData(hallId),
              }));
            }
          }
          setIsLoading(false);
        }
      )
    );

    return () => unsubscribes.forEach((u) => u());
  }, []);

  const data = dataByHall[currentHallId] ?? getDefaultData(currentHallId);

  const updateRow = (rowId: string, updates: Partial<HallTourRowType>) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? { ...r, ...updates } : r
    );
    const newData = { ...data, rows: newRows };
    setDataByHall((prev) => ({ ...prev, [currentHallId]: newData }));
    saveToFirebase(currentHallId, newData);
  };

  const toggleRowCheck = (rowId: string) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? { ...r, checked: !r.checked } : r
    );
    const newData = { ...data, rows: newRows };
    setDataByHall((prev) => ({ ...prev, [currentHallId]: newData }));
    saveToFirebase(currentHallId, newData);
  };

  const updateHallName = (hallName: string) => {
    const newData = { ...data, hallName };
    setDataByHall((prev) => ({ ...prev, [currentHallId]: newData }));
    saveToFirebase(currentHallId, newData);
  };

  const completedCount = data.rows.filter((r) => r.checked).length;
  const totalCount = data.rows.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">웨딩홀 투어 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-safe">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* 위더스 / 더시그너스 탭 */}
        <div className="flex gap-2 mb-4 sm:mb-6 rounded-xl bg-white/80 p-1.5 shadow-inner border border-pink-100">
          {HALL_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentHallId(id as "1" | "2")}
              className={`flex-1 min-h-[48px] rounded-lg font-semibold text-sm sm:text-base transition ${
                currentHallId === id
                  ? "bg-pink-500 text-white shadow"
                  : "bg-transparent text-gray-600 hover:bg-pink-100 active:bg-pink-200"
              }`}
            >
              {DEFAULT_HALL_NAMES[id]}
            </button>
          ))}
        </div>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium text-gray-700">웨딩홀 이름</label>
            <input
              type="text"
              value={data.hallName}
              onChange={(e) => updateHallName(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 sm:py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-base"
              placeholder="예: OOO 웨딩홀"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-pink-600">{completedCount}</span>
            <span>/ {totalCount}</span>
            <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <details className="mb-4 sm:mb-6">
          <summary className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 cursor-pointer select-none touch-manipulation">
            💡 투어 전 꿀팁 보기
          </summary>
          <div className="mt-2 bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 whitespace-pre-line">
            {WEDDING_HALL_TOUR_TIPS}
          </div>
        </details>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-x-auto -mx-3 sm:mx-0">
          <p className="md:sr-only px-3 py-2 text-xs text-gray-500">
            표가 넓어요. 가로로 스크롤해서 보세요 →
          </p>
          <table className="w-full min-w-[700px] sm:min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-200">
                <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  구분
                </th>
                <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  항목
                </th>
                <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">
                  신부
                </th>
                <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">
                  신랑
                </th>
                <th className="px-3 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 w-14 sm:w-16">
                  완료
                </th>
                <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 max-w-[120px] sm:max-w-[160px]">
                  메모
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <HallTourRow
                  key={row.id}
                  row={row}
                  onUpdate={(updates) => updateRow(row.id, updates)}
                  onToggleCheck={() => toggleRowCheck(row.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-sm pb-8">
          <p>혀나곤듀 💕💕</p>
        </div>
      </main>
    </div>
  );
}

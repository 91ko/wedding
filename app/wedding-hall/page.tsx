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

const HALL_IDS = ["3"] as const;
const FIRESTORE_PREFIX = "wedding-hall-tour-";
const DEFAULT_HALL_NAMES: Record<string, string> = {
  "3": "라붐",
};

function getDefaultData(hallId: string): WeddingHallTourData {
  return {
    hallName: DEFAULT_HALL_NAMES[hallId] ?? "웨딩홀",
    rows: createInitialHallTourRows(),
    updatedAt: new Date().toISOString(),
  };
}

export default function WeddingHallPage() {
  const [currentHallId, setCurrentHallId] = useState<string>("3");
  const [dataByHall, setDataByHall] = useState<Record<string, WeddingHallTourData>>({
    "3": getDefaultData("3"),
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

        <div className="space-y-2">
          {(() => {
            let lastCategory = "";
            return data.rows.map((row) => {
              const showCategory = row.category !== lastCategory;
              lastCategory = row.category;
              return (
                <div key={row.id}>
                  {showCategory && (
                    <div className="mt-3 mb-1.5 first:mt-0">
                      <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg">
                        {row.category}
                      </span>
                    </div>
                  )}
                  <HallTourRow
                    row={row}
                    onUpdate={(updates) => updateRow(row.id, updates)}
                    onToggleCheck={() => toggleRowCheck(row.id)}
                  />
                </div>
              );
            });
          })()}
        </div>

        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-sm pb-8">
          <p>혀나곤듀 💕💕</p>
        </div>
      </main>
    </div>
  );
}

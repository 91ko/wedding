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

const FIRESTORE_KEY = "wedding-hall-tour";
const DEFAULT_HALL_NAME = "웨딩홀 1";

function getDefaultData(): WeddingHallTourData {
  return {
    hallName: DEFAULT_HALL_NAME,
    rows: createInitialHallTourRows(),
    updatedAt: new Date().toISOString(),
  };
}

export default function WeddingHallPage() {
  const [data, setData] = useState<WeddingHallTourData>(getDefaultData());
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const saveToFirebase = async (newData: WeddingHallTourData) => {
    try {
      await setDoc(doc(db, "wedding", FIRESTORE_KEY), {
        ...newData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("웨딩홀 투어 Firebase 저장 실패:", error);
      localStorage.setItem("wedding-hall-tour", JSON.stringify(newData));
    }
  };

  useEffect(() => {
    setMounted(true);

    const unsubscribe = onSnapshot(
      doc(db, "wedding", FIRESTORE_KEY),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const raw = docSnapshot.data();
          const rows = Array.isArray(raw.rows)
            ? (raw.rows as HallTourRowType[])
            : createInitialHallTourRows();
          setData({
            hallName: (raw.hallName as string) ?? DEFAULT_HALL_NAME,
            rows,
            updatedAt: raw.updatedAt as string,
          });
        } else {
          const defaultData = getDefaultData();
          setData(defaultData);
          saveToFirebase(defaultData);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("웨딩홀 투어 Firebase 리스너 오류:", error);
        const saved = localStorage.getItem("wedding-hall-tour");
        if (saved) {
          try {
            setData(JSON.parse(saved));
          } catch {
            setData(getDefaultData());
          }
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateRow = (rowId: string, updates: Partial<HallTourRowType>) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? { ...r, ...updates } : r
    );
    const newData = { ...data, rows: newRows };
    setData(newData);
    saveToFirebase(newData);
  };

  const toggleRowCheck = (rowId: string) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? { ...r, checked: !r.checked } : r
    );
    const newData = { ...data, rows: newRows };
    setData(newData);
    saveToFirebase(newData);
  };

  const updateHallName = (hallName: string) => {
    const newData = { ...data, hallName };
    setData(newData);
    saveToFirebase(newData);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">웨딩홀 이름</label>
            <input
              type="text"
              value={data.hallName}
              onChange={(e) => updateHallName(e.target.value)}
              className="px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              placeholder="예: OOO 웨딩홀"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-pink-600">{completedCount}</span>
            <span>/ {totalCount}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900 whitespace-pre-line">
          {WEDDING_HALL_TOUR_TIPS}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-200">
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                  구분
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                  항목
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                  신부 (질문/메모)
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700">
                  신랑 (답/체크)
                </th>
                <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700 w-16">
                  완료
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 max-w-[160px]">
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

        <div className="mt-8 text-center text-gray-500 text-sm pb-8">
          <p>💕 실시간 동기화 - 신부가 묻고 신랑이 답 적기 💕</p>
        </div>
      </main>
    </div>
  );
}

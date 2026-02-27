"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import GuestListRow from "@/components/GuestListRow";
import {
  initialGuestRows,
  GUEST_SLOTS_PER_ROW,
  type GuestListData,
  type GuestRow,
} from "@/data/guestList";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const FIRESTORE_KEY = "guest-list";

function normalizeRow(r: GuestRow): GuestRow {
  const guests = Array.isArray(r.guests)
    ? [...r.guests]
    : [];
  while (guests.length < GUEST_SLOTS_PER_ROW) guests.push("");
  return {
    ...r,
    headcount: r.headcount ?? "",
    attendance: r.attendance ?? "",
    notes: r.notes ?? "",
    guests: guests.slice(0, GUEST_SLOTS_PER_ROW),
  };
}

function getDefaultData(): GuestListData {
  return {
    rows: initialGuestRows.map(normalizeRow),
    updatedAt: new Date().toISOString(),
  };
}

export default function GuestListPage() {
  const [data, setData] = useState<GuestListData>(getDefaultData());
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"전체" | "신랑 측" | "신부 측">("전체");

  const saveToFirebase = async (newData: GuestListData) => {
    try {
      await setDoc(doc(db, "wedding", FIRESTORE_KEY), {
        ...newData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("하객 명단 Firebase 저장 실패:", error);
      localStorage.setItem(FIRESTORE_KEY, JSON.stringify(newData));
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
            ? (raw.rows as GuestRow[]).map(normalizeRow)
            : getDefaultData().rows;
          setData({
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
        console.error("하객 명단 Firebase 리스너 오류:", error);
        const saved = localStorage.getItem(FIRESTORE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as GuestListData;
            setData({ ...parsed, rows: parsed.rows.map(normalizeRow) });
          } catch {
            setData(getDefaultData());
          }
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateRow = (rowId: string, updates: Partial<GuestRow>) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? normalizeRow({ ...r, ...updates }) : r
    );
    const newData = { ...data, rows: newRows };
    setData(newData);
    saveToFirebase(newData);
  };

  const addRow = () => {
    const maxNumber = data.rows.reduce((max, r) => Math.max(max, r.number), 0);
    const newRow: GuestRow = {
      id: `guest-row-${Date.now()}`,
      number: maxNumber + 1,
      side: activeTab === "전체" ? "" : activeTab,
      relation: "",
      nameGroup: "",
      headcount: "",
      attendance: "",
      notes: "",
      guests: Array(GUEST_SLOTS_PER_ROW).fill(""),
    };
    const newData = { ...data, rows: [...data.rows, newRow] };
    setData(newData);
    saveToFirebase(newData);
  };

  const deleteRow = (rowId: string) => {
    const newRows = data.rows
      .filter((r) => r.id !== rowId)
      .map((r, i) => ({ ...r, number: i + 1 }));
    const newData = { ...data, rows: newRows };
    setData(newData);
    saveToFirebase(newData);
  };

  const filteredRows = activeTab === "전체"
    ? data.rows
    : data.rows.filter((r) => r.side === activeTab);

  const getStats = (rows: GuestRow[]) => ({
    total: rows.reduce((sum, r) => sum + (typeof r.headcount === "number" ? r.headcount : 0), 0),
    attended: rows.filter((r) => r.attendance === "O").length,
    count: rows.length,
  });

  const allStats = getStats(data.rows);
  const groomStats = getStats(data.rows.filter((r) => r.side === "신랑 측"));
  const brideStats = getStats(data.rows.filter((r) => r.side === "신부 측"));
  const currentStats = getStats(filteredRows);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">하객 명단 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-safe">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[1600px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            👥 하객 명단
          </h2>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-pink-600">참석 O</span> {currentStats.attended}팀 · 예상 인원 <span className="font-semibold text-pink-600">{currentStats.total}명</span>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
          {([
            { key: "전체" as const, label: "전체", stats: allStats },
            { key: "신랑 측" as const, label: "신랑 측", stats: groomStats },
            { key: "신부 측" as const, label: "신부 측", stats: brideStats },
          ]).map(({ key, label, stats }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === key
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500 active:bg-gray-200"
              }`}
            >
              {label}
              <span className="ml-1 text-xs font-normal">({stats.total}명)</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredRows.map((row) => (
            <GuestListRow
              key={row.id}
              row={row}
              onUpdate={(updates) => updateRow(row.id, updates)}
              onDelete={() => deleteRow(row.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-pink-300 text-pink-500 font-semibold text-sm active:bg-pink-50 transition"
        >
          + 카드 추가
        </button>

        <div className="mt-6 text-center text-gray-500 text-sm pb-8">
          <p>혀나곤듀 💕💕</p>
        </div>
      </main>
    </div>
  );
}

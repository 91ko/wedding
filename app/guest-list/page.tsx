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

  const totalGuests = data.rows.reduce(
    (sum, r) => sum + (typeof r.headcount === "number" ? r.headcount : 0),
    0
  );
  const attended = data.rows.filter((r) => r.attendance === "O").length;

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
            <span className="font-semibold text-pink-600">참석 O</span> {attended}팀 · 예상 인원 <span className="font-semibold text-pink-600">{totalGuests}명</span>
          </div>
        </div>

        <div className="space-y-2">
          {data.rows.map((row) => (
            <GuestListRow
              key={row.id}
              row={row}
              onUpdate={(updates) => updateRow(row.id, updates)}
            />
          ))}
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm pb-8">
          <p>혀나곤듀 💕💕</p>
        </div>
      </main>
    </div>
  );
}

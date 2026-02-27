"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import {
  createInitialHallTourRows,
  CURRENT_DATA_VERSION,
  type WeddingHallTourData,
  type HallTourRow,
} from "@/data/weddingHallTour";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const HALL_ID = "3";
const FIRESTORE_KEY = "wedding-hall-tour-3";
const HALL_NAME = "라붐";

const CATEGORY_ORDER = ["비용", "예식", "스드메", "옵션", "식사", "환불/변경", "기타"];

function getDefaultData(): WeddingHallTourData {
  return {
    hallName: HALL_NAME,
    rows: createInitialHallTourRows(),
    dataVersion: CURRENT_DATA_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

function groupByCategory(rows: HallTourRow[]): Record<string, HallTourRow[]> {
  const grouped: Record<string, HallTourRow[]> = {};
  for (const row of rows) {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push(row);
  }
  return grouped;
}

/* ── Inline edit components ── */

function StarsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const stars = value?.match(/⭐/g);
  const count = stars ? stars.length : 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange("⭐".repeat(n))}
          className="text-lg active:scale-125 transition-transform"
        >
          {n <= count ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

function CheckboxEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {["유", "무"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            value === opt
              ? "bg-pink-500 text-white"
              : "bg-gray-100 text-gray-600 active:bg-pink-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function TextValueEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(text);
              setEditing(false);
            }
            if (e.key === "Escape") {
              setText(value);
              setEditing(false);
            }
          }}
          className="flex-1 min-w-0 px-2 py-1 text-sm border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 bg-white"
        />
        <button
          type="button"
          onClick={() => {
            onSave(text);
            setEditing(false);
          }}
          className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg flex-shrink-0"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => {
            setText(value);
            setEditing(false);
          }}
          className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-lg flex-shrink-0"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="text-sm text-gray-800 active:bg-pink-50 rounded px-1.5 py-0.5 text-left min-h-[28px] w-full"
    >
      {value || (
        <span className="text-gray-400 italic">탭하여 입력</span>
      )}
    </button>
  );
}

function MemoEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  if (editing) {
    return (
      <div className="mt-1 flex items-center gap-1.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(text);
              setEditing(false);
            }
            if (e.key === "Escape") {
              setText(value);
              setEditing(false);
            }
          }}
          className="flex-1 min-w-0 px-2 py-1 text-xs border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 bg-white"
          placeholder="메모 입력"
          autoFocus
        />
        <button
          type="button"
          onClick={() => {
            onSave(text);
            setEditing(false);
          }}
          className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg flex-shrink-0"
        >
          저장
        </button>
      </div>
    );
  }

  if (!value) return null;

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="mt-0.5 text-xs text-gray-400 active:text-gray-600 text-left w-full"
    >
      {value}
    </button>
  );
}

/* ── Category Card ── */

function CategoryCard({
  category,
  rows,
  onUpdateRow,
}: {
  category: string;
  rows: HallTourRow[];
  onUpdateRow: (rowId: string, updates: Partial<HallTourRow>) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 active:bg-pink-50 transition-colors"
      >
        <span className="text-sm font-bold text-pink-600">{category}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">
          {rows.map((row) => (
            <div key={row.id} className="px-4 py-2.5">
              {/* 항목명 */}
              <div className="text-xs font-medium text-gray-500 mb-1">
                {row.item}
              </div>
              {/* 값 */}
              <div>
                {row.inputType === "stars" ? (
                  <StarsEditor
                    value={row.groomValue ?? ""}
                    onChange={(v) => onUpdateRow(row.id, { groomValue: v })}
                  />
                ) : row.inputType === "checkbox" ? (
                  <CheckboxEditor
                    value={row.groomValue ?? ""}
                    onChange={(v) => onUpdateRow(row.id, { groomValue: v })}
                  />
                ) : (
                  <TextValueEditor
                    value={row.groomValue ?? ""}
                    onSave={(v) => onUpdateRow(row.id, { groomValue: v })}
                  />
                )}
              </div>
              {/* 메모 */}
              <MemoEditor
                value={row.userMemo ?? ""}
                onSave={(v) => onUpdateRow(row.id, { userMemo: v })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */

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
      console.error("Firebase 저장 실패:", error);
    }
  };

  useEffect(() => {
    setMounted(true);

    const unsub = onSnapshot(
      doc(db, "wedding", FIRESTORE_KEY),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const raw = docSnapshot.data();
          const version = (raw.dataVersion as number) ?? 0;

          // 구버전 데이터 → 새 계약 정보 구조로 마이그레이션
          if (version < CURRENT_DATA_VERSION) {
            const newData = getDefaultData();
            setData(newData);
            saveToFirebase(newData);
          } else {
            const rows = Array.isArray(raw.rows)
              ? (raw.rows as HallTourRow[])
              : createInitialHallTourRows();
            setData({
              hallName: (raw.hallName as string) ?? HALL_NAME,
              rows,
              dataVersion: CURRENT_DATA_VERSION,
              updatedAt: raw.updatedAt as string,
            });
          }
        } else {
          const defaultData = getDefaultData();
          setData(defaultData);
          saveToFirebase(defaultData);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Firebase 리스너 오류:", error);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const updateRow = (rowId: string, updates: Partial<HallTourRow>) => {
    const newRows = data.rows.map((r) =>
      r.id === rowId ? { ...r, ...updates } : r
    );
    const newData = { ...data, rows: newRows };
    setData(newData);
    saveToFirebase(newData);
  };

  const grouped = groupByCategory(data.rows);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-safe">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        {/* 웨딩홀 이름 헤더 */}
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold text-gray-800">{data.hallName}</h2>
          <p className="text-xs text-gray-400 mt-1">계약 정보</p>
        </div>

        {/* 카테고리별 카드 */}
        <div className="space-y-3">
          {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              rows={grouped[cat]}
              onUpdateRow={updateRow}
            />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-sm pb-8">
          <p>혀나곤듀</p>
        </div>
      </main>
    </div>
  );
}

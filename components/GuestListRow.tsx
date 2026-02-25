"use client";

import { useState, useEffect } from "react";
import type { GuestRow } from "@/data/guestList";
import { GUEST_SLOTS_PER_ROW } from "@/data/guestList";

interface GuestListRowProps {
  row: GuestRow;
  onUpdate: (updates: Partial<GuestRow>) => void;
}

const SIDES = ["", "신랑 측", "신부 측"];
const RELATIONS = ["", "가족", "친구", "친척", "회사", "부모님 하객"];

export default function GuestListRow({ row, onUpdate }: GuestListRowProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesVal, setNotesVal] = useState(row.notes);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setNotesVal(row.notes);
  }, [row.notes]);

  const updateGuest = (index: number, value: string) => {
    const next = [...row.guests];
    next[index] = value;
    onUpdate({ guests: next });
  };

  const saveNotes = () => {
    onUpdate({ notes: notesVal });
    setEditingNotes(false);
  };

  const filledGuestCount = row.guests.filter((g) => g.trim()).length;

  return (
    <div
      className={`rounded-xl border-2 p-3 transition-all ${
        row.attendance === "O"
          ? "bg-green-50/50 border-green-200"
          : row.attendance === "X"
          ? "bg-gray-50 border-gray-200 opacity-75"
          : "bg-white border-gray-200"
      }`}
    >
      {/* 상단: 번호 + 이름/그룹 + 참석여부 토글 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-400 bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
          {row.number}
        </span>
        <input
          type="text"
          value={row.nameGroup}
          onChange={(e) => onUpdate({ nameGroup: e.target.value })}
          className="flex-1 min-w-0 px-2 py-1.5 text-sm font-semibold text-gray-900 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
          placeholder="이름/그룹"
        />
        <div className="flex gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onUpdate({ attendance: row.attendance === "O" ? "" : "O" })}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
              row.attendance === "O"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-400 active:bg-green-100"
            }`}
          >
            O
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ attendance: row.attendance === "X" ? "" : "X" })}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
              row.attendance === "X"
                ? "bg-red-400 text-white"
                : "bg-gray-100 text-gray-400 active:bg-red-100"
            }`}
          >
            X
          </button>
        </div>
      </div>

      {/* 중단: 측 + 관계 + 인원 */}
      <div className="flex items-center gap-2 mb-2">
        <select
          value={row.side}
          onChange={(e) => onUpdate({ side: e.target.value })}
          className="flex-1 min-w-0 px-2 py-1.5 text-xs text-gray-900 border border-pink-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-400"
        >
          {SIDES.map((s) => (
            <option key={s || "empty"} value={s}>{s || "측 선택"}</option>
          ))}
        </select>
        <select
          value={row.relation}
          onChange={(e) => onUpdate({ relation: e.target.value })}
          className="flex-1 min-w-0 px-2 py-1.5 text-xs text-gray-900 border border-pink-200 rounded-lg bg-white focus:ring-2 focus:ring-pink-400"
        >
          {RELATIONS.map((r) => (
            <option key={r || "empty"} value={r}>{r || "관계 선택"}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 flex-shrink-0">
          <label className="text-xs text-gray-500">인원</label>
          <input
            type="number"
            min={0}
            value={row.headcount === "" ? "" : row.headcount}
            onChange={(e) => {
              const v = e.target.value;
              onUpdate({ headcount: v === "" ? "" : parseInt(v, 10) || 0 });
            }}
            className="w-14 px-2 py-1.5 text-xs text-gray-900 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 text-center"
            placeholder="0"
          />
        </div>
      </div>

      {/* 비고 */}
      <div className="mb-2">
        {editingNotes ? (
          <div className="space-y-1">
            <textarea
              value={notesVal}
              onChange={(e) => setNotesVal(e.target.value)}
              className="w-full px-2 py-1.5 text-xs text-gray-900 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              rows={2}
              autoFocus
            />
            <div className="flex gap-1">
              <button type="button" onClick={saveNotes} className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg">저장</button>
              <button type="button" onClick={() => setEditingNotes(false)} className="px-2 py-1 text-xs bg-gray-300 rounded-lg">취소</button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingNotes(true)}
            className="w-full text-left text-xs text-gray-500 active:bg-yellow-50 rounded-lg px-2 py-1.5 border border-dashed border-gray-200"
          >
            {row.notes ? `📝 ${row.notes}` : "📝 비고 추가"}
          </button>
        )}
      </div>

      {/* 하객 이름 아코디언 */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs text-gray-500 active:bg-gray-50 rounded-lg px-2 py-1.5"
      >
        <span>
          👤 하객 이름 {filledGuestCount > 0 && `(${filledGuestCount}명 입력됨)`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Array.from({ length: GUEST_SLOTS_PER_ROW }).map((_, i) => (
            <input
              key={i}
              type="text"
              value={row.guests[i] ?? ""}
              onChange={(e) => updateGuest(i, e.target.value)}
              className="w-full px-2 py-1.5 text-xs text-gray-900 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
              placeholder={`이름${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

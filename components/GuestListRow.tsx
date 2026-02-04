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

  return (
    <tr className="border-b border-gray-200 hover:bg-pink-50/30">
      <td className="px-1 sm:px-2 py-1.5 text-center text-xs sm:text-sm text-gray-600 bg-gray-50 w-10">
        {row.number}
      </td>
      <td className="px-1 sm:px-2 py-1.5 min-w-[72px]">
        <select
          value={row.side}
          onChange={(e) => onUpdate({ side: e.target.value })}
          className="w-full px-1 py-1.5 sm:py-1 text-xs sm:text-sm border border-pink-200 rounded bg-white focus:ring-2 focus:ring-pink-400 min-h-[40px]"
        >
          {SIDES.map((s) => (
            <option key={s || "empty"} value={s}>{s || "-"}</option>
          ))}
        </select>
      </td>
      <td className="px-1 sm:px-2 py-1.5 min-w-[72px]">
        <select
          value={row.relation}
          onChange={(e) => onUpdate({ relation: e.target.value })}
          className="w-full px-1 py-1.5 sm:py-1 text-xs sm:text-sm border border-pink-200 rounded bg-white focus:ring-2 focus:ring-pink-400 min-h-[40px]"
        >
          {RELATIONS.map((r) => (
            <option key={r || "empty"} value={r}>{r || "-"}</option>
          ))}
        </select>
      </td>
      <td className="px-1 sm:px-2 py-1.5 min-w-[90px]">
        <input
          type="text"
          value={row.nameGroup}
          onChange={(e) => onUpdate({ nameGroup: e.target.value })}
          className="w-full px-1 py-1.5 sm:py-1 text-xs sm:text-sm border border-pink-200 rounded focus:ring-2 focus:ring-pink-400 min-h-[40px]"
          placeholder="이름/그룹"
        />
      </td>
      <td className="px-1 sm:px-2 py-1.5 w-14">
        <input
          type="number"
          min={0}
          value={row.headcount === "" ? "" : row.headcount}
          onChange={(e) => {
            const v = e.target.value;
            onUpdate({ headcount: v === "" ? "" : parseInt(v, 10) || 0 });
          }}
          className="w-full px-1 py-1.5 sm:py-1 text-xs sm:text-sm border border-pink-200 rounded focus:ring-2 focus:ring-pink-400 min-h-[40px] text-center"
          placeholder="0"
        />
      </td>
      <td className="px-1 sm:px-2 py-1.5 w-14 text-center">
        <select
          value={row.attendance}
          onChange={(e) => onUpdate({ attendance: e.target.value })}
          className="w-full px-1 py-1.5 sm:py-1 text-xs sm:text-sm border border-pink-200 rounded bg-white focus:ring-2 focus:ring-pink-400 min-h-[40px]"
        >
          <option value="">-</option>
          <option value="O">O</option>
          <option value="X">X</option>
        </select>
      </td>
      <td className="px-1 sm:px-2 py-1.5 min-w-[100px] max-w-[160px]">
        {editingNotes ? (
          <div className="space-y-1">
            <textarea
              value={notesVal}
              onChange={(e) => setNotesVal(e.target.value)}
              className="w-full px-1 py-1 text-xs border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              rows={2}
              autoFocus
            />
            <div className="flex gap-1">
              <button type="button" onClick={saveNotes} className="px-2 py-0.5 text-xs bg-pink-500 text-white rounded">저장</button>
              <button type="button" onClick={() => setEditingNotes(false)} className="px-2 py-0.5 text-xs bg-gray-300 rounded">취소</button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingNotes(true)}
            className="w-full text-left text-xs sm:text-sm text-gray-700 hover:bg-pink-100 rounded px-1 py-1.5 min-h-[40px] truncate"
          >
            {row.notes || "비고"}
          </button>
        )}
      </td>
      {Array.from({ length: GUEST_SLOTS_PER_ROW }).map((_, i) => (
        <td key={i} className="px-1 py-1.5 min-w-[70px]">
          <input
            type="text"
            value={row.guests[i] ?? ""}
            onChange={(e) => updateGuest(i, e.target.value)}
            className="w-full px-1 py-1 sm:py-0.5 text-xs border border-pink-100 rounded focus:ring-2 focus:ring-pink-400 min-h-[36px]"
            placeholder="이름"
          />
        </td>
      ))}
    </tr>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { HallTourRow as HallTourRowType } from "@/data/weddingHallTour";

interface HallTourRowProps {
  row: HallTourRowType;
  onUpdate: (updates: Partial<HallTourRowType>) => void;
  onToggleCheck: () => void;
}

export default function HallTourRow({
  row,
  onUpdate,
  onToggleCheck,
}: HallTourRowProps) {
  const [editingBride, setEditingBride] = useState(false);
  const [editingGroom, setEditingGroom] = useState(false);
  const [editingMemo, setEditingMemo] = useState(false);
  const [brideVal, setBrideVal] = useState(row.brideValue ?? "");
  const [groomVal, setGroomVal] = useState(row.groomValue ?? "");
  const [memoVal, setMemoVal] = useState(row.userMemo ?? "");

  useEffect(() => {
    setBrideVal(row.brideValue ?? "");
    setGroomVal(row.groomValue ?? "");
    setMemoVal(row.userMemo ?? "");
  }, [row.brideValue, row.groomValue, row.userMemo]);

  const saveBride = () => {
    onUpdate({ brideValue: brideVal });
    setEditingBride(false);
  };
  const saveGroom = () => {
    onUpdate({ groomValue: groomVal });
    setEditingGroom(false);
  };
  const saveMemo = () => {
    onUpdate({ userMemo: memoVal });
    setEditingMemo(false);
  };

  const stars = typeof row.groomValue === "string" && row.groomValue.match(/⭐/g);
  const starCount = stars ? stars.length : 0;

  return (
    <tr className="border-b border-gray-200 hover:bg-pink-50/50">
      <td className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50">
        {row.category}
      </td>
      <td className="px-3 py-2 text-sm text-gray-800">
        {row.item}
      </td>
      {/* 신부(질문/메모) */}
      <td className="px-3 py-2 min-w-[120px]">
        {editingBride ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={brideVal}
              onChange={(e) => setBrideVal(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              placeholder="질문/메모"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveBride();
                if (e.key === "Escape") setEditingBride(false);
              }}
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={saveBride}
                className="px-2 py-0.5 text-xs bg-pink-500 text-white rounded"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setEditingBride(false)}
                className="px-2 py-0.5 text-xs bg-gray-300 rounded"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingBride(true)}
            className="w-full text-left text-sm text-gray-700 hover:bg-pink-100 rounded px-2 py-1 min-h-[32px]"
          >
            {row.brideValue || "클릭하여 입력"}
          </button>
        )}
      </td>
      {/* 신랑(답/체크) */}
      <td className="px-3 py-2 min-w-[120px]">
        {row.inputType === "stars" ? (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  const stars = "⭐".repeat(n);
                  onUpdate({ groomValue: stars });
                  setGroomVal(stars);
                }}
                className="text-lg hover:scale-110"
              >
                {n <= starCount ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        ) : row.inputType === "checkbox" ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={row.groomValue === "유" || row.groomValue === "O"}
              onChange={(e) => {
                const v = e.target.checked ? "유" : "";
                onUpdate({ groomValue: v });
                setGroomVal(v);
              }}
              className="w-4 h-4 rounded border-pink-400 text-pink-500"
            />
            <span className="text-sm">유</span>
          </label>
        ) : editingGroom ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={groomVal}
              onChange={(e) => setGroomVal(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              placeholder="답/비용/유무"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveGroom();
                if (e.key === "Escape") setEditingGroom(false);
              }}
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={saveGroom}
                className="px-2 py-0.5 text-xs bg-pink-500 text-white rounded"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setEditingGroom(false)}
                className="px-2 py-0.5 text-xs bg-gray-300 rounded"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingGroom(true)}
            className="w-full text-left text-sm text-gray-700 hover:bg-pink-100 rounded px-2 py-1 min-h-[32px]"
          >
            {row.groomValue ?? "클릭하여 입력"}
          </button>
        )}
      </td>
      {/* 체크 완료 */}
      <td className="px-3 py-2 text-center">
        <button
          type="button"
          onClick={onToggleCheck}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto ${
            row.checked
              ? "bg-pink-500 border-pink-500"
              : "border-gray-300 hover:border-pink-400"
          }`}
          title={row.checked ? "완료 해제" : "완료"}
        >
          {row.checked && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </td>
      {/* 메모 */}
      <td className="px-3 py-2 max-w-[160px]">
        {editingMemo ? (
          <div className="flex flex-col gap-1">
            <textarea
              value={memoVal}
              onChange={(e) => setMemoVal(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
              rows={2}
              placeholder="메모"
              autoFocus
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={saveMemo}
                className="px-2 py-0.5 text-xs bg-pink-500 text-white rounded"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setEditingMemo(false)}
                className="px-2 py-0.5 text-xs bg-gray-300 rounded"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingMemo(true)}
            className="w-full text-left text-sm text-gray-600 hover:bg-yellow-50 rounded px-2 py-1 min-h-[32px] truncate"
            title={row.userMemo || "메모 추가"}
          >
            {row.userMemo || "메모"}
          </button>
        )}
      </td>
    </tr>
  );
}

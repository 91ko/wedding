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
    <div
      className={`rounded-xl border-2 p-3 transition-all ${
        row.checked
          ? "bg-pink-50 border-pink-300"
          : "bg-white border-gray-200"
      }`}
    >
      {/* 상단: 카테고리 + 항목명 + 완료 체크 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex-shrink-0">
          {row.category}
        </span>
        <span className="text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">
          {row.item}
        </span>
        <button
          type="button"
          onClick={onToggleCheck}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            row.checked
              ? "bg-pink-500 border-pink-500"
              : "border-gray-300 active:border-pink-400"
          }`}
          title={row.checked ? "완료 해제" : "완료"}
        >
          {row.checked && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* 중단: 신부 / 신랑 입력 */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* 신부 */}
        <div>
          <label className="text-xs text-pink-500 font-medium mb-1 block">신부</label>
          {editingBride ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={brideVal}
                onChange={(e) => setBrideVal(e.target.value)}
                className="w-full px-2 py-2 text-sm border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                placeholder="질문/메모"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveBride();
                  if (e.key === "Escape") setEditingBride(false);
                }}
              />
              <div className="flex gap-1">
                <button type="button" onClick={saveBride} className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg">저장</button>
                <button type="button" onClick={() => setEditingBride(false)} className="px-2 py-1 text-xs bg-gray-300 rounded-lg">취소</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingBride(true)}
              className="w-full text-left text-sm text-gray-700 active:bg-pink-100 rounded-lg px-2 py-2 min-h-[40px] bg-pink-50/50 border border-pink-100"
            >
              {row.brideValue || "탭하여 입력"}
            </button>
          )}
        </div>

        {/* 신랑 */}
        <div>
          <label className="text-xs text-blue-500 font-medium mb-1 block">신랑</label>
          {row.inputType === "stars" ? (
            <div className="flex items-center gap-1 min-h-[40px] px-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    const s = "⭐".repeat(n);
                    onUpdate({ groomValue: s });
                    setGroomVal(s);
                  }}
                  className="text-xl active:scale-125 transition-transform p-0.5"
                >
                  {n <= starCount ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          ) : row.inputType === "checkbox" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdate({ groomValue: "유" });
                  setGroomVal("유");
                }}
                className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium transition ${
                  row.groomValue === "유"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 active:bg-pink-200"
                }`}
              >
                유
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdate({ groomValue: "무" });
                  setGroomVal("무");
                }}
                className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium transition ${
                  row.groomValue === "무"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 active:bg-pink-200"
                }`}
              >
                무
              </button>
            </div>
          ) : editingGroom ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={groomVal}
                onChange={(e) => setGroomVal(e.target.value)}
                className="w-full px-2 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="답/비용/유무"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveGroom();
                  if (e.key === "Escape") setEditingGroom(false);
                }}
              />
              <div className="flex gap-1">
                <button type="button" onClick={saveGroom} className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg">저장</button>
                <button type="button" onClick={() => setEditingGroom(false)} className="px-2 py-1 text-xs bg-gray-300 rounded-lg">취소</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingGroom(true)}
              className="w-full text-left text-sm text-gray-700 active:bg-blue-100 rounded-lg px-2 py-2 min-h-[40px] bg-blue-50/50 border border-blue-100"
            >
              {row.groomValue ?? "탭하여 입력"}
            </button>
          )}
        </div>
      </div>

      {/* 하단: 메모 */}
      <div>
        {editingMemo ? (
          <div className="flex flex-col gap-1">
            <textarea
              value={memoVal}
              onChange={(e) => setMemoVal(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              rows={2}
              placeholder="메모"
              autoFocus
            />
            <div className="flex gap-1">
              <button type="button" onClick={saveMemo} className="px-2 py-1 text-xs bg-pink-500 text-white rounded-lg">저장</button>
              <button type="button" onClick={() => setEditingMemo(false)} className="px-2 py-1 text-xs bg-gray-300 rounded-lg">취소</button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingMemo(true)}
            className="w-full text-left text-xs text-gray-500 active:bg-yellow-50 rounded-lg px-2 py-1.5 border border-dashed border-gray-200"
            title={row.userMemo || "메모 추가"}
          >
            {row.userMemo ? `📝 ${row.userMemo}` : "📝 메모 추가"}
          </button>
        )}
      </div>
    </div>
  );
}

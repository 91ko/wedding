"use client";

import { useState } from "react";
import { ChecklistSection as ChecklistSectionType } from "@/data/checklist";
import ChecklistItem from "./ChecklistItem";

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  completedItems: Set<string>;
  onToggle: (id: string) => void;
  onUpdateMemo: (sectionId: string, itemId: string, memo: string) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onUpdateTask: (sectionId: string, itemId: string, task: string) => void;
  onAddItem: (sectionId: string, task: string) => void;
}

export default function ChecklistSection({
  section,
  completedItems,
  onToggle,
  onUpdateMemo,
  onDeleteItem,
  onUpdateTask,
  onAddItem,
}: ChecklistSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const completedCount = section.items.filter((item) =>
    completedItems.has(item.id)
  ).length;
  const totalCount = section.items.length;
  const sectionProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddItem = () => {
    if (newTaskText.trim()) {
      onAddItem(section.id, newTaskText);
      setNewTaskText("");
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden transition-all hover:shadow-xl">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 border-b border-pink-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {section.period}
            </h2>
            {section.dateRange && (
              <p className="text-sm text-gray-600 mt-1">{section.dateRange}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-pink-600">{completedCount}</span>
              <span> / {totalCount}</span>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300"
                style={{ width: `${sectionProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {section.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isCompleted={completedItems.has(item.id)}
              onToggle={() => onToggle(item.id)}
              onUpdateMemo={(memo) => onUpdateMemo(section.id, item.id, memo)}
              onDelete={() => onDeleteItem(section.id, item.id)}
              onUpdateTask={(task) => onUpdateTask(section.id, item.id, task)}
            />
          ))}

          {/* 새 항목 추가 */}
          {isAdding ? (
            <div className="p-4 rounded-xl border-2 border-pink-300 bg-pink-50">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="새 할 일을 입력하세요..."
                className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddItem();
                  if (e.key === "Escape") setIsAdding(false);
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddItem}
                  className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setNewTaskText("");
                    setIsAdding(false);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all text-gray-500 hover:text-pink-600 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              새 항목 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

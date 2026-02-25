"use client";

import { useState } from "react";
import { ChecklistItem as ChecklistItemType } from "@/data/checklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
  onUpdateMemo: (memo: string) => void;
  onDelete: () => void;
  onUpdateTask: (task: string) => void;
}

export default function ChecklistItem({
  item,
  isCompleted,
  onToggle,
  onUpdateMemo,
  onDelete,
  onUpdateTask,
}: ChecklistItemProps) {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [memoText, setMemoText] = useState(item.userMemo || "");
  const [taskText, setTaskText] = useState(item.task);

  const handleSaveMemo = () => {
    onUpdateMemo(memoText);
    setIsEditingMemo(false);
  };

  const handleSaveTask = () => {
    if (taskText.trim()) {
      onUpdateTask(taskText);
      setIsEditingTask(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 편집 중이거나 버튼 클릭시에는 토글하지 않음
    if (
      isEditingMemo ||
      isEditingTask ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("textarea") ||
      (e.target as HTMLElement).closest("input")
    ) {
      return;
    }
    onToggle();
  };

  return (
    <div
      className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
        isCompleted
          ? "bg-pink-50 border-pink-300 opacity-75"
          : "bg-white border-gray-200 hover:border-pink-300 hover:shadow-md"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? "bg-pink-500 border-pink-500"
                : "border-gray-300 group-hover:border-pink-400"
            }`}
          >
            {isCompleted && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {isEditingTask ? (
            <div className="mb-2">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTask();
                  if (e.key === "Escape") setIsEditingTask(false);
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveTask}
                  className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setTaskText(item.task);
                    setIsEditingTask(false);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`font-semibold text-gray-800 flex-1 ${
                  isCompleted ? "line-through" : ""
                }`}
              >
                {item.task}
              </h3>
              <div className="flex gap-1 ml-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {item.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingTask(true);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="할 일 수정"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("이 항목을 삭제하시겠습니까?")) {
                      onDelete();
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="삭제"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 text-sm">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 font-medium text-xs">
                👥 {item.person}
              </span>
            </div>

            {item.memo && (
              <div className="flex items-start gap-2 text-gray-600">
                <span className="flex-shrink-0">📌</span>
                <span>{item.memo}</span>
              </div>
            )}

            {item.note && (
              <div className="flex items-start gap-2 text-gray-500 italic">
                <span className="flex-shrink-0">💡</span>
                <span>{item.note}</span>
              </div>
            )}

            {/* 사용자 메모 */}
            <div className="mt-2">
              {isEditingMemo ? (
                <div>
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    placeholder="메모를 입력하세요..."
                    className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveMemo}
                      className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setMemoText(item.userMemo || "");
                        setIsEditingMemo(false);
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {item.userMemo ? (
                    <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                      <span className="flex-shrink-0">✏️</span>
                      <span className="flex-1 text-gray-700 whitespace-pre-wrap">
                        {item.userMemo}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingMemo(true);
                        }}
                        className="flex-shrink-0 text-yellow-700 hover:text-yellow-900"
                        title="메모 수정"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingMemo(true);
                      }}
                      className="text-sm text-pink-600 hover:text-pink-700 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
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
                      메모 추가
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

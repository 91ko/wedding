import { ChecklistItem as ChecklistItemType } from "@/data/checklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  isCompleted: boolean;
  onToggle: () => void;
}

export default function ChecklistItem({
  item,
  isCompleted,
  onToggle,
}: ChecklistItemProps) {
  return (
    <div
      className={`group p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isCompleted
          ? "bg-pink-50 border-pink-300 opacity-75"
          : "bg-white border-gray-200 hover:border-pink-300 hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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
          <h3
            className={`font-semibold text-gray-800 mb-2 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {item.task}
          </h3>

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
          </div>
        </div>
      </div>
    </div>
  );
}

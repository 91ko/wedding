import { ChecklistSection as ChecklistSectionType } from "@/data/checklist";
import ChecklistItem from "./ChecklistItem";

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  completedItems: Set<string>;
  onToggle: (id: string) => void;
}

export default function ChecklistSection({
  section,
  completedItems,
  onToggle,
}: ChecklistSectionProps) {
  const completedCount = section.items.filter((item) =>
    completedItems.has(item.id)
  ).length;
  const totalCount = section.items.length;
  const sectionProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { checklistData, ChecklistSection as ChecklistSectionType } from "@/data/checklist";
import ChecklistSection from "@/components/ChecklistSection";
import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";

export default function Home() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [sections, setSections] = useState<ChecklistSectionType[]>(checklistData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 체크 상태 불러오기
    const savedCompleted = localStorage.getItem("wedding-checklist-completed");
    if (savedCompleted) {
      setCompletedItems(new Set(JSON.parse(savedCompleted)));
    }

    // 섹션 데이터 불러오기 (메모, 커스텀 항목 등)
    const savedSections = localStorage.getItem("wedding-checklist-sections");
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // 체크 상태 저장
      localStorage.setItem(
        "wedding-checklist-completed",
        JSON.stringify(Array.from(completedItems))
      );
      // 섹션 데이터 저장
      localStorage.setItem(
        "wedding-checklist-sections",
        JSON.stringify(sections)
      );
    }
  }, [completedItems, sections, mounted]);

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const updateMemo = (sectionId: string, itemId: string, memo: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, userMemo: memo } : item
            ),
          };
        }
        return section;
      })
    );
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          };
        }
        return section;
      })
    );
    // 완료 항목에서도 제거
    setCompletedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const updateTask = (sectionId: string, itemId: string, task: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, task } : item
            ),
          };
        }
        return section;
      })
    );
  };

  const addItem = (sectionId: string, task: string) => {
    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: newItemId,
                task,
                person: "같이",
                memo: "",
                note: "",
                isCustom: true,
              },
            ],
          };
        }
        return section;
      })
    );
  };

  const totalItems = sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  );
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <ProgressBar progress={progress} completed={completedCount} total={totalItems} />
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <ChecklistSection
              key={section.id}
              section={section}
              completedItems={completedItems}
              onToggle={toggleItem}
              onUpdateMemo={updateMemo}
              onDeleteItem={deleteItem}
              onUpdateTask={updateTask}
              onAddItem={addItem}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm pb-8">
          <p>💕 김현아 사랑해 💕</p>
          <p className="mt-2 text-xs">진행 상황은 자동으로 저장됩니다</p>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { checklistData } from "@/data/checklist";
import ChecklistSection from "@/components/ChecklistSection";
import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";

export default function Home() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wedding-checklist");
    if (saved) {
      setCompletedItems(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "wedding-checklist",
        JSON.stringify(Array.from(completedItems))
      );
    }
  }, [completedItems, mounted]);

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

  const totalItems = checklistData.reduce(
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
          {checklistData.map((section) => (
            <ChecklistSection
              key={section.id}
              section={section}
              completedItems={completedItems}
              onToggle={toggleItem}
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

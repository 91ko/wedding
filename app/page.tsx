"use client";

import { useState, useEffect } from "react";
import { checklistData, ChecklistSection as ChecklistSectionType } from "@/data/checklist";
import ChecklistSection from "@/components/ChecklistSection";
import ProgressBar from "@/components/ProgressBar";
import Header from "@/components/Header";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

export default function Home() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [sections, setSections] = useState<ChecklistSectionType[]>(checklistData);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Firebase 데이터 저장 함수
  const saveToFirebase = async (completed: Set<string>, sectionsData: ChecklistSectionType[]) => {
    try {
      console.log("💾 Firebase에 저장 중...", Array.from(completed));
      await setDoc(doc(db, "wedding", "checklist"), {
        completedItems: Array.from(completed),
        sections: sectionsData,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Firebase 저장 완료!");
    } catch (error) {
      console.error("❌ Firebase 저장 실패:", error);
      // Firebase 실패시 localStorage에 백업
      localStorage.setItem("wedding-checklist-completed", JSON.stringify(Array.from(completed)));
      localStorage.setItem("wedding-checklist-sections", JSON.stringify(sectionsData));
    }
  };

  useEffect(() => {
    setMounted(true);

    // Firebase 실시간 리스너 설정
    const unsubscribe = onSnapshot(
      doc(db, "wedding", "checklist"),
      (docSnapshot) => {
        console.log("🔥 Firebase 실시간 업데이트 받음!", new Date().toLocaleTimeString());
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("✅ 완료된 항목:", data.completedItems);
          setCompletedItems(new Set(data.completedItems || []));
          setSections(data.sections || checklistData);
        } else {
          console.log("📝 문서가 없어서 초기 데이터 생성");
          // 문서가 없으면 초기 데이터로 생성
          saveToFirebase(new Set(), checklistData);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Firebase 실시간 리스너 오류:", error);
        // Firebase 실패시 localStorage에서 불러오기
        const savedCompleted = localStorage.getItem("wedding-checklist-completed");
        const savedSections = localStorage.getItem("wedding-checklist-sections");
        
        if (savedCompleted) {
          setCompletedItems(new Set(JSON.parse(savedCompleted)));
        }
        if (savedSections) {
          setSections(JSON.parse(savedSections));
        }
        setIsLoading(false);
      }
    );

    // 컴포넌트 언마운트시 리스너 해제
    return () => unsubscribe();
  }, []);

  const toggleItem = (id: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedItems(newSet);
    saveToFirebase(newSet, sections);
  };

  const updateMemo = (sectionId: string, itemId: string, memo: string) => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, userMemo: memo } : item
          ),
        };
      }
      return section;
    });
    setSections(newSections);
    saveToFirebase(completedItems, newSections);
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        };
      }
      return section;
    });
    
    const newCompleted = new Set(completedItems);
    newCompleted.delete(itemId);
    
    setSections(newSections);
    setCompletedItems(newCompleted);
    saveToFirebase(newCompleted, newSections);
  };

  const updateTask = (sectionId: string, itemId: string, task: string) => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, task } : item
          ),
        };
      }
      return section;
    });
    setSections(newSections);
    saveToFirebase(completedItems, newSections);
  };

  const addItem = (sectionId: string, task: string) => {
    const newItemId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSections = sections.map((section) => {
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
    });
    setSections(newSections);
    saveToFirebase(completedItems, newSections);
  };

  const totalItems = sections.reduce(
    (acc, section) => acc + section.items.length,
    0
  );
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결혼 준비 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pb-safe">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl">
        <div className="mb-6 sm:mb-8">
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
          <p className="mt-2 text-xs">
            ✨ 실시간 동기화 중 - 모든 기기에서 같이 볼 수 있어요!
          </p>
        </div>
      </main>
    </div>
  );
}

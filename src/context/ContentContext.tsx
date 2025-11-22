import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// 기본 데이터 (Firebase가 비어있을 때 사용)
const defaultContent = {
  hero: {
    title1: "20 Years of Expertise,",
    title2: "Trusted by Major Construction Companies",
    subtitle: "Eco-Friendly NST Method - Korea's Leading Technology for New House Syndrome. We create spaces where you can breathe freely.",
    yearText: "Since 2009",
    badgeText: "Premium Air Quality Solution",
    bgImage: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGVhbiUyMGFwYXJ0bWVudCUyMGludGVyaW9yJTIwYnJpZ2h0fGVufDF8fHx8MTc2MzcwNTEyMHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  why: {
    title: "Why Choose NST Method?",
    desc: "We combine advanced technology with eco-friendly materials to provide the safest indoor environment."
  },
  results: {
    stat1: "1,018+", label1: "Complexes",
    stat2: "50+", label2: "Teams",
    stat3: "20", label3: "Years"
  },
  // 나머지 섹션들은 필요 시 추가 확장 가능
};

const ContentContext = createContext<any>(null);

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  // Firebase에서 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "siteContent", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // 기존 데이터에 DB 데이터 덮어씌우기 (병합)
          setContent(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Firebase에 데이터 저장하기 (관리자용)
  const updateContent = async (section: string, data: any) => {
    try {
      const newContent = { ...content, [section]: { ...content[section], ...data } };
      setContent(newContent);
      await setDoc(doc(db, "siteContent", "main"), newContent, { merge: true });
      alert("저장되었습니다!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("저장 실패: " + error);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

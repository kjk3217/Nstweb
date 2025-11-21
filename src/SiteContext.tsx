import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// 모든 섹션의 초기 데이터 정의 (텍스트, 색상, 크기 포함)
const defaultData = {
  hero: {
    title: "20년 축적된 노하우, 대형 건설사가 선택한 기술",
    titleColor: "#ffffff",
    titleSize: "60", // px 단위
    subtitle: "새집증후군 개선 원조 기술 NST공법. 국내 유일의 원스톱 시스템으로...",
    subtitleColor: "#e2e8f0",
    subtitleSize: "20",
    bgImage: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?auto=format&fit=crop&q=80&w=1080"
  },
  whyNST: {
    sectionTitle: "새집증후군 왜 NST 공법인가?",
    titleColor: "#05668D",
    desc: "원료 확보부터 연구·개발, 생산, 시공까지 본사에서 직접 수행하는 국내 유일 통합 솔루션입니다.",
    cardHeight: "400", // 카드 높이 조절
    card1: { title: "System 원스톱 시스템", desc: "원료관리-연구개발-제품생산까지...", image: "https://images.unsplash.com/photo-1760970237216-17a474403b5c?w=800" },
    card2: { title: "Partnerships 시공 실적", desc: "국내 건설사 신축 아파트 전세대...", image: "https://images.unsplash.com/photo-1653016380323-a4496cbe3cf0?w=800" },
    card3: { title: "Experience 20년 노하우", desc: "20년 경력으로 현장 맞춤형...", image: "https://images.unsplash.com/photo-1588665306984-d5c6f62224aa?w=800" }
  },
  results: {
    stat1: { value: "1,018+", label: "Complexes", sub: "전세대 일괄시공" },
    stat2: { value: "50+", label: "Teams", sub: "전문 시공팀" },
    stat3: { value: "20", label: "Years", sub: "축적된 노하우" },
    bgColor: "#05668D" // 배경색 조절
  },
  contact: {
    phone: "043-222-2322",
    email: "info@knst.co.kr",
    address: "충북 청주시 흥덕구 공단로134"
  },
  theme: {
    primaryColor: "#05668D",
    secondaryColor: "#00A896"
  }
};

const SiteContext = createContext<any>(null);

export const SiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site_config", "main"), (doc) => {
      if (doc.exists()) {
        // 기존 데이터에 없는 새 필드가 생길 경우를 대비해 defaultData와 병합
        setData({ ...defaultData, ...doc.data() });
      } else {
        setDoc(doc.ref, defaultData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SiteContext.Provider value={{ data, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteContext);

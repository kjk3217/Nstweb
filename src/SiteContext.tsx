import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const defaultData = {
  hero: {
    title: "20년 축적된 노하우, 대형 건설사가 선택한 기술",
    titleColor: "#ffffff",
    titleSize: "60",
    subtitle: "새집증후군 개선 원조 기술 NST공법. 국내 유일의 원스톱 시스템으로...",
    subtitleColor: "#e2e8f0",
    subtitleSize: "20",
    bgImage: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?auto=format&fit=crop&q=80&w=1080"
  },
  whyNST: {
    sectionTitle: "새집증후군 왜 NST 공법인가?",
    titleColor: "#05668D",
    desc: "원료 확보부터 연구·개발, 생산, 시공까지 본사에서 직접 수행하는 국내 유일 통합 솔루션입니다.",
    cardHeight: "400",
    card1: { title: "System 원스톱 시스템", desc: "원료관리-연구개발-제품생산까지...", image: "https://images.unsplash.com/photo-1760970237216-17a474403b5c?w=800" },
    card2: { title: "Partnerships 시공 실적", desc: "국내 건설사 신축 아파트 전세대...", image: "https://images.unsplash.com/photo-1653016380323-a4496cbe3cf0?w=800" },
    card3: { title: "Experience 20년 노하우", desc: "20년 경력으로 현장 맞춤형...", image: "https://images.unsplash.com/photo-1588665306984-d5c6f62224aa?w=800" }
  },
  process: {
    title: "NST공법 3단계 메커니즘",
    desc: "단순한 코팅이 아닌, 공기를 설계하는 과학 기술입니다. 이미 방출된 유해물질뿐만 아니라 앞으로 발생할 오염물질까지 제거합니다.",
    step1: { 
      code: "NST-S100", title: "Decomposition 분해/제거", 
      desc: "빛이 있거나 없는 모든 환경에서 유해물질을 지속적으로 광분해하여 흡착 제거합니다.", 
      details: "가시광촉매 광분해/흡착 기술",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000" 
    },
    step2: { 
      code: "NST-S200", title: "Blocking 침투/차단", 
      desc: "단순 차폐가 아닌, 자재 내부 깊숙이 침투하여 유해물질을 밖으로 밀어내고 방출을 차단합니다.", 
      details: "유해물질 대량 방출 원인 제거",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000" 
    },
    step3: { 
      code: "NST-F100", title: "Adsorption 흡착/탈취", 
      desc: "시공이 어려운 취약 공간의 잔류 유해물질까지 흡착하여 제거하며 숲속 향기를 더합니다.", 
      details: "다공성 흡착 및 탈취 케어",
      image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=1000" 
    }
  },
  scientific: {
    awardTitle: "2025 대한민국환경대상 수상",
    awardDesc: "환경부 후원, 실내공기질 개선 기술력 입증.",
    sectionTitle: "새집증후군 유발물질\n원천 제거 및 차단",
    sectionDesc: "NST 공법은 공정 시험법에 따라 유해물질 저감 성능을 객관적으로 입증받았으며, 시공 후 즉시 입주가 가능할 정도로 안전합니다."
  },
  portfolio: {
    title: "시공 실적 (Portfolio)",
    desc: "국내 대형 건설사가 선택한 NST공법의 주요 시공 사례를 확인하세요."
  },
  results: {
    stat1: { value: "1,018+", label: "Complexes", sub: "전세대 일괄시공" },
    stat2: { value: "50+", label: "Teams", sub: "전문 시공팀" },
    stat3: { value: "20", label: "Years", sub: "축적된 노하우" },
    bgColor: "#05668D"
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

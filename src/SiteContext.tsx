import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const defaultData = {
  hero: {
    title: "20년 축적된 노하우, 대형 건설사가 선택한 기술",
    subtitle: "새집증후군 개선 원조 기술 NST공법. 국내 유일의 원스톱 시스템으로 고객님의 건강과 쾌적한 환경을 책임집니다.",
    bgImage: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  },
  theme: {
    primaryColor: "#05668D"
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

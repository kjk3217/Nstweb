import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// 7개 섹션에 대한 초기 기본값 정의
const defaultContent = {
  hero: {
    title1: "20 Years of Expertise,",
    title2: "Trusted by Major Construction Companies",
    subtitle: "Eco-Friendly NST Method - Korea's Leading Technology for New House Syndrome. We create spaces where you can breathe freely.",
    yearText: "Since 2009",
    badgeText: "Premium Air Quality Solution",
    bgImage: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGVhbiUyMGFwYXJ0bWVudCUyMGludGVyaW9yJTIwYnJpZ2h0fGVufDF8fHx8MTc2MzcwNTEyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    stat1Value: "2025 Winner", stat1Label: "Korea Environmental Grand Prize",
    stat2Value: "1,018+", stat2Label: "Apartment Complexes Completed",
    stat3Value: "Verified", stat3Label: "Scientifically Proven Results"
  },
  why: {
    title: "Why Choose NST Method?",
    desc: "We combine advanced technology with eco-friendly materials to provide the safest indoor environment.",
    card1Title: "One-Stop System", card1Desc: "Complete solution from materials manufacturing to professional installation.", card1Image: "https://images.unsplash.com/photo-1760970237216-17a474403b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBzYWZldHklMjBnZWFyJTIwaGVsbWV0fGVufDF8fHx8MTc2MzcwNTEyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    card2Title: "Major Partnerships", card2Desc: "Trusted partner for 1,018+ verified projects with top construction firms.", card2Image: "https://images.unsplash.com/photo-1653016380323-a4496cbe3cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYnVpbGRpbmclMjBhcGFydG1lbnRzJTIwa29yZWF8ZW58MXx8fHwxNzYzNzA1MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    card3Title: "20 Years Experience", card3Desc: "Customized 3-step process refined over two decades of field experience.", card3Image: "https://images.unsplash.com/photo-1588665306984-d5c6f62224aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpc3QlMjBsYWIlMjBjb2F0JTIwcmVzZWFyY2glMjBtaWNyb3Njb3BlfGVufDF8fHx8MTc2MzcwNTEyMHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  results: {
    stat1Value: "1,018+", stat1Label: "Complexes", stat1Sub: "Completed Projects",
    stat2Value: "50+", stat2Label: "Teams", stat2Sub: "Professional Experts",
    stat3Value: "20", stat3Label: "Years", stat3Sub: "Field Experience"
  },
  process: {
    title: "The NST 3-Step Process",
    desc: "A scientifically engineered method to ensure your home is safe from day one.",
    step1Code: "NST-S100", step1Title: "Decomposition", step1Desc: "Removal of construction residue, mold, and harmful bacteria using our proprietary active solution.", step1Detail: "Penetrates deep into porous materials to break down pollutants at the molecular level.", step1Image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000",
    step2Code: "NST-S200", step2Title: "Blocking", step2Desc: "Sealing of exposed surfaces to prevent the emission of Formaldehyde and Volatile Organic Compounds (VOCs).", step2Detail: "Forms a semi-permanent barrier that allows moisture regulation while blocking toxins.", step2Image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
    step3Code: "NST-F100", step3Title: "Adsorption", step3Desc: "Final air treatment using advanced photocatalytic coating to purify indoor air continuously.", step3Detail: "Reacts with indoor light to decompose airborne pollutants and eliminate odors.", step3Image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=1000"
  },
  scientific: {
    awardTitle: "Korea Environmental Grand Prize",
    awardDesc: "Recognized for excellence in indoor air quality improvement technology.",
    certTitle: "Certified Excellence",
    certBody: "Ministry of Environment, Republic of Korea",
    mainTitle: "90%+ Reduction in Harmful Substances",
    mainDesc: "Our method is scientifically proven to drastically reduce harmful VOCs and Formaldehyde, ensuring your indoor air is as clean as nature intended."
  },
  portfolio: {
    title: "Our Portfolio",
    desc: "Exploring our successful projects across the nation.",
    projects: JSON.stringify([
      { id: 1, title: "Gangnam Prugio Summit", category: "Seoul", year: "2024", builder: "Daewoo E&C", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800" },
      { id: 2, title: "Busan LCT The Sharp", category: "Busan", year: "2023", builder: "POSCO E&C", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800" },
      { id: 3, title: "Raemian One Bailey", category: "Seoul", year: "2024", builder: "Samsung C&T", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800" },
      { id: 4, title: "Hillstate Ijin Bay City", category: "Busan", year: "2023", builder: "Hyundai E&C", img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800" },
      { id: 5, title: "Songdo Xi Crystal", category: "Incheon", year: "2022", builder: "GS E&C", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" },
      { id: 6, title: "Acroriver Park", category: "Seoul", year: "2023", builder: "DL E&C", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800" },
    ])
  },
  contact: {
    title: "Contact Us",
    desc: "Ready to create a healthier environment? Reach out to our expert team for a consultation.",
    phone: "043-222-2322",
    email: "info@knst.co.kr",
    kakao: "@NST공법",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
  }
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
          // 기본값과 DB 데이터를 합침 (DB 데이터 우선)
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

  // Firebase에 데이터 저장하기
  const updateContent = async (section: string, data: any) => {
    try {
      const newContent = { ...content, [section]: { ...content[section], ...data } };
      setContent(newContent);
      await setDoc(doc(db, "siteContent", "main"), newContent, { merge: true });
      alert("성공적으로 저장되었습니다!");
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

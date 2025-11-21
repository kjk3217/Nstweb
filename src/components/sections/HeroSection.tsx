import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Award, ShieldCheck, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSiteData } from '@/SiteContext';

export const HeroSection = () => {
  const { data } = useSiteData();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // 데이터가 로딩 중이거나 없을 때를 대비해 안전 장치 추가
  const heroData = data?.hero || {
      title: "Loading...",
      subtitle: "",
      bgImage: ""
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img 
          src={heroData.bgImage} 
          alt="Main Background" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05668D]/90 via-[#05668D]/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#F0A202] text-[#05668D] px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Since 2009
            </span>
            <span className="text-[#02C39A] font-medium tracking-wider uppercase">
              Premium Air Quality Solution
            </span>
          </div>

          <h1 
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 break-keep whitespace-pre-wrap"
            style={{ color: data?.theme?.primaryColor ? 'white' : 'inherit' }} 
          >
            {heroData.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-10 font-light max-w-2xl leading-relaxed break-keep">
            {heroData.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-[#00A896] hover:bg-[#008c7d] text-white px-8 py-6 text-lg rounded-none"
            >
              View Portfolio
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#05668D] px-8 py-6 text-lg rounded-none"
            >
              NST 공법 자세히 보기
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block absolute top-32 right-0 bg-white/10 backdrop-blur-md border-l-4 border-[#F0A202] p-6 max-w-xs">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Award className="text-[#F0A202] shrink-0" size={24} />
            <div>
              <h3 className="text-white font-bold text-lg">2025 수상</h3>
              <p className="text-white/70 text-sm">대한민국환경대상 (환경부 후원) </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Home className="text-[#02C39A] shrink-0" size={24} />
            <div>
              <h3 className="text-white font-bold text-lg">1,018 세대+</h3>
              <p className="text-white/70 text-sm">대규모 건설사 전세대 일괄 시공</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-[#00A896] shrink-0" size={24} />
            <div>
              <h3 className="text-white font-bold text-lg">효과 입증</h3>
              <p className="text-white/70 text-sm">국가 공인기관 및 환경부 교차검증 완료</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase opacity-70">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

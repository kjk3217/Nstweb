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

  const hero = data?.hero || {};

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img 
          src={hero.bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05668D]/90 via-[#05668D]/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* 제목: 크기와 색상을 데이터에서 받아옴 */}
          <h1 
            className="font-bold leading-tight mb-6 break-keep whitespace-pre-wrap"
            style={{ 
              fontSize: `${hero.titleSize || 60}px`,
              color: hero.titleColor || '#ffffff'
            }}
          >
            {hero.title}
          </h1>
          
          {/* 부제목 */}
          <p 
            className="mb-10 font-light max-w-2xl leading-relaxed break-keep"
            style={{ 
              fontSize: `${hero.subtitleSize || 20}px`,
              color: hero.subtitleColor || '#e2e8f0'
            }}
          >
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-[#00A896] hover:bg-[#008c7d] text-white px-8 py-6 text-lg">
              View Portfolio
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* 스크롤 화살표 */}
      <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white">
        <ArrowDown size={24} className="animate-bounce" />
      </motion.div>
    </section>
  );
};

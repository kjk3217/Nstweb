import React from 'react';
import { motion } from 'motion/react';

export const ResultsSection = () => {
  const stats = [
    { value: "1,018+", label: "Complexes", sub: "전세대 일괄시공 프로젝트" },
    { value: "50+", label: "Teams", sub: "NST 공법 전문 시공팀" },
    { value: "20", label: "Years", sub: "축적된 기술력과 노하우" }
  ];

  const partners = [
    "Samsung C&T", "Hyundai E&C", "Daewoo E&C", "GS E&C", "POSCO E&C", "DL E&C", "Lotte E&C", "SK Ecoplant", "HDC Hyundai Development", "Hanwha E&C"
  ];

  return (
    <section className="relative py-24 bg-[#05668D] overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Circular Progress Background (Decorative) */}
              <div className="w-48 h-48 rounded-full border-4 border-white/10 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10" />
              <div className="w-56 h-56 rounded-full border border-white/5 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 animate-[spin_10s_linear_infinite]" />
              
              <h3 className="text-6xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-[#02C39A] font-bold text-xl uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-white/60 text-sm">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-12">
          <p className="text-center text-white/50 uppercase tracking-widest text-sm mb-8">Trusted Partners</p>
          
          {/* Infinite Slider */}
          <div className="relative flex overflow-hidden group">
            <div className="flex animate-loop-scroll space-x-16 whitespace-nowrap group-hover:paused">
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="text-2xl font-bold text-white/30 hover:text-white transition-colors cursor-default">
                  {partner}
                </div>
              ))}
            </div>
            <div className="flex animate-loop-scroll space-x-16 whitespace-nowrap group-hover:paused ml-16" aria-hidden="true">
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="text-2xl font-bold text-white/30 hover:text-white transition-colors cursor-default">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loop-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-loop-scroll {
            animation: loop-scroll 30s linear infinite;
          }
          .paused {
            animation-play-state: paused;
          }
        `
      }} />
    </section>
  );
};

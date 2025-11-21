import React from 'react';
import { motion } from 'motion/react';
import { Layers, Building2, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '@/SiteContext';

// 아이콘은 텍스트로 저장하기 어려우니 매핑 객체 사용
const iconMap = [Layers, Building2, CheckCircle2];

export const WhyNSTSection = () => {
  const { data } = useSiteData();
  const config = data?.whyNST || {};
  
  // 카드 데이터를 배열로 변환
  const cards = [config.card1, config.card2, config.card3];

  return (
    <section id="method" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: config.titleColor }}
          >
            {config.sectionTitle}
          </motion.h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {config.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card: any, index: number) => {
            const Icon = iconMap[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                // 카드 높이 조절
                style={{ height: `${config.cardHeight || 400}px` }}
                className="group relative rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer"
              >
                <div className="absolute inset-0">
                  <img 
                    src={card?.image} 
                    alt={card?.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00A896] to-[#05668D] opacity-80 mix-blend-multiply" />
                </div>

                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{card?.title}</h3>
                    <p className="text-white/80 leading-relaxed">{card?.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

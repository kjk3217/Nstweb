import React from 'react';
import { motion } from 'motion/react';
import { Layers, Building2, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const WhyNSTSection = () => {
  const { content } = useContent();
  const data = content?.why || {};

  const cards = [
    {
      icon: Layers,
      title: data.card1Title,
      desc: data.card1Desc,
      color: "from-[#00A896] to-[#02C39A]",
      image: data.card1Image
    },
    {
      icon: Building2,
      title: data.card2Title,
      desc: data.card2Desc,
      color: "from-[#05668D] to-[#00A896]",
      image: data.card2Image
    },
    {
      icon: CheckCircle2,
      title: data.card3Title,
      desc: data.card3Desc,
      color: "from-[#F0A202] to-[#FFD700]",
      image: data.card3Image
    }
  ];

  return (
    <section id="method" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#05668D] mb-4"
          >
            {data.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            {data.desc}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative h-[400px] rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer"
            >
              <div className="absolute inset-0">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${card.color} opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-90`} />
              </div>

              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-[#00A896] transition-all duration-300">
                  <card.icon size={32} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:translate-x-2 transition-transform duration-300">{card.title}</h3>
                  <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors">
                    {card.desc}
                  </p>
                </div>

                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-white text-[#00A896] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

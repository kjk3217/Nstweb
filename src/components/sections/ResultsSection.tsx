import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../../context/ContentContext';

export const ResultsSection = () => {
  const { content } = useContent();
  const data = content?.results || {};

  const stats = [
    { value: data.stat1Value, label: data.stat1Label, sub: data.stat1Sub },
    { value: data.stat2Value, label: data.stat2Label, sub: data.stat2Sub },
    { value: data.stat3Value, label: data.stat3Label, sub: data.stat3Sub }
  ];

  return (
    <section className="relative py-24 bg-[#05668D] overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full border-4 border-white/10 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10" />
              <div className="w-56 h-56 rounded-full border border-white/5 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 animate-[spin_10s_linear_infinite]" />
              
              <h3 className="text-6xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-[#02C39A] font-bold text-xl uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-white/60 text-sm">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award } from 'lucide-react';
import { useSiteData } from '@/SiteContext';

const data = [
  { name: '폼알데하이드', before: 100, after: 10 },
  { name: '벤젠', before: 85, after: 8 },
  { name: '톨루엔', before: 90, after: 12 },
  { name: 'VOCs', before: 95, after: 15 },
];

export const ScientificSection = () => {
  const { data: siteData } = useSiteData();
  const config = siteData?.scientific || {};

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Award */}
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
          >
             <div className="relative bg-white p-12 rounded-3xl shadow-2xl border border-slate-100">
                <div className="absolute -top-6 -left-6 bg-[#F0A202] text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                  2025 WINNER
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#F0A202] to-[#FFD700] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-orange-200">
                    <Award size={64} className="text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-[#05668D] mb-2">{config.awardTitle}</h3>
                  <p className="text-slate-500 mb-8">{config.awardDesc}</p>
                  
                  <div className="w-full p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 text-left">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png" alt="Korea" className="w-6 h-6 rounded-full object-cover" />
                     </div>
                     <div>
                       <p className="font-bold text-[#05668D]">국가 공인기관 검증</p>
                       <p className="text-xs text-slate-400">환경부 교차검증 통과 및 안전성 입증</p>
                     </div>
                  </div>
                </div>
             </div>
             <div className="absolute -z-10 top-10 -right-10 w-64 h-64 bg-[#02C39A]/10 rounded-full blur-3xl" />
             <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-[#05668D]/10 rounded-full blur-3xl" />
          </motion.div>
          
          {/* Right: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#05668D] mb-6 whitespace-pre-wrap">
              {config.sectionTitle}
            </h2>
            <p className="text-slate-600 mb-10 leading-relaxed">
              {config.sectionDesc}
            </p>
            
            <div className="h-[400px] w-full bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="before" name="Before Treatment" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" name="After NST Method" fill="#00A896" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#00A896', '#02C39A', '#05668D', '#00A896'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* ... Legend ... */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

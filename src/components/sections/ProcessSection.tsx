import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    code: "NST-S100",
    title: "Decomposition 분해/제거",
    desc: "빛이 있거나 없는 모든 환경에서 유해물질을 지속적으로 광분해하여 흡착 제거합니다.",
    details: "가시광촉매 광분해/흡착 기술",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "02",
    code: "NST-S200",
    title: "Blocking 침투/차단",
    desc: "단순 차폐가 아닌, 자재 내부 깊숙이 침투하여 유해물질을 밖으로 밀어내고 방출을 차단합니다.",
    details: "유해물질 대량 방출 원인 제거",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "03",
    code: "NST-F100",
    title: "Adsorption 흡착/탈취",
    desc: "시공이 어려운 취약 공간의 잔류 유해물질까지 흡착하여 제거하며 숲속 향기를 더합니다.",
    details: "다공성 흡착 및 탈취 케어",
    image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=1000",
  }
];

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#05668D] mb-4">
            The NST 3-Step Process
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            A scientifically engineered method to ensure your home is safe from day one.
          </p>
        </div>

        {/* Desktop Horizontal View */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group perspective-1000">
              <div className="relative h-[500px] w-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180">
                
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-slate-100 rounded-2xl overflow-hidden shadow-lg">
                   <div className="h-2/3 relative">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-xl text-[#05668D] shadow-md">
                        {step.id}
                      </div>
                   </div>
                   <div className="h-1/3 p-6 bg-white relative z-10">
                      <p className="text-[#00A896] font-bold text-sm mb-1">{step.code}</p>
                      <h3 className="text-2xl font-bold text-[#05668D] mb-2">{step.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2">{step.desc}</p>
                   </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#05668D] rounded-2xl p-8 flex flex-col justify-center text-white">
                  <div className="text-6xl font-bold opacity-10 mb-4">{step.id}</div>
                  <h3 className="text-3xl font-bold mb-4 text-[#02C39A]">{step.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                    <h4 className="font-bold mb-2 text-[#F0A202]">Key Benefit</h4>
                    <p className="text-sm text-white/70">{step.details}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider View */}
        <div className="lg:hidden relative">
            <div className="overflow-hidden rounded-2xl shadow-xl bg-white">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col md:flex-row h-[500px] md:h-[400px]"
              >
                <div className="h-1/2 md:h-full md:w-1/2 relative">
                   <img src={steps[activeStep].image} alt={steps[activeStep].title} className="w-full h-full object-cover" />
                   <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center font-bold text-xl text-[#05668D] shadow-md">
                      {steps[activeStep].id}
                   </div>
                </div>
                <div className="h-1/2 md:h-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                   <span className="text-[#00A896] font-bold mb-2">{steps[activeStep].code}</span>
                   <h3 className="text-3xl font-bold text-[#05668D] mb-4">{steps[activeStep].title}</h3>
                   <p className="text-slate-600 mb-6">{steps[activeStep].desc}</p>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-[#F0A202] font-bold text-sm uppercase block mb-1">Detailed Effect</span>
                     <p className="text-sm text-slate-500">{steps[activeStep].details}</p>
                   </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => setActiveStep(prev => (prev === 0 ? steps.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50"
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </button>
              <div className="flex gap-2 items-center">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${i === activeStep ? 'w-8 bg-[#00A896]' : 'bg-slate-300'}`} 
                  />
                ))}
              </div>
               <button 
                onClick={() => setActiveStep(prev => (prev === steps.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50"
              >
                <ChevronRight size={20} className="text-slate-600" />
              </button>
            </div>
        </div>
      </div>
      
       <style dangerouslySetInnerHTML={{
        __html: `
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `
      }} />
    </section>
  );
};

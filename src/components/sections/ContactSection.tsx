import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const ContactSection = () => {
  const { content } = useContent();
  const data = content?.contact || {};

  return (
    <section id="contact" className="relative py-24 bg-slate-900">
      <div className="absolute inset-0 z-0">
         <img 
           src={data.bgImage} 
           alt="City Background" 
           className="w-full h-full object-cover opacity-20 blur-sm"
         />
         <div className="absolute inset-0 bg-[#05668D]/50 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#00A896] rounded-3xl overflow-hidden shadow-2xl relative">
           <div className="p-12 text-white text-center relative z-10">
             <h2 className="text-4xl font-bold mb-6">{data.title}</h2>
             <p className="text-white/90 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
               {data.desc}
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                   <div className="w-16 h-16 rounded-full bg-white text-[#00A896] flex items-center justify-center shadow-lg">
                     <Phone size={32} />
                   </div>
                   <div>
                     <p className="text-sm opacity-80 uppercase tracking-wider mb-1">Phone</p>
                     <p className="text-xl font-bold">{data.phone}</p>
                   </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                   <div className="w-16 h-16 rounded-full bg-white text-[#00A896] flex items-center justify-center shadow-lg">
                     <Mail size={32} />
                   </div>
                   <div>
                     <p className="text-sm opacity-80 uppercase tracking-wider mb-1">Email</p>
                     <p className="text-xl font-bold">{data.email}</p>
                   </div>
                </div>
                
                <div className="flex flex-col items-center gap-4 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                   <div className="w-16 h-16 rounded-full bg-white text-[#00A896] flex items-center justify-center shadow-lg">
                     <MapPin size={32} />
                   </div>
                   <div>
                     <p className="text-sm opacity-80 uppercase tracking-wider mb-1">KakaoTalk</p>
                     <p className="text-xl font-bold">{data.kakao}</p>
                   </div>
                </div>
             </div>
           </div>
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#02C39A]/40 rounded-full blur-3xl" />
           <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#05668D]/40 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

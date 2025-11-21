import React from 'react';
import { User, Calendar, Target, Award, MapPin, Phone, Mail } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 bg-slate-900">
      <div className="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
           alt="City Background" 
           className="w-full h-full object-cover opacity-20 blur-sm"
         />
         <div className="absolute inset-0 bg-[#05668D]/50 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
           <div className="md:w-1/2 p-12 bg-[#00A896] text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Ready to create a healthier environment? Reach out to our expert team for a consultation.
                </p>
                
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 uppercase tracking-wider">Phone</p>
                        <p className="text-lg font-bold">043-222-2322</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 uppercase tracking-wider">Email</p>
                        <p className="text-lg font-bold">info@knst.co.kr</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs opacity-70 uppercase tracking-wider">KakaoTalk</p>
                        <p className="text-lg font-bold">@NST공법</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#02C39A]/30 rounded-full blur-3xl" />
           </div>
           
           <div className="md:w-1/2 p-12 bg-white">
              <form className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                   <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 outline-none transition-all" placeholder="Your Name" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                   <input type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 outline-none transition-all" placeholder="010-0000-0000" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                   <textarea className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 outline-none transition-all h-32 resize-none" placeholder="How can we help you?" />
                 </div>
                 <button type="button" className="w-full bg-[#05668D] text-white font-bold py-4 rounded-lg hover:bg-[#045475] transition-colors shadow-lg shadow-[#05668D]/30">
                   Send Message
                 </button>
              </form>
           </div>
        </div>
      </div>
    </section>
  );
};

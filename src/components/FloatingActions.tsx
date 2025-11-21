import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export const FloatingActions = () => {
  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
      <motion.a
        href="tel:043-222-2322"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="w-14 h-14 rounded-full bg-[#00A896] text-white flex items-center justify-center shadow-lg shadow-[#00A896]/30 cursor-pointer"
      >
        <Phone size={24} />
      </motion.a>
      
      <motion.a
        href="#"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        className="w-14 h-14 rounded-full bg-[#FAE100] text-[#371D1E] flex items-center justify-center shadow-lg shadow-[#FAE100]/30 cursor-pointer"
      >
        <MessageCircle size={24} fill="currentColor" />
      </motion.a>
    </div>
  );
};

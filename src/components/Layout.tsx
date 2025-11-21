import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Shield, Award, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'NST Method', href: '#method' },
    { name: 'Process', href: '#process' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
<a href="#" className="flex items-center gap-2">
  <img 
    src="/logo.png" {/* 이미지 경로를 여기에 입력하세요 (예: /logo.png) */}
    alt="KNST Logo" 
    className="h-8 w-auto object-contain" {/* 높이 h-8은 약 32px입니다. 필요에 따라 h-10, h-12 등으로 조절하세요 */}
  />
</a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium hover:text-[#00A896] transition-colors ${
                isScrolled ? 'text-slate-700' : 'text-white/90 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className={`${isScrolled ? 'bg-[#00A896] hover:bg-[#008c7d]' : 'bg-white text-[#00A896] hover:bg-white/90'}`}
            size="sm"
          >
            견적 문의하기
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-slate-800' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-slate-800' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-700 font-medium py-2 border-b border-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button className="w-full bg-[#00A896]">견적 문의하기</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#05668D] text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold mb-6 flex items-center gap-2">
               <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-[#05668D] font-bold">
                K
              </div>
              KNST
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              (주)엔에스티는 20년간 축적된 노하우와 기술력으로 새집증후군 없는 건강한 주거 환경을 만들어갑니다.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00A896] transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-white/80" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-[#02C39A]">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Company Intro</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NST Method</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customer Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-[#02C39A]">Contact Info</h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-3">
                <span className="font-bold text-white min-w-[60px]">Address</span>
                충북 청주시 흥덕구 공단로134, 1408호
              </li>
              <li className="flex items-center gap-3">
                <span className="font-bold text-white min-w-[60px]">Phone</span>
                043-222-2322
              </li>
              <li className="flex items-center gap-3">
                <span className="font-bold text-white min-w-[60px]">Email</span>
                info@knst.co.kr
              </li>
              <li className="flex items-center gap-3">
                <span className="font-bold text-white min-w-[60px]">Kakao</span>
                @NST공법
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; 2025 KNST Construction Method. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Navbar, Footer };

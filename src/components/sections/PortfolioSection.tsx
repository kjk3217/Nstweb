import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const projects = [
  { id: 1, title: "Gangnam Prugio Summit", category: "Seoul", year: "2024", builder: "Daewoo E&C", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Busan LCT The Sharp", category: "Busan", year: "2023", builder: "POSCO E&C", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Raemian One Bailey", category: "Seoul", year: "2024", builder: "Samsung C&T", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "Hillstate Ijin Bay City", category: "Busan", year: "2023", builder: "Hyundai E&C", img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800" },
  { id: 5, title: "Songdo Xi Crystal", category: "Incheon", year: "2022", builder: "GS E&C", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Acroriver Park", category: "Seoul", year: "2023", builder: "DL E&C", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800" },
];

const filters = ["All", "Seoul", "Busan", "Incheon"];

export const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-[#05668D] mb-4">
              Our Portfolio
            </h2>
            <p className="text-slate-600">
              Exploring our successful projects across the nation.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                  ? 'bg-[#05668D] text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
          <Masonry gutter="24px">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={project.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(project.img)}
              >
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-[#05668D]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6">
                  <p className="text-[#02C39A] font-bold text-sm uppercase tracking-widest mb-2">{project.builder}</p>
                  <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-white/70 text-sm">{project.category}, {project.year}</p>
                  
                  <button className="mt-6 w-12 h-12 rounded-full bg-white text-[#05668D] flex items-center justify-center hover:scale-110 transition-transform">
                    <ZoomIn size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {/* Simple Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-[#02C39A]">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              alt="Project Full View" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

'use client';

import { useState, useEffect, useRef } from 'react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Camera, MapPin, Loader2, Maximize2, X, Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import gsap from 'gsap';

export default function Photos() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBlurred, setIsBlurred] = useState(false);
  const containerRef = useRef(null);

  const LIMIT = 15;

  // Fetch photos and metadata directly from Firebase Storage photography/ folder
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, "photography/");
      const res = await listAll(listRef);
      
      const fetchedWorks = [];
      for (const itemRef of res.items) {
        try {
          const url = await getDownloadURL(itemRef);
          const meta = await getMetadata(itemRef);
          const customMeta = meta.customMetadata || {};
          
          fetchedWorks.push({
            id: itemRef.name, // unique storage filename
            fileName: itemRef.name,
            imageUrl: url,
            title: customMeta.title || itemRef.name.split('_').slice(2).join(' ').replace('.jpg', '') || itemRef.name,
            category: customMeta.category || "Landscape",
            camera: customMeta.camera || "N/A",
            lens: customMeta.lens || "N/A",
            settings: customMeta.settings || "N/A",
            location: customMeta.location || "N/A",
            description: customMeta.description || "",
            order: parseInt(customMeta.order) || 99
          });
        } catch (err) {
          console.error("Error reading file metadata: ", err);
        }
      }
      
      // Sort by order metadata
      fetchedWorks.sort((a, b) => a.order - b.order);
      setWorks(fetchedWorks);
    } catch (e) {
      console.error("Error reading Firebase Storage: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // --- Dynamic Right-Click and Screenshot/PrintScreen Prevention ---
  useEffect(() => {
    // 1. Disable contextmenu (Right-Click)
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // 2. Disable screenshot key combinations (PrintScreen, Save, Print)
    const handleKeyDown = (e) => {
      // Capture PrintScreen button
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 1500);
      }
      // Block Ctrl+S (Save Page) & Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // 3. Blur gallery contents when page loses focus (e.g. Snipping tool or system snapshot starts)
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // --- GSAP Pagination Entrance Animation ---
  useEffect(() => {
    if (loading || works.length === 0) return;

    // Target the newly rendered photo cards
    const cards = containerRef.current?.querySelectorAll('.photo-card');
    if (!cards || cards.length === 0) return;

    // Kill any active GSAP tweens on these elements to avoid overlap/glitches
    gsap.killTweensOf(cards);

    // Initial state: invisible and offset on both X and Y axes
    gsap.set(cards, { opacity: 0, y: 40, x: -20 });

    // Animate in: staggered slide & fade-in
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.out',
      clearProps: 'transform,opacity', // Clear styles so hover transitions work correctly afterwards
    });
  }, [currentPage, loading, works.length]);

  // Pagination calculations
  const totalPages = Math.ceil(works.length / LIMIT);
  const startIndex = (currentPage - 1) * LIMIT;
  const paginatedWorks = works.slice(startIndex, startIndex + LIMIT);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      let adjustedStart = start;
      let adjustedEnd = end;
      if (currentPage <= 3) {
        adjustedEnd = 4;
      } else if (currentPage >= totalPages - 2) {
        adjustedStart = totalPages - 3;
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <main className={`relative min-h-screen pb-20 pt-4 text-zinc-100 flex flex-col items-center transition-all duration-300 ${isBlurred ? 'blur-xl select-none pointer-events-none' : ''}`}>

      {/* --- Main Image Showcase Canvas --- */}
      <section className="w-full max-w-6xl px-4 flex-1 flex flex-col items-center">
        {loading ? (
          // --- Loading Screen ---
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <span className="text-xs font-semibold font-mono">Loading Showcase Binaries...</span>
          </div>
        ) : works.length === 0 ? (
          // --- Empty State ---
          <Card className="max-w-xl mx-auto p-8 text-center bg-zinc-900/30 border border-zinc-850 flex flex-col items-center gap-6 rounded-2xl">
            <Info className="w-12 h-12 text-zinc-500" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-200">No Photos Available</h3>
              <p className="text-sm text-zinc-500">It seems there are no photos to display at the moment. Please check back later.</p>
            </div>
          </Card>
        ) : (
          <>
            {/* --- Masonry Gallery Grid --- */}
            <div ref={containerRef} className="columns-1 sm:columns-2 md:columns-3 gap-6 w-full">
              {paginatedWorks.map((it) => (
                <div 
                  key={it.id} 
                  onClick={() => setSelectedPhoto(it)}
                  className="photo-card break-inside-avoid mb-6 relative group block w-full rounded-2xl overflow-hidden bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                >
                  {/* Image Wrap */}
                  <div className="w-full relative overflow-hidden bg-zinc-900 aspect-auto">
                    <img
                      src={it.imageUrl} 
                      alt={it.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03] select-none"
                      loading="lazy"
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Lightbox overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 px-4 py-2 rounded-2xl bg-zinc-900/35 border border-zinc-850/60 backdrop-blur-md">
                <Button
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950/50 transition-all cursor-pointer"
                  aria-label="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950/50 transition-all cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-zinc-500 font-mono select-none">
                          ...
                        </span>
                      );
                    }
                    const isActive = page === currentPage;
                    return (
                      <Button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                          isActive
                            ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border-zinc-100 shadow-lg"
                            : "bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950/50 transition-all cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => {
                    setCurrentPage(totalPages);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:hover:bg-zinc-950/50 transition-all cursor-pointer"
                  aria-label="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* --- Interactive Lightbox Modal --- */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900/80 backdrop-blur-xl border border-zinc-850 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-55 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo Section */}
            <div className="flex-1 bg-zinc-950 flex items-center justify-center p-2 min-h-[300px] md:min-h-0">
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.title} 
                className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain rounded-lg select-none"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
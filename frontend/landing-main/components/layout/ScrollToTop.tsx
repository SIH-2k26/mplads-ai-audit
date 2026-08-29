import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-24 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#D9D5CC] bg-white text-[#18324A] shadow-card hover:bg-[#EDE8DE] hover:shadow-elevated transition-all animate-in fade-in"
      title="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

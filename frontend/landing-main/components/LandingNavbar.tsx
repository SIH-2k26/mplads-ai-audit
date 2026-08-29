import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { CommandPalette } from './ui/command';
import { cn } from '../utils/utils';

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Intelligence', href: '#from-data-to-decision' },
    { label: 'Public Query', href: '#public-query' },
    { label: 'Pipeline', href: '#how-it-thinks' },
    { label: 'Projects', href: '#digital-twin' },
    { label: 'Governance', href: '#rules' },
    { label: 'Early Warning', href: '#early-warning' },
    { label: 'National View', href: '#national' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-16 flex items-center',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#D9DFE3] shadow-xs'
            : 'bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#D9DFE3]/60'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-6">
          {/* Brand & Emblem */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#15324A] text-white shadow-xs border border-[#0F2638] group-hover:bg-[#0F2638] transition-colors">
              <Shield className="h-4 w-4 text-[#E5B45A]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold tracking-wider text-[14px] text-[#15324A] font-sans">
                  SANCHAY
                </span>
                <span className="rounded bg-[#D99018]/10 px-1.5 py-0.5 text-[8.5px] font-bold text-[#D99018] border border-[#D99018]/30 font-mono tracking-tight">
                  MPLADS INTELLIGENCE
                </span>
              </div>
              <p className="text-[9.5px] text-[#647383] font-medium tracking-normal leading-tight mt-0.5">
                Government of India • Ministry of Statistics & Programme Implementation
              </p>
            </div>
          </Link>

          {/* Center Streamlined Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-[12.5px] font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="relative text-[#647383] hover:text-[#15324A] transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#15324A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs & Search Palette */}
          <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#D9DFE3] bg-white px-3 h-8.5 text-xs text-[#647383] hover:border-[#15324A] hover:text-[#15324A] transition-colors shadow-2xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="font-sans text-[11px] font-medium">Search</span>
              <kbd className="rounded border border-[#D9DFE3] bg-[#FAFAF7] px-1.5 py-0.5 text-[9px] font-mono leading-none">
                ⌘K
              </kbd>
            </button>

            <Link to="/district">
              <Button
                variant="default"
                size="sm"
                className="group bg-[#15324A] hover:bg-[#0F2638] text-white text-xs inline-flex items-center gap-2 shadow-xs font-bold h-8.5 px-4 rounded-[6px] transition-colors"
              >
                <span>Open Sanchay Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A] transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="p-1.5 rounded-[6px] border border-[#D9DFE3] text-[#15324A] bg-white h-8 w-8 flex items-center justify-center"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link to="/district">
              <Button variant="default" size="sm" className="text-xs py-1 px-2.5 font-bold h-8 bg-[#15324A] rounded-[6px]">
                Enter
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-[6px] border border-[#D9DFE3] text-[#15324A] bg-white h-8 w-8 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-16 left-0 right-0 border-b border-[#D9DFE3] bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 shadow-elevated z-50">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="block text-xs font-semibold text-[#15324A] py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#F3F5F4] flex gap-2">
              <Link to="/district" className="flex-1">
                <Button variant="default" size="sm" className="w-full text-xs font-bold h-8 bg-[#15324A]">
                  Enter Operational Platform
                </Button>
              </Link>
              <Link to="/design-system">
                <Button variant="outline" size="sm" className="text-xs h-8">
                  Design System
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}

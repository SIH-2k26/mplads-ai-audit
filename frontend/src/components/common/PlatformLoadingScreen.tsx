import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SanchayLogo } from './SanchayLogo';
import { ShieldCheck, Database, Lock, Server } from 'lucide-react';

interface PlatformLoadingScreenProps {
  isLoading: boolean;
  roleTitle?: string;
  onComplete?: () => void;
}

const TELEMETRY_STEPS = [
  { text: 'Establishing Secure MoSPI Telemetry Handshake...', icon: Server },
  { text: 'Syncing Parliamentary GIS Coordinates & Satellite Basemaps...', icon: Database },
  { text: 'Compiling MPLADS 2023 Guidelines & Statutory Rules...', icon: Lock },
  { text: 'Calibrating National Risk Intelligence Engine...', icon: ShieldCheck },
];

export function PlatformLoadingScreen({
  isLoading,
  roleTitle = 'Operational Dashboard Cockpit',
  onComplete,
}: PlatformLoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }

    setProgress(0);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % TELEMETRY_STEPS.length);
    }, 440);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) {
          clearInterval(progressInterval);
          return 96;
        }
        return prev + 6;
      });
    }, 110);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  const CurrentIcon = TELEMETRY_STEPS[currentStepIndex].icon;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAF9] text-[#0E0E0E] font-sans select-none"
        >
          {/* Subtle Background Watermark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.06] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: "url('/gov_watermark.jpg')" }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
            {/* Animated Logo Emblem */}
            <div className="relative mb-6">
              {/* Concentric Pulse Rings */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-3 rounded-full border border-[#002449]/20"
              />
              <motion.div
                animate={{ scale: [1, 1.45, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute -inset-6 rounded-full border border-[#15803D]/20"
              />

              <div className="w-16 h-16 rounded-full bg-[#002449] flex items-center justify-center shadow-lg border border-[#002449] p-3">
                <SanchayLogo className="w-full h-full" variant="light" />
              </div>
            </div>

            {/* Brand Title & Jurisdiction */}
            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-[#002449]/10 border border-[#002449]/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#002449] uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                <span>Entering {roleTitle}</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#002449] uppercase font-sans">
                SANCHAY
              </h2>
              <p className="text-xs text-[#6B6B6B] font-medium font-sans">
                National Infrastructure Intelligence & Forensic Audit System
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-[#E5E3DC] h-1.5 rounded-full overflow-hidden mb-4 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#002449] via-[#15803D] to-[#002449] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>

            {/* Live Ticker State */}
            <div className="h-6 flex items-center justify-center gap-2 text-xs font-mono text-[#6B6B6B]">
              <CurrentIcon className="w-3.5 h-3.5 text-[#15803D] animate-pulse shrink-0" />
              <motion.span
                key={currentStepIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="truncate"
              >
                {TELEMETRY_STEPS[currentStepIndex].text}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

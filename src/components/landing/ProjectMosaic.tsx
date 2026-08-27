import React, { useState, useEffect } from 'react';
import { infrastructureImages, InfrastructureImage } from '../../data/infrastructureImages';
import { MapPin, ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';

interface MosaicSlot {
  slotId: number;
  imageIndex: number;
  categoryLabel: string;
  defaultTitle: string;
  defaultLocation: string;
  aspect: string;
  sizeClass: string;
  featured?: boolean;
}

export function ProjectMosaic() {
  // 7 slots matching the wireframe layout
  const [slots, setSlots] = useState<MosaicSlot[]>([
    // Slot 0: Top-Left (Medium) - Field Inspection
    {
      slotId: 0,
      imageIndex: 6, // insp-1
      categoryLabel: 'FIELD INSPECTION',
      defaultTitle: 'IQM Physical Verification Audit',
      defaultLocation: 'Nashik District · Maharashtra',
      aspect: 'aspect-[4/3]',
      sizeClass: 'col-span-5 row-span-1',
    },
    // Slot 1: Top-Right (Tall/Medium) - Road Infrastructure
    {
      slotId: 1,
      imageIndex: 0, // road-1
      categoryLabel: 'ROAD INFRASTRUCTURE',
      defaultTitle: 'Bituminous Village Link Road KM 12/400',
      defaultLocation: 'Haveli Taluka, Pune · MH',
      aspect: 'aspect-[4/3.5]',
      sizeClass: 'col-span-7 row-span-1',
    },
    // Slot 2: Mid-Left (Small) - Sanitation & Drainage
    {
      slotId: 2,
      imageIndex: 2, // san-1
      categoryLabel: 'SANITATION & DRAINAGE',
      defaultTitle: 'Underground Drainage & Stormwater Line',
      defaultLocation: 'Nagpur District · Maharashtra',
      aspect: 'aspect-[1/1]',
      sizeClass: 'col-span-4 row-span-1',
    },
    // Slot 3: Center Anchor (Large Featured) - Water Infrastructure
    {
      slotId: 3,
      imageIndex: 4, // wat-1
      categoryLabel: 'WATER INFRASTRUCTURE',
      defaultTitle: 'Solar RO Drinking Water Filtration Plant',
      defaultLocation: 'Bangalore Rural · Karnataka',
      aspect: 'aspect-[16/11]',
      sizeClass: 'col-span-8 row-span-1',
      featured: true,
    },
    // Slot 4: Mid-Right (Medium) - Community Asset
    {
      slotId: 4,
      imageIndex: 8, // com-1
      categoryLabel: 'COMMUNITY ASSET',
      defaultTitle: 'Multipurpose Community & Skill Centre',
      defaultLocation: 'Ward 17, Pune · Maharashtra',
      aspect: 'aspect-[16/10]',
      sizeClass: 'col-span-6 row-span-1',
    },
    // Slot 5: Bottom-Left (Small/Medium) - Public Health
    {
      slotId: 5,
      imageIndex: 10, // hlth-1
      categoryLabel: 'PUBLIC HEALTH',
      defaultTitle: 'Primary Health Sub-Centre Diagnostic Unit',
      defaultLocation: 'Lucknow District · Uttar Pradesh',
      aspect: 'aspect-[16/10]',
      sizeClass: 'col-span-6 row-span-1',
    },
    // Slot 6: Bottom-Right (Small/Medium) - Education & Civil Works
    {
      slotId: 6,
      imageIndex: 12, // edu-1
      categoryLabel: 'EDUCATION INFRASTRUCTURE',
      defaultTitle: 'STEM Smart Classroom Complex',
      defaultLocation: 'East Delhi Constituency',
      aspect: 'aspect-[16/9]',
      sizeClass: 'col-span-12 row-span-1',
    },
  ]);

  const [activeFadingSlot, setActiveFadingSlot] = useState<number | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let step = 0;
    const interval = setInterval(() => {
      // Deterministically cycle ONE slot at a time
      const targetSlot = step % 7;
      step++;
      setActiveFadingSlot(targetSlot);

      setSlots((prev) => {
        const next = [...prev];
        const currentSlot = next[targetSlot];
        const nextImageIndex = (currentSlot.imageIndex + 1) % infrastructureImages.length;
        const newImg = infrastructureImages[nextImageIndex];

        next[targetSlot] = {
          ...currentSlot,
          imageIndex: nextImageIndex,
          categoryLabel: newImg.label,
          defaultTitle: newImg.title,
          defaultLocation: newImg.location,
        };
        return next;
      });

      // Reset fading indicator after transition completes
      setTimeout(() => {
        setActiveFadingSlot(null);
      }, 700);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[540px] select-none mx-auto lg:ml-auto">
      {/* Top Header Beacon: Live Infrastructure Intelligence */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#15324A] uppercase tracking-wider bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-[4px] border border-[#D9DFE3] shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-[#2E8064] animate-pulse" />
          <span>LIVE INFRASTRUCTURE INTELLIGENCE</span>
        </div>
        <span className="text-[10px] font-mono text-[#647383] hidden sm:inline">
          7 Categories Monitored
        </span>
      </div>

      {/* Structured Asymmetric Collage Grid (Matching Wireframe) */}
      <div className="grid grid-cols-12 gap-2.5 items-stretch">
        {/* Row 1: Field Inspection (5 cols) + Road Infrastructure (7 cols) */}
        <div className="col-span-5">
          <MosaicCard
            slot={slots[0]}
            isFading={activeFadingSlot === 0}
          />
        </div>
        <div className="col-span-7">
          <MosaicCard
            slot={slots[1]}
            isFading={activeFadingSlot === 1}
          />
        </div>

        {/* Row 2: Sanitation & Drainage (4 cols) + Water Infrastructure (8 cols, Featured Anchor) */}
        <div className="col-span-4">
          <MosaicCard
            slot={slots[2]}
            isFading={activeFadingSlot === 2}
          />
        </div>
        <div className="col-span-8">
          <MosaicCard
            slot={slots[3]}
            featured
            isFading={activeFadingSlot === 3}
          />
        </div>

        {/* Row 3: Community Asset (6 cols) + Public Health (6 cols) */}
        <div className="col-span-6">
          <MosaicCard
            slot={slots[4]}
            isFading={activeFadingSlot === 4}
          />
        </div>
        <div className="col-span-6">
          <MosaicCard
            slot={slots[5]}
            isFading={activeFadingSlot === 5}
          />
        </div>
      </div>
    </div>
  );
}

interface MosaicCardProps {
  slot: MosaicSlot;
  featured?: boolean;
  isFading?: boolean;
}

function MosaicCard({ slot, featured, isFading }: MosaicCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgData = infrastructureImages[slot.imageIndex % infrastructureImages.length];

  // Reset error state if image index changes
  useEffect(() => {
    setImageError(false);
  }, [slot.imageIndex]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[6px] border border-[#D9DFE3] bg-[#15324A] shadow-card transition-all duration-300 w-full h-full cursor-pointer hover:shadow-elevated hover:border-[#15324A] hover:scale-[1.025] ${
        featured ? 'min-h-[140px] sm:min-h-[160px]' : 'min-h-[110px] sm:min-h-[125px]'
      }`}
    >
      {/* Infrastructure Photograph with Robust Fallback */}
      {!imageError ? (
        <img
          src={imgData.src}
          alt={imgData.alt || slot.defaultTitle}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isFading ? 'opacity-30 scale-105 filter blur-xs' : 'opacity-90 scale-100'
          } ${isHovered ? 'brightness-75' : 'brightness-95'}`}
          loading="lazy"
        />
      ) : (
        /* Reliable Engineering Fallback Graphic */
        <div className="h-full w-full bg-[#15324A] flex flex-col items-center justify-center p-3 text-center text-white/80">
          <div className="h-7 w-7 rounded bg-[#D99018]/20 border border-[#D99018]/40 flex items-center justify-center mb-1 text-[#E5B45A]">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-[9px] font-mono font-bold text-[#E5B45A] uppercase tracking-wider">
            {slot.categoryLabel}
          </span>
          <span className="text-[10px] text-gray-300 truncate max-w-[140px] mt-0.5">
            {slot.defaultLocation}
          </span>
        </div>
      )}

      {/* Dark Institutional Gradient Overlay for High Contrast Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2638]/95 via-[#0F2638]/40 to-transparent pointer-events-none" />

      {/* Bottom Content Tagging */}
      <div className="absolute bottom-2 left-2 right-2 text-white pointer-events-none flex flex-col justify-end">
        {/* Category Label with Saffron/Amber Tag */}
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-[3px] bg-[#15324A]/90 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-[#E5B45A] border border-[#D99018]/40 uppercase backdrop-blur-xs">
            {slot.categoryLabel}
          </span>

          {isHovered && (
            <span className="text-[8px] font-mono text-[#E5B45A] flex items-center gap-0.5 animate-in fade-in duration-150">
              Inspect <ArrowUpRight className="h-2.5 w-2.5" />
            </span>
          )}
        </div>

        {/* Title & Location on Featured / Hover */}
        {(featured || isHovered) && (
          <div className="mt-1 transition-all duration-200">
            <div className="text-[10px] sm:text-[11px] font-bold text-white leading-tight truncate drop-shadow-xs">
              {slot.defaultTitle}
            </div>
            <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-gray-300 font-mono mt-0.5 truncate">
              <MapPin className="h-2.5 w-2.5 text-[#D99018] flex-shrink-0" />
              <span className="truncate">{slot.defaultLocation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Active Indicator Beacon */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#0F2638]/80 px-1.5 py-0.5 rounded-[3px] border border-white/10 backdrop-blur-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2E8064]" />
        <span className="text-[8px] font-mono text-gray-300">ACTIVE</span>
      </div>
    </div>
  );
}

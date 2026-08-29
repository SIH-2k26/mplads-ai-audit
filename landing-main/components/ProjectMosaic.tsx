import React, { useState, useEffect } from 'react';
import { infrastructureImages, InfrastructureImage } from '../data/infrastructureImages';
import { MapPin, ArrowUpRight, Activity } from 'lucide-react';

interface MosaicTileSlot {
  slotId: number;
  imageIndex: number;
  categoryLabel: string;
  defaultTitle: string;
  defaultLocation: string;
}

export function ProjectMosaic() {
  // 6 specific slots matching the exact wireframe blueprint
  const [slots, setSlots] = useState<MosaicTileSlot[]>([
    // Slot 0: Top-Right Large Box (Box 1 in wireframe)
    {
      slotId: 0,
      imageIndex: 0, // road-1
      categoryLabel: 'ROAD INFRASTRUCTURE',
      defaultTitle: 'Bituminous Village Link Road KM 12/400',
      defaultLocation: 'Haveli Taluka, Pune · Maharashtra',
    },
    // Slot 1: Top-Middle Medium Box (Box 2 in wireframe, stepped down slightly)
    {
      slotId: 1,
      imageIndex: 2, // san-1
      categoryLabel: 'SANITATION & DRAINAGE',
      defaultTitle: 'Underground Drainage & Stormwater Line',
      defaultLocation: 'Nagpur District · Maharashtra',
    },
    // Slot 2: Mid-Left Small Box (Box 3 in wireframe, leftmost equator)
    {
      slotId: 2,
      imageIndex: 6, // insp-1
      categoryLabel: 'FIELD INSPECTION',
      defaultTitle: 'IQM Physical Verification Audit',
      defaultLocation: 'Nashik District · Maharashtra',
    },
    // Slot 3: Center-Bottom Large Featured Box (Box 4 in wireframe)
    {
      slotId: 3,
      imageIndex: 4, // wat-1
      categoryLabel: 'WATER INFRASTRUCTURE',
      defaultTitle: 'Solar RO Drinking Water Filtration Plant',
      defaultLocation: 'Bangalore Rural · Karnataka',
    },
    // Slot 4: Mid-Right Medium Box (Box 5 in wireframe, under top-right box)
    {
      slotId: 4,
      imageIndex: 10, // hlth-1
      categoryLabel: 'PUBLIC HEALTH',
      defaultTitle: 'Primary Health Sub-Centre Diagnostic Unit',
      defaultLocation: 'Lucknow District · Uttar Pradesh',
    },
    // Slot 5: Bottom-Right Small Box (Box 6 in wireframe, bottom right corner)
    {
      slotId: 5,
      imageIndex: 8, // com-1
      categoryLabel: 'COMMUNITY ASSET',
      defaultTitle: 'Multipurpose Community & Skill Centre',
      defaultLocation: 'Ward 17, Pune · Maharashtra',
    },
  ]);

  const [activeFadingSlot, setActiveFadingSlot] = useState<number | null>(null);

  // Automatic image rotation: ONLY images inside the fixed boxes change
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let step = 0;
    const interval = setInterval(() => {
      // Deterministically cycle ONE slot at a time every 4 seconds
      const targetSlot = step % 6;
      step++;
      setActiveFadingSlot(targetSlot);

      setSlots((prev) => {
        const next = [...prev];
        const current = next[targetSlot];
        const nextIdx = (current.imageIndex + 1) % infrastructureImages.length;
        const newImg = infrastructureImages[nextIdx];

        next[targetSlot] = {
          ...current,
          imageIndex: nextIdx,
          categoryLabel: newImg.label,
          defaultTitle: newImg.title,
          defaultLocation: newImg.location,
        };
        return next;
      });

      // Clear fading highlight after transition completes
      setTimeout(() => {
        setActiveFadingSlot(null);
      }, 700);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[540px] select-none mx-auto lg:ml-auto">
      {/* 3-Column Asymmetric Wireframe Geometry */}
      <div className="grid grid-cols-12 gap-2.5 items-start">
        
        {/* COLUMN 1 (Far-Left ~24% width): Contains Mid-Left Box (Box 3) */}
        <div className="col-span-3 flex flex-col justify-center pt-[135px]">
          <MosaicTile
            slot={slots[2]}
            aspect="aspect-square"
            isFading={activeFadingSlot === 2}
          />
        </div>

        {/* COLUMN 2 (Center ~44% width): Top-Middle Box (Box 2) + Center-Bottom Box (Box 4) + Caption */}
        <div className="col-span-5 flex flex-col gap-2.5 pt-7">
          {/* Box 2: Top-Middle Medium Box (Stepped down from top) */}
          <MosaicTile
            slot={slots[1]}
            aspect="aspect-[1/0.92]"
            isFading={activeFadingSlot === 1}
          />

          {/* Box 4: Center-Bottom Large Featured Box */}
          <MosaicTile
            slot={slots[3]}
            aspect="aspect-square"
            featured
            isFading={activeFadingSlot === 3}
          />

          {/* Wireframe Caption Text */}
          <div className="pt-1 px-1">
            <p className="text-[11px] font-sans text-[#647383] leading-snug">
              Continuous telemetry and explainable risk scoring across all sanctioned civil and social public assets.
            </p>
          </div>
        </div>

        {/* COLUMN 3 (Right ~32% width): Top-Right Box (Box 1) + Mid-Right Box (Box 5) + Bottom-Right Box (Box 6) */}
        <div className="col-span-4 flex flex-col gap-2.5">
          {/* Box 1: Top-Right Large Box (starts at top y=0) */}
          <MosaicTile
            slot={slots[0]}
            aspect="aspect-[1/0.95]"
            isFading={activeFadingSlot === 0}
          />

          {/* Box 5: Mid-Right Medium Box */}
          <MosaicTile
            slot={slots[4]}
            aspect="aspect-[1/0.88]"
            isFading={activeFadingSlot === 4}
          />

          {/* Box 6: Bottom-Right Small Box */}
          <MosaicTile
            slot={slots[5]}
            aspect="aspect-square"
            isFading={activeFadingSlot === 5}
          />
        </div>

      </div>
    </div>
  );
}

interface MosaicTileProps {
  slot: MosaicTileSlot;
  aspect: string;
  featured?: boolean;
  isFading?: boolean;
}

function MosaicTile({ slot, aspect, featured, isFading }: MosaicTileProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgData = infrastructureImages[slot.imageIndex % infrastructureImages.length];

  useEffect(() => {
    setImageError(false);
  }, [slot.imageIndex]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[4px] border border-[#D9DFE3] bg-[#15324A] shadow-card transition-all duration-300 w-full ${aspect} cursor-pointer hover:border-[#15324A] hover:shadow-elevated`}
    >
      {/* Infrastructure Image */}
      {!imageError ? (
        <img
          src={imgData.src}
          alt={imgData.alt || slot.defaultTitle}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-all duration-500 ease-out ${
            isFading ? 'opacity-30 scale-105 filter blur-xs' : 'opacity-90 scale-100'
          } ${isHovered ? 'scale-[1.03] brightness-75' : 'brightness-95'}`}
          loading="lazy"
        />
      ) : (
        /* Reliable Engineering Fallback Graphic */
        <div className="h-full w-full bg-[#15324A] flex flex-col items-center justify-center p-2 text-center text-white/80">
          <div className="h-6 w-6 rounded bg-[#D99018]/20 border border-[#D99018]/40 flex items-center justify-center mb-1 text-[#E5B45A]">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#E5B45A] uppercase tracking-wider">
            {slot.categoryLabel}
          </span>
        </div>
      )}

      {/* Dark Gradient Overlay for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2638]/90 via-[#0F2638]/30 to-transparent pointer-events-none" />

      {/* Bottom Category Label Tag */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-white pointer-events-none flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-[2px] bg-[#15324A]/90 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-[#E5B45A] border border-[#D99018]/40 uppercase backdrop-blur-xs">
            {slot.categoryLabel}
          </span>

          {isHovered && (
            <span className="text-[8px] font-mono text-[#E5B45A] flex items-center gap-0.5 animate-in fade-in duration-150">
              <ArrowUpRight className="h-2.5 w-2.5" />
            </span>
          )}
        </div>

        {/* Title for Featured or Hover */}
        {(featured || isHovered) && (
          <div className="mt-1 transition-all duration-150">
            <div className="text-[10px] font-bold text-white leading-tight truncate drop-shadow-xs">
              {slot.defaultTitle}
            </div>
            <div className="flex items-center gap-0.5 text-[8px] text-gray-300 font-mono mt-0.5 truncate">
              <MapPin className="h-2 w-2 text-[#D99018] flex-shrink-0" />
              <span className="truncate">{slot.defaultLocation}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

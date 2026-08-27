import React, { useState, useEffect } from 'react';
import { infrastructureImages, InfrastructureImage } from '../../data/infrastructureImages';
import { MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TileData {
  imageIndex: number;
  project: string;
  location: string;
  status: string;
  risk: number;
  label: string;
}

export function ProjectMosaic() {
  // 7 initial tiles mapped deterministically
  const [tiles, setTiles] = useState<TileData[]>([
    { imageIndex: 3, project: 'Primary Health Sub-Centre', location: 'Pune District · Maharashtra', status: 'Under Monitoring', risk: 68, label: 'PUBLIC HEALTH' },
    { imageIndex: 2, project: 'Solar Drinking Water Unit', location: 'Bangalore Rural · Karnataka', status: 'Verified', risk: 24, label: 'WATER INFRASTRUCTURE' },
    { imageIndex: 4, project: 'Community Skill Centre', location: 'Ward 17, Pune · Maharashtra', status: 'Cost Deviation Flag', risk: 86, label: 'COMMUNITY ASSET' },
    { imageIndex: 6, project: 'Underground Drainage System', location: 'Nagpur · Maharashtra', status: 'Milestone Delayed', risk: 74, label: 'SANITATION & DRAINAGE' },
    { imageIndex: 0, project: 'Bituminous Village Link Road', location: 'Haveli Taluka · Maharashtra', status: 'Under Monitoring', risk: 82, label: 'ROAD INFRASTRUCTURE' },
    { imageIndex: 7, project: 'Independent Quality Survey', location: 'Nashik · Maharashtra', status: 'Inspection Active', risk: 42, label: 'FIELD VERIFICATION' },
    { imageIndex: 1, project: 'STEM Smart Classroom Complex', location: 'East Delhi Constituency', status: 'On Track', risk: 18, label: 'EDUCATION FACILITY' },
  ]);

  const [activeTileIndex, setActiveTileIndex] = useState<number>(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Every 4.5 seconds, deterministically cycle ONE tile
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % 7;
      setActiveTileIndex(currentStep);

      setTiles((prev) => {
        const next = [...prev];
        const targetTile = currentStep;
        const nextImgIndex = (next[targetTile].imageIndex + 1) % infrastructureImages.length;
        const imgData = infrastructureImages[nextImgIndex];

        next[targetTile] = {
          ...next[targetTile],
          imageIndex: nextImgIndex,
          project: imgData.title,
          location: imgData.location,
          label: imgData.label,
        };
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none py-2">
      {/* Subtle background ambient depth */}
      <div className="absolute inset-0 bg-[#D99018]/5 rounded-3xl filter blur-2xl pointer-events-none" />

      {/* Asymmetric Diamond Mosaic Grid */}
      <div className="relative grid grid-cols-12 gap-2.5 items-center">
        
        {/* Row 1: Top Apex (Small tile) */}
        <div className="col-span-5 col-start-4">
          <MosaicTile
            tile={tiles[0]}
            aspect="aspect-[4/3]"
            isActive={activeTileIndex === 0}
          />
        </div>

        {/* Row 2: Mid-Upper (Medium + Small) */}
        <div className="col-span-6 col-start-1">
          <MosaicTile
            tile={tiles[1]}
            aspect="aspect-[16/10]"
            isActive={activeTileIndex === 1}
          />
        </div>
        <div className="col-span-6">
          <MosaicTile
            tile={tiles[2]}
            aspect="aspect-[16/10]"
            isActive={activeTileIndex === 2}
          />
        </div>

        {/* Row 3: Main Center Anchor (Large featured + Medium) */}
        <div className="col-span-7">
          <MosaicTile
            tile={tiles[3]}
            aspect="aspect-[16/11]"
            featured
            isActive={activeTileIndex === 3}
          />
        </div>
        <div className="col-span-5">
          <MosaicTile
            tile={tiles[4]}
            aspect="aspect-[4/3]"
            isActive={activeTileIndex === 4}
          />
        </div>

        {/* Row 4: Bottom Footprint (Small + Small) */}
        <div className="col-span-5 col-start-2">
          <MosaicTile
            tile={tiles[5]}
            aspect="aspect-[16/10]"
            isActive={activeTileIndex === 5}
          />
        </div>
        <div className="col-span-5">
          <MosaicTile
            tile={tiles[6]}
            aspect="aspect-[16/10]"
            isActive={activeTileIndex === 6}
          />
        </div>

      </div>
    </div>
  );
}

interface MosaicTileProps {
  tile: TileData;
  aspect: string;
  featured?: boolean;
  isActive?: boolean;
}

function MosaicTile({ tile, aspect, featured, isActive }: MosaicTileProps) {
  const [fade, setFade] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const image = infrastructureImages[tile.imageIndex % infrastructureImages.length];

  useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(t);
  }, [tile.imageIndex]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[6px] border-2 border-white bg-[#15324A] shadow-card transition-all duration-700 cursor-pointer ${
        isActive ? 'scale-[1.02] ring-2 ring-[#D99018]/50' : 'hover:scale-[1.02]'
      } ${aspect}`}
    >
      {/* Infrastructure Image */}
      <img
        src={image.src}
        alt={image.alt}
        className={`h-full w-full object-cover transition-all duration-700 ${
          fade ? 'opacity-90' : 'opacity-0 scale-105'
        } ${isHovered ? 'brightness-50' : 'brightness-95'}`}
        loading="lazy"
      />

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2638]/95 via-[#0F2638]/30 to-transparent" />

      {/* Default Category & Title Tag */}
      {!isHovered && (
        <div className="absolute bottom-2 left-2 right-2 text-white pointer-events-none">
          <span className="inline-block rounded bg-[#15324A]/90 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-[#E5B45A] border border-[#D99018]/40">
            {tile.label}
          </span>
          {featured && (
            <div className="text-[10px] font-bold text-white truncate mt-0.5 leading-tight">
              {tile.project}
            </div>
          )}
        </div>
      )}

      {/* Hover Institutional Metadata Layer */}
      {isHovered && (
        <div className="absolute inset-0 p-2.5 flex flex-col justify-between text-white bg-[#0F2638]/85 animate-in fade-in duration-200">
          <div>
            <span className="text-[8px] font-mono font-bold text-[#E5B45A] uppercase tracking-wider block">
              {tile.label}
            </span>
            <div className="text-[11px] font-bold text-white leading-tight mt-0.5 line-clamp-2">
              {tile.project}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-300 mt-1 font-mono">
              <MapPin className="h-2.5 w-2.5 text-[#D99018]" />
              <span className="truncate">{tile.location}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[9px] font-mono">
            <span className="text-gray-300">{tile.status}</span>
            <span className={`font-bold ${tile.risk >= 70 ? 'text-[#C94B4B]' : 'text-[#2E8064]'}`}>
              Risk: {tile.risk}/100
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

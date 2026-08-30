import * as React from 'react';
import { Search, X, FolderKanban, ShieldAlert, BookOpen, Map, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/utils';

export interface CommandItem {
  id: string;
  category: 'Projects' | 'States' | 'Rules' | 'Risks' | 'Navigation';
  title: string;
  subtitle?: string;
  path: string;
  badge?: string;
}

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: CommandItem[];
}

export function CommandPalette({ open, onOpenChange }: CommandDialogProps) {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  const defaultItems: CommandItem[] = [
    { id: 'p-1023', category: 'Projects', title: 'P-1023: Community Hall & Skill Centre', subtitle: 'Pune District • Risk 86 / 100', path: '/projects/P-1023', badge: 'HIGH RISK' },
    { id: 'p-0871', category: 'Projects', title: 'P-0871: Bituminous Link Road KM 12/400', subtitle: 'Haveli Taluka • Delay +114 Days', path: '/projects/P-0871', badge: 'CRITICAL' },
    { id: 'p-0912', category: 'Projects', title: 'P-0912: Primary Health Sub-Centre Solar Unit', subtitle: 'Baramati • Risk 72 / 100', path: '/projects/P-0912', badge: 'HIGH RISK' },
    { id: 'c-0182', category: 'Risks', title: 'CASE-2026-0182: PWD SoR Rate Deviation', subtitle: 'Cost variance +38.2% vs district median', path: '/cases/CASE-2026-0182', badge: 'OPEN CASE' },
    { id: 'pol-001', category: 'Rules', title: 'MPLADS Guidelines 2023 §4.2', subtitle: 'Cost reasonableness & PWD SoR threshold', path: '/policies#POL-001', badge: 'STATUTORY' },
    { id: 'pol-002', category: 'Rules', title: 'GFR 2017 Rule 149 (e-Procurement)', subtitle: 'GeM purchase & mandatory 21-day tender', path: '/policies#POL-002', badge: 'PROCUREMENT' },
    { id: 'st-mh', category: 'States', title: 'Maharashtra State Risk Heatmap', subtitle: '2,481 Works • ₹1,248 Cr Tracked', path: '/state', badge: 'STATE' },
    { id: 'nav-dist', category: 'Navigation', title: 'District Authority Command Centre', subtitle: 'Action queue & pre-sanctions', path: '/district' },
    { id: 'nav-mp', category: 'Navigation', title: 'Member of Parliament (MP) Dashboard', subtitle: 'Constituency fund utilization overview', path: '/mp' },
    { id: 'nav-min', category: 'Navigation', title: 'Ministry / DIID Oversight Centre', subtitle: 'National executive longitudinal analytics', path: '/ministry' },
    { id: 'nav-map', category: 'Navigation', title: 'Geographic Risk Intelligence Maps', subtitle: 'National GIS spatial distribution', path: '/maps' },
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const filteredItems = defaultItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    onOpenChange(false);
    setQuery('');
    navigate(path);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#001B36]/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette Box */}
      <div className="relative z-50 w-full max-w-xl rounded-[8px] border-2 border-[#002449] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-2.5 border-b border-[#E5E3DC] px-4 py-3 bg-[#FAFAF9]">
          <Search className="h-4 w-4 text-[#D99016]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, risk signals, states, rules, or navigation (e.g. 'Pune', 'P-1023', 'SoR')..."
            className="flex-1 bg-transparent text-xs text-[#0E0E0E] placeholder-[#6B6B6B] outline-none font-sans"
            autoFocus
          />
          <kbd className="hidden sm:inline-block rounded border border-[#E5E3DC] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#6B6B6B]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#F1F0EC]">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B6B6B]">
              No results found for "<span className="font-semibold text-[#0E0E0E]">{query}</span>"
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.path)}
                className="w-full flex items-center justify-between p-2.5 rounded-[4px] hover:bg-[#F1F0EC] text-left transition-colors group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 p-1 rounded bg-white border border-[#E5E3DC] text-[#002449] group-hover:bg-[#002449] group-hover:text-white transition-colors">
                    {item.category === 'Projects' ? <FolderKanban className="h-3.5 w-3.5" /> :
                     item.category === 'Risks' ? <ShieldAlert className="h-3.5 w-3.5 text-[#C94B4B]" /> :
                     item.category === 'Rules' ? <BookOpen className="h-3.5 w-3.5 text-[#D99016]" /> :
                     item.category === 'States' ? <Map className="h-3.5 w-3.5 text-[#2E8064]" /> :
                     <ArrowRight className="h-3.5 w-3.5 text-[#002449]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0E0E0E] truncate group-hover:text-[#002449]">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] text-[#6B6B6B] truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E3DC] text-[#0E0E0E] flex-shrink-0 ml-2">
                    {item.badge}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E5E3DC] bg-[#FAFAF9] px-4 py-2 text-[10px] text-[#6B6B6B] font-mono">
          <span>Global Search Palette</span>
          <span>Use ↑ ↓ to navigate, ↵ to select</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/types';

interface Props {
  variant?: 'header' | 'landing' | 'compact';
}

export function LanguageSelector({ variant = 'header' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { language, setLanguage, languageInfo } = useLanguageStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.englishName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language. Current: ${languageInfo.nativeName}`}
        className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-xs font-mono font-bold transition-all border outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
          variant === 'landing'
            ? 'bg-white/90 text-[#002449] border-[#E5E3DC] hover:border-white/30 shadow-xs'
            : 'bg-white/5 text-white border-white/15 hover:border-white/30 shadow-xs'
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-white/70 flex-shrink-0" />
        <span className="truncate max-w-[100px] font-sans font-semibold">
          {languageInfo.nativeName}
        </span>
        <span className="text-[10px] text-gray-400 uppercase font-mono">
          [{languageInfo.code}]
        </span>
        <ChevronDown
          className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Language Modal / Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available Indian Languages"
          className="absolute right-0 mt-1.5 w-72 max-h-96 overflow-hidden rounded-[6px] border border-white/15 bg-[#002449] text-white shadow-2xl z-50 flex flex-col font-sans animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header & Search */}
          <div className="p-2.5 border-b border-white/15 bg-[#002449] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white/70">
              <span>22 EIGHTH SCHEDULE LANGUAGES</span>
              <span className="text-[10px] text-gray-400">EN + 22 IN</span>
            </div>

            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language / भाषा खोजें..."
                className="w-full h-8 pl-8 pr-7 rounded-[4px] border border-white/15 bg-[#002449] text-xs text-white placeholder:text-gray-400 focus:border-white/30 focus:outline-none"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto p-1 divide-y divide-[#234D6C]/40 text-xs">
            {filteredLanguages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-[4px] text-left transition-colors ${
                    isSelected
                      ? 'bg-white text-[#002449] font-bold'
                      : 'hover:bg-white/5 text-gray-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs truncate">
                        {item.nativeName}
                      </span>
                      {item.dir === 'rtl' && (
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                            isSelected
                              ? 'bg-[#002449] text-white border-white/40'
                              : 'bg-white/5 text-white/70 border-white/15'
                          }`}
                        >
                          RTL
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-mono truncate ${
                        isSelected ? 'text-[#002449]/80' : 'text-gray-400'
                      }`}
                    >
                      {item.englishName} • {item.region}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-[#002449] text-white/70 border-[#002449]'
                          : 'bg-[#002449] text-gray-400 border-white/15'
                      }`}
                    >
                      {item.code}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#002449]" />}
                  </div>
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-400">
                No language found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

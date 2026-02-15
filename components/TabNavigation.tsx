
// components/TabNavigation.tsx
import React, { useRef, useEffect } from 'react';
import { GameTab } from '../types';

interface TabNavigationProps {
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
  badges?: Record<string, number>;
}

const tabItems = [
  { id: GameTab.PRODUCERS, label: 'Forge', icon: '🏭' },
  { id: GameTab.CRAFTERS, label: 'Assembly', icon: '🛠️' },
  { id: GameTab.INVENTORY, label: 'Vault', icon: '📦' },
  { id: GameTab.RESEARCH, label: 'Labs', icon: '🔬' },
  { id: GameTab.FUSION, label: 'Fusion', icon: '⚛️' },
  { id: GameTab.QUESTS, label: 'Missions', icon: '📜' },
  { id: GameTab.MARKET, label: 'Void', icon: '🌌' },
  { id: GameTab.SPECIALIZATION, label: 'Paths', icon: '✨' },
  { id: GameTab.ACHIEVEMENTS, label: 'Trophies', icon: '🏆' },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, badges = {} }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div className="relative w-full overflow-hidden h-[48px] flex items-center">
      {/* Scrollable container with mask */}
      <div className="nav-mask w-full">
        <nav 
          ref={scrollRef}
          className="flex items-center w-full overflow-x-auto scrollbar-hide gap-1 px-6 snap-x scroll-smooth"
        >
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.id;
            const hasBadge = (badges[tab.id] || 0) > 0;
            
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center snap-center relative transition-all duration-300 rounded-md outline-none
                            ${isActive ? 'min-w-[60px] h-[40px]' : 'min-w-[50px] h-[40px] hover:bg-white/5 active:scale-90'}`}
              >
                {/* Active Indicator Background Pill */}
                {isActive && (
                  <div className="absolute inset-x-0.5 inset-y-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 z-0 shadow-[0_0_10px_rgba(52,211,153,0.1)]"></div>
                )}

                {/* Icon Container */}
                <div className={`relative z-10 text-lg transition-all duration-300 transform
                                ${isActive ? 'scale-110 -translate-y-1 drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]' : 'opacity-25 grayscale'}`}>
                  {tab.icon}
                  
                  {/* Compact Notification Dot */}
                  {hasBadge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border border-gray-950 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                  )}
                </div>
                
                {/* Label - Only shown when active */}
                <span className={`relative z-10 text-[6px] font-black uppercase tracking-tighter transition-all duration-300
                                  ${isActive ? 'text-emerald-400 opacity-100' : 'text-transparent opacity-0 h-0 overflow-hidden'}`}>
                  {tab.label}
                </span>

                {/* Micro Underline Beam */}
                {isActive && (
                  <div className="absolute bottom-1 w-3 h-[1.5px] bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;

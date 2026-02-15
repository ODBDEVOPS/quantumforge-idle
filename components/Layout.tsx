
// components/Layout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { GameTab } from '../types';
import TabNavigation from './TabNavigation';

interface LayoutProps {
  children: ReactNode;
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
  badges?: Record<string, number>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, badges }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden text-gray-100 font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 z-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-fuchsia-500 animate-pulse-slow"></div>
        <div className="absolute inset-0 opacity-5 bg-[size:30px_30px] bg-[radial-gradient(circle,_#4a0e70_1px,_transparent_1px)] z-0"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow pt-2 pb-[70px] px-2 md:px-6 overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {/* Futuristic Docked Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/90 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Safe Area Inset Support for Mobile */}
        <div className="max-w-screen-xl mx-auto flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {/* Subtle Top Accent Beam */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          
          <div className="flex items-center w-full px-2">
            <div className="flex-grow overflow-hidden">
              <TabNavigation activeTab={activeTab} onTabChange={onTabChange} badges={badges} />
            </div>
            
            {/* Full Screen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="flex-shrink-0 w-12 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl ml-1 hover:bg-white/10 active:scale-90 transition-all group"
              aria-label="Toggle Fullscreen"
            >
              <div className="relative text-lg opacity-40 group-hover:opacity-100 transition-opacity">
                {isFullscreen ? (
                  <span className="text-emerald-400">↙️</span>
                ) : (
                  <span className="text-gray-400">↗️</span>
                )}
                {/* Micro glow effect */}
                <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-100 transition-opacity">
                  {isFullscreen ? '↙️' : '↗️'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

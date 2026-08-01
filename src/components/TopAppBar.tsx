import React, { useState } from 'react';
import { TabType, WeatherInfo } from '../types';
import { AmbientAudioPlayer } from './AmbientAudioPlayer';

interface TopAppBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  weather: WeatherInfo;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  weather,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f0]/90 backdrop-blur-md border-b border-[#d5c3bb]/20 flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 transition-all duration-500">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#1c1c17] hover:opacity-70 transition-opacity p-2 flex items-center justify-center focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="icon text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Brand Title */}
        <button
          onClick={() => {
            onSelectTab('discover');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-garamond text-2xl sm:text-3xl tracking-[0.2em] text-[#1c1c17] hover:opacity-80 transition-opacity font-normal uppercase"
        >
          VANA CANOPY
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block">
            <AmbientAudioPlayer />
          </div>

          <button
            onClick={onOpenCart}
            className="relative text-[#1c1c17] hover:opacity-70 transition-opacity p-2 flex items-center justify-center"
            aria-label="Shopping bag"
          >
            <span className="icon text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#506443] text-white text-[10px] font-hanken font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile / Side Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#131e18]/95 backdrop-blur-lg text-white flex flex-col justify-between p-8 sm:p-12 animate-fade-in">
          <div className="flex justify-between items-center border-b border-[#7b877f]/30 pb-6">
            <div className="font-garamond text-2xl sm:text-3xl tracking-[0.2em] text-[#b7cea5]">
              VANA CANOPY
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#bdc9c1] hover:text-white p-2"
            >
              <span className="icon text-3xl">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-8 my-auto max-w-md">
            {[
              { id: 'discover', label: '01. Discover Sanctuary', icon: 'explore' },
              { id: 'reserve', label: '02. Reserve Mood Spot', icon: 'calendar_today' },
              { id: 'orders', label: '03. Artisanal Menu', icon: 'local_cafe' },
              { id: 'club', label: '04. Sanctuary Club', icon: 'stars' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as TabType);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 text-left font-garamond text-2xl sm:text-3xl transition-all ${
                  activeTab === item.id
                    ? 'text-[#b7cea5] pl-4 border-l-2 border-[#b7cea5]'
                    : 'text-[#bdc9c1] hover:text-white hover:pl-2'
                }`}
              >
                <span className="icon text-xl text-[#7b877f]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#7b877f]/30 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-hanken text-[#bdc9c1]">
            <div>
              <p className="uppercase tracking-widest text-[#7b877f] text-[10px]">Location</p>
              <p className="text-white mt-0.5">100ft Road, Indiranagar, Bengaluru</p>
            </div>
            <div>
              <p className="uppercase tracking-widest text-[#7b877f] text-[10px]">Hours</p>
              <p className="text-white mt-0.5">07:00 AM – 11:00 PM Daily</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

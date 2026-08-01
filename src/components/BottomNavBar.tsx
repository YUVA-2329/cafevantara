import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'discover' as TabType, label: 'Discover', icon: 'explore' },
    { id: 'reserve' as TabType, label: 'Reserve', icon: 'calendar_today' },
    { id: 'orders' as TabType, label: 'Orders', icon: 'receipt_long' },
    { id: 'club' as TabType, label: 'Club', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#f1eee5]/95 backdrop-blur-md border-t border-[#d5c3bb]/30 flex justify-around items-center h-16 sm:h-20 px-2 pb-safe md:px-12 shadow-[0_-1px_15px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              onSelectTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-1 w-20 sm:w-24 py-1 transition-all duration-300 ${
              isActive
                ? 'text-[#000000] scale-105 font-bold'
                : 'text-[#434844]/60 hover:text-[#000000]'
            }`}
          >
            <span
              className={`icon text-xl sm:text-2xl transition-colors ${
                isActive ? 'text-[#000000]' : 'text-[#737874]'
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-hanken text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-[#506443] rounded-full mt-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

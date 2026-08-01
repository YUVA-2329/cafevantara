import React, { useState } from 'react';
import { WeatherInfo, WeatherCondition } from '../types';

interface WeatherBannerProps {
  currentWeather: WeatherInfo;
  onWeatherChange: (info: WeatherInfo) => void;
}

export const weatherPresets: Record<WeatherCondition, WeatherInfo> = {
  rain: {
    condition: 'rain',
    temp: '21°C',
    label: 'LIGHT RAIN',
    subtitle: 'BENGALURU IS RAINING',
    bannerText: 'BENGALURU IS RAINING. We saved you a dry corner.',
  },
  mist: {
    condition: 'mist',
    temp: '19°C',
    label: 'MONSOON MIST',
    subtitle: 'COOL MIST CANOPY',
    bannerText: 'MONSOON MIST IN INDIRANAGAR. Hot Single-Origin Aeropress served.',
  },
  sunny: {
    condition: 'sunny',
    temp: '26°C',
    label: 'FILTERED SUNLIGHT',
    subtitle: 'DAPPER CANOPY SHADE',
    bannerText: 'WARM AFTERNOON SUNLIGHT. Tender Coconut Cold Brews ready.',
  },
  twilight: {
    condition: 'twilight',
    temp: '22°C',
    label: 'TWILIGHT CANOPY',
    subtitle: 'SILENT EVENING DUSK',
    bannerText: 'TWILIGHT IN THE FOREST. Soft jazz & botanical infusions active.',
  },
};

export const WeatherBanner: React.FC<WeatherBannerProps> = ({
  currentWeather,
  onWeatherChange,
}) => {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <>
      <div className="fixed top-20 sm:top-24 left-0 w-full z-40 px-4 sm:px-8 flex justify-center pointer-events-none">
        <div
          onClick={() => setShowSelector(true)}
          className="bg-[#ebe8df]/90 backdrop-blur-md border border-[#b7cea5]/40 rounded-none px-3 sm:px-5 py-2 flex items-center gap-2 sm:gap-3 pointer-events-auto cursor-pointer shadow-sm hover:border-[#506443] transition-all duration-300 group"
        >
          <span className="icon text-[#506443] text-[16px] group-hover:scale-110 transition-transform">
            {currentWeather.condition === 'rain'
              ? 'water_drop'
              : currentWeather.condition === 'mist'
              ? 'cloud'
              : currentWeather.condition === 'sunny'
              ? 'wb_sunny'
              : 'nights_stay'}
          </span>
          <p className="font-hanken text-[11px] sm:text-xs text-[#1c1c17] uppercase tracking-wider">
            <span className="font-bold text-[#506443] mr-1">{currentWeather.subtitle}.</span>
            <span className="hidden sm:inline">{currentWeather.bannerText.replace(`${currentWeather.subtitle}. `, '')}</span>
          </p>
          <span className="font-hanken text-[10px] text-[#737874] uppercase tracking-widest ml-1 border-l border-[#c3c8c3] pl-2 hidden md:inline">
            Change Weather ▾
          </span>
        </div>
      </div>

      {/* Weather Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fcf9f0] border border-[#d5c3bb]/60 max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSelector(false)}
              className="absolute top-4 right-4 text-[#737874] hover:text-[#1c1c17] text-lg font-mono"
            >
              ✕
            </button>

            <span className="font-hanken text-[11px] text-[#506443] uppercase tracking-[0.2em] font-semibold">
              Atmospheric Control
            </span>
            <h3 className="font-garamond text-2xl text-[#1c1c17] mt-1 mb-4">
              Simulate Bengaluru Weather
            </h3>
            <p className="font-hanken text-xs text-[#434844] mb-5 leading-relaxed">
              VANA's menu, ambient soundscapes, and lighting dynamically shift according to the weather outside.
            </p>

            <div className="flex flex-col gap-2.5">
              {(Object.keys(weatherPresets) as WeatherCondition[]).map((key) => {
                const item = weatherPresets[key];
                const isSelected = currentWeather.condition === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onWeatherChange(item);
                      setShowSelector(false);
                    }}
                    className={`flex items-center justify-between p-3.5 border transition-all text-left ${
                      isSelected
                        ? 'bg-[#131e18] text-white border-[#131e18]'
                        : 'bg-[#f1eee5] text-[#1c1c17] border-[#c3c8c3]/40 hover:border-[#506443]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="icon text-xl">
                        {key === 'rain'
                          ? 'water_drop'
                          : key === 'mist'
                          ? 'cloud'
                          : key === 'sunny'
                          ? 'wb_sunny'
                          : 'nights_stay'}
                      </span>
                      <div>
                        <div className="font-garamond text-lg font-medium leading-none">
                          {item.label}
                        </div>
                        <div className={`font-hanken text-[11px] mt-1 ${isSelected ? 'text-[#b7cea5]' : 'text-[#737874]'}`}>
                          {item.temp} • {item.subtitle}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="font-hanken text-xs uppercase tracking-widest text-[#b7cea5]">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

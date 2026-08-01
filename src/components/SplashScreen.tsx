import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Completely remove from DOM after 3.5 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-3xl transition-opacity duration-1000 ease-in-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background subtle nature gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a2f20]/60 via-[#07110c]/80 to-black opacity-90" />
      
      {/* Glassmorphism Nature-Inspired Card */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center p-16 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_15px_35px_0_rgba(80,100,67,0.25)] transition-transform duration-1000 ${
          isFading ? 'scale-110' : 'scale-100'
        }`}
        style={{
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
        }}
      >
        <span className="font-hanken text-xs tracking-[0.5em] uppercase text-[#b7cea5] font-semibold mb-6 opacity-70">
          Entering Sanctuary
        </span>
        <h1 className="font-garamond text-6xl sm:text-8xl font-light tracking-tight text-[#fcf9f0] drop-shadow-2xl">
          VANA
        </h1>
        <h2 className="font-garamond text-4xl sm:text-5xl italic text-[#b7cea5] mt-2 font-light tracking-widest drop-shadow-lg">
          CANOPY
        </h2>
        
        {/* Subtle decorative line */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#b7cea5] to-transparent mt-10 opacity-40" />
      </div>
    </div>
  );
};

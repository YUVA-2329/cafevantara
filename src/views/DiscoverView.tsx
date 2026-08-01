import React, { useState, useRef, useEffect } from 'react';
import { MoodSpot, MenuItem, WeatherInfo, TabType } from '../types';
import { moodSpots, menuItems } from '../data/mockData';

interface DiscoverViewProps {
  weather: WeatherInfo;
  onSelectTab: (tab: TabType) => void;
  onSelectSpotToReserve: (spot: MoodSpot) => void;
  onAddToCart: (item: MenuItem) => void;
}

const CANOPY_STREAMS = [
  {
    id: 'vana-canopy',
    name: 'Vana Canopy',
    quality: '4K Ultra HD',
    url: '/vana.mp4',
  },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  weather,
  onSelectTab,
  onSelectSpotToReserve,
  onAddToCart,
}) => {
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const seasonalItems = menuItems.filter(
    (i) => i.category === 'rainy' || i.tag?.includes('SEASONAL') || i.tag?.includes('SIGNATURE')
  );

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  const startAudio = () => {
    stopAudio();
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.866 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseNodeRef.current = noise;

      setIsAudioPlaying(true);
    } catch (e) {
      // Audio context might fail on initial touch
    }
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const currentStream = CANOPY_STREAMS[currentStreamIndex];

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Hero Section - 100vh on Laptop, 92vh on Mobile */}
      <section className="relative h-[90vh] sm:h-screen w-full flex flex-col justify-between overflow-hidden bg-[#07110c]">
        {/* Live 4K Background Video Player */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            key={currentStream.url}
            autoPlay
            loop
            muted={!isAudioPlaying}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              videoLoaded ? 'opacity-90 scale-105 filter contrast-125 saturate-[1.15] brightness-105 drop-shadow-2xl' : 'opacity-0'
            }`}
          >
            <source src={currentStream.url} type="video/mp4" />
          </video>

          {/* Fallback image if video is buffering */}
          {!videoLoaded && (
            <div
              className="bg-cover bg-center w-full h-full object-cover"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJD8IYNd7LyC4R0pWWl9_U5v4BTTHvivKrMktXCYjRqwaZh_tO_g8a2IwsYM0AMlOnhUKwKOUixiQifS7jWF60y4c6NE2isB2hZxzhuMYalf6xLtDYA9CphQKOUvugv0rEHpPe2nIk4-G7yt1TZHnDjcoBpFnyTifo2TbbLCJBv8atLlPiDhipjiB1X2lzKeUyLSLT7QVZRhROjCvI4sfJUsHHNCWC1XLuuTimCyMNzVNC2sEdGdtn')`,
              }}
            />
          )}

          <div className="grain-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07110C] via-black/30 to-black/60" />
        </div>

        {/* Top Floating Live Feed & Audio Controls */}
        <div className="relative z-10 pt-28 px-6 sm:px-12 md:px-20 flex flex-wrap justify-end items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`py-1 px-3 font-hanken text-[10px] uppercase tracking-wider border flex items-center gap-1.5 backdrop-blur-md transition-all ${
                isAudioPlaying
                  ? 'bg-[#506443] text-white border-[#b7cea5]'
                  : 'bg-black/50 text-white/70 border-white/20 hover:border-white/50'
              }`}
            >
              <span className="icon text-sm">{isAudioPlaying ? 'volume_up' : 'volume_off'}</span>
              <span className="hidden md:inline">{isAudioPlaying ? 'Rain Sound On' : 'Play Sound'}</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Main Content */}
        <div className="relative z-10 px-6 sm:px-12 md:px-20 pb-16 sm:pb-24 flex flex-col gap-4 sm:gap-6 text-white max-w-4xl">
          <span className="font-hanken text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#b7cea5] font-semibold border-l-2 border-[#b7cea5] pl-3">
            Botanical Forest Cafe • Indiranagar
          </span>

          <h1 className="font-garamond text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.08] text-[#fcf9f0] drop-shadow-2xl">
            VANA CANOPY<br />
            <span className="italic text-[#b7cea5] font-light text-2xl sm:text-4xl md:text-5xl">
              Sanctuary of Silence & Rain Botanicals
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={() => {
                const el = document.getElementById('location-status');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#131e18] text-[#fcf9f0] font-hanken text-xs py-3.5 px-8 uppercase tracking-[0.2em] hover:bg-[#506443] transition-colors border border-[#b7cea5]/40 shadow-2xl flex items-center gap-2 group"
            >
              <span>Explore Sanctuary</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>

            <button
              onClick={() => onSelectTab('reserve')}
              className="bg-black/40 backdrop-blur-md text-[#fcf9f0] font-hanken text-xs py-3.5 px-6 uppercase tracking-[0.2em] hover:bg-black/60 transition-colors border border-white/30"
            >
              Reserve Table
            </button>
          </div>

          {/* Bottom Live Info Bar Removed */}
        </div>
      </section>

      {/* Location Context & Quiet Status Section */}
      <section id="location-status" className="relative py-20 px-6 sm:px-12 md:px-20 bg-[#fcf9f0] border-b border-[#d5c3bb]/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
              Live Location Context
            </span>
            <h2 className="font-garamond text-3xl sm:text-5xl text-[#1c1c17] mt-2 mb-4">
              VANA Indiranagar<br />
              <span className="italic text-[#434844] text-2xl font-light">Urban Forest Sanctuary</span>
            </h2>
            <p className="font-hanken text-sm text-[#434844] leading-relaxed mb-6">
              A 6,000 sq ft botanical sanctuary built using ancient lime plaster, reclaimed teak timber, and raw monolithic granite from Channapatna. Engineered to reduce ambient sound by -18 dB.
            </p>

            <div className="flex flex-col gap-3 border-l-2 border-[#131e18] pl-5 py-1">
              <div className="flex justify-between items-center font-hanken text-xs text-[#1c1c17]">
                <span className="uppercase tracking-widest text-[#737874]">SANCTUARY STATUS</span>
                <span className="text-[#506443] font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#506443] animate-pulse"></span>
                  QUIET (32% Occupancy)
                </span>
              </div>
              <div className="flex justify-between items-center font-hanken text-xs text-[#1c1c17]">
                <span className="uppercase tracking-widest text-[#737874]">ESTIMATED SEATING WAIT</span>
                <span className="font-semibold">~8 MIN (Direct Entry)</span>
              </div>
              <div className="flex justify-between items-center font-hanken text-xs text-[#1c1c17]">
                <span className="uppercase tracking-widest text-[#737874]">SOUND LEVEL</span>
                <span className="font-semibold text-[#506443]">38 dB (Library Silence)</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedImageModal('https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZZpscL2WL3ay4pBQ73nfhB6HPpYDQq_PVaxMGHf8Bp8kau3cMM1-i2BzxicWzaE_7R8h9RplLEbM9n6-TI0Q8s3gkNy2yucing78TiCUFhq2WPg0kLpzv7XYR1BjOL9NdmEkr7hKaS1yrxN56TZy0KLORrIFaySjUxLBuh3Lj95dItOEh6qZUXSFEG_7JkvzQ2wUhTpXsgl5wrI_XjqKEaCOPbgxld6ArOMJpJNROyW1Io-9eFPE')}
            className="relative h-80 sm:h-96 w-full cursor-pointer group overflow-hidden border border-[#d5c3bb]/40 shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZZpscL2WL3ay4pBQ73nfhB6HPpYDQq_PVaxMGHf8Bp8kau3cMM1-i2BzxicWzaE_7R8h9RplLEbM9n6-TI0Q8s3gkNy2yucing78TiCUFhq2WPg0kLpzv7XYR1BjOL9NdmEkr7hKaS1yrxN56TZy0KLORrIFaySjUxLBuh3Lj95dItOEh6qZUXSFEG_7JkvzQ2wUhTpXsgl5wrI_XjqKEaCOPbgxld6ArOMJpJNROyW1Io-9eFPE"
              alt="VANA Indiranagar Courtyard Entrance"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-4 left-4 bg-[#fcf9f0]/90 backdrop-blur-md px-3 py-1.5 border border-[#d5c3bb]/60 font-hanken text-[10px] uppercase tracking-widest text-[#1c1c17] flex items-center gap-1">
              <span className="icon text-sm text-[#506443]">zoom_in</span> Click to expand 4K View
            </div>
          </div>
        </div>
      </section>

      {/* Weather Aware Seasonal Menu Section */}
      <section className="py-20 px-6 sm:px-12 md:px-20 bg-[#f1eee5] border-b border-[#d5c3bb]/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
                Atmospheric Pairings
              </span>
              <h2 className="font-garamond text-3xl sm:text-5xl text-[#1c1c17] mt-1">
                {weather.condition === 'rain'
                  ? 'Rainy Day Rituals'
                  : weather.condition === 'mist'
                  ? 'Monsoon Mist Brews'
                  : weather.condition === 'sunny'
                  ? 'Sunlight Canopy Refreshers'
                  : 'Twilight Drips & Infusions'}
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('orders')}
              className="font-hanken text-xs uppercase tracking-widest text-[#131e18] hover:text-[#506443] flex items-center gap-1 font-semibold border-b border-[#131e18] pb-1"
            >
              View Full Menu ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seasonalItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="bg-[#fcf9f0] border border-[#d5c3bb]/40 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-[#506443] transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-28 h-32 object-cover border border-[#ebe8df]"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-hanken text-[10px] text-[#506443] font-bold tracking-widest uppercase">
                      {item.tag}
                    </span>
                    <span className="font-garamond text-lg font-bold text-[#1c1c17]">
                      ₹{item.price}
                    </span>
                  </div>
                  <h3 className="font-garamond text-xl text-[#1c1c17] font-medium leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-hanken text-xs text-[#434844] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {item.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="font-hanken text-[10px] bg-[#ebe8df] text-[#434844] px-2 py-0.5 uppercase tracking-wider"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="mt-2 text-left font-hanken text-[11px] uppercase tracking-widest text-[#131e18] hover:text-[#506443] font-bold flex items-center gap-1"
                  >
                    + Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Mood Section */}
      <section className="py-20 px-6 sm:px-12 md:px-20 bg-[#fcf9f0]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <span className="font-hanken text-xs text-[#506443] uppercase tracking-[0.2em] font-semibold">
              Seating Sanctuaries
            </span>
            <h2 className="font-garamond text-3xl sm:text-5xl text-[#1c1c17] mt-1">
              Choose Your Mood
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x pb-6 -mx-6 px-6 hide-scrollbar">
            {moodSpots.map((spot) => (
              <div
                key={spot.id}
                className="min-w-[280px] sm:min-w-[340px] snap-center bg-[#ebe8df]/60 border border-[#d5c3bb]/40 p-6 flex flex-col justify-between hover:bg-[#ebe8df] transition-all cursor-pointer group"
                onClick={() => onSelectSpotToReserve(spot)}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-hanken text-[11px] text-[#737874] uppercase tracking-widest font-semibold">
                      {spot.spotNumber}
                    </span>
                    <span className="font-hanken text-[10px] bg-[#d2eac0] text-[#0e2006] px-2 py-0.5 uppercase tracking-wider font-bold">
                      {spot.vibe}
                    </span>
                  </div>

                  <div className="h-44 w-full mb-4 overflow-hidden border border-[#c3c8c3]/40">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="font-garamond text-2xl text-[#1c1c17] font-medium">
                    {spot.name}
                  </h3>
                  <p className="font-hanken text-xs text-[#506443] font-semibold uppercase tracking-wider mb-2">
                    {spot.subtitle}
                  </p>
                  <p className="font-hanken text-xs text-[#434844] line-clamp-3 leading-relaxed mb-4">
                    {spot.description}
                  </p>
                </div>

                <div className="border-t border-[#c3c8c3]/40 pt-4 flex justify-between items-center">
                  <span className="font-hanken text-[11px] text-[#737874] uppercase tracking-wider">
                    {spot.capacity}
                  </span>
                  <span className="font-hanken text-xs uppercase tracking-widest text-[#131e18] font-bold group-hover:text-[#506443] transition-colors">
                    Reserve Spot ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architectural Philosophy Section */}
      <section className="py-24 px-6 sm:px-12 md:px-20 bg-[#131e18] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          <span className="font-hanken text-xs text-[#b7cea5] uppercase tracking-[0.3em] font-semibold">
            Architectural Philosophy
          </span>
          <h2 className="font-garamond text-3xl sm:text-5xl md:text-6xl text-[#fcf9f0] leading-tight font-normal">
            "We built a container for silence so Bengaluru's noise stays outside."
          </h2>
          <p className="font-hanken text-xs sm:text-sm text-[#bdc9c1] max-w-2xl leading-relaxed">
            Every wall in VANA is troweled by hand using native unrefined lime plaster, which naturally regulates indoor humidity during Bangalore's monsoons while absorbing reverberations.
          </p>

          <div className="flex flex-wrap justify-center gap-8 border-t border-[#7b877f]/30 pt-8 mt-4 font-hanken text-xs text-[#bdc9c1]">
            <div>
              <p className="font-garamond text-3xl text-[#b7cea5] font-light">6,000 sq ft</p>
              <p className="uppercase tracking-widest text-[10px] mt-1">Urban Forest Area</p>
            </div>
            <div>
              <p className="font-garamond text-3xl text-[#b7cea5] font-light">80 Yrs Old</p>
              <p className="uppercase tracking-widest text-[10px] mt-1">Living Ficus Atrium</p>
            </div>
            <div>
              <p className="font-garamond text-3xl text-[#b7cea5] font-light">38 dB</p>
              <p className="uppercase tracking-widest text-[10px] mt-1">Noise Dampening</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-10 right-0 text-white font-mono text-xl"
            >
              ✕ Close
            </button>
            <img
              src={selectedImageModal}
              alt="4K VANA Architectural Sanctuary View"
              className="w-full h-auto max-h-[85vh] object-contain border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

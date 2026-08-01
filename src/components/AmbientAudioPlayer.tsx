import React, { useState, useEffect, useRef } from 'react';

export const AmbientAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'forest' | 'bowl'>('rain');
  const [volume, setVolume] = useState(0.4);
  const [showControls, setShowControls] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      noiseSourceRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = (type: 'rain' | 'forest' | 'bowl') => {
    stopAudio();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (type === 'rain') {
      // Procedural Rain synthesis: Pink noise + Biquad Lowpass filter
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseSourceRef.current = noise;
    } else if (type === 'forest') {
      // Forest wind + soft harmonics
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      // Slow LFO for wind gust
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseSourceRef.current = noise;
    } else {
      // Singing Bowl / Zen chime resonance
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(2, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(masterGain);
      osc.start();
      noiseSourceRef.current = osc;
    }

    setIsPlaying(true);
    setSoundType(type);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(soundType);
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setShowControls(!showControls)}
        className={`flex items-center gap-2 py-1.5 px-3 rounded-none border text-xs tracking-widest uppercase transition-all duration-300 ${
          isPlaying
            ? 'bg-[#506443] text-white border-[#506443]'
            : 'bg-[#f1eee5]/80 text-[#434844] border-[#c3c8c3]/40 hover:border-[#506443]'
        }`}
        title="Ambient Sanctuary Soundscape"
      >
        <span className="icon text-[16px]">{isPlaying ? 'graphic_eq' : 'volume_up'}</span>
        <span className="hidden sm:inline font-hanken">
          {isPlaying ? `Soundscape: ${soundType}` : 'Rain Soundscape'}
        </span>
      </button>

      {showControls && (
        <div className="absolute right-0 top-11 w-64 bg-[#fcf9f0] border border-[#d5c3bb]/40 p-4 shadow-lg backdrop-blur-md flex flex-col gap-3 text-xs text-[#1c1c17] font-hanken">
          <div className="flex justify-between items-center border-b border-[#ebe8df] pb-2">
            <span className="font-label-caps uppercase tracking-wider text-[#434844] font-semibold">
              Sanctuary Ambience
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-[#737874] hover:text-[#1c1c17]"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#737874] uppercase tracking-wider">Mode</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => startAudio('rain')}
                className={`py-1.5 text-[10px] uppercase tracking-wider border text-center transition-colors ${
                  soundType === 'rain' && isPlaying
                    ? 'bg-[#131e18] text-white border-[#131e18]'
                    : 'bg-[#ebe8df]/50 border-[#c3c8c3]/40 hover:bg-[#e5e2da]'
                }`}
              >
                Rain
              </button>
              <button
                onClick={() => startAudio('forest')}
                className={`py-1.5 text-[10px] uppercase tracking-wider border text-center transition-colors ${
                  soundType === 'forest' && isPlaying
                    ? 'bg-[#131e18] text-white border-[#131e18]'
                    : 'bg-[#ebe8df]/50 border-[#c3c8c3]/40 hover:bg-[#e5e2da]'
                }`}
              >
                Wind
              </button>
              <button
                onClick={() => startAudio('bowl')}
                className={`py-1.5 text-[10px] uppercase tracking-wider border text-center transition-colors ${
                  soundType === 'bowl' && isPlaying
                    ? 'bg-[#131e18] text-white border-[#131e18]'
                    : 'bg-[#ebe8df]/50 border-[#c3c8c3]/40 hover:bg-[#e5e2da]'
                }`}
              >
                Chime
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-[#737874]">
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="accent-[#506443] cursor-pointer"
            />
          </div>

          <button
            onClick={togglePlay}
            className="w-full mt-1 bg-[#131e18] text-white py-2 text-xs uppercase tracking-widest font-semibold hover:bg-[#506443] transition-colors"
          >
            {isPlaying ? 'Mute Soundscape' : 'Play Soundscape'}
          </button>
        </div>
      )}
    </div>
  );
};

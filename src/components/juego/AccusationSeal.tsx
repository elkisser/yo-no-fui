import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type Props = {
  correcto: boolean;
  visible: boolean;
  audioContext?: AudioContext | null;
  impactMs?: number;
};

const playStampImpact = (ctx: AudioContext) => {
  const now = ctx.currentTime;

  const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.12), ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(0.8, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.55, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.13);

  const thump = ctx.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(95, now);
  thump.frequency.exponentialRampToValueAtTime(65, now + 0.11);

  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.8, now + 0.01);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

  thump.connect(thumpGain);
  thumpGain.connect(ctx.destination);

  thump.start(now);
  thump.stop(now + 0.12);
};

const AccusationSeal: React.FC<Props> = ({ correcto, visible, audioContext, impactMs = 260 }) => {
  const didPlayRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      didPlayRef.current = false;
      return;
    }

    if (!audioContext) return;
    if (didPlayRef.current) return;

    const t = window.setTimeout(() => {
      if (didPlayRef.current) return;
      didPlayRef.current = true;
      try {
        playStampImpact(audioContext);
      } catch {}
    }, impactMs);

    return () => window.clearTimeout(t);
  }, [visible, audioContext, impactMs]);

  if (!visible) return null;

  const tone = correcto ? 'green' : 'red';

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative select-none animate-seal-stamp ${
            tone === 'green'
              ? 'bg-green-500/10 border-green-500/50 text-green-300 shadow-[0_22px_70px_rgba(34,197,94,0.18)]'
              : 'bg-red-500/10 border-red-500/50 text-red-300 shadow-[0_22px_70px_rgba(239,68,68,0.18)]'
          } border-4 rounded-full w-56 h-56 backdrop-blur-sm flex items-center justify-center`}
        >
          <div className="absolute inset-3 rounded-full border border-dashed border-white/25" />
          <div className="absolute inset-8 rounded-full border border-white/10" />

          <div className="relative flex flex-col items-center justify-center text-center px-6">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                tone === 'green'
                  ? 'bg-green-500/15 border-green-500/30'
                  : 'bg-red-500/15 border-red-500/30'
              }`}
            >
              {correcto ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            <div className="mt-4 text-[11px] font-mono tracking-[0.28em] uppercase opacity-90">
              EXPEDIENTE
            </div>
            <div className="mt-1 text-2xl font-serif font-bold tracking-wide">
              {correcto ? 'SELLADO' : 'RECHAZADO'}
            </div>
            <div className="mt-2 text-xs text-white/70 leading-relaxed">
              {correcto ? 'Acusación validada.' : 'Acusación incorrecta.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccusationSeal;

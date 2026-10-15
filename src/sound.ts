/**
 * Procedural Web Audio Sound Synthesizer for Jogurtoslávie
 * Zero external audio dependencies. Lightweight, authentic historical war-room soundscape.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

// Check stored mute preference
try {
  const saved = localStorage.getItem('jogurtoslavie_muted');
  if (saved !== null) {
    isMuted = saved === 'true';
  }
} catch {
  // ignore local storage errors
}

function getAudioContext(): AudioContext | null {
  if (isMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
  try {
    localStorage.setItem('jogurtoslavie_muted', String(muted));
  } catch {
    // ignore
  }
  if (muted && audioCtx) {
    audioCtx.suspend();
  } else if (!muted && audioCtx) {
    audioCtx.resume();
  }
}

export function isSoundMuted(): boolean {
  return isMuted;
}

/** Card flip / draw swoosh */
export function playCardDrawSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

/** Card action play */
export function playCardPlaySound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.19);
}

/** Dice rolling clatter */
export function playDiceRollSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const clicks = [0, 0.04, 0.09, 0.15, 0.22, 0.31];
  clicks.forEach((offset, idx) => {
    const t = ctx.currentTime + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300 + Math.random() * 200, t);
    gain.gain.setValueAtTime(0.08 * (1 - idx * 0.1), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.035);
  });
}

/** Battle gunfire / impact */
export function playCombatSound(success: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Noise burst for gunshot/explosion
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = success ? 'bandpass' : 'lowpass';
  filter.frequency.setValueAtTime(success ? 800 : 350, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);

  // Add low bass punch
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(success ? 140 : 80, now);
  sub.frequency.exponentialRampToValueAtTime(40, now + 0.2);

  subGain.gain.setValueAtTime(0.4, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  sub.connect(subGain);
  subGain.connect(ctx.destination);

  sub.start(now);
  sub.stop(now + 0.23);
}

/** Sabotage explosion */
export function playSabotageSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

/** Phase advance war drum */
export function playPhaseDrum() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.29);
}

/** Radio morse code chirp for events */
export function playRadioChirp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const pitches = [880, 880, 880, 1100];
  const times = [0, 0.08, 0.16, 0.24];

  pitches.forEach((f, i) => {
    const t = ctx.currentTime + times[i];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  });
}

/** Victory brass chime */
export function playVictorySound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const chords = [261.63, 329.63, 392.00, 523.25]; // C major
  chords.forEach((freq, idx) => {
    const t = ctx.currentTime + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.65);
  });
}

/** Defeat somber drone */
export function playDefeatSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [130.81, 123.47, 110.00, 98.00]; // descending minor
  notes.forEach((freq, idx) => {
    const t = ctx.currentTime + idx * 0.25;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.55);
  });
}

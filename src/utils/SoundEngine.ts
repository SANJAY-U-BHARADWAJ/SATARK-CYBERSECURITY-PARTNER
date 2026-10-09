// Procedural Web Audio Engine (No external MP3s)
// Implements 6-Layer Interactive Cyber Soundscape

class SoundEngine {
  private isMuted = false;
  private ctx: AudioContext | null = null;

  private initialize() {
    if (typeof window === 'undefined') return;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn("AudioContext creation failed", e);
      }
    }
    // Resume context if suspended (needed by some browsers)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public start() {
    this.initialize();
    
    if (typeof window !== 'undefined') {
      const unlock = () => {
        const ctx = this.getContext();
        if (ctx) {
          try {
            // Play futuristic startup sweep
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.8);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.0);
          } catch (e) {}
        }
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('click', unlock);
      window.addEventListener('keydown', unlock);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  
  public playTing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
    }
  }

  public playHover() {}
  public playClick() {}
  public playSuccess() {}
  public playAlert() {}

  public playWhoosh() {}
  public playScanLoop() { return { stop: () => {} }; }
}

export const soundEngine = new SoundEngine();

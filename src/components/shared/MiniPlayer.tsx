'use client';

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { X, YoutubeLogo, Pause, Play, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type PlayerState = {
  videoId: string;
  title: string;
} | null;

type PlayerContextType = {
  current: PlayerState;
  playing: boolean;
  play: (videoId: string, title: string) => void;
  togglePlay: () => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerContextType>({
  current: null,
  playing: false,
  play: () => {},
  togglePlay: () => {},
  close: () => {},
});

export function usePlayer() {
  return useContext(PlayerContext);
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match?.[1] ?? null;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PlayerState>(null);
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const play = useCallback((videoId: string, title: string) => {
    setCurrent({ videoId, title });
    setPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!current) return;
    postCommand(iframeRef.current, playing ? 'pauseVideo' : 'playVideo');
    setPlaying(p => !p);
  }, [current, playing]);

  const close = useCallback(() => {
    setCurrent(null);
    setPlaying(false);
  }, []);

  return (
    <PlayerContext.Provider value={{ current, playing, play, togglePlay, close }}>
      {children}
      {current && <MiniPlayer videoId={current.videoId} title={current.title} onClose={close} iframeRef={iframeRef} playing={playing} togglePlay={togglePlay} />}
    </PlayerContext.Provider>
  );
}

function postCommand(iframe: HTMLIFrameElement | null, func: string, args?: unknown[]) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args: args ?? [] }),
    '*',
  );
}

function MiniPlayer({ videoId, title, onClose, iframeRef, playing, togglePlay }: { videoId: string; title: string; onClose: () => void; iframeRef: React.RefObject<HTMLIFrameElement | null>; playing: boolean; togglePlay: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    postCommand(iframeRef.current, muted ? 'unMute' : 'mute');
    setMuted(!muted);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 rounded-lg overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-black"
      style={{ width: 320, height: 180 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full pointer-events-none"
        title={title}
      />
      {/* Hover controls */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 transition-opacity duration-200 flex flex-col justify-between p-2',
          hovered ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <span className="text-xs text-white font-medium truncate self-start">{title}</span>
        <div className="flex items-center gap-1 self-end">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            title={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause size={14} weight="fill" className="text-white" />
            ) : (
              <Play size={14} weight="fill" className="text-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <SpeakerSlash size={14} weight="fill" className="text-white" />
            ) : (
              <SpeakerHigh size={14} weight="fill" className="text-white" />
            )}
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
            title="Open in YouTube"
          >
            <YoutubeLogo size={14} weight="fill" className="text-white" />
          </a>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={14} weight="bold" className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Song } from '../types';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { RewindIcon } from './icons/RewindIcon';
import { FastForwardIcon } from './icons/FastForwardIcon';
import { CloseIcon } from './icons/CloseIcon';

interface MiniPlayerProps {
  song: Song;
  isPlaying: boolean;
  progress: { currentTime: number; duration: number; };
  onClose: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MiniPlayer: React.FC<MiniPlayerProps> = ({ song, isPlaying, progress, onClose, onPlayPause, onNext, onPrev, onSeek }) => {
  const progressPercentage = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;

  return (
    <div className="p-2 sm:p-4">
      <div className="mx-auto max-w-4xl bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-3 flex items-center gap-4">
        <img src={song.coverUrl} alt={song.title} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg shadow-md flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <div>
            <h4 className="font-bold text-gray-800 truncate">{song.title}</h4>
            <p className="text-sm text-gray-600 truncate">{song.artist}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 w-10 text-right">{formatTime(progress.currentTime)}</span>
            <div className="relative flex-grow h-1.5 bg-white/50 rounded-full">
               <div className="absolute top-0 left-0 bg-pink-400 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
               <input
                type="range"
                value={progress.currentTime}
                max={progress.duration || 0}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek slider"
               />
            </div>
            <span className="text-xs text-gray-500 w-10">{formatTime(progress.duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={onPrev} className="text-violet-600/80 p-2 rounded-full hover:bg-white/30 transition" aria-label="Previous song">
              <RewindIcon className="w-6 h-6" />
            </button>
            <button onClick={onPlayPause} className="text-white bg-[#ff5fa8] p-3 rounded-full shadow-lg hover:scale-110 transition" aria-label={isPlaying ? "Pause song" : "Play song"}>
              {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7" />}
            </button>
            <button onClick={onNext} className="text-violet-600/80 p-2 rounded-full hover:bg-white/30 transition" aria-label="Next song">
              <FastForwardIcon className="w-6 h-6" />
            </button>
        </div>
         <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-white/30 transition" aria-label="Close player">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
import React from 'react';
import { Song } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  isCurrentlyPlaying: boolean;
  isPlaying: boolean;
  progress: { currentTime: number; duration: number };
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay, isCurrentlyPlaying, isPlaying, progress }) => {
  const isThisSongPlaying = isCurrentlyPlaying && isPlaying;
  const progressPercentage = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;

  return (
    <div className="group bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg p-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-rotate-1">
      <div className="aspect-square rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-pink-100 to-violet-200">
        <div
          role="img"
          aria-label={song.title}
          style={{ backgroundImage: `url(${song.coverUrl})` }}
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
      </div>
      <div className="mt-4 text-left">
        <h3 className="font-bold text-xl text-gray-800 truncate">{song.title}</h3>
        <p className="text-sm text-gray-600">{song.artist}</p>
        <p className="text-xs text-gray-500 mt-1 italic">"{song.caption}"</p>
      </div>
      <div className="mt-4">
        <div className="bg-white/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div 
            className="bg-pink-400 h-1.5 transition-all duration-200 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-center mt-3">
          <button 
            onClick={() => onPlay(song)}
            className="bg-white/50 p-3 rounded-full shadow-md transition-transform hover:scale-110"
            aria-label={`${isThisSongPlaying ? 'Pause' : 'Play'} ${song.title}`}
            >
            {isThisSongPlaying ? (
              <PauseIcon className="w-6 h-6 text-[#ff5fa8]" />
            ) : (
              <PlayIcon className="w-6 h-6 text-[#ff5fa8]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;

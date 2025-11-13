
import React, { useEffect, useState } from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalSong: Song;
  onPlayFinalSong: (song: Song) => void;
  currentlyPlayingSongId?: number;
  isPlaying: boolean;
  progress: { currentTime: number; duration: number };
}

const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose, finalSong, onPlayFinalSong, currentlyPlayingSongId, isPlaying, progress }) => {
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowConfetti(true);
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    } else {
      setShowContent(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pink-200/50 backdrop-blur-lg"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-11/12 mx-auto text-center transition-all duration-500 ease-in-out ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showConfetti && (
          <>
            <div className="confetti" style={{ top: '20%', left: '20%' }}></div>
            <div className="confetti" style={{ top: '30%', left: '80%' }}></div>
            <div className="confetti" style={{ top: '70%', left: '10%' }}></div>
            <div className="confetti" style={{ top: '80%', left: '90%' }}></div>
          </>
        )}
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close modal">
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mt-4">
          <p className="animate-typewriter text-lg text-violet-800 mx-auto">
            And one more... for the future.
          </p>
        </div>
        
        <div className="my-6">
          <SongCard 
            song={finalSong} 
            onPlay={onPlayFinalSong}
            isCurrentlyPlaying={currentlyPlayingSongId === finalSong.id}
            isPlaying={isPlaying}
// Fix: Pass the progress to the SongCard component conditionally.
            progress={currentlyPlayingSongId === finalSong.id ? progress : { currentTime: 0, duration: 0 }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onPlayFinalSong(finalSong)}
            className="w-full sm:w-auto px-6 py-3 bg-[#ff5fa8] text-white rounded-full shadow-lg transition-transform hover:scale-105 font-bold"
          >
            Play Final Song
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/80 text-[#8b5cf6] rounded-full shadow-md transition-transform hover:scale-105 font-bold">
            <DownloadIcon className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurpriseModal;


import React, { useState, useEffect, useRef } from 'react';
import { Song } from './types';
import { songs, finalSong } from './constants';
import Header from './components/Header';
import SongCard from './components/SongCard';
import SurpriseModal from './components/SurpriseModal';
import MiniPlayer from './components/MiniPlayer';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const playlist = [...songs, finalSong];

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Effect to manage the audio source and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
        setProgress({
          currentTime: audio.currentTime || 0,
          duration: audio.duration || 0,
        });
    };
    const onEnded = () => handleNextSong();
    
    const onError = () => {
      const audio = audioRef.current;
      
      // When closing the player, some browsers fire a "not supported" error for the empty source.
      // We specifically check for this case (error code + empty/base URL source) and ignore it.
      const isClosingError = audio.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED &&
                             (!audio.currentSrc || audio.currentSrc === window.location.href);

      if (!audio.error || isClosingError) {
        return; // Ignore the spurious error.
      }
      
      let errorMessage = 'An unknown audio error occurred.';
      switch (audio.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'The audio playback was aborted by the user.';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'A network error caused the audio download to fail. Please check your internet connection.';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'The audio file is corrupted or uses features your browser does not support.';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'The audio format (e.g., .mp3, .m4a, .aac) may not be supported by your browser, or the URL could be incorrect.';
          break;
        default:
          errorMessage = `An unexpected error occurred. Code: ${audio.error.code}`;
          break;
      }
      console.error(
        `Audio Playback Error: ${errorMessage} (Source: ${audio.src})`,
        'More info: https://developer.mozilla.org/en-US/docs/Web/API/MediaError'
      );
      handleNextSong();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    if (currentlyPlaying) {
      if (audio.src !== currentlyPlaying.audioUrl) {
          audio.src = currentlyPlaying.audioUrl;
      }
    } else {
        // To prevent a harmless error when closing the player,
        // we explicitly pause, clear the source, and call load() to reset the element.
        audio.pause();
        audio.src = '';
        audio.load();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [currentlyPlaying]);

  // Effect to manage play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && currentlyPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Playback was interrupted or failed.", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentlyPlaying]);

  const handlePlaySong = (song: Song) => {
    if (currentlyPlaying?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(song);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (currentlyPlaying) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  };
  
  const handlePlayFinalSong = (song: Song) => {
    setIsModalOpen(false);
    handlePlaySong(song);
  };

  const handleNextSong = () => {
    if (!currentlyPlaying) return;
    const currentIndex = playlist.findIndex(s => s.id === currentlyPlaying.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentlyPlaying(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!currentlyPlaying) return;
    const currentIndex = playlist.findIndex(s => s.id === currentlyPlaying.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentlyPlaying(playlist[prevIndex]);
    setIsPlaying(true);
  };
  
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#ffd9e6] via-[#f8e9ff] to-[#dbe7ff] text-gray-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      </div>

      <div className="relative z-10 pb-32">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-great-vibes text-5xl md:text-7xl text-fuchsia-800/80 drop-shadow-lg">
            Happy 19 midhunaa&lt;3
          </h1>
          <p className="mt-2 text-lg md:text-xl text-violet-700/70">
            19 songs, one heart for my love of my life&gt;&gt;&gt;&gt;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`will-animate ${startAnimation ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <SongCard
                  song={song}
                  onPlay={handlePlaySong}
                  isCurrentlyPlaying={currentlyPlaying?.id === song.id}
                  isPlaying={isPlaying}
                  progress={currentlyPlaying?.id === song.id ? progress : { currentTime: 0, duration: 0 }}
                />
              </div>
            ))}
          </div>

          <div className="mt-16">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-pink-500 text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-105 animate-pulse-glow"
            >
              Open Your Birthday Surprise
            </button>
          </div>
        </main>
      </div>
      
      <SurpriseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        finalSong={finalSong} 
        onPlayFinalSong={handlePlayFinalSong}
        currentlyPlayingSongId={currentlyPlaying?.id}
        isPlaying={isPlaying}
        progress={progress}
      />
      
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${
          currentlyPlaying ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {currentlyPlaying && (
          <MiniPlayer 
            song={currentlyPlaying} 
            onClose={handleClosePlayer}
            isPlaying={isPlaying}
            progress={progress}
            onPlayPause={handlePlayPause}
            onNext={handleNextSong}
            onPrev={handlePrevSong}
            onSeek={handleSeek}
          />
        )}
      </div>
    </div>
  );
};

export default App;

'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import PrevButton from './prevButton';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import SongProgressBar from './songProgressBar';
import Volume from './volume';
import SongTitle from './SongName';

const PlayerBar = () => {
  const { 
    audioRef, 
    isPlaying, 
    songName, 
    volume, 
    loop, 
    shuffle,
    togglePlay, 
    handleNext, 
    handlePrev, 
    handleTimeChange, 
    handleVolumeChange, 
    handleLoop, 
    handleShuffle 
  } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-[#333333]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {songName && (
              <>
                <div className="album-art w-14 h-14 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white truncate">
                  <SongTitle file = {songName}/>
                  </div>
                  <div className="text-xs text-[#727272]">Now Playing</div>
                </div>
              </>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-3 flex-[2] min-w-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShuffle} 
                disabled={!audioRef.current} 
                className={`btn-icon ${
                  shuffle 
                    ? 'text-[#1db954] bg-[#1db954]/10' 
                    : 'text-[#b3b3b3] hover:text-white'
                } ${!audioRef.current ? 'opacity-50 cursor-not-allowed' : ''}`} 
                aria-label="Shuffle"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                </svg>
              </button>
              
              <PrevButton onClick={handlePrev} />
              <PausePlayButton onClick={togglePlay} isPlaying={isPlaying} />
              <NextButton onClick={handleNext} />
              
              <button 
                onClick={handleLoop} 
                className={`btn-icon ${
                  loop 
                    ? 'text-[#1db954] bg-[#1db954]/10' 
                    : 'text-[#b3b3b3] hover:text-white'
                }`} 
                aria-label={`Loop ${loop === 1 ? 'all' : loop === 2 ? 'one' : 'off'}`}
              >
                {loop === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                ) : loop === 1 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
            
            <div className="w-full max-w-md">
              <SongProgressBar audioRef={audioRef} songCurrentTime={handleTimeChange} />
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="w-6 h-6 text-[#b3b3b3]">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
            <Volume volume={volume} setVolume={handleVolumeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;

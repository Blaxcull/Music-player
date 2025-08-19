'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import PrevButton from './prevButton';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import SongProgressBar from './songProgressBar';
import Volume from './volume';

const PlayerBar = () => {
  const {
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    volume,
    handleVolumeChange,
    handleTimeChange,
    audioRef,
    songName,
    handleLoop,
    loop,
    handleShuffle,
    shuffle,
  } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Song Info */}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-100 truncate">
              {songName || 'Nothing playing'}
            </div>
            <div className="text-xs text-gray-400 truncate">Local library</div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-3 flex-[2] min-w-0">
            <div className="flex items-center gap-4">
              <button
                onClick={handleShuffle}
                disabled={!audioRef.current}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  shuffle ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
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
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  loop ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                }`}
                aria-label={`Loop ${loop === 1 ? 'all' : loop === 2 ? 'one' : 'off'}`}
              >
                {loop === 0 ? (
                  // No loop - standard repeat icon
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                ) : loop === 1 ? (
                  // Repeat all - standard repeat icon with blue color
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                ) : (
                  // Repeat one - repeat icon with "1" indicator
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
          <div className="flex items-center justify-end flex-1">
            <Volume volume={volume} setVolume={handleVolumeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;

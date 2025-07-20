'use client';

import { usePlayer } from '@/context/PlayerContext';
import PausePlayButton from '@/app/components/pausePlay';
import NextButton from '@/app/components/nextButton';
import PrevButton from '@/app/components/prevButton';
import Volume from '@/app/components/volume';
import SongProgressBar from '@/app/components/songProgressBar';
import AddToLiked from '@/app/components/addToLiked';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Liked = () => {
  const {
    files,
    handlePlay,
    togglePlay,
    isPlaying,
    isSongPlaying,
    currentIndex,
    handleNext,
    handlePrev,
    volume,
    handleVolumeChange,
    handleTimeChange,
    handleLoop,
    loop,
    handleShuffle,
    audioRef,
  } = usePlayer();

  const [likedIndices, setLikedIndices] = useState<number[]>([]);

  // Load liked indices from localStorage or API
  useEffect(() => {
    const stored = localStorage.getItem('likedSongs');
    if (stored) {
      setLikedIndices(JSON.parse(stored));
    }
  }, []);

  const likedSongs = likedIndices
    .map((index) => (files[index] ? { index, file: files[index] } : null))
    .filter(Boolean) as { index: number; file: string }[];

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Liked Songs</h2>

        {likedSongs.length === 0 ? (
          <p className="text-gray-500">You have not liked any songs yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {likedSongs.map(({ file, index }) => (
              <li key={index} className="flex items-center gap-4">
                <button
                  onClick={() => handlePlay(index, file)}
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {isSongPlaying(index) ? 'stop' : 'play'}
                </button>
                {file}
                <AddToLiked index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Show currently playing song */}
      <div>
        {files.map((file, index) =>
          index === currentIndex ? <div key={index}>{file}</div> : null
        )}
      </div>

      {/* Controls */}
      <PausePlayButton onClick={togglePlay} isPlaying={isPlaying} />
      <NextButton onClick={handleNext} />
      <PrevButton onClick={handlePrev} />
      <Volume volume={volume} setVolume={handleVolumeChange} />
      <SongProgressBar audioRef={audioRef} songCurrentTime={handleTimeChange} />

      <div className="fixed bottom-4 right-[70%] -translate-x-[70%]">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleLoop}
        >
          {loop} loop
        </button>
      </div>

      <div className="fixed bottom-4 left-[70%] translate-x-[70%]">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleShuffle}
          disabled={!audioRef.current}
        >
          shuffle
        </button>
      </div>

      <Link href="/" className="text-blue-600 underline mt-4 block">
        Go back to All Songs
      </Link>
    </>
  );
};

export default Liked;


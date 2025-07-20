'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import PrevButton from './prevButton';
import Volume from './volume';
import SongProgressBar from './songProgressBar';
import AddToLiked from './addToLiked';
import Link from 'next/link';

const Song = () => {
  const {
    files,
    setFiles,
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

  // Fetch list of available songs
  useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error('Failed to fetch music files:', err));
  }, [setFiles]);

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Available Songs</h2>
        <ul className="list-disc pl-5">
          {files.map((file, index) => (
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
      </div>

      {/* Show currently playing song */}
      <div>
        {files.map((file, index) =>
          index === currentIndex ? <div key={index}>{file}</div> : null
        )}
      </div>

      {/* Playback Controls */}
      <PausePlayButton onClick={togglePlay} isPlaying={isPlaying} />
      <NextButton onClick={handleNext} />
      <PrevButton onClick={handlePrev} />
      <Volume volume={volume} setVolume={handleVolumeChange} />
      <SongProgressBar audioRef={audioRef} songCurrentTime={handleTimeChange} />

      {/* Loop Button */}
      <div className="fixed bottom-4 right-[70%] -translate-x-[70%]">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleLoop}
        >
          {loop} loop
        </button>
      </div>

      {/* Shuffle Button */}
      <div className="fixed bottom-4 left-[70%] translate-x-[70%]">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleShuffle}
          disabled={!audioRef.current}
        >
          shuffle
        </button>
      </div>

      {/* Liked Songs Link */}
      <Link href="/liked" className="text-blue-600 underline mt-4 block">
        Go to Liked Songs
      </Link>
    </>
  );
};

export default Song;


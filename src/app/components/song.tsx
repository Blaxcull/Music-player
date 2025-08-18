'use client';

import {useRef, useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import PrevButton from './prevButton';
import Volume from './volume';
import SongProgressBar from './songProgressBar';
import AddToLiked from './addToLiked';
import Link from 'next/link';
import NewPlaylist from './newPlaylist';

const Song = () => {
  const {
    setFiles,
    handlePlay,
    togglePlay,
    isPlaying,
    isSongPlaying,
    songName,
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

const contextRef = useRef<HTMLDivElement | null>(null);

  const [allSongs,setAllSongs] = useState([])

  const [show,setShow] = useState(false)

  // Fetch list of available songs
  useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setAllSongs(data.files))
      .catch((err) => console.error('Failed to fetch music files:', err));
  }, [setFiles]);



  

const handleClick = (index: number) => {
  setFiles(allSongs, '/');

  handlePlay(index, allSongs[index]);
};


const [contextIndex,setContextIndex] = useState(0)


const handleRightClick= (e:MouseEvent,index: number) => {

    e.preventDefault()
    setShow(true)
    setContextIndex(index)


console.log('right')


};



const path = window.location.pathname
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
      setShow(false); // hide context menu
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  return (
    <>

    {show && (
        <div ref={contextRef} style={{ position: 'absolute', top: 100, left: 100, zIndex: 9999 }}>
        <NewPlaylist show={show} index={contextIndex} />
        </div>
    )}

    <div className="p-4">



        <h2 className="text-xl font-bold mb-2">Available Songs</h2>
        <ul className="list-disc pl-5">
          {allSongs.map((file, index) => (
            <li key={index} className="flex items-center gap-4">
              <button
                onClick={() => handleClick(index)}
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isSongPlaying(index, path) ? '|||' : 'play'}
              </button>
              <div onDoubleClick={()=>handleClick(index)}

              onContextMenu={(e) => handleRightClick(e, index)}
>



              {file}
              </div>
              <AddToLiked index={index} />
            </li>
          ))}
        </ul>
      </div>

      {/* Show currently playing song */}
      <div>
      {songName}
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
        <Link href="/playlist/20" className="text-blue-600 underline mt-4 block">
  go to playlist
</Link>
    </>
  );
};

export default Song;


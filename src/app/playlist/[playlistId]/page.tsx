"use client";

import { useEffect, useState,use,useRef } from "react";

import { usePlayer } from '@/context/PlayerContext';
import PausePlayButton from '@/app/components/pausePlay';
import NextButton from '@/app/components/nextButton';
import PrevButton from '@/app/components/prevButton';
import Volume from '@/app/components/volume';
import SongProgressBar from '@/app/components/songProgressBar';
import AddToLiked from '@/app/components/addToLiked';
import Link from 'next/link';
import NewPlaylist from '@/app/components/newPlaylist'


   
export default function PlaylistDetails({ params }: { params: Promise<{ playlistId: string }> }) {
  // unwrap the promise
  const { playlistId } = use(params);



  const {
    files,
    setFiles,
    isSongPlaying,
    handlePlay,
    togglePlay,
    isPlaying,
    currentIndex,
    handleNext,
    songName,
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

  const [playlistIndices, setPlaylistIndices] = useState<number[]>([]);

  const [playlistSongs, setplaylistSongs] = useState([])

  const [show,setShow] = useState(false)
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch("/api/getPlaylist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: 1, playlistId }),
        });
        const data = await res.json();

        if (data.playlistIndices) setPlaylistIndices(data.playlistIndices);

        console.log("API response:", data.playlistIndices);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };
    fetchPlaylist();
  }, [playlistId]);



useEffect(() => {
  fetch('/api/getMusic')
    .then((res) => res.json())
    .then((data) => {
    setplaylistSongs(playlistIndices.map(i => data.files[i]).reverse());
    })
    .catch((err) => console.error('Failed to fetch songs:', err));
}, [playlistIndices]);

const handleClick = (index: number) => {
  setFiles(playlistSongs, `/playlist/${playlistId}`); // tell context these are from liked
  handlePlay(index, playlistSongs[index]);
};

console.log(playlistIndices)

const path = window.location.pathname

const [contextIndex,setContextIndex] = useState(0)

const handleRightClick= (e:MouseEvent,index: number) => {
    e.preventDefault()
    setShow(true)

setContextIndex(index)






console.log('right')


};


console.log(path)



  return (
    <>
    {show && (
        <div ref={contextRef} style={{ position: 'absolute', top: 100, left: 100, zIndex: 9999 }}>
        <NewPlaylist show={show} index={contextIndex} />
        </div>
    )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Liked Songs</h2>
        <ul className="list-disc pl-5">
          {playlistSongs.map((file, index) => (
            <li key={playlistIndices[index]} className="flex items-center gap-4">
              <button
                onClick={() => {handleClick(index)

              console.log(index)
  console.log(file)

                }}
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                {isSongPlaying(index,path) ? '|||' : 'play'}
 
                
              </button>

              <div
              onContextMenu={(e)=>{handleRightClick(e,index)}}
              >

              {file}
              </div>
<AddToLiked index={playlistIndices[playlistIndices.length-1 -index]} />

            </li>
          ))}
        </ul>
      </div>

        <div className="p-4 text-green-600 font-semibold">
          Now playing: {songName}
        </div>

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
}


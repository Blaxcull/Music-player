'use client';

import React, { useState, useRef, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { usePathname } from "next/navigation";
import AddToLiked from "@/app/components/addToLiked";
import NewPlaylist from "@/app/components/newPlaylist";
import SongTitle from '../components/SongName';
import { calculateDialogPosition } from "@/lib/utils";

interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  songURL: string;
  coverArt: string;
  uploadedAt: string;
  liked: number;
  playlist: string[];
}

export default function AllSongs() {
  const { setFiles, isSongPlaying, handlePlay } = usePlayer();
  const path = usePathname();
  const [allSongs, setAllSongs] = useState<Song[]>([]);

  const contextRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0, anchor: 'top' as 'top' | 'bottom' });
  const [contextIndex, setContextIndex] = useState(0);

  // Fetch songs
  useEffect(() => {
    const userId = 1;
    fetch(`/api/getMusic?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.songs && Array.isArray(data.songs)) {
          setAllSongs(data.songs);
        } else {
          console.error('Unexpected data structure:', data);
          setAllSongs([]);
        }
      })
      .catch((err) => console.error('Failed to fetch music files:', err));
  }, []);

  const handleClick = (index: number) => {
    // Convert songs to file URLs for the player
    const songUrls = allSongs.map(song => song.songURL);
    setFiles(songUrls, "/allSongs");
    handlePlay(index, allSongs[index].songURL);
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const position = calculateDialogPosition(e.clientX, e.clientY);
    setContextPosition(position);
    setShow(true);
    setContextIndex(index);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }

    // Use capture phase to prevent event bubbling issues
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-32">
    <br/>
      {/* Context Menu */}
      {show && (
        <div
          ref={contextRef}
          style={{
            left: contextPosition.x,
            top: contextPosition.y,
            transform: 'none',
            marginTop: 0,
            pointerEvents: 'auto',
            position: 'fixed',
            contain: 'layout style paint'
          }}
        >
          <NewPlaylist 
            show={show} 
            songFileName={allSongs[contextIndex]?.title || ''} 
            onClose={() => setShow(false)}
            position={contextPosition}
            anchor={contextPosition.anchor}
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text">All Songs</h1>
        <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">Your complete music library with all your favorite tracks</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1db954]/10 to-[#1ed760]/10 border border-[#1db954]/20 rounded-full">
          <svg className="w-5 h-5 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span className="text-sm font-medium text-[#1db954]">{allSongs.length} songs</span>
        </div>
      </div>

      {/* Song List */}
      <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#333333]">
        <div className="p-6 border-b border-[#333333] bg-gradient-to-r from-[#282828] to-[#333333]">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            Tracks
          </h2>
        </div>
        <div className="divide-y divide-[#333333]">
          {allSongs.map((song, index) => (
            <div
              key={song._id || index}
              className="song-row p-4 group"
              onContextMenu={(e) => handleRightClick(e, index)}
            >
              <div className="w-8 text-[#727272] text-sm font-medium">{index + 1}</div>
              
              <button
                onClick={() => handleClick(index)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  isSongPlaying(index, path) 
                    ? 'bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white shadow-lg shadow-[#1db954]/25' 
                    : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#383838] hover:text-white'
                }`}
              >
                {isSongPlaying(index, path) ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>


              <div
                onDoubleClick={() => handleClick(index)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="text-sm font-medium text-white truncate group-hover:text-[#1db954] transition-colors">
                  {song.title}
                </div>
                <div className="text-xs text-[#727272] group-hover:text-[#b3b3b3] transition-colors">
                  {song.artist}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onContextMenu={(e) => handleRightClick(e, index)}
                  className="btn-icon text-[#727272] hover:text-[#1db954] transition-colors opacity-0 group-hover:opacity-100"
                  title="Right-click to add to playlist"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
                <span className="text-xs text-[#727272] font-mono">
                  {formatDuration(song.duration)}
                </span>
                <AddToLiked file={song.songURL} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


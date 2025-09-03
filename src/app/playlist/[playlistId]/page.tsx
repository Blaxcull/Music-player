'use client';

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import AddToLiked from "@/app/components/addToLiked";
import NewPlaylist from "@/app/components/newPlaylist";
import { calculateDialogPosition } from "@/lib/utils";

export default function PlaylistDetails() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { setFiles, isSongPlaying, handlePlay } = usePlayer();
  const pathname = usePathname();

  const contextRef = useRef<HTMLDivElement | null>(null);
  const [contextIndex, setContextIndex] = useState(0);
  const [playlistSongs, setPlaylistSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0, anchor: 'top' as 'top' | 'bottom' });

  useEffect(() => {
    if (!playlistId) return;

    const fetchPlaylist = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/getPlaylist?userId=1&playlistName=${encodeURIComponent(playlistId)}`);
        const data = await res.json();
        if (data.success && data.playlist) {
          setPlaylistSongs(data.playlist.songs || []);
        } else {
          setPlaylistSongs([]);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setPlaylistSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleClick = (index: number) => {
    setFiles(playlistSongs.map(song => song.songURL), `/playlist/${playlistId}`);
    handlePlay(index, playlistSongs[index].songURL);
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const position = calculateDialogPosition(e.clientX, e.clientY);
    setContextPosition(position);
    setShow(true);
    setContextIndex(index);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#727272]">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Context Menu */}
      <br/>
      {show && (
        <div
          ref={contextRef}
          className="fixed z-[9999] bg-[#181818] shadow-2xl rounded-xl p-4 border border-[#333333]"
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
            songFileName={playlistSongs[contextIndex]?.title || ''} 
            onClose={() => setShow(false)}
            position={contextPosition}
            anchor={contextPosition.anchor}
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold gradient-text">{playlistId}</h2>
        <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">Your curated playlist</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-full">
          <span className="text-sm font-medium text-pink-400">{playlistSongs.length} tracks</span>
        </div>
      </div>

      {/* Song List */}
      <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#333333]">
        <div className="divide-y divide-[#333333]">
          {playlistSongs.length === 0 ? (
            <div className="text-center py-12 text-[#727272]">
              <p className="text-lg text-white mb-2">This playlist is empty</p>
              <p className="text-sm">Add some songs to get started!</p>
            </div>
          ) : (
            playlistSongs.map((song, index) => (
              <div 
                key={song._id || index} 
                className="song-row p-4 group flex items-center gap-3"
                onContextMenu={(e) => handleRightClick(e, index)}
              >
                <div className="w-8 text-[#727272] text-sm font-medium">{index + 1}</div>
                
                <button
                  onClick={() => handleClick(index)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    isSongPlaying(index, pathname)
                      ? 'bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white shadow-lg shadow-[#1db954]/25'
                      : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#383838] hover:text-white'
                  }`}
                >
                  {isSongPlaying(index, pathname) ? (
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
                  <span className="text-xs text-[#727272] font-mono">{formatDuration(song.duration)}</span>
                  <AddToLiked
                    file={song.songURL}
                    removeLiked={(removedFile) => {
                      setPlaylistSongs(prev =>
                        prev.filter(s => s.songURL !== removedFile)
                      );
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


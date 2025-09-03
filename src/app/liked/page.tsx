'use client';
import React, { useState, useRef, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { usePathname } from "next/navigation";
import AddToLiked from "@/app/components/addToLiked";
import NewPlaylist from "@/app/components/newPlaylist";
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

export default function Liked() {
  const { setFiles, isSongPlaying, handlePlay } = usePlayer();
  const pathname = usePathname();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contextRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0, anchor: 'top' as 'top' | 'bottom' });
  const [contextIndex, setContextIndex] = useState(0);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = 1;
        const res = await fetch(`/api/getLikedSongs?userId=${userId}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        
        if (data.songs && Array.isArray(data.songs)) {
          setLikedSongs(data.songs);
        } else {
          setLikedSongs([]);
          setError('No liked songs found in database');
        }
      } catch (err) {
        console.error('Failed to fetch liked songs:', err);
        setLikedSongs([]);
        setError(`Failed to fetch liked songs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLikedSongs();
  }, []);

  const handleClick = (index: number) => {
    // Convert songs to file URLs for the player
    const songUrls = likedSongs.map(song => song.songURL);
    setFiles(songUrls, "/liked");
    handlePlay(index, likedSongs[index].songURL);
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

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#727272]">Loading liked songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <p className="text-red-500 text-lg mb-2">Error loading liked songs</p>
          <p className="text-[#727272] text-sm mb-4">{error}</p>
          <div className="bg-[#181818] border border-[#333333] rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-[#b3b3b3] mb-2">This might be because:</p>
            <ul className="text-xs text-[#727272] space-y-1 text-left">
              <li>• No songs have been uploaded to the database yet</li>
              <li>• No songs have been marked as liked</li>
              <li>• Database connection issue</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-[#333333]">
              <p className="text-xs text-[#1db954]">
                💡 Try uploading some songs first using the upload area above!
              </p>
            </div>
          </div>
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
            songFileName={likedSongs[contextIndex]?.title || ''} 
            onClose={() => setShow(false)}
            position={contextPosition}
            anchor={contextPosition.anchor}
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold gradient-text">Liked Songs</h2>
        <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">Your favorites collection with all the tracks you love</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-full">
          <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-sm font-medium text-pink-400">{likedSongs.length} tracks</span>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#333333]">
        <div className="p-6 border-b border-[#333333] bg-gradient-to-r from-pink-800/20 to-rose-700/20">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            Favorites
          </h2>
        </div>
        <div className="divide-y divide-[#333333]">
          {likedSongs.length === 0 ? (
            <div className="text-center py-12 text-[#727272]">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <p className="text-lg text-white mb-2">No liked songs yet</p>
              <p className="text-sm">Start liking songs to see them here!</p>
            </div>
          ) : (
            likedSongs.map((song, index) => (
              <div 
                key={song._id || index} 
                className="song-row p-4 group"
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
                  <AddToLiked
                    file={song.songURL}
                    removeLiked={(removedFile) => {
                      setLikedSongs((prev) =>
                        prev.filter((s) => s.songURL !== removedFile)
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


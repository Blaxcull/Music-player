'use client';
import Link from "next/link";
import React, {useEffect, useState } from "react";
import { usePlaylist } from "@/context/playlistContext";

const SideBar = () => {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const { allPlaylist, isLoading, refreshPlaylists } = usePlaylist();

  const handleClickPlaylist = async (playlistName: string) => {
    try {
      const res = await fetch("/api/deletePlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: 1, playlistName }),
      });

      const data = await res.json();
      console.log("Delete response:", data);
      
      if (data.success) {
        refreshPlaylists();
      } else {
        console.error("Failed to delete playlist:", data.error);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] border-r border-[#333333]">
      {/* Header */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Harmony</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {/* Library Links */}
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-[#727272] uppercase tracking-wider mb-4">Library</h2>
          
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b3b3b3] rounded-lg hover:bg-[#282828] hover:text-white transition-all duration-200 group">
            <div className="w-5 h-5 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1db954] transition-all duration-200">
              <svg className="w-3 h-3 text-[#b3b3b3] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            Home
          </Link>

          <Link href="/allSongs" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b3b3b3] rounded-lg hover:bg-[#282828] hover:text-white transition-all duration-200 group">
            <div className="w-5 h-5 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1db954] transition-all duration-200">
              <svg className="w-3 h-3 text-[#b3b3b3] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            All Songs
          </Link>

          <Link href="/liked" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b3b3b3] rounded-lg hover:bg-[#282828] hover:text-white transition-all duration-200 group">
            <div className="w-5 h-5 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1db954] transition-all duration-200">
              <svg className="w-3 h-3 text-[#b3b3b3] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            Liked Songs
          </Link>
        </div>

        {/* Playlists Section */}
        <div className="space-y-1 pt-6">
          <h2 className="text-xs font-semibold text-[#727272] uppercase tracking-wider mb-4">Playlists</h2>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)} 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b3b3b3] rounded-lg hover:bg-[#282828] hover:text-white transition-all duration-200 w-full group"
          >
            <div className="w-5 h-5 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1db954] transition-all duration-200">
              <svg className="w-3 h-3 text-[#b3b3b3] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            My Playlists
            <svg 
              className={`w-4 h-4 ml-auto transition-transform duration-200 ${showPlaylist ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          
          {showPlaylist && (
            <div className="ml-6 mt-2 space-y-1">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-[#727272] italic flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#727272] border-t-[#1db954] rounded-full animate-spin"></div>
                  Loading playlists...
                </div>
              ) : allPlaylist.length === 0 ? (
                <div className="px-3 py-2 text-sm text-[#727272] italic">No playlists yet</div>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {allPlaylist.map((playlist) => (
                    <div key={playlist} className="flex items-center px-3 py-2 text-sm text-[#b3b3b3] rounded-lg hover:bg-[#282828] transition-all duration-200 group">
                      <Link href={`/playlist/${playlist}`} className="flex-1 truncate hover:text-white cursor-pointer transition-colors duration-200">
                        {playlist}
                      </Link>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClickPlaylist(playlist); }}
                        className="ml-2 text-[#ef4444] hover:text-[#f87171] hover:bg-[#ef4444]/10 p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Delete playlist"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-[#333333]">
        <div className="text-center">
          <p className="text-xs text-[#727272] mb-2">Made with ❤️</p>
          <p className="text-xs text-[#4d4d4d]">Harmony Music Player</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;


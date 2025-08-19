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
      body: JSON.stringify({ userId: 1, fieldName: playlistName }),
    });

    const data = await res.json();
    console.log("Delete response:", data);
    refreshPlaylists();
  } catch (error) {
    console.error("Error deleting playlist:", error);
  }
};





  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Music Player</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Library
          </h2>
          
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            Home
          </Link>
          
          <Link 
            href="/allSongs" 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            All Songs
          </Link>
          
          <Link 
            href="/liked" 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Liked Songs
          </Link>
        </div>

        <div className="space-y-1 pt-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Playlists
          </h2>
          
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 transition-colors w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Playlists
            <svg 
              className={`w-4 h-4 ml-auto transition-transform ${showPlaylist ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showPlaylist && (
            <div className="ml-6 mt-2">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-gray-500 italic">Loading playlists...</div>
              ) : allPlaylist.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 italic">No playlists yet</div>
              ) : (
    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
      {allPlaylist.map((playlist) => (
        <div
          key={playlist}
          className="flex items-center px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-800 transition-colors"
        >
          {/* Whole row except bin is wrapped in Link */}
          <Link
            href={`/playlist/${playlist}`}
            className="flex-1 truncate hover:text-gray-200 cursor-pointer"
          >
            {playlist}
          </Link>

          <span
            className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();   // 👈 prevent Link navigation
              e.stopPropagation();  // 👈 prevent bubbling
 handleClickPlaylist(playlist)             
            }}
          >
            bin
          </span>
        </div>
      ))}
    </div>

              )}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>© 2024 Harmony</p>
          <p className="mt-1">Your music, your way</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;


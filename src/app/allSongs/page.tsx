'use client';

import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import AddToLiked from '@/app/components/addToLiked';
import NewPlaylist from '@/app/components/newPlaylist';

const Song = () => {
  const { setFiles, isSongPlaying, handlePlay } = usePlayer();

  const contextRef = useRef<HTMLDivElement | null>(null);

  const [allSongs, setAllSongs] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [contextIndex, setContextIndex] = useState(0);

  // Fetch songs
  useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setAllSongs(data.files))
      .catch((err) => console.error('Failed to fetch music files:', err));
  }, []);

  const handleClick = (index: number) => {
    setFiles(allSongs, '/allSongs');
    handlePlay(index, allSongs[index]);
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setShow(true);
    setContextIndex(index);
  };

  const path = window.location.pathname;
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">All Songs</h1>
          <p className="text-gray-400 mt-1">Your complete music library</p>
        </div>
        <div className="text-sm text-gray-500">
          {allSongs.length} songs
        </div>
      </div>

      {/* Context Menu */}
      {show && (
        <div
          ref={contextRef}
          className="absolute top-40 left-40 z-50 bg-gray-800 shadow-xl rounded-xl p-4 border border-gray-700"
        >
          <NewPlaylist show={show} index={contextIndex} onClose={() => setShow(false)} />
        </div>
      )}

      {/* Song List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-100">Tracks</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {allSongs.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => handleClick(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    isSongPlaying(index, path) 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {isSongPlaying(index, path) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <div
                  onDoubleClick={() => handleClick(index)}
                  onContextMenu={(e) => handleRightClick(e, index)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="text-sm font-medium text-gray-100 truncate">
                    {file.replace('.mp3', '')}
                  </div>
                  <div className="text-xs text-gray-400">Track</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <AddToLiked index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Song;


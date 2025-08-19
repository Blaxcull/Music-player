import React from "react"
import { useEffect, useState } from "react"
import { usePlaylist } from "@/context/playlistContext";

type NewPlaylistProps = {
  show: boolean
  index: number
  onClose?: () => void
}

const NewPlaylist = ({ show, index, onClose }: NewPlaylistProps) => {
  const { allPlaylist, addPlaylist, refreshPlaylists } = usePlaylist();
  const [fieldName, setFieldName] = useState('')
  const [playlistSet, setPlaylistSet] = useState<string[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldName(event.target.value);
  };
  
  useEffect(() => {
    const userId = 1;
    fetch(`/api/addPlaylist?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const keys = Object.keys(data).filter((key) => key !== "_id");
        setPlaylistSet(keys);
      })
      .catch((err) => console.error("Failed to fetch playlists:", err));
  }, []);

  useEffect(() => {
    const unique = new Set(playlistSet);
    unique.forEach((key) => {
      if (key !== 'error') {
        addPlaylist(key);  
      }
    });
  }, [playlistSet, addPlaylist]);

  const handleClickPlaylist = async (playlistName: string) => {
    try {
      const res = await fetch('/api/addPlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 1, index, fieldName: playlistName })
      });
      const data = await res.json();
      // Close the context menu after adding to playlist
      onClose?.();
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  }

  const handleEnter = async () => {
    if (!fieldName.trim()) return;
    
    try {
      const res = await fetch('/api/addPlaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 1, index, fieldName })
      });
      const data = await res.json();
      setFieldName('');
      // Refresh playlists after creating a new one
      refreshPlaylists();
      // Close the context menu after creating playlist
      onClose?.();
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addPlaylist(fieldName);
      handleEnter();
    }
  }

  if (!show) return null;

  return (
    <div className="rounded-xl w-80 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-100">Add to Playlist</h3>
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <input
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none"
          type="text"
          value={fieldName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search playlists..."
          autoFocus
        />
      </div>

      {/* Playlist List */}
      <div className="max-h-72 overflow-y-auto pr-1">
        {allPlaylist.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-400 text-sm">No playlists found</div>
            <div className="text-gray-500 text-xs mt-1">Create a new playlist to get started</div>
          </div>
        ) : (
          <ul className="space-y-1">
            {allPlaylist.map((playlist, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => handleClickPlaylist(playlist)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="truncate">{playlist}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create New Playlist */}
      {fieldName.trim() && !allPlaylist.includes(fieldName) && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={handleEnter}
            className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create "{fieldName}"
          </button>
        </div>
      )}
    </div>
  );
};

export default NewPlaylist;

import React from "react"
import { useEffect, useState } from "react"
import { usePlaylist } from "@/context/playlistContext";

type NewPlaylistProps = {
  show: boolean
  songFileName: string // Changed from index to actual filename
  onClose?: () => void
  position?: { x: number; y: number }
  anchor?: 'top' | 'bottom'
}

const NewPlaylist = ({ show, songFileName, onClose, position, anchor = 'top' }: NewPlaylistProps) => {
  const [playlistName, setPlaylistName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPlaylist, setAllPlaylist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { refreshPlaylists } = usePlaylist();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`/api/fetchPlaylists?userId=${1}`);
        const data = await res.json();
        setAllPlaylist(data.playlists || []);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  // Filter playlists based on search query
  const filteredPlaylists = allPlaylist.filter(playlist =>
    playlist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClickPlaylist = async (playlistName: string) => {
    try {
      setIsLoading(true);
      setMessage("");
      
      const res = await fetch("/api/addPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          playlistName,
          fileName: songFileName,
        }),
      });

      const data = await res.json();
      console.log("Add to playlist response:", data);
      
      if (data.success) {
        setMessage(`Added to ${playlistName}!`);
        refreshPlaylists();
        setTimeout(() => {
          onClose?.();
        }, 1000);
      } else {
        setMessage(data.error || "Failed to add to playlist");
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      setMessage("Error adding to playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = async () => {
    if (playlistName.trim() === "") return;

    try {
      setIsLoading(true);
      setMessage("");
      
      const res = await fetch("/api/addPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          playlistName: playlistName.trim(),
          fileName: songFileName,
        }),
      });

      const data = await res.json();
      console.log("Create playlist response:", data);
      
      if (data.success) {
        setMessage(`Created ${playlistName.trim()} and added song!`);
        setPlaylistName("");
        refreshPlaylists();
        // Auto-close after success
        setTimeout(() => {
          onClose?.();
        }, 1000);
      } else {
        setMessage(data.error || "Failed to create playlist");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      setMessage("Error creating playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  };

  if (!show) return null;

  return (
    <div className="bg-[#181818] border border-[#333333] rounded-lg shadow-xl p-3 w-64">
      <div className="space-y-3">
        {/* Simple Header */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-white">Add to Playlist</h3>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`text-xs text-center p-2 rounded ${
            message.includes("Added") || message.includes("Created") 
              ? "bg-[#1db954]/20 text-[#1db954]" 
              : "bg-[#ef4444]/20 text-[#ef4444]"
          }`}>
            {message}
          </div>
        )}

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 bg-[#282828] border border-[#333333] rounded text-white placeholder-[#727272] focus:border-[#1db954] text-xs"
        />

        {/* Playlist List */}
        <div className="max-h-24 overflow-y-auto space-y-1">
          {filteredPlaylists.length === 0 ? (
            <div className="text-center py-2 text-[#727272]">
              <p className="text-xs">
                {searchQuery ? `No playlists matching "${searchQuery}"` : "No playlists"}
              </p>
            </div>
          ) : (
            filteredPlaylists.map((playlist) => (
              <button
                key={playlist}
                onClick={() => handleClickPlaylist(playlist)}
                disabled={isLoading}
                className="w-full flex items-center gap-2 p-1.5 text-left bg-[#282828] hover:bg-[#383838] rounded text-xs text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50"
              >
                <div className="w-3 h-3 bg-[#1db954]/20 rounded flex items-center justify-center">
                  <svg className="w-2 h-2 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </div>
                <span className="truncate flex-1">{playlist}</span>
                {isLoading && (
                  <div className="w-2.5 h-2.5 border border-[#1db954] border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Quick Create */}
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="New playlist..."
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-2 py-1.5 bg-[#282828] border border-[#333333] rounded text-white placeholder-[#727272] focus:border-[#1db954] text-xs"
          />
          <button
            onClick={handleEnter}
            disabled={playlistName.trim() === "" || isLoading}
            className="px-2 py-1.5 bg-[#1db954] hover:bg-[#1ed760] text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "+"
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-1.5 px-2 bg-[#282828] hover:bg-[#383838] text-[#b3b3b3] hover:text-white rounded text-xs border border-[#333333] hover:border-[#4d4d4d]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NewPlaylist;

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type PlaylistContextType = {
  allPlaylist: string[];
  addPlaylist: (name: string) => void;
  refreshPlaylists: () => void;
  isLoading: boolean;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const [allPlaylist, setAllPlaylist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylists = async () => {
    try {
      const userId = 1;
      const response = await fetch(`/api/fetchPlaylists?userId=${userId}`);
      const data = await response.json();
      setAllPlaylist(data.playlists || []);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addPlaylist = (name: string) => {
    setAllPlaylist((prev) =>
       prev.includes(name) ? prev : [...prev, name]
    );
  };

  const refreshPlaylists = () => {
    fetchPlaylists();
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider value={{ allPlaylist, addPlaylist, refreshPlaylists, isLoading }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return context;
};


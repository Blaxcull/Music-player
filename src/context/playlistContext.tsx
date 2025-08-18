"use client";
import React, { createContext, useContext, useState} from "react";
type PlaylistContextType = {
  allPlaylist: string[];
  addPlaylist: (name: string) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const [allPlaylist, setAllPlaylist] = useState<string[]>([]);

  const addPlaylist = (name: string) => {
    setAllPlaylist((prev) =>
       prev.includes(name) ? prev : [...prev, name]
  )
  };

  return (
    <PlaylistContext.Provider value={{ allPlaylist, addPlaylist }}>
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


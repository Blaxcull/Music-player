'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

type PlayerContextType = {
  allPlaylist: string[];
  addPlaylist: (name: string) => void;



  files: string[];
  setFiles: (files: string[], source: string) => void;

  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playingIndex: number | null;
  isPlaying: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  handlePlay: (index: number, file: string) => void;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  volume: number;
  handleVolumeChange: (val: number) => void;
  handleTimeChange: (val: number) => void;
  isSongPlaying: (index: number, getCurrPath : string) => boolean;
  loop: number;
  handleLoop: () => void;
  shuffle: boolean;
  handleShuffle: () => void;
  shuffleOrder: number[];
  songName : string[];
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loop, setLoop] = useState(0);
  const loopRef = useRef(loop);


  const [songName,setSongName] = useState<string[]>([])

  // Tracks the current page (`/` or `/liked`)
  const [playlistSource, setPlaylistSource] = useState<string>('/');

  // Wrapper for setFiles with source tracking
  const setFilesWithSource = (files: string[], source: string) => {
    setFiles(files);
    setPlaylistSource(source);
  };

  useEffect(()=>{


      setSongName(files[currentIndex])
  })
  // Keep loopRef in sync
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };


const handlePlay = (index: number, file: string) => {
  // Toggle only if same index AND same file
if (
  playingIndex === index &&
  currentFile === file
) {
  if (audioRef.current?.paused) {
    audioRef.current.play();
  } else {
    audioRef.current?.pause();
  }
  return;
}

  // Stop current audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.onended = null;
  }

  // Create and play new audio
  const newAudio = new Audio(`/music/${file}`);
  newAudio.volume = volume;

  newAudio.onplay = () => {
    setIsAudioPlaying(true);
    setIsPlaying(true);
  };
  newAudio.onpause = () => {
    setIsAudioPlaying(false);
    setIsPlaying(false);
  };

  newAudio.onended = () => {
    const currentLoop = loopRef.current;
    const position = shuffleOrder.indexOf(index);
    const nextPosition = position + 1;

    if (currentLoop === 2) {
      handlePlay(index, file);
    } else if (currentLoop === 1 && nextPosition >= shuffleOrder.length) {
      handlePlay(shuffleOrder[0], files[shuffleOrder[0]]);
    } else if (nextPosition < shuffleOrder.length) {
      handlePlay(shuffleOrder[nextPosition], files[shuffleOrder[nextPosition]]);
    }
  };

  audioRef.current = newAudio;
  setPlayingIndex(index);
  setCurrentIndex(index);
  setCurrentFile(file);
  newAudio.play();
};


  const handleNext = () => {
    if (files.length === 0) return;

    if (loopRef.current === 2) {
      setLoop(1);
      loopRef.current = 1;
    }

    const position = shuffleOrder.indexOf(currentIndex);
    const nextPosition = position + 1;

    if (nextPosition < shuffleOrder.length) {
      const nextIndex = shuffleOrder[nextPosition];
      handlePlay(nextIndex, files[nextIndex]);
    } else if (loop === 1) {
      const firstIndex = shuffleOrder[0];
      handlePlay(firstIndex, files[firstIndex]);
    }
  };

  const handlePrev = () => {
    if (loopRef.current === 2) {
      setLoop(1);
      loopRef.current = 1;
    }

    if (files.length === 0) return;
    const position = shuffleOrder.indexOf(currentIndex);
    const prevPosition = position - 1;

    if (prevPosition >= 0) {
      const prevIndex = shuffleOrder[prevPosition];
      handlePlay(prevIndex, files[prevIndex]);
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const handleTimeChange = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };


  const isSongPlaying = (index: number, getCurrPath: string):boolean=> {
      
      console.log(getCurrPath)
      console.log(playlistSource)

    return (

        
    playlistSource === getCurrPath&&
      playingIndex === index &&
     !! audioRef?.current &&
      !audioRef?.current?.paused &&
      isAudioPlaying
    );
  };

  const handleLoop = () => {
    setLoop((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
  };

  const getShuffledIndices = (length: number): number[] => {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  };

  useEffect(() => {
    if (shuffle && files.length > 0) {
      const order = getShuffledIndices(files.length);
      const currentPos = order.indexOf(currentIndex);
      if (currentPos !== -1) {
        const removed = order.splice(currentPos, 1)[0];
        order.unshift(removed);
      }
      setShuffleOrder(order);
    } else {
      setShuffleOrder(Array.from({ length: files.length }, (_, i) => i));
    }
  }, [shuffle, files]);




   const [allPlaylist, setAllPlaylist] = useState<string[]>([]);

  const addPlaylist = (name: string) => {
    setAllPlaylist((prev) => [...prev, name]);
  };


  return (
    <PlayerContext.Provider
      value={{
        files,
        setFiles: setFilesWithSource,
        currentIndex,
        setCurrentIndex,
        playingIndex,
        isPlaying,
        audioRef,
        handlePlay,
        togglePlay,
        handleNext,
        handlePrev,
        volume,
        handleVolumeChange,
        handleTimeChange,
        isSongPlaying,
        loop,
        handleLoop,
        shuffle,
        handleShuffle,
        shuffleOrder,
        songName,


        allPlaylist,
        addPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};


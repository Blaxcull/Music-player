'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

type PlayerContextType = {
  files: string[];
  setFiles: (files: string[]) => void;
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
  isSongPlaying: (index: number) => boolean;
  loop: number;
  handleLoop: () => void;
  shuffle: boolean;
  handleShuffle: () => void;
  shuffleOrder: number[];
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loop, setLoop] = useState(0);
const loopRef = useRef(loop);
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
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.onended = null;
    audioRef.current.src = '';
    audioRef.current = null;
  }

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

  // ✅ Predict the next index and pass it directly

newAudio.onended = () => {
  const currentLoop = loopRef.current;
  const position = shuffleOrder.indexOf(index);
  const nextPosition = position + 1;

  console.log('Song ended, loop:', currentLoop, 'pos:', position, 'next:', nextPosition);

  if (currentLoop === 2) {
    // 🔁 Repeat current song
    handlePlay(index, file);
  } else if (currentLoop === 1 && nextPosition >= shuffleOrder.length) {
    // 🔁 Loop back to first
    const firstIndex = shuffleOrder[0];
    handlePlay(firstIndex, files[firstIndex]);
  } else if (nextPosition < shuffleOrder.length) {
    // ⏭ Go to next song
    const nextIndex = shuffleOrder[nextPosition];
    handlePlay(nextIndex, files[nextIndex]);
  } else {
    console.log("End of playlist reached and no loop active.");
  }
};


  newAudio.play();
  audioRef.current = newAudio;

  setCurrentIndex(index);
  setPlayingIndex(index);
};

  const handleNext = () => {
    if (files.length === 0) return;
     if (loopRef.current === 2) {
    setLoop(1);         // downgrade loop mode
    loopRef.current = 1; // keep ref in sync immediately
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
    setLoop(1);         // downgrade loop mode
    loopRef.current = 1; // keep ref in sync immediately
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

const isSongPlaying = (index: number): boolean => {
  return (
    playingIndex === index &&
    !!audioRef.current &&
    !audioRef.current.paused &&
    isAudioPlaying
  );
};

  const handleLoop = () => {
    setLoop(prev => (prev < 2 ? prev + 1 : 0));
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

  return (
    <PlayerContext.Provider
      value={{
        files,
        setFiles,
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


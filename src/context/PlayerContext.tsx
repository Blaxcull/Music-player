'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

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
  isSongPlaying: (index: number, getCurrPath: string) => boolean;
  loop: number;
  handleLoop: () => void;
  shuffle: boolean;
  handleShuffle: () => void;
  shuffleOrder: number[];
  songName: string;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const shuffleOrderRef = useRef<number[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loop, setLoop] = useState(0);
  const loopRef = useRef(loop);

  const [songName, setSongName] = useState<string>('');
  const [playlistSource, setPlaylistSource] = useState<string>('/');




  // For playlists
  const [allPlaylist, setAllPlaylist] = useState<string[]>([]);
  const addPlaylist = (name: string) => {
    setAllPlaylist((prev) => [...prev, name]);
  };

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // Shuffle order calculation
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
      // Place currentIndex at the front of the order to prevent restart
      const currentPos = order.indexOf(currentIndex);
      if (currentPos !== -1) {
        const removed = order.splice(currentPos, 1)[0];
        order.unshift(removed);
      }
      setShuffleOrder(order);
    } else {
      const order = Array.from({ length: files.length }, (_, i) => i);
      // Place currentIndex at the front when switching off shuffle too
      const currentPos = order.indexOf(currentIndex);
      if (currentPos !== -1) {
        const removed = order.splice(currentPos, 1)[0];
        order.unshift(removed);
      }
      setShuffleOrder(order);
    }
  }, [shuffle, files]);

  useEffect(() => {
    shuffleOrderRef.current = shuffleOrder;
  }, [shuffleOrder]);





useEffect(() => {
  if (!files.length || currentIndex < 0 || currentIndex >= files.length) return;

  let audio = audioRef.current;
  if (!audio) {
    audio = new Audio();
    audioRef.current = audio;
  }

  const file = files[currentIndex];
  audio.src = file;
  audio.volume = volume;
  setCurrentFile(file);

// fetch the file name by the file url

  setSongName(file);



  setPlayingIndex(currentIndex); 
  setIsPlaying(true);
  setIsAudioPlaying(true);

const playAudio = async () => {
  try {
    await audio.play();
    setIsPlaying(true);
    setIsAudioPlaying(true);
  } catch (err: any) {
    if (err.name === "AbortError") {
      // benign, ignore
      return;
    }
    console.error("Unexpected playback error:", err);
  }
};

  playAudio();
  // clear old handlers
  audio.onended = null;

  audio.onplay = () => {
    setIsPlaying(true);
    setIsAudioPlaying(true);
  };
  audio.onpause = () => {
    setIsPlaying(false);
    setIsAudioPlaying(false);
  };

  audio.onended = () => {
    const currentLoop = loopRef.current;
    const currentShuffleOrder = (shuffleOrderRef.current && shuffleOrderRef.current.length > 0)
      ? shuffleOrderRef.current
      : Array.from({ length: files.length }, (_, i) => i);
    const position = currentShuffleOrder.indexOf(currentIndex);
    const nextPosition = position + 1;

    if (currentLoop === 2) {
      // Loop current song
      audio.currentTime = 0; 
      audio.play();
    } else if (currentLoop === 1 && nextPosition >= currentShuffleOrder.length) {
      // Loop playlist - go to first song
      setCurrentIndex(currentShuffleOrder[0]);
    } else if (nextPosition < currentShuffleOrder.length) {
      // Play next song
      setCurrentIndex(currentShuffleOrder[nextPosition]);
    }
  };
}, [currentIndex, files]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  // Handle play on click
  const handlePlay = (index: number, file: string) => {
    if (playingIndex === index && currentFile === file) {
      togglePlay();
      return;
    }
    setPlayingIndex(index);
    setCurrentIndex(index); // effect handles actual play
  };

  const handleNext = () => {
    if (files.length === 0) return;

    if (loopRef.current === 2) {
      setLoop(1);
      loopRef.current = 1;
    }

    const currentShuffleOrder = (shuffleOrderRef.current && shuffleOrderRef.current.length > 0)
      ? shuffleOrderRef.current
      : Array.from({ length: files.length }, (_, i) => i);
    const position = currentShuffleOrder.indexOf(currentIndex);
    const nextPosition = position + 1;

    if (nextPosition < currentShuffleOrder.length) {
      setCurrentIndex(currentShuffleOrder[nextPosition]);
    } else if (loop === 1) {
      setCurrentIndex(currentShuffleOrder[0]);
    }
  };

  const handlePrev = () => {
    if (files.length === 0) return;

    if (loopRef.current === 2) {
      setLoop(1);
      loopRef.current = 1;
    }

    const currentShuffleOrder = (shuffleOrderRef.current && shuffleOrderRef.current.length > 0)
      ? shuffleOrderRef.current
      : Array.from({ length: files.length }, (_, i) => i);
    const position = currentShuffleOrder.indexOf(currentIndex);
    const prevPosition = position - 1;

    if (prevPosition >= 0) {
      setCurrentIndex(currentShuffleOrder[prevPosition]);
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

  const isSongPlaying = (index: number, getCurrPath: string): boolean => {
    return (
      playlistSource === getCurrPath &&
      playingIndex === index &&
      !!audioRef.current &&
      !audioRef.current.paused &&
      isAudioPlaying
    );
  };

  const handleLoop = () => {
    setLoop((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const setFilesWithSource = (files: string[], source: string) => {
    setFiles(files);
    setPlaylistSource(source);
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
        handleShuffle: () => setShuffle(!shuffle),
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


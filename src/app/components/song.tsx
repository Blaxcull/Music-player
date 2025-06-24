'use client';

import { useRef, useState, useEffect } from 'react';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import PrevButton from './prevButton';
import Volume from './volume';

const Song = () => {
  // Track play/pause state of the PausePlayButton
  const [isPlaying, setIsPlaying] = useState(false);

  // Current index of the song selected (can be null if none)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Index of the song currently playing
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // List of available songs fetched from backend
  const [files, setFiles] = useState<string[]>([]);

  // Track whether audio is currently playing (used for button state)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Ref to the current audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);



//next song
const handleNext = () => {
  if (currentIndex === null || files.length === 0) return;

  const nextIndex = currentIndex + 1;

  // If there’s a next song
  if (nextIndex < files.length) {
    handlePlay(volume, nextIndex, files[nextIndex]);
  } else {
    console.log("Reached end of playlist");
    // Optionally loop: handlePlay(0, files[0]);
  }
};




//previous song
const handlePrev = () => {
  if (currentIndex === null || files.length === 0) return;

  const prevIndex = currentIndex -1;

  // If there’s a next song
  if (prevIndex < files.length) {
    handlePlay(volume, prevIndex, files[prevIndex]);
  } else {
    console.log("Reached end of playlist");
    // Optionally loop: handlePlay(0, files[0]);
  }
};




// Toggle play/pause using PausePlayButton


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

  // Helper function to check if a song at index is currently playing
  const isSongPlaying = (index: number) => {
    return (
      playingIndex === index &&
      audioRef.current &&
      !audioRef.current.paused &&
      isAudioPlaying
    );
  };

  // Main function to play a song
  const handlePlay = ( volume: number, index: number, file: string) => {


    // Use the larger of newIndex() or clicked index
      
      
    setCurrentIndex(index);

    // If clicking the song already playing → toggle pause/play
    if (playingIndex === index) {
      if (!audioRef.current?.paused) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    } else {
      // Stop any previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create and play a new audio instance
      const newAudio = new Audio(`/music/${file}`);
      newAudio.volume = 0.3;

      // Set play/pause handlers for UI updates
      newAudio.onplay = () => {
        setIsAudioPlaying(true);
        setIsPlaying(true);
      };
      newAudio.onpause = () => {
        setIsAudioPlaying(false);
        setIsPlaying(false);
      };

      // Cleanup when song ends
      newAudio.onended = () => {
        setPlayingIndex(null);
        audioRef.current = null;
      };

      newAudio.play();
      audioRef.current = newAudio;

      // Update which index is currently playing
      setPlayingIndex(index);
    }
  };

  // Fetch the list of available music files from API
  useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch(err => console.error('Failed to fetch music files:', err));
  }, []);

  // Render song list, control buttons
  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Available Songs</h2>
        <ul className="list-disc pl-5">
          {files.map((file, index) => (
            <li key={index} className="flex items-center gap-4">
              <button
                onClick={() =>

                  handlePlay(volume, index,  file)
                  
                }
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isSongPlaying(index) ? 'stop' : 'play'}
              </button>
              {file}
            </li>
          ))}
        </ul>
      </div>

      {/* Global Pause/Play Button */}
      <PausePlayButton onClick={togglePlay} isPlaying={isPlaying} />

      {/* Next Button component, receives current index and audio */}
<NextButton
  onClick={handleNext}
/>

<PrevButton
  onClick={handlePrev}
/>

<Volume/>

    </>
  );
};

export default Song;


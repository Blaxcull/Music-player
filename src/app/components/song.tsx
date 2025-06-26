'use client';

import { useRef, useState, useEffect } from 'react';
import PausePlayButton from './pausePlay';
import NextButton from './nextButton';
import PrevButton from './prevButton';
import Volume from './volume';
import SongProgressBar from './songProgressBar';

const Song = () => {

const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);


const [shuffle,setShuffle] = useState(false)
  const [volume, setVolume] = useState(1); // Volume state is here
  const [songCurrentTime, setSongCurrentTime] = useState(0); // Volume state is here

  const [loop, setLoop] = useState(0);
  
  // Track play/pause state of the PausePlayButton
  const [isPlaying, setIsPlaying] = useState(false);

  // Current index of the song selected (can be null if none)
  const [currentIndex, setCurrentIndex] = useState<number | 0>(0);

  // Index of the song currently playing
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // List of available songs fetched from backend
  const [files, setFiles] = useState<string[]>([]);

  // Track whether audio is currently playing (used for button state)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Ref to the current audio element

  const audioRef = useRef<HTMLAudioElement | null>(null);

//song progress


//next song
const handleNext = () => {
  if (currentIndex === null || files.length === 0) return;

  // Find the position of the current index in the shuffleOrder
  const positionInOrder = shuffleOrder.indexOf(currentIndex);
  const nextPosition = positionInOrder + 1;

  console.log("hello");

  if (loop === 2) {
    console.log("Loop was 2");
    setLoop(1); // this is async, so `console.log(loop)` will still show 2
    console.log("Setting loop to 1");
  }

  // If there's a next item in shuffleOrder
  if (nextPosition < shuffleOrder.length) {
    const nextIndex = shuffleOrder[nextPosition];
    handlePlay(nextIndex, files[nextIndex]);
  } else {
    console.log("Reached end of playlist");

    if (loop === 1) {
      const firstIndex = shuffleOrder[0];
      handlePlay(firstIndex, files[firstIndex]);
    }
  }
};



//previous song
const handlePrev = () => {
  if (currentIndex === null || files.length === 0) return;

  const positionInOrder = shuffleOrder.indexOf(currentIndex);
  const prevPosition= positionInOrder-1;

  // If there’s a next song
  if (prevPosition< shuffleOrder.length) {
    const prevIndex = shuffleOrder[prevPosition];
    handlePlay(prevIndex, files[prevIndex]);
  } else {
    console.log("Reached end of playlist");

    console.log("no index found");
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
  const handlePlay = ( index: number, file: string) => {


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
      newAudio.volume = volume;

      
      // Set play/pause handlers for UI updates
      newAudio.onplay = () => {
        setIsAudioPlaying(true);
        setIsPlaying(true);
      };
      newAudio.onpause = () => {
        setIsAudioPlaying(false);
        setIsPlaying(false);
      };

      newAudio.play();
      audioRef.current = newAudio;


      // Update which index is currently playing
      setPlayingIndex(index);




      // Cleanup when song ends




      };


  };

  // Fetch the list of available music files from API
  useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch(err => console.error('Failed to fetch music files:', err));
  }, []);






// volume change
  const handleVolumeChange = (value: number) => {
  setVolume(value);
  if (audioRef.current) {
    audioRef.current.volume = value;
  }
};

// songTimechange
  const handleTimeChange = (value: number) => {
  setSongCurrentTime(value);
  if (audioRef.current) {
    audioRef.current.currentTime= value;
  }
};


  const handleLoop= () => {
    console.log("Button was clicked!");
    if(loop<2){

    setLoop(loop+1);
    console.log(loop)
    }
    else{
        setLoop(0)

    console.log(loop)
    }


  };


if(audioRef.current?.ended){

    if(loop ==2){

        handlePlay(currentIndex,files[currentIndex])

    }
    else{

        handleNext()
    }

}

const handleShuffle =()=>{
    setShuffle(!shuffle)
}


function getShuffledIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i); // [0, 1, 2, ..., length-1]

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]; // Fisher–Yates shuffle
  }

  return indices;
}

useEffect(() => {
  if (shuffle && files.length > 0) {
    const order = getShuffledIndices(files.length);

    const index = order.indexOf(currentIndex); // use 'order' instead of 'shuffleOrder'
    if (index !== -1) {
      const removed = order.splice(index, 1)[0];
      order.unshift(removed); // move currentIndex to the end
    }

    setShuffleOrder(order); // now set the modified order
    console.log(currentIndex);




  }
  else{

    const order= Array.from({ length: files.length }, (_, i) => i);

    setShuffleOrder(order); // now set the modified order
    console.log(currentIndex);

  }
}, [shuffle, files]);




console.log(currentIndex)
console.log(shuffleOrder)

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

                  handlePlay( index,  file)
                  
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

      <Volume volume={volume} setVolume={handleVolumeChange} />
    
      <SongProgressBar audioRef = {audioRef} songCurrentTime={handleTimeChange} />
<div className="fixed bottom-4 right-[70%] -translate-x-[70%]">
<button
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleLoop}
      >
      {loop}
      loop
      </button>
    </div>
<div className="fixed bottom-4 left-[70%] translate-x-[70%]">
<button
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleShuffle}
         disabled={!audioRef.current}
      >
      shuffle
      </button>
    </div>
    </>
  );
};

export default Song;


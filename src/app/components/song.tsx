'use client';

import { useRef,useState, useEffect} from 'react';



const Song = () => {

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
const [files, setFiles] = useState<string[]>([]);
const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);


//fetching song names

 useEffect(() => {
    fetch('/api/getMusic')
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch(err => console.error('Failed to fetch music files:', err))
  }, []);



//play pause volume of music
  const handlePlay = ( index: number, file: string,) => {



//pausing and playing same song

if (playingIndex === index) {

    if(!audioRef.current?.paused){
        audioRef.current?.pause()


    }
    else{

        audioRef.current?.play()

    }
    }



     else{


//pause the previous song that is playing

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      
    }



//getting new song

const newAudio = new Audio(`/music/${file}`);
    newAudio.volume = 0.3;


//set the condition for play and pause text on button
    newAudio.onplay = () => setIsAudioPlaying(true);
    newAudio.onpause = () => setIsAudioPlaying(false);



//if song end this happen
    newAudio.onended = () => {
      setPlayingIndex(null);
      audioRef.current = null;
    };
    
    newAudio.play();

    audioRef.current = newAudio;

//setting the current index as the new index for  which song to play
    setPlayingIndex(index);


}

      }





//set the condition for play and pause text on button
  const isSongPlaying = (index: number) => {
    return (
      playingIndex === index &&
      audioRef.current &&
      !audioRef.current.paused &&
      isAudioPlaying
    );
  };


  return (


    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Available Songs</h2>
      <ul className="list-disc pl-5">



        {files.map((file, index) => (
          <li key={index} className="flex items-center gap-4">
            <button
              onClick={() => handlePlay(index, file)}
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
            {isSongPlaying(index)?  'stop':'play'}
            </button>
            {file}
          </li>
        ))}



      </ul>
    </div>



  );

};



export default Song;

import { useEffect ,useState, RefObject} from "react";
type SongProgressBarProps ={
  audioRef: RefObject<HTMLAudioElement|null>;

songCurrentTime: (s: number) => void;
} 




const SongProgressBar = ({audioRef,songCurrentTime}:SongProgressBarProps) => {

const [songTime, setSongTime] = useState<number>(0);

const duration = audioRef.current?audioRef.current?.duration:0




useEffect(() => {
    const audio = audioRef?.current;
     
    if (!audio) return;

    const handleTimeUpdate = () => {
      setSongTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef.current]);


function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


  return (
      <>
    <div>{formatTime(songTime)}</div>


      <input
      type="range"
      min="0"
      max={isNaN(duration) ? 100 : duration}
      step="1"
        value={songTime}
        onChange={(e) => songCurrentTime(parseFloat(e.target.value))}
      />
    <div>{formatTime(duration?duration:0)}</div>
    </>
  )
}

export default SongProgressBar

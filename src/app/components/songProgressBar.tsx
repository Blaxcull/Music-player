import { useEffect ,useState, RefObject} from "react";
type SongProgressBarProps ={
  audioRef: RefObject<HTMLAudioElement|null>;

songCurrentTime: (s: number) => void;
} 



const SongProgressBar = ({audioRef,songCurrentTime}:SongProgressBarProps) => {
    const [songTime, setSongTime] = useState<number>(0);


const [isDragging, setIsDragging] = useState(false);
const [dragTime, setDragTime] = useState<number>(0);

const duration = audioRef.current?audioRef.current?.duration:0



useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const onTime = () => {
    if (!isDragging) setSongTime(audio.currentTime);
  };

  audio.addEventListener("timeupdate", onTime);
  return () => audio.removeEventListener("timeupdate", onTime);
}, [audioRef.current, isDragging]);

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
  value={isDragging ? dragTime : songTime}
  onMouseDown={() => {
    setIsDragging(true);
    setDragTime(songTime);         
  }}
  onTouchStart={() => {
    setIsDragging(true);
    setDragTime(songTime);
  }}
  onChange={e => {
    const v = parseFloat(e.target.value);
    setDragTime(v);            
    setSongTime(v);                
  }}
  onMouseUp={e => {
    const v = parseFloat((e.target as HTMLInputElement).value);
    setIsDragging(false);
    songCurrentTime(v);             
  }}
  onTouchEnd={e => {
    const v = parseFloat((e.target as HTMLInputElement).value);
    setIsDragging(false);
    songCurrentTime(v);
  }}
/>
<div>{formatTime(duration?duration:0)}</div>
    </>
  )
}

export default SongProgressBar

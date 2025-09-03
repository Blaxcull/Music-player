'use Client'
import { useEffect,useState } from "react";

const SongTitle = ({ file }: { file: string }) => {
  const [title, setTitle] = useState<string | null>(null);
  const userId = 1

  useEffect(() => {
    const fetchSongTitle = async () => {
      const res = await fetch(`/api/getSongName?userID=${userId}&file=${encodeURIComponent(file)}`);
      const data = await res.json();
      setTitle(data.title);
    };
    fetchSongTitle();
  }, [file]);
 return <div>{title ?? "Loading..."}</div>
}

export default SongTitle

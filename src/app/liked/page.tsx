'use client';
import { usePlayer } from '@/context/PlayerContext';
import AddToLiked from '@/app/components/addToLiked';
import { useEffect, useState, useRef } from 'react';
import NewPlaylist from '@/app/components/newPlaylist';
import { usePathname } from 'next/navigation';


const Liked = () => {
  const { setFiles, isSongPlaying, handlePlay } = usePlayer();


const contextRef = useRef<HTMLDivElement | null>(null);

  const [likedIndices, setLikedIndices] = useState<number[]>([]);

  const [likedSongs,setLikedSongs] = useState<string[]>([])

  const [show,setShow] = useState(false)


  // Fetch liked indices
  useEffect(() => {
    const userId = 1;
    fetch(`/api/liked?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.likedSongIds) setLikedIndices(data.likedSongIds);
      })
      .catch((err) => console.error('Failed to fetch liked songs:', err));
  }, []);


const [contextIndex,setContextIndex] = useState(0)

const handleRightClick= (e:React.MouseEvent, index: number) => {
    e.preventDefault()
    setShow(true)

setContextIndex(index)





console.log('right')


};

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
      setShow(false); // hide context menu
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



useEffect(() => {
  fetch('/api/getMusic')
    .then((res) => res.json())
    .then((data) => {
    setLikedSongs(likedIndices.map(i => data.files[i]).reverse());
    })
    .catch((err) => console.error('Failed to fetch songs:', err));
}, [likedIndices]);


console.log(likedIndices)
const handleClick = (index: number) => {
  setFiles(likedSongs, '/liked'); // tell context these are from liked
  handlePlay(index, likedSongs[index]);
};
console.log(likedSongs)


const pathname = usePathname();


const removeLiked = (index:number)=>{

    console.log(likedIndices)
const newLiked = likedIndices.filter(i => i !== index);
    setLikedIndices(newLiked)
    console.log(likedIndices)

}

  return (
    <div className="space-y-6">
      {/* Context Menu */}
      {show && (
        <div
          ref={contextRef}
          className="absolute top-40 left-40 z-50 bg-gray-800 shadow-xl rounded-xl p-4 border border-gray-700"
        >
          <NewPlaylist show={show} index={contextIndex} onClose={() => setShow(false)} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-100">Liked Songs</h2>
          <p className="text-gray-400 mt-1">Your favorites collection</p>
        </div>
        <div className="text-sm text-gray-500">{likedSongs.length} tracks</div>
      </div>

      {/* List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {likedSongs.map((file, index) => (
            <div key={likedIndices[index]} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => handleClick(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    isSongPlaying(index, pathname)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {isSongPlaying(index, pathname) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <div
                  onDoubleClick={() => handleClick(index)}
                  onContextMenu={(e)=>{handleRightClick(e,likedIndices[index])}}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="text-sm font-medium text-gray-100 truncate">{file.replace('.mp3','')}</div>
                  <div className="text-xs text-gray-400">Track</div>
                </div>
              </div>
              <AddToLiked index={likedIndices[likedIndices.length-1 -index]} removeLiked={removeLiked} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Liked;


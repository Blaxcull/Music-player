import React from "react"
import {  useEffect,useState} from "react"
import { usePlaylist } from "@/context/playlistContext";

type newPlaylistProps={
     show: boolean
     index: number

}


const NewPlaylist = ({show,index}:newPlaylistProps) => {


  const { allPlaylist, addPlaylist } = usePlaylist();
  const [fieldName,setFieldName] = useState('')

  const [playlistSet,setPlaylistSet] = useState([])



 const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    
    setFieldName(event.target?.value);

  };
  
  useEffect(() => {
    const userId = 1;

    fetch(`/api/addPlaylist?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const keys = Object.keys(data).filter((key) => key !== "_id");

            setPlaylistSet(keys);
      })
      .catch((err) => console.error("Failed to fetch playlists:", err));
  }, []);

  // when x changes, call addPlaylist
  useEffect(() => {
    const unique = new Set(playlistSet);
    unique.forEach((key) => {
        if (key !='error'){

            addPlaylist(key);  
        }
    });
  }, [playlistSet, addPlaylist]);

      const handleClickPlaylist= async(fieldName)=>{
      
      try{
          const res = await fetch('/api/addPlaylist',{
          
          method: 'POST',

          headers:{
              'Content-Type':'application/json'

          },

          body: JSON.stringify({userId:1,index,fieldName})


          })
          const data = await res.json();


    } catch (error) {

      console.error("Error toggling liked state:", error);
    }
      }


      const handleEnter = async()=>{
      
      try{
          const res = await fetch('/api/addPlaylist',{
          
          method: 'POST',

          headers:{
              'Content-Type':'application/json'

          },

          body: JSON.stringify({userId:1,index,fieldName})


          })
          const data = await res.json();

    } catch (error) {

      console.error("Error toggling liked state:", error);
    }
      }







  const handleKeyDown =(e:React.KeyboardEvent<HTMLInputElement>)=>{

      
    if(e.key ==="Enter"){
        console.log('enter pressed')


      addPlaylist(fieldName)

      handleEnter()
    
        setFieldName('')
    }

  }

if (!show) return null;

  return (
    <div
      className="bg-sky-300 w-40 h-32 overflow-hidden rounded p-2"
    >
      <input
        className="w-full p-1 border rounded mb-2 scrollbar-hide"
        type="text"
        value={fieldName}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Find a playlist"
      />

      <ul className="overflow-y-auto max-h-20 scrollbar-hide">
        {allPlaylist.map((playlist, index) => (
          <li 
          key={index}>
          <button className='bg-gray-500' onClick={(e)=>{handleClickPlaylist(e.target.innerText)

            

          }}>

          {playlist}
          </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewPlaylist;

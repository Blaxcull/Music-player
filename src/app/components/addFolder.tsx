"use client"

import { useState, useCallback } from "react";
import * as mm from "music-metadata-browser";
import { getSignedURL } from "./actions";

const AddFolder = () => {
  const [files, setFiles] = useState<File[]>([]);

  async function extractCoverArt(file: File) {
    const metadata = await mm.parseBlob(file);

    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0]; 
      
      const blob = new Blob([picture.data], { type: picture.format });
      const coverUrl = URL.createObjectURL(blob);

      console.log("Cover art URL:", coverUrl);
      return blob;
    } else {
      console.log("No embedded cover art found");
      return null;
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(files);

    await Promise.all(
      Array.from(files).map(async (file) => {
        if(file){
          const signedURLResult = await getSignedURL(file.name);

          const songURL= signedURLResult.success.song;
          const coverURL= signedURLResult.success.cover;
          console.log("Signed URL:", songURL);
          console.log("Signed URL:",coverURL);
          
          const metadata = await mm.parseBlob(file);
          const title = metadata.common.title || file.name;
          const artist = metadata.common.artist || "Unknown Artist";
          const duration = metadata.format.duration
          const coverArt = await extractCoverArt(file)
          console.log(coverArt)

          await fetch(songURL, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          await fetch(coverURL, {
            method: "PUT",
            body: coverArt,
            headers: {
              "Content-Type": coverArt?.type,
            },
          });

          try {
            const res = await fetch("/api/storeMusicKey", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: 1, songURL: songURL, Title:title, Artist:artist, Duration:duration,coverArt:coverURL}),
            });
            const data = await res.json();
            console.log(data)
          } catch (error) {
            console.error("Error fetching playlist:", error);
          }
        };
      })
    );

    console.log("✅ All files uploaded!");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        multiple
        accept="audio/mpeg,audio/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-input"
      />
      
      <label 
        htmlFor="file-input"
        className="px-6 py-3 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white rounded-lg hover:from-[#1aa34a] hover:to-[#1db954] active:scale-95 transition-all duration-200 cursor-pointer font-medium shadow-lg shadow-[#1db954]/25"
      >
        Select Music Files
      </label>

      {files.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-[#b3b3b3] mb-2">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <button 
            className="px-6 py-3 bg-[#282828] text-white rounded-lg hover:bg-[#383838] active:scale-95 transition-all duration-200 font-medium border border-[#404040]"
            onClick={handleSubmit}
          >
            Upload {files.length} File{files.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFolder;

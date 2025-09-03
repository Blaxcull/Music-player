'use client';

import { useState, useEffect, useRef } from "react";
import AddFolder from "./addFolder";

const RoundIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed right-6 top-6 z-40" ref={dropdownRef}>
      <div 
        className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#1ed760] rounded-full flex items-center justify-center shadow-2xl shadow-[#1db954]/25 hover:shadow-[#1db954]/40 transition-all duration-300 hover:scale-110 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-16 w-80 bg-[#181818] border border-[#333333] rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-[#333333] bg-gradient-to-r from-[#282828] to-[#333333]">
            <h3 className="text-lg font-semibold text-white">Add Music</h3>
            <p className="text-sm text-[#b3b3b3]">Upload your music files</p>
          </div>
          <div className="p-4">
            <AddFolder />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundIcon;

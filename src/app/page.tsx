import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/20 via-[#1ed760]/20 to-[#1aa34a]/20 rounded-3xl"></div>
        <div className="relative bg-[#181818] backdrop-blur-xl border border-[#333333] rounded-3xl p-12 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold gradient-text leading-tight">
                Welcome to Harmony
              </h1>
              <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto leading-relaxed">
                Experience your music like never before with our premium music player. 
                Discover, organize, and enjoy your favorite tracks with stunning visuals and intuitive controls.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/allSongs" 
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10">Browse All Songs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1ed760] to-[#1aa34a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/liked" 
                className="btn-secondary group"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Liked Songs
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

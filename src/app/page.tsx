import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/allSongs" 
          className="group p-6 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-xl transition-all duration-200 hover:border-gray-700 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">All Songs</h3>
              <p className="text-sm text-gray-400">Browse your complete music library</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/liked" 
          className="group p-6 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-xl transition-all duration-200 hover:border-gray-700 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">Liked Songs</h3>
              <p className="text-sm text-gray-400">Your favorite tracks collection</p>
            </div>
          </div>
        </Link>

        <div className="group p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Playlists</h3>
              <p className="text-sm text-gray-400">Create and manage playlists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

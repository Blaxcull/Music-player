import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "./components/sideBar";
import { PlayerProvider } from "@/context/PlayerContext";
import { PlaylistProvider } from "@/context/playlistContext";
import PlayerBar from "./components/PlayerBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Harmony - Music Player",
  description: "A modern, professional music player for your digital library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}>
        <PlayerProvider>
          <PlaylistProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-gray-900/95 lg:backdrop-blur-xl lg:border-r lg:border-gray-800 lg:overflow-hidden lg:min-h-0">
                <SideBar />
              </aside>
              
              {/* Main content */}
              <main className="lg:pl-80 flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>
            
            {/* Player Bar */}
            <PlayerBar />
          </PlaylistProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}

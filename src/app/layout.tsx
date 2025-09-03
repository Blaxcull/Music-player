import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideBar from "./components/sideBar";
import PlayerBar from "./components/PlayerBar";
import { PlayerProvider } from "@/context/PlayerContext";
import { PlaylistProvider } from "@/context/playlistContext";
import RoundIcon from "./components/RoundIcon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmony Music Player",
  description: "A beautiful music player for your favorite songs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PlayerProvider>
          <PlaylistProvider>
            <div className="flex h-screen bg-[#0a0a0a] text-white">
              <SideBar />
              <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto p-8">
                  {children}
                </main>
                <PlayerBar />
              </div>
            </div>
            <RoundIcon />
          </PlaylistProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}

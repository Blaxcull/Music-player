import { useEffect, useState } from "react";

type AddToLikedProps = {
  index: number;
  removeLiked?: (index: number) => void;
};

const AddToLiked = ({ index, removeLiked }: AddToLikedProps) => {
  const [symbol, setSymbol] = useState("+");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/liked?userId=1`);
        const data = await res.json();

        if (data.likedSongIds.includes(index)) {
          setSymbol("-");
        } else {
          setSymbol("+");
        }
      } catch (error) {
        console.error("Error checking liked status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedStatus();
  }, [index]);

  const handleClick = async () => {
    try {
      const res = await fetch("/api/liked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: 1, index, symbol }),
      });

      const data = await res.json();
      const likedSongIds =
        data.updatedIndices?.likedSongIds || data.likedSongIds || [];

      if (likedSongIds.includes(index)) {
        setSymbol("-");
      } else {
        setSymbol("+");
        if (removeLiked) removeLiked(index);
      }
    } catch (error) {
      console.error("Error toggling liked state:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        symbol === "-" 
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
          : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={symbol === "-" ? "Remove from liked" : "Add to liked"}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : symbol === "-" ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
};

export default AddToLiked;


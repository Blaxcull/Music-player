import { useEffect, useState } from "react";

type AddToLikedProps = {
  index: number;
  removeLiked?: (index: number) => void; // optional callback for parent
};

const AddToLiked = ({ index, removeLiked }: AddToLikedProps) => {
  const [symbol, setSymbol] = useState("+"); // "+" = not liked, "-" = liked
  const [loading, setLoading] = useState(true);

  // Fetch liked status on mount or index change
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

  // Toggle liked status
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
        // Notify parent to remove from its local state
        if (removeLiked) removeLiked(index);
      }
    } catch (error) {
      console.error("Error toggling liked state:", error);
    }
  };

  return (
    <div>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleClick}
      >
        {loading ? "..." : symbol}
      </button>
    </div>
  );
};

export default AddToLiked;


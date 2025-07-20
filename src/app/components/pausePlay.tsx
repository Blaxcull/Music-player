const PausePlayButton = ({ onClick, isPlaying }: { onClick: () => void; isPlaying: boolean }) => {
return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 transform">
      <button
        onClick={onClick}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default PausePlayButton;


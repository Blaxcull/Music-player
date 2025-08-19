const PausePlayButton = ({ onClick, isPlaying }: { onClick: () => void; isPlaying: boolean }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  );
};

export default PausePlayButton;


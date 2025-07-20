type VolumeProps = {
  volume: number;
  setVolume: (v: number) => void;
};


const Volume= ({ volume, setVolume }: VolumeProps) => {
  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <span>Volume: {Math.round(volume * 100)}%</span>
    </div>
  );
};

export default Volume;


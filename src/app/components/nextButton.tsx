// nextButton.tsx
type NextButtonProps = {
  onClick: () => void;
};

const NextButton = ({ onClick }: NextButtonProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 translate-x-[70%]">
      <button
        onClick={onClick}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        next
      </button>
    </div>
  );
};

export default NextButton;


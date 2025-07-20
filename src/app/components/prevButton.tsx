type PrevButtonProps = {
  onClick: () => void;

};



const PrevButton= ({ onClick }: PrevButtonProps) => {

  return (
<div className="fixed bottom-4 right-1/2 -translate-x-[70%]">
<button
        onClick={onClick}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
prev
      </button>
    </div>
  );
};

export default PrevButton;



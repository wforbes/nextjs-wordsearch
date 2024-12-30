type WinDialogProps = {
  onPlayAgain: () => void;
};

export function WinDialog({ onPlayAgain }: WinDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p>You found all the words!</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
} 
"use client";

import { useState } from "react";
import { GameController } from "./components/GameController/GameController";
import { WinDialog } from "./components/WinDialog/WinDialog";

export default function Home() {
  const [gameWon, setGameWon] = useState(false);

  const handleGameWon = () => {
    setGameWon(true);
  };

  const handlePlayAgain = () => {
    setGameWon(false);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold">Word Search Game</h1>
      <GameController onGameWon={handleGameWon} />
      {gameWon && <WinDialog onPlayAgain={handlePlayAgain} />}
    </div>
  );
}

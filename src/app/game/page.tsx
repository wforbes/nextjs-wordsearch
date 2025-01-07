"use client";

import { useState } from "react";
import { GameController } from "../components/GameController/GameController";
import { WinDialog } from "../components/WinDialog/WinDialog";
import { useSearchParams } from 'next/navigation';

export default function GamePage() {
	const [gameWon, setGameWon] = useState(false);
	const [gameKey, setGameKey] = useState(0);
	const searchParams = useSearchParams();
	const savedGameId = searchParams.get('id');

	const handleGameWon = () => {
		setGameWon(true);
	};

	const handlePlayAgain = () => {
		setGameWon(false);
		setGameKey(prev => prev + 1);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-grow p-8 flex flex-col items-center gap-8">
				<h1 className="text-3xl font-bold">Word Search Game</h1>
				<GameController 
					key={gameKey} 
					gameKey={gameKey} 
					onGameWon={handleGameWon}
					savedGameId={savedGameId || undefined}
				/>
				{gameWon && <WinDialog onPlayAgain={handlePlayAgain} />}
			</main>
		</div>
	);
}
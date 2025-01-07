'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedGameSummary } from '@/app/types/game';
import { listSavedGames } from '@/app/actions/game';
import { en } from '@/i18n/en';

export function ActiveGamesList() {
	const [games, setGames] = useState<SavedGameSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const loadGames = async () => {
			try {
				const savedGames = await listSavedGames();
				setGames(savedGames);
			} catch (err) {
				setError('Failed to load saved games');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};
		loadGames();
	}, []);

	const handleGameClick = (gameId: string) => {
		router.push(`/game?id=${gameId}`);
	};

	if (isLoading) return <div>Loading saved games...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (games.length === 0) return <div>No saved games found</div>;

	return (
		<div className="w-full">
			<h2 className="text-xl font-semibold mb-4">{en.pages.dashboard.savedGames}</h2>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{games.map((game) => (
					<div
						key={game.id}
						onClick={() => handleGameClick(game.id)}
						className="p-4 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-gray-50"
					>
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium">
								{new Date(game.updated_at).toLocaleDateString()}
							</span>
							{game.completed && (
								<span className="text-green-500">✓ Complete</span>
							)}
						</div>
						<div className="text-sm text-gray-600">
							Progress: {game.foundWords}/{game.wordCount} words
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

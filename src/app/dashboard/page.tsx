"use client";

import { useState } from 'react'
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import { en } from "@/i18n/en";
import { ActiveGamesList } from "@/app/components/ActiveGamesList/ActiveGamesList";
import { NewGameDialog } from '../components/NewGameDialog/NewGameDialog'
import type { NewGameOptions } from '../types/game'

export default function DashboardPage() {
	const [showNewGameDialog, setShowNewGameDialog] = useState(false)
	const router = useRouter();

	const handleStartNewGame = async (options: NewGameOptions) => {
		router.push(`/game?options=${encodeURIComponent(JSON.stringify(options))}`)
	}

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				paddingTop: 2,
				gap: 4
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 4
				}}
			>
				<Typography variant="h2" component="h1">
					{en.pages.dashboard.title}
				</Typography>
				<Button
					variant="contained"
					size="large"
					onClick={() => setShowNewGameDialog(true)}
					sx={{
						px: 4,
						py: 1.5,
						fontSize: '1.2rem'
					}}
				>
					{en.pages.dashboard.startButton}
				</Button>
			</Box>

			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 4,
				}}
			>
				<ActiveGamesList />
			</Box>

			<NewGameDialog
				isOpen={showNewGameDialog}
				onClose={() => setShowNewGameDialog(false)}
				onStartGame={handleStartNewGame}
			/>
		</Container>
	);
}

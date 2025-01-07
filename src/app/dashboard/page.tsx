"use client";

import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import { en } from "@/i18n/en";
import { ActiveGamesList } from "@/app/components/ActiveGamesList/ActiveGamesList";

export default function DashboardPage() {
	const router = useRouter();

	const handleStartGame = () => {
		router.push('/game');
	};

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
					onClick={handleStartGame}
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
		</Container>
	);
}

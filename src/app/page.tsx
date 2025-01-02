"use client";

import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar/NavBar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { en } from "@/i18n/en";

export default function Home() {
	const router = useRouter();

	const handleStartGame = () => {
		router.push('/game');
	};

	return (
		<div className="min-h-screen flex flex-col">
			<NavBar />
			<Container
				component="main"
				maxWidth="md"
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 4,
					}}
				>
					<Typography variant="h2" component="h1" gutterBottom>
						{en.pages.home.title}
					</Typography>
					<Typography variant="h5" component="h2" gutterBottom color="text.secondary">
						{en.pages.home.subtitle}
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
						{en.pages.home.startButton}
					</Button>
				</Box>
			</Container>
		</div>
	);
}

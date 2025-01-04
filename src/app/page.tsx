"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { en } from "@/i18n/en";

export default function Home() {

	return (
		<div 
			className="min-h-screen flex flex-col items-center justify-center"
			data-testid="home-container"
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
			</Box>
		</div>
	);
}

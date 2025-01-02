import { Container, Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { en } from '@/i18n/en';

export default function SignOutPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">

			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 4,
				}}
			>
				<Typography component="h1" variant="h2">
					{en.pages.auth.signout.title}
				</Typography>
				<Typography variant="h5" component="h1" gutterBottom>
					{en.pages.auth.signout.message}
				</Typography>
				<Button
					component={Link}
					href="/"
					variant="contained"
				>
					{en.pages.auth.signout.returnHome}
				</Button>
			</Box>
		</div>
	);
} 
'use client';

import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
} from '@mui/material';
import NavBar from '@/app/components/NavBar/NavBar';
import { en } from '@/i18n/en';

export default function SignUpPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<NavBar />
			<Container
				component="main"
				maxWidth="xs"
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
					}}
				>
					<Typography component="h1" variant="h5">
						{en.pages.auth.signup.title}
					</Typography>
					<Box component="form" sx={{ width: '100%' }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="name"
							label={en.pages.auth.signup.nameLabel}
							name="name"
							autoComplete="name"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label={en.pages.auth.signup.emailLabel}
							name="email"
							autoComplete="email"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label={en.pages.auth.signup.passwordLabel}
							type="password"
							id="password"
							autoComplete="new-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							{en.pages.auth.signup.submitButton}
						</Button>
					</Box>
				</Box>
			</Container>
		</div>
	);
}
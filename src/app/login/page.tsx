'use client';

import { useState } from 'react';
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Alert,
	CircularProgress,
} from '@mui/material';
import { en } from '@/i18n/en';
import { signInAction } from '@/app/actions/auth'
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			const result = await signInAction(email, password)

			if (result?.error) {
				setError('Invalid email or password')
			} else {
				router.push('/dashboard')
				router.refresh()
			}
		} catch (err) {
			console.error('Login error:', err);
			setError('An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
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
						{en.pages.auth.login.title}
					</Typography>
					{error && (
						<Alert severity="error" sx={{ mt: 2, width: '100%' }}>
							{error}
						</Alert>
					)}
					<Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label={en.pages.auth.login.emailLabel}
							name="email"
							autoComplete="email"
							autoFocus
							disabled={loading}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label={en.pages.auth.login.passwordLabel}
							type="password"
							id="password"
							autoComplete="current-password"
							disabled={loading}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								en.pages.auth.login.submitButton
							)}
						</Button>
					</Box>
				</Box>
			</Container>
		</div>
	);
}
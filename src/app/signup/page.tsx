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
import NavBar from '@/app/components/NavBar/NavBar';
import { en } from '@/i18n/en';
import { signUpValidation, type SignUpInput } from './_lib/validation';
import { signUp } from '@/app/actions/auth';

export default function SignUpPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		setValidationErrors({});

		const formData = new FormData(event.currentTarget);
		const data = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
		};

		// Validate form data
		const result = signUpValidation.safeParse(data);
		if (!result.success) {
			const errors: Partial<Record<keyof SignUpInput, string>> = {};
			result.error.issues.forEach((issue) => {
				const path = issue.path[0] as keyof SignUpInput;
				errors[path] = issue.message;
			});
			setValidationErrors(errors);
			setLoading(false);
			return;
		}

		try {
			const response = await signUp(data);
			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message);
			}
		} catch (err) {
			console.error('Sign up error:', err);
			setError('An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

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
					{error && (
						<Alert severity="error" sx={{ mt: 2, width: '100%' }}>
							{error}
						</Alert>
					)}
					{success && (
						<Alert severity="success" sx={{ mt: 2, width: '100%' }}>
							{en.pages.auth.signup.successMessage}
						</Alert>
					)}
					<Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="name"
							label={en.pages.auth.signup.nameLabel}
							name="name"
							autoComplete="name"
							autoFocus
							disabled={loading}
							error={!!validationErrors.name}
							helperText={validationErrors.name}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label={en.pages.auth.signup.emailLabel}
							name="email"
							autoComplete="email"
							disabled={loading}
							error={!!validationErrors.email}
							helperText={validationErrors.email}
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
							disabled={loading}
							error={!!validationErrors.password}
							helperText={validationErrors.password}
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
								en.pages.auth.signup.submitButton
							)}
						</Button>
					</Box>
				</Box>
			</Container>
		</div>
	);
}
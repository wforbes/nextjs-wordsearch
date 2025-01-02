"use client";

import { Button } from '@mui/material';
import { en } from '@/i18n/en';
import { signOutAction } from '@/app/actions/auth';

export function LogoutButton() {
	const handleLogout = async () => {
		await signOutAction();
	};

	return (
		<Button
			color="inherit"
			onClick={handleLogout}
		>
			{en.components.navbar.logoutButton}
		</Button>
	);
} 
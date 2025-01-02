'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { en } from '@/i18n/en';

export default function NavBar() {
	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Link href="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
						<Button color="inherit" sx={{ color: 'inherit' }}>
							{en.components.navbar.signupButton}
						</Button>
					</Link>
					<Button color="inherit">
						{en.components.navbar.loginButton}
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
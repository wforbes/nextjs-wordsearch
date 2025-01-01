'use client';

import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

const theme = createTheme({
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
	palette: {
		mode: 'light',
		primary: {
			main: '#2a5e90',
		},
		secondary: {
			main: '#e346ea',
		},
	},
});

export default theme; 
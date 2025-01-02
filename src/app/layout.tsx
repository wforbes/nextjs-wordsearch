import type { Metadata } from "next";
import ThemeRegistry from './components/ThemeRegistry/ThemeRegistry';
import "./globals.css";

export const metadata: Metadata = {
	title: "Word Search Game",
	description: "A word search puzzle game that keeps you entertained for hours!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta name="emotion-insertion-point" content="" />
			</head>
			<body>
				<ThemeRegistry>
					{children}
				</ThemeRegistry>
			</body>
		</html>
	);
}

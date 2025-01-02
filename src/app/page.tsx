"use client";

import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar/NavBar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

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
            Word Search Game
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
            Ready to start finding words?
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
            Start Searching
          </Button>
        </Box>
      </Container>
    </div>
  );
}

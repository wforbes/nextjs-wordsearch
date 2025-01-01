'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

type WinDialogProps = {
  onPlayAgain: () => void;
};

export function WinDialog({ onPlayAgain }: WinDialogProps) {
  const router = useRouter();

  const handleReturnToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '90%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography variant="h4" component="h2">
            Congratulations!
          </Typography>
          <Typography variant="h6">
            You found all the words!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={onPlayAgain}
              color="primary"
            >
              Play Again
            </Button>
            <Button
              variant="outlined"
              onClick={handleReturnToDashboard}
              color="primary"
            >
              Return to Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
} 
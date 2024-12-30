import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WinDialog } from '../WinDialog';

describe('WinDialog', () => {
  it('renders congratulations message', () => {
    render(<WinDialog onPlayAgain={() => {}} />);
    expect(screen.getByText('Congratulations!')).toBeDefined();
    expect(screen.getByText('You found all the words!')).toBeDefined();
  });

  it('renders play again button', () => {
    render(<WinDialog onPlayAgain={() => {}} />);
    expect(screen.getByText('Play Again')).toBeDefined();
  });

  it('calls onPlayAgain when button is clicked', () => {
    const mockOnPlayAgain = vi.fn();
    render(<WinDialog onPlayAgain={mockOnPlayAgain} />);
    
    fireEvent.click(screen.getByText('Play Again'));
    expect(mockOnPlayAgain).toHaveBeenCalled();
  });
}); 
# Next.js Word Search Game

A modern, interactive word search puzzle game built with Next.js and TypeScript. Players can find hidden words by selecting letters in horizontal, vertical, or diagonal directions.

## Features

- 15x15 grid of randomized letters
- 10 randomly selected words hidden in the grid
- Multiple word placement directions:
  - Horizontal (left to right)
  - Vertical (top to bottom)
  - Diagonal (top-left to bottom-right)
- Interactive word finding:
  - Click and drag to select letters
  - Forgiving diagonal selection system
  - Visual feedback for selections
  - Words can be found forwards or backwards
- Progress tracking:
  - Found words are marked off the list
  - Letters in found words are greyed out in the grid
  - Win detection with congratulations message
- Developer features:
  - God Mode for highlighting hidden word locations
  - Comprehensive test coverage with Vitest
  - TypeScript for type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Development

- Run tests:
```bash
npm test
```

- Run tests in watch mode:
```bash
npm run test:watch
```

- Run tests with coverage:
```bash
npm run test:coverage
```

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vitest for testing
- React Testing Library

import { useState, useMemo, useEffect, useCallback } from 'react'
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { GRID_SIZE, WORD_COUNT, SAMPLE_WORDS, ENABLE_BACKWARD_WORDS, calculateGridCapacity, isWordValidForGrid, validateWord } from '@/app/utils/gameUtils'
import { NewGameOptions, WordListItem } from '@/app/types/game'

type NewGameDialogProps = {
    isOpen: boolean
    onClose: () => void
    onStartGame: (options: NewGameOptions) => void
}

export function NewGameDialog({ isOpen, onClose, onStartGame }: NewGameDialogProps) {
    const [gridSize, setGridSize] = useState(GRID_SIZE)
    const [wordCount, setWordCount] = useState(WORD_COUNT)
    const [wordList, setWordList] = useState<WordListItem[]>(SAMPLE_WORDS)
    const [enableBackwardWords, setEnableBackwardWords] = useState(ENABLE_BACKWARD_WORDS)
    const [customWord, setCustomWord] = useState('')
    const [validationError, setValidationError] = useState<string | null>(null)

    const activeWordCount = useMemo(() => 
        wordList.filter(item => item.active).length,
        [wordList]
    );

    // Calculate maximum words based on current grid size and word list
    const maxWordsForGrid = useMemo(() => 
        calculateGridCapacity(gridSize, wordList),
        [gridSize, wordList]
    );

    // Add validation for word lengths
    const invalidWords = useMemo(() => 
        wordList.filter(item => !isWordValidForGrid(item.word, gridSize)),
        [wordList, gridSize]
    );

    const activateNextInactiveWord = useCallback((currentList: WordListItem[]) => {
        const firstInactiveWord = currentList.find(item => !item.active);
        if (firstInactiveWord) {
            return currentList.map(item =>
                item.word === firstInactiveWord.word
                    ? { ...item, active: true }
                    : item
            );
        }
        return currentList;
    }, []);

    useEffect(() => {
        if (invalidWords.length > 0) {
            setWordList(prevList => prevList.map(item => 
                invalidWords.some(invalid => invalid.word === item.word)
                    ? { ...item, active: false }
                    : item
            ));
        }
    }, [invalidWords]);

    useEffect(() => {
        if (wordCount > maxWordsForGrid) {
            setWordCount(maxWordsForGrid);
        }
    }, [maxWordsForGrid, wordCount]);

    useEffect(() => {
        if (activeWordCount < wordCount) {
            setWordCount(activeWordCount);
        }
    }, [activeWordCount, wordCount, wordList]);

    useEffect(() => {
        if (wordCount < activeWordCount) {
            setWordList(prevList => {
                // Get only the active items
                const activeItems = prevList.filter(item => item.active);
                const remainingToDeactivate = activeWordCount - wordCount;
                
                // Capture which items should be deactivated
                const toDeactivate = new Set(
                    activeItems
                        .slice(-remainingToDeactivate) // Take items from the end
                        .map(item => item.word)
                );
                
                // Update the list, deactivating selected items
                return prevList.map(item => 
                    toDeactivate.has(item.word)
                        ? { ...item, active: false }
                        : item
                );
            });
        }
    }, [wordCount, activeWordCount]);

    const handleToggleWord = useCallback((toggledWord: string) => {
        setWordList(prevList => prevList.map(item => {
            if (item.word !== toggledWord) return item;
            if (item.active) return { ...item, active: false };
            return { ...item, active: true };
        }));

        const targetWord = wordList.find(item => item.word === toggledWord);
        if (targetWord && !targetWord.active) {
            const newActiveCount = activeWordCount + 1;
            if (newActiveCount > wordCount) {
                setWordCount(newActiveCount);
            }
        }
    }, [wordList, activeWordCount, wordCount]);

    const handleWordCountChange = useCallback((_: Event, newValue: number | number[]) => {
        const newCount = newValue as number;
        setWordCount(newCount);
        
        if (newCount > wordCount && activeWordCount < newCount) {
            setWordList(prevList => {
                let updatedList = [...prevList];
                while (updatedList.filter(item => item.active).length < newCount) {
                    const nextList = activateNextInactiveWord(updatedList);
                    if (nextList === updatedList) break;
                    updatedList = nextList;
                }
                return updatedList;
            });
        }
    }, [wordCount, activeWordCount, activateNextInactiveWord]);

    const handleAddWord = () => {
        if (!customWord) return;
        
        const upperWord = customWord.toUpperCase();
        if (wordList.some(item => item.word === upperWord)) {
            setValidationError('Word already exists in list');
            return;
        }

        const validation = validateWord(upperWord, gridSize);
        if (!validation.isValid) {
            setValidationError(validation.error);
            return;
        }

        // Only set as active if we haven't hit word count limit
        const active = activeWordCount < wordCount;
        setWordList([...wordList, { word: upperWord, active }]);
        setCustomWord('');
        setValidationError(null);
    };

    const handleRemoveWord = (wordToRemove: string) => {
        const removedWordActive = wordList.find(item => item.word === wordToRemove)?.active;
        setWordList(wordList.filter(item => item.word !== wordToRemove));
        
        // If we removed an active word and have inactive words available,
        // activate the first inactive word to maintain word count
        if (removedWordActive) {
            const firstInactiveWord = wordList.find(item => !item.active);
            if (firstInactiveWord) {
                setWordList(wordList.map(item =>
                    item.word === firstInactiveWord.word
                        ? { ...item, active: true }
                        : item
                ).filter(item => item.word !== wordToRemove));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate we have enough active words
        const activeWords = wordList.filter(item => item.active);
        if (activeWords.length < wordCount) {
            // Update wordCount to match active words if needed
            setWordCount(activeWords.length);
        }

        // Ensure word count doesn't exceed grid capacity
        const finalWordCount = Math.min(wordCount, maxWordsForGrid);

        onStartGame({
            gridSize,
            wordCount: finalWordCount,
            wordList: wordList.map(item => ({
                ...item,
                // Ensure we only mark as active the words that will be used
                active: item.active && activeWords.indexOf(item) < finalWordCount
            })),
            enableBackwardWords
        });
        onClose();
    };

    // Add validation for the Start button
    const isStartDisabled = useMemo(() => {
        const activeWords = wordList.filter(item => item.active);
        return activeWords.length === 0 || activeWords.length < Math.min(wordCount, 1);
    }, [wordList, wordCount]);

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>New Game Settings</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography gutterBottom>
                                Grid Size: {gridSize}x{gridSize}
                            </Typography>
                            <Slider
                                value={gridSize}
                                onChange={(_, value) => setGridSize(value as number)}
                                min={10}
                                max={20}
                                marks
                                valueLabelDisplay="auto"
                            />
                            <Typography variant="caption" color="text.secondary">
                                Current grid can fit approximately {maxWordsForGrid} words
                            </Typography>
                            {invalidWords.length > 0 && (
                                <Typography variant="caption" color="error">
                                    {invalidWords.length} word(s) too long for current grid size
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography gutterBottom>
                                    Number of Words: {wordCount} 
                                </Typography>
                                <Tooltip title="This controls how many active words will be used in the game">
                                    <InfoIcon fontSize="small" color="action" />
                                </Tooltip>
                            </Box>
                            <Slider
                                value={wordCount}
                                onChange={handleWordCountChange}
                                min={1}
                                max={Math.min(maxWordsForGrid, wordList.length)}
                                marks
                                valueLabelDisplay="auto"
                                disabled={wordList.length === 0}
                            />
                            <Typography 
                                variant="caption" 
                                color={activeWordCount < wordCount ? "error" : "text.secondary"}
                            >
                                {activeWordCount} words active out of {wordList.length} total
                                {activeWordCount < wordCount && 
                                    ` (need ${wordCount - activeWordCount} more active words)`}
                            </Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={enableBackwardWords}
                                    onChange={(e) => setEnableBackwardWords(e.target.checked)}
                                />
                            }
                            label="Enable Backward Words"
                        />

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography>Word List</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {activeWordCount} active / {wordList.length} total
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        value={customWord}
                                        onChange={(e) => {
                                            setCustomWord(e.target.value.toUpperCase());
                                            setValidationError(null);
                                        }}
                                        placeholder="Add custom word"
                                        error={!!validationError}
                                        helperText={validationError}
                                        inputProps={{ pattern: "[A-Za-z]+" }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddWord}
                                        disabled={!customWord}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Check/uncheck words to include them in the game. 
                                Only {wordCount} checked words will be used.
                            </Typography>
                            <List
                                sx={{
                                    maxHeight: 200,
                                    overflow: 'auto',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1
                                }}
                            >
                                {wordList.map(item => (
                                    <ListItem
                                        key={item.word}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveWord(item.word)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        sx={{
                                            opacity: item.active ? 1 : 0.5,
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        <Checkbox
                                            edge="start"
                                            checked={item.active}
                                            onChange={() => handleToggleWord(item.word)}
                                            disabled={!isWordValidForGrid(item.word, gridSize)}
                                            sx={{ mr: 1 }}
                                        />
                                        <ListItemText 
                                            primary={item.word}
                                            secondary={
                                                !isWordValidForGrid(item.word, gridSize)
                                                    ? `Too long for ${gridSize}x${gridSize} grid`
                                                    : !item.active && "Inactive - won't be used in game"
                                            }
                                            sx={{
                                                color: item.active ? 'text.primary' : 'text.secondary',
                                                '& .MuiListItemText-secondary': {
                                                    fontSize: '0.75rem'
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={isStartDisabled}
                    >
                        {isStartDisabled ? 'Need More Active Words' : 'Start Game'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
} 
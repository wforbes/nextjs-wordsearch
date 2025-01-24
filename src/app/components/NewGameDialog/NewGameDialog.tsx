import { useState } from 'react'
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
    Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { GRID_SIZE, WORD_COUNT, SAMPLE_WORDS, ENABLE_BACKWARD_WORDS } from '@/app/utils/gameUtils'

type NewGameOptions = {
    gridSize: number
    wordCount: number
    wordList: string[]
    enableBackwardWords: boolean
}

type NewGameDialogProps = {
    isOpen: boolean
    onClose: () => void
    onStartGame: (options: NewGameOptions) => void
}

export function NewGameDialog({ isOpen, onClose, onStartGame }: NewGameDialogProps) {
    const [gridSize, setGridSize] = useState(GRID_SIZE)
    const [wordCount, setWordCount] = useState(WORD_COUNT)
    const [wordList, setWordList] = useState<string[]>(SAMPLE_WORDS)
    const [enableBackwardWords, setEnableBackwardWords] = useState(ENABLE_BACKWARD_WORDS)
    const [customWord, setCustomWord] = useState('')

    const handleAddWord = () => {
        if (customWord && !wordList.includes(customWord.toUpperCase())) {
            setWordList([...wordList, customWord.toUpperCase()])
            setCustomWord('')
        }
    }

    const handleRemoveWord = (word: string) => {
        setWordList(wordList.filter(w => w !== word))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onStartGame({
            gridSize,
            wordCount,
            wordList,
            enableBackwardWords
        })
        onClose()
    }

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
                        </Box>

                        <Box>
                            <Typography gutterBottom>
                                Number of Words: {wordCount}
                            </Typography>
                            <Slider
                                value={wordCount}
                                onChange={(_, value) => setWordCount(value as number)}
                                min={5}
                                max={Math.min(20, wordList.length)}
                                marks
                                valueLabelDisplay="auto"
                            />
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
                            <Typography gutterBottom>Word List</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    size="small"
                                    value={customWord}
                                    onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
                                    placeholder="Add custom word"
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
                            <List
                                sx={{
                                    maxHeight: 200,
                                    overflow: 'auto',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1
                                }}
                            >
                                {wordList.map(word => (
                                    <ListItem
                                        key={word}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveWord(word)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={word} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Start Game
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
} 
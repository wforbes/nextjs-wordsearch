'use server'

import { auth } from '@/auth'
import { createSavedGame, updateSavedGame, getSavedGame, getAllSavedGames } from '@/db/supabase/saved_game'
import { GameState, SavedGame, SavedGameSummary, WordLocation } from '@/app/types/game'

export async function saveGame(gameState: GameState, gameId?: string) {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Not authenticated')
    }

    try {
        if (gameId) {
            const { data, error } = await updateSavedGame(gameId, session.user.id, gameState)
            if (error) throw error
            return data
        }

        const { data, error } = await createSavedGame(session.user.id, gameState)
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error saving game:', error)
        throw new Error('Failed to save game')
    }
}

export async function loadGame(gameId: string): Promise<SavedGame> {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Not authenticated')
    }

    const { data, error } = await getSavedGame(gameId, session.user.id)

    if (error || !data) {
        console.error('Error loading game:', error)
        throw new Error('Failed to load game')
    }

    return data as SavedGame
}

export async function listSavedGames(): Promise<SavedGameSummary[]> {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Not authenticated')
    }

    const { data, error } = await getAllSavedGames(session.user.id)

    if (error) {
        console.error('Error listing games:', error)
        throw new Error('Failed to list games')
    }

    return data.map(game => ({
        id: game.id,
        created_at: game.created_at,
        updated_at: game.updated_at,
        completed: game.completed,
        wordCount: game.word_locations.length,
        foundWords: game.word_locations.filter((wl: WordLocation) => wl.found).length
    }))
}

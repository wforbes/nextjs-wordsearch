'use server'

import { auth } from '@/auth'
import { createSavedGame, updateSavedGame, getSavedGame, getAllSavedGames } from '@/db/supabase/saved_game'
import { GameState, SavedGame, SavedGameSummary, WordLocation } from '@/app/types/game'

// Add a reusable auth check
async function checkAuth() {
    const session = await auth()
    if (!session?.user) {
        throw new Error('Not authenticated')
    }
    return session.user
}

export async function saveGame(gameState: GameState, gameId?: string) {
    const user = await checkAuth()

    try {
        if (gameId) {
            // Add ownership verification
            const existing = await getSavedGame(gameId, user.id)
            if (!existing.data) {
                throw new Error('Game not found or access denied')
            }

            const { data, error } = await updateSavedGame(gameId, user.id, gameState)
            if (error) throw error
            return data
        }

        const { data, error } = await createSavedGame(user.id, gameState)
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error saving game:', error)
        throw new Error('Failed to save game')
    }
}

export async function loadGame(gameId: string): Promise<SavedGame> {
    const user = await checkAuth()

    const { data, error } = await getSavedGame(gameId, user.id)

    if (error || !data) {
        console.error('Error loading game:', error)
        throw new Error('Game not found or access denied')
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

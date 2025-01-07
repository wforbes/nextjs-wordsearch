import { supabase } from '.'
import type { SavedGame } from './schema'
import type { GameState } from '@/app/types/game'

export async function createSavedGame(userId: string, gameState: GameState) {
    return await supabase
        .from('saved_games')
        .insert({
            user_id: userId,
            grid_state: gameState.grid,
            word_locations: gameState.wordLocations,
            completed: gameState.wordLocations.every(wl => wl.found)
        })
        .select()
        .single()
}

export async function updateSavedGame(gameId: string, userId: string, gameState: GameState) {
    return await supabase
        .from('saved_games')
        .update({
            grid_state: gameState.grid,
            word_locations: gameState.wordLocations,
            completed: gameState.wordLocations.every(wl => wl.found),
            updated_at: new Date().toISOString()
        })
        .eq('id', gameId)
        .eq('user_id', userId)
        .select()
        .single()
}

export async function getSavedGame(gameId: string, userId: string) {
    return await supabase
        .from('saved_games')
        .select()
        .eq('id', gameId)
        .eq('user_id', userId)
        .single()
}

export async function getAllSavedGames(userId: string) {
    return await supabase
        .from('saved_games')
        .select()
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
} 
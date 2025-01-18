import { z } from "zod";
import type { Cell, WordLocation } from "@/app/types/game"

export const users = z.object({
	id: z.string().uuid(),
	name: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string().min(8).max(100),
	emailVerified: z.string().datetime().nullable(),
	image: z.string().nullable(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime()
})

export type User = z.infer<typeof users>

export type SavedGame = {
	id: string
	user_id: string
	grid_state: Cell[][]
	word_locations: WordLocation[]
	created_at: string
	updated_at: string
	completed: boolean
}

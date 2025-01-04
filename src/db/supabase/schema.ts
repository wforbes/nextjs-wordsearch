import { z } from "zod";

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

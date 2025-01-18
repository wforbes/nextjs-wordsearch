import { User, users } from "@/db/supabase/schema";
import { supabaseAdmin } from "@/db/supabase";
import { z } from "zod";

export async function userExistsByEmail(email: z.infer<typeof users>['email']): Promise<{ count: number, error: Error | null }> {
	const { count, error } = await supabaseAdmin
		.from('users')
		.select('id', { count: 'exact', head: true })
		.eq('email', email)

	if (error) {
		throw new Error(error.message);
	}

	return { count, error: null };
}

export async function createUser(data: User) {
	return supabaseAdmin
		.from('users')
		.insert(data);
}

export async function getUserById(id: string) {
	return supabaseAdmin
		.from('users')
		.select('*')
		.eq('id', id)
		.single()
}

export async function getUserByEmail(email: z.infer<typeof users>['email']) {
	return supabaseAdmin
		.from('users')
		.select('*')
		.eq('email', email)
		.single()
}
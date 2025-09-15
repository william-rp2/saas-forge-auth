import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { User } from "../auth";

const DATABASE_NAME: string = "users";

export const UsersRepository = {
	findAll: async () => {
		const { data: users, error } = await supabaseClient.from(DATABASE_NAME).select("*");

		if (error) throw error;
		return users;
	},
	findById: async (id: string) => {
		const { data: user, error } = await supabaseClient.from(DATABASE_NAME).select("*").eq("id", id).single();

		if (error && error.code !== "PGRST116") throw error;
		return user;
	},
	findByEmail: async (email: string) => {
		const { data: user, error } = await supabaseClient.from(DATABASE_NAME).select("*").eq("email", email).limit(1);

		if (error) {
			throw error;
		}

		return user;
	},
	save: async (user: User) => {
		const { data: userCreated, error } = await supabaseClient.from(DATABASE_NAME).insert(user).select().single();

		if (error.code == "23505") {
			console.log("erro na repository!");
			error["user"] = user;
			throw error;
		}

		if (error) throw error;
		return userCreated;
	},
};

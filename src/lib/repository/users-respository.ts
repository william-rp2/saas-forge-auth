import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { User } from "../auth";

const DATABASE_NAME: string = "users";

export interface UsersEntity {
	id?: string;
	email?: string;
	full_name?: string;
	avatar_url?: string;
	created_at?: Date;
	updated_at?: Date;
	password?: string;
	birth_date?: Date;
	cpf?: string;
	gender?: string;
	address_id?: string;
}

export const UsersRepository = {
	findAll: async (): Promise<UsersEntity[]> => {
		const { data: users, error } = await supabaseClient.from(DATABASE_NAME).select("*");

		if (error) throw error;
		return users as UsersEntity[];
	},
	findById: async (id: string): Promise<UsersEntity> => {
		const { data: user, error } = await supabaseClient.from(DATABASE_NAME).select("*").eq("id", id).single();

		if (error && error.code !== "PGRST116") throw error;
		return user as UsersEntity;
	},
	findByEmail: async (email: string): Promise<UsersEntity> => {
		const { data: user, error } = await supabaseClient.from(DATABASE_NAME).select("*").eq("email", email).limit(1);

		if (error) {
			throw error;
		}

		return user[0] as UsersEntity;
	},
	save: async (user: User): Promise<UsersEntity> => {
		const { data: userCreated, error } = await supabaseClient.from(DATABASE_NAME).insert(user).select().single();

		if (error && error.code == "23505") {
			error["user"] = user;
			throw error;
		}

		if (error) throw error;
		return userCreated as UsersEntity;
	},
	update: async (id: string, user: UsersEntity): Promise<UsersEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).update(user).eq("id", id).select().single();

		if (error) {
			console.error("An error has occurred while update user. ERROR: ", error);
			throw error;
		}

		return data as UsersEntity;
	}
};

import { supabase as supabaseClient } from "@/integrations/supabase/client";

const DATABASE_NAME: string = "profiles";

export interface ProfileNotificationPreference {
	email: boolean;
	sms: boolean;
	push: boolean;
	theme: "light" | "dark" | "system";
}

export interface ProfilesEntity {
	id: string;
	user_id: string;
	avatar_url: string;
	bio: string;
	company: string;
	website: string;
	phone: string;
	timezone: string;
	language: string;
	notification_preferences: ProfileNotificationPreference;
	created_at: Date;
	updated_at: Date;
}

export const ProfilesRepository = {
	findByUserId: async (userId: string): Promise<ProfilesEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).select().eq("user_id", userId).single();

		if (error) {
			console.error("An error has occurred while find profile by user id. ERROR: ", error);
			return {} as ProfilesEntity;
		}
		return data as ProfilesEntity;
	},
	findById: async (id: string): Promise<ProfilesEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).select("*").eq("id", id).single();

		if (error) throw error;
		return data as ProfilesEntity;
	},
	findByUserEmail: async (email: string): Promise<ProfilesEntity> => {
		const { data: user, error: userError } = await supabaseClient.from("users").select().eq("email", email).single();

		if (userError) {
			console.error("An error has occurred while find a user by email. ERROR: ", userError);
			throw new Error("User not found");
		}

		const { data: profile, error: profileError } = await supabaseClient.from(DATABASE_NAME).select().eq("user_id", user.id).single();

		if (profileError) {
			console.error("An error has occurred while find a user profile. ERROR: ", profileError);
			throw new Error("User Profile not found");
		}

		return profile as ProfilesEntity;
	},
	save: async (profile: ProfilesEntity): Promise<ProfilesEntity> => {
		const { data: profileCreated, error } = await supabaseClient.from(DATABASE_NAME).insert(profile).select().single();

		if (error) {
			console.error("An error has occurred while save a user profile. ERROR: ", error);
			throw error;
		}
		return profileCreated as ProfilesEntity;
	},

	update: async (id: string, profile: ProfilesEntity): Promise<ProfilesEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).update(profile).eq("id", id).select().single();

		if (error) {
			console.error("An error has occurred while update a user profile.ERROR: ", error);
			throw error;
		}
		return data as ProfilesEntity;
	},
	updateOrSave: async (userId: string, profile: ProfilesEntity): Promise<ProfilesEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).select().eq("user_id", userId);

		if (error) {
			console.error("[UDPATEORSAVE] An error has occurred while find a user to update a profile. ERROR: ", );
			throw error;
		}
		if (!data || data.length === 0) {
			profile.user_id = userId;
			return ProfilesRepository.save(profile);
		}
		else return ProfilesRepository.update(data[0].id, profile);
	},
};

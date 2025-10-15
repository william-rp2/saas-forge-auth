import { supabase as supabaseClient } from "@/integrations/supabase/client";

const DATABASE_NAME: string = "plans";

export interface PlansEntity {
	id?: string;
	created_at: Date;
	description: string;
	name: string;
	price: number;
	price_description: string;
	updated_at: Date;
}

export const PlansRepository = {
	findAll: async (): Promise<PlansEntity[]> => {
		const { data: plans, error } = await supabaseClient.from(DATABASE_NAME).select();

		if (error) {
			console.error("An error has occurred while find all platform plans. ERROR: ", error);
			throw error;
		}

		return plans;
	},
	findById: async (id: string) => {
		if (!id) {
			throw new Error("Plan id is missing");
		}
		const { data: plan, error } = await supabaseClient.from(DATABASE_NAME).select().eq("id", id).single();

		if (error) {
			console.error("An error has occurred while find a plan by id. ERROR: ", error);
			throw error;
		}
		return plan;
	},
	save: async (plan: PlansEntity): Promise<PlansEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).insert(plan).select().single();

		if (error) throw error;
		return data;
	},
	update: async (id: string, plan: PlansEntity): Promise<PlansEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).update(plan).eq("id", id).select().single();

		if (error) {
			console.error("Ocorreu um erro ao atualizar o endereço do usuário");
			throw error;
		}

		return data;
	},
};

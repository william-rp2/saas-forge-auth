import { supabase as supabaseClient } from "@/integrations/supabase/client";

const DATABASE_NAME: string = "address";

export enum AddressTypeEnum {
	RESIDENTIAL = "RESIDENTIAL",
	COMMERCIAL = "COMMERCIAL",
	OTHER = "OTHER",
}

export interface AddressEntity {
	id: string;
	user_id: string;
	address_type: AddressTypeEnum;
	address_value: string;
}

export const AddressRepository = {
	findById: async (id: string) => {
		if (!id) {
			return;
		}
		const { data: address, error } = await supabaseClient.from(DATABASE_NAME).select().eq("id", id).single();

		if (error) {
			console.error("An error has occurred while find a address by id. ERROR: ", error);
			throw error;
		}
		return address;
	},
	findByUserId: async (userId: string): Promise<AddressEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).select().eq("user_id", userId).single();

		if (error) {
			console.error("An error has occurred while find user address. ERROR: ", error);
			return {} as AddressEntity;
		}
		return data as AddressEntity;
	},
	save: async (address: AddressEntity): Promise<AddressEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).insert(address).select().single();

		if (error) throw error;
		return data;
	},
	update: async (id: string, address: AddressEntity): Promise<AddressEntity> => {
		const { data, error } = await supabaseClient.from(DATABASE_NAME).update(address).eq("id", id).select().single();

		if (error) {
			console.error("Ocorreu um erro ao atualizar o endereço do usuário");
			throw error;
		}

		return data;
	},
};

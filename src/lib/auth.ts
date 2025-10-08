/**
 * Authentication utilities and types
 * Provides type-safe authentication helpers and user management
 */

import { mockAuth, isMockEnabled } from "@/mocks";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { UsersRepository } from "./repository/users-respository";
import { compare, hash, truncates } from "bcryptjs";

/**
 * User authentication state
 */
export interface User {
	id: string;
	full_name: string;
	email: string;
	avatar_url: string;
	selected_plan: "basic" | "pro" | "enterprise";
	password?: string;
}

/**
 * Authentication context state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedPlan: 'basic' | 'pro' | 'enterprise';
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

/**
 * Authentication API service
 * Switches between mock and real API based on environment
 */
export const authApi = {
	/**
	 * Authenticate user with email and password
	 */
	login: async (credentials: LoginCredentials) => {
		const { email, password } = credentials;
		const user = await UsersRepository.findByEmail(email);

		if (!user) throw new Error("User not found");

		console.log("User founded");
		const valueMatch: boolean = await compare(password, user.password);
		console.log("password: ", password);
		console.log("user.password: ", user.password);
		if (!valueMatch) throw new Error("User or password is wrong");

		const { data, error } = await supabaseClient.auth.signInWithPassword({
			email,
			password: user.password,
		});

		if (error) {
			throw error;
		}

		const nameSplitted: string[] = user.full_name.split(" ");

		localStorage.setItem(
			"logged_data",
			JSON.stringify({
				id: user.id,
				name: user.full_name,
				email: user.email,
				initials: `${nameSplitted[0][0]}${nameSplitted[nameSplitted.length - 1][0]}`,
			})
		);

		return {
			success: true,
			message: "Login realizado com sucesso",
		};
	},

	logout: async () => {
		const { error } = await supabaseClient.auth.signOut();
		localStorage.removeItem("logged_data");
		if (error) {
			throw new Error("An error has ocurred while make user logout");
		}
	},

	/**
	 * Register new user
	 */
	register: async (data: RegisterData) => {
		try {
			//- Verifica se existe algum usuário com o e-mail cadastrado
			const { email, fullName, selectedPlan, password } = data;
			const userAlreadyExists = await UsersRepository.findByEmail(email);

			if (userAlreadyExists) {
				//- Existe um usuário cadastrado com o e-mail informado
				throw new Error("Já existe um usuário cadastrado com este e-mail");
			}

			//- Não existe nenhum usuário cadastrado com este e-mail
			const cryptedPassword: string = await hash(password, 10);
			const userCreated = await UsersRepository.save({ full_name: fullName, email, selected_plan: selectedPlan, password: cryptedPassword } as User);
			supabaseClient.auth.signUp({ email, password: cryptedPassword });
			return userCreated;
		} catch (error) {
			console.error("An error has ocurred while create a new user. ERROR: ", error);
			throw error;
		}
	},

	/**
	 * Request password reset
	 */
	forgotPassword: async (email: string) => {
		if (isMockEnabled()) {
			return mockAuth.forgotPassword(email);
		}

		// TODO: Replace with real API call when Supabase is connected
		throw new Error("Real API not implemented yet. Please enable mocks.");
	},

	/**
	 * Authenticate with Google
	 */
	googleLogin: async () => {
		const { error } = await supabaseClient.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin + "/dashboard" },
		});

		if (error) {
			throw new Error("An error has occurred while log in user with Google");
		}

		const { data: userData, error: userError } = await supabaseClient.auth.getUser();
		if (userError) {
			return;
		}
		const { user } = userData;
		const { user_metadata, id } = user;
		const name: string = user_metadata.full_name;
		const email: string = user_metadata.email;
		const avatar = user_metadata.avatar_url;

		const userSaved = await UsersRepository.save({ full_name: name, email, avatar_url: avatar, selected_plan: "basic" } as User);

		const nameSplitted: string[] = name.split(" ");
		localStorage.setItem("logged_data", JSON.stringify({
			id,
			name,
			email,
			initials: `${nameSplitted[0][0]}${nameSplitted[nameSplitted.length - 1][0]}`
		}));

		return {
			success: true,
			message: "Login com Google realizado com sucesso",
			user: {
				id,
				name,
				email,
				selectedPlan: "basic",
			},
			token: "mock_google_jwt_token",
		};
	},

	setUserDataInLocalStorage: async () => {
		const { data: userData, error: userError } = await supabaseClient.auth.getUser();
		if (userError) {
			return false;
		}
		const { user } = userData;
		const { user_metadata, id } = user;
		const name: string = user_metadata.full_name;
		const email: string = user_metadata.email;

		const nameSplitted: string[] = name.split(" ");
		localStorage.setItem("logged_data", JSON.stringify({
			id,
			name,
			email,
			initials: `${nameSplitted[0][0]}${nameSplitted[nameSplitted.length - 1][0]}`
		}));

		return true;
	}
};

/**
 * Local storage keys for persistence
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'saas_core_auth_token',
  USER_DATA: 'saas_core_user_data',
} as const;

/**
 * Utility functions for token management
 */
export const tokenUtils = {
  /**
   * Store authentication token
   */
  store: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Retrieve authentication token
   */
  get: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Remove authentication token
   */
  remove: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidCpf(cpf: string): boolean {
	if (typeof cpf !== "string") return false;
	cpf =  removeCpfMask(cpf)//- Remove todos os caracteres não numéricos

	if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

	const cpfDigits: number[] = cpf.split("").map(item => +item);

	const rest = (count: number): number => {
		let sum: number = 0;
		for (let i = 0; i < count; i++) sum += cpfDigits[i] * (count + 1 - i);

		const result = sum % 11;
		return result < 2 ? 0 : 11 - result;
	};

	return rest(9) === cpfDigits[9] && rest(10) === cpfDigits[10];
}


export function removeCpfMask(cpf: string): string {
	return cpf.replace(/[^\d]+/g, "");
}

export function addCpfMask(cpf: string): string {
	if (!cpf) return "";
	//- Remove tudo o que não for digito
	cpf = cpf.replace(/\D/g, '');
	//- Aplica a máscara no valor
	cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
	cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
	cpf = cpf.replace(/(\d{3})(\d{2})$/, '$1-$2');

	return cpf.substring(0, 14);
}

export function validateEmail(email: string): boolean {
		const usuario = email.substring(0, email.indexOf("@"));
		const dominio = email.substring(email.indexOf("@") + 1, email.length);

		if (
			usuario.length >= 1 &&
			dominio.length >= 3 &&
			usuario.search("@") == -1 &&
			dominio.search("@") == -1 &&
			usuario.search(" ") == -1 &&
			dominio.search(" ") == -1 &&
			dominio.search(".") != -1 &&
			dominio.indexOf(".") >= 1 &&
			dominio.lastIndexOf(".") < dominio.length - 1
		) {
			return true;
		} else {
			return false;
		}
	}
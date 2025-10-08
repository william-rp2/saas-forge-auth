/**
 * ProfileForm Component - Formulário de perfil do usuário
 *
 * Agora integrado com o sistema de Storage para upload de foto de perfil.
 * Utiliza o componente genérico <Uploader> para gerenciar uploads de avatar.
 */

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Uploader, UploaderFile } from "@/components/shared/Uploader";
import { ProfilesEntity, ProfilesRepository } from "@/lib/repository/profile-repository";
import { isValidCpf, removeCpfMask, validateEmail } from "@/lib/utils";
import { AddressEntity, AddressRepository } from "@/lib/repository/address-repository";
import { UsersEntity, UsersRepository } from "@/lib/repository/users-respository";
import { supabase } from "@/integrations/supabase/client";
import { addCpfMask } from '../../../lib/utils';


const profileSchema = z.object({
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
	email: z.email("Email inválido"),
	bio: z.string().optional(),
	company: z.string().optional(),
	website: z.string().url("URL inválida").optional().or(z.literal("")),
	birthdate: z.union([z.string(), z.date()]).refine(value => {
		const date: Date = value instanceof Date ? value : new Date(value);
		const today: Date = new Date();
		let age = today.getFullYear() - date.getFullYear();
		const ageMonth = today.getMonth() - date.getMonth();
		if (ageMonth < 0 || (ageMonth === 0 && today.getDate() < date.getDate())) {
			age--;
		}

		return age >= 0 && age <= 120; //- Idade entre 0 e 120 anos
	}, "Idade inválida ou fora do permitido."),
	cpf: z
		.string()
		.trim()
		.regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF deve estar no formato '000.000.000-00' ou '00000000000'")
		.refine(isValidCpf, "CPF inválido"),
	gender: z.enum(["M", "F"], {
		message: "Gênero inválido. Use 'M' para Masculino ou 'F' para Feminino.",
	}),
	addressType: z.enum(["RESIDENTIAL", "COMMERCIAL", "OTHER"], {
		message: "Tipo de endereço inválido. Use 'RESIDENTIAL' para endereço residencial, 'COMMERCIAL' para endereço comercial ou 'OTHER' para outros endereços.",
	}),
	addressValue: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres").max(255, "O endereço não pode ter mais de 255 caracteres."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Formulário de perfil integrado com Storage
 */
export function ProfileForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const { toast } = useToast();

	const { initials, name, email } = JSON.parse(localStorage.getItem("logged_data"));
	const userProfile = React.useRef(null);

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: userProfile.current?.full_name || "",
			email: userProfile.current?.email || "",
			bio: userProfile.current?.bio || "",
			company: userProfile.current?.company || "",
			website: userProfile.current?.website || "",
			birthdate: userProfile.current?.birthdate || null,
			cpf: userProfile.current?.cpf || "",
			gender: userProfile.current?.gender || "",
			addressType: userProfile.current?.addressType || "",
			addressValue: userProfile.current?.addressValue || "",
		},
	});
	const genders = [
		{ value: "", label: "Selecione o gênero", disabled: true, selected: true},
		{ value: "F", label: "Feminino"},
		{ value: "M", label: "Masculino" },
	];
	const addressesType = [
		{ value: "", label: "Selecione o tipo de endereço", disabled: true, selected: true},
		{ value: "COMMERCIAL", label: "Comercial"},
		{ value: "RESIDENTIAL", label: "Residencial" },
		{ value: "OTHER", label: "Outros"}
	];

	useEffect(() => {
		async function fetchUserProfile() {
			const user: UsersEntity = await UsersRepository.findByEmail(email);
			const profile = await ProfilesRepository.findByUserId(user.id);
			const { bio, company, website, avatar_url: avatarUrl } = profile || { bio: "", company: "", website: "", avatar_url: "" };
			const address = await AddressRepository.findByUserId(user.id);

			userProfile.current = {
				initials,
				name,
				email: user.email,
				bio,
				company,
				website,
				avatarUrl: user.avatar_url !== null ? user.avatar_url : profile.avatar_url,
				birthdate: user.birth_date,
				cpf: addCpfMask(user.cpf),
				gender: user.gender,
				addressType: address ? address.address_type : "",
				addressValue: address ? address.address_value : "",
				userId: user.id,
				addressId: address ? address.id : "",
				profileId: profile ? profile.id : "",
			};

			form.setValue("name", name);
			form.setValue("email", user.email);
			form.setValue("bio", bio);
			form.setValue("company", company);
			form.setValue("website", website);
			form.setValue("birthdate", user.birth_date);
			form.setValue("cpf", addCpfMask(user.cpf));
			form.setValue("gender", user.gender as "M" | "F");
			form.setValue("addressType", address ? address.address_type : "RESIDENTIAL")
			form.setValue("addressValue", address ? address.address_value : "");

			setAvatarUrl(user.avatar_url !== null ? user.avatar_url : profile.avatar_url);
		}
		fetchUserProfile();
		
		const cpfInput = document.getElementById("cpf");
		cpfInput.addEventListener("input", formatCpf);
	}, [initials, name, email, form]);

	/**
	 * Manipula o upload do avatar
	 */
	const handleAvatarUpload = (files: UploaderFile[]) => {
		if (files.length > 0) {
			const uploadedFile = files[0];
			setAvatarUrl(uploadedFile.url);

			toast({ title: "Avatar atualizado", description: "Sua foto de perfil foi atualizada com sucesso." });
		}
	};

	/**
	 * Submissão do formulário
	 */
	const onSubmit = async (data: ProfileFormData) => {
		setIsLoading(true);

		try {
			const { addressType, addressValue, bio, birthdate, company, cpf, email, gender, name, website } = data;
			//- Valida o CPF
			if (!isValidCpf(cpf)) {
				//- O CPF não é válido
				toast({ title: "Erro na atualização", description: "O CPF informado é inválido" });
				return;
			}

			if (userProfile.current.addressId) {
				//- O usuário está atualizando o endereço
				const address = await AddressRepository.findById(userProfile.current.addressId);
				address.address_type = addressType && addressType !== address.address_type ? addressType : address.addressType;
				address.address_value = addressValue && addressValue !== address.address_value ? addressValue : address.address_value;

				await AddressRepository.update(address.id, address);
			} else {
				//- O usuário está cadastrando o endereço pela primeira vez
				await AddressRepository.save({
					user_id: userProfile.current.userId,
					address_type: addressType,
					address_value: addressValue } as AddressEntity);
			}

			if (userProfile.current.profileId) {
				//- O usuário está atualizando o perfil
				const profile = await ProfilesRepository.findById(userProfile.current.profileId);
				profile.avatar_url = avatarUrl && avatarUrl !== profile.avatar_url ? avatarUrl : profile.avatar_url;
				profile.bio = bio && bio !== profile.bio ? bio : profile.bio;
				profile.company = company && company !== profile.company ? company : profile.company;
				profile.website = website && website !== profile.website ? website : profile.website;
				await ProfilesRepository.update(userProfile.current.profileId, profile);
			} else {
				//- O usuário está cadastrando informações pela primeira vez no perfil
				await ProfilesRepository.save({
					user_id: userProfile.current.userId,
					avatar_url: avatarUrl,
					bio,
					company,
					website
				} as ProfilesEntity);
			}

			if (email !== userProfile.current.email) {
				//- O usuário alterou o email, necessita atualizar na base de login
				if (!validateEmail(email)) {
					//- O e-mail informado é inválido
					toast({ title: "Erro na atualização", description: "O e-mail informado é inválido"});
					return;
				}
				await supabase.auth.updateUser({ email });
			}

			const user = await UsersRepository.findById(userProfile.current.userId);
			user.email = email && email !== user.email ? email : user.email;
			user.full_name = name !== user.full_name ? name : user.full_name;
			user.avatar_url = avatarUrl && avatarUrl !== user.avatar_url ? avatarUrl : user.avatar_url;
			user.birth_date = birthdate && birthdate !== user.birth_date ? birthdate as Date : user.birth_date;
			user.cpf = cpf && cpf !== user.cpf ? removeCpfMask(cpf) : user.cpf;
			user.gender = gender && gender !== user.gender ? gender : user.gender;

			await UsersRepository.update(userProfile.current.userId, user);

			toast({
				title: "Perfil atualizado",
				description: "Suas informações foram salvas com sucesso.",
			});
		} catch (error) {
			console.error("An error has occurred while update user profile: ERROR: ", error);
			toast({
				title: "Erro ao salvar",
				description: "Não foi possível salvar as alterações. Tente novamente.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const formatCpf = (event) => {
		let value: string = event.target.value;
		//- Remove tudo o que não for digito
		value = value.replace(/\D/g, '');
		//- Aplica a máscara no valor
		value = value.replace(/(\d{3})(\d)/, '$1.$2');
		value = value.replace(/(\d{3})(\d)/, '$1.$2');
		value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');

		const valueMasked: string = value.substring(0, 14);
		form.setValue("cpf", valueMasked);
		event.target.value = valueMasked;
	}

	const handleGender = (event) => {
		form.setValue("gender", event.target.value);
	}

	const handleAddressType = (event) => {
		form.setValue("addressType", event.target.value);
	}

	return (
		<div className="space-y-6">
			{/* Avatar Section */}
			<Card>
				<CardHeader>
					<CardTitle>Foto de Perfil</CardTitle>
					<CardDescription>Sua foto de perfil será exibida em todo o sistema</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-4">
						<Avatar className="w-20 h-20">
							<AvatarImage src={ avatarUrl || userProfile.current?.avatarUrl } alt={userProfile.current?.name}></AvatarImage>
							<AvatarFallback className="text-lg">{userProfile.current?.initials?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
						</Avatar>

						<div className="flex-1">
							<p className="text-sm font-medium mb-2">Alterar foto</p>
							<Uploader
								path="avatars/"
								accept="image/jpeg,image/png,image/webp"
								maxFiles={1}
								maxFileSize={5 * 1024 * 1024} // 5MB
								onUploadComplete={handleAvatarUpload}
								className="min-h-0"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Profile Information */}
			<Card>
				<CardHeader>
					<CardTitle>Informações Pessoais</CardTitle>
					<CardDescription>Atualize suas informações de perfil</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nome completo</Label>
								<Input id="name" {...form.register("name")} disabled={isLoading} />
								{form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="cpf">CPF</Label>
								<Input id="cpf" {...form.register("cpf")} disabled={isLoading} />
								{form.formState.errors.cpf && <p className="text-sm text-destructive">{form.formState.errors.cpf.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="birthdate">Data de nascimento</Label>
								<Input
									id="birthdate"
									type="date"
									max={new Date().toISOString().split("T")[0]}
									{...form.register("birthdate")}
									disabled={isLoading} 
								/>
								{form.formState.errors.birthdate && <p className="text-sm text-destructive">{form.formState.errors.birthdate.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="gender">Gênero</Label>
								<select
									id="gender"
									name="gender"
									onChange={handleGender}
									required
									title="Selecione o gênero"
									{...form.register('gender')}
									className="bg-background px-3 py-2 border-input border rounded-md text-base ring-offset-background w-full h-10 flex"
								>
									{genders.map((gender) => (
										<option
											key={gender.value}
											value={gender.value}
											selected={gender.selected}
											disabled={gender.disabled}
										>{ gender.label }</option>
									))}
								</select>
								{form.formState.errors.gender && <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" {...form.register("email")} disabled={isLoading} />
							{form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Biografia</Label>
							<Textarea id="bio" placeholder="Conte um pouco sobre você..." {...form.register("bio")} disabled={isLoading} />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="company">Empresa</Label>
								<Input id="company" placeholder="Nome da sua empresa" {...form.register("company")} disabled={isLoading} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input id="website" type="url" placeholder="https://seusite.com" {...form.register("website")} disabled={isLoading} />
								{form.formState.errors.website && <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="addressValue">Endereço</Label>
								<Input id="addressValue" {...form.register("addressValue")} disabled={isLoading} />
								{form.formState.errors.addressValue && <p className="text-sm text-destructive">{form.formState.errors.addressValue.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="addressType">Tipo de endereço</Label>
								<select
									id="addressType"
									name="addressType"
									onChange={handleAddressType}
									required
									title="Selecione tipo de endereço"
									{ ...form.register("addressType")}
									className="bg-background px-3 py-2 border-input border rounded-md text-base ring-offset-background w-full h-10 flex"
								>
									{addressesType.map((type) => (
										<option
											key={type.value}
											value={type.value}
											disabled={type.disabled}
										>{ type.label }</option>
									))}
								</select>
								{form.formState.errors.addressType && <p className="text-sm text-destructive">{form.formState.errors.addressType.message}</p>}
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Salvando..." : "Salvar alterações"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

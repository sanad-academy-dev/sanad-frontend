import type { TFunction } from "i18next";
import { z } from "zod";

export const createLoginSchema = (t: TFunction) =>
	z.object({
		email: z.email(t("auth.validation.invalidEmail")),
		password: z.string().min(1, t("auth.validation.passwordRequired")),
	});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const createForgetPasswordEmailSchema = (t: TFunction) =>
	z.object({
		email: z.email(t("auth.validation.invalidEmail")),
	});

export type ForgetPasswordEmailValues = z.infer<
	ReturnType<typeof createForgetPasswordEmailSchema>
>;

export const createResetPasswordSchema = (t: TFunction) =>
	z
		.object({
			password: z.string().min(8, t("auth.validation.passwordMinLength")),
			confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("auth.validation.passwordsDoNotMatch"),
			path: ["confirmPassword"],
		});

export type ResetPasswordValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export const createChangePasswordSchema = (t: TFunction) =>
	z
		.object({
			currentPassword: z.string().min(1, t("auth.validation.passwordRequired")),
			newPassword: z
				.string()
				.min(8, t("auth.validation.passwordMinLength"))
				.refine((p) => /[a-z]/.test(p) && /[A-Z]/.test(p), {
					message: t("auth.validation.passwordUpperLower"),
				})
				.refine((p) => /\d/.test(p), {
					message: t("auth.validation.passwordNeedsNumber"),
				})
				.refine((p) => /[^A-Za-z0-9]/.test(p), {
					message: t("auth.validation.passwordNeedsSymbol"),
				}),
			confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: t("auth.validation.passwordsDoNotMatch"),
			path: ["confirmPassword"],
		});

export type ChangePasswordValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

export const createRegisterSchema = (t: TFunction) =>
	z
		.object({
			name: z.string().min(1, t("auth.validation.fullNameRequired")),
			email: z.email(t("auth.validation.invalidEmail")),
			phone: z.string().min(1, t("auth.validation.phoneRequired")),
			password: z.string().min(8, t("auth.validation.passwordMinLength")),
			confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("auth.validation.passwordsDoNotMatch"),
			path: ["confirmPassword"],
		});

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

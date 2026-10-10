import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconUserCheck } from "@tabler/icons-react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { createRegisterSchema, type RegisterFormValues } from "@/features/auth/auth.type";
import { getInvite } from "@/functions/get-invite";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import { signUp } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth-layout/invite/$token")({
	loader: ({ params }) => getInvite(params.token),
	component: RouteComponent,
});

function RouteComponent() {
	const { token } = useParams({ from: "/_auth-layout/invite/$token" });
	const invite = Route.useLoaderData();
	const navigate = useNavigate();
	const { t } = useI18n();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(createRegisterSchema(t)),
		defaultValues: invite.status === "valid" ? { email: invite.email } : {},
	});
	const passwordValue = watch("password", "");

	if (invite.status === "not_found") {
		return <InviteError message={t("invite.notFound")} />;
	}

	if (invite.status === "expired") {
		return <InviteError message={t("invite.expired")} />;
	}

	const roleLabel = invite.role === "ADMIN" ? t("invite.roleAdmin") : t("invite.roleMember");

	const onSubmit = async (data: RegisterFormValues) => {
		const { error } = await signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
			phone: data.phone,
		});

		if (error) {
			toast.error(error.message ?? t("auth.register.errors.registerFailed"));
			return;
		}

		const { error: acceptError } = await api.invites({ token }).accept.post();
		if (acceptError) {
			toast.error(t("invite.joinFailed"));
			return;
		}

		navigate({ to: "/dashboard" });
	};

	return (
		<div className="flex flex-col gap-6 max-w-md">
			<div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
				<IconUserCheck className="mt-0.5 size-5 shrink-0 text-primary" />
				<div className="flex flex-col gap-0.5">
					<p className="text-sm font-medium text-foreground">
						{t("invite.banner", {
							name: invite.invitedByName,
							clinic: invite.clinicName,
							role: roleLabel,
						})}
					</p>
					<p className="text-xs text-muted-foreground">{t("invite.subtitle")}</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<Field data-invalid={!!errors.name}>
						<FieldLabel htmlFor="name">{t("auth.register.fullName")}</FieldLabel>
						<Input
							id="name"
							type="text"
							placeholder={t("auth.register.fullNamePlaceholder")}
							aria-invalid={!!errors.name}
							{...register("name")}
						/>
						<FieldError errors={[errors.name]} />
					</Field>

					<Field data-invalid={!!errors.email}>
						<FieldLabel htmlFor="email">{t("auth.register.email")}</FieldLabel>
						<Input
							id="email"
							type="email"
							readOnly
							className="bg-muted/50 cursor-not-allowed"
							aria-invalid={!!errors.email}
							{...register("email")}
						/>
						<FieldError errors={[errors.email]} />
					</Field>

					<Field data-invalid={!!errors.phone}>
						<FieldLabel htmlFor="phone">{t("auth.register.phone")}</FieldLabel>
						<Controller
							name="phone"
							control={control}
							render={({ field }) => (
								<PhoneInput
									id="phone"
									defaultCountry="SA"
									countries={["SA", "AE", "KW", "BH", "QA", "OM", "EG"]}
									addInternationalOption={false}
									placeholder={t("auth.register.phonePlaceholder")}
									aria-invalid={!!errors.phone}
									value={field.value ?? undefined}
									onChange={(v) => field.onChange(v ?? "")}
								/>
							)}
						/>
						<FieldError errors={[errors.phone]} />
					</Field>

					<Field data-invalid={!!errors.password}>
						<FieldLabel htmlFor="password">{t("auth.register.password")}</FieldLabel>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder={t("auth.register.passwordPlaceholder")}
								aria-invalid={!!errors.password}
								className="pe-9"
								{...register("password")}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute inset-y-0 inset-e-3 my-auto flex items-center text-muted-foreground transition-colors hover:text-foreground"
								aria-label={
									showPassword
										? t("auth.register.hidePassword")
										: t("auth.register.showPassword")
								}
							>
								{showPassword ? (
									<IconEyeOff className="size-4" />
								) : (
									<IconEye className="size-4" />
								)}
							</button>
						</div>
						<PasswordStrengthIndicator
							password={passwordValue}
							label={t("auth.register.passwordStrength.label")}
							labels={{
								weak: t("auth.register.passwordStrength.weak"),
								fair: t("auth.register.passwordStrength.fair"),
								good: t("auth.register.passwordStrength.good"),
								strong: t("auth.register.passwordStrength.strong"),
							}}
						/>
						<FieldError errors={[errors.password]} />
					</Field>

					<Field data-invalid={!!errors.confirmPassword}>
						<FieldLabel htmlFor="confirmPassword">
							{t("auth.register.confirmPassword")}
						</FieldLabel>
						<div className="relative">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder={t("auth.register.confirmPasswordPlaceholder")}
								aria-invalid={!!errors.confirmPassword}
								className="pe-9"
								{...register("confirmPassword")}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								className="absolute inset-y-0 inset-e-3 my-auto flex items-center text-muted-foreground transition-colors hover:text-foreground"
								aria-label={
									showConfirmPassword
										? t("auth.register.hidePassword")
										: t("auth.register.showPassword")
								}
							>
								{showConfirmPassword ? (
									<IconEyeOff className="size-4" />
								) : (
									<IconEye className="size-4" />
								)}
							</button>
						</div>
						<FieldError errors={[errors.confirmPassword]} />
					</Field>

					<Field>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}

function InviteError({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center gap-4 max-w-sm text-center">
			<div className="flex size-16 items-center justify-center rounded-full border-2 border-destructive/30 bg-destructive/10">
				<IconUserCheck className="size-8 text-destructive" />
			</div>
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
}

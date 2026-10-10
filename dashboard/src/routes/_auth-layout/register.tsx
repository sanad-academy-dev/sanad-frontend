import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { createRegisterSchema, type RegisterFormValues } from "@/features/auth/auth.type";
import { invalidateSessionCache } from "@/functions/get-session";
import { useI18n } from "@/hooks/use-i18n";
import { signIn, signUp } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth-layout/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { t } = useI18n();

	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(createRegisterSchema(t)),
	});
	const passwordValue = watch("password", "");
	const watchedValues = watch();
	const isFormEmpty =
		!watchedValues.name ||
		!watchedValues.email ||
		!watchedValues.phone ||
		!watchedValues.password ||
		!watchedValues.confirmPassword;

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

		invalidateSessionCache();
		navigate({ to: "/dashboard" });
	};

	const handleGoogleSignUp = () => {
		signIn.social({
			provider: "google",
			callbackURL: `${window.location.origin}/dashboard`,
			errorCallbackURL: `${window.location.origin}/register`,
		});
	};

	return (
		<div className="flex flex-col gap-6 max-w-md">
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">أكاديمية سند</h1>
						<p className="text-sm text-muted-foreground">{t("auth.register.subtitle")}</p>
					</div>

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
							placeholder={t("auth.register.emailPlaceholder")}
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
									{...field}
									id="phone"
									value={field.value ?? undefined}
									defaultCountry="SA"
									countries={["SA", "AE", "KW", "BH", "QA", "OM", "EG"]}
									addInternationalOption={false}
									placeholder={t("auth.register.phonePlaceholder")}
									aria-invalid={!!errors.phone}
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
								className="absolute inset-y-0 inset-e-3 my-auto flex items-center text-[#9b9b9d] transition-colors hover:text-foreground"
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
								className="absolute inset-y-0 inset-e-3 my-auto flex items-center text-[#9b9b9d] transition-colors hover:text-foreground"
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
							disabled={isSubmitting || isFormEmpty}
						>
							{isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
						</Button>
					</Field>
				</FieldGroup>
			</form>

			<Button
				variant="outline"
				type="button"
				onClick={handleGoogleSignUp}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
						fill="currentColor"
					/>
				</svg>
				{t("auth.register.continueWithGoogle")}
			</Button>

			<FieldDescription className="px-6 text-center">
				{t("auth.register.legalPrefix")}{" "}
				<Link
					to="/"
					className="text-primary no-underline! hover:underline!"
				>
					{t("auth.register.termsOfService")}
				</Link>{" "}
				{t("auth.register.and")}{" "}
				<Link
					to="/"
					className="text-primary no-underline! hover:underline!"
				>
					{t("auth.register.privacyPolicy")}
				</Link>
				.
			</FieldDescription>

			<p className="text-center text-sm text-muted-foreground">
				{t("auth.register.haveAccount")}{" "}
				<Link
					to="/login"
					className="text-primary"
				>
					{t("auth.register.signIn")}
				</Link>
			</p>
		</div>
	);
}

import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLoginSchema, type LoginFormValues } from "@/features/auth/auth.type";
import { useI18n } from "@/hooks/use-i18n";
import { signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/_auth-layout/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const { t } = useI18n();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(createLoginSchema(t)),
	});

	const onSubmit = async (data: LoginFormValues) => {
		const { error } = await signIn.email({
			email: data.email,
			password: data.password,
		});

		if (error) {
			toast.error(error.message ?? t("auth.login.errors.loginFailed"));
			return;
		}

		navigate({ to: "/dashboard" });
	};

	const handleGoogleSignIn = () => {
		signIn.social({ provider: "google" });
	};

	return (
		<div className="flex flex-col gap-6 max-w-md">
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">أكاديمية سند</h1>
						<p className="text-sm text-muted-foreground">{t("auth.login.subtitle")}</p>
					</div>

					<Button
						variant="outline"
						type="button"
						onClick={handleGoogleSignIn}
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
						{t("auth.login.continueWithGoogle")}
					</Button>

					<FieldSeparator>{t("auth.login.or")}</FieldSeparator>

					<Field data-invalid={!!errors.email}>
						<FieldLabel htmlFor="email">{t("auth.login.email")}</FieldLabel>
						<div className="relative">
							<Input
								id="email"
								type="email"
								placeholder={t("auth.login.emailPlaceholder")}
								aria-invalid={!!errors.email}
								className="ps-9"
								{...register("email")}
							/>
							<IconMail className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-[#9b9b9d]" />
						</div>
						<FieldError errors={[errors.email]} />
					</Field>

					<Field data-invalid={!!errors.password}>
						<div className="flex items-center justify-between">
							<FieldLabel htmlFor="password">{t("auth.login.password")}</FieldLabel>

							<Link
								to="/forget-password"
								className="text-sm text-primary"
							>
								{t("auth.login.forgetPassword")}
							</Link>
						</div>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder={t("auth.login.passwordPlaceholder")}
								aria-invalid={!!errors.password}
								className="ps-9"
								{...register("password")}
							/>
							<IconLock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-[#9b9b9d]" />
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => setShowPassword((v) => !v)}
								className="absolute inset-y-0 end-1 my-auto z-10 text-[#9b9b9d] hover:text-foreground"
								tabIndex={-1}
								aria-label={
									showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")
								}
							>
								{showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
							</Button>
						</div>
						<FieldError errors={[errors.password]} />
					</Field>

					<Field>
						<Button
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className="px-6 text-center">
				{t("auth.login.legalPrefix")}{" "}
				<Link
					to="/"
					className="text-primary no-underline! hover:underline!"
				>
					{t("auth.login.termsOfService")}
				</Link>{" "}
				{t("auth.login.and")}{" "}
				<Link
					to="/"
					className="text-primary no-underline! hover:underline!"
				>
					{t("auth.login.privacyPolicy")}
				</Link>
				.
			</FieldDescription>
			<p className="text-center text-sm text-muted-foreground">
				{t("auth.login.noAccount")}{" "}
				<Link
					to="/register"
					className="text-primary"
				>
					{t("auth.login.signUp")}
				</Link>
			</p>
		</div>
	);
}

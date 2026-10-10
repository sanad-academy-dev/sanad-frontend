import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconEye, IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
	createForgetPasswordEmailSchema,
	createResetPasswordSchema,
	type ForgetPasswordEmailValues,
	type ResetPasswordValues,
} from "@/features/auth/auth.type";
import { useI18n } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth-layout/forget-password")({
	component: RouteComponent,
});

const OTP_RESEND_SECONDS = 120;

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
	return (
		<div className="flex items-center justify-center gap-2">
			{([1, 2, 3] as const).map((s) => (
				<div
					key={s}
					className={cn(
						"h-2.5 rounded-full transition-all duration-300",
						step === s ? "w-7 bg-primary" : "w-2.5 bg-muted-foreground/30",
					)}
				/>
			))}
		</div>
	);
}

function IconWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto flex size-16 items-center justify-center border rounded-2xl bg-muted text-primary">
			{children}
		</div>
	);
}

function RouteComponent() {
	const id = useId();
	const navigate = useNavigate();
	const { t } = useI18n();

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [countdown, setCountdown] = useState(OTP_RESEND_SECONDS);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startCountdown = useCallback(() => {
		if (countdownRef.current) clearInterval(countdownRef.current);

		setCountdown(OTP_RESEND_SECONDS);
		countdownRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (countdownRef.current) clearInterval(countdownRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	useEffect(() => {
		if (step === 2) {
			startCountdown();
		}
		return () => {
			if (countdownRef.current) clearInterval(countdownRef.current);
		};
	}, [step, startCountdown]);

	const emailForm = useForm<ForgetPasswordEmailValues>({
		resolver: zodResolver(createForgetPasswordEmailSchema(t)),
	});

	const passwordForm = useForm<ResetPasswordValues>({
		resolver: zodResolver(createResetPasswordSchema(t)),
	});

	const emailValue = emailForm.watch("email") ?? "";
	const newPassword = passwordForm.watch("password") ?? "";
	const confirmPassword = passwordForm.watch("confirmPassword") ?? "";
	const meetsLength = newPassword.length >= 8;
	const meetsCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
	const meetsNumber = /\d/.test(newPassword);

	const onSendOtp = async (data: ForgetPasswordEmailValues) => {
		const { error } = await authClient.emailOtp.requestPasswordReset({ email: data.email });

		if (error) {
			toast.error(error.message ?? t("auth.forgetPassword.errors.sendFailed"));
			return;
		}

		toast.success(t("auth.forgetPassword.errors.sendSuccess"));
		setEmail(data.email);
		setStep(2);
	};

	const onVerifyOtp = async () => {
		if (otp.length < 6) {
			toast.error(t("auth.forgetPassword.step2.otpInvalid"));
			return;
		}

		setIsVerifying(true);
		const { error } = await authClient.emailOtp.checkVerificationOtp({
			email,
			otp,
			type: "forget-password",
		});
		setIsVerifying(false);

		if (error) {
			toast.error(error.message ?? t("auth.forgetPassword.errors.verifyFailed"));
			return;
		}

		setStep(3);
	};

	const onResetPassword = async (data: ResetPasswordValues) => {
		const { error } = await authClient.emailOtp.resetPassword({
			email,
			otp,
			password: data.password,
		});

		if (error) {
			toast.error(error.message ?? t("auth.forgetPassword.errors.resetFailed"));
			return;
		}

		emailForm.reset();
		passwordForm.reset();
		setEmail("");
		setOtp("");
		setStep(1);
		setCountdown(OTP_RESEND_SECONDS);
		navigate({ to: "/success" });
	};

	const onResendOtp = async () => {
		if (countdown > 0) return;

		const { error } = await authClient.emailOtp.requestPasswordReset({ email });

		if (error) {
			toast.error(error.message ?? t("auth.forgetPassword.errors.sendFailed"));
			return;
		}

		toast.success(t("auth.forgetPassword.errors.sendSuccess"));
		setOtp("");
		startCountdown();
	};

	return (
		<div className="flex flex-col gap-6 max-w-md w-full">
			{step === 1 && (
				<FieldGroup className="gap-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<IconWrapper>
							<IconMail size={28} />
						</IconWrapper>
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-bold">{t("auth.forgetPassword.step1.title")}</h1>
							<p className="text-sm text-muted-foreground">
								{t("auth.forgetPassword.step1.subtitle")}
							</p>
						</div>
					</div>

					<form onSubmit={emailForm.handleSubmit(onSendOtp)}>
						<FieldGroup>
							<Field data-invalid={!!emailForm.formState.errors.email}>
								<FieldLabel htmlFor="fp-email">
									{t("auth.forgetPassword.step1.emailLabel")}
								</FieldLabel>
								<div className="relative">
									<Input
										id="fp-email"
										type="email"
										placeholder={t("auth.forgetPassword.step1.emailPlaceholder")}
										aria-invalid={!!emailForm.formState.errors.email}
										className="ps-9"
										{...emailForm.register("email")}
									/>
									<IconMail className="pointer-events-none absolute inset-y-0 inset-s-3 my-auto size-4 text-[#9b9b9d]" />
								</div>
								<FieldError errors={[emailForm.formState.errors.email]} />
							</Field>

							<Field>
								<Button
									type="submit"
									disabled={emailForm.formState.isSubmitting || !emailValue.trim()}
								>
									{emailForm.formState.isSubmitting
										? t("auth.forgetPassword.step1.submitting")
										: t("auth.forgetPassword.step1.submit")}
								</Button>
							</Field>
						</FieldGroup>
					</form>

					<p className="text-center text-sm text-muted-foreground">
						{t("auth.forgetPassword.step1.rememberPassword")}{" "}
						<Link
							to="/login"
							className="font-semibold text-primary"
						>
							{t("auth.forgetPassword.step1.signIn")}
						</Link>
					</p>

					<StepIndicator step={1} />
				</FieldGroup>
			)}

			{step === 2 && (
				<FieldGroup className="gap-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<IconWrapper>
							<IconMail size={28} />
						</IconWrapper>
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-bold">{t("auth.forgetPassword.step2.title")}</h1>
							<p className="text-sm text-muted-foreground">
								{t("auth.forgetPassword.step2.subtitle")}
							</p>
							<p className="text-sm font-semibold">{email}</p>
						</div>
					</div>

					<Field>
						<div
							className="flex justify-center"
							dir="ltr"
						>
							<InputOTP
								maxLength={6}
								value={otp}
								onChange={setOtp}
							>
								<InputOTPGroup>
									{Array.from({ length: 6 }).map((_, index) => (
										<InputOTPSlot
											key={id}
											id={id}
											index={index}
											className="size-12 text-base"
										/>
									))}
								</InputOTPGroup>
							</InputOTP>
						</div>
					</Field>

					<Field>
						<Button
							type="button"
							disabled={otp.length < 6 || isVerifying}
							onClick={onVerifyOtp}
						>
							{isVerifying
								? t("auth.forgetPassword.step2.submitting")
								: t("auth.forgetPassword.step2.submit")}
						</Button>
					</Field>

					<p className="text-center text-sm text-muted-foreground">
						{t("auth.forgetPassword.step2.noCode")}{" "}
						{countdown > 0 ? (
							<span>
								({countdown} {t("auth.forgetPassword.step2.seconds")})
							</span>
						) : (
							<button
								type="button"
								onClick={onResendOtp}
								className="font-semibold text-primary underline-offset-4 hover:underline"
							>
								{t("auth.forgetPassword.step2.resend")}
							</button>
						)}
					</p>

					<button
						type="button"
						onClick={() => setStep(1)}
						className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<IconArrowLeft
							size={14}
							className="rtl:rotate-180"
						/>
						{t("auth.forgetPassword.step2.changeEmail")}
					</button>

					<StepIndicator step={2} />
				</FieldGroup>
			)}

			{step === 3 && (
				<FieldGroup className="gap-6">
					<div className="flex flex-col items-center gap-4 text-center">
						<IconWrapper>
							<IconLock size={28} />
						</IconWrapper>
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-bold">{t("auth.forgetPassword.step3.title")}</h1>
							<p className="text-sm text-muted-foreground">
								{t("auth.forgetPassword.step3.subtitle")}
							</p>
						</div>
					</div>

					<div className="rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground">
						<p className="mb-2 font-medium text-foreground">
							{t("auth.forgetPassword.step3.requirements")}
						</p>
						<ul className="flex flex-col gap-1.5">
							{[
								{ key: "req8Chars", met: meetsLength },
								{ key: "reqUpperLower", met: meetsCase },
								{ key: "reqNumber", met: meetsNumber },
							].map(({ key, met }) => (
								<li
									key={key}
									className={cn(
										"flex items-center gap-2 transition-colors",
										met ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
									)}
								>
									<span
										className={cn(
											"size-1.5 rounded-full",
											met ? "bg-green-500" : "bg-muted-foreground/40",
										)}
									/>
									{t(`auth.forgetPassword.step3.${key}`)}
								</li>
							))}
						</ul>
					</div>

					<form onSubmit={passwordForm.handleSubmit(onResetPassword)}>
						<FieldGroup>
							<Field data-invalid={!!passwordForm.formState.errors.password}>
								<FieldLabel htmlFor="fp-password">
									{t("auth.forgetPassword.step3.newPasswordLabel")}
								</FieldLabel>
								<div className="relative">
									<Input
										id="fp-password"
										type={showPassword ? "text" : "password"}
										placeholder={t("auth.forgetPassword.step3.newPasswordPlaceholder")}
										aria-invalid={!!passwordForm.formState.errors.password}
										className="pe-9"
										{...passwordForm.register("password")}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => setShowPassword((v) => !v)}
										className="absolute inset-y-0 inset-e-1 my-auto z-10 text-[#9b9b9d] hover:text-foreground"
										tabIndex={-1}
										aria-label={
											showPassword
												? t("auth.forgetPassword.step3.hidePassword")
												: t("auth.forgetPassword.step3.showPassword")
										}
									>
										{showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
									</Button>
								</div>
								<FieldError errors={[passwordForm.formState.errors.password]} />
							</Field>

							<Field data-invalid={!!passwordForm.formState.errors.confirmPassword}>
								<FieldLabel htmlFor="fp-confirm">
									{t("auth.forgetPassword.step3.confirmPasswordLabel")}
								</FieldLabel>
								<div className="relative">
									<Input
										id="fp-confirm"
										type={showConfirm ? "text" : "password"}
										placeholder={t("auth.forgetPassword.step3.confirmPasswordPlaceholder")}
										aria-invalid={!!passwordForm.formState.errors.confirmPassword}
										className="pe-9"
										{...passwordForm.register("confirmPassword")}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => setShowConfirm((v) => !v)}
										className="absolute inset-y-0 inset-e-1 my-auto z-10 text-[#9b9b9d] hover:text-foreground"
										tabIndex={-1}
										aria-label={
											showConfirm
												? t("auth.forgetPassword.step3.hidePassword")
												: t("auth.forgetPassword.step3.showPassword")
										}
									>
										{showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
									</Button>
								</div>
								<FieldError errors={[passwordForm.formState.errors.confirmPassword]} />
							</Field>

							<Field>
								<Button
									type="submit"
									disabled={
										passwordForm.formState.isSubmitting || !newPassword || !confirmPassword
									}
								>
									{passwordForm.formState.isSubmitting
										? t("auth.forgetPassword.step3.submitting")
										: t("auth.forgetPassword.step3.submit")}
								</Button>
							</Field>
						</FieldGroup>
					</form>

					<StepIndicator step={3} />
				</FieldGroup>
			)}
		</div>
	);
}

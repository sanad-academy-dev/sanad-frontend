import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Container, ContainerRow } from "@/components/common/container";
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	type ChangePasswordValues,
	createChangePasswordSchema,
} from "@/features/auth/auth.type";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useI18n } from "@/hooks/use-i18n";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/_pathless-layout/management/settings/security-access")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting, isValid },
	} = useForm<ChangePasswordValues>({
		resolver: zodResolver(createChangePasswordSchema(t)),
		mode: "onChange",
	});

	const newPasswordValue = watch("newPassword", "");

	const onSubmit = async (data: ChangePasswordValues) => {
		toast.promise(
			async () => {
				const { error } = await authClient.changePassword({
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
					revokeOtherSessions: true,
				});
				if (error) throw new Error(error.message ?? "فشل تغيير كلمة المرور");
				reset();
				setOpen(false);
			},
			{
				loading: "جارٍ تغيير كلمة المرور...",
				success: "تم تغيير كلمة المرور بنجاح",
				error: (err) => err?.message ?? "فشل تغيير كلمة المرور",
			},
		);
	};

	return (
		<SettingsPageWrapper>
			<Container
				title="الأمان والوصول"
				description="تخصيص الأمان والوصول للأكاديمية."
			>
				<ContainerRow
					title="كلمة المرور"
					subtitle="غيّر كلمة المرور لحسابك في إيلت فيت"
					action={
						<Dialog
							open={open}
							onOpenChange={(v) => {
								setOpen(v);
								if (!v) reset();
							}}
						>
							<DialogTrigger asChild>
								<Button variant="outline">تغيير كلمة المرور</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md! px-0!">
								<form onSubmit={handleSubmit(onSubmit)}>
									<DialogHeader className="border-b pb-4 px-4">
										<DialogTitle className="px-4">تغيير كلمة المرور</DialogTitle>
									</DialogHeader>

									<div className="border rounded-[4px] px-5 py-4 mt-3 mx-4">
										<p>متطلبات تغيير كلمة المرور:</p>
										<ul className="list-disc list-inside">
											<li>يحتوي على حرف واحد على الأقل من الأحرف الكبيرة والصغيرة</li>
											<li>يحتوي على رقم واحد على الأقل</li>
											<li>يحتوي على رمز واحد على الأقل</li>
										</ul>
									</div>

									<FieldGroup className="mt-4 px-4">
										<Field data-invalid={!!errors.currentPassword}>
											<FieldLabel htmlFor="currentPassword">كلمة المرور الحالية</FieldLabel>
											<div className="relative">
												<Input
													id="currentPassword"
													type={showCurrent ? "text" : "password"}
													placeholder="ادخل كلمة المرور الحالية"
													aria-invalid={!!errors.currentPassword}
													className="pe-9"
													{...register("currentPassword")}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => setShowCurrent((v) => !v)}
													className="absolute inset-y-0 end-1 my-auto z-10 text-muted-foreground hover:text-foreground"
													tabIndex={-1}
												>
													{showCurrent ? <IconEyeOff size={16} /> : <IconEye size={16} />}
												</Button>
											</div>
											<FieldError errors={[errors.currentPassword]} />
										</Field>

										<Field data-invalid={!!errors.newPassword}>
											<FieldLabel htmlFor="newPassword">كلمة المرور الجديدة</FieldLabel>
											<div className="relative">
												<Input
													id="newPassword"
													type={showNew ? "text" : "password"}
													placeholder="ادخل كلمة المرور الجديدة"
													aria-invalid={!!errors.newPassword}
													className="pe-9"
													{...register("newPassword")}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => setShowNew((v) => !v)}
													className="absolute inset-y-0 end-1 my-auto z-10 text-muted-foreground hover:text-foreground"
													tabIndex={-1}
												>
													{showNew ? <IconEyeOff size={16} /> : <IconEye size={16} />}
												</Button>
											</div>
											<PasswordStrengthIndicator
												password={newPasswordValue}
												label="قوة كلمة المرور"
												labels={{
													weak: "ضعيفة",
													fair: "مقبولة",
													good: "جيدة",
													strong: "قوية",
												}}
											/>
											<FieldError errors={[errors.newPassword]} />
										</Field>

										<Field data-invalid={!!errors.confirmPassword}>
											<FieldLabel htmlFor="confirmPassword">
												تأكيد كلمة المرور الجديدة
											</FieldLabel>
											<div className="relative">
												<Input
													id="confirmPassword"
													type={showConfirm ? "text" : "password"}
													placeholder="ادخل كلمة المرور الجديدة مرة أخرى"
													aria-invalid={!!errors.confirmPassword}
													className="pe-9"
													{...register("confirmPassword")}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => setShowConfirm((v) => !v)}
													className="absolute inset-y-0 end-1 my-auto z-10 text-muted-foreground hover:text-foreground"
													tabIndex={-1}
												>
													{showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
												</Button>
											</div>
											<FieldError errors={[errors.confirmPassword]} />
										</Field>
									</FieldGroup>

									<DialogFooter className="mt-4 px-4 w-full mx-auto">
										<DialogClose asChild>
											<Button
												type="button"
												variant="outline"
											>
												إلغاء
											</Button>
										</DialogClose>
										<Button
											type="submit"
											disabled={isSubmitting || !isValid}
										>
											{isSubmitting ? "جارٍ التغيير..." : "تغيير كلمة المرور"}
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					}
				/>
			</Container>
		</SettingsPageWrapper>
	);
}

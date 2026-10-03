import { IconAlertTriangle, IconCheck, IconCopy, IconDeviceMobile } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useIssuePortalPassword,
	usePortalStatus,
} from "@/features/services/owners/hooks/use-portal-password";
import type { OwnerResponse } from "@/server/owners/owners.type";

/**
 * [PP1] كلمة مرور تطبيق وليّ الأمر.
 *
 * ── لماذا نافذة لا حقل في الشاشة ─────────────────────────────────────────
 *
 * كلمة المرور تُعرض **مرّة واحدة**، لحظة توليدها. المخزَّن تجزئتها لا هي، فلا يمكن
 * استرجاعها لاحقًا — وهذا مقصود لا نقص: كلمةٌ يستطيع أي موظّف فتح الشاشة ورؤيتها متى
 * شاء ليست سرًّا بين وليّ الأمر والنظام، وتُفرغ «غيّر كلمة المرور» من معناها.
 *
 * ولذلك النافذة تُصرّح بذلك قبل التوليد وبعده، ولا تُغلق بنقرة خارجها: إغلاقٌ عرَضي
 * يعني إصدار كلمة ثانية وإبطال التي في يد وليّ الأمر للتوّ.
 */
export const PortalPasswordDialog = ({
	owner,
	open,
	onOpenChange,
}: {
	owner: OwnerResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { data: status } = usePortalStatus(owner?.id ?? null, open);
	const issue = useIssuePortalPassword();
	const [password, setPassword] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	// كل فتحة جديدة تبدأ نظيفة: كلمة مرور وليّ أمرٍ سابق يجب ألّا تظهر لوليّ أمر آخر.
	useEffect(() => {
		if (!open) {
			setPassword(null);
			setCopied(false);
			issue.reset();
		}
	}, [open, issue]);

	if (!owner) return null;

	const generate = () =>
		issue.mutate(owner.id, {
			onSuccess: (data) => setPassword(data.password),
		});

	const copy = async () => {
		if (!password) return;
		await navigator.clipboard.writeText(password);
		setCopied(true);
		toast.success("نُسخت كلمة المرور");
	};

	const hasAccount = status?.hasAccount ?? false;
	const invalidPhone = status && "reason" in status && status.reason === "INVALID_PHONE";

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="max-w-md"
				// إغلاقٌ عرَضي بنقرة خارج النافذة يُضيّع كلمة مرور لا تُسترجَع.
				onInteractOutside={(event) => password && event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<IconDeviceMobile className="size-5 text-muted-foreground" />
						تطبيق وليّ الأمر
					</DialogTitle>
					<DialogDescription>
						{owner.name} — {owner.phone}
					</DialogDescription>
				</DialogHeader>

				{invalidPhone ? (
					<div className="flex items-start gap-2 rounded border border-destructive/30 bg-destructive/5 p-3 text-sm">
						<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
						<p className="text-muted-foreground">
							رقم جوّال هذا وليّ الأمر غير صالح، ورقم الجوّال هو ما يسجّل به الدخول. صحّح الرقم في
							بياناته أوّلًا.
						</p>
					</div>
				) : password ? (
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-sm text-muted-foreground">كلمة المرور</span>
							{/*
							 * `dir="ltr"` و`font-mono`: الكلمة لاتينية وتُقرأ حرفًا حرفًا على
							 * الهاتف. تركها ترث اتجاه الصفحة يقلب ترتيب المجموعتين.
							 */}
							<div
								dir="ltr"
								className="flex items-center justify-between gap-2 rounded border bg-muted/40 px-3 py-2"
							>
								<code className="font-mono text-lg font-bold tracking-widest">{password}</code>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => void copy()}
								>
									{copied ? (
										<IconCheck className="size-4 text-emerald-600" />
									) : (
										<IconCopy className="size-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="flex items-start gap-2 rounded border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
							<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
							<p className="text-muted-foreground">
								اقرأها على وليّ الأمر الآن —{" "}
								<strong className="text-foreground">لن تظهر مرّة أخرى</strong>. يُطلب منه تغييرها
								عند أوّل دخول.
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-3 text-sm text-muted-foreground">
						<p>
							{hasAccount
								? "لهذا وليّ الأمر حساب في التطبيق. إنشاء كلمة جديدة يُبطل القديمة ويُخرجه من كل أجهزته."
								: "أنشئ كلمة مرور ليدخل بها وليّ الأمر إلى التطبيق برقم جوّاله."}
						</p>
						{hasAccount && status ? (
							<dl className="grid grid-cols-2 gap-y-1 rounded border bg-muted/30 p-3 text-xs">
								<dt>آخر دخول</dt>
								<dd className="text-foreground">
									{status.lastSignInAt
										? new Date(status.lastSignInAt).toLocaleDateString("ar-SA")
										: "لم يدخل بعد"}
								</dd>
								<dt>الأكاديميات المرتبطة</dt>
								<dd className="text-foreground">{status.linkedClinics}</dd>
								<dt>الأجهزة النشطة</dt>
								<dd className="text-foreground">{status.activeDevices}</dd>
							</dl>
						) : null}
					</div>
				)}

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
					>
						{password ? "تم" : "إغلاق"}
					</Button>
					{!password && !invalidPhone ? (
						<Button
							size="sm"
							disabled={issue.isPending}
							onClick={generate}
						>
							{issue.isPending
								? "جارٍ الإنشاء..."
								: hasAccount
									? "إنشاء كلمة مرور جديدة"
									: "إنشاء كلمة مرور"}
						</Button>
					) : null}
				</div>

				{issue.isError ? (
					<p className="px-4 pb-3 text-sm text-destructive">{issue.error.message}</p>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

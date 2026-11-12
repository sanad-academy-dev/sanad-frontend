import { useEffect, useId, useRef, useState } from "react";
import {
	IconBrandWhatsapp,
	IconCheck,
	IconCopy,
	IconExternalLink,
	IconEye,
	IconFileText,
	IconLoader2,
	IconSend,
	IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { cn } from "@/lib/utils";
import {
	useDigitalRegistrationCapabilities,
	usePrepareRegistrationContract,
} from "../../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	generateServiceAgreementMessage,
	getPublicContractUrl,
} from "../../utils/ai-templates";
import { resolveContractAcademyName } from "../print/service-agreement-print-document";
import {
	RegistrationDrawerGuardianCard,
	RegistrationDrawerHeader,
} from "./registration-drawer-header";

interface SendContractDrawerProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	isExpanded?: boolean;
	onOpenPreviewModal?: () => void;
	onSuccess?: () => void;
	onRequestUpdate?: (updated: Partial<CampaignRequestItem> & { id: string }) => void;
}

export function SendContractDrawer({
	request,
	open,
	onOpenChange,
	campaignId = "",
	isExpanded = false,
	onOpenPreviewModal,
	onSuccess,
	onRequestUpdate,
}: SendContractDrawerProps) {
	const baseId = useId();
	const { clinicInfo } = useClinicInfo();
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const prepareMutation = usePrepareRegistrationContract(campaignId);

	const [messageText, setMessageText] = useState("");
	const [includeMessage, setIncludeMessage] = useState(true);
	const [notifyEmail, setNotifyEmail] = useState(false);
	const [messageError, setMessageError] = useState<string | null>(null);
	const [messageEditedManually, setMessageEditedManually] = useState(false);
	const [draftTokenState, setDraftTokenState] = useState<{ requestId: string; token: string } | null>(
		null,
	);

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const messageTextareaRef = useRef<HTMLTextAreaElement>(null);
	const autoPrepareRef = useRef<string | null>(null);

	const activeToken =
		request?.contractToken ||
		(draftTokenState && draftTokenState.requestId === request?.id ? draftTokenState.token : null);
	const contractUrl = activeToken ? getPublicContractUrl(activeToken) : "";
	const hasGuardianEmail = Boolean(request?.guardianEmail?.trim());

	// تجهيز رمز العقد كمسودة إن لم يكن موجوداً بعد ليظهر الرابط الحقيقي داخل اللوحة فوراً
	useEffect(() => {
		if (!open || !request) {
			autoPrepareRef.current = null;
			return;
		}
		if (activeToken || request.contractStatus === "APPROVED" || !capabilities.canEdit) return;
		if (autoPrepareRef.current === request.id) return;

		autoPrepareRef.current = request.id;
		prepareMutation.mutate(
			{ requestId: request.id, data: { sendToGuardian: false } },
			{
				onSuccess: (res: any) => {
					if (res?.contractToken) {
						setDraftTokenState({ requestId: request.id, token: res.contractToken });
						onRequestUpdate?.({
							id: request.id,
							contractToken: res.contractToken,
							contractTokenExpiresAt: res.expiresAt,
							contractData: res.contractData,
						});
					}
				},
			},
		);
	}, [open, request?.id, activeToken, capabilities.canEdit]);

	const academyDisplayName = resolveContractAcademyName(clinicInfo?.name);

	// تهيئة الحقول عند فتح اللوحة
	useEffect(() => {
		if (!open || !request) return;
		const studentName = request.patientName || request.name || "الطالب";
		const code = request.code || request.id;
		setIncludeMessage(true);
		setNotifyEmail(Boolean(request.guardianEmail?.trim()));
		setMessageEditedManually(false);
		setMessageError(null);
		setMessageText(
			generateServiceAgreementMessage({
				studentName,
				guardianName: request.guardianName,
				academyName: academyDisplayName,
				planName: request.subscriptionPlanName,
				code,
				contractToken: request.contractToken,
			}),
		);
	}, [open, request?.id, academyDisplayName]);

	// تحديث نص الرسالة التلقائي بمجرد وصول الرابط ما لم يعدّل الموظف يدوياً
	useEffect(() => {
		if (!open || !request || !activeToken || messageEditedManually) return;
		setMessageText(
			generateServiceAgreementMessage({
				studentName: request.patientName || request.name || "الطالب",
				guardianName: request.guardianName,
				academyName: academyDisplayName,
				planName: request.subscriptionPlanName,
				code: request.code || request.id,
				contractToken: activeToken,
				contractUrl,
			}),
		);
	}, [open, activeToken, messageEditedManually, academyDisplayName]);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !prepareMutation.isPending) {
				onOpenChange(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onOpenChange, prepareMutation.isPending]);

	const handleDrawerWheel = (e: React.WheelEvent<HTMLElement>) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === "TEXTAREA") return;
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	if (!open || !request) return null;

	const studentName = request.patientName || request.name || "الطالب";
	const cleanPhone = (request.guardianPhone || "").replace(/\D/g, "");
	const canOpenWhatsApp = cleanPhone.length >= 8;

	const handleGenerateAI = () => {
		setMessageEditedManually(false);
		setMessageError(null);
		setMessageText(
			generateServiceAgreementMessage({
				studentName,
				guardianName: request.guardianName,
				academyName: academyDisplayName,
				planName: request.subscriptionPlanName,
				code: request.code || request.id,
				contractToken: activeToken,
				contractUrl,
			}),
		);
		toast.success("تمت صياغة الرسالة بنجاح");
	};

	const activateLinkForGuardian = () => {
		if (!request || !capabilities.canEdit) return;
		if (request.contractStatus && request.contractStatus !== "NOT_SENT") return;
		if (prepareMutation.isPending) return;
		prepareMutation.mutate(
			{
				requestId: request.id,
				data: {
					representativeName: request.contractData?.representativeName ?? null,
					showStamp: request.contractData?.showStamp ?? true,
					programStartDate: request.contractData?.programStartDate ?? null,
					programEndDate: request.contractData?.programEndDate ?? null,
					includeMedicalDeclaration: request.contractData?.includeMedicalDeclaration ?? true,
					additionalTerms: request.contractData?.additionalTerms ?? null,
					sendToGuardian: true,
					notifyEmail: false,
					contractUrl: contractUrl || undefined,
				},
			},
			{
				onSuccess: (res: any) => {
					onRequestUpdate?.({
						id: request.id,
						contractToken: res.contractToken ?? activeToken,
						contractTokenExpiresAt: res.expiresAt ?? request.contractTokenExpiresAt,
						contractData: res.contractData ?? request.contractData,
						contractStatus: res.contractStatus || "AWAITING_UPLOAD",
						contractIssuedAt: new Date().toISOString(),
					});
				},
			},
		);
	};

	const handleOpenWhatsApp = () => {
		if (!canOpenWhatsApp) {
			toast.error("رقم هاتف ولي الأمر غير مكتمل لفتح واتساب");
			return;
		}
		activateLinkForGuardian();
		const textToSend =
			messageText.trim() ||
			generateServiceAgreementMessage({
				studentName,
				guardianName: request.guardianName,
				academyName: academyDisplayName,
				planName: request.subscriptionPlanName,
				code: request.code || request.id,
				contractToken: activeToken,
				contractUrl,
			});
		window.open(
			`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!capabilities.canEdit) return;
		if (request.contractStatus === "APPROVED") {
			toast.error("تم اعتماد النموذج الموقّع وإقفاله نهائياً بالفعل");
			return;
		}

		const cleanMessage = messageText.trim();

		if (includeMessage && !cleanMessage) {
			setMessageError("يرجى كتابة نص الرسالة أو إلغاء تفعيل خيار التضمين");
			messageTextareaRef.current?.focus();
			return;
		}

		prepareMutation.mutate(
			{
				requestId: request.id,
				data: {
					representativeName: request.contractData?.representativeName ?? null,
					showStamp: request.contractData?.showStamp ?? true,
					programStartDate: request.contractData?.programStartDate ?? null,
					programEndDate: request.contractData?.programEndDate ?? null,
					includeMedicalDeclaration: request.contractData?.includeMedicalDeclaration ?? true,
					additionalTerms: request.contractData?.additionalTerms ?? null,
					sendToGuardian: true,
					customMessage: includeMessage ? cleanMessage : undefined,
					notifyEmail: hasGuardianEmail ? notifyEmail : false,
					contractUrl: contractUrl || undefined,
				},
			},
			{
				onSuccess: (res: any) => {
					toast.success("تم إصدار وتجهيز رابط نموذج تقديم الخدمة وإدراجه للإرسال");
					onRequestUpdate?.({
						id: request.id,
						contractToken: res.contractToken ?? activeToken,
						contractTokenExpiresAt: res.expiresAt ?? request.contractTokenExpiresAt,
						contractData: res.contractData ?? request.contractData,
						contractStatus: res.contractStatus || "AWAITING_UPLOAD",
						contractIssuedAt: new Date().toISOString(),
					});
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "تعذر إرسال نموذج تقديم الخدمة");
				},
			},
		);
	};

	return (
		<aside
			data-slot="send-contract-drawer"
			onWheel={handleDrawerWheel}
			className={cn(
				"fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!",
			)}
			dir="rtl"
		>
			{/* 1. رأس اللوحة */}
			<RegistrationDrawerHeader
				title="قبول طالب • نموذج الخدمة"
				patientName={studentName}
				code={request.code}
				onClose={() => !prepareMutation.isPending && onOpenChange(false)}
			/>

			<form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
				{/* 2. المحتوى القابل للتمرير */}
				<div
					ref={scrollContainerRef}
					className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
					style={{ touchAction: "pan-y" }}
				>
					{/* بطاقة ولي الأمر */}
					<RegistrationDrawerGuardianCard
						guardianName={request.guardianName}
						guardianPhone={request.guardianPhone}
						guardianEmail={request.guardianEmail}
						patientName={studentName}
					/>

					{/* كارت مستند نموذج تقديم الخدمة (كلاسيكي مثل الصورة 1) */}
					<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex items-center justify-between gap-2.5 shadow-2xs">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="size-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
								<IconFileText className="size-4.5 text-zinc-700 dark:text-zinc-300" />
							</div>
							<div className="min-w-0">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{studentName} - نموذج تقديم خدمة.pdf
								</p>
								<p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
									وثيقة A4 رسمية قابلة للطباعة والتوقيع اليدوي
								</p>
							</div>
						</div>

						{onOpenPreviewModal && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									onOpenChange(false);
									onOpenPreviewModal();
								}}
								className="h-7.5 px-2.5 text-[11px] gap-1 shrink-0 cursor-pointer"
							>
								<IconEye className="size-3.5" />
								<span>معاينة</span>
							</Button>
						)}
					</div>

					{/* بطاقة رابط البوابة لولي الأمر (صلاحية 14 يوماً) */}
					<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3 space-y-2">
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
								رابط البوابة الآمن لرفع التوقيع
							</span>
							<span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
								صلاحية 14 يوماً
							</span>
						</div>

						{contractUrl ? (
							<>
								<div
									className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-300 truncate select-all"
									dir="ltr"
								>
									{contractUrl}
								</div>
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											activateLinkForGuardian();
											navigator.clipboard.writeText(contractUrl);
											toast.success("تم نسخ وتفعيل رابط نموذج تقديم الخدمة بنجاح");
										}}
										className="h-7.5 flex-1 text-xs gap-1.5 bg-white dark:bg-zinc-900 cursor-pointer"
									>
										<IconCopy className="size-3.5" />
										<span>نسخ الرابط</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											activateLinkForGuardian();
											window.open(contractUrl, "_blank", "noopener,noreferrer");
										}}
										className="h-7.5 px-2.5 text-xs gap-1 bg-white dark:bg-zinc-900 cursor-pointer"
										aria-label="فتح بوابة النموذج في نافذة جديدة"
									>
										<IconExternalLink className="size-3.5" />
									</Button>
									{canOpenWhatsApp && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleOpenWhatsApp}
											className="h-7.5 px-2.5 text-xs gap-1 bg-white dark:bg-zinc-900 cursor-pointer"
											aria-label="فتح محادثة واتساب لولي الأمر"
										>
											<IconBrandWhatsapp className="size-3.5 text-emerald-600" />
										</Button>
									)}
								</div>
							</>
						) : (
							<div className="flex items-center gap-2 text-[11px] text-zinc-500 py-1">
								<IconLoader2 className="size-3.5 animate-spin" />
								<span>جاري تجهيز الرابط المشفر...</span>
							</div>
						)}
					</div>

					{/* سويتش تضمين رسالة لولي الأمر مطابق لباقي اللوحات */}
					<div className="space-y-2 pt-1">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-0.5">
								<label
									htmlFor={`${baseId}-enable-msg`}
									className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
								>
									تضمين رسالة لولي الأمر
								</label>
								<span className="text-[10px] text-muted-foreground">
									{includeMessage ? "سيتم حفظ الرسالة وإرفاقها بالإشعار" : "لن يتم إرسال نص رسالة إضافي"}
								</span>
							</div>
							<Switch
								id={`${baseId}-enable-msg`}
								checked={includeMessage}
								onCheckedChange={(enabled) => {
									setIncludeMessage(enabled);
									if (!enabled) setMessageError(null);
								}}
							/>
						</div>
					</div>

					{/* نص الرسالة */}
					{includeMessage && (
						<div className="space-y-1.5">
							<div className="flex items-center justify-between gap-2">
								<label
									htmlFor={`${baseId}-message`}
									className="text-xs font-bold text-zinc-800 dark:text-zinc-200"
								>
									نص رسالة <span className="text-rose-600 font-bold">*</span>
								</label>
								<button
									type="button"
									onClick={handleGenerateAI}
									className="text-[11px] font-semibold text-[#4f6ae0] hover:underline flex items-center gap-1 cursor-pointer"
								>
									<IconSparkles className="size-3.5" />
									<span>إنشاء تلقائي للرسالة</span>
								</button>
							</div>
							<Textarea
								ref={messageTextareaRef}
								id={`${baseId}-message`}
								value={messageText}
								onChange={(e) => {
									setMessageEditedManually(true);
									setMessageText(e.target.value);
									if (messageError) setMessageError(null);
								}}
								aria-invalid={Boolean(messageError)}
								aria-describedby={messageError ? `${baseId}-message-err` : undefined}
								className="min-h-40 text-xs leading-relaxed resize-y bg-white dark:bg-zinc-900"
							/>
							{messageError && (
								<p id={`${baseId}-message-err`} role="alert" className="text-[11px] text-rose-600 font-medium">
									{messageError}
								</p>
							)}
						</div>
					)}
				</div>

				{/* 3. الفوتر */}
				<div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 shrink-0">
					<div className="flex items-center gap-2 min-w-0">
						<Switch
							id={`${baseId}-notify-email`}
							checked={hasGuardianEmail && notifyEmail}
							disabled={!hasGuardianEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor={`${baseId}-notify-email`}
							className={cn(
								"text-[11px] font-medium truncate",
								hasGuardianEmail
									? "text-zinc-700 dark:text-zinc-300 cursor-pointer"
									: "text-zinc-400 dark:text-zinc-500 cursor-not-allowed",
							)}
							title={hasGuardianEmail ? request.guardianEmail || "" : "لا يوجد بريد إلكتروني مسجل لولي الأمر"}
						>
							{hasGuardianEmail ? "إشعار عبر البريد" : "لا يوجد بريد مسجل"}
						</label>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={prepareMutation.isPending}
							onClick={() => onOpenChange(false)}
							className="h-8.5 px-4 text-xs cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={prepareMutation.isPending || !capabilities.canEdit}
							className="h-8.5 px-4 gap-1.5 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white cursor-pointer"
						>
							{prepareMutation.isPending ? (
								<IconLoader2 className="size-3.5 animate-spin" />
							) : request.contractStatus === "AWAITING_UPLOAD" ? (
								<IconCheck className="size-3.5" />
							) : (
								<IconSend className="size-3.5" />
							)}
							<span>{prepareMutation.isPending ? "جاري الإرسال..." : "إرسال"}</span>
						</Button>
					</div>
				</div>
			</form>
		</aside>
	);
}

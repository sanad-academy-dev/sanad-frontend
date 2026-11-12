import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	IconCheck,
	IconDownload,
	IconEye,
	IconFileCheck,
	IconFileText,
	IconLoader2,
	IconLock,
	IconPrinter,
	IconSend,
	IconUpload,
	IconX,
	IconZoomIn,
	IconZoomOut,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { backendFetch } from "@/lib/backend-fetch";
import { cn } from "@/lib/utils";
import {
	useDigitalRegistrationCapabilities,
	usePrepareRegistrationContract,
	useRecordInPersonContract,
	useReviewSignedContract,
} from "../../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { printServiceAgreementDocument } from "../../utils/service-agreement-print";
import {
	buildLiveContractSnapshot,
	getContractStatusMeta,
	resolveRepresentativeName,
	ServiceAgreementPrintDocument,
	type ContractFormConfig,
} from "./service-agreement-print-document";

interface ServiceAgreementModalProps {
	request: CampaignRequestItem | null;
	campaignId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onProceedToSend?: () => void;
	onRequestUpdate?: (updated: Partial<CampaignRequestItem> & { id: string }) => void;
}

function defaultFormConfig(request: CampaignRequestItem | null): ContractFormConfig {
	const existing = request?.contractData;
	return {
		representativeName: resolveRepresentativeName(
			existing?.representativeName,
			request?.reviewerName,
			request?.assignedStaff?.name,
		),
		showStamp: existing?.showStamp ?? true,
		programStartDate:
			existing?.programStartDate ||
			(request?.paidAt ? String(request.paidAt).slice(0, 10) : ""),
		programEndDate: existing?.programEndDate || "",
		includeMedicalDeclaration: existing?.includeMedicalDeclaration ?? true,
		additionalTerms: existing?.additionalTerms || "",
	};
}

export function ServiceAgreementModal({
	request,
	campaignId = "",
	open,
	onOpenChange,
	onProceedToSend,
	onRequestUpdate,
}: ServiceAgreementModalProps) {
	const baseId = useId();
	const { clinicInfo } = useClinicInfo();
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const prepareMutation = usePrepareRegistrationContract(campaignId);
	const reviewMutation = useReviewSignedContract(campaignId);
	const inPersonMutation = useRecordInPersonContract(campaignId);

	const [zoomLevel, setZoomLevel] = useState<number>(90);
	const [config, setConfig] = useState<ContractFormConfig>(() => defaultFormConfig(request));

	// حالة مراجعة النسخة المرفوعة (طلب إعادة رفع مع سبب إلزامي)
	const [showRejectBox, setShowRejectBox] = useState(false);
	const [rejectNotes, setRejectNotes] = useState("");
	const [rejectNotesError, setRejectNotesError] = useState<string | null>(null);
	const rejectTextareaRef = useRef<HTMLTextAreaElement>(null);

	// حالة التوقيع الحضوري بالمقر
	const [showInPersonBox, setShowInPersonBox] = useState(false);
	const [inPersonNotes, setInPersonNotes] = useState("");
	const [inPersonUploading, setInPersonUploading] = useState(false);
	const inPersonFileInputRef = useRef<HTMLInputElement>(null);
	const [downloadingFile, setDownloadingFile] = useState(false);

	useEffect(() => {
		if (!open || !request) return;
		setConfig(defaultFormConfig(request));
		setShowRejectBox(false);
		setRejectNotes("");
		setRejectNotesError(null);
		setShowInPersonBox(false);
		setInPersonNotes("");
	}, [open, request?.id, request?.contractStatus]);

	const snapshot = useMemo(() => {
		if (!request) return null;
		return buildLiveContractSnapshot({ request, clinicInfo, config });
	}, [request, clinicInfo, config]);

	if (!request || !snapshot) return null;

	const contractStatus = request.contractStatus || "NOT_SENT";
	const statusMeta = getContractStatusMeta(contractStatus);
	const isApproved = contractStatus === "APPROVED";
	const isPendingReview = contractStatus === "PENDING_REVIEW";
	const isRejectedReupload = contractStatus === "REJECTED_REUPLOAD";
	const isEditable = capabilities.canEdit && !isApproved;

	const handlePrint = () => {
		printServiceAgreementDocument({
			snapshot,
			contractStatus,
			reviewedBy: request.contractReviewedBy,
			reviewedAt: request.contractReviewedAt,
		});
	};

	const handleOpenSignedFile = async (download = false) => {
		setDownloadingFile(true);
		try {
			const res = await backendFetch(`/api/digital-registration/requests/${request.id}/contract/file`);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "تعذر فتح ملف النموذج الموقّع");
			}
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			if (download) {
				const a = document.createElement("a");
				a.href = blobUrl;
				a.download = request.contractSignedFileName || `${request.patientName || "contract"}-signed.pdf`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			} else {
				window.open(blobUrl, "_blank", "noopener,noreferrer");
			}
			window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "تعذر تحميل الملف الموقّع");
		} finally {
			setDownloadingFile(false);
		}
	};

	const buildPreparePayload = (sendToGuardian: boolean) => ({
		representativeName: config.representativeName.trim() || null,
		showStamp: config.showStamp,
		programStartDate: config.programStartDate.trim() || null,
		programEndDate: config.programEndDate.trim() || null,
		includeMedicalDeclaration: config.includeMedicalDeclaration,
		additionalTerms: config.additionalTerms.trim() || null,
		sendToGuardian,
	});

	const handleSaveAndProceedToSend = () => {
		if (!isEditable) return;
		prepareMutation.mutate(
			{ requestId: request.id, data: buildPreparePayload(false) },
			{
				onSuccess: (res: any) => {
					onRequestUpdate?.({
						id: request.id,
						contractToken: res.contractToken ?? request.contractToken,
						contractTokenExpiresAt: res.expiresAt ?? request.contractTokenExpiresAt,
						contractData: res.contractData ?? snapshot,
						contractStatus: res.contractStatus ?? contractStatus,
					});
					onOpenChange(false);
					onProceedToSend?.();
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "تعذر تجهيز النموذج للإرسال");
				},
			},
		);
	};

	const handleApproveSigned = () => {
		if (!isEditable || !isPendingReview) return;
		reviewMutation.mutate(
			{ requestId: request.id, decision: "APPROVE" },
			{
				onSuccess: (res: any) => {
					toast.success("تم اعتماد نموذج تقديم الخدمة الموقّع وحفظه رسمياً");
					onRequestUpdate?.({
						id: request.id,
						contractStatus: res.contractStatus || "APPROVED",
						contractReviewedAt: res.reviewedAt || new Date().toISOString(),
					});
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "تعذر اعتماد النموذج");
				},
			},
		);
	};

	const handleRequestReupload = (e: React.FormEvent) => {
		e.preventDefault();
		const cleanReason = rejectNotes.trim();
		if (!cleanReason) {
			setRejectNotesError("يرجى توضيح سبب طلب إعادة الرفع ليتمكن ولي الأمر من تصحيحه");
			rejectTextareaRef.current?.focus();
			return;
		}
		reviewMutation.mutate(
			{ requestId: request.id, decision: "REJECT_REUPLOAD", notes: cleanReason },
			{
				onSuccess: (res: any) => {
					toast.success("تم إرسال طلب إعادة رفع النموذج لولي الأمر");
					setShowRejectBox(false);
					setRejectNotes("");
					setRejectNotesError(null);
					onRequestUpdate?.({
						id: request.id,
						contractStatus: res.contractStatus || "REJECTED_REUPLOAD",
						contractReviewedAt: res.reviewedAt,
						contractReviewNotes: cleanReason,
					});
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : "تعذر إرسال طلب إعادة الرفع");
				},
			},
		);
	};

	const handleInPersonUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file || !isEditable) return;

		setInPersonUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const upRes = await backendFetch("/api/uploads/direct", {
				method: "POST",
				body: formData,
			});
			if (!upRes.ok) {
				const err = await upRes.json().catch(() => ({}));
				throw new Error(err.message || "فشل رفع ملف النموذج الموقّع");
			}
			const uploadData = await upRes.json();
			if (!uploadData.key) throw new Error("لم يُرجع الخادم مسار الملف");
			const fileUrl =
				uploadData.key.startsWith("/") || uploadData.key.startsWith("http")
					? uploadData.key
					: `/api/uploads/serve?key=${encodeURIComponent(uploadData.key)}`;

			const sizeLabel =
				file.size >= 1024 * 1024
					? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
					: `${Math.max(1, Math.round(file.size / 1024))} KB`;

			await inPersonMutation.mutateAsync({
				requestId: request.id,
				data: {
					fileUrl,
					fileName: file.name,
					fileSize: sizeLabel,
					mimeType: file.type || null,
					representativeName: config.representativeName.trim() || null,
					showStamp: config.showStamp,
					programStartDate: config.programStartDate.trim() || null,
					programEndDate: config.programEndDate.trim() || null,
					includeMedicalDeclaration: config.includeMedicalDeclaration,
					additionalTerms: config.additionalTerms.trim() || null,
					notes: inPersonNotes.trim() || null,
				},
			});

			toast.success("تم توثيق استلام النموذج الموقّع حضورياً واعتماده");
			setShowInPersonBox(false);
			onRequestUpdate?.({
				id: request.id,
				contractStatus: "APPROVED",
				contractSignedFileUrl: fileUrl,
				contractSignedFileName: file.name,
				contractReviewedAt: new Date().toISOString(),
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "تعذر توثيق الاستلام الحضوري");
		} finally {
			setInPersonUploading(false);
		}
	};

	const isBusy =
		prepareMutation.isPending || reviewMutation.isPending || inPersonMutation.isPending || inPersonUploading;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					className="w-[95vw] sm:max-w-[1160px] h-[92vh] max-h-[92vh] !flex !flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl z-[9999]"
					dir="rtl"
					showCloseButton={false}
				>
					<DialogTitle className="sr-only">
						نموذج تقديم الخدمة التعليمية للطالب {request.patientName || request.name}
					</DialogTitle>

					{/* 1. الشريط العلوي الكلاسيكي */}
					<div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center shrink-0">
								<IconFileText className="size-4" />
							</div>
							<div className="min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
										نموذج تقديم الخدمة التعليمية
									</h2>
									<Badge variant="outline" className={cn("text-[10.5px] font-semibold px-2 py-0", statusMeta.badgeClass)}>
										{statusMeta.label}
									</Badge>
								</div>
								<p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
									{request.patientName || request.name} •{" "}
									<span className="font-mono" dir="ltr">
										#{request.code}
									</span>
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							{/* أزرار التقريب والتصغير */}
							<div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700 text-xs">
								<button
									type="button"
									onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
									className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
									aria-label="تصغير المعاينة"
								>
									<IconZoomOut className="size-3.5" />
								</button>
								<span className="text-[10.5px] font-mono px-1.5 text-zinc-600 dark:text-zinc-300">
									{zoomLevel}%
								</span>
								<button
									type="button"
									onClick={() => setZoomLevel((z) => Math.min(z + 10, 125))}
									className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
									aria-label="تكبير المعاينة"
								>
									<IconZoomIn className="size-3.5" />
								</button>
							</div>

							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePrint}
								className="h-8 gap-1.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 cursor-pointer"
							>
								<IconPrinter className="size-3.5" />
								<span>طباعة / PDF</span>
							</Button>

							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="size-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
								aria-label="إغلاق نافذة النموذج"
							>
								<IconX className="size-4" />
							</button>
						</div>
					</div>

					{/* 2. الجسم الرئيسي (لوحة التحكم يميناً + ورقة A4 يساراً) */}
					<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
						{/* العمود الجانبي: حالة التوقيع وضبط البيانات */}
						<div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto overscroll-contain p-4 space-y-4">
							{/* حالة الاعتماد النهائي (مقفلة) */}
							{isApproved && (
								<div className="rounded-lg border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 space-y-2.5">
									<div className="flex items-start gap-2">
										<IconLock className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
										<div className="text-xs">
											<p className="font-bold text-emerald-900 dark:text-emerald-200">
												النموذج معتمد ومقفل نهائياً
											</p>
											<p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
												تم تثبيت بيانات الاتفاقية وحفظ النسخة الموقّعة في مستندات الطلب وملف الطالب.
											</p>
											{request.contractReviewedBy && (
												<p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 mt-1">
													المعتمد: <strong>{request.contractReviewedBy}</strong>
												</p>
											)}
										</div>
									</div>
									{request.contractSignedFileUrl && (
										<div className="flex items-center gap-2 pt-1">
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={downloadingFile}
												onClick={() => handleOpenSignedFile(false)}
												className="h-8 flex-1 text-xs gap-1.5 bg-white dark:bg-zinc-900 cursor-pointer"
											>
												{downloadingFile ? <IconLoader2 className="size-3.5 animate-spin" /> : <IconEye className="size-3.5" />}
												<span>معاينة الموقّع</span>
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={downloadingFile}
												onClick={() => handleOpenSignedFile(true)}
												className="h-8 text-xs gap-1.5 bg-white dark:bg-zinc-900 cursor-pointer"
											>
												<IconDownload className="size-3.5" />
												<span>تحميل</span>
											</Button>
										</div>
									)}
								</div>
							)}

							{/* لوحة مراجعة النسخة المرفوعة من ولي الأمر */}
							{isPendingReview && (
								<div className="rounded-lg border border-amber-200 dark:border-amber-800/70 bg-amber-50/60 dark:bg-amber-950/25 p-3 space-y-3">
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0">
											<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
												نسخة موقّعة بانتظار المراجعة
											</p>
											<p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
												{request.contractSignedFileName || "ملف النموذج الموقّع"}
												{request.contractSignedFileSize ? ` • ${request.contractSignedFileSize}` : ""}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={downloadingFile}
											onClick={() => handleOpenSignedFile(false)}
											className="h-8 flex-1 text-xs gap-1.5 bg-white dark:bg-zinc-900 cursor-pointer"
										>
											{downloadingFile ? <IconLoader2 className="size-3.5 animate-spin" /> : <IconEye className="size-3.5" />}
											<span>معاينة الملف</span>
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={downloadingFile}
											onClick={() => handleOpenSignedFile(true)}
											className="h-8 text-xs gap-1.5 bg-white dark:bg-zinc-900 cursor-pointer"
										>
											<IconDownload className="size-3.5" />
										</Button>
									</div>

									{capabilities.canEdit && (
										<div className="space-y-2 pt-1 border-t border-amber-200/70 dark:border-amber-800/50">
											<div className="flex items-center gap-2">
												<Button
													type="button"
													size="sm"
													disabled={isBusy}
													onClick={handleApproveSigned}
													className="h-8 flex-1 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white cursor-pointer"
												>
													{reviewMutation.isPending ? (
														<IconLoader2 className="size-3.5 animate-spin" />
													) : (
														<IconCheck className="size-3.5" />
													)}
													<span>اعتماد النموذج الموقّع</span>
												</Button>
												<Button
													type="button"
													variant="outline"
													size="sm"
													disabled={isBusy}
													onClick={() => setShowRejectBox((v) => !v)}
													className="h-8 text-xs text-rose-700 border-rose-200 hover:bg-rose-50 dark:text-rose-300 dark:border-rose-800/70 cursor-pointer"
												>
													طلب إعادة رفع
												</Button>
											</div>

											{showRejectBox && (
												<form onSubmit={handleRequestReupload} className="space-y-2 pt-1">
													<label
														htmlFor={`${baseId}-reject-reason`}
														className="block text-[11px] font-semibold text-zinc-800 dark:text-zinc-200"
													>
														سبب طلب إعادة الرفع <span className="text-rose-600">*</span>
													</label>
													<Textarea
														ref={rejectTextareaRef}
														id={`${baseId}-reject-reason`}
														value={rejectNotes}
														onChange={(e) => {
															setRejectNotes(e.target.value);
															if (rejectNotesError) setRejectNotesError(null);
														}}
														aria-invalid={Boolean(rejectNotesError)}
														aria-describedby={rejectNotesError ? `${baseId}-reject-err` : undefined}
														placeholder="مثال: التوقيع غير واضح أو الصفحة الأخيرة غير مكتملة"
														className="min-h-20 text-xs resize-none bg-white dark:bg-zinc-900"
													/>
													{rejectNotesError && (
														<p id={`${baseId}-reject-err`} role="alert" className="text-[11px] text-rose-600 font-medium">
															{rejectNotesError}
														</p>
													)}
													<div className="flex items-center justify-end gap-1.5">
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => {
																setShowRejectBox(false);
																setRejectNotesError(null);
															}}
															className="h-7 text-xs cursor-pointer"
														>
															إلغاء
														</Button>
														<Button
															type="submit"
															size="sm"
															disabled={reviewMutation.isPending}
															className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
														>
															تأكيد وإرسال لولي الأمر
														</Button>
													</div>
												</form>
											)}
										</div>
									)}
								</div>
							)}

							{/* تنبيه طلب إعادة الرفع السابق */}
							{isRejectedReupload && request.contractReviewNotes && (
								<div className="rounded-lg border border-rose-200 dark:border-rose-800/70 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-xs space-y-1">
									<p className="font-bold text-rose-800 dark:text-rose-200">
										سبب طلب إعادة الرفع المرسل لولي الأمر:
									</p>
									<p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
										{request.contractReviewNotes}
									</p>
								</div>
							)}

							{/* ضبط بيانات النموذج (البيانات الحقيقية فقط) */}
							<div className="space-y-3">
								<div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
									<h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
										بيانات وضبط الوثيقة
									</h3>
									<span className="text-[10.5px] text-zinc-400">بيانات الطالب والباقة تلقائية</span>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor={`${baseId}-rep`}
										className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
									>
										ممثل الأكاديمية (الطرف الأول)
									</label>
									<Input
										id={`${baseId}-rep`}
										value={config.representativeName}
										disabled={!isEditable}
										onChange={(e) => setConfig((prev) => ({ ...prev, representativeName: e.target.value }))}
										placeholder="اسم ممثل الأكاديمية"
										className="h-8.5 text-xs"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2.5">
									<div className="space-y-1.5">
										<label
											htmlFor={`${baseId}-start`}
											className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
										>
											تاريخ بدء البرنامج
										</label>
										<Input
											id={`${baseId}-start`}
											type="date"
											dir="ltr"
											disabled={!isEditable}
											value={config.programStartDate}
											onChange={(e) => setConfig((prev) => ({ ...prev, programStartDate: e.target.value }))}
											className="h-8.5 text-xs font-mono"
										/>
									</div>
									<div className="space-y-1.5">
										<label
											htmlFor={`${baseId}-end`}
											className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
										>
											تاريخ انتهاء البرنامج
										</label>
										<Input
											id={`${baseId}-end`}
											type="date"
											dir="ltr"
											disabled={!isEditable}
											value={config.programEndDate}
											onChange={(e) => setConfig((prev) => ({ ...prev, programEndDate: e.target.value }))}
											className="h-8.5 text-xs font-mono"
										/>
									</div>
								</div>

								<div className="space-y-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/60 dark:bg-zinc-900/40">
									<div className="flex items-center justify-between gap-2">
										<label
											htmlFor={`${baseId}-stamp`}
											className="text-[11.5px] font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
										>
											إظهار الختم الرسمي للأكاديمية
										</label>
										<Switch
											id={`${baseId}-stamp`}
											disabled={!isEditable}
											checked={config.showStamp}
											onCheckedChange={(v) => setConfig((prev) => ({ ...prev, showStamp: v }))}
										/>
									</div>
									<div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-200/70 dark:border-zinc-800">
										<label
											htmlFor={`${baseId}-medical`}
											className="text-[11.5px] font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer"
										>
											تضمين الإقرار الصحي والحساسية
										</label>
										<Switch
											id={`${baseId}-medical`}
											disabled={!isEditable}
											checked={config.includeMedicalDeclaration}
											onCheckedChange={(v) =>
												setConfig((prev) => ({ ...prev, includeMedicalDeclaration: v }))
											}
										/>
									</div>
								</div>

								<div className="space-y-1.5">
									<label
										htmlFor={`${baseId}-terms`}
										className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
									>
										بنود أو ملاحظات إضافية (اختياري)
									</label>
									<Textarea
										id={`${baseId}-terms`}
										disabled={!isEditable}
										value={config.additionalTerms}
										onChange={(e) => setConfig((prev) => ({ ...prev, additionalTerms: e.target.value }))}
										placeholder="أضف أي شروط خاصة بهذه الحالة إن وجدت..."
										className="min-h-20 text-xs resize-none"
									/>
								</div>
							</div>

							{/* مسار التوقيع الحضوري بالمقر */}
							{isEditable && (
								<div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
									<button
										type="button"
										onClick={() => setShowInPersonBox((v) => !v)}
										aria-expanded={showInPersonBox}
										className="w-full flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 py-1 cursor-pointer"
									>
										<span className="flex items-center gap-1.5">
											<IconFileCheck className="size-4 text-zinc-500" />
											<span>توثيق توقيع حضوري في مقر الأكاديمية</span>
										</span>
										<span className="text-[10.5px] text-zinc-500">
											{showInPersonBox ? "إخفاء" : "رفع نسخة ورقية"}
										</span>
									</button>

									{showInPersonBox && (
										<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3 space-y-2.5">
											<p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
												في حال وقّع ولي الأمر العقد الورقي مباشرة داخل المقر، ارفع النسخة الممسوحة
												ضوئياً وسيتم اعتمادها وإقفالها فوراً.
											</p>
											<div className="space-y-1">
												<label
													htmlFor={`${baseId}-inperson-notes`}
													className="block text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
												>
													ملاحظة الاستلام (اختياري)
												</label>
												<Input
													id={`${baseId}-inperson-notes`}
													value={inPersonNotes}
													onChange={(e) => setInPersonNotes(e.target.value)}
													placeholder="مثال: استُلمت من ولي الأمر بمقر الاستقبال"
													className="h-8 text-xs bg-white dark:bg-zinc-900"
												/>
											</div>
											<input
												ref={inPersonFileInputRef}
												type="file"
												accept=".pdf,image/jpeg,image/png,image/webp"
												onChange={handleInPersonUploadFile}
												className="hidden"
											/>
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={isBusy}
												onClick={() => inPersonFileInputRef.current?.click()}
												className="w-full h-8.5 gap-1.5 text-xs font-semibold bg-white dark:bg-zinc-900 cursor-pointer"
											>
												{inPersonUploading || inPersonMutation.isPending ? (
													<IconLoader2 className="size-3.5 animate-spin" />
												) : (
													<IconUpload className="size-3.5" />
												)}
												<span>اختيار ورفع النسخة الموقّعة حضورياً</span>
											</Button>
										</div>
									)}
								</div>
							)}
						</div>

						{/* العمود الرئيسي: معاينة ورقة A4 الكلاسيكية */}
						<div className="lg:col-span-8 overflow-auto overscroll-contain bg-zinc-100/90 dark:bg-zinc-950 p-4 sm:p-6 flex justify-center items-start">
							<div
								style={{
									transform: `scale(${zoomLevel / 100})`,
									transformOrigin: "top center",
									transition: "transform 0.15s ease",
								}}
								className="bg-white text-zinc-900 shadow-lg border border-zinc-200 rounded-sm max-w-[210mm] w-full h-fit"
							>
								<ServiceAgreementPrintDocument
									snapshot={snapshot}
									contractStatus={contractStatus}
									reviewedBy={request.contractReviewedBy}
									reviewedAt={request.contractReviewedAt}
								/>
							</div>
						</div>
					</div>

					{/* 3. الفوتر */}
					<div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
						<div className="text-[11px] text-zinc-500 dark:text-zinc-400">
							{!capabilities.canEdit
								? "وضع العرض فقط — لا تملك صلاحية تعديل أو اعتماد النموذج"
								: isApproved
									? "الوصول لتعديل الاتفاقية مغلق بعد الاعتماد النهائي"
									: "راجع البيانات أو اطبع الوثيقة ثم اضغط للمتابعة وإرسال الرابط لولي الأمر"}
						</div>

						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onOpenChange(false)}
								className="h-8 text-xs cursor-pointer"
							>
								إغلاق
							</Button>
							{isEditable && (
								<Button
									type="button"
									size="sm"
									disabled={isBusy}
									onClick={handleSaveAndProceedToSend}
									className="h-8 gap-1.5 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white cursor-pointer"
								>
									{prepareMutation.isPending ? (
										<IconLoader2 className="size-3.5 animate-spin" />
									) : (
										<IconSend className="size-3.5" />
									)}
									<span>متابعة وإرسال لولي الأمر</span>
								</Button>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

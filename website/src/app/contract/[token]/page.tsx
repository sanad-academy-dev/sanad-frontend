"use client";

import { use, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Clock,
	Download,
	FileCheck2,
	FileText,
	Loader2,
	MessageCircle,
	Phone,
	Printer,
	ShieldCheck,
	Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractDocumentSheet } from "./components/contract-document-sheet";
import type { PublicContractViewData } from "./types";
import {
	downloadPublicContractPdf,
	printPublicContractDocument,
} from "./utils/contract-print";

function ContractPrintDownloadActions({
	onPrint,
	onDownload,
	isDownloading,
	printVariant = "default",
}: {
	onPrint: () => void;
	onDownload: () => void;
	isDownloading: boolean;
	printVariant?: "default" | "outline";
}) {
	return (
		<div className="flex flex-wrap items-center gap-2.5 shrink-0">
			<Button
				type="button"
				variant={printVariant}
				size="lg"
				onClick={onPrint}
				className="min-h-[44px] px-4"
			>
				<Printer className="h-4 w-4 shrink-0" />
				<span>طباعة النموذج</span>
			</Button>

			<Button
				type="button"
				variant="outline"
				size="lg"
				disabled={isDownloading}
				onClick={onDownload}
				className="min-h-[44px] px-4"
			>
				{isDownloading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin shrink-0" />
						<span>جاري تحضير PDF...</span>
					</>
				) : (
					<>
						<Download className="h-4 w-4 shrink-0" />
						<span>تحميل النموذج</span>
					</>
				)}
			</Button>
		</div>
	);
}

function formatShortDateTime(value?: string | null): string {
	if (!value) return "";
	try {
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return value;
		return new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Africa/Cairo",
		}).format(d);
	} catch {
		return value;
	}
}

export default function ContractPortalPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const resolvedParams = use(params);
	const token = resolvedParams.token;
	const baseId = useId();

	const [data, setData] = useState<PublicContractViewData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	// حالة رفع النسخة الموقّعة
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
	const [submitNotice, setSubmitNotice] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const fetchContractData = async (silent = false) => {
		try {
			if (!silent) setIsLoading(true);
			setError(null);

			const res = await fetch(`/api/contract/${encodeURIComponent(token)}`, {
				cache: "no-store",
			});
			const json = await res.json().catch(() => null);
			if (!res.ok || !json) {
				throw new Error(json?.message || "رابط نموذج تقديم الخدمة غير صالح أو غير موجود");
			}
			setData(json as PublicContractViewData);
		} catch (err: any) {
			if (!silent) {
				setError(err?.message || "تعذر تحميل بيانات نموذج تقديم الخدمة");
			}
		} finally {
			if (!silent) setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!token) return;
		void fetchContractData(false);
	}, [token]);

	const handlePrint = () => {
		if (!data) return;
		printPublicContractDocument(data.contract, data.contractStatus);
	};

	const handleDownloadPdf = async () => {
		if (!data || isDownloadingPdf) return;
		setIsDownloadingPdf(true);
		try {
			await downloadPublicContractPdf(data.contract, data.contractStatus);
		} finally {
			setIsDownloadingPdf(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setUploadError(null);
		setSubmitNotice(null);
		if (!file) {
			setSelectedFile(null);
			return;
		}
		if (file.size > 15 * 1024 * 1024) {
			setSelectedFile(null);
			setUploadError("حجم الملف يتجاوز الحد الأقصى المسموح به (15 ميجابايت).");
			return;
		}
		setSelectedFile(file);
	};

	const handleSubmitSigned = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!data) return;

		if (!selectedFile) {
			setUploadError("يرجى اختيار ملف النسخة الموقّعة (PDF أو صورة واضحة) قبل الإرسال.");
			fileInputRef.current?.focus();
			return;
		}

		setIsSubmitting(true);
		setUploadError(null);
		setSubmitNotice(null);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);

			const upRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});
			const upJson = await upRes.json().catch(() => null);
			if (!upRes.ok || !upJson) {
				throw new Error(upJson?.message || "تعذر رفع الملف إلى خادم الأكاديمية");
			}

			const fileUrl = upJson.fileUrl || upJson.url || upJson.key || "";
			if (!fileUrl) {
				throw new Error("لم يُرجع الخادم رابط الملف المرفوع");
			}

			const sizeLabel =
				selectedFile.size >= 1024 * 1024
					? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
					: `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`;

			const subRes = await fetch(`/api/contract/${encodeURIComponent(token)}/submit`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileUrl,
					fileName: selectedFile.name,
					fileSize: sizeLabel,
					mimeType: selectedFile.type || undefined,
				}),
			});
			const subJson = await subRes.json().catch(() => null);
			if (!subRes.ok) {
				throw new Error(subJson?.message || "تعذر إرسال النسخة الموقّعة للمراجعة");
			}

			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
			setSubmitNotice("تم استلام النسخة الموقّعة بنجاح، وهي الآن قيد مراجعة واعتماد إدارة الأكاديمية.");
			await fetchContractData(true);
		} catch (err: any) {
			setUploadError(err?.message || "حدث خطأ أثناء رفع النموذج الموقّع؛ يرجى المحاولة مرة أخرى.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const status = data?.contractStatus;
	const isExpired = status === "EXPIRED";
	const isCancelled = status === "CANCELLED";
	const isApproved = status === "APPROVED";
	const isPendingReview = status === "PENDING_REVIEW";
	const isRejectedReupload = status === "REJECTED_REUPLOAD";
	const isNotSent = status === "NOT_SENT";
	const canUpload = Boolean(
		data && (status === "AWAITING_UPLOAD" || status === "REJECTED_REUPLOAD"),
	);

	const headerBadge = isApproved
		? "وثيقة معتمدة وموثّقة رسمياً"
		: isPendingReview
			? "تم الاستلام وبانتظار المراجعة"
			: isRejectedReupload
				? "يرجى إعادة رفع نسخة واضحة"
				: isExpired || isCancelled
					? "الرابط غير نشط حالياً"
					: "بوابة التوقيع اليدوي الرسمية";

	const headerTitle = isApproved
		? "نموذج تقديم الخدمة التعليمية (معتمد)"
		: isPendingReview
			? "تم استلام النسخة الموقّعة بنجاح"
			: isExpired
				? "انتهت مهلة صلاحية الرابط"
				: isCancelled
					? "تعذر الوصول إلى النموذج"
					: "نموذج تقديم الخدمة التعليمية";

	const clinicPhone = data?.clinic?.phone || "+201000000000";
	const cleanWhatsappPhone = clinicPhone.replace(/\D/g, "");
	const renewalWhatsappUrl = data
		? `https://wa.me/${cleanWhatsappPhone}?text=${encodeURIComponent(
				`السلام عليكم، أرجو تجديد رابط نموذج تقديم الخدمة التعليمية للطالب: ${data.contract.student.name} (طلب رقم #${data.code})`,
		  )}`
		: "#";

	return (
		<>
			<div
				className="w-full flex-1 bg-muted/25 pt-20 pb-28 sm:pt-24 sm:pb-16 px-4 sm:px-6"
				dir="rtl"
				style={{ fontFamily: "var(--font-thmanyah), ui-sans-serif, system-ui, sans-serif" }}
			>
				<div className="mx-auto max-w-[820px] min-w-0 space-y-6">
					{/* 1. ترويسة الصفحة */}
					<header className="text-center space-y-2.5">
						<div className="inline-flex items-center justify-center">
							<span
								className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
									isApproved
										? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
										: isRejectedReupload || isExpired || isCancelled
											? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
											: "bg-zinc-200/70 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
								}`}
							>
								<ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
								<span>{headerBadge}</span>
							</span>
						</div>

						<h1 className="text-xl font-bold text-foreground sm:text-2xl text-balance">
							{headerTitle}
						</h1>

						<p className="text-xs text-muted-foreground sm:text-sm max-w-xl mx-auto leading-relaxed">
							{isApproved
								? "تمت مراجعة التوقيع اليدوي واعتماد الوثيقة وحفظها في ملف الطالب الرسمي لدى الأكاديمية."
								: isPendingReview
									? "يقوم فريق القبول والتسجيل الآن بمراجعة التوقيع المرفق؛ سيتم إشعاركم فور الاعتماد."
									: isExpired
										? "انتهت صلاحية هذا الرابط؛ يمكنكم التواصل مع إدارة الأكاديمية لإصدار رابط محدث."
										: isNotSent
											? "النموذج قيد الإعداد لدى إدارة الأكاديمية؛ سيتم تفعيل الرفع فور إرساله رسمياً."
											: "يرجى مراجعة البيانات وطباعة النموذج أدناه ثم التوقيع يدوياً وإعادة رفع النسخة الموقّعة."}
						</p>
					</header>

					{/* 2. حالة التحميل */}
					{isLoading && (
						<div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
							<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
							<p className="mt-3 text-xs font-semibold text-muted-foreground">
								جاري التحقق من الرابط واسترجاع نموذج تقديم الخدمة...
							</p>
						</div>
					)}

					{/* 3. حالة الخطأ العام أو رابط غير صالح */}
					{!isLoading && error && (
						<div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
							<AlertCircle className="mx-auto h-10 w-10 text-red-500" />
							<h2 className="mt-3 text-base font-bold text-foreground">تعذر العثور على النموذج</h2>
							<p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
							<div className="mt-5">
								<Link
									href="/"
									className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground"
								>
									<span>العودة للصفحة الرئيسية</span>
									<ArrowLeft className="h-3.5 w-3.5 shrink-0" />
								</Link>
							</div>
						</div>
					)}

					{/* 4. انتهاء الصلاحية أو الإلغاء */}
					{!isLoading && !error && data && (isExpired || isCancelled) && (
						<div className="space-y-5 text-center">
							<div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-7">
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
									<Clock className="h-7 w-7" />
								</div>
								<h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">
									{isExpired ? "انتهت صلاحية رابط التوقيع" : "هذا النموذج غير متاح حالياً"}
								</h2>
								<p className="mt-2 text-xs text-muted-foreground sm:text-sm max-w-md mx-auto leading-relaxed">
									عزيزي ولي أمر الطالب{" "}
									<strong className="text-foreground">{data.contract.student.name}</strong>، يرجى
									التواصل مع إدارة القبول والتسجيل في{" "}
									<strong className="text-foreground">{data.clinic.name}</strong> لتجديد رابط رفع
									النموذج.
								</p>
							</div>

							<div className="rounded-3xl border border-border/80 bg-card p-6 text-right space-y-4">
								<h3 className="text-sm font-bold text-foreground">التواصل مع الأكاديمية</h3>
								<div className="flex flex-col gap-3 sm:flex-row">
									<a
										href={renewalWhatsappUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
									>
										<MessageCircle className="h-4 w-4 shrink-0" />
										<span>طلب تجديد الرابط عبر واتساب</span>
									</a>
									<a
										href={`tel:${clinicPhone}`}
										className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs font-bold text-foreground hover:bg-muted/70 transition-colors"
									>
										<Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
										<span>الاتصال بالأكاديمية</span>
									</a>
								</div>
							</div>
						</div>
					)}

					{/* 5. العرض الفعلي للوثيقة والحالات النشطة */}
					{!isLoading && !error && data && !isExpired && !isCancelled && (
						<>
							{/* شريط تنبيه حالة المعاينة قبل الإرسال الرسمي */}
							{isNotSent && (
								<div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div className="space-y-1 text-xs">
										<p className="font-bold text-foreground">
											وضع المعاينة — لم يتم تفعيل الرفع لولي الأمر بعد
										</p>
										<p className="text-muted-foreground">
											يمكنك طباعة الوثيقة الآن للمراجعة؛ ولتفعيل نموذج رفع التوقيع لولي الأمر اضغط «إرسال» من لوحة التحكم.
										</p>
									</div>
									<ContractPrintDownloadActions
										onPrint={handlePrint}
										onDownload={handleDownloadPdf}
										isDownloading={isDownloadingPdf}
									/>
								</div>
							)}

							{/* شريط تنبيه إعادة الرفع إن وُجد */}
							{isRejectedReupload && (
								<div
									role="alert"
									className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 flex items-start gap-3"
								>
									<AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
									<div className="text-xs space-y-1">
										<p className="font-bold text-foreground">
											تطلب إدارة الأكاديمية إعادة رفع نسخة أوضح من النموذج الموقّع:
										</p>
										<p className="text-muted-foreground leading-relaxed">
											{data.reviewNotes || "يرجى التأكد من وضوح جميع الصفحات والتوقيع اليدوي ثم إعادة الرفع."}
										</p>
									</div>
								</div>
							)}

							{/* شريط تأكيد الإرسال أو حالة قيد المراجعة */}
							{(isPendingReview || submitNotice) && (
								<div
									role="status"
									className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
								>
									<div className="flex items-start gap-3">
										<FileCheck2 className="h-5 w-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
										<div className="text-xs space-y-1">
											<p className="font-bold text-foreground">
												{submitNotice || "تم رفع النسخة الموقّعة وهي قيد مراجعة واعتماد الإدارة"}
											</p>
											{data.signedFileName && (
												<p className="text-muted-foreground">
													الملف المرفق: <strong className="text-foreground">{data.signedFileName}</strong>
													{data.signedFileSize ? ` (${data.signedFileSize})` : ""}
													{data.uploadedAt ? (
														<>
															{" • "}
															<bdi dir="ltr" className="font-mono">
																{formatShortDateTime(data.uploadedAt)}
															</bdi>
														</>
													) : null}
												</p>
											)}
										</div>
									</div>

									<ContractPrintDownloadActions
										onPrint={handlePrint}
										onDownload={handleDownloadPdf}
										isDownloading={isDownloadingPdf}
									/>
								</div>
							)}

							{/* شارة الاعتماد النهائي */}
							{isApproved && (
								<div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div className="flex items-start gap-3">
										<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
										<div className="text-xs space-y-1">
											<p className="font-bold text-foreground">
												تم اعتماد نموذج تقديم الخدمة التعليمية وإقفاله رسمياً
											</p>
											{data.reviewedAt && (
												<p className="text-muted-foreground">
													تاريخ الاعتماد:{" "}
													<bdi dir="ltr" className="font-mono font-semibold text-foreground">
														{formatShortDateTime(data.reviewedAt)}
													</bdi>
												</p>
											)}
										</div>
									</div>

									<ContractPrintDownloadActions
										onPrint={handlePrint}
										onDownload={handleDownloadPdf}
										isDownloading={isDownloadingPdf}
									/>
								</div>
							)}

							{/* شريط الخطوات المختصر + زر الطباعة عندما يكون الرفع مفعّلاً */}
							{canUpload && (
								<div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-4">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
										<div className="space-y-1">
											<h2 className="text-sm font-bold text-foreground">
												خطوات إتمام وتوثيق نموذج الخدمة
											</h2>
											{data.expiresAt && (
												<p className="text-[11px] text-muted-foreground">
													الرابط صالح حتى:{" "}
													<bdi dir="ltr" className="font-mono font-semibold text-foreground">
														{formatShortDateTime(data.expiresAt)}
													</bdi>
												</p>
											)}
										</div>

										<ContractPrintDownloadActions
											onPrint={handlePrint}
											onDownload={handleDownloadPdf}
											isDownloading={isDownloadingPdf}
										/>
									</div>

									<ol className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
										<li className="rounded-xl bg-muted/35 border border-border/60 p-3 space-y-1">
											<span className="inline-flex items-center justify-center size-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold">
												1
											</span>
											<p className="font-bold text-foreground">طباعة أو تحميل النموذج</p>
											<p className="text-[11px] text-muted-foreground">
												اضغط «طباعة النموذج» للطباعة الورقية أو «تحميل النموذج» لحفظ ملف PDF مباشرة.
											</p>
										</li>
										<li className="rounded-xl bg-muted/35 border border-border/60 p-3 space-y-1">
											<span className="inline-flex items-center justify-center size-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold">
												2
											</span>
											<p className="font-bold text-foreground">التوقيع اليدوي</p>
											<p className="text-[11px] text-muted-foreground">
												وقّع يدوياً في خانة الطرف الثاني (ولي الأمر) أسفل الوثيقة.
											</p>
										</li>
										<li className="rounded-xl bg-muted/35 border border-border/60 p-3 space-y-1">
											<span className="inline-flex items-center justify-center size-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold">
												3
											</span>
											<p className="font-bold text-foreground">رفع النسخة الموقّعة</p>
											<p className="text-[11px] text-muted-foreground">
												ارفع ملف PDF أو صورة واضحة في النموذج أسفل الصفحة.
											</p>
										</li>
									</ol>
								</div>
							)}

							{/* المعاينة الكلاسيكية الكاملة لوثيقة نموذج تقديم الخدمة */}
							<ContractDocumentSheet
								contract={data.contract}
								contractStatus={data.contractStatus}
							/>

							{/* صندوق رفع النسخة الموقّعة */}
							{canUpload && (
								<form
									onSubmit={handleSubmitSigned}
									className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4"
								>
									<div className="space-y-1">
										<h2 className="text-sm font-bold text-foreground">
											رفع نسخة نموذج تقديم الخدمة الموقّعة يدوياً
										</h2>
										<p className="text-xs text-muted-foreground">
											الصيغ المدعومة: PDF أو صور واضحة (JPG, PNG, WEBP) بحد أقصى 15 ميجابايت.
										</p>
									</div>

									<div>
										<label
											htmlFor={`${baseId}-signed-file`}
											className="flex min-h-[112px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/25 p-5 text-center hover:bg-muted/45 transition-colors"
										>
											<Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
											{selectedFile ? (
												<div className="space-y-1">
													<p className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
														<FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
														<span>{selectedFile.name}</span>
													</p>
													<p className="text-[11px] text-muted-foreground">
														{(selectedFile.size / 1024).toFixed(1)} KB — اضغط لاختيار ملف آخر
													</p>
												</div>
											) : (
												<div className="space-y-1">
													<p className="text-xs font-bold text-foreground">
														اضغط هنا لاختيار الملف الموقّع من جهازك
													</p>
													<p className="text-[11px] text-muted-foreground">
														PDF / JPG / PNG / WEBP
													</p>
												</div>
											)}
										</label>
										<input
											ref={fileInputRef}
											id={`${baseId}-signed-file`}
											type="file"
											accept=".pdf,image/jpeg,image/png,image/webp"
											onChange={handleFileChange}
											aria-invalid={Boolean(uploadError)}
											aria-describedby={uploadError ? `${baseId}-upload-err` : undefined}
											className="sr-only"
										/>
									</div>

									{uploadError && (
										<div
											id={`${baseId}-upload-err`}
											role="alert"
											className="rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400"
										>
											{uploadError}
										</div>
									)}

									<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
										<ContractPrintDownloadActions
											onPrint={handlePrint}
											onDownload={handleDownloadPdf}
											isDownloading={isDownloadingPdf}
											printVariant="outline"
										/>

										<Button
											type="submit"
											variant="default"
											size="lg"
											disabled={isSubmitting}
											className="min-h-[44px] px-6"
										>
											{isSubmitting ? (
												<>
													<Loader2 className="h-4 w-4 animate-spin shrink-0" />
													<span>جاري رفع وإرسال النسخة...</span>
												</>
											) : (
												<>
													<Upload className="h-4 w-4 shrink-0" />
													<span>إرسال النسخة الموقّعة للمراجعة</span>
												</>
											)}
										</Button>
									</div>
								</form>
							)}
						</>
					)}
				</div>
			</div>

			{/* بوابة الطباعة المعزولة لورقة A4 النظيفة */}
			{isMounted &&
				data &&
				!isExpired &&
				!isCancelled &&
				createPortal(
					<div id="website-contract-print-root">
						<ContractDocumentSheet
							contract={data.contract}
							contractStatus={data.contractStatus}
							isPrintPortal
						/>
					</div>,
					document.body,
				)}
		</>
	);
}

import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCircleCheckFilled,
	IconDeviceTablet,
	IconPrinter,
	IconScan,
	IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { SignaturePad } from "@/components/common/signature-pad";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ConsentBlockFields } from "@/features/services/consents/components/consent-block-fields";
import { ConsentOwnerSigning } from "@/features/services/consents/components/consent-owner-signing";
import {
	useConsent,
	useConsentPrices,
	useDraftConsentField,
	useExtractConsentScan,
	usePatientConsentMutations,
} from "@/features/services/consents/hooks/use-patient-consents";
import { printConsent } from "@/features/services/consents/utils/print-consent";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { ConsentLocale, ConsentStatus, SignatureMethod } from "@/generated/prisma/enums";
import {
	missingRequiredChoices,
	missingRequiredFields,
} from "@sanad/contracts/runtime/server/patient-consents/consent-render.service";
import type { ConsentBlock } from "@/server/patient-consents/consent-template.type";
import {
	CONSENT_LOCALE_LABELS,
	CONSENT_STATUS_LABELS,
	type ConsentFieldValues,
	isConsentEditable,
	type SignConsentFormInput,
	signConsentSchema,
} from "@sanad/contracts/runtime/server/patient-consents/patient-consents.type";

const SIGNATURE_METHOD_LABELS: Record<SignatureMethod, string> = {
	DRAWN: "توقيع مرسوم",
	TYPED: "اسم مكتوب",
	UPLOADED: "مستند مرفوع",
	VERBAL_WITNESSED: "شفهية بشاهد",
};

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });

export const ConsentSheet = ({
	consentId,
	patientId,
	open,
	onOpenChange,
}: {
	consentId: string | null;
	patientId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { consent, isLoading } = useConsent(consentId ?? undefined);
	const mutations = usePatientConsentMutations(patientId);
	const { staff } = useStaff();
	const { draftField, isPending: draftPending } = useDraftConsentField();
	const { extractScan, isPending: scanPending } = useExtractConsentScan();
	const { prices } = useConsentPrices();

	const [values, setValues] = useState<ConsentFieldValues>({});
	const [locale, setLocale] = useState<ConsentLocale>(ConsentLocale.AR);
	const [signing, setSigning] = useState(false);
	const [revoking, setRevoking] = useState(false);
	const [revokeReason, setRevokeReason] = useState("");

	const [aiFieldKey, setAiFieldKey] = useState<string | null>(null);
	const [ownerSigning, setOwnerSigning] = useState(false);

	// نموذج التوقيع — التحقق من المخطّط نفسه الذي يحرسه الخادم، فلا تُكتب
	// قاعدة «الرسم يتطلب صورة» مرّتين ثم تفترقان
	const signForm = useForm<SignConsentFormInput>({
		resolver: zodResolver(signConsentSchema),
		defaultValues: {
			signerName: "",
			signerRelationship: "وليّ الأمر",
			signatureMethod: SignatureMethod.DRAWN,
			signatureUrl: null,
			witnessStaffId: null,
		},
	});
	const method = signForm.watch("signatureMethod");

	// القيم المحمّلة من الخادم هي مصدر الحقيقة عند فتح موافقة أخرى
	useEffect(() => {
		if (!consent) return;
		setValues((consent.fieldValues ?? {}) as ConsentFieldValues);
		setLocale(consent.locale);
		setSigning(false);
		setRevoking(false);
		signForm.reset({
			signerName: consent.owner?.name ?? "",
			signerRelationship: "وليّ الأمر",
			signatureMethod: SignatureMethod.DRAWN,
			signatureUrl: null,
			witnessStaffId: null,
		});
	}, [consent, signForm]);

	const blocks = useMemo<ConsentBlock[]>(
		() => (consent?.template?.blocks ?? []) as unknown as ConsentBlock[],
		[consent?.template?.blocks],
	);

	// ما جاء من السجل عند الإنشاء — يُعلَّم ليراجَع لا ليُعاد إدخاله
	const autofilledKeys = useMemo(
		() => new Set(Object.keys((consent?.fieldValues ?? {}) as ConsentFieldValues)),
		[consent?.fieldValues],
	);

	// نفس قاعدة الخادم — لا يُسلَّم الجهاز لوليّ أمر على نموذج ناقص
	const missing = useMemo(() => {
		if (!consent?.template) return [] as string[];
		const template = {
			key: consent.template.key,
			type: consent.type,
			titleAr: consent.template.titleAr,
			titleEn: consent.template.titleEn,
			defaultLocale: consent.template.defaultLocale,
			blocks,
		};
		return [
			...missingRequiredFields(template, values).map((f) => f.labelAr),
			...missingRequiredChoices(template, values).map((c) => c.labelAr),
		];
	}, [consent?.template, consent?.type, blocks, values]);

	const editable = consent ? isConsentEditable(consent.status) : false;
	const signed = consent?.status === ConsentStatus.SIGNED;
	const revoked = consent?.status === ConsentStatus.REVOKED;

	// استيراد نموذج ورقي معبّأ — القيم المستخرجة مقترح يُراجَع ولا يُحفظ تلقائيًا
	const handleScanImport = (file: File | undefined) => {
		if (!file || !consent) return;
		if (file.size > 6 * 1024 * 1024) {
			toast.error("الملف أكبر من 6MB — ارفع صورة أصغر");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== "string") return;
			void extractScan({ consentId: consent.id, imageDataUrl: reader.result })
				// المستخرَج يُكمل الموجود ولا يدهس ما كتبه الموظّف
				.then((r) => setValues((prev) => ({ ...r.fieldValues, ...prev })))
				.catch(() => {});
		};
		reader.readAsDataURL(file);
	};

	const handleUpload = (file: File | undefined) => {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			toast.error("الملف أكبر من 1MB — ارفع صورة أصغر");
			return;
		}
		const reader = new FileReader();
		reader.onload = () =>
			signForm.setValue(
				"signatureUrl",
				typeof reader.result === "string" ? reader.result : null,
				{ shouldValidate: true },
			);
		reader.readAsDataURL(file);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				className="w-full gap-0 p-0 sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
			>
				<div className="flex items-center justify-between border-b px-4 py-2">
					<SheetTitle className="text-base font-semibold">
						{consent?.template?.titleAr ?? "الموافقة"}
					</SheetTitle>
					<div className="flex items-center gap-1.5">
						{consent && (
							<Badge
								variant="outline"
								className="text-[10px]"
							>
								{CONSENT_STATUS_LABELS[consent.status]}
							</Badge>
						)}
						{consent && (
							<Button
								size="sm"
								variant="outline"
								className="h-7 gap-1 text-xs"
								onClick={() => printConsent(consent)}
							>
								<IconPrinter className="size-3.5" />
								طباعة
							</Button>
						)}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					{isLoading || !consent ? (
						<div className="space-y-2">
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-40 w-full" />
						</div>
					) : (
						<div className="flex flex-col gap-4">
							{/* لغة الطباعة — بعض النماذج ورقة واحدة بلغتين */}
							{editable && (
								<div className="flex items-center gap-2">
									<Label className="text-sm">لغة المستند</Label>
									<Select
										value={locale}
										onValueChange={(v) => setLocale(v as ConsentLocale)}
									>
										<SelectTrigger
											size="sm"
											dir="rtl"
											className="h-7 w-44 text-xs"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{Object.values(ConsentLocale).map((l) => (
												<SelectItem
													key={l}
													value={l}
												>
													{CONSENT_LOCALE_LABELS[l]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							{revoked && (
								<p className="rounded-[4px] border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
									أُبطلت: {consent.revokeReason} —{" "}
									{consent.revokedAt ? dateFmt.format(new Date(consent.revokedAt)) : ""}
								</p>
							)}

							{signed && (
								<div className="flex flex-col gap-1.5 rounded-[4px] border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
									<p className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
										<IconCircleCheckFilled className="size-3.5" />
										وقّعها {consent.signerName}
										{consent.signerRelationship ? ` (${consent.signerRelationship})` : ""} —{" "}
										{consent.signedAt ? dateFmt.format(new Date(consent.signedAt)) : ""}
									</p>
									{consent.signatureUrl?.startsWith("data:image") && (
										<img
											src={consent.signatureUrl}
											alt="التوقيع"
											className="h-14 w-auto self-start rounded border bg-white p-1"
										/>
									)}
								</div>
							)}

							{/* الموقَّعة تُعرض كما وُقّعت — لا كنموذج قابل للتحرير */}
							{signed || revoked ? (
								<pre className="whitespace-pre-wrap rounded-[4px] border bg-muted/30 p-4 font-sans text-sm leading-7">
									{consent.textSnapshot}
								</pre>
							) : (
								<>
									{/* النموذج وُقّع على الورق — تُقرأ قيمه بدل إعادة إدخالها */}
									<label className="flex cursor-pointer items-center justify-between gap-2 rounded-[4px] border border-dashed p-2.5 text-xs text-muted-foreground">
										<span>
											{scanPending
												? "جارٍ قراءة النموذج..."
												: "لديك نسخة ورقية معبّأة؟ ارفع صورتها لتُقرأ حقولها"}
										</span>
										<IconScan className="size-4 shrink-0" />
										<input
											type="file"
											accept="image/*"
											className="hidden"
											disabled={scanPending || mutations.isPending}
											onChange={(e) => handleScanImport(e.target.files?.[0])}
										/>
									</label>
									<ConsentBlockFields
										blocks={blocks}
										values={values}
										autofilledKeys={autofilledKeys}
										prices={prices}
										disabled={mutations.isPending}
										aiPendingKey={draftPending ? aiFieldKey : null}
										onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
										onAiDraft={(field) => {
											setAiFieldKey(field.key);
											void draftField({ consentId: consent.id, fieldKey: field.key })
												// المسودّة تهبط في الحقل ولا تُحفظ — القرار للموظّف
												.then((r) => setValues((prev) => ({ ...prev, [field.key]: r.text })))
												.catch(() => {})
												.finally(() => setAiFieldKey(null));
										}}
									/>
								</>
							)}

							{/* لوحة التوقيع — التحقق من signConsentSchema، فالقاعدة معرّفة مرّة واحدة */}
							{editable && signing && (
								<div className="flex flex-col gap-2 rounded-[4px] border p-3">
									<p className="text-sm font-semibold">توقيع الموافقة</p>
									<div className="grid gap-2 sm:grid-cols-2">
										<Field data-invalid={!!signForm.formState.errors.signerName}>
											<Input
												className="h-9 text-sm"
												placeholder="اسم الموقّع"
												aria-invalid={!!signForm.formState.errors.signerName}
												disabled={mutations.isPending}
												{...signForm.register("signerName")}
											/>
											<FieldError errors={[signForm.formState.errors.signerName]} />
										</Field>
										<Input
											className="h-9 text-sm"
											placeholder="الصفة (وليّ الأمر...)"
											disabled={mutations.isPending}
											{...signForm.register("signerRelationship")}
										/>
									</div>

									<Controller
										name="signatureMethod"
										control={signForm.control}
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={(v) => {
													field.onChange(v as SignatureMethod);
													// تبديل الطريقة يُسقط ما جُمع للطريقة السابقة
													signForm.setValue("signatureUrl", null);
													signForm.setValue("witnessStaffId", null);
												}}
											>
												<SelectTrigger
													size="sm"
													dir="rtl"
													className="text-xs"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent
													position="popper"
													dir="rtl"
												>
													{Object.values(SignatureMethod).map((m) => (
														<SelectItem
															key={m}
															value={m}
														>
															{SIGNATURE_METHOD_LABELS[m]}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>

									{method === SignatureMethod.DRAWN && (
										<Controller
											name="signatureUrl"
											control={signForm.control}
											render={({ field }) => (
												<Field data-invalid={!!signForm.formState.errors.signatureUrl}>
													<SignaturePad
														value={field.value ?? null}
														onChange={field.onChange}
														disabled={mutations.isPending}
													/>
													<FieldError errors={[signForm.formState.errors.signatureUrl]} />
												</Field>
											)}
										/>
									)}
									{method === SignatureMethod.UPLOADED && (
										<Field data-invalid={!!signForm.formState.errors.signatureUrl}>
											<Input
												type="file"
												accept="image/*,.pdf"
												className="h-9 text-sm"
												disabled={mutations.isPending}
												onChange={(e) => handleUpload(e.target.files?.[0])}
											/>
											<FieldError errors={[signForm.formState.errors.signatureUrl]} />
										</Field>
									)}
									{method === SignatureMethod.VERBAL_WITNESSED && (
										<Controller
											name="witnessStaffId"
											control={signForm.control}
											render={({ field }) => (
												<Field data-invalid={!!signForm.formState.errors.witnessStaffId}>
													<Select
														value={field.value ?? ""}
														onValueChange={field.onChange}
													>
														<SelectTrigger
															size="sm"
															dir="rtl"
															className="text-xs"
														>
															<SelectValue placeholder="الشاهد من الطاقم..." />
														</SelectTrigger>
														<SelectContent
															position="popper"
															dir="rtl"
														>
															{staff.map((member) => (
																<SelectItem
																	key={member.id}
																	value={member.id}
																>
																	{member.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FieldError errors={[signForm.formState.errors.witnessStaffId]} />
												</Field>
											)}
										/>
									)}
								</div>
							)}

							{/* الإبطال — يُبقي الموافقة في السجل مع سببها */}
							{signed && revoking && (
								<div className="flex flex-col gap-1.5 rounded-[4px] border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800 dark:bg-amber-950/30">
									<p className="text-[11px] text-amber-800 dark:text-amber-300">
										الإبطال لا يمحو الموافقة — تبقى في السجل مع سببها، والتصحيح بموافقة جديدة
									</p>
									<Textarea
										rows={3}
										className="bg-background text-sm"
										placeholder="سبب الإبطال (إلزامي)"
										value={revokeReason}
										onChange={(e) => setRevokeReason(e.target.value)}
									/>
								</div>
							)}
						</div>
					)}
				</div>

				{/* التذييل — الإجراءات بحسب الحالة */}
				{consent && (
					<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
						<div className="flex items-center gap-1.5">
							{editable && !signing && (
								<>
									<Button
										size="sm"
										disabled={mutations.isPending}
										onClick={() =>
											void mutations
												.saveConsent({ consentId: consent.id, fieldValues: values, locale })
												.catch(() => {})
										}
									>
										حفظ المسودّة
									</Button>
									<Button
										size="sm"
										variant="outline"
										disabled={mutations.isPending}
										onClick={() => setSigning(true)}
									>
										متابعة للتوقيع
									</Button>
									{/* توقيع وليّ الأمر على الجهاز — يُحفظ أولًا كي تُبنى اللقطة التي سيقرأها.
									    السبب يُعرض بـ`DisabledReasonTooltip` لا بـ`title` أصليّ: الزرّ
									    المعطّل لا يستقبل أحداث المؤشر، فالتلميح الأصليّ لا يظهر أصلًا
									    ويبدو الزرّ «لا يعمل» بلا تفسير. */}
									<DisabledReasonTooltip
										reason={
											missing.length
												? `أكمل الحقول المطلوبة أولًا: ${missing.join("، ")}`
												: null
										}
									>
										<Button
											size="sm"
											variant="outline"
											className="gap-1"
											disabled={mutations.isPending || missing.length > 0}
											onClick={() =>
												void mutations
													.saveConsent({ consentId: consent.id, fieldValues: values, locale })
													.then(() => setOwnerSigning(true))
													.catch(() => {})
											}
										>
											<IconDeviceTablet className="size-3.5" />
											توقيع وليّ الأمر على الجهاز
										</Button>
									</DisabledReasonTooltip>
								</>
							)}
							{editable && signing && (
								<>
									<Button
										size="sm"
										disabled={mutations.isPending}
										onClick={signForm.handleSubmit((form) =>
											mutations
												// الحفظ قبل التوقيع — اللقطة تُبنى من القيم المخزّنة
												.saveConsent({ consentId: consent.id, fieldValues: values, locale })
												.then(() => mutations.signConsent({ consentId: consent.id, ...form }))
												.then(() => setSigning(false))
												.catch(() => {}),
										)}
									>
										تأكيد التوقيع
									</Button>
									<Button
										size="sm"
										variant="ghost"
										disabled={mutations.isPending}
										onClick={() => setSigning(false)}
									>
										رجوع
									</Button>
								</>
							)}
							{signed &&
								(revoking ? (
									<>
										<Button
											size="sm"
											variant="destructive"
											disabled={mutations.isPending || !revokeReason.trim()}
											onClick={() =>
												void mutations
													.revokeConsent({
														consentId: consent.id,
														reason: revokeReason.trim(),
													})
													.then(() => {
														setRevoking(false);
														setRevokeReason("");
													})
													.catch(() => {})
											}
										>
											تأكيد الإبطال
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setRevoking(false)}
										>
											رجوع
										</Button>
									</>
								) : (
									<Button
										size="sm"
										variant="outline"
										onClick={() => setRevoking(true)}
									>
										إبطال الموافقة
									</Button>
								))}
						</div>

						{/* الحذف للمسودّة وحدها — الموقَّعة تُبطل ولا تُمحى */}
						{editable && !signing && (
							<Button
								size="sm"
								variant="ghost"
								className="text-destructive hover:text-destructive"
								disabled={mutations.isPending}
								onClick={() =>
									void mutations
										.deleteConsent(consent.id)
										.then(() => onOpenChange(false))
										.catch(() => {})
								}
							>
								<IconTrash className="size-3.5" />
								حذف
							</Button>
						)}
					</div>
				)}
			</SheetContent>

			{/* وضع وليّ الأمر — نفس مسار التوقيع، وواجهة تخصّ من يوقّع لا من يُدخل */}
			{consent && editable && (
				<ConsentOwnerSigning
					consent={consent}
					open={ownerSigning}
					isPending={mutations.isPending}
					onOpenChange={setOwnerSigning}
					onSign={(v) =>
						mutations
							.signConsent({
								consentId: consent.id,
								signerName: v.signerName,
								signerRelationship: "وليّ الأمر",
								signatureMethod: SignatureMethod.DRAWN,
								signatureUrl: v.signatureUrl,
								witnessStaffId: null,
							})
							.then(() => setOwnerSigning(false))
					}
				/>
			)}
		</Sheet>
	);
};

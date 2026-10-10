import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCheck,
	IconCircleCheckFilled,
	IconFileText,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DateTimePopover } from "@/components/common/date-time-popover";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ConsentQuickActions } from "@/features/services/consents/components/consent-quick-actions";
import { useOperationCaseMutations } from "@/features/services/operations/hooks/use-operation-case";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { type ChecklistScope, SignatureMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	type AssessmentFormInput,
	type AssessmentFormValues,
	assessmentSchema,
	CONSENT_TYPE_LABELS,
	OPERATION_CONSENT_TYPES,
	type OperationCaseDetailResponse,
	type OperationConsentType,
	SIGNATURE_METHOD_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.type";
import {
	isOperationGateMet,
	type OperationGate,
	type OperationGateContext,
	requiredOperationGates,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { consentTemplatesForOperation } from "@sanad/contracts/runtime/server/patient-consents/consent-context";

// أقسام التحضير وقوائم الأمان — تعمل داخل لوحة سير العمل الجانبية
// (نظيرة مراحل لوحة فحص الأشعة المفرد).

const ASA_OPTIONS = [
	{ value: 1, label: "ASA I — سليم" },
	{ value: 2, label: "ASA II — مرض جهازي خفيف" },
	{ value: 3, label: "ASA III — مرض جهازي شديد" },
	{ value: 4, label: "ASA IV — مهدد للحياة" },
	{ value: 5, label: "ASA V — لا يُتوقع نجاته دون الجراحة" },
];

const dateTimeFormatter = new Intl.DateTimeFormat("ar", {
	dateStyle: "medium",
	timeStyle: "short",
});
const formatAt = (value: Date | string | null | undefined) =>
	value ? dateTimeFormatter.format(new Date(value)) : "—";

/** شارة المتطلب — «مطلوب» ما دام غير مستوفى، وتخضرّ عند الاستيفاء */
export function RequiredGateBadge({ met }: { met: boolean }) {
	return met ? (
		<Badge
			variant="outline"
			className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
		>
			<IconCircleCheckFilled className="size-3" />
			مستوفى
		</Badge>
	) : (
		// نفس شارة «مطلوب» المعتمدة في النماذج (FieldLabel) — لا تصميم ثانيًا للمفهوم نفسه
		<span className="rounded bg-destructive/10 px-1 py-0.5 text-xs font-medium leading-none text-destructive">
			مطلوب
		</span>
	);
}

/** سياق البوابات من الحالة — نفس ما يبنيه الخادم */
const gateContextOf = (c: OperationCaseDetailResponse): OperationGateContext => ({
	sedationPlanned: c.plannedAnesthesia !== "NONE",
});

const gateStateOf = (c: OperationCaseDetailResponse, gate: OperationGate) => {
	const context = gateContextOf(c);
	const required = requiredOperationGates(c.tier, context).includes(gate);
	return { required, met: isOperationGateMet(gate, c, c.tier, context) };
};

// ── التحضير: الموافقات + تقييم ما قبل التخدير ──────────────────────────────

export type PrepSectionKind = "consents" | "fasting" | "assessment" | "premed" | "all";

export function OperationPrepSection({
	operationCase: c,
	section = "all",
	registerSave,
}: {
	operationCase: OperationCaseDetailResponse;
	/** عرض جزء بعينه داخل مُدرّج لوحة سير العمل — لكل مرحلة نموذجها */
	section?: PrepSectionKind;
	/** تسجيل حفظ المرحلة — زر «التالي» يستدعيه قبل التقدّم */
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const [signingId, setSigningId] = useState<string | null>(null);
	const [revokingId, setRevokingId] = useState<string | null>(null);
	const [revokeReason, setRevokeReason] = useState("");
	const [newConsentType, setNewConsentType] = useState<OperationConsentType | "">("");

	// ما ينقص بوابة G1 تحديدًا — الجراحية دائمًا، والتخدير عند تخدير مخطَّط
	const signedConsentTypes = new Set(
		c.consents
			.filter((consent) => consent.signedAt && !consent.revokedAt)
			.map((consent) => consent.type),
	);
	const requiredConsentTypes: OperationConsentType[] = [
		"SURGICAL",
		...(c.plannedAnesthesia !== "NONE" ? (["ANESTHESIA"] as const) : []),
	];
	const missingRequiredConsents = requiredConsentTypes.filter(
		(type) => !signedConsentTypes.has(type),
	);

	return (
		<div className="flex flex-col gap-5">
			{(section === "consents" || section === "all") && (
				<>
					{/* الموافقات */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<h4 className="flex items-center gap-1.5 text-sm font-semibold">
								<IconFileText className="size-4 text-muted-foreground" />
								الموافقات
								<RequiredGateBadge met={gateStateOf(c, "G1_CONSENT").met} />
							</h4>
							<div className="flex items-center gap-1.5">
								<Select
									value={newConsentType}
									onValueChange={(v) => setNewConsentType(v as OperationConsentType)}
								>
									<SelectTrigger
										size="sm"
										dir="rtl"
										className="h-7 w-40 text-xs"
									>
										<SelectValue placeholder="نوع الموافقة" />
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										{OPERATION_CONSENT_TYPES.map((type) => (
											<SelectItem
												key={type}
												value={type}
											>
												{CONSENT_TYPE_LABELS[type]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									size="sm"
									variant="outline"
									className="h-7"
									disabled={!newConsentType || mutations.isPending}
									onClick={() => {
										if (!newConsentType) return;
										void mutations
											.createConsent({ type: newConsentType })
											.then(() => setNewConsentType(""))
											.catch(() => {});
									}}
								>
									<IconPlus className="size-3.5" />
									إضافة
								</Button>
							</div>
						</div>

						{/* نماذج الأكاديمية الموقَّعة — تُنشأ مربوطةً بالحالة وتُعبَّأ آليًا.
						    الحالة بالغة الخطورة تُبدّل الجراحية بنموذجها المشدَّد. */}
						<div className="flex flex-col gap-1.5 rounded-[4px] border bg-muted/30 p-2.5">
							<span className="text-[11px] text-muted-foreground">
								نماذج الموافقة المعتمدة — تُفتح معبّأة ببيانات وليّ الأمر والحالة
							</span>
							<ConsentQuickActions
								patientId={c.patient.id}
								operationCaseId={c.id}
								templateKeys={consentTemplatesForOperation({
									tier: c.tier,
									plannedAnesthesia: c.plannedAnesthesia,
									asaClass: c.assessment?.asaClass ?? null,
								})}
							/>
						</div>

						{/* ما ينقص البوابة تحديدًا — لا رسالة منع عامة بلا تفسير */}
						{missingRequiredConsents.length > 0 && (
							<p className="rounded-[4px] border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
								توقيعات مطلوبة قبل المتابعة:{" "}
								{missingRequiredConsents.map((type) => CONSENT_TYPE_LABELS[type]).join("، ")}
								{missingRequiredConsents.includes("ANESTHESIA")
									? " — موافقة التخدير لازمة لوجود تخدير مخطَّط"
									: ""}
							</p>
						)}

						{c.consents.length === 0 ? (
							<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
								لا موافقات بعد — الموافقة الجراحية شرط مغادرة التحضير (بوابة G1)
							</p>
						) : (
							c.consents.map((consent) => (
								<div
									key={consent.id}
									className="flex flex-col gap-1 rounded-md border px-3 py-2"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="text-sm font-medium">
											{CONSENT_TYPE_LABELS[consent.type]}
										</span>
										{consent.revokedAt ? (
											<Badge
												variant="outline"
												className="border-red-200 bg-red-50 text-[10px] text-red-700"
											>
												مُبطلة
											</Badge>
										) : consent.signedAt ? (
											<Badge
												variant="outline"
												className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
											>
												<IconCircleCheckFilled className="size-3" />
												موقَّعة
											</Badge>
										) : (
											<Badge
												variant="outline"
												className="text-[10px]"
											>
												بانتظار التوقيع
											</Badge>
										)}
									</div>
									{consent.signedAt &&
										!consent.revokedAt &&
										consent.signatureUrl?.startsWith("data:image") && (
											<img
												src={consent.signatureUrl}
												alt="التوقيع"
												className="h-14 w-auto self-start rounded border bg-white p-1"
											/>
										)}
									{consent.signedAt && !consent.revokedAt && (
										<p className="text-xs text-muted-foreground">
											وقّعها {consent.signerName}
											{consent.signatureMethod
												? ` (${SIGNATURE_METHOD_LABELS[consent.signatureMethod]})`
												: ""}{" "}
											— {formatAt(consent.signedAt)}
										</p>
									)}
									{consent.revokedAt && (
										<p className="text-xs text-red-600">
											أُبطلت: {consent.revokeReason} — {formatAt(consent.revokedAt)}
										</p>
									)}
									{!consent.signedAt && !consent.revokedAt && (
										<>
											<p className="line-clamp-2 text-xs text-muted-foreground">
												{consent.textSnapshot}
											</p>
											{signingId === consent.id ? (
												<SignConsentForm
													onCancel={() => setSigningId(null)}
													onSign={(values) =>
														mutations
															.signConsent({ consentId: consent.id, ...values })
															.then(() => setSigningId(null))
															.catch(() => {})
													}
													isPending={mutations.isPending}
												/>
											) : (
												<div className="flex items-center gap-1.5 self-start">
													<Button
														size="sm"
														variant="outline"
														onClick={() => setSigningId(consent.id)}
													>
														توقيع الموافقة
													</Button>
													{/* الحذف قبل التوقيع فقط — الموقّعة تُبطل ولا تُحذف */}
													<Button
														size="sm"
														variant="ghost"
														className="text-red-600 hover:text-red-600"
														disabled={mutations.isPending}
														onClick={() =>
															void mutations.deleteConsent(consent.id).catch(() => {})
														}
													>
														<IconTrash className="size-3.5" />
														حذف
													</Button>
												</div>
											)}
										</>
									)}
									{consent.signedAt &&
										!consent.revokedAt &&
										(revokingId === consent.id ? (
											<div className="flex flex-col gap-1.5 rounded-[4px] border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800 dark:bg-amber-950/30">
												<p className="text-[11px] text-amber-800 dark:text-amber-300">
													الإبطال لا يمحو الموافقة — تبقى في السجل مع سببها، والتصحيح بموافقة
													جديدة (S21)
												</p>
												<Textarea
													rows={2}
													className="bg-background text-xs"
													placeholder="سبب الإبطال (إلزامي)"
													value={revokeReason}
													onChange={(e) => setRevokeReason(e.target.value)}
												/>
												<div className="flex items-center gap-2">
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
																	setRevokingId(null);
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
														disabled={mutations.isPending}
														onClick={() => {
															setRevokingId(null);
															setRevokeReason("");
														}}
													>
														إلغاء
													</Button>
												</div>
											</div>
										) : (
											<Button
												size="sm"
												variant="ghost"
												className="self-start text-xs text-red-600 hover:text-red-600"
												onClick={() => setRevokingId(consent.id)}
											>
												إبطال
											</Button>
										))}
								</div>
							))
						)}
					</div>
				</>
			)}

			{/* تقييم ما قبل التخدير — كل مرحلة ترى جزأها وحده */}
			{section !== "consents" && (
				<AssessmentForm
					operationCase={c}
					part={section === "all" ? "all" : section}
					registerSave={registerSave}
				/>
			)}
		</div>
	);
}

function SignConsentForm({
	onSign,
	onCancel,
	isPending,
}: {
	onSign: (values: {
		signerName: string;
		signerRelationship?: string | null;
		signatureMethod: SignatureMethod;
		signatureUrl?: string | null;
		witnessStaffId?: string | null;
	}) => Promise<unknown>;
	onCancel: () => void;
	isPending: boolean;
}) {
	const [signerName, setSignerName] = useState("");
	const [relationship, setRelationship] = useState("");
	const [method, setMethod] = useState<SignatureMethod>(SignatureMethod.TYPED);
	// توقيع مرسوم أو مستند مرفوع — يُحفظ data URL في signatureUrl
	const [signatureData, setSignatureData] = useState<string | null>(null);
	const [witnessStaffId, setWitnessStaffId] = useState("");
	const { staff } = useStaff();

	// لكل طريقة شرطها: الرسم/الرفع يتطلب ملفًا، والشفهي يتطلب شاهدًا
	const canSign =
		signerName.trim().length > 0 &&
		(method === SignatureMethod.TYPED ||
			(method === SignatureMethod.VERBAL_WITNESSED
				? witnessStaffId !== ""
				: signatureData !== null));

	const handleUpload = (file: File | undefined) => {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			toast.error("الملف أكبر من 1MB — ارفع صورة أصغر");
			return;
		}
		const reader = new FileReader();
		reader.onload = () =>
			setSignatureData(typeof reader.result === "string" ? reader.result : null);
		reader.readAsDataURL(file);
	};

	return (
		<div className="flex flex-col gap-2 rounded-md bg-muted/30 p-2">
			<div className="grid grid-cols-2 gap-2">
				<Input
					placeholder="اسم الموقّع"
					value={signerName}
					onChange={(e) => setSignerName(e.target.value)}
					disabled={isPending}
				/>
				<Input
					placeholder="الصفة (وليّ الأمر...)"
					value={relationship}
					onChange={(e) => setRelationship(e.target.value)}
					disabled={isPending}
				/>
			</div>
			<Select
				value={method}
				onValueChange={(v) => {
					setMethod(v as SignatureMethod);
					setSignatureData(null);
					setWitnessStaffId("");
				}}
			>
				<SelectTrigger
					size="sm"
					dir="rtl"
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

			{/* لكل طريقة توقيع أداتها — رسم، رفع، أو شاهد */}
			{method === SignatureMethod.DRAWN && (
				<SignaturePad
					value={signatureData}
					onChange={setSignatureData}
					disabled={isPending}
				/>
			)}
			{method === SignatureMethod.UPLOADED && (
				<div className="flex flex-col gap-1.5">
					<Input
						type="file"
						accept="image/*,.pdf"
						className="h-8 text-xs"
						disabled={isPending}
						onChange={(e) => handleUpload(e.target.files?.[0])}
					/>
					{signatureData?.startsWith("data:image") && (
						<img
							src={signatureData}
							alt="المستند المرفوع"
							className="h-16 w-auto self-start rounded border bg-white p-1"
						/>
					)}
				</div>
			)}
			{method === SignatureMethod.VERBAL_WITNESSED && (
				<Select
					value={witnessStaffId}
					onValueChange={setWitnessStaffId}
				>
					<SelectTrigger
						size="sm"
						dir="rtl"
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
			)}

			<div className="flex items-center gap-2">
				<Button
					size="sm"
					disabled={isPending || !canSign}
					onClick={() =>
						void onSign({
							signerName: signerName.trim(),
							signerRelationship: relationship.trim() || null,
							signatureMethod: method,
							signatureUrl: signatureData,
							witnessStaffId: witnessStaffId || null,
						})
					}
				>
					<IconCheck className="size-3.5" />
					تأكيد التوقيع
				</Button>
				<Button
					size="sm"
					variant="ghost"
					disabled={isPending}
					onClick={onCancel}
				>
					إلغاء
				</Button>
			</div>
		</div>
	);
}

/** لوحة توقيع بالرسم — قماش بأحداث المؤشر، يصدّر data URL عند كل رفعة قلم */

const toLocalInput = (value: Date | string | null | undefined) => {
	if (!value) return "";
	const d = new Date(value);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function AssessmentForm({
	operationCase: c,
	part = "all",
	registerSave,
}: {
	operationCase: OperationCaseDetailResponse;
	/** جزء التقييم الظاهر — الصيام أو الفحص أو التمهيد؛ الحفظ يرسل النموذج كاملًا */
	part?: "fasting" | "assessment" | "premed" | "all";
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const assessment = c.assessment;
	const showFasting = part === "fasting" || part === "all";
	const showExam = part === "assessment" || part === "all";
	const showPremed = part === "premed" || part === "all";

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AssessmentFormInput, unknown, AssessmentFormValues>({
		resolver: zodResolver(assessmentSchema),
		defaultValues: {
			asaClass: assessment?.asaClass ?? null,
			asaEmergency: assessment?.asaEmergency ?? false,
			lastFoodAt: toLocalInput(assessment?.lastFoodAt),
			lastWaterAt: toLocalInput(assessment?.lastWaterAt),
			fastingVerified: assessment?.fastingVerified ?? false,
			physicalFindings: assessment?.physicalFindings ?? null,
			airwayAssessment: assessment?.airwayAssessment ?? null,
			medications: assessment?.medications ?? null,
			allergies: assessment?.allergies ?? null,
			bloodworkReviewed: assessment?.bloodworkReviewed ?? false,
			imagingReviewed: assessment?.imagingReviewed ?? false,
			riskNotes: assessment?.riskNotes ?? null,
			premedPlan: assessment?.premedPlan ?? null,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: إعادة الضبط عند تبدّل الحالة فقط
	useEffect(() => {
		reset({
			asaClass: assessment?.asaClass ?? null,
			asaEmergency: assessment?.asaEmergency ?? false,
			lastFoodAt: toLocalInput(assessment?.lastFoodAt),
			lastWaterAt: toLocalInput(assessment?.lastWaterAt),
			fastingVerified: assessment?.fastingVerified ?? false,
			physicalFindings: assessment?.physicalFindings ?? null,
			airwayAssessment: assessment?.airwayAssessment ?? null,
			medications: assessment?.medications ?? null,
			allergies: assessment?.allergies ?? null,
			bloodworkReviewed: assessment?.bloodworkReviewed ?? false,
			imagingReviewed: assessment?.imagingReviewed ?? false,
			riskNotes: assessment?.riskNotes ?? null,
			premedPlan: assessment?.premedPlan ?? null,
		});
	}, [c.id, assessment?.id]);

	const onSubmit = handleSubmit((values) => {
		void mutations.saveAssessment(values).catch(() => {});
	});

	// زر «التالي» في اللوحة هو الحفظ نفسه — لا زر حفظ في كل خطوة
	// biome-ignore lint/correctness/useExhaustiveDependencies: التسجيل ثابت؛ handleSubmit يقرأ القيم الحية
	useEffect(() => {
		if (!registerSave) return;
		registerSave(
			() =>
				new Promise((resolve, reject) => {
					void handleSubmit(
						async (values) => {
							try {
								await mutations.saveAssessment(values);
								resolve(null);
							} catch (e) {
								reject(e);
							}
						},
						() => reject(new Error("أكمل حقول التقييم أولًا")),
					)();
				}),
		);
		return () => registerSave(null);
	}, [registerSave]);

	return (
		<form
			className="flex flex-col gap-3"
			onSubmit={onSubmit}
		>
			{/* التحقق من الصيام — مرحلة FASTING_CHECK (بوابة G2) */}
			{showFasting && (
				<>
					<h4 className="flex items-center gap-1.5 text-sm font-semibold">
						التحقق من الصيام
						{gateStateOf(c, "G2_FASTING").required && (
							<RequiredGateBadge met={gateStateOf(c, "G2_FASTING").met} />
						)}
					</h4>
					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label className="text-xs font-medium">آخر طعام</Label>
							<Controller
								name="lastFoodAt"
								control={control}
								render={({ field }) => (
									<DateTimePopover
										value={field.value ? new Date(field.value) : null}
										onChange={(d) => field.onChange(toLocalInput(d))}
										placeholder="وقت آخر طعام"
										className="w-full justify-start"
									/>
								)}
							/>
						</Field>
						<Field>
							<Label className="text-xs font-medium">آخر ماء</Label>
							<Controller
								name="lastWaterAt"
								control={control}
								render={({ field }) => (
									<DateTimePopover
										value={field.value ? new Date(field.value) : null}
										onChange={(d) => field.onChange(toLocalInput(d))}
										placeholder="وقت آخر ماء"
										className="w-full justify-start"
									/>
								)}
							/>
						</Field>
					</div>
					{/* تسجيل الأوقات وحده لا يفتح البوابة — G2 تأكيد صريح، والصف يصرّح بذلك */}
					<Controller
						name="fastingVerified"
						control={control}
						render={({ field }) => (
							<div
								className={cn(
									"flex flex-col gap-1.5 rounded-md border p-2.5",
									!field.value &&
										"border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
								)}
							>
								<div className="flex items-center justify-between gap-2 text-sm">
									<span className="flex items-center gap-1.5 font-medium">
										أؤكد التحقق من الصيام وفق البروتوكول (بوابة G2)
										<RequiredGateBadge met={field.value ?? false} />
									</span>
									<Switch
										checked={field.value ?? false}
										onCheckedChange={field.onChange}
										aria-label="التحقق من الصيام وفق البروتوكول"
									/>
								</div>
								{!field.value && (
									<p className="text-[11px] text-amber-800 dark:text-amber-300">
										تسجيل الأوقات وحده لا يكفي — فعّل هذا التأكيد ثم اضغط «التالي» للمتابعة
									</p>
								)}
							</div>
						)}
					/>
				</>
			)}

			{/* تقييم ما قبل التخدير — مرحلة ASSESSMENT */}
			{showExam && (
				<>
					<h4 className="flex items-center gap-1.5 text-sm font-semibold">
						تقييم ما قبل التخدير
						{gateStateOf(c, "G3_ASSESSMENT").required && (
							<RequiredGateBadge met={gateStateOf(c, "G3_ASSESSMENT").met} />
						)}
					</h4>
					<div className="grid grid-cols-2 gap-3">
						<Controller
							name="asaClass"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.asaClass}>
									<Label className="flex items-center gap-1.5 text-xs font-medium">
										درجة ASA
										{/* بوابة G3 — لا مغادرة للتقييم قبل تحديد الدرجة */}
										<RequiredGateBadge met={field.value != null} />
									</Label>
									<Select
										value={field.value != null ? String(field.value) : ""}
										onValueChange={(v) => field.onChange(v ? Number(v) : null)}
									>
										<SelectTrigger dir="rtl">
											<SelectValue placeholder="اختر الدرجة" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											dir="rtl"
										>
											{ASA_OPTIONS.map((o) => (
												<SelectItem
													key={o.value}
													value={String(o.value)}
												>
													{o.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.asaClass]} />
								</Field>
							)}
						/>
						<div className="flex items-end pb-1">
							<Controller
								name="asaEmergency"
								control={control}
								render={({ field }) => (
									<div className="flex items-center gap-2 text-xs">
										<Switch
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
											aria-label="حالة طارئة (اللاحقة E)"
										/>
										<span>حالة طارئة (اللاحقة E)</span>
									</div>
								)}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label className="text-xs font-medium">موجودات الفحص السريري</Label>
							<Textarea
								rows={2}
								{...register("physicalFindings")}
							/>
						</Field>
						<Field>
							<Label className="text-xs font-medium">تقييم مجرى الهواء</Label>
							<Textarea
								rows={2}
								{...register("airwayAssessment")}
							/>
						</Field>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label className="text-xs font-medium">الحساسية المعروفة</Label>
							<Textarea
								rows={2}
								{...register("allergies")}
							/>
						</Field>
						<Field>
							<Label className="text-xs font-medium">الأدوية الحالية</Label>
							<Textarea
								rows={2}
								{...register("medications")}
							/>
						</Field>
					</div>

					<div className="flex flex-col gap-2 rounded-md border p-2.5">
						<Controller
							name="bloodworkReviewed"
							control={control}
							render={({ field }) => (
								<div className="flex items-center justify-between gap-2 text-sm">
									<span>رُوجعت التحاليل التمهيدية</span>
									<Switch
										checked={field.value ?? false}
										onCheckedChange={field.onChange}
										aria-label="رُوجعت التحاليل التمهيدية"
									/>
								</div>
							)}
						/>
						<Controller
							name="imagingReviewed"
							control={control}
							render={({ field }) => (
								<div className="flex items-center justify-between gap-2 text-sm">
									<span>رُوجعت الأشعة التمهيدية</span>
									<Switch
										checked={field.value ?? false}
										onCheckedChange={field.onChange}
										aria-label="رُوجعت الأشعة التمهيدية"
									/>
								</div>
							)}
						/>
					</div>
				</>
			)}

			{/* التمهيد الدوائي — مرحلة PREMED */}
			{showPremed && (
				<>
					<h4 className="text-sm font-semibold">التمهيد الدوائي</h4>
					<Field>
						<Label className="text-xs font-medium">خطة التمهيد الدوائي</Label>
						<Textarea
							rows={3}
							placeholder="الأدوية والجرعات وطريق الإعطاء قبل التخدير..."
							{...register("premedPlan")}
						/>
					</Field>
					<Field>
						<Label className="text-xs font-medium">ملاحظات الخطورة</Label>
						<Textarea
							rows={2}
							placeholder="عوامل الخطورة وخطة التعامل معها..."
							{...register("riskNotes")}
						/>
					</Field>
				</>
			)}

			{/* في اللوحة زر «التالي» يحفظ — الزر المستقل للعرض الكامل فقط */}
			{!registerSave && (
				<Button
					type="submit"
					size="sm"
					className="self-start"
					disabled={mutations.isPending}
				>
					حفظ
				</Button>
			)}
		</form>
	);
}

// ── قوائم الأمان (WHO) ─────────────────────────────────────────────────────

const RESPONSE_LABELS: Record<string, string> = {
	CONFIRMED: "تم التأكيد",
	YES: "نعم",
	NO: "لا",
	NA: "لا ينطبق",
};

export function OperationChecklistsSection({
	operationCase: c,
	activeScope,
}: {
	operationCase: OperationCaseDetailResponse;
	/** قصر العرض على نطاق واحد — لمرحلة بعينها في لوحة سير العمل */
	activeScope?: ChecklistScope;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const scopes: { scope: ChecklistScope; title: string; hint: string }[] =
		c.tier === "MINOR"
			? [
					{
						scope: "OPERATION_MINOR_COMBINED",
						title: "قائمة الإجراءات الصغرى",
						hint: "قائمة موحدة مختصرة — بوابة الدخول إلى «العملية»",
					},
				]
			: [
					{
						scope: "OPERATION_SIGN_IN",
						title: "قائمة الدخول (Sign-In)",
						hint: "قبل بدء التخدير — بوابة G4",
					},
					{
						scope: "OPERATION_TIME_OUT",
						title: "الوقفة الآمنة (Time-Out)",
						hint: "قبل الشق الجراحي — بوابة G5",
					},
					{
						scope: "OPERATION_SIGN_OUT",
						title: "قائمة الخروج (Sign-Out)",
						hint: "قبل مغادرة قاعة العمليات — بوابة G6",
					},
				];

	const visibleScopes = activeScope ? scopes.filter((s) => s.scope === activeScope) : scopes;

	return (
		<div className="flex flex-col gap-3">
			{visibleScopes.map(({ scope, title, hint }) => {
				const run = c.checklistRuns.find((r) => r.scope === scope) ?? null;
				const answered = run?.items.filter((i) => i.response !== null).length ?? 0;
				const total = run?.items.length ?? 0;
				return (
					<div
						key={scope}
						className="flex flex-col gap-2 rounded-md border p-3"
					>
						<div className="flex items-center justify-between gap-2">
							<div className="flex flex-col">
								<span className="flex items-center gap-1.5 text-sm font-semibold">
									{title}
									{!run?.completedAt && <RequiredGateBadge met={false} />}
								</span>
								<span className="text-[11px] text-muted-foreground">{hint}</span>
							</div>
							{run?.completedAt ? (
								<Badge
									variant="outline"
									className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
								>
									<IconCircleCheckFilled className="size-3" />
									مكتملة
								</Badge>
							) : run ? (
								<Badge
									variant="outline"
									className="text-[10px] tabular-nums"
								>
									{answered}/{total}
								</Badge>
							) : (
								<Button
									size="sm"
									variant="outline"
									disabled={mutations.isPending}
									onClick={() => void mutations.startChecklist(scope).catch(() => {})}
								>
									بدء القائمة
								</Button>
							)}
						</div>

						{run && (
							<div className="flex flex-col gap-1.5">
								{run.items.map((item) => (
									<div
										key={item.id}
										className="flex items-start justify-between gap-2 rounded-md bg-muted/30 px-2.5 py-2"
									>
										<span className="text-xs leading-5">{item.textSnapshot}</span>
										{run.completedAt ? (
											<Badge
												variant="outline"
												className={
													item.response === "NO"
														? "shrink-0 border-amber-200 bg-amber-50 text-[10px] text-amber-700"
														: "shrink-0 text-[10px]"
												}
											>
												{item.response ? RESPONSE_LABELS[item.response] : "—"}
											</Badge>
										) : (
											// المختار معلّم بوضوح وقابل للتغيير حتى اكتمال القائمة
											<div className="flex shrink-0 items-center gap-1">
												{(item.responseType === "CONFIRM"
													? (["CONFIRMED"] as const)
													: (["YES", "NO", "NA"] as const)
												).map((response) => {
													const selected = item.response === response;
													return (
														<Button
															key={response}
															size="sm"
															variant={selected ? "default" : "outline"}
															className={cn(
																"h-6 gap-1 px-2 text-[10px]",
																selected &&
																	response === "NO" &&
																	"bg-amber-600 primaryhover:bg-amber-700",
																selected &&
																	response !== "NO" &&
																	"bg-indigo-600 primaryhover:bg-indigo-700",
															)}
															disabled={mutations.isPending}
															onClick={() => {
																if (selected) return;
																// آخر استجابة تُكمل القائمة تلقائيًا — لا زر إكمال منفصل
																const isLastAnswer =
																	run.items.filter((i) => i.response === null).length === 1 &&
																	item.response === null;
																void mutations
																	.respondItem({ itemId: item.id, response })
																	.then(() => {
																		if (isLastAnswer)
																			return mutations.completeChecklist(scope);
																	})
																	.catch((err: Error) =>
																		toast.error(err.message || "تعذّر تسجيل الاستجابة"),
																	);
															}}
														>
															{selected && <IconCheck className="size-3" />}
															{RESPONSE_LABELS[response]}
														</Button>
													);
												})}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

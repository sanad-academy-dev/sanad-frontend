import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconBrandWhatsapp,
	IconBus,
	IconCalendarCheck,
	IconCertificate,
	IconCircleCheck,
	IconCircleOff,
	IconClockHour4,
	IconCoins,
	IconCopy,
	IconDeviceLaptop,
	IconExternalLink,
	IconFileText,
	IconId,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPhoneCall,
	IconScale,
	IconSchool,
	IconUser,
	IconUserCheck,
	IconUsers,
	IconWeight,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PatientPolicyCard } from "@/features/accounting/insurance/components/patient-policy-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type PatientAutosaveInput,
	useAutosavePatient,
} from "@/features/services/patients/hooks/use-autosave-patient";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { cn } from "@/lib/utils";

function getInitials(name?: string | null) {
	return (
		(name ?? "")
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase() || "—"
	);
}

function StatCard({
	icon,
	label,
	value,
	subtitle,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	subtitle?: string;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border p-4">
			<div className="flex items-center justify-between gap-2">
				<p className="text-xs text-muted-foreground">{label}</p>
				<span className="text-muted-foreground">{icon}</span>
			</div>
			<div className="flex items-baseline gap-1.5">
				<p className="font-bold text-2xl tabular-nums">{value}</p>
				{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
			</div>
		</div>
	);
}

function EditableText({
	value,
	placeholder,
	onSave,
	className,
	displayClassName,
	dir,
	type = "text",
}: {
	value: string | number | null | undefined;
	placeholder: string;
	onSave: (v: string | null) => void;
	className?: string;
	displayClassName?: string;
	dir?: "ltr" | "rtl";
	type?: string;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value != null ? String(value) : "");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	useEffect(() => {
		if (!editing) setDraft(value != null ? String(value) : "");
	}, [value, editing]);

	function commit() {
		const next = draft.trim();
		const current = value != null ? String(value).trim() : "";
		if (next !== current) onSave(next === "" ? null : next);
		setEditing(false);
	}

	function cancel() {
		setDraft(value != null ? String(value) : "");
		setEditing(false);
	}

	if (!editing) {
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				dir={dir}
				className={cn(
					"text-start w-full rounded px-1 -mx-1 hover:bg-muted/60",
					displayClassName,
				)}
			>
				{value != null && value !== "" ? (
					<span>{value}</span>
				) : (
					<span className="text-muted-foreground">{placeholder}</span>
				)}
			</button>
		);
	}

	return (
		<Input
			ref={inputRef}
			type={type}
			value={draft}
			onChange={(e) => setDraft(e.target.value)}
			onBlur={commit}
			dir={dir}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					commit();
				}
				if (e.key === "Escape") {
					e.preventDefault();
					cancel();
				}
			}}
			className={cn("h-8", className)}
		/>
	);
}

function EditableNotes({
	value,
	onSave,
}: {
	value: string | null | undefined;
	onSave: (v: string | null) => void;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value ?? "");
	const ref = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (editing && ref.current) {
			ref.current.focus();
			ref.current.selectionStart = ref.current.value.length;
		}
	}, [editing]);

	useEffect(() => {
		if (!editing) setDraft(value ?? "");
	}, [value, editing]);

	function commit() {
		const next = draft.trim();
		const current = (value ?? "").trim();
		if (next !== current) onSave(next === "" ? null : next);
		setEditing(false);
	}

	function cancel() {
		setDraft(value ?? "");
		setEditing(false);
	}

	if (!editing) {
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				className="text-start w-full rounded px-1 -mx-1 hover:bg-muted/60 text-sm"
			>
				{value ? (
					<span className="whitespace-pre-wrap">{value}</span>
				) : (
					<span className="text-muted-foreground">أضف ملاحظات...</span>
				)}
			</button>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<Textarea
				ref={ref}
				value={draft}
				onChange={(e) => setDraft(e.target.value.slice(0, 500))}
				onBlur={commit}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						e.preventDefault();
						cancel();
					}
				}}
				className="min-h-[80px] text-sm"
			/>
			<p className="text-xs text-muted-foreground self-start tabular-nums">
				{draft.length}/500
			</p>
		</div>
	);
}

function InfoField({
	label,
	icon,
	children,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5 rounded-lg border p-3">
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<span className="text-muted-foreground">{icon}</span>
				<p className="text-xs">{label}</p>
			</div>
			<div className="text-sm font-medium">{children}</div>
		</div>
	);
}

function OverviewTabSkeleton() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<Skeleton className="h-24 w-full" />
			<div className="grid grid-cols-3 gap-3">
				<Skeleton className="h-20" />
				<Skeleton className="h-20" />
				<Skeleton className="h-20" />
			</div>
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export function OverviewTab({ patientId }: PatientTabProps) {
	const { patients: allPatients, isLoading: isLoadingPatients } = usePatients();
	const patient: PatientResponse | undefined = allPatients.find((p) => p.id === patientId);
	const { autosave } = useAutosavePatient(patientId);

	function patch(data: PatientAutosaveInput) {
		autosave(data);
	}

	if (!patientId || (isLoadingPatients && !patient)) {
		return (
			<TabsContent
				value="overview"
				className="m-0"
				dir="rtl"
			>
				<OverviewTabSkeleton />
			</TabsContent>
		);
	}

	if (!patient) {
		return (
			<TabsContent
				value="overview"
				className="m-0 p-4"
				dir="rtl"
			>
				<p className="text-sm text-muted-foreground">الطفل غير موجود</p>
			</TabsContent>
		);
	}

	return (
		<TabsContent
			value="overview"
			className="m-0 p-4 flex flex-col gap-4 overflow-y-auto"
			dir="rtl"
		>
			<div className="rounded-lg border p-4 flex gap-3 items-start">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
					{getInitials(patient.name)}
				</div>
				<div className="flex flex-col gap-2 flex-1 min-w-0">
					<EditableText
						value={patient.name}
						placeholder="اسم الطفل"
						onSave={(v) => patch({ name: v ?? "" })}
						displayClassName="font-bold text-base"
					/>
					<div className="flex flex-col gap-1">
						<p className="text-xs text-muted-foreground">ملاحظات</p>
						<EditableNotes
							value={patient.notes}
							onSave={(v) => patch({ notes: v })}
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<StatCard
					icon={<IconWeight className="size-4" />}
					label="الوزن"
					value={patient.weight != null ? `${patient.weight}` : "—"}
					subtitle={patient.weight != null ? "كجم" : undefined}
				/>
				<StatCard
					icon={<IconScale className="size-4" />}
					label="العمر"
					value={patient.age != null ? `${patient.age}` : "—"}
					subtitle={patient.age != null ? "سنوات" : undefined}
				/>
				<StatCard
					icon={<IconUsers className="size-4" />}
					label="عدد الزيارات"
					value="0"
				/>
			</div>

			{/* نظرة عامة */}
			<div className="flex flex-col gap-3">
				<p className="font-bold text-base">نظرة عامة</p>
				<div className="grid grid-cols-2 gap-3">
					<InfoField
						label="العمر (سنوات)"
						icon={<IconScale className="size-3.5" />}
					>
						<EditableText
							value={patient.age}
							placeholder="—"
							type="number"
							onSave={(v) => patch({ age: v != null ? Number(v) : undefined })}
							displayClassName="tabular-nums"
						/>
					</InfoField>

					<InfoField
						label="الوزن (كجم)"
						icon={<IconWeight className="size-3.5" />}
					>
						<div className="flex items-center justify-between gap-2">
							<span className="tabular-nums">
								{patient.weight != null ? patient.weight : "—"}
							</span>
							<span className="text-[11px] font-normal text-muted-foreground">
								من العلامات الحيوية
							</span>
						</div>
					</InfoField>
				</div>
			</div>

			{/* المصروفات والخدمات الأكاديمية */}
			<div className="flex flex-col gap-3">
				<p className="font-bold text-base">المصروفات والخدمات الأكاديمية</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					<InfoField
						label="تفعيل المصروفات"
						icon={<IconCoins className="size-3.5" />}
					>
						<div className="flex items-center justify-between gap-2">
							<span
								className={cn(
									"inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
									patient.pocketMoneyEnabled !== false
										? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
										: "bg-muted text-muted-foreground border-border",
								)}
							>
								{patient.pocketMoneyEnabled !== false ? "مفعّل" : "معطّل"}
							</span>
							<Switch
								checked={patient.pocketMoneyEnabled !== false}
								onCheckedChange={(val) => patch({ pocketMoneyEnabled: val })}
							/>
						</div>
					</InfoField>

					<InfoField
						label="وسيلة النقل"
						icon={<IconBus className="size-3.5" />}
					>
						<EditableText
							value={patient.transportation}
							placeholder="وسيلة النقل..."
							onSave={(v) => patch({ transportation: v })}
						/>
					</InfoField>

					<InfoField
						label="الحضانة السابقة"
						icon={<IconSchool className="size-3.5" />}
					>
						<EditableText
							value={patient.previousNursery}
							placeholder="الحضانة السابقة إن وجدت..."
							onSave={(v) => patch({ previousNursery: v })}
						/>
					</InfoField>

					<InfoField
						label="المستوى"
						icon={<IconCertificate className="size-3.5" />}
					>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
							{patient.level || "مبتدئ"}
						</span>
					</InfoField>

					<InfoField
						label="طريقة التعلم"
						icon={<IconDeviceLaptop className="size-3.5" />}
					>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
							{patient.learningMethod || "حضوري"}
						</span>
					</InfoField>

					<InfoField
						label="المناوبة المفضلة"
						icon={<IconClockHour4 className="size-3.5" />}
					>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
							{patient.preferredShift || "صباحي"}
						</span>
					</InfoField>

					<InfoField
						label="العنوان"
						icon={<IconMapPin className="size-3.5" />}
					>
						<EditableText
							value={patient.address}
							placeholder="عنوان الطالب..."
							onSave={(v) => patch({ address: v })}
						/>
					</InfoField>
				</div>
			</div>

			{/* بطاقة بيانات وليّ الأمر الكاملة والموسّعة */}
			<p className="font-bold text-base">بيانات ولي الأمر</p>
			{(() => {
				const guardianName = patient.owner?.name || patient.guardianName || "ولي أمر غير محدد";
				const guardianPhone = patient.owner?.phone || patient.guardianPhone || "";
				const guardianEmail = patient.owner?.email || patient.guardianEmail || "";
				const guardianRelationship = patient.guardianRelationship || patient.owner?.relationship;
				const cleanPhone = guardianPhone.replace(/\D/g, "");
				const guardianAddress =
					patient.owner?.address ||
					[patient.owner?.city, patient.owner?.country].filter(Boolean).join("، ") ||
					"سيدي سالم، كفرالشيخ، مصر";

				const formatRel = (rel?: string | null) => {
					if (!rel) return "ولي أمر";
					const u = rel.toUpperCase();
					if (u === "FATHER" || rel === "أب") return "الأب";
					if (u === "MOTHER" || rel === "أم") return "الأم";
					if (u === "GUARDIAN" || rel.includes("وصي")) return "وصي / كفيل";
					if (u === "BROTHER" || rel === "أخ") return "الأخ";
					if (u === "SISTER" || rel === "أخت") return "الأخت";
					return rel;
				};

				return (
					<div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
						{/* ترويسة ولي الأمر مع الصورة الرمزية والإجراءات السريعة */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-center gap-3.5">
								<InitialsAvatar
									name={guardianName}
									className="size-12 rounded-full bg-primary/10 text-primary border border-primary/20 text-base font-bold shadow-2xs"
								/>
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2 flex-wrap">
										<h3 className="font-bold text-base text-foreground">{guardianName}</h3>
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
											{formatRel(guardianRelationship)}
										</span>
										
										<span
											className={cn(
												"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
												patient.owner?.active !== false
													? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
													: "bg-muted text-muted-foreground border-border",
											)}
										>
											{patient.owner?.active !== false ? (
												<>
													<IconCircleCheck className="size-3 text-emerald-600" />
													حساب نشط
												</>
											) : (
												<>
													<IconCircleOff className="size-3 text-muted-foreground" />
													غير نشط
												</>
											)}
										</span>
									</div>
									<p className="text-xs text-muted-foreground">
										المسؤول القانوني الأول لمتابعة وتواصل الطالب {patient.name}
									</p>
								</div>
							</div>

							{/* قنوات التواصل المباشرة السريعة */}
							{guardianPhone && (
								<div className="flex items-center gap-2 flex-wrap shrink-0">
									<a
										href={`tel:${guardianPhone}`}
										className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
										title="اتصال هاتفي مباشر"
									>
										<IconPhone className="size-3.5" />
										<span>اتصال</span>
									</a>

									<a
										href={`https://wa.me/${cleanPhone}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-semibold shadow-2xs transition-colors"
										title="مراسلة عبر واتساب"
									>
										<IconBrandWhatsapp className="size-4" />
										<span>واتساب</span>
									</a>

									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-8 text-xs gap-1"
										onClick={() => {
											navigator.clipboard.writeText(guardianPhone);
											toast.success("تم نسخ رقم هاتف ولي الأمر");
										}}
									>
										<IconCopy className="size-3.5" />
										<span>نسخ</span>
									</Button>
								</div>
							)}
						</div>

						<Separator />

						{/* شبكة البيانات الشاملة لولي الأمر */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
							{/* رقم الهاتف الأساسي */}
							<InfoField
								label="رقم الهاتف الأساسي"
								icon={<IconPhone className="size-3.5 text-primary" />}
							>
								{guardianPhone ? (
									<div className="flex items-center justify-between gap-2">
										<span
											className="font-mono tabular-nums text-xs font-bold"
											dir="ltr"
										>
											{guardianPhone}
										</span>
										<a
											href={`tel:${guardianPhone}`}
											className="text-[11px] text-primary hover:underline"
										>
											اتصال
										</a>
									</div>
								) : (
									<span className="text-muted-foreground text-xs">غير مسجل</span>
								)}
							</InfoField>

							{/* البريد الإلكتروني */}
							<InfoField
								label="البريد الإلكتروني"
								icon={<IconMail className="size-3.5 text-primary" />}
							>
								{guardianEmail ? (
									<div className="flex items-center justify-between gap-2">
										<a
											href={`mailto:${guardianEmail}`}
											className="text-xs text-primary hover:underline truncate max-w-[170px]"
											dir="ltr"
											title={guardianEmail}
										>
											{guardianEmail}
										</a>
										<button
											type="button"
											className="text-muted-foreground hover:text-foreground cursor-pointer"
											onClick={() => {
												navigator.clipboard.writeText(guardianEmail);
												toast.success("تم نسخ البريد الإلكتروني");
											}}
											title="نسخ البريد"
										>
											<IconCopy className="size-3" />
										</button>
									</div>
								) : (
									<span className="text-muted-foreground text-xs">غير مسجل</span>
								)}
							</InfoField>

							{/* صلة القرابة */}
							<InfoField
								label="صلة القرابة"
								icon={<IconUsers className="size-3.5 text-primary" />}
							>
								<span className="text-xs font-semibold">
									{formatRel(guardianRelationship)}
								</span>
							</InfoField>

							{/* العنوان ومكان الإقامة */}
							<InfoField
								label="العنوان ومكان الإقامة"
								icon={<IconMapPin className="size-3.5 text-primary" />}
							>
								<span
									className="text-xs font-medium truncate"
									title={guardianAddress}
								>
									{guardianAddress}
								</span>
							</InfoField>

							{/* رقم وجهة الطوارئ */}
							<InfoField
								label="رقم وجهة الطوارئ"
								icon={<IconPhoneCall className="size-3.5 text-primary" />}
							>
								<span className="text-xs font-medium">
									{patient.emergencyContactName && patient.emergencyContactPhone
										? `${patient.emergencyContactName} (${patient.emergencyContactPhone})`
										: patient.emergencyContactPhone || patient.emergencyContactName || "—"}
								</span>
							</InfoField>

							{/* كود ولي الأمر بالنظام */}
							<InfoField
								label="كود الحساب في النظام"
								icon={<IconId className="size-3.5 text-primary" />}
							>
								<span className="text-xs font-mono font-bold">
									{patient.owner?.code || "—"}
								</span>
							</InfoField>

							{/* تاريخ التسجيل */}
							{patient.owner?.createdAt && (
								<InfoField
									label="تاريخ تسجيل الحساب"
									icon={<IconCalendarCheck className="size-3.5 text-primary" />}
								>
									<span className="text-xs font-medium tabular-nums">
										{new Date(patient.owner.createdAt).toLocaleDateString("ar-EG", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</InfoField>
							)}

							{/* ملاحظات ولي الأمر */}
							<InfoField
								label="ملاحظات ولي الأمر"
								icon={<IconFileText className="size-3.5 text-primary" />}
							>
								<span className="text-xs text-muted-foreground truncate" title={patient.owner?.notes || "لا توجد ملاحظات"}>
									{patient.owner?.notes || "لا توجد ملاحظات مسجلة"}
								</span>
							</InfoField>
						</div>
					</div>
				);
			})()}

			{/* بطاقة وثيقة التأمين */}
			<div className="flex flex-col gap-2">
				<PatientPolicyCard patientId={patient.id} />
			</div>
		</TabsContent>
	);
}

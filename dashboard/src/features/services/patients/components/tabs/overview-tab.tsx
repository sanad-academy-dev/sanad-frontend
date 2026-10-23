import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconBus,
	IconCertificate,
	IconClockHour4,
	IconCoins,
	IconDeviceLaptop,
	IconMapPin,
	IconScale,
	IconSchool,
	IconShieldCheck,
	IconUser,
	IconUsers,
	IconWeight,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
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
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TRANSPORT_OPTIONS } from "@/features/services/patients/data/patient-form-constants";
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
	const [localValue, setLocalValue] = useState(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const isCommittingRef = useRef(false);

	useEffect(() => {
		setLocalValue(value);
		if (!editing) setDraft(value != null ? String(value) : "");
	}, [value, editing]);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	function commit() {
		if (isCommittingRef.current) return;
		isCommittingRef.current = true;
		const next = draft.trim();
		const current = localValue != null ? String(localValue).trim() : "";
		if (next !== current) {
			const finalVal = next === "" ? null : next;
			setLocalValue(finalVal);
			onSave(finalVal);
		}
		setEditing(false);
		setTimeout(() => {
			isCommittingRef.current = false;
		}, 100);
	}

	function cancel() {
		setDraft(localValue != null ? String(localValue) : "");
		setEditing(false);
	}

	if (!editing) {
		const display = localValue != null && localValue !== "" ? localValue : null;
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				dir={dir}
				className={cn(
					"text-start w-full rounded px-1 -mx-1 hover:bg-muted/70 transition-colors cursor-pointer group flex items-center justify-between gap-1",
					displayClassName,
				)}
				title="اضغط للتعديل"
			>
				{display !== null ? (
					<span>{display}</span>
				) : (
					<span className="text-muted-foreground/70">{placeholder}</span>
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
			className={cn("h-8 bg-background ", className)}
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
	const [localValue, setLocalValue] = useState(value);
	const ref = useRef<HTMLTextAreaElement>(null);
	const isCommittingRef = useRef(false);

	useEffect(() => {
		setLocalValue(value);
		if (!editing) setDraft(value ?? "");
	}, [value, editing]);

	useEffect(() => {
		if (editing && ref.current) {
			ref.current.focus();
			ref.current.selectionStart = ref.current.value.length;
		}
	}, [editing]);

	function commit() {
		if (isCommittingRef.current) return;
		isCommittingRef.current = true;
		const next = draft.trim();
		const current = (localValue ?? "").trim();
		if (next !== current) {
			const finalVal = next === "" ? null : next;
			setLocalValue(finalVal);
			onSave(finalVal);
		}
		setEditing(false);
		setTimeout(() => {
			isCommittingRef.current = false;
		}, 100);
	}

	function cancel() {
		setDraft(localValue ?? "");
		setEditing(false);
	}

	if (!editing) {
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				className="text-start w-full rounded px-1 -mx-1 hover:bg-muted/70 transition-colors cursor-pointer text-sm"
				title="اضغط لتعديل الملاحظات"
			>
				{localValue ? (
					<span className="whitespace-pre-wrap">{localValue}</span>
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
				className="min-h-[80px] text-sm bg-background"
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
	const { patient, isLoading } = usePatient(patientId);
	const { autosave } = useAutosavePatient(patientId);

	function patch(data: PatientAutosaveInput) {
		autosave(data);
	}

	if (!patientId || (isLoading && !patient)) {
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
				<div className="flex items-center gap-2 px-1">
					<IconUser className="size-4 text-blue-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">البيانات الحيوية والأساسية</h3>
				</div>
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
						<EditableText
							value={patient.weight}
							placeholder="—"
							type="number"
							onSave={(v) => patch({ weight: v != null && v !== "" ? Number(v) : null })}
							displayClassName="tabular-nums"
						/>
					</InfoField>
				</div>
			</div>

			{/* المصروفات والخدمات الأكاديمية */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconSchool className="size-4 text-amber-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">المصروفات والخدمات الأكاديمية</h3>
				</div>
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
						<Select
							value={patient.transportation || ""}
							onValueChange={(val) => patch({ transportation: val })}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="w-full justify-between text-xs h-7 border-0 bg-transparent hover:bg-muted/70 transition-colors px-1 -mx-1 shadow-none font-medium"
							>
								<SelectValue placeholder="اختر وسيلة النقل..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{TRANSPORT_OPTIONS.map((opt) => (
									<SelectItem
										key={opt}
										value={opt}
										className="text-xs"
									>
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
						<EditableText
							value={patient.level}
							placeholder="مبتدئ"
							onSave={(v) => patch({ level: v })}
						/>
					</InfoField>

					<InfoField
						label="طريقة التعلم"
						icon={<IconDeviceLaptop className="size-3.5" />}
					>
						<EditableText
							value={patient.learningMethod}
							placeholder="حضوري"
							onSave={(v) => patch({ learningMethod: v })}
						/>
					</InfoField>

					<InfoField
						label="المناوبة المفضلة"
						icon={<IconClockHour4 className="size-3.5" />}
					>
						<EditableText
							value={patient.preferredShift}
							placeholder="صباحي"
							onSave={(v) => patch({ preferredShift: v })}
						/>
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


			{/* بطاقة وثيقة التأمين */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconShieldCheck className="size-4 text-emerald-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">وثيقة التأمين الصحي</h3>
				</div>
				<PatientPolicyCard patientId={patient.id} />
			</div>
		</TabsContent>
	);
}

import { IconCake, IconPaw, IconScale, IconUsers, IconWeight } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type PatientAutosaveInput,
	useAutosavePatient,
} from "@/features/services/patients/hooks/use-autosave-patient";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { cn } from "@/lib/utils";
import type { PatientResponse } from "@/server/patients/patients.type";

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
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
	const { animalTypes } = useAnimalTypes();
	const { strains } = useAnimalStrains();

	const filteredStrains = patient?.animalType?.id
		? strains.filter((s) => s.animalTypeId === patient.animalType?.id)
		: [];

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
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary primarytext-sm font-semibold">
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

			<div className="flex flex-col gap-3">
				<p className="font-bold text-base">نظرة عامة</p>
				<div className="grid grid-cols-2 gap-3">
					<InfoField
						label="نوع الطفل"
						icon={<IconPaw className="size-3.5" />}
					>
						<Select
							value={patient.animalType?.id ?? undefined}
							onValueChange={(value) => patch({ animalTypeId: value })}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="h-7 border-0 bg-transparent px-0 shadow-none hover:bg-muted/60 focus:ring-0 font-medium"
							>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								{animalTypes.map((type) => (
									<SelectItem
										key={type.id}
										value={type.id}
									>
										{type.arName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</InfoField>

					<InfoField
						label="السلالة"
						icon={<IconPaw className="size-3.5" />}
					>
						<Select
							value={patient.animalStrain?.id ?? undefined}
							onValueChange={(value) => patch({ animalStrainId: value })}
							disabled={!patient.animalType?.id}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="h-7 border-0 bg-transparent px-0 shadow-none hover:bg-muted/60 focus:ring-0 font-medium"
							>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								{filteredStrains.map((strain) => (
									<SelectItem
										key={strain.id}
										value={strain.id}
									>
										{strain.arName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</InfoField>

					<InfoField
						label="الجنس"
						icon={<IconPaw className="size-3.5" />}
					>
						<Select
							value={patient.gender ?? undefined}
							onValueChange={(value) =>
								patch({ gender: value as PatientAutosaveInput["gender"] })
							}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="h-7 border-0 bg-transparent px-0 shadow-none hover:bg-muted/60 focus:ring-0 font-medium"
							>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="MALE">ذكر</SelectItem>
								<SelectItem value="FEMALE">أنثى</SelectItem>
							</SelectContent>
						</Select>
					</InfoField>

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

					{/*
					  تاريخ الميلاد ليس تكرارًا للعمر: العمر رقم حرّ يشيخ في مكانه، بينما
					  جدولة التطعيم بالعمر («الجرعة الأولى في الأسبوع السادس») لا تُشتق إلا
					  من تاريخ. غيابه يُبقي الطفل خارج طابور الجرعات المستحقة.
					*/}
					<InfoField
						label="تاريخ الميلاد"
						icon={<IconCake className="size-3.5" />}
					>
						<EditableText
							value={
								patient.birthDate
									? new Date(patient.birthDate).toISOString().slice(0, 10)
									: null
							}
							placeholder="—"
							type="date"
							dir="ltr"
							onSave={(v) => patch({ birthDate: v })}
							displayClassName="tabular-nums"
						/>
					</InfoField>

					{/*
					  الوزن للقراءة فقط: مرآة لآخر قياس مسجّل في تبويب العلامات الحيوية.
					  تركه قابلًا للتحرير يجعل كاتبَين لرقم واحد فينتهي الملف مخالفًا
					  للسجل (docs/vital-signs-plan.md §10-C).
					*/}
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
		</TabsContent>
	);
}

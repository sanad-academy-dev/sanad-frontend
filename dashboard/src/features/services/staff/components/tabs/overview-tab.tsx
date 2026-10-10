import { IconBriefcase, IconClipboard, IconCoin, IconStar } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

import { DateField } from "@/components/common/date-field";
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
import { useAutosaveStaff } from "@/features/services/staff/hooks/use-autosave-staff";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffScheduling } from "@/features/services/staff/hooks/use-staff-scheduling";
import { useStaffServices } from "@/features/services/staff/hooks/use-staff-services";
import { useUpdateStaffSchedulingSettings } from "@/features/services/staff/hooks/use-update-staff-scheduling-settings";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";
import { cn } from "@/lib/utils";
import type { StaffResponse, UpdateStaffInput } from "@/server/staff/staff.type";
import type { StaffShift } from "@/server/staff-scheduling/staff-scheduling.type";

const SHIFT_OPTIONS: { value: StaffShift; label: string }[] = [
	{ value: "MORNING", label: "صباحي" },
	{ value: "EVENING", label: "مسائي" },
	{ value: "BOTH", label: "صباحي ومسائي" },
];

// تحويل التاريخ القادم من الخادم إلى "yyyy-MM-dd" لحقول التاريخ
function toISODate(value: Date | string | null | undefined): string {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

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
}: {
	value: string | null | undefined;
	placeholder: string;
	onSave: (v: string | null) => void;
	className?: string;
	displayClassName?: string;
	dir?: "ltr" | "rtl";
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value ?? "");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
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
				dir={dir}
				className={cn(
					"text-start w-full rounded px-1 -mx-1 hover:bg-muted/60",
					displayClassName,
				)}
			>
				{value ? (
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

function EditableBio({
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
					<span className="text-muted-foreground">أضف نبذة...</span>
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

export function OverviewTab({ staffId }: StaffTabProps) {
	const { staff: allStaff, isLoading: isLoadingStaff } = useStaff();
	const staff: StaffResponse | undefined = allStaff.find((s) => s.id === staffId);
	const { autosave } = useAutosaveStaff(staffId);

	const { services, isLoading: isLoadingServices } = useStaffServices(staffId);
	const { scheduling } = useStaffScheduling(staffId);
	const { updateSettings } = useUpdateStaffSchedulingSettings(staffId);

	const activeServicesCount = services.filter((s) => s.isActive).length;
	const shift = scheduling?.settings.shift ?? null;

	function patch<K extends keyof UpdateStaffInput>(field: K, value: UpdateStaffInput[K]) {
		autosave({ [field]: value } as UpdateStaffInput);
	}

	if (!staffId || (isLoadingStaff && !staff)) {
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

	if (!staff) {
		return (
			<TabsContent
				value="overview"
				className="m-0 p-4"
				dir="rtl"
			>
				<p className="text-sm text-muted-foreground">الموظف غير موجود</p>
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
					{getInitials(staff.name)}
				</div>
				<div className="flex flex-col gap-2 flex-1 min-w-0">
					<EditableText
						value={staff.name}
						placeholder="اسم الموظف"
						onSave={(v) => patch("name", v ?? "")}
						displayClassName="font-bold text-base"
					/>
					<div className="flex flex-col gap-1">
						<p className="text-xs text-muted-foreground">نبذة</p>
						<EditableBio
							value={staff.bio}
							onSave={(v) => patch("bio", v)}
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<StatCard
					icon={<IconClipboard className="size-4" />}
					label="إجمالي الدورات"
					value={isLoadingServices ? "…" : activeServicesCount.toLocaleString()}
				/>
				<StatCard
					icon={<IconCoin className="size-4" />}
					label="الإيرادات"
					value="0"
				/>
				<StatCard
					icon={<IconStar className="size-4" />}
					label="تقييم رضا العملاء"
					value="—"
					subtitle="(لا توجد تقييمات)"
				/>
			</div>

			<div className="flex flex-col gap-3">
				<p className="font-bold text-base">نظرة عامة</p>
				<div className="grid grid-cols-2 gap-3">
					<InfoField
						label="التخصص الدقيق"
						icon={<IconBriefcase className="size-3.5" />}
					>
						{staff.primarySpecialization?.name ?? (
							<span className="text-muted-foreground font-normal">—</span>
						)}
					</InfoField>

					<InfoField
						label="الدوام"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<Select
							value={shift ?? undefined}
							onValueChange={(value) => updateSettings({ shift: value as StaffShift })}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="h-7 border-0 bg-transparent px-0 shadow-none hover:bg-muted/60 focus:ring-0 font-medium"
							>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								{SHIFT_OPTIONS.map((opt) => (
									<SelectItem
										key={opt.value}
										value={opt.value}
									>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</InfoField>

					<InfoField
						label="البريد الإلكتروني"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<span dir="ltr">{staff.email}</span>
					</InfoField>

					<InfoField
						label="رقم الجوال"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<EditableText
							value={staff.phone}
							placeholder="—"
							onSave={(v) => patch("phone", v)}
							dir="ltr"
							displayClassName="tabular-nums"
						/>
					</InfoField>

					<InfoField
						label="الجنسية"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<EditableText
							value={staff.nationality}
							placeholder="—"
							onSave={(v) => patch("nationality", v)}
						/>
					</InfoField>

					<InfoField
						label="المؤهل العلمي"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<EditableText
							value={staff.educationalQualification}
							placeholder="—"
							onSave={(v) => patch("educationalQualification", v)}
						/>
					</InfoField>

					<InfoField
						label="تاريخ التوظيف"
						icon={<IconBriefcase className="size-3.5" />}
					>
						<DateField
							value={toISODate(staff.hireDate)}
							onChange={(v) => patch("hireDate", v)}
							placeholder="—"
							disabled={{ after: new Date() }}
							className="h-7 border-0 px-0 shadow-none hover:bg-muted/60"
						/>
					</InfoField>
				</div>
			</div>
		</TabsContent>
	);
}

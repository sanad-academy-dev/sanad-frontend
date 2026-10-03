import { IconSearch, IconUsersGroup } from "@tabler/icons-react";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type ReactNode, useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import type {
	AssignmentResponse,
	EligibleLearnerResponse,
} from "@/server/course-assignments/course-assignments.type";
import {
	useAssignmentActions,
	useAutoAssignRules,
	useCourseRoster,
	useEligibleLearners,
} from "../hooks/use-course-assignments";
import { AssignAutoRulesDialog } from "./assign-auto-rules-dialog";

const ALL = "__ALL__";

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

function StaffAvatar({
	name,
	avatar,
	className,
}: {
	name: string;
	avatar?: string | null;
	className?: string;
}) {
	return (
		<Avatar className={className ?? "size-8"}>
			<AvatarImage
				src={getFileUrl(avatar) ?? undefined}
				alt={name}
			/>
			<AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
		</Avatar>
	);
}

// فلتر combobox مفرد مع خيار «الكل»
function FilterCombobox({
	value,
	onChange,
	placeholder,
	options,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
	options: [string, string][];
}) {
	const { isRtl } = useI18n();
	const label = value === ALL ? placeholder : options.find(([id]) => id === value)?.[1];
	return (
		<Combobox
			value={value}
			onValueChange={(v) => onChange(typeof v === "string" ? v : ALL)}
		>
			<ComboboxTrigger className="flex h-9 w-[150px] items-center justify-between rounded-lg border border-input bg-transparent px-3 text-xs">
				<ComboboxValue
					placeholder={placeholder}
					className="truncate"
				>
					{label}
				</ComboboxValue>
			</ComboboxTrigger>
			<ComboboxContent dir={isRtl ? "rtl" : "ltr"}>
				<ComboboxList>
					<ComboboxItem value={ALL}>{placeholder}</ComboboxItem>
					{options.map(([id, name]) => (
						<ComboboxItem
							key={id}
							value={id}
						>
							{name}
						</ComboboxItem>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export function AssignLearnersStep({
	courseId,
	children,
}: {
	courseId: string;
	// قسم إضافي يُعرض أسفل الجدول داخل نفس الحاوية القابلة للتمرير (وقت الدورة)
	children?: ReactNode;
}) {
	const { learners, isLoading } = useEligibleLearners(courseId);
	const { roster } = useCourseRoster(courseId);
	const { assign, unassign, enrollAll } = useAssignmentActions(courseId);
	const { rules, saveRules, isSaving } = useAutoAssignRules(courseId);

	const [search, setSearch] = useState("");
	const [branchFilter, setBranchFilter] = useState(ALL);
	const [roleFilter, setRoleFilter] = useState(ALL);
	const [autoOpen, setAutoOpen] = useState(false);

	// staffId → assignmentId (لإلغاء التعيين) — الروستر هو مصدر التحديد
	const assignedMap = useMemo(() => new Map(roster.map((a) => [a.staffId, a.id])), [roster]);

	const branchOptions = useMemo(() => {
		const m = new Map<string, string>();
		for (const l of learners) if (l.branch) m.set(l.branch.id, l.branch.name);
		return [...m.entries()];
	}, [learners]);
	const roleOptions = useMemo(() => {
		const m = new Map<string, string>();
		for (const l of learners) if (l.role) m.set(l.role.id, l.role.name);
		return [...m.entries()];
	}, [learners]);

	const filtered = useMemo(() => {
		const q = search.trim();
		return learners
			.filter((l) => (q ? l.name.includes(q) : true))
			.filter((l) => (branchFilter === ALL ? true : l.branch?.id === branchFilter))
			.filter((l) => (roleFilter === ALL ? true : l.role?.id === roleFilter))
			.sort((a, b) => a.name.localeCompare(b.name, "ar"));
	}, [learners, search, branchFilter, roleFilter]);

	const toggle = (learner: EligibleLearnerResponse) => {
		const assignmentId = assignedMap.get(learner.id);
		if (assignmentId) unassign(assignmentId);
		else assign(learner);
	};
	const clearAll = () => {
		for (const a of roster) unassign(a.id);
	};

	const columns = useMemo<ColumnDef<EligibleLearnerResponse>[]>(
		() => [
			{
				id: "select",
				// المقاسات نِسَب لا بكسلات: الجدول table-fixed w-full فيوزّع العرض تناسبيًّا.
				// 36 مقابل 520/220/220 يعطي عمودًا بعرض ~28px (مربّع 16 + حشوة الخليّة).
				size: 36,
				header: () => <span className="sr-only">تحديد</span>,
				cell: ({ row }) => (
					<Checkbox
						checked={assignedMap.has(row.original.id)}
						className="pointer-events-none"
						aria-hidden
					/>
				),
			},
			{
				accessorKey: "name",
				header: "الموظف",
				size: 520,
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<StaffAvatar
							name={row.original.name}
							avatar={row.original.avatar}
						/>
						<span className="text-sm font-medium text-foreground">{row.original.name}</span>
					</div>
				),
			},
			{
				id: "role",
				header: "القسم",
				size: 220,
				cell: ({ row }) =>
					row.original.role ? (
						<Badge variant="secondary">{row.original.role.name}</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: "branch",
				header: "الفرع",
				size: 220,
				cell: ({ row }) =>
					row.original.branch ? (
						<span className="text-sm text-muted-foreground">{row.original.branch.name}</span>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: "spec",
				header: "التخصص",
				cell: ({ row }) =>
					row.original.primarySpecialization ? (
						<Badge variant="outline">{row.original.primarySpecialization.name}</Badge>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
		],
		[assignedMap],
	);

	const table = useReactTable({
		data: filtered,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4">
			{/* الترويسة + العدّاد */}
			<div className="flex items-center justify-between gap-3">
				<div className="flex flex-col gap-0.5">
					<h2 className="text-[14px] font-bold text-foreground">اختيار الموظفين</h2>
					<p className="text-[11px] text-muted-foreground">
						الموظفون المؤهلون: {learners.length}
					</p>
				</div>
				<div className="flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5">
					<span className="text-xs text-muted-foreground">تعيين تلقائي</span>
					<Switch
						checked={rules.length > 0}
						onCheckedChange={() => setAutoOpen(true)}
					/>
				</div>
			</div>

			{/* شريط المعيَّنين المختصر */}
			<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
				<div className="flex items-center gap-2">
					{roster.length > 0 ? (
						<AvatarGroup>
							{roster.slice(0, 5).map((a: AssignmentResponse) => (
								<StaffAvatar
									key={a.id}
									name={a.staff.name}
									avatar={a.staff.avatar}
									className="size-7"
								/>
							))}
							{roster.length > 5 && <AvatarGroupCount>+{roster.length - 5}</AvatarGroupCount>}
						</AvatarGroup>
					) : (
						<span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
							<IconUsersGroup className="size-4" />
						</span>
					)}
					<span className="text-xs font-medium text-foreground">
						{roster.length} موظف معيّن
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={enrollAll}
						className="h-7 text-xs"
					>
						تسجيل الجميع
					</Button>
					{roster.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={clearAll}
							className="h-7 text-xs text-destructive"
						>
							إلغاء تحديد الكل
						</Button>
					)}
				</div>
			</div>

			{/* شريط الأدوات: بحث + فلاتر */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-[200px] flex-1">
					<IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="ابحث عن موظف بالاسم..."
						className="h-9 ps-9 text-xs"
					/>
				</div>
				<FilterCombobox
					value={branchFilter}
					onChange={setBranchFilter}
					placeholder="كل الفروع"
					options={branchOptions}
				/>
				<FilterCombobox
					value={roleFilter}
					onChange={setRoleFilter}
					placeholder="كل الأقسام"
					options={roleOptions}
				/>
			</div>

			{/* جدول الموظفين القابل للتحديد */}
			<div className="overflow-hidden rounded-lg border border-border bg-card">
				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					pagination={false}
					onRowClick={(row) => toggle(row.original)}
					emptyState={{
						title: "لا يوجد موظفون مطابقون",
						description: "غيّر عوامل التصفية أو أضف موظفين للأكاديمية.",
					}}
				/>
			</div>

			{/* قسم «وقت الدورة» — يُمرَّر من اللوحة الجانبية ويظهر أسفل الجدول */}
			{children}

			<AssignAutoRulesDialog
				open={autoOpen}
				onOpenChange={setAutoOpen}
				rules={rules}
				onSave={(next) => {
					saveRules(next);
					setAutoOpen(false);
				}}
				isSaving={isSaving}
			/>
		</div>
	);
}

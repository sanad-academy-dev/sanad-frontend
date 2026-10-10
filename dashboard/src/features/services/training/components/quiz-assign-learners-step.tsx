import {
	IconAlertCircle,
	IconCalendar,
	IconSearch,
	IconUsersGroup,
} from "@tabler/icons-react";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { arSA } from "date-fns/locale";
import { useMemo, useState } from "react";

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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	useEligibleQuizLearners,
	useQuizAssignmentActions,
	useQuizRoster,
} from "@/features/services/training/hooks/use-quiz-assignments";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { EligibleQuizLearnerResponse } from "@/server/quiz-assignments/quiz-assignments.type";

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

const fmtDate = (d: Date) =>
	new Intl.DateTimeFormat("ar-SA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(d);

// منتقي تاريخ ضمن popover — تاريخ فقط (اختياري)
function DateField({
	label,
	value,
	onChange,
	invalid,
}: {
	label: string;
	value: Date | null;
	onChange: (d: Date | null) => void;
	invalid?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-1 flex-col gap-1.5">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						className={cn(
							"h-10 justify-start gap-2 text-[13px] font-normal",
							!value && "text-muted-foreground",
							invalid && "border-destructive",
						)}
					>
						<IconCalendar className="size-4" />
						{value ? fmtDate(value) : "اختر التاريخ (اختياري)"}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					<Calendar
						mode="single"
						locale={arSA}
						selected={value ?? undefined}
						onSelect={(d) => {
							onChange(d ?? null);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

// خطوة «تعيين الموظفين» للاختبار — جدول اختيار + شريط المعيَّنين + تسجيل الجميع + تواريخ اختيارية.
// مبنيّة على نفس نمط خطوة متدربي الدورة لكنها مربوطة بتعيينات الاختبار (بلا مساس بسلوك خطوة الدورة).
export function QuizAssignLearnersStep({ quizId }: { quizId: string }) {
	const { learners, isLoading } = useEligibleQuizLearners(quizId);
	const { roster } = useQuizRoster(quizId);
	const { assign, unassign, enrollAll } = useQuizAssignmentActions(quizId);

	const [search, setSearch] = useState("");
	const [start, setStart] = useState<Date | null>(null);
	const [due, setDue] = useState<Date | null>(null);

	// due > start فقط عندما يكون كلاهما محدَّدًا
	const datesInvalid = !!(start && due) && due.getTime() <= start.getTime();

	// staffId → assignmentId (لإلغاء التعيين) — الروستر هو مصدر التحديد
	const assignedMap = useMemo(() => new Map(roster.map((a) => [a.staffId, a.id])), [roster]);

	const window = useMemo(
		() => ({
			startDate: start && !datesInvalid ? start.toISOString() : undefined,
			dueDate: due && !datesInvalid ? due.toISOString() : undefined,
		}),
		[start, due, datesInvalid],
	);

	const filtered = useMemo(() => {
		const q = search.trim();
		return learners
			.filter((l) => (q ? l.name.includes(q) : true))
			.sort((a, b) => a.name.localeCompare(b.name, "ar"));
	}, [learners, search]);

	const toggle = (learner: EligibleQuizLearnerResponse) => {
		const assignmentId = assignedMap.get(learner.id);
		if (assignmentId) unassign(assignmentId);
		else assign(learner, window);
	};
	const clearAll = () => {
		for (const a of roster) unassign(a.id);
	};

	const columns = useMemo<ColumnDef<EligibleQuizLearnerResponse>[]>(
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
		],
		[assignedMap],
	);

	const table = useReactTable({
		data: filtered,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col gap-3">
			{/* الترويسة + العدّاد */}
			<div className="flex flex-col gap-0.5">
				<h2 className="text-[14px] font-bold text-foreground">تعيين الموظفين</h2>
				<p className="text-[11px] text-muted-foreground">
					الموظفون المؤهلون: {learners.length}
				</p>
			</div>

			{/* شريط المعيَّنين المختصر */}
			<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
				<div className="flex items-center gap-2">
					{roster.length > 0 ? (
						<AvatarGroup>
							{roster.slice(0, 5).map((a) => (
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

			{/* نافذة زمنية اختيارية (تُرفق بالتعيينات الجديدة) */}
			<div className="flex flex-col gap-1.5 rounded-lg border bg-card px-3 py-2.5">
				<span className="text-[11px] text-muted-foreground">
					نافذة زمنية اختيارية — تُطبَّق على التعيينات التي تضيفها بعد ضبطها.
				</span>
				<div className="flex flex-wrap items-end gap-3">
					<DateField
						label="تاريخ البدء"
						value={start}
						onChange={setStart}
						invalid={datesInvalid}
					/>
					<DateField
						label="تاريخ الاستحقاق"
						value={due}
						onChange={setDue}
						invalid={datesInvalid}
					/>
				</div>
				{datesInvalid && (
					<span className="flex items-center gap-1.5 text-[11px] font-medium text-destructive">
						<IconAlertCircle className="size-3.5" />
						تاريخ الاستحقاق يجب أن يكون بعد تاريخ البدء.
					</span>
				)}
			</div>

			{/* بحث */}
			<div className="relative">
				<IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="ابحث عن موظف بالاسم..."
					className="h-9 ps-9 text-xs"
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
						description: "غيّر البحث أو أضف موظفين للأكاديمية.",
					}}
				/>
			</div>
		</div>
	);
}

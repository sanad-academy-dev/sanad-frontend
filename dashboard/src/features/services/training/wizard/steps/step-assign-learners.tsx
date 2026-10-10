import { IconArrowsSort, IconCheck, IconSearch, IconUsersGroup } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { EligibleLearnerResponse } from "@/server/course-assignments/course-assignments.type";
import {
	useAssignmentActions,
	useAutoAssignRules,
	useCourseRoster,
	useEligibleLearners,
} from "../../hooks/use-course-assignments";
import { AutoAssignModal } from "./auto-assign-modal";
import { LearnerAvatar } from "./learner-avatar";

const ALL = "__ALL__";

// بطاقة موظف قابلة للتحديد — حدّ بنفسجي + علامة زاوية عند التحديد
function LearnerCard({
	learner,
	selected,
	onToggle,
}: {
	learner: EligibleLearnerResponse;
	selected: boolean;
	onToggle: () => void;
}) {
	const tags = [learner.role?.name, learner.primarySpecialization?.name].filter(Boolean);
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-pressed={selected}
			className={cn(
				"relative flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center transition-colors",
				selected
					? "border-primary ring-1 ring-primary"
					: "border-[#E7E7EE] hover:border-primary/40",
			)}
		>
			{selected && (
				// علامة الزاوية — في RTL نهاية السطر (يسار)
				<span className="absolute end-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-white">
					<IconCheck className="size-3.5" />
				</span>
			)}
			<LearnerAvatar
				name={learner.name}
				avatar={learner.avatar}
				className="size-12"
			/>
			<span className="line-clamp-1 text-[13px] font-semibold text-[#08090A]">
				{learner.name}
			</span>
			<div className="flex flex-wrap items-center justify-center gap-1">
				{tags.map((tag) => (
					<span
						key={tag}
						className="rounded-full bg-[#F0F0F5] px-2 py-0.5 text-[10px] font-medium text-[#6B6B67]"
					>
						{tag}
					</span>
				))}
			</div>
		</button>
	);
}

export function StepAssignLearners({ courseId }: { courseId: string }) {
	const { learners, isLoading } = useEligibleLearners(courseId);
	const { roster } = useCourseRoster(courseId);
	const { assign, unassign, enrollAll } = useAssignmentActions(courseId);
	const { rules, saveRules, isSaving } = useAutoAssignRules(courseId);

	const [search, setSearch] = useState("");
	const [branchFilter, setBranchFilter] = useState(ALL);
	const [roleFilter, setRoleFilter] = useState(ALL);
	const [sortDesc, setSortDesc] = useState(false);
	const [autoOpen, setAutoOpen] = useState(false);

	// staffId → assignmentId (لإلغاء التعيين) — من قائمة الروستر
	const assignedMap = useMemo(() => new Map(roster.map((a) => [a.staffId, a.id])), [roster]);

	// خيارات الفلاتر من بيانات الموظفين المحمّلة
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
			.sort((a, b) => (sortDesc ? -1 : 1) * a.name.localeCompare(b.name, "ar"));
	}, [learners, search, branchFilter, roleFilter, sortDesc]);

	const toggle = (learner: EligibleLearnerResponse) => {
		const assignmentId = assignedMap.get(learner.id);
		if (assignmentId) unassign(assignmentId);
		else assign(learner);
	};

	const clearAll = () => {
		for (const a of roster) unassign(a.id);
	};

	return (
		<div className="mx-auto flex w-full max-w-[1280px] gap-5 px-4 py-6">
			{/* ===== شبكة الاختيار (يمين في RTL) ===== */}
			<div className="flex min-w-0 flex-1 flex-col gap-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h2 className="text-[15px] font-bold text-[#08090A]">اختيار المتدربين</h2>
						<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
							المتدربون: {roster.length}
						</span>
					</div>
					<p className="text-[12px] text-[#6B6B67]">
						اختر الموظفين الذين سيلتحقون بالدورة، أو فعّل التعيين التلقائي بالقواعد.
					</p>
				</div>

				{/* شريط الأدوات: بحث + فلاتر + ترتيب + تعيين تلقائي */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="relative min-w-[220px] flex-1">
						<IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9D]" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ابحث عن موظف بالاسم..."
							className="h-9 ps-9 text-[12px]"
						/>
					</div>
					<Select
						dir="rtl"
						value={branchFilter}
						onValueChange={setBranchFilter}
					>
						<SelectTrigger className="h-9! w-[130px] text-[12px]">
							<SelectValue placeholder="الفرع" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>كل الفروع</SelectItem>
							{branchOptions.map(([id, name]) => (
								<SelectItem
									key={id}
									value={id}
								>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						dir="rtl"
						value={roleFilter}
						onValueChange={setRoleFilter}
					>
						<SelectTrigger className="h-9! w-[130px] text-[12px]">
							<SelectValue placeholder="القسم" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>كل الأقسام</SelectItem>
							{roleOptions.map(([id, name]) => (
								<SelectItem
									key={id}
									value={id}
								>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setSortDesc((v) => !v)}
						className="h-9 gap-1.5 rounded-lg text-[12px]"
					>
						<IconArrowsSort className="size-4" />
						ترتيب
					</Button>
					<div className="flex items-center gap-1.5 rounded-lg border border-[#E7E7EE] bg-white px-2.5 py-1.5">
						<span className="text-[12px] text-[#6B6B67]">تعيين تلقائي</span>
						<Switch
							checked={rules.length > 0}
							onCheckedChange={() => setAutoOpen(true)}
						/>
					</div>
				</div>

				{/* الشبكة */}
				{isLoading ? (
					<p className="py-12 text-center text-[12px] text-[#9B9B9D]">جارٍ التحميل...</p>
				) : filtered.length === 0 ? (
					<p className="py-12 text-center text-[12px] text-[#9B9B9D]">
						لا يوجد موظفون مطابقون.
					</p>
				) : (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{filtered.map((learner) => (
							<LearnerCard
								key={learner.id}
								learner={learner}
								selected={assignedMap.has(learner.id)}
								onToggle={() => toggle(learner)}
							/>
						))}
					</div>
				)}
			</div>

			{/* ===== لوحة المعيَّنين (يسار في RTL) — لاصقة ===== */}
			<aside className="sticky top-4 hidden h-fit w-[300px] shrink-0 flex-col gap-3 self-start rounded-2xl border border-[#E7E7EE] bg-white p-4 lg:flex">
				<div className="flex items-center justify-between">
					<span className="text-[13px] font-bold text-[#08090A]">
						المتدربون المعينون ({roster.length})
					</span>
					{roster.length > 0 && (
						<button
							type="button"
							onClick={clearAll}
							className="text-[11px] font-medium text-[#DC2626]"
						>
							إلغاء تحديد الكل
						</button>
					)}
				</div>

				{roster.length === 0 ? (
					<div className="flex flex-col items-center gap-3 py-8 text-center">
						<span className="flex size-12 items-center justify-center rounded-2xl bg-[#F0F0F5] text-[#9B9B9D]">
							<IconUsersGroup className="size-6" />
						</span>
						<p className="text-[12px] font-medium text-[#08090A]">لا يوجد متدربون معينون</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={enrollAll}
							className="h-8 rounded-lg text-[12px]"
						>
							تسجيل الجميع
						</Button>
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{roster.map((a) => (
							<div
								key={a.id}
								className="flex items-center gap-2 rounded-lg bg-[#FAFAFC] px-2 py-1.5"
							>
								<LearnerAvatar
									name={a.staff.name}
									avatar={a.staff.avatar}
									className="size-7"
								/>
								<span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#08090A]">
									{a.staff.name}
								</span>
								<button
									type="button"
									onClick={() => unassign(a.id)}
									aria-label="إزالة"
									className="shrink-0 text-[#9B9B9D] hover:text-[#DC2626]"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</aside>

			<AutoAssignModal
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

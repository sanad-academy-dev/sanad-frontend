import { IconSearch, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
	useAssignmentActions,
	useEligibleLearners,
} from "@/features/services/training/hooks/use-course-assignments";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { getFileUrl } from "@/lib/file-url";
import type { CourseListItemResponse } from "@/server/training/training.type";

const ALL = "__ALL__";

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

// دائرة صورة الموظف (بادئة الاسم أو الصورة)
function StaffAvatar({ name, avatar }: { name: string; avatar: string | null }) {
	const url = getFileUrl(avatar);
	return (
		<span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
			{url ? (
				<img
					src={url}
					alt={name}
					className="size-full object-cover"
				/>
			) : (
				initials(name)
			)}
		</span>
	);
}

// لوحة «تعيين موظف» — تنزلق من اليسار. اختيار مرحلي (بلا حفظ فوري) ثم يُلتزم بزر «تعيين».
export function AssignEmployeeDialog({
	course,
	onClose,
}: {
	course: CourseListItemResponse | null;
	onClose: () => void;
}) {
	const courseId = course?.id ?? null;
	const [search, setSearch] = useState("");
	// فلتر «كل الموظفين» حسب الفرع — يُطبَّق على الخادم
	const [branchFilter, setBranchFilter] = useState(ALL);
	// الاختيار المرحلي: staffId → الاسم (بلا حفظ حتى الضغط على «تعيين»)
	const [selected, setSelected] = useState<Map<string, string>>(new Map());

	const { learners, isLoading } = useEligibleLearners(
		courseId,
		branchFilter === ALL ? undefined : branchFilter,
	);
	const { assignMany, isAssigning } = useAssignmentActions(courseId);
	const { branches } = useBranches();

	// إعادة تهيئة الحالة عند فتح اللوحة لدورة جديدة
	const openedFor = useRef<string | null>(null);
	useEffect(() => {
		if (course && openedFor.current !== course.id) {
			openedFor.current = course.id;
			setSelected(new Map());
			setSearch("");
			setBranchFilter(ALL);
		}
		if (!course) openedFor.current = null;
	}, [course]);

	// أقسام (أدوار) الموظفين المؤهلين — تُستخدم في «تحديد سريع»
	const roleOptions = useMemo(() => {
		const m = new Map<string, string>();
		for (const l of learners) if (l.role) m.set(l.role.id, l.role.name);
		return [...m.entries()];
	}, [learners]);

	// البحث فقط يُصفّي القائمة (بالاسم أو المعرّف)
	const filtered = useMemo(() => {
		const q = search.trim();
		return learners
			.filter((l) => (q ? l.name.includes(q) || l.code.includes(q) : true))
			.sort((a, b) => a.name.localeCompare(b.name, "ar"));
	}, [learners, search]);

	const allFilteredSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.id));

	const toggle = (id: string, name: string) =>
		setSelected((prev) => {
			const next = new Map(prev);
			if (next.has(id)) next.delete(id);
			else next.set(id, name);
			return next;
		});

	const toggleAll = () =>
		setSelected((prev) => {
			const next = new Map(prev);
			if (allFilteredSelected) for (const l of filtered) next.delete(l.id);
			else for (const l of filtered) next.set(l.id, l.name);
			return next;
		});

	// تحديد سريع: إضافة جميع موظفي القسم إلى الاختيار (بلا حفظ فوري)
	const selectDept = (roleId: string) =>
		setSelected((prev) => {
			const next = new Map(prev);
			for (const l of learners) if (l.role?.id === roleId) next.set(l.id, l.name);
			return next;
		});

	// الالتزام: يحفظ التعيينات فعليًا في قاعدة البيانات ثم يعرض توست نجاح ويغلق اللوحة
	const commit = async () => {
		if (selected.size === 0) return;
		const names = [...selected.values()];
		try {
			await assignMany([...selected.keys()]);
			const label =
				names.length === 1 ? `(${names[0]})` : `(${names[0]} و ${names.length - 1} آخرين)`;
			showSuccessToast(`تم تعيين دورة تدريبية لـ ${label} بنجاح`, { iconAtStart: true });
			onClose();
		} catch {
			// الخطأ معروض كتوست داخل الـ mutation
		}
	};

	return (
		<Sheet
			open={!!course}
			onOpenChange={(o) => !o && onClose()}
		>
			{/* لوحة تنزلق من اليسار (side=left) بعرض 643px بحسب التصميم */}
			<SheetContent
				side="left"
				dir="rtl"
				className="flex w-full! flex-col gap-0 p-0 sm:max-w-[643px]!"
			>
				{/* الهيدر — في RTL أول عنصر يمين: العنوان ثم اسم الدورة */}
				<div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
					<SheetTitle className="text-[13px] font-bold text-foreground">تعيين موظف</SheetTitle>
					<span className="text-[#9B9B9D]">·</span>
					<span className="truncate text-[13px] font-bold text-foreground">
						{course?.name}
					</span>
				</div>

				{/* شريط البحث (يمين) + فلتر «كل الموظفين» حسب الفرع (يسار) */}
				<div className="flex shrink-0 items-center gap-2 px-3 pt-3">
					<div className="relative flex-1">
						<IconSearch className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#9B9B9D]" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="بحث بالاسم الموظف أو بالمعرّف..."
							className="h-[34px] ps-8 text-[11px]"
						/>
					</div>
					<Select
						dir="rtl"
						value={branchFilter}
						onValueChange={setBranchFilter}
					>
						<SelectTrigger className="h-[34px]! w-[160px] text-[11px]">
							<SelectValue placeholder="كل الموظفين" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>كل الموظفين</SelectItem>
							{branches.map((b) => (
								<SelectItem
									key={b.id}
									value={b.id}
								>
									{b.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* تحديد سريع: يضيف موظفي القسم إلى الاختيار (يعيد المنتقي لحالته الأصلية) */}
				<div className="flex shrink-0 flex-col gap-1.5 px-3 pt-3">
					<span className="text-[11px] font-medium text-foreground">
						تحديد سريع · القسم المستهدف
					</span>
					<Select
						dir="rtl"
						value=""
						onValueChange={(roleId) => roleId && selectDept(roleId)}
					>
						<SelectTrigger className="h-[34px]! w-full text-[11px]">
							<SelectValue placeholder="حدد القسم..." />
						</SelectTrigger>
						<SelectContent>
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
				</div>

				{/* رأس القائمة: العنوان + تحديد الكل */}
				<div className="flex shrink-0 items-center justify-between px-3 pt-3">
					<span className="text-[13px] font-bold text-foreground">الموظفون</span>
					<button
						type="button"
						onClick={toggleAll}
						className="flex items-center gap-1.5 text-[10px] font-medium text-foreground"
					>
						تحديد كل الموظفين ({filtered.length})
						<Checkbox
							checked={allFilteredSelected}
							aria-hidden
							className="pointer-events-none size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5]"
						/>
					</button>
				</div>

				{/* قائمة الموظفين */}
				<div className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
					{isLoading ? (
						<div className="flex justify-center py-10">
							<Spinner />
						</div>
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center gap-2 py-10 text-center">
							<IconUsersGroup className="size-6 text-[#9B9B9D]" />
							<p className="text-[12px] text-muted-foreground">لا يوجد موظفون مطابقون</p>
						</div>
					) : (
						<ul className="flex flex-col">
							{filtered.map((l) => (
								<li key={l.id}>
									<button
										type="button"
										onClick={() => toggle(l.id, l.name)}
										className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-start hover:bg-muted"
									>
										{/* في RTL أول عنصر يمين: مربّع الاختيار ثم الصورة ثم الاسم/الوصف */}
										<Checkbox
											checked={selected.has(l.id)}
											aria-hidden
											className="pointer-events-none size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5]"
										/>
										<StaffAvatar
											name={l.name}
											avatar={l.avatar}
										/>
										<div className="flex min-w-0 flex-1 flex-col">
											<span className="truncate text-[11px] font-medium text-foreground">
												{l.name}
											</span>
											<span className="truncate text-[9px] text-[#9B9B9D]">
												{[l.role?.name, l.code].filter(Boolean).join(" · ")}
											</span>
										</div>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* الفوتر — في RTL أول عنصر يمين: «إلغاء» يمينًا و«تعيين» يسارًا (space-between) */}
				<div className="flex shrink-0 items-center justify-between border-t px-4 py-2">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={onClose}
						className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium"
					>
						إلغاء
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={commit}
						disabled={selected.size === 0 || isAssigning}
						className="h-[26px] gap-1.5 rounded-[4px] px-3 text-[11px] font-semibold"
					>
						<IconUserPlus className="size-3.5" />
						تعيين{selected.size > 0 ? ` (${selected.size})` : ""}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

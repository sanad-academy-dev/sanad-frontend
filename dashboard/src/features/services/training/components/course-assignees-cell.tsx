import { IconUserPlus } from "@tabler/icons-react";
import { useMemo } from "react";

import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { StaffHoverCard, type StaffHoverData } from "@/components/common/hover-cards";
import { Button } from "@/components/ui/button";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import type { CourseListItemResponse } from "@sanad/contracts/runtime/server/training/training.type";

export interface CourseAssigneesCellProps {
	course: CourseListItemResponse;
	onAssign?: (course: CourseListItemResponse) => void;
	maxVisible?: number;
}

/**
 * خلية عرض الموظفين المعيّنين (المتدربين/المستفيدين) في جدول الدورات
 * تعرض مكدّس الأفاتار بألوان الباستيل الناعمة للمتعلمين (variant="pastel")
 * وتُظهر بطاقة تفاصيل الموظف (StaffHoverCard) عند التحويم، مع زر للتعيين والإدارة
 */
export function CourseAssigneesCell({
	course,
	onAssign,
	maxVisible = 3,
}: CourseAssigneesCellProps) {
	const { staff } = useStaff();

	const staffMap = useMemo(() => {
		const byId = new Map<string, (typeof staff)[number]>();
		const byName = new Map<string, (typeof staff)[number]>();
		for (const s of staff || []) {
			if (s.id) byId.set(s.id, s);
			if (s.name) byName.set(s.name.trim().toLowerCase(), s);
		}
		return { byId, byName };
	}, [staff]);

	const assignees = course.assignees || [];
	const count = course.assignedCount ?? assignees.length;

	if (count === 0 || assignees.length === 0) {
		return (
			<Button
				type="button"
				variant="outline"
				size="xs"
				onClick={(e) => {
					e.stopPropagation();
					onAssign?.(course);
				}}
				className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
				title="تعيين موظفين للدورة"
			>
				<IconUserPlus className="size-3 text-muted-foreground" />
				<span>تعيين موظفين</span>
			</Button>
		);
	}

	const items = assignees.map((a) => {
		const matched =
			staffMap.byId.get(a.id) || staffMap.byName.get(a.name?.trim().toLowerCase() || "");

		const hoverData: StaffHoverData = {
			id: a.id,
			name: matched?.name || a.name,
			image: matched?.avatar || a.avatar || null,
			phone: matched?.phone || a.phone || null,
			email: matched?.email || a.email || null,
			role: matched?.role?.name || a.role || "متدرب",
			branch: matched?.branch?.name || a.branch || null,
			employmentType: matched?.employmentType || a.employmentType || null,
			active: matched?.active !== undefined ? matched.active : a.active !== false,
		};

		return {
			id: a.id,
			name: hoverData.name,
			title: hoverData.name,
			image: hoverData.image,
			data: hoverData,
		};
	});

	return (
		<div
			className="flex items-center gap-2 select-none"
			dir="rtl"
		>
			<AvatarCirclesStack
				items={items}
				variant="pastel"
				maxVisible={maxVisible}
				renderItem={(item, element) => (
					<StaffHoverCard
						staff={(item.data as StaffHoverData | undefined) ?? {
							id: String(item.id),
							name: item.name,
						}}
					>
						{element}
					</StaffHoverCard>
				)}
			/>

			{onAssign ? (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onAssign(course);
					}}
					title="إدارة وتعيين الموظفين بالدورة"
					className="text-xs font-medium tabular-nums text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
				>
					{count} موظف
				</button>
			) : (
				<span className="text-xs font-medium tabular-nums text-muted-foreground">
					{count} موظف
				</span>
			)}
		</div>
	);
}

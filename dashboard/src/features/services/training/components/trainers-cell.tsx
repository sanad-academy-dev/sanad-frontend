import { useMemo } from "react";

import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { StaffHoverCard, type StaffHoverData } from "@/components/common/hover-cards";
import { useStaff } from "@/features/services/staff/hooks/use-staff";

export interface TrainerMember {
	id: string;
	name: string;
	avatar?: string | null;
	phone?: string | null;
	email?: string | null;
	role?: string | null;
	branch?: string | null;
	employmentType?: string | null;
	active?: boolean;
}

export interface TrainersCellProps {
	trainers?: TrainerMember[] | null;
	totalCount?: number;
	maxVisible?: number;
	emptyText?: string;
}

/**
 * خلية عرض المدربين الموحدة للمسارات والدورات التدريبية
 * تعرض مكدّس الأفاتار بنفس ثيم المنصة (variant="mauve")
 * وتُظهر بطاقة تفاصيل الموظف (StaffHoverCard) عند التحويم (Hover)
 */
export function TrainersCell({
	trainers,
	totalCount,
	maxVisible = 3,
	emptyText = "—",
}: TrainersCellProps) {
	const { staff } = useStaff();

	// خرائط مطابقة سريعة بالمعرّف والاسم لتوفير أحدث بيانات الموظف (الهاتف، البريد، الفرع، نوع الدوام، الدور)
	const staffMap = useMemo(() => {
		const byId = new Map<string, (typeof staff)[number]>();
		const byName = new Map<string, (typeof staff)[number]>();
		for (const s of staff || []) {
			if (s.id) byId.set(s.id, s);
			if (s.name) byName.set(s.name.trim().toLowerCase(), s);
		}
		return { byId, byName };
	}, [staff]);

	if (!trainers || trainers.length === 0) {
		return <span className="text-xs text-muted-foreground">{emptyText}</span>;
	}

	const items = trainers.map((t) => {
		const matched =
			staffMap.byId.get(t.id) || staffMap.byName.get(t.name?.trim().toLowerCase() || "");

		const hoverData: StaffHoverData = {
			id: t.id,
			name: matched?.name || t.name,
			image: matched?.avatar || t.avatar || null,
			phone: matched?.phone || t.phone || null,
			email: matched?.email || t.email || null,
			role: matched?.role?.name || t.role || "TEACHER",
			branch: matched?.branch?.name || t.branch || null,
			employmentType: matched?.employmentType || t.employmentType || null,
			active: matched?.active !== undefined ? matched.active : t.active !== false,
		};

		return {
			id: t.id,
			name: hoverData.name,
			title: hoverData.name,
			image: hoverData.image,
			data: hoverData,
		};
	});

	return (
		<AvatarCirclesStack
			items={items}
			totalCount={totalCount}
			variant="mauve"
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
	);
}

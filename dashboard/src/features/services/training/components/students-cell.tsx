import { useMemo } from "react";
import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { StudentHoverCard, type StudentHoverData } from "@/components/common/hover-cards";
import { usePatients } from "@/features/services/patients/hooks/use-patients";

export interface StudentMember {
	id: string;
	name?: string;
	code?: string | null;
	avatar?: string | null;
	gender?: string | null;
	age?: number | null;
	classroom?: string | null;
	phone?: string | null;
}

export interface StudentsCellProps {
	students?: StudentMember[] | null;
	studentIds?: string[] | null;
	totalCount?: number;
	maxVisible?: number;
	emptyText?: string;
	onClick?: (e: React.MouseEvent) => void;
}

/**
 * خلية عرض الطلاب الموحدة لجدول المسارات
 * تعرض مكدّس الأفاتار دائماً بنفس مظهر وثيم المدربين (variant="mauve")
 * وتُظهر بطاقة تفاصيل الطالب (StudentHoverCard) عند التحويم (Hover)
 */
export function StudentsCell({
	students,
	studentIds,
	totalCount,
	maxVisible = 3,
	emptyText = "—",
	onClick,
}: StudentsCellProps) {
	const { patients } = usePatients();

	const patientsMap = useMemo(() => {
		const byId = new Map<string, (typeof patients)[number]>();
		const byName = new Map<string, (typeof patients)[number]>();
		for (const p of patients || []) {
			if (p.id) byId.set(p.id, p);
			if (p.name) byName.set(p.name.trim().toLowerCase(), p);
		}
		return { byId, byName };
	}, [patients]);

	const count =
		totalCount !== undefined ? totalCount : (students?.length ?? studentIds?.length ?? 0);

	if (
		count === 0 &&
		(!students || students.length === 0) &&
		(!studentIds || studentIds.length === 0)
	) {
		return (
			<button
				type="button"
				onClick={onClick}
				className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none"
				title="تسجيل وتعيين الطلاب في المسار"
			>
				{emptyText}
			</button>
		);
	}

	// 1. محاولة بناء العناصر من مصفوفة الطلاب المباشرة
	let items = (students && students.length > 0 ? students : []).map((s) => {
		const matched =
			patientsMap.byId.get(s.id) || patientsMap.byName.get(s.name?.trim().toLowerCase() || "");

		const hoverData: StudentHoverData = {
			id: s.id,
			name: matched?.name || s.name || "طالب",
			code: matched?.code || s.code || null,
			gender: matched?.gender || s.gender || null,
			age: matched?.age !== undefined ? matched.age : s.age || null,
			classroom: matched?.classroom || s.classroom || null,
			guardianName: matched?.owner?.name || null,
			guardianPhone: matched?.owner?.phone || null,
		};

		return {
			id: s.id,
			name: hoverData.name,
			title: hoverData.name,
			image: s.avatar || null,
			data: hoverData,
		};
	});

	// 2. إذا لم تكن هناك عناصر مباشرة ولكن توجد معرّفات طلاب studentIds، يتم جلبهم من قاعدة بيانات الطلاب المحلية
	if (items.length === 0 && studentIds && studentIds.length > 0) {
		items = studentIds.map((id, index) => {
			const matched = patientsMap.byId.get(id);
			const hoverData: StudentHoverData = {
				id,
				name: matched?.name || `طالب ${index + 1}`,
				code: matched?.code || null,
				gender: matched?.gender || null,
				age: matched?.age !== undefined ? matched.age : null,
				classroom: matched?.classroom || null,
				guardianName: matched?.owner?.name || null,
				guardianPhone: matched?.owner?.phone || null,
			};

			return {
				id,
				name: hoverData.name,
				title: hoverData.name,
				image: null,
				data: hoverData,
			};
		});
	}

	// 3. إذا لم يتوفر أي كائن طالب بالاسم ولكن العدد الكلي count > 0، ننشئ أفاتارات افتراضية لكي تظهر دائماً كأفاتار دوائر بنفس ثيم المدربين
	if (items.length === 0 && count > 0) {
		const placeholderCount = Math.min(count, maxVisible);
		items = Array.from({ length: placeholderCount }, (_, i) => ({
			id: `student-placeholder-${i + 1}`,
			name: `طالب ${i + 1}`,
			title: `طالب ${i + 1}`,
			image: null,
			data: {
				id: `student-placeholder-${i + 1}`,
				name: `طالب ${i + 1}`,
			} as StudentHoverData,
		}));
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: click to open student assignment sheet
		// biome-ignore lint/a11y/useKeyWithClickEvents: click to open student assignment sheet
		<div
			className="cursor-pointer inline-flex items-center"
			onClick={onClick}
			title="تسجيل وتعيين الطلاب في المسار"
		>
			<AvatarCirclesStack
				items={items}
				totalCount={count}
				variant="mauve"
				maxVisible={maxVisible}
				renderItem={(item, element) => (
					<StudentHoverCard
						student={
							(item.data as StudentHoverData) || {
								id: String(item.id),
								name: item.name,
							}
						}
					>
						{element}
					</StudentHoverCard>
				)}
			/>
		</div>
	);
}

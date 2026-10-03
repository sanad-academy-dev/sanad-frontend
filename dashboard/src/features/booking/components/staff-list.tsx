import { useEffect, useMemo, useState } from "react";
import { TablePagination } from "@/components/common/table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffCard } from "@/features/booking/components/staff-card";
import type { PublicClinicStaffResponse } from "@/server/public/public.type";

type StaffListProps = {
	staff: PublicClinicStaffResponse[];
	isLoading: boolean;
	totalCount: number;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	onClearFilters: () => void;
};

const PAGE_SIZE = 6;

export const StaffList = ({
	staff,
	isLoading,
	totalCount,
	selectedId,
	onSelect,
	onClearFilters,
}: StaffListProps) => {
	const [pageIndex, setPageIndex] = useState(0);

	const totalPages = Math.max(1, Math.ceil(staff.length / PAGE_SIZE));

	useEffect(() => {
		if (pageIndex > totalPages - 1) setPageIndex(0);
	}, [pageIndex, totalPages]);

	const pageItems = useMemo(
		() => staff.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE),
		[staff, pageIndex],
	);

	if (isLoading) {
		return (
			<div
				className="grid h-fit gap-3 self-start"
				style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
			>
				{Array.from({ length: PAGE_SIZE }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-56 rounded-2xl"
					/>
				))}
			</div>
		);
	}

	if (totalCount === 0) {
		return (
			<div className="flex h-fit items-center justify-center self-start rounded-2xl border border-dashed border-border bg-card/50 p-8">
				<p className="text-center text-sm text-muted-foreground">
					لا يوجد مدرّبين متاحون حالياً للحجز الإلكتروني
				</p>
			</div>
		);
	}

	if (staff.length === 0) {
		return (
			<div className="flex h-fit flex-col items-center justify-center gap-3 self-start rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
				<p className="text-sm text-muted-foreground">لا توجد نتائج تطابق البحث</p>
				<button
					type="button"
					onClick={onClearFilters}
					className="text-sm font-medium text-primary hover:underline"
				>
					مسح الفلاتر
				</button>
			</div>
		);
	}

	return (
		<div className="flex h-fit flex-col gap-4 self-start w-full">
			<div
				className="grid gap-3 w-full"
				style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
			>
				{pageItems.map((s) => (
					<StaffCard
						key={s.id}
						staff={s}
						selected={selectedId === s.id}
						onSelect={() => onSelect(selectedId === s.id ? null : s.id)}
					/>
				))}
			</div>

			{totalPages > 1 && (
				<TablePagination
					page={pageIndex}
					pageCount={totalPages}
					totalRows={staff.length}
					fromRow={staff.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1}
					toRow={Math.min((pageIndex + 1) * PAGE_SIZE, staff.length)}
					onPageChange={setPageIndex}
					showPageSize={false}
				/>
			)}
		</div>
	);
};

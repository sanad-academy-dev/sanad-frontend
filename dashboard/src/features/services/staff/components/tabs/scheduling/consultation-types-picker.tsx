import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAddStaffConsultationType } from "@/features/services/staff/hooks/use-add-staff-consultation-type";
import { useConsultationTypes } from "@/features/settings/consultation-types/hooks/use-consultation-types";

export function ConsultationTypesPicker({
	staffId,
	addedConsultationTypeIds,
}: {
	staffId: string;
	addedConsultationTypeIds: Set<string>;
}) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { types, isLoading } = useConsultationTypes();
	const { addConsultationType, isPending } = useAddStaffConsultationType(staffId);

	const visibleTypes = useMemo(() => {
		const q = search.trim().toLowerCase();
		return types.filter((t) => {
			if (!t.active) return false;
			if (addedConsultationTypeIds.has(t.id)) return false;
			if (q.length > 0) return t.name.toLowerCase().includes(q);
			return true;
		});
	}, [types, addedConsultationTypeIds, search]);

	function handlePick(consultationTypeId: string) {
		if (isPending) return;
		addConsultationType(consultationTypeId);
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					size="sm"
					className="gap-1"
				>
					<IconPlus className="size-4" />
					إضافة كشف
				</Button>
			</PopoverTrigger>
			<PopoverContent
				dir="rtl"
				align="end"
				className="w-80 p-0 gap-0"
			>
				<div className="border-b p-2.5">
					<div className="relative">
						<IconSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="اختر الكشف..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="h-9 pr-8"
						/>
					</div>
				</div>

				<div className="h-72 overflow-y-auto py-1">
					<Link
						to="/management/settings/services"
						onClick={() => setOpen(false)}
						className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-muted/50"
					>
						<IconPlus className="size-4" />
						إضافة كشف جديد
					</Link>

					{isLoading ? (
						<div className="p-4 text-center text-xs text-muted-foreground">جارٍ التحميل...</div>
					) : visibleTypes.length === 0 ? (
						<div className="p-4 text-center text-xs text-muted-foreground">
							{search.trim() ? "لا توجد نتائج" : "لا توجد كشوفات متاحة"}
						</div>
					) : (
						visibleTypes.map((t) => (
							<button
								type="button"
								key={t.id}
								onClick={() => handlePick(t.id)}
								disabled={isPending}
								className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted/50 disabled:opacity-50"
							>
								<span className="truncate text-start">{t.name}</span>
								{t.price !== null && (
									<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
										{t.price.toLocaleString()} ر.س
									</span>
								)}
							</button>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

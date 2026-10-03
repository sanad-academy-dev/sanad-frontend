import { IconChevronLeft, IconPlus, IconSearch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAddStaffService } from "@/features/services/staff/hooks/use-add-staff-service";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import { cn } from "@/lib/utils";
import type {
	ServiceCategoryResponse,
	ServiceItemResponse,
} from "@/server/services/services.type";

type FlatItem = ServiceItemResponse & { categoryId: string };

export function ServicesPicker({
	staffId,
	addedServiceIds,
}: {
	staffId: string;
	addedServiceIds: Set<string>;
}) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

	const { tree, isLoading } = useServicesTree();
	const { addService, isPending } = useAddStaffService(staffId);

	const categories: ServiceCategoryResponse[] = tree;

	const flatItems: FlatItem[] = useMemo(() => {
		const list: FlatItem[] = [];
		for (const cat of tree) {
			for (const sub of cat.children) {
				for (const item of sub.children) {
					if (!item.isActive) continue;
					if (addedServiceIds.has(item.id)) continue;
					list.push({ ...item, categoryId: cat.id });
				}
			}
		}
		return list;
	}, [tree, addedServiceIds]);

	const visibleItems = useMemo(() => {
		const q = search.trim().toLowerCase();
		return flatItems.filter((item) => {
			if (q.length > 0) return item.name.toLowerCase().includes(q);
			if (activeCategoryId) return item.categoryId === activeCategoryId;
			return true;
		});
	}, [flatItems, search, activeCategoryId]);

	function handlePick(serviceId: string) {
		if (isPending) return;
		addService(serviceId);
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
					إضافة دورة
				</Button>
			</PopoverTrigger>
			<PopoverContent
				dir="rtl"
				align="end"
				className="w-[520px] p-0 gap-0"
			>
				<div className="border-b p-2.5">
					<div className="relative">
						<IconSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="اختر الدورة..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="h-9 pr-8"
						/>
					</div>
				</div>

				<div className="flex h-72">
					<div className="w-40 shrink-0  overflow-y-auto py-1">
						<button
							type="button"
							onClick={() => setActiveCategoryId(null)}
							className={cn(
								"flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted/50",
								activeCategoryId === null && "bg-muted/60 font-medium",
							)}
						>
							<span>الكل</span>
						</button>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat.id}
								onClick={() => setActiveCategoryId(cat.id)}
								className={cn(
									"flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted/50",
									activeCategoryId === cat.id && "bg-muted/60 font-medium",
								)}
							>
								<span className="truncate text-start">{cat.name}</span>
								<IconChevronLeft className="size-3.5 text-muted-foreground" />
							</button>
						))}
					</div>

					<div className="flex-1 overflow-y-auto border-r py-1">
						<Link
							to="/management/settings/services"
							onClick={() => setOpen(false)}
							className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-muted/50"
						>
							<IconPlus className="size-4" />
							إضافة دورة جديد
						</Link>

						{isLoading ? (
							<div className="p-4 text-center text-xs text-muted-foreground">
								جارٍ التحميل...
							</div>
						) : visibleItems.length === 0 ? (
							<div className="p-4 text-center text-xs text-muted-foreground">
								{search.trim() ? "لا توجد نتائج" : "لا توجد دورات متاحة"}
							</div>
						) : (
							visibleItems.map((item) => (
								<button
									type="button"
									key={item.id}
									onClick={() => handlePick(item.id)}
									disabled={isPending}
									className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-muted/50 disabled:opacity-50"
								>
									<span className="truncate text-start">{item.name}</span>
									{item.price !== null && (
										<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
											{item.price.toLocaleString()} ر.س
										</span>
									)}
								</button>
							))
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

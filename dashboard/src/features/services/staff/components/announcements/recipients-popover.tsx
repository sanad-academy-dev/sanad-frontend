// قائمة "حدد المستلمين" — اختيار متعدد للموظفين مع بحث وفلترة (مطابق لتصميم Figma)
import { IconCheck, IconFilter, IconPlus, IconSearch, IconUsers } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";

// الحروف الأولى من اسم الموظف للأفاتار
function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((p) => p[0]).join("");
}

export function RecipientsPopover({
	selectedIds,
	onToggle,
}: {
	selectedIds: Set<string>;
	onToggle: (id: string) => void;
}) {
	const { staff, isLoading } = useStaff();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return staff;
		return staff.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [staff, search]);

	const count = selectedIds.size;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] text-[10px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]",
						open && "bg-[#F9FAFB]",
					)}
				>
					<IconUsers className="size-[11px]" />
					<span>{count > 0 ? `المستلمون (${count})` : "حدد المستلمين"}</span>
				</button>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				dir="rtl"
				className="w-[380px] rounded-[4px] border border-[#E5E5E5] p-0 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
			>
				<div className="flex flex-col gap-[6px] py-3">
					{/* الترويسة: إضافة موظف + عنوان */}
					<div className="flex items-center justify-between px-[9px]">
						<span className="text-right text-[11px] font-normal leading-[16px] text-[#08090A]">
							اختر المستلمين...
						</span>
						<button
							type="button"
							className="flex h-[26px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[7px] text-[12px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]"
						>
							<span>إضافة موظف جديد</span>
							<IconPlus className="size-[15px]" />
						</button>
					</div>

					{/* فاصل */}
					<div className="h-px w-full bg-[#E5E5E5]" />

					{/* بحث + فلترة */}
					<div className="flex items-center gap-[5px] px-[9px]">
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9D]" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="ابحث باسم الموظف، المعرّف..."
								className="h-[30px] w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] pr-9 pl-3 text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
							/>
						</div>
						<button
							type="button"
							className="flex h-[28px] items-center gap-[3px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[6px] text-[11px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]"
						>
							<span>فلترة</span>
							<IconFilter className="size-[11px]" />
						</button>
					</div>

					{/* القائمة */}
					<div className="max-h-[360px] overflow-y-auto px-[9px]">
						{isLoading && (
							<p className="py-6 text-center text-[11px] text-[#9B9B9D]">جارِ التحميل...</p>
						)}
						{!isLoading && filtered.length === 0 && (
							<p className="py-6 text-center text-[11px] text-[#9B9B9D]">
								لا يوجد موظفون مطابقون
							</p>
						)}
						{filtered.map((s) => {
							const isSelected = selectedIds.has(s.id);
							return (
								<button
									key={s.id}
									type="button"
									onClick={() => onToggle(s.id)}
									className={cn(
										"flex w-full items-center gap-[6px] rounded-[4px] px-2 py-[7px] transition-colors hover:bg-[#F2F2F2]",
										isSelected && "bg-[#F2F2F2]",
									)}
								>
									{/* خانة الاختيار (أقصى اليمين) */}
									<span
										className={cn(
											"flex size-[14px] shrink-0 items-center justify-center rounded-[4px] border-[0.75px]",
											isSelected
												? "border-[#4F6AE0] bg-[#4F6AE0] text-white"
												: "border-[#E5E5E5]",
										)}
									>
										{isSelected && <IconCheck className="size-[10px]" />}
									</span>

									{/* الأفاتار + الاسم */}
									<span className="flex items-center gap-[6px]">
										<span className="flex size-[18px] items-center justify-center rounded-full bg-[#4F6AE0] text-[10px] font-bold text-white">
											{getInitials(s.name)}
										</span>
										<span className="text-[12px] font-bold text-[#08090A]">{s.name}</span>
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

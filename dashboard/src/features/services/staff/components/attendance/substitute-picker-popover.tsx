import { IconCheck, IconFilter, IconPlus, IconSearch, IconUserCog } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function SubstitutePickerPopover({
	value,
	onChange,
}: {
	value: string | null;
	onChange: (staffId: string | null) => void;
}) {
	const { staff } = useStaff();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return staff;
		return staff.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [staff, search]);

	const selected = staff.find((s) => s.id === value) ?? null;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[9px] text-[#08090A] hover:bg-muted"
				>
					{selected ? selected.name : "تعين موظف بديل"}
					<IconUserCog className="size-[11px] text-[#575759]" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={6}
				dir="rtl"
				className="flex max-h-[420px] w-[380px] flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] p-0 py-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)] ring-0"
			>
				{/* الرأس: عنوان + إضافة موظف جديد */}
				<div className="flex items-center justify-between px-3">
					<span className="text-[11px] text-[#08090A]">اختر المستلمين...</span>
					<button
						type="button"
						className="flex h-[26px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7px] text-[12px] font-medium text-[#08090A] hover:bg-muted"
					>
						<IconPlus className="size-[15px]" />
						إضافة موظف جديد
					</button>
				</div>

				{/* فاصل */}
				<div className="h-px w-full bg-[#E5E5E5]" />

				{/* بحث + فلترة */}
				<div className="flex items-center gap-1.5 px-3">
					<div className="relative flex-1">
						<IconSearch className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9D]" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ابحث باسم الموظف، المعرّف..."
							className="h-[30px] w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] pr-9 pl-3 text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						/>
					</div>
					<button
						type="button"
						className="flex h-[28px] shrink-0 items-center gap-[3px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A] hover:bg-muted"
					>
						فلترة
						<IconFilter className="size-[11px]" />
					</button>
				</div>

				{/* القائمة */}
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2">
					{filtered.map((s) => {
						const isSelected = s.id === value;
						return (
							<button
								key={s.id}
								type="button"
								onClick={() => {
									onChange(isSelected ? null : s.id);
									setOpen(false);
								}}
								className={cn(
									"flex h-[30px] shrink-0 items-center justify-between rounded-[4px] px-2 hover:bg-[#F2F2F2]",
									isSelected && "bg-[#F2F2F2]",
								)}
							>
								{/* الأفاتار + الاسم */}
								<div className="flex items-center gap-1.5">
									<span className="flex size-[18px] items-center justify-center rounded-full bg-[#4F6AE0] text-[10px] font-bold text-white">
										{initialsOf(s.name)}
									</span>
									<span className="text-[12px] font-bold text-[#08090A]">{s.name}</span>
								</div>
								{/* مربع الاختيار — يسار */}
								<span
									className={cn(
										"flex size-3 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5]",
										isSelected && "border-[#4F6AE0] bg-[#4F6AE0]",
									)}
								>
									{isSelected && <IconCheck className="size-2.5 text-white" />}
								</span>
							</button>
						);
					})}
					{filtered.length === 0 && (
						<div className="py-8 text-center text-[11px] text-muted-foreground">
							لا يوجد موظفين مطابقين
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

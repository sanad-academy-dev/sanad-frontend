import { IconCheck, IconChevronDown, IconPlus, IconTruckDelivery } from "@tabler/icons-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AddSupplierSheet } from "@/features/inventory/components/add-supplier-sheet";
import { useSuppliers } from "@/features/inventory/hooks/use-suppliers";
import { cn } from "@/lib/utils";

interface SupplierFieldProps {
	value?: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	invalid?: boolean;
	/** يُستدعى عند فتح/إغلاق شاشة إضافة المورد (لإزاحة شاشة المنتج جانبًا) */
	onSheetOpenChange?: (open: boolean) => void;
}

// حقل المورد: قائمة منسدلة من الموردين المسجّلين، مع حالة فارغة وفتح شاشة إضافة مورد.
// يُحفظ اسم المورد القانوني نصًّا على المنتج (لا توجد علاقة بالمعرّف بعد).
export function SupplierField({
	value,
	onChange,
	disabled,
	invalid,
	onSheetOpenChange,
}: SupplierFieldProps) {
	const [open, setOpen] = useState(false);
	const [addOpen, setAddOpen] = useState(false);
	const { suppliers } = useSuppliers();

	const names = suppliers.map((s) => s.legalName);
	const options = value && !names.includes(value) ? [value, ...names] : names;

	const setAdd = (o: boolean) => {
		setAddOpen(o);
		onSheetOpenChange?.(o);
	};

	const openAdd = () => {
		setOpen(false);
		setAdd(true);
	};

	return (
		<>
			<Popover
				open={open}
				onOpenChange={(o) => {
					if (disabled) return;
					setOpen(o);
				}}
			>
				<PopoverTrigger
					type="button"
					disabled={disabled}
					aria-invalid={invalid}
					className={cn(
						"flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm",
						"focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
						"aria-invalid:border-destructive",
					)}
				>
					<span className={cn(!value && "text-muted-foreground")}>{value || "اختر..."}</span>
					<IconChevronDown className="size-4 shrink-0 opacity-50" />
				</PopoverTrigger>

				<PopoverContent
					dir="rtl"
					align="start"
					className="w-[var(--radix-popover-trigger-width)] p-0"
				>
					{options.length === 0 ? (
						<>
							<div className="flex flex-col items-center gap-3 p-4">
								<span className="self-start text-xs text-muted-foreground">
									اختر للمورد...
								</span>
								<div className="flex size-24 items-center justify-center rounded-md bg-muted">
									<IconTruckDelivery className="size-10 text-muted-foreground" />
								</div>
								<p className="text-sm font-semibold">لا يوجد موردين حاليًا</p>
							</div>
							<Separator />
							<button
								type="button"
								onClick={openAdd}
								className="flex w-full items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
							>
								<IconPlus className="size-4" />
								إضافة مورد جديدة
							</button>
						</>
					) : (
						<>
							<div className="max-h-56 overflow-y-auto p-1">
								{options.map((name) => (
									<button
										key={name}
										type="button"
										onClick={() => {
											onChange(name);
											setOpen(false);
										}}
										className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
									>
										<span>{name}</span>
										{value === name && <IconCheck className="size-4 text-primary" />}
									</button>
								))}
							</div>
							<Separator />
							<button
								type="button"
								onClick={openAdd}
								className="flex w-full items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
							>
								<IconPlus className="size-4" />
								إضافة مورد جديدة
							</button>
						</>
					)}
				</PopoverContent>
			</Popover>

			<AddSupplierSheet
				open={addOpen}
				onClose={() => setAdd(false)}
				onCreated={(supplier) => {
					onChange(supplier.legalName);
					setAdd(false);
				}}
			/>
		</>
	);
}

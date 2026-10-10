import { IconFilter, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CarePlanMedicationItem } from "@/features/finance/care-plans/data/care-plans";
import { INVENTORY_CATEGORY_OPTIONS } from "@/features/inventory/data/constants";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import type { InventoryCategory } from "@/generated/prisma/enums";
import { createLocalId } from "@/lib/create-local-id";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

const formatMoney = (value: InventoryResponse["price"]) =>
	`${Number(value).toLocaleString("ar-SA")} ر.س`;

function IconArrowFromRight({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="13"
			height="13"
			viewBox="0 0 13 13"
			fill="none"
			className={className}
			aria-hidden="true"
		>
			<path
				d="M1.625 2.16667C1.48134 2.16667 1.34357 2.22373 1.24198 2.32532C1.1404 2.4269 1.08333 2.56467 1.08333 2.70833V10.2917C1.08333 10.4353 1.1404 10.5731 1.24198 10.6747C1.34357 10.7763 1.48134 10.8333 1.625 10.8333C1.76866 10.8333 1.90643 10.7763 2.00802 10.6747C2.1096 10.5731 2.16667 10.4353 2.16667 10.2917V2.70833C2.16667 2.56467 2.1096 2.4269 2.00802 2.32532C1.90643 2.22373 1.76866 2.16667 1.625 2.16667ZM11.8733 6.29417C11.8476 6.22768 11.8089 6.16693 11.7596 6.11542L9.59292 3.94875C9.54241 3.89825 9.48245 3.85818 9.41647 3.83085C9.35048 3.80352 9.27976 3.78945 9.20833 3.78945C9.13691 3.78945 9.06618 3.80352 9.0002 3.83085C8.93421 3.85818 8.87425 3.89825 8.82375 3.94875C8.77325 3.99925 8.73318 4.05921 8.70585 4.1252C8.67852 4.19118 8.66445 4.26191 8.66445 4.33333C8.66445 4.40476 8.67852 4.47548 8.70585 4.54147C8.73318 4.60746 8.77325 4.66741 8.82375 4.71792L10.0696 5.95833H3.79167C3.64801 5.95833 3.51023 6.0154 3.40865 6.11698C3.30707 6.21857 3.25 6.35634 3.25 6.5C3.25 6.64366 3.30707 6.78143 3.40865 6.88302C3.51023 6.9846 3.64801 7.04167 3.79167 7.04167H10.0696L8.82375 8.28208C8.77298 8.33244 8.73268 8.39235 8.70518 8.45835C8.67768 8.52436 8.66353 8.59516 8.66353 8.66667C8.66353 8.73817 8.67768 8.80897 8.70518 8.87498C8.73268 8.94099 8.77298 9.00089 8.82375 9.05125C8.8741 9.10202 8.93401 9.14232 9.00002 9.16982C9.06603 9.19732 9.13683 9.21147 9.20833 9.21147C9.27984 9.21147 9.35064 9.19732 9.41665 9.16982C9.48265 9.14232 9.54256 9.10202 9.59292 9.05125L11.7596 6.88458C11.8089 6.83307 11.8476 6.77232 11.8733 6.70583C11.9275 6.57396 11.9275 6.42604 11.8733 6.29417Z"
				fill="black"
				fillOpacity="0.62"
			/>
		</svg>
	);
}

function QuantityStepper({
	value,
	onChange,
	min = 0,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
}) {
	return (
		<div
			className="flex items-center gap-1 rounded-[4px] border px-1.5 py-1"
			dir="rtl"
		>
			<button
				type="button"
				onClick={() => onChange(Math.max(min, value - 1))}
				className="flex size-4 items-center justify-center text-muted-foreground hover:text-foreground"
			>
				<IconMinus className="size-3" />
			</button>
			<span className="w-6 text-center text-xs tabular-nums">
				{value.toString().padStart(2, "0")}
			</span>
			<button
				type="button"
				onClick={() => onChange(value + 1)}
				className="flex size-4 items-center justify-center text-muted-foreground hover:text-foreground"
			>
				<IconPlus className="size-3" />
			</button>
		</div>
	);
}

function CategoryFilterPopover({
	category,
	onCategoryChange,
}: {
	category: InventoryCategory | null;
	onCategoryChange: (category: InventoryCategory | null) => void;
}) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const filteredCategories = INVENTORY_CATEGORY_OPTIONS.filter((opt) =>
		opt.label.includes(search.trim()),
	);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					size="icon-sm"
					variant={category ? "secondary" : "outline"}
				>
					<IconFilter className="size-3.5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-64 p-0"
				dir="rtl"
			>
				<div className="border-b p-2">
					<InputGroup>
						<InputGroupInput
							placeholder="فلترة حسب..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</InputGroup>
				</div>
				<div className="max-h-72 overflow-y-auto p-1">
					<button
						type="button"
						onClick={() => {
							onCategoryChange(null);
							setOpen(false);
						}}
						className={cn(
							"w-full rounded px-2 py-1.5 text-right text-sm hover:bg-muted",
							category === null && "bg-muted font-medium",
						)}
					>
						الكل
					</button>
					{filteredCategories.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => {
								onCategoryChange(opt.value);
								setOpen(false);
							}}
							className={cn(
								"w-full rounded px-2 py-1.5 text-right text-sm hover:bg-muted",
								category === opt.value && "bg-muted font-medium",
							)}
						>
							{opt.label}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

function MedicationRow({
	item,
	onChange,
	onRemove,
}: {
	item: CarePlanMedicationItem;
	onChange: (patch: Partial<CarePlanMedicationItem>) => void;
	onRemove: () => void;
}) {
	const { inventory, isLoading } = useInventory();
	const [category, setCategory] = useState<InventoryCategory | null>(null);
	const selected = inventory.find((i) => i.id === item.inventoryItemId);

	const filteredInventory = category
		? inventory.filter((i) => i.category === category)
		: inventory;

	return (
		<div
			className="space-y-2 rounded-[4px] border p-3"
			dir="rtl"
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onRemove}
					className="text-muted-foreground hover:text-destructive"
				>
					<IconTrash className="size-4" />
				</button>

				<QuantityStepper
					value={item.quantity}
					onChange={(v) => onChange({ quantity: v })}
					min={1}
				/>

				<Combobox
					value={item.inventoryItemId ?? ""}
					onValueChange={(v) =>
						onChange({ inventoryItemId: typeof v === "string" ? v : undefined })
					}
				>
					<ComboboxTrigger className="flex flex-1 items-center justify-between rounded-[4px] border px-3 py-2 text-sm">
						<ComboboxValue placeholder="ابحث عن دواء أو مستلزم أو منتج">
							{selected?.name}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							{isLoading ? (
								<ComboboxEmpty>جارٍ التحميل...</ComboboxEmpty>
							) : filteredInventory.length === 0 ? (
								<ComboboxEmpty>لا توجد عناصر</ComboboxEmpty>
							) : (
								filteredInventory.map((i) => (
									<ComboboxItem
										key={i.id}
										value={i.id}
									>
										<div className="flex flex-col items-end gap-0.5 py-0.5">
											<span>{i.name}</span>
											<span className="text-xs text-muted-foreground tabular-nums">
												{formatMoney(i.price)}
											</span>
										</div>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>

				<CategoryFilterPopover
					category={category}
					onCategoryChange={setCategory}
				/>
			</div>

			<div className="flex items-center justify-end gap-4 text-xs">
				<span className="font-medium text-muted-foreground">نوع الاستهلاك:</span>

				<RadioGroup
					value={item.fullyFree ? "full" : "limited"}
					onValueChange={(v) => onChange({ fullyFree: v === "full" })}
					className="flex items-center gap-4"
				>
					<Label className="flex items-center gap-1.5 font-normal">
						<RadioGroupItem value="full" />
						مجاني بالكامل
					</Label>
					<Label className="flex items-center gap-1.5 font-normal">
						<RadioGroupItem value="limited" />
						مجاني حتي:
						<QuantityStepper
							value={item.freeQuantity}
							onChange={(v) => onChange({ freeQuantity: v })}
						/>
					</Label>
				</RadioGroup>
			</div>
		</div>
	);
}

export function MedicationsSettingsPanel({
	items,
	onChange,
	onBack,
	onSave,
}: {
	items: CarePlanMedicationItem[];
	onChange: (items: CarePlanMedicationItem[]) => void;
	onBack: () => void;
	onSave: () => void;
}) {
	const updateItem = (id: string, patch: Partial<CarePlanMedicationItem>) =>
		onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

	const removeItem = (id: string) => onChange(items.filter((i) => i.id !== id));

	const addItem = () =>
		onChange([
			...items,
			{
				id: createLocalId(),
				inventoryItemId: undefined,
				quantity: 1,
				freeQuantity: 1,
				fullyFree: false,
			},
		]);

	return (
		<div
			className="order-0 flex h-full flex-1 flex-col rounded-lg border bg-popover"
			dir="rtl"
		>
			{/* Header */}
			<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
				<h2 className="text-sm font-bold text-foreground">إعداد مواد الدورة والمخزون</h2>
				<button
					type="button"
					onClick={onBack}
					className="flex size-6.25 items-center justify-center rounded-full bg-[#E5E5E5]"
				>
					<IconArrowFromRight className="size-3.25 scale-x-[-1]" />
				</button>
			</div>

			<div className="flex-1 space-y-3 overflow-y-auto p-4">
				{items.map((item) => (
					<MedicationRow
						key={item.id}
						item={item}
						onChange={(patch) => updateItem(item.id, patch)}
						onRemove={() => removeItem(item.id)}
					/>
				))}

				<div className="flex justify-end border-t pt-3">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={addItem}
					>
						<IconPlus className="size-3.5" />
						إضافة عنصر
					</Button>
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center border-t px-4 py-2">
				<Button
					type="button"
					size="sm"
					onClick={onSave}
				>
					حفظ
				</Button>
			</div>
		</div>
	);
}

import {
	IconArrowLeft,
	IconCheck,
	IconChevronDown,
	IconFilter,
	IconMinus,
	IconPlus,
	IconSearch,
	IconSparkles,
	IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { INVENTORY_CATEGORY_OPTIONS } from "@/features/inventory/data/constants";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import type { InventoryCategory } from "@/generated/prisma/enums";
import { createLocalId } from "@/lib/create-local-id";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

export interface LessonSupplyItem {
	id: string;
	inventoryItemId?: string;
	customName?: string;
	quantity: number;
}

const formatMoney = (value: number | string | null | undefined) =>
	`${Number(value ?? 0).toLocaleString("ar-SA")} ر.س`;

// مستلزمات مقترحة افتراضية عند فراغ المخزون لتطابق صورة الواجهة
const DEFAULT_FALLBACK_SUPPLIES: Array<{
	id: string;
	name: string;
	price: number;
	category?: InventoryCategory;
}> = [
	{ id: "mock-1", name: "Doxycycline", price: 120 },
	{ id: "mock-2", name: "Enrofloxacin", price: 120 },
	{ id: "mock-3", name: "Cephalexin", price: 120 },
	{ id: "mock-4", name: "Clavamox", price: 120 },
	{ id: "mock-5", name: "Amoxicillin", price: 120 },
	{ id: "mock-6", name: "Robenacoxib", price: 120 },
	{ id: "mock-7", name: "Firocoxib", price: 120 },
	{ id: "mock-8", name: "Meloxicam", price: 120 },
	{ id: "mock-9", name: "Carprofen", price: 120 },
	{ id: "mock-10", name: "Milbemycin", price: 120 },
];

function QuantityStepper({
	value,
	onChange,
	min = 1,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
}) {
	return (
		<div
			className="flex items-center gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-1.5 py-1"
			dir="rtl"
		>
			<button
				type="button"
				onClick={() => onChange(Math.max(min, value - 1))}
				className="flex size-4 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
			>
				<IconMinus className="size-3" />
			</button>
			<span className="w-5 text-center text-xs font-semibold tabular-nums text-[#08090A]">
				{value.toString().padStart(2, "0")}
			</span>
			<button
				type="button"
				onClick={() => onChange(value + 1)}
				className="flex size-4 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
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
					size="sm"
					variant={category ? "secondary" : "outline"}
					className="h-7 px-2 text-[11px] gap-1 rounded-[4px] cursor-pointer"
				>
					<IconFilter className="size-3.5" />
					<span>فلترة</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="w-60 p-0 z-[100]"
				dir="rtl"
			>
				<div className="border-b border-[#F0F0F0] p-2">
					<input
						placeholder="فلترة حسب الفئة..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full text-xs rounded border border-[#E5E5E5] px-2 py-1 outline-none text-right"
					/>
				</div>
				<div className="max-h-60 overflow-y-auto p-1 text-xs">
					<button
						type="button"
						onClick={() => {
							onCategoryChange(null);
							setOpen(false);
						}}
						className={cn(
							"w-full rounded px-2 py-1.5 text-right hover:bg-muted cursor-pointer transition-colors",
							category === null && "bg-muted font-medium text-primary",
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
								"w-full rounded px-2 py-1.5 text-right hover:bg-muted cursor-pointer transition-colors",
								category === opt.value && "bg-muted font-medium text-primary",
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

function SupplyItemRow({
	item,
	allInventory,
	isLoading,
	onChange,
	onRemove,
}: {
	item: LessonSupplyItem;
	allInventory: Array<{
		id: string;
		name: string;
		price: number | string | null;
		category?: InventoryCategory;
	}>;
	isLoading: boolean;
	onChange: (patch: Partial<LessonSupplyItem>) => void;
	onRemove: () => void;
}) {
	const [comboboxOpen, setComboboxOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<InventoryCategory | null>(null);

	const selected = allInventory.find((i) => i.id === item.inventoryItemId);

	const filteredItems = useMemo(() => {
		let list = allInventory;
		if (category) {
			list = list.filter((i) => i.category === category);
		}
		if (search.trim()) {
			const term = search.trim().toLowerCase();
			list = list.filter((i) => i.name.toLowerCase().includes(term));
		}
		return list;
	}, [allInventory, category, search]);

	return (
		<div
			className="flex items-center gap-2 rounded-[4px] border border-[#E5E5E5] bg-white p-2"
			dir="rtl"
		>
			<button
				type="button"
				onClick={onRemove}
				className="text-[#9B9B9D] hover:text-rose-600 transition-colors cursor-pointer p-1 shrink-0"
				title="حذف المستلزم"
			>
				<IconTrash className="size-4" />
			</button>

			<QuantityStepper
				value={item.quantity}
				onChange={(q) => onChange({ quantity: q })}
				min={1}
			/>

			{/* Combobox لاختيار المستلزم أو المنتج من المخزون */}
			<Popover
				open={comboboxOpen}
				onOpenChange={setComboboxOpen}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex flex-1 items-center justify-between rounded-[4px] border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs text-[#08090A] hover:border-primary/50 cursor-pointer min-w-0"
					>
						<span
							className={cn(
								"truncate text-right",
								!selected && !item.customName && "text-[#9B9B9D]",
							)}
						>
							{selected?.name || item.customName || "ابحث عن باسم المستلزم أو منتج"}
						</span>
						<IconChevronDown className="size-3.5 text-[#9B9B9D] shrink-0 ms-1.5" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					className="w-[340px] sm:w-[380px] p-0 shadow-xl border border-[#E5E5E5] bg-white rounded-[6px] z-[100]"
					dir="rtl"
				>
					{/* إضافة منتج جديد */}
					<div className="border-b border-[#F0F0F0] p-2 bg-[#FAFAFA]">
						<button
							type="button"
							onClick={() => {
								if (search.trim()) {
									onChange({ customName: search.trim(), inventoryItemId: undefined });
									setComboboxOpen(false);
									toast.success(`تم اختيار «${search.trim()}» كمستلزم`);
								} else {
									const name = prompt("أدخل اسم المستلزم الجديد:");
									if (name?.trim()) {
										onChange({ customName: name.trim(), inventoryItemId: undefined });
										setComboboxOpen(false);
										toast.success(`تمت إضافة «${name.trim()}»`);
									}
								}
							}}
							className="flex w-full items-center gap-1.5 rounded-[4px] px-2 py-1 text-xs font-semibold text-[#08090A] hover:bg-white cursor-pointer transition-colors"
						>
							<IconPlus className="size-3.5 text-primary" />
							<span>إضافة منتج جديد</span>
						</button>
					</div>

					{/* حقل البحث والفلترة */}
					<div className="flex items-center gap-2 border-b border-[#F0F0F0] p-2">
						<div className="flex flex-1 items-center gap-1.5 rounded-[4px] border border-[#E5E5E5] bg-white px-2 py-1">
							<IconSearch className="size-3.5 text-[#9B9B9D] shrink-0" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="ابحث، للمنتج..."
								className="w-full text-xs bg-transparent outline-none border-0 p-0 text-right"
							/>
						</div>
						<CategoryFilterPopover
							category={category}
							onCategoryChange={setCategory}
						/>
					</div>

					{/* قائمة العناصر */}
					<div className="max-h-64 overflow-y-auto p-1 divide-y divide-[#F5F5F5]">
						{isLoading ? (
							<Spinner
								containerClassName="py-4 min-h-0"
								className="size-4 text-primary"
							/>
						) : filteredItems.length === 0 ? (
							<div className="py-4 text-center text-xs text-muted-foreground">
								لا توجد عناصر مطابقة
							</div>
						) : (
							filteredItems.map((prod) => {
								const isSelected =
									item.inventoryItemId === prod.id ||
									(item.customName === prod.name && !item.inventoryItemId);
								return (
									<button
										key={prod.id}
										type="button"
										onClick={() => {
											onChange({ inventoryItemId: prod.id, customName: prod.name });
											setComboboxOpen(false);
										}}
										className={cn(
											"flex w-full items-center justify-between gap-3 px-3 py-2 text-right hover:bg-[#F9FAFB] cursor-pointer transition-colors",
											isSelected && "bg-[#F3F4F6]",
										)}
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<div
												className={cn(
													"flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
													isSelected
														? "border-primary bg-primary text-white"
														: "border-[#D4D4D8] bg-white",
												)}
											>
												{isSelected && <IconCheck className="size-3 stroke-[3]" />}
											</div>
											<div className="flex flex-col text-right min-w-0">
												<span className="truncate text-xs font-semibold text-[#08090A]">
													{prod.name}
												</span>
												<span className="text-[10px] text-[#6B6B67] tabular-nums">
													{formatMoney(prod.price)} · متوفر
												</span>
											</div>
										</div>
									</button>
								);
							})
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export interface LessonSuppliesPanelProps {
	lessonTitle: string;
	initialItems?: LessonSupplyItem[];
	onClose: () => void;
	onSave: (items: LessonSupplyItem[]) => void;
	className?: string;
}

export function LessonSuppliesPanel({
	lessonTitle,
	initialItems = [],
	onClose,
	onSave,
	className,
}: LessonSuppliesPanelProps) {
	const { inventory, isLoading } = useInventory();
	const [items, setItems] = useState<LessonSupplyItem[]>(() =>
		initialItems.length > 0 ? initialItems : [{ id: createLocalId(), quantity: 1 }],
	);
	const [continueAdding, setContinueAdding] = useState(false);

	useEffect(() => {
		setItems(initialItems.length > 0 ? initialItems : [{ id: createLocalId(), quantity: 1 }]);
	}, [initialItems]);

	// دمج منتجات المخزون مع الافتراضية إذا كان المخزون فارغًا
	const allInventory = useMemo(() => {
		const source = inventory && inventory.length > 0
			? inventory
			: (DEFAULT_FALLBACK_SUPPLIES as unknown as InventoryResponse[]);
		return source.map(({ id, name, price, category }) => ({
			id,
			name,
			price: price === null ? null : Number(price),
			category,
		}));
	}, [inventory]);

	const updateItem = (id: string, patch: Partial<LessonSupplyItem>) => {
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
	};

	const removeItem = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const addItem = () => {
		setItems((prev) => [...prev, { id: createLocalId(), quantity: 1 }]);
	};

	const handleAiGenerate = () => {
		// اقتراح ذكي لمستلزمات الدرس
		const suggestions: LessonSupplyItem[] = [
			{
				id: createLocalId(),
				inventoryItemId: allInventory[0]?.id,
				customName: allInventory[0]?.name,
				quantity: 1,
			},
			{
				id: createLocalId(),
				inventoryItemId: allInventory[1]?.id,
				customName: allInventory[1]?.name,
				quantity: 2,
			},
		];
		setItems(suggestions);
		toast.success("تم توليد مقترحات المستلزمات بنجاح بواسطة الذكاء الاصطناعي");
	};

	const handleSave = () => {
		const validItems = items.filter((item) => item.inventoryItemId || item.customName);
		onSave(validItems);
		toast.success(`تم حفظ ${validItems.length} مستلزم للدرس`);
		if (!continueAdding) {
			onClose();
		} else {
			setItems([{ id: createLocalId(), quantity: 1 }]);
		}
	};

	return (
		<div
			dir="rtl"
			className={cn(
				"flex h-full w-full flex-col overflow-hidden bg-white dark:bg-card text-right",
				className,
			)}
		>
			{/* 1. Header — إعداد مواد الخدمة والمخزون مع زر العودة */}
			<div className="flex items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-border px-4 py-3 bg-[#FAFAFA] dark:bg-muted/40 shrink-0">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onClose}
						aria-label="رجوع"
						className="flex size-7 items-center justify-center rounded-full bg-[#EDEDED] dark:bg-muted hover:bg-[#E5E5E5] dark:hover:bg-muted/80 text-[#08090A] dark:text-foreground transition-colors cursor-pointer"
					>
						<IconArrowLeft className="size-4" />
					</button>
					<h2 className="text-sm font-bold text-[#08090A] dark:text-foreground">
						إعداد مواد الخدمة والمخزون
					</h2>
				</div>
				<span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
					{lessonTitle}
				</span>
			</div>

			{/* 2. Subheader — إعدادات المستلزمات وأزرار الإضافة والتوليد */}
			<div className="flex items-center justify-between border-b border-[#F0F0F0] dark:border-border px-4 py-2.5 bg-white dark:bg-card shrink-0">
				<span className="text-xs font-bold text-[#08090A] dark:text-foreground">
					إعدادات المستلزمات
				</span>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={handleAiGenerate}
						className="h-7 px-2.5 text-[11px] font-medium text-[#4F46E5] dark:text-indigo-400 border-[#D4D4F0] dark:border-indigo-900/40 hover:bg-primary/5 gap-1 rounded-[4px] cursor-pointer"
					>
						<IconSparkles className="size-3.5" />
						<span>توليد مستلزمات بالـ AI</span>
					</Button>
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={addItem}
						className="h-7 px-2.5 text-[11px] font-medium text-[#08090A] dark:text-foreground border-[#E5E5E5] dark:border-border hover:bg-[#F9FAFB] dark:hover:bg-muted gap-1 rounded-[4px] cursor-pointer"
					>
						<IconPlus className="size-3.5" />
						<span>إضافة عنصر</span>
					</Button>
				</div>
			</div>

			{/* 3. Items list */}
			<div className="flex-1 space-y-2.5 overflow-y-auto p-4 bg-[#FBFBFC] dark:bg-muted/10">
				{items.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
						<span className="text-xs">لا توجد مستلزمات مضافة بعد</span>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={addItem}
							className="h-7 text-xs cursor-pointer"
						>
							<IconPlus className="size-3.5" />
							إضافة أول مستلزم
						</Button>
					</div>
				) : (
					items.map((item) => (
						<SupplyItemRow
							key={item.id}
							item={item}
							allInventory={allInventory}
							isLoading={isLoading}
							onChange={(patch) => updateItem(item.id, patch)}
							onRemove={() => removeItem(item.id)}
						/>
					))
				)}
			</div>

			{/* 4. Footer — زر الحفظ وخيار متابعة الإضافة */}
			<div className="flex items-center justify-between border-t border-[#E5E5E5] dark:border-border px-4 py-3 bg-white dark:bg-card shrink-0">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						onClick={handleSave}
						className="h-8 px-5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-[4px] cursor-pointer transition-colors shadow-xs"
					>
						حفظ
					</Button>
				</div>

				{/* biome-ignore lint/a11y/noLabelWithoutControl: checkbox is nested inside label */}
				<label className="flex items-center gap-2 text-xs text-[#6B6B67] dark:text-muted-foreground cursor-pointer select-none">
					<Checkbox
						checked={continueAdding}
						onCheckedChange={(checked) => setContinueAdding(Boolean(checked))}
					/>
					<span>حفظ ومتابعة الإضافة</span>
					<kbd className="hidden sm:inline-block rounded border border-[#E5E5E5] dark:border-border bg-[#F9FAFB] dark:bg-muted px-1.5 py-0.5 text-[9px] text-[#9B9B9D]">
						Ctrl+Enter
					</kbd>
				</label>
			</div>
		</div>
	);
}

export function LessonSuppliesSheet({
	open,
	onOpenChange,
	lessonTitle,
	initialItems = [],
	onSave,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	lessonTitle: string;
	initialItems?: LessonSupplyItem[];
	onSave: (items: LessonSupplyItem[]) => void;
}) {
	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className="z-[80] w-full sm:max-w-[560px] p-0 border border-[#E5E5E5] bg-white dark:bg-card shadow-2xl flex flex-col h-full inset-y-0 left-0 sm:left-2 sm:inset-y-2 sm:rounded-lg overflow-hidden"
			>
				<LessonSuppliesPanel
					lessonTitle={lessonTitle}
					initialItems={initialItems}
					onClose={() => onOpenChange(false)}
					onSave={onSave}
				/>
			</SheetContent>
		</Sheet>
	);
}

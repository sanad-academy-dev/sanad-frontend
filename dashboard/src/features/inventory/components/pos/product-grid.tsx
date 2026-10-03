import { IconBolt, IconPackage, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { INVENTORY_CATEGORY_LABELS } from "@/features/inventory/data/constants";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useCartStore } from "@/features/inventory/stores/cart.store";
import type { InventoryCategory } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

const fmt = (n: number) => `${n.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`;

const CATEGORIES = Object.entries(INVENTORY_CATEGORY_LABELS) as [InventoryCategory, string][];

function ProductCard({ product, onAdd }: { product: InventoryResponse; onAdd: () => void }) {
	const out = product.stock <= 0;
	return (
		<button
			type="button"
			onClick={onAdd}
			disabled={out}
			className={cn(
				"flex flex-col gap-2 rounded-[4px] border border-[#E5E5E5] p-2 text-right transition hover:border-[#5B6ABF] disabled:opacity-50 disabled:hover:border-[#E5E5E5]",
			)}
		>
			<div className="flex h-[100px] items-center justify-center rounded-[4px] bg-[#EDECE9]">
				<IconPackage className="size-8 text-[#A0A09C]" />
			</div>
			<div className="flex items-center justify-between">
				<span className="text-[13px] font-bold text-[#5B6ABF] tabular-nums">
					{fmt(Number(product.price))}
				</span>
				<span className="truncate text-[12px] font-semibold text-[#08090A]">
					{product.name}
				</span>
			</div>
			<div className="flex items-center justify-between text-[10px] text-muted-foreground">
				<span className={cn(out ? "text-red-500" : "text-emerald-600")}>
					{out ? "نفذ" : `متوفر: ${product.stock}`}
				</span>
				<span className="font-mono tabular-nums">{product.code}</span>
			</div>
		</button>
	);
}

export function ProductGrid() {
	const { inventory, isLoading } = useInventory();
	const addProduct = useCartStore((s) => s.addProduct);
	const [activeCat, setActiveCat] = useState<InventoryCategory | "ALL">("ALL");
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim();
		return inventory.filter((p) => {
			if (activeCat !== "ALL" && p.category !== activeCat) return false;
			if (q && !p.name.includes(q) && !p.code.includes(q)) return false;
			return true;
		});
	}, [inventory, activeCat, search]);

	// تجميع حسب الفئة لعرض عناوين الأقسام
	const grouped = useMemo(() => {
		const map = new Map<InventoryCategory, InventoryResponse[]>();
		for (const p of filtered) {
			const arr = map.get(p.category) ?? [];
			arr.push(p);
			map.set(p.category, arr);
		}
		return [...map.entries()];
	}, [filtered]);

	return (
		<div
			className="flex flex-1 flex-col gap-3 overflow-hidden p-3"
			dir="rtl"
		>
			{/* فلاتر الفئات + بحث */}
			<div className="flex items-center gap-2">
				<div className="flex h-[30px] w-[414px] shrink-0 items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white py-2 pr-1.5 pl-3">
					{/* الإدخال + أيقونة البحث (يمين) */}
					<div className="flex min-w-0 flex-1 items-center justify-end gap-1">
						<IconSearch className="size-4 shrink-0 text-[#9B9B9D]" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ابحث عن المنتج بالاسم أو المعرف والباركود..."
							className="min-w-0 flex-1 bg-transparent text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						/>
					</div>
					{/* المساعد + اختصار / (يسار) */}
					<div className="flex shrink-0 items-center gap-[3px]">
						<button
							type="button"
							aria-label="المساعد الذكي"
							className="flex size-4 items-center justify-center rounded-[4px]"
						>
							<IconBolt className="size-4 text-[#6366F1] opacity-60" />
						</button>
						<span className="flex h-[16.5px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#F0F0F0] px-[3px] text-[8px] leading-3 text-[#9B9B9D] opacity-70">
							/
						</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					<CatChip
						active={activeCat === "ALL"}
						onClick={() => setActiveCat("ALL")}
					>
						الكل
					</CatChip>
					{CATEGORIES.map(([value, label]) => (
						<CatChip
							key={value}
							active={activeCat === value}
							onClick={() => setActiveCat(value)}
						>
							{label}
						</CatChip>
					))}
				</div>
			</div>

			<div className="h-px w-full bg-[#EBEBEF]" />

			{/* الشبكة */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<p className="pt-10 text-center text-sm text-muted-foreground">جارٍ التحميل...</p>
				) : grouped.length === 0 ? (
					<p className="pt-10 text-center text-sm text-muted-foreground">لا توجد منتجات</p>
				) : (
					<div className="flex flex-col gap-4">
						{grouped.map(([cat, products]) => (
							<div
								key={cat}
								className="flex flex-col gap-2"
							>
								<h3 className="text-[14px] font-bold text-[#08090A]">
									{INVENTORY_CATEGORY_LABELS[cat]}
								</h3>
								<div className="grid grid-cols-3 gap-3">
									{products.map((p) => (
										<ProductCard
											key={p.id}
											product={p}
											onAdd={() => addProduct(p)}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function CatChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-[4px] border-[0.75px] px-2 py-1 text-[10px] font-medium",
				active
					? "border-[#CFCFCF] bg-[#EBEBEB] text-[#08090A]"
					: "border-[#E5E5E5] text-[#5C5C5E]",
			)}
		>
			{children}
		</button>
	);
}

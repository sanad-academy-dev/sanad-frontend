import { IconAlertTriangle, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

import { FormHeader } from "@/components/common/form-header";
import { Spinner } from "@/components/common/spinner";
import { TablePagination } from "@/components/common/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CATALOG_SPECIES_OPTIONS } from "@/features/inventory/data/catalog-species-options";
import { useDrugCatalog } from "@/features/inventory/hooks/use-drug-catalog";
import type { CatalogSpecies } from "@/generated/prisma/enums";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { THERAPEUTIC_CLASSES } from "@sanad/contracts/runtime/server/drug-catalog/drug-catalog.classes";
import type { CatalogProductResponse } from "@/server/drug-catalog/drug-catalog.type";

const PAGE_SIZE = 15;
const ALL = "ALL";

/**
 * Picks a registered product out of the enabled regulatory catalogs.
 *
 * Read-only: nothing here creates or edits catalog data. Selecting a row hands
 * the product back so the inventory form can prefill its descriptive fields and
 * keep the link (`catalogProductId`) to the registration.
 */
export function CatalogPickerSheet({
	open,
	onClose,
	onSelect,
}: {
	open: boolean;
	onClose: () => void;
	onSelect: (product: CatalogProductResponse) => void;
}) {
	const [search, setSearch] = useState("");
	const [species, setSpecies] = useState<string>(ALL);
	const [therapeuticClass, setTherapeuticClass] = useState<string>(ALL);
	const [page, setPage] = useState(1);

	const debouncedSearch = useDebouncedValue(search, 300);

	const { products, total, isLoading, isFetching } = useDrugCatalog({
		q: debouncedSearch || undefined,
		species: species === ALL ? undefined : (species as CatalogSpecies),
		therapeuticClass: therapeuticClass === ALL ? undefined : therapeuticClass,
		page,
		pageSize: PAGE_SIZE,
		enabled: open,
	});

	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const fromRow = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const toRow = Math.min(page * PAGE_SIZE, total);

	const resetAndSet =
		<T,>(setter: (value: T) => void) =>
		(value: T) => {
			setter(value);
			setPage(1);
		};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[605px]!"
			>
				<FormHeader
					title="اختيار من كتالوج المستحضرات المسجَّلة"
					onClose={onClose}
				/>

				<div className="flex flex-col gap-3 border-b px-4 py-3">
					<div className="relative">
						<IconSearch className="pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => resetAndSet(setSearch)(e.target.value)}
							placeholder="ابحث بالاسم التجاري أو العلمي أو الشركة الصانعة..."
							className="ps-8 text-sm"
						/>
					</div>

					<div className="flex gap-2">
						<Select
							value={species}
							onValueChange={resetAndSet(setSpecies)}
							dir="rtl"
						>
							<SelectTrigger className="flex-1 text-sm">
								<SelectValue placeholder="كل الأنواع" />
							</SelectTrigger>
							{/* position="popper" — الافتراضي item-aligned يخرج خارج الشاشة في RTL */}
							<SelectContent
								dir="rtl"
								position="popper"
							>
								<SelectItem value={ALL}>كل الأنواع</SelectItem>
								{CATALOG_SPECIES_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={therapeuticClass}
							onValueChange={resetAndSet(setTherapeuticClass)}
							dir="rtl"
						>
							<SelectTrigger className="flex-1 text-sm">
								<SelectValue placeholder="كل الفئات" />
							</SelectTrigger>
							<SelectContent
								dir="rtl"
								position="popper"
							>
								<SelectItem value={ALL}>كل الفئات</SelectItem>
								{THERAPEUTIC_CLASSES.map((option) => (
									<SelectItem
										key={option.code}
										value={option.code}
									>
										{option.nameAr}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex flex-1 flex-col overflow-y-auto">
					{isLoading ? (
						<div className="flex flex-1 items-center justify-center py-10">
							<Spinner />
						</div>
					) : products.length === 0 ? (
						<EmptyState
							hasQuery={!!debouncedSearch || species !== ALL || therapeuticClass !== ALL}
						/>
					) : (
						<ul className={isFetching ? "opacity-60" : undefined}>
							{products.map((product) => (
								<li key={product.id}>
									<CatalogRow
										product={product}
										onSelect={() => {
											onSelect(product);
											onClose();
										}}
									/>
								</li>
							))}
						</ul>
					)}
				</div>

				{total > 0 && (
					<div className="border-t px-4 py-2">
						<TablePagination
							page={page - 1}
							pageCount={pageCount}
							totalRows={total}
							fromRow={fromRow}
							toRow={toRow}
							onPageChange={(index) => setPage(index + 1)}
							showPageSize={false}
						/>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
			<p className="font-semibold text-sm">
				{hasQuery ? "لا توجد نتائج مطابقة" : "لا توجد مستحضرات متاحة"}
			</p>
			<p className="text-muted-foreground text-xs leading-relaxed">
				{hasQuery
					? "جرّب اسمًا تجاريًا أو علميًا آخر، أو غيّر نوع الطفل أو الفئة العلاجية."
					: "لم يتم تفعيل أي معيار دوائي لهذه الأكاديمية. فعّله من الإعدادات ← معايير الأدوية."}
			</p>
		</div>
	);
}

function CatalogRow({
	product,
	onSelect,
}: {
	product: CatalogProductResponse;
	onSelect: () => void;
}) {
	const strength = [product.strength, product.strengthUnit].filter(Boolean).join(" ");
	const detail = [strength, product.dosageForm, product.routeOfAdministration]
		.filter(Boolean)
		.join(" · ");

	const speciesLabels = product.species
		.map((row) => CATALOG_SPECIES_OPTIONS.find((o) => o.value === row.species)?.label)
		.filter(Boolean) as string[];

	return (
		<button
			type="button"
			onClick={onSelect}
			className="flex w-full flex-col gap-1.5 border-b border-border/70 px-4 py-3 text-start transition-colors hover:bg-muted/50"
		>
			<div className="flex items-center gap-2">
				{/* الأسماء التجارية والعلمية لاتينية دائمًا — جزيرة LTR داخل الصفحة العربية */}
				<span
					dir="ltr"
					className="font-semibold text-sm"
				>
					{product.tradeName}
				</span>
				{product.authorizationStatus === "Suspended" && (
					<Badge variant="destructive">موقوف</Badge>
				)}
				{product.legalStatus === "Controlled" && <Badge variant="secondary">مراقَب</Badge>}
				{product.therapeuticClass && (
					<Badge variant="secondary">{product.therapeuticClass.nameAr}</Badge>
				)}
			</div>

			{/* dir="ltr" يجعل النص لاتينيًا صحيحًا، لكنه يقلب المحاذاة لليسار داخل عمود
			    RTL؛ self-start يُعيد السطر لحافة البداية (اليمين) كبقية الصف */}
			<span
				dir="ltr"
				className="self-start text-muted-foreground text-xs"
			>
				{product.genericName}
			</span>

			{detail && (
				<span
					dir="ltr"
					className="self-start text-muted-foreground text-xs"
				>
					{detail}
				</span>
			)}

			<div className="flex flex-wrap items-center gap-1">
				{product.allSpecies ? (
					<Badge variant="outline">كل الأنواع</Badge>
				) : speciesLabels.length > 0 ? (
					speciesLabels.map((label) => (
						<Badge
							key={label}
							variant="outline"
						>
							{label}
						</Badge>
					))
				) : (
					// غياب الأنواع في السجل ليس دليلًا على صلاحيته لكل نوع
					<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
						<IconAlertTriangle className="size-3" />
						الأنواع المستهدفة غير مذكورة في السجل
					</span>
				)}
			</div>

			<span className="text-[10px] text-muted-foreground">
				رقم التسجيل: {product.registerNumber}
				{(product.manufacturerName ?? product.marketingCompany)
					? ` — ${product.manufacturerName ?? product.marketingCompany}`
					: ""}
			</span>
		</button>
	);
}

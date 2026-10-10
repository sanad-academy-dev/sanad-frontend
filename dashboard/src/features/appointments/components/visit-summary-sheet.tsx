import {
	IconChevronDown,
	IconInfoCircle,
	IconMinus,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentProducts } from "@/features/appointments/hooks/use-appointment-products";
import { useAppointmentServices } from "@/features/appointments/hooks/use-appointment-services";
import { useUpdateAppointmentStatus } from "@/features/appointments/hooks/use-update-appointment-status";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { AppointmentStatus, InventoryCategory } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { AppointmentProductResponse } from "@/server/appointments/appointments.type";

// تصنيف عناصر المخزون إلى: أدوية / مستلزمات / أخرى
const MEDICATION_CATEGORIES = new Set<InventoryCategory>([
	InventoryCategory.ANTIBIOTIC,
	InventoryCategory.ANTI_INFLAMMATORY,
	InventoryCategory.VACCINE,
	InventoryCategory.SUPPLEMENT,
]);
const SUPPLY_CATEGORIES = new Set<InventoryCategory>([
	InventoryCategory.SUPPLIES,
	InventoryCategory.SURGICAL_TOOLS,
]);

type SectionKey = "medications" | "supplies" | "other";

const SECTION_META: Record<SectionKey, { title: string; subtitle: string; addLabel: string }> =
	{
		supplies: {
			title: "الأدوات المستدورة",
			subtitle: "كل الأدوات والمكونات المستدورة للطفل في الزيارة",
			addLabel: "إضافة أداة",
		},
		medications: {
			title: "الأدوية",
			subtitle: "يمكنك إضافة بعض الأدوية لابنك",
			addLabel: "إضافة عنصر",
		},
		other: {
			title: "أخرى",
			subtitle: "أصناف أخرى مستدورة في الزيارة",
			addLabel: "إضافة عنصر",
		},
	};

function sectionForCategory(category: InventoryCategory | undefined): SectionKey {
	if (category && MEDICATION_CATEGORIES.has(category)) return "medications";
	if (category && SUPPLY_CATEGORIES.has(category)) return "supplies";
	return "other";
}

const formatMoney = (value: string | number) => {
	const n = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

const billableQty = (p: { quantity: number; freeQuantity: number; fullyFree: boolean }) =>
	p.fullyFree ? 0 : Math.max(0, p.quantity - p.freeQuantity);

// عدّاد كمية صغير (- NN +)
function QtyStepper({
	value,
	min = 1,
	disabled,
	onChange,
}: {
	value: number;
	min?: number;
	disabled?: boolean;
	onChange: (next: number) => void;
}) {
	return (
		<div className="flex items-center gap-1">
			<Button
				type="button"
				size="icon"
				variant="outline"
				className="size-6"
				disabled={disabled || value <= min}
				onClick={() => onChange(value - 1)}
			>
				<IconMinus className="size-3" />
			</Button>
			<span className="w-7 text-center text-sm tabular-nums">
				{String(value).padStart(2, "0")}
			</span>
			<Button
				type="button"
				size="icon"
				variant="outline"
				className="size-6"
				disabled={disabled}
				onClick={() => onChange(value + 1)}
			>
				<IconPlus className="size-3" />
			</Button>
		</div>
	);
}

function ProductRow({
	product,
	remaining,
	visitLabel,
	disabled,
	onQty,
	onSetFullyFree,
	onSetFreeQty,
	onDelete,
}: {
	product: AppointmentProductResponse;
	remaining: number | null;
	visitLabel?: string;
	disabled: boolean;
	onQty: (next: number) => void;
	onSetFullyFree: (fullyFree: boolean) => void;
	onSetFreeQty: (freeQuantity: number) => void;
	onDelete: () => void;
}) {
	const issued = product.issuedAt !== null;
	const [expanded, setExpanded] = useState(false);
	const locked = disabled || issued;

	// نص الحالة أسفل الاسم
	const statusLine = product.fullyFree
		? "مشمول في الدورة"
		: product.freeQuantity > 0
			? `مجاني ${product.freeQuantity}، غير مجاني ${Math.max(0, product.quantity - product.freeQuantity)}`
			: null;

	return (
		<div className="flex flex-col gap-2 py-2.5">
			<div className="flex items-center justify-between gap-2">
				{/* اسم الصنف + سطر الحالة */}
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
						disabled={locked}
						onClick={onDelete}
					>
						<IconTrash className="size-3.5" />
					</Button>
					<button
						type="button"
						className="flex flex-1 items-center gap-1.5 text-right"
						onClick={() => setExpanded((v) => !v)}
					>
						<IconChevronDown
							className={cn(
								"size-3.5 shrink-0 text-muted-foreground transition-transform",
								expanded && "rotate-180",
							)}
						/>
						<div className="flex min-w-0 flex-col">
							<span className="truncate text-sm font-medium text-foreground">
								{product.nameSnapshot}
							</span>
							{statusLine && (
								<span
									className={cn(
										"text-[11px]",
										product.fullyFree ? "text-muted-foreground" : "text-rose-600",
									)}
								>
									{statusLine}
								</span>
							)}
						</div>
					</button>
				</div>

				{/* العدّاد + المتبقّي */}
				<div className="flex shrink-0 items-center gap-3">
					<QtyStepper
						value={product.quantity}
						disabled={locked}
						onChange={onQty}
					/>
					{remaining !== null && (
						<span className="w-14 text-xs text-muted-foreground tabular-nums">
							متبقي {remaining}
						</span>
					)}
				</div>
			</div>

			{/* نوع الاستهلاك (يظهر عند التوسيع) */}
			{expanded && (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2">
					<span className="text-xs font-medium text-foreground">نوع الاستهلاك:</span>

					<div className="flex items-center gap-4">
						{/* مجاني حتّى: [عدّاد] */}
						<label className="flex items-center gap-1.5 text-xs">
							<input
								type="radio"
								name={`consume-${product.id}`}
								checked={!product.fullyFree}
								disabled={locked}
								onChange={() => onSetFullyFree(false)}
								className="accent-primary"
							/>
							<span>مجاني حتّى:</span>
							<QtyStepper
								value={product.freeQuantity || 1}
								min={0}
								disabled={locked || product.fullyFree}
								onChange={onSetFreeQty}
							/>
						</label>

						{/* مجاني بالكامل */}
						<label className="flex items-center gap-1.5 text-xs">
							<input
								type="radio"
								name={`consume-${product.id}`}
								checked={product.fullyFree}
								disabled={locked}
								onChange={() => onSetFullyFree(true)}
								className="accent-primary"
							/>
							<span>مجاني بالكامل</span>
						</label>
					</div>
				</div>
			)}

			{/* سطر الزيارة/الدورة + السعر (نص فقط) */}
			<div className="flex items-center justify-between gap-2 ps-8">
				<span className="truncate text-xs text-muted-foreground">
					{visitLabel ? `مثال: ${visitLabel}` : "—"}
				</span>
				<span className="text-xs tabular-nums text-muted-foreground">
					{formatMoney(Number(product.priceSnapshot) * billableQty(product))} ر.س
				</span>
			</div>
		</div>
	);
}

export function VisitSummarySheet({
	appointmentId,
	open,
	onOpenChange,
}: {
	appointmentId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { appointment } = useAppointment(appointmentId ?? "");
	const { services } = useAppointmentServices(appointmentId ?? "");
	const {
		products,
		addProduct,
		deleteProduct,
		updateProduct,
		isAdding,
		isDeleting,
		isUpdating,
	} = useAppointmentProducts(appointmentId ?? "");
	const { inventory } = useInventory();
	const { updateStatus, isPending: isFinishing } = useUpdateAppointmentStatus();

	// أي قسم مفتوح لإضافة صنف جديد + الصنف المختار
	const [addingSection, setAddingSection] = useState<SectionKey | null>(null);
	const [addItemId, setAddItemId] = useState<string>("");

	const busy = isAdding || isDeleting || isUpdating;

	const inventoryById = useMemo(() => new Map(inventory.map((i) => [i.id, i])), [inventory]);

	// وصف الزيارة/الدورة الظاهر تحت كل صنف (نص فقط)
	const visitLabel = appointment?.consultationType?.name ?? appointment?.reason ?? undefined;

	// تجميع أصناف الموعد حسب القسم
	const grouped = useMemo(() => {
		const result: Record<SectionKey, AppointmentProductResponse[]> = {
			medications: [],
			supplies: [],
			other: [],
		};
		for (const p of products) {
			const inv = p.inventoryItemId ? inventoryById.get(p.inventoryItemId) : undefined;
			result[sectionForCategory(inv?.category)].push(p);
		}
		return result;
	}, [products, inventoryById]);

	// أصناف المخزون المتاحة للإضافة ضمن قسم معيّن
	const inventoryForSection = (section: SectionKey) =>
		inventory.filter((i) => i.active && sectionForCategory(i.category) === section);

	const subtotal = useMemo(
		() =>
			services.reduce((s, r) => s + Number(r.priceSnapshot) * r.quantity, 0) +
			products.reduce((s, r) => s + Number(r.priceSnapshot) * billableQty(r), 0),
		[services, products],
	);

	const handleAdd = async (item: { id: string; name: string; price: unknown }) => {
		await addProduct({
			inventoryItemId: item.id,
			nameSnapshot: item.name,
			priceSnapshot: Number(item.price),
			quantity: 1,
			freeQuantity: 0,
			fullyFree: false,
		});
		setAddingSection(null);
		setAddItemId("");
	};

	const handleSave = async () => {
		if (!appointment) return;
		// الأصناف محفوظة مباشرة؛ "حفظ" ينهي الزيارة (إلى انتظار الدفع)
		await updateStatus({ id: appointment.id, status: AppointmentStatus.AWAITING_PAYMENT });
		onOpenChange(false);
	};

	const renderSection = (section: SectionKey) => {
		const meta = SECTION_META[section];
		const rows = grouped[section];
		const options = inventoryForSection(section);
		const isAddingHere = addingSection === section;

		return (
			<div className="flex flex-col">
				{/* رأس القسم */}
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-foreground">{meta.title}</span>
						<span className="text-[11px] text-muted-foreground">{meta.subtitle}</span>
					</div>
				</div>

				{/* صفوف الأصناف */}
				<div className="mt-1 divide-y divide-[#ebebef]">
					{rows.map((p) => {
						const inv = p.inventoryItemId ? inventoryById.get(p.inventoryItemId) : undefined;
						return (
							<ProductRow
								key={p.id}
								product={p}
								remaining={inv ? inv.stock : null}
								visitLabel={visitLabel}
								disabled={busy}
								onQty={(next) => void updateProduct(p.id, { quantity: next })}
								onSetFullyFree={(fullyFree) => void updateProduct(p.id, { fullyFree })}
								onSetFreeQty={(freeQuantity) =>
									void updateProduct(p.id, { freeQuantity, fullyFree: false })
								}
								onDelete={() => void deleteProduct(p.id)}
							/>
						);
					})}
				</div>

				{/* إضافة صنف */}
				{isAddingHere ? (
					<div className="mt-2 flex items-center gap-2">
						<Select
							value={addItemId}
							onValueChange={setAddItemId}
							dir="rtl"
						>
							<SelectTrigger className="h-9 flex-1 text-sm">
								<SelectValue placeholder="اختر صنفًا..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{options.length === 0 ? (
									<div className="px-2 py-1.5 text-xs text-muted-foreground">
										لا توجد أصناف
									</div>
								) : (
									options.map((item) => (
										<SelectItem
											key={item.id}
											value={item.id}
										>
											{item.name}
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
						<Button
							type="button"
							size="sm"
							disabled={!addItemId || isAdding}
							onClick={() => {
								const item = inventoryById.get(addItemId);
								if (item) void handleAdd(item);
							}}
						>
							إضافة
						</Button>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="size-8"
							onClick={() => {
								setAddingSection(null);
								setAddItemId("");
							}}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				) : (
					<div className="mt-2 flex justify-start">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="gap-1.5"
							disabled={busy}
							onClick={() => {
								setAddingSection(section);
								setAddItemId("");
							}}
						>
							<IconPlus className="size-3.5" />
							{meta.addLabel}
						</Button>
					</div>
				)}
			</div>
		);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showOverlay={false}
				showCloseButton={false}
				className="flex flex-col gap-0 rounded-lg border p-0 shadow-lg data-[side=left]:inset-y-2 data-[side=left]:left-[calc(66.6667%+0.5rem)] data-[side=left]:right-2 data-[side=left]:h-auto data-[side=left]:w-auto data-[side=left]:max-w-none sm:data-[side=left]:max-w-none"
				dir="rtl"
			>
				<SheetHeader className="p-0">
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<SheetTitle className="text-sm font-semibold text-foreground">
							ملخص الزيارة وخطة العلاج
						</SheetTitle>
						<Button
							size="icon"
							variant="ghost"
							className="size-8"
							onClick={() => onOpenChange(false)}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				</SheetHeader>

				{/* شريط تنبيه */}
				<div className="flex items-center gap-1.5 bg-primary/5 px-4 py-2 text-[11px] text-primary">
					<IconInfoCircle className="size-3.5 shrink-0" />
					يرجى مراجعة ملخص الخطة والتأكيد من استخدام المكوّنات قبل الحفظ
				</div>

				{/* الإجمالي + نوع الكشف */}
				<div className="flex items-center justify-between gap-2 border-b px-4 py-3">
					{visitLabel && <span className="text-sm text-muted-foreground">{visitLabel}</span>}
					<span className="rounded-md border px-2.5 py-1 text-sm font-bold tabular-nums text-foreground">
						{formatMoney(subtotal)} ر.س
					</span>
				</div>

				{/* الأقسام */}
				<div className="flex-1 space-y-4 overflow-y-auto p-4">
					{renderSection("supplies")}
					<Separator />
					{renderSection("medications")}
					<Separator />
					{renderSection("other")}
				</div>

				{/* الفوتر */}
				<div className="border-t px-4 py-2">
					<Button
						className="w-full"
						size="sm"
						disabled={isFinishing || busy}
						onClick={() => void handleSave()}
					>
						حفظ
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

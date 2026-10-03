import { IconPlus, IconReceipt, IconStethoscope, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { PaymentModal } from "@/features/appointments/components/invoice/payment-modal";
import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentProducts } from "@/features/appointments/hooks/use-appointment-products";
import { useAppointmentServices } from "@/features/appointments/hooks/use-appointment-services";
import { useInvoice } from "@/features/appointments/hooks/use-invoice";
import { appointmentPaymentSubject } from "@/features/appointments/utils/payment-subject";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useLabTemplates } from "@/features/services/lab-tests/hooks/use-lab-templates";
import { useRadiologyTemplates } from "@/features/services/radiology/hooks/use-radiology-templates";
import { ConfirmDiscard } from "@/features/settings/components/confirm-discard";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import { cn } from "@/lib/utils";
import type {
	AppointmentProductResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import {
	billableProductQty,
	type PaymentScope,
	type SectionScope,
	sectionAmount,
} from "@sanad/contracts/runtime/server/invoices/invoice-sections";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";
import type { ServiceItemResponse } from "@/server/services/services.type";

const formatMoney = (value: string | number) => {
	const n = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

interface ServiceDraft {
	serviceId: string;
	quantity: number;
}

const DRAFT_INITIAL: ServiceDraft = { serviceId: "", quantity: 1 };

interface ProductDraft {
	inventoryItemId: string;
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
}

const PRODUCT_DRAFT_INITIAL: ProductDraft = {
	inventoryItemId: "",
	quantity: 1,
	freeQuantity: 0,
	fullyFree: false,
};

interface InvoiceTabProps {
	appointmentId: string;
}

export function InvoiceTab({ appointmentId }: InvoiceTabProps) {
	const { appointment } = useAppointment(appointmentId);
	const {
		services,
		addService,
		deleteService,
		updateService,
		isAdding,
		isDeleting,
		isUpdating,
	} = useAppointmentServices(appointmentId);
	const {
		products,
		addProduct,
		deleteProduct,
		updateProduct,
		isAdding: isAddingProduct,
		isDeleting: isDeletingProduct,
		isUpdating: isUpdatingProduct,
	} = useAppointmentProducts(appointmentId);
	const { invoice, ensureInvoice, isEnsuring, payInvoice, isPaying } =
		useInvoice(appointmentId);
	const { tree } = useServicesTree();
	const { inventory } = useInventory();

	const [isAddingRow, setIsAddingRow] = useState(false);
	const [draft, setDraft] = useState<ServiceDraft>(DRAFT_INITIAL);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editQty, setEditQty] = useState(1);
	const [isAddingProductRow, setIsAddingProductRow] = useState(false);
	const [productDraft, setProductDraft] = useState<ProductDraft>(PRODUCT_DRAFT_INITIAL);
	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [editProductQty, setEditProductQty] = useState(1);
	const [editProductFreeQty, setEditProductFreeQty] = useState(0);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	// القسم الجاري سداده — "ALL" دفعة حرّة على الفاتورة كلها
	const [payScope, setPayScope] = useState<PaymentScope>("ALL");
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);

	// التحاليل وفحوصات الأشعة تُفوتَر على فاتورة طلبها لا هنا — نستبعدها من
	// قائمة الإضافة حتى لا يعود المبلغ محسوبًا مرتين. تُطلب من «خطة العلاج».
	const { templates: labTemplates } = useLabTemplates();
	const labServiceIds = useMemo(
		() => new Set(labTemplates.map((t) => t.serviceId)),
		[labTemplates],
	);
	const { templates: radiologyTemplates } = useRadiologyTemplates();
	const radiologyServiceIds = useMemo(
		() => new Set(radiologyTemplates.map((t) => t.serviceId)),
		[radiologyTemplates],
	);

	type ServiceItemWithPricing = ServiceItemResponse & { price: number; duration: number };
	const flatItems = useMemo<ServiceItemWithPricing[]>(
		() =>
			tree
				.flatMap((cat) => cat.children.flatMap((sub) => sub.children))
				.filter(
					(item): item is ServiceItemWithPricing =>
						item.price !== null &&
						item.duration !== null &&
						!labServiceIds.has(item.id) &&
						!radiologyServiceIds.has(item.id),
				),
		[tree, labServiceIds, radiologyServiceIds],
	);

	const consultationType = appointment?.consultationType ?? null;
	// رسم الكشف المعتمد في الفوترة هو اللقطة المأخوذة عند الحجز — لا سعر الإعدادات الحالي
	const consultationFee =
		appointment?.consultationFeeSnapshot != null
			? Number(appointment.consultationFeeSnapshot)
			: null;
	const hasBillableConsultation = (consultationFee ?? 0) > 0;

	const selectedItem = flatItems.find((i) => i.id === draft.serviceId);
	const selectedInventoryItem = inventory.find((i) => i.id === productDraft.inventoryItemId);
	const isPaid = invoice?.status === "PAID";
	const isPartial = invoice?.status === "PARTIAL";
	const isAwaitingPayment = appointment?.status === "AWAITING_PAYMENT";

	// مجموع كل قسم قبل الخصم والضريبة — أساس بطاقات الأعلى وحصة القسم عند الدفع
	const sectionSubtotals = useMemo<Record<SectionScope, number>>(
		() => ({
			CONSULTATION: consultationFee ?? 0,
			SERVICES: services.reduce(
				(sum, row) => sum + Number(row.priceSnapshot) * row.quantity,
				0,
			),
			PRODUCTS: products.reduce(
				(sum, row) => sum + Number(row.priceSnapshot) * billableProductQty(row),
				0,
			),
		}),
		[services, products, consultationFee],
	);
	const subtotal =
		sectionSubtotals.CONSULTATION + sectionSubtotals.SERVICES + sectionSubtotals.PRODUCTS;

	// حالة سداد كل قسم مستقلة — يمكن دفع الكشف وحده ثم الدورات لاحقًا
	const sectionPaid: Record<SectionScope, boolean> = {
		CONSULTATION: appointment?.consultationPaidAt != null,
		SERVICES: services.length > 0 && services.every((row) => row.paidAt !== null),
		PRODUCTS: products.length > 0 && products.every((row) => row.paidAt !== null),
	};

	// الفاتورة تشمل الكشف والدورات والأصناف معًا — أي واحد منها يكفي لفتح الدفع
	const hasBillableLines =
		services.length > 0 || products.length > 0 || hasBillableConsultation;
	type FeeState = "paid" | "partial" | "unpaid" | "no-services";
	const feeState: FeeState = isPaid
		? "paid"
		: isPartial
			? "partial"
			: !hasBillableLines
				? "no-services"
				: "unpaid";
	const feeBadge: Record<FeeState, { label: string; cls: string }> = {
		paid: {
			label: "مدفوعة",
			cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
		},
		partial: {
			label: "دفع جزئي",
			cls: "border-amber-200 bg-amber-50 text-amber-700",
		},
		unpaid: {
			label: isAwaitingPayment ? "جاهز للدفع" : "غير مدفوعة",
			cls: "border-indigo-200 bg-indigo-50 text-indigo-700",
		},
		"no-services": {
			label: "أضف كشفًا أو دورة",
			cls: "border-muted bg-muted text-muted-foreground",
		},
	};
	const currentFeeBadge = feeBadge[feeState];
	// الدفع متاح في أي وقت ما دام هناك مستحق — لا ينتظر انتقال الزيارة لـ"بانتظار الدفع"
	const canPay = hasBillableLines && !isPaid;

	// المبلغ المعروض في نافذة الدفع: حصة القسم من الإجمالي (بعد الخصم والضريبة)،
	// أو المتبقي كاملًا عند "دفع الكل" — بنفس صيغة الخادم فلا يختلف المعروض عن المخصوم
	const invoiceTotal = invoice ? Number(invoice.total) : 0;
	const invoiceRemaining = invoice ? invoiceTotal - Number(invoice.amountPaid) : 0;
	const scopeAmount = (scope: PaymentScope) =>
		scope === "ALL"
			? invoiceRemaining
			: Math.min(
					sectionAmount(sectionSubtotals[scope], subtotal, invoiceTotal),
					invoiceRemaining,
				);

	const SECTION_CARDS: {
		scope: SectionScope;
		label: string;
		hint: string | null;
	}[] = [
		{
			scope: "CONSULTATION",
			label: "الكشف",
			hint: consultationType?.name ?? null,
		},
		{
			scope: "SERVICES",
			label: "الدورات",
			hint: services.length > 0 ? `${services.length} دورة` : null,
		},
		{
			scope: "PRODUCTS",
			label: "الأدوية والمستلزمات",
			hint: products.length > 0 ? `${products.length} صنف` : null,
		},
	];

	const handleConfirmAdd = async () => {
		if (!selectedItem || isAdding) return;
		await addService({
			serviceId: selectedItem.id,
			quantity: draft.quantity,
			priceSnapshot: selectedItem.price,
			durationSnapshot: selectedItem.duration,
		});
		setDraft(DRAFT_INITIAL);
		setIsAddingRow(false);
	};

	const handleConfirmEdit = async (row: AppointmentServiceResponse) => {
		await updateService(row.id, { quantity: editQty });
		setEditingId(null);
	};

	const startEdit = (row: AppointmentServiceResponse) => {
		setEditingId(row.id);
		setEditQty(row.quantity);
	};

	const isBusy = isAdding || isDeleting || isUpdating;

	const handleConfirmAddProduct = async () => {
		if (!selectedInventoryItem || isAddingProduct) return;
		await addProduct({
			inventoryItemId: selectedInventoryItem.id,
			nameSnapshot: selectedInventoryItem.name,
			priceSnapshot: Number(selectedInventoryItem.price),
			quantity: productDraft.quantity,
			freeQuantity: productDraft.freeQuantity,
			fullyFree: productDraft.fullyFree,
		});
		setProductDraft(PRODUCT_DRAFT_INITIAL);
		setIsAddingProductRow(false);
	};

	const handleConfirmEditProduct = async (row: AppointmentProductResponse) => {
		await updateProduct(row.id, {
			quantity: editProductQty,
			freeQuantity: editProductFreeQty,
		});
		setEditingProductId(null);
	};

	const startEditProduct = (row: AppointmentProductResponse) => {
		setEditingProductId(row.id);
		setEditProductQty(row.quantity);
		setEditProductFreeQty(row.freeQuantity);
	};

	const isProductBusy = isAddingProduct || isDeletingProduct || isUpdatingProduct;

	const openPaymentModal = async (scope: PaymentScope) => {
		if (!hasBillableLines) return;
		try {
			await ensureInvoice();
			setPayScope(scope);
			setIsPaymentOpen(true);
		} catch {
			// toast handled by hook
		}
	};

	const handlePay = async (
		amountPaid: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
		redeemPoints?: number,
	) => {
		try {
			const paid = await payInvoice("CASH", amountPaid, payScope, insurance, redeemPoints);
			if (paid.status === "PAID") setSuccessInvoice(paid);
			setIsPaymentOpen(false);
		} catch {
			// toast handled by hook
		}
	};

	return (
		<TabsContent
			value="invoice"
			className="flex flex-col gap-6 overflow-y-auto p-6"
			dir="rtl"
		>
			{/* بطاقات الأقسام — كل قسم بمجموعه وحالته وزر سداده المستقل */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{SECTION_CARDS.map(({ scope, label, hint }) => {
					const amount = sectionSubtotals[scope];
					const paid = sectionPaid[scope];
					const hasAmount = amount > 0;
					return (
						<div
							key={scope}
							className="flex flex-col justify-between rounded-lg border bg-card p-4"
						>
							<div>
								<div className="flex items-center justify-between gap-2">
									<p className="text-xs text-muted-foreground">{label}</p>
									{hasAmount && (
										<Badge
											variant="outline"
											className={cn(
												"rounded-full px-2 py-0.5 text-[11px]",
												paid
													? "border-emerald-200 bg-emerald-50 text-emerald-700"
													: "border-rose-200 bg-rose-50 text-rose-700",
											)}
										>
											{paid ? "مدفوعة" : "غير مدفوعة"}
										</Badge>
									)}
								</div>
								<p
									className={cn(
										"mt-2 text-2xl font-semibold tabular-nums",
										!hasAmount && "text-muted-foreground",
									)}
								>
									{hasAmount ? `${formatMoney(amount)} ر.س` : "—"}
								</p>
								{hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
							</div>

							{hasAmount && !paid && canPay && (
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="mt-3 gap-1.5"
									onClick={() => void openPaymentModal(scope)}
									disabled={isEnsuring || isPaying}
								>
									<IconReceipt className="size-3.5" />
									دفع {label}
								</Button>
							)}
						</div>
					);
				})}
			</div>

			{/* الإجمالي — سداد الفاتورة كلها دفعة واحدة */}
			<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
				<div>
					<div className="flex items-center gap-2">
						<p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
						<Badge
							variant="outline"
							className={cn("rounded-full px-2 py-0.5 text-[11px]", currentFeeBadge.cls)}
						>
							{currentFeeBadge.label}
						</Badge>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{formatMoney(subtotal)} ر.س
					</p>
					{isPartial && invoice && (
						<p className="mt-1 text-xs text-muted-foreground tabular-nums">
							مدفوع {formatMoney(Number(invoice.amountPaid))} من {formatMoney(invoiceTotal)}{" "}
							ر.س
						</p>
					)}
				</div>

				{canPay && (
					<Button
						type="button"
						size="sm"
						className="gap-1.5"
						onClick={() => void openPaymentModal("ALL")}
						disabled={isEnsuring || isPaying}
					>
						<IconReceipt className="size-3.5" />
						{isPartial ? "تسجيل دفعة" : "دفع الكل"}
					</Button>
				)}
			</div>

			{/* الكشف في جدول مستقل قبل الدورات — رسم مستقل بسداد مستقل */}
			{consultationType && (
				<div className="flex flex-col gap-3">
					<h3 className="text-base font-semibold">الكشف</h3>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-right">نوع الكشف</TableHead>
									<TableHead className="text-center">العدد</TableHead>
									<TableHead className="text-center">الحالة</TableHead>
									<TableHead className="text-center">الإجمالي</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="text-sm font-medium">
										<div className="flex items-center gap-1.5">
											<IconStethoscope className="size-3.5 shrink-0 text-muted-foreground" />
											{consultationType.name}
										</div>
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										1
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className={cn(
												"rounded-full text-xs",
												sectionPaid.CONSULTATION
													? "border-emerald-200 bg-emerald-50 text-emerald-700"
													: "border-rose-200 bg-rose-50 text-rose-700",
											)}
										>
											{sectionPaid.CONSULTATION ? "مدفوعة" : "غير مدفوعة"}
										</Badge>
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{consultationFee !== null ? `${formatMoney(consultationFee)} ر.س` : "—"}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">الدورات</h3>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1.5"
						disabled={isBusy || isAddingRow}
						onClick={() => setIsAddingRow(true)}
					>
						<IconPlus className="size-3.5" />
						إضافة دورة
					</Button>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-right">الدورة</TableHead>
								<TableHead className="text-center">الفئة</TableHead>
								<TableHead className="text-center">الوقت</TableHead>
								<TableHead className="text-center">العدد</TableHead>
								<TableHead className="text-center">الحالة</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead className="text-center">الإجراءات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.length === 0 && !isAddingRow && (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-center text-sm text-muted-foreground"
									>
										لا توجد دورات مضافة
									</TableCell>
								</TableRow>
							)}
							{services.map((row) => {
								const isRowPaid = row.paidAt !== null;
								return (
									<TableRow key={row.id}>
										<TableCell className="text-sm font-medium">{row.service.name}</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="secondary"
												className="rounded-sm text-xs"
											>
												فحص
											</Badge>
										</TableCell>
										<TableCell className="text-center text-sm text-muted-foreground">
											{row.durationSnapshot} دقيقة
										</TableCell>
										<TableCell className="text-center">
											{editingId === row.id ? (
												<Input
													type="number"
													min={1}
													value={editQty}
													onChange={(e) => setEditQty(Number(e.target.value))}
													className="h-7 w-16 text-center"
												/>
											) : (
												<button
													type="button"
													className="text-sm hover:underline disabled:opacity-50"
													onClick={() => startEdit(row)}
													disabled={isBusy || isRowPaid}
												>
													{row.quantity}
												</button>
											)}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className={cn(
													"rounded-full text-xs",
													isRowPaid
														? "border-emerald-200 bg-emerald-50 text-emerald-700"
														: "border-rose-200 bg-rose-50 text-rose-700",
												)}
											>
												{isRowPaid ? "مدفوعة" : "غير مدفوعة"}
											</Badge>
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{formatMoney(Number(row.priceSnapshot) * row.quantity)} ر.س
										</TableCell>
										<TableCell className="text-center">
											{editingId === row.id ? (
												<ConfirmDiscard
													onConfirm={() => void handleConfirmEdit(row)}
													onDiscard={() => setEditingId(null)}
													disabled={isBusy}
													confirmDisabled={isBusy || editQty < 1}
												/>
											) : (
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="h-6 w-6 text-muted-foreground hover:text-destructive"
													disabled={isBusy || isRowPaid}
													onClick={() => void deleteService(row.id)}
												>
													<IconTrash className="size-3.5" />
												</Button>
											)}
										</TableCell>
									</TableRow>
								);
							})}

							{isAddingRow && (
								<TableRow>
									<TableCell colSpan={2}>
										<Select
											value={draft.serviceId}
											onValueChange={(v) => setDraft((d) => ({ ...d, serviceId: v }))}
											dir="rtl"
										>
											<SelectTrigger className="h-7 w-full text-sm">
												<SelectValue placeholder="اختر دورة..." />
											</SelectTrigger>
											<SelectContent>
												{flatItems.map((item) => (
													<SelectItem
														key={item.id}
														value={item.id}
													>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="text-center text-sm text-muted-foreground">
										{selectedItem ? `${selectedItem.duration} دقيقة` : "—"}
									</TableCell>
									<TableCell className="text-center">
										<Input
											type="number"
											min={1}
											value={draft.quantity}
											onChange={(e) =>
												setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))
											}
											className="h-7 w-16 text-center"
										/>
									</TableCell>
									<TableCell />
									<TableCell className="text-center text-sm tabular-nums">
										{selectedItem
											? `${formatMoney(selectedItem.price * draft.quantity)} ر.س`
											: "—"}
									</TableCell>
									<TableCell className="text-center">
										<ConfirmDiscard
											onConfirm={() => void handleConfirmAdd()}
											onDiscard={() => {
												setIsAddingRow(false);
												setDraft(DRAFT_INITIAL);
											}}
											disabled={isAdding}
											confirmDisabled={isAdding || !draft.serviceId}
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">الأدوية والمستلزمات</h3>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1.5"
						disabled={isProductBusy || isAddingProductRow || isPaid}
						onClick={() => setIsAddingProductRow(true)}
					>
						<IconPlus className="size-3.5" />
						إضافة صنف
					</Button>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-right">الصنف</TableHead>
								<TableHead className="text-center">الكمية</TableHead>
								<TableHead className="text-center">المجانية</TableHead>
								<TableHead className="text-center">الحالة</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead className="text-center">الإجراءات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.length === 0 && !isAddingProductRow && (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center text-sm text-muted-foreground"
									>
										لا توجد أصناف مضافة
									</TableCell>
								</TableRow>
							)}
							{products.map((row) => {
								const isRowIssued = row.issuedAt !== null;
								const billableQty = billableProductQty(row);
								return (
									<TableRow key={row.id}>
										<TableCell className="text-sm font-medium">{row.nameSnapshot}</TableCell>
										<TableCell className="text-center">
											{editingProductId === row.id ? (
												<Input
													type="number"
													min={1}
													value={editProductQty}
													onChange={(e) => setEditProductQty(Number(e.target.value))}
													className="h-7 w-16 text-center"
												/>
											) : (
												<button
													type="button"
													className="text-sm hover:underline disabled:opacity-50"
													onClick={() => startEditProduct(row)}
													disabled={isProductBusy || isRowIssued}
												>
													{row.quantity}
												</button>
											)}
										</TableCell>
										<TableCell className="text-center">
											{editingProductId === row.id ? (
												<Input
													type="number"
													min={0}
													value={editProductFreeQty}
													onChange={(e) => setEditProductFreeQty(Number(e.target.value))}
													className="h-7 w-16 text-center"
												/>
											) : row.fullyFree ? (
												<Badge
													variant="outline"
													className="rounded-full text-xs border-indigo-200 bg-indigo-50 text-indigo-700"
												>
													مجاني بالكامل
												</Badge>
											) : (
												<span className="text-sm text-muted-foreground">
													{row.freeQuantity}
												</span>
											)}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className={cn(
													"rounded-full text-xs",
													isRowIssued
														? "border-emerald-200 bg-emerald-50 text-emerald-700"
														: "border-rose-200 bg-rose-50 text-rose-700",
												)}
											>
												{isRowIssued ? "مصروف" : "غير مصروف"}
											</Badge>
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{formatMoney(Number(row.priceSnapshot) * billableQty)} ر.س
										</TableCell>
										<TableCell className="text-center">
											{editingProductId === row.id ? (
												<ConfirmDiscard
													onConfirm={() => void handleConfirmEditProduct(row)}
													onDiscard={() => setEditingProductId(null)}
													disabled={isProductBusy}
													confirmDisabled={isProductBusy || editProductQty < 1}
												/>
											) : (
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="h-6 w-6 text-muted-foreground hover:text-destructive"
													disabled={isProductBusy || isRowIssued}
													onClick={() => void deleteProduct(row.id)}
												>
													<IconTrash className="size-3.5" />
												</Button>
											)}
										</TableCell>
									</TableRow>
								);
							})}

							{isAddingProductRow && (
								<TableRow>
									<TableCell>
										<Select
											value={productDraft.inventoryItemId}
											onValueChange={(v) =>
												setProductDraft((d) => ({ ...d, inventoryItemId: v }))
											}
											dir="rtl"
										>
											<SelectTrigger className="h-7 w-full text-sm">
												<SelectValue placeholder="اختر صنفًا..." />
											</SelectTrigger>
											<SelectContent>
												{inventory.map((item) => (
													<SelectItem
														key={item.id}
														value={item.id}
													>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="text-center">
										<Input
											type="number"
											min={1}
											value={productDraft.quantity}
											onChange={(e) =>
												setProductDraft((d) => ({
													...d,
													quantity: Number(e.target.value),
												}))
											}
											className="h-7 w-16 text-center"
										/>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex flex-col items-center gap-1">
											<Input
												type="number"
												min={0}
												value={productDraft.freeQuantity}
												disabled={productDraft.fullyFree}
												onChange={(e) =>
													setProductDraft((d) => ({
														...d,
														freeQuantity: Number(e.target.value),
													}))
												}
												className="h-7 w-16 text-center"
											/>
											<Label className="flex items-center gap-1 text-[10px] font-normal text-muted-foreground">
												<Checkbox
													checked={productDraft.fullyFree}
													onCheckedChange={(v) =>
														setProductDraft((d) => ({ ...d, fullyFree: v === true }))
													}
												/>
												مجاني بالكامل
											</Label>
										</div>
									</TableCell>
									<TableCell />
									<TableCell className="text-center text-sm tabular-nums">
										{selectedInventoryItem
											? `${formatMoney(
													Number(selectedInventoryItem.price) *
														billableProductQty(productDraft),
												)} ر.س`
											: "—"}
									</TableCell>
									<TableCell className="text-center">
										<ConfirmDiscard
											onConfirm={() => void handleConfirmAddProduct()}
											onDiscard={() => {
												setIsAddingProductRow(false);
												setProductDraft(PRODUCT_DRAFT_INITIAL);
											}}
											disabled={isAddingProduct}
											confirmDisabled={isAddingProduct || !productDraft.inventoryItemId}
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{appointment && invoice && isPaymentOpen && (
				<PaymentModal
					open={isPaymentOpen}
					onClose={() => setIsPaymentOpen(false)}
					invoice={invoice}
					subject={appointmentPaymentSubject({ appointment, services, products })}
					onPay={handlePay}
					isPaying={isPaying}
					// [LY-P2] §10.4 — فاتورة الزيارة هي المسار الموصَّل بالاستبدال
					allowRedemption
					defaultAmount={scopeAmount(payScope)}
					sectionLabel={
						payScope === "ALL"
							? undefined
							: SECTION_CARDS.find((s) => s.scope === payScope)?.label
					}
				/>
			)}

			{appointment && successInvoice && (
				<PaymentSuccessModal
					open={!!successInvoice}
					onClose={() => setSuccessInvoice(null)}
					invoice={successInvoice}
					services={services}
					products={products}
					appointment={appointment}
					ownerName={appointment.owner.name}
					patientName={appointment.patient.name}
				/>
			)}
		</TabsContent>
	);
}

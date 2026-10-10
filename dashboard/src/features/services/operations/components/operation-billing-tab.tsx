import {
	IconCircleCheckFilled,
	IconFlame,
	IconLock,
	IconPackageExport,
	IconPlus,
	IconReceipt,
	IconRefresh,
	IconScissors,
	IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
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
import { PaymentModal } from "@/features/appointments/components/invoice/payment-modal";
import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useOperationCaseMutations } from "@/features/services/operations/hooks/use-operation-case";
import { PaymentMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type {
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import { sectionAmount } from "@sanad/contracts/runtime/server/invoices/invoice-sections";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";
import {
	OPERATION_PAYMENT_META,
	type OperationCaseDetailResponse,
	operationPaymentStatus,
} from "@sanad/contracts/runtime/server/operations/operations.type";

// تبويب فاتورة الحالة — نفس بنية تبويب فاتورة الأشعة ونفس نافذة الدفع:
// بطاقات في الأعلى، شريط إجمالي بزر «دفع الكل»، ثم جدول البنود وفيه زر سداد
// لكل بند على حدة. تحته إدارة المستهلكات: عدة القالب ضمن السعر (لا تُحذف)،
// المحروقات مجانية وتُصرف من المخزون، والبنود الإضافية وحدها تُفوتر.

/** Decimal يصل من الخادم ككائن/نص — نحوّله بالنص لتفادي فقد الدقة */
const formatMoney = (value: unknown) => {
	const n = Number(value ?? 0);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

/** نوع البند المضاف من الواجهة — عدة القالب (KIT) تُنسخ عند الإنشاء فقط */
type AddableConsumableType = "BURNED" | "ADDITIONAL";

const ADDABLE_TYPE_LABELS: Record<AddableConsumableType, string> = {
	ADDITIONAL: "إضافي — يُفوتر",
	BURNED: "محروقات — ضمن السعر",
};

export function OperationBillingTab({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const invoice = c.invoice;
	const payment = operationPaymentStatus(c);
	const paymentMeta = OPERATION_PAYMENT_META[payment];

	// البند الجاري سداده: معرّف بند، أو "ALL" لدفعة على الفاتورة كلها
	const [payTarget, setPayTarget] = useState<string | null>(null);
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);

	// بنود الفاتورة = الإجراءات + المستهلكات الإضافية وحدها (KIT/BURNED ضمن السعر)
	const lines = [
		...c.procedures.map((p) => ({
			id: p.id,
			name: p.nameSnapshot,
			badge: "إجراء",
			amount: Number(p.priceSnapshot),
		})),
		...c.consumables
			.filter((item) => item.type === "ADDITIONAL")
			.map((item) => ({
				id: item.id,
				name: item.nameSnapshot,
				badge: "مستهلك",
				amount: Number(item.priceSnapshot) * item.quantity,
			})),
	];
	const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
	const total = Number(invoice?.total ?? 0);
	const amountPaid = Number(invoice?.amountPaid ?? 0);
	const remaining = Math.max(0, total - amountPaid);
	const isPaid = payment === "PAID";
	const isPartial = amountPaid > 0 && !isPaid;
	const canPay = !!invoice && !isPaid && lines.length > 0;

	// حصة البند من الإجمالي (بعد الخصم والضريبة) — نفس صيغة الخادم
	const itemAmount = (price: number) =>
		Math.min(sectionAmount(price, subtotal, total), remaining);

	const target = payTarget && payTarget !== "ALL" ? payTarget : null;
	const targetLine = target ? lines.find((line) => line.id === target) : null;

	const handlePay = async (
		value: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
	) => {
		try {
			const paid = await mutations.payInvoice({
				amountPaid: value,
				paymentMethod: PaymentMethod.CASH,
				insurance,
			});
			if (paid.status === "PAID") setSuccessInvoice(paid as unknown as InvoiceResponse);
			setPayTarget(null);
		} catch {
			// التوست يُدار داخل الخطّاف
		}
	};

	return (
		<div
			className="flex flex-col gap-6"
			dir="rtl"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconScissors className="size-3.5" />
						<span>عدد البنود</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">{lines.length}</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconReceipt className="size-3.5" />
						<span>رقم الفاتورة</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{invoice ? (
							invoice.code
						) : (
							<span className="text-lg text-muted-foreground">لم تُصدر بعد</span>
						)}
					</p>
					{invoice && (
						<p className="mt-1 truncate text-xs text-muted-foreground">
							المسدَّد: {formatMoney(amountPaid)} ر.س
						</p>
					)}
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center justify-between gap-2">
						<p className="text-xs text-muted-foreground">المتبقّي</p>
						<Badge
							variant="outline"
							className={cn("rounded-full px-2 py-0.5 text-[11px]", paymentMeta.className)}
						>
							{paymentMeta.label}
						</Badge>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{formatMoney(remaining)} ر.س
					</p>
				</div>
			</div>

			{/* الإجمالي — سداد الفاتورة كلها دفعة واحدة */}
			<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
				<div>
					<p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{formatMoney(invoice?.total ?? subtotal)} ر.س
					</p>
					{invoice && (
						<p className="mt-1 text-xs tabular-nums text-muted-foreground">
							يشمل الضريبة ({Number(invoice.vatRate)}%): {formatMoney(invoice.vatAmount)} ر.س
						</p>
					)}
					{isPartial && (
						<p className="mt-1 text-xs tabular-nums text-muted-foreground">
							مدفوع {formatMoney(amountPaid)} من {formatMoney(total)} ر.س
						</p>
					)}
				</div>

				<div className="flex items-center gap-1.5">
					{/* الفاتورة تُصدر مع الحالة وتتحدث تلقائيًا — الزر للحالات القديمة بلا فاتورة فقط */}
					{!invoice && (
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="gap-1.5"
							onClick={() => void mutations.refreshInvoice().catch(() => {})}
							disabled={mutations.isPending}
						>
							<IconRefresh className="size-3.5" />
							إصدار الفاتورة
						</Button>
					)}
					{canPay && (
						<Button
							type="button"
							size="sm"
							className="gap-1.5"
							onClick={() => setPayTarget("ALL")}
							disabled={mutations.isPending}
						>
							<IconReceipt className="size-3.5" />
							{isPartial ? "تسجيل دفعة" : "دفع الكل"}
						</Button>
					)}
				</div>
			</div>

			{/* بنود الفاتورة — الإجراءات والبنود الإضافية بلقطات أسعارها */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">بنود الفاتورة</h3>
					{!invoice && (
						<span className="text-xs text-muted-foreground">
							«إصدار الفاتورة» يبنيها من الإجراءات والبنود الإضافية
						</span>
					)}
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">البند</TableHead>
								<TableHead className="text-center">النوع</TableHead>
								<TableHead className="text-center">الحالة</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead className="text-center">الإجراءات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{lines.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center text-sm text-muted-foreground"
									>
										لا توجد بنود على هذه الفاتورة
									</TableCell>
								</TableRow>
							)}
							{lines.map((line) => (
								<TableRow key={line.id}>
									<TableCell className="text-sm font-medium">{line.name}</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{line.badge}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className={cn(
												"rounded-full text-xs",
												isPaid
													? "border-emerald-200 bg-emerald-50 text-emerald-700"
													: "border-rose-200 bg-rose-50 text-rose-700",
											)}
										>
											{isPaid ? "مدفوعة" : "غير مدفوعة"}
										</Badge>
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{formatMoney(line.amount)} ر.س
									</TableCell>
									<TableCell className="text-center">
										{!isPaid && canPay && (
											<Button
												type="button"
												size="sm"
												variant="outline"
												className="gap-1.5"
												onClick={() => setPayTarget(line.id)}
												disabled={mutations.isPending}
											>
												<IconReceipt className="size-3.5" />
												دفع
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<ConsumablesSection operationCase={c} />

			{invoice && payTarget && (
				<PaymentModal
					open={!!payTarget}
					onClose={() => setPayTarget(null)}
					invoice={invoice as unknown as InvoiceResponse}
					subject={{
						heading: "طلب دفع فاتورة عملية",
						ownerName: c.owner.name,
						ownerId: c.owner.id,
						date: c.scheduledAt ?? c.createdAt,
						lines: lines.map((line) => ({
							id: line.id,
							name: line.name,
							badge: line.badge,
							amountLabel: `${formatMoney(line.amount)} ر.س`,
						})),
					}}
					onPay={handlePay}
					isPaying={mutations.isPending}
					defaultAmount={targetLine ? itemAmount(targetLine.amount) : remaining}
					sectionLabel={targetLine?.name}
				/>
			)}

			{successInvoice && (
				<PaymentSuccessModal
					open={!!successInvoice}
					onClose={() => setSuccessInvoice(null)}
					invoice={successInvoice}
					// بنود العملية بشكل بنود الزيارة — قالب طباعة واحد للمصادر كلها
					services={
						lines.map((line) => ({
							id: line.id,
							quantity: 1,
							priceSnapshot: line.amount,
							paidAt: invoice?.paidAt ?? null,
							service: { name: line.name },
						})) as unknown as AppointmentServiceResponse[]
					}
					appointment={
						{
							startsAt: c.scheduledAt ?? c.createdAt,
							consultationFeeSnapshot: null,
							consultationType: null,
							owner: { name: c.owner.name },
							patient: { name: c.patient.name },
						} as unknown as AppointmentResponse
					}
					ownerName={c.owner.name}
					patientName={c.patient.name}
					servicesLabel="بنود العملية"
				/>
			)}
		</div>
	);
}

// ── المستهلكات — عدة القالب والمحروقات والبنود الإضافية ─────────────────────

export function ConsumablesSection({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const { inventory, isLoading: inventoryLoading } = useInventory();
	const [itemId, setItemId] = useState("");
	const [name, setName] = useState("");
	const [qty, setQty] = useState("1");
	const [price, setPrice] = useState("");
	const [addType, setAddType] = useState<AddableConsumableType>("ADDITIONAL");

	const invoicePaid = c.invoice?.status === "PAID";
	const activeItems = inventory.filter((item) => item.active);
	const selectedItem = activeItems.find((item) => item.id === itemId);
	const canAdd = Boolean(itemId || name.trim());

	const addConsumable = () => {
		if (!canAdd) return;
		void mutations
			.addConsumable({
				inventoryItemId: itemId || null,
				name: itemId ? null : name.trim(),
				quantity: Number(qty) || 1,
				// السعر يعني شيئًا للبند الإضافي وحده — المحروقات لقطتها من الصنف
				price: addType === "ADDITIONAL" && price !== "" ? Number(price) : null,
				type: addType,
			})
			.then(() => {
				setItemId("");
				setName("");
				setQty("1");
				setPrice("");
			})
			.catch(() => {});
	};

	return (
		<div className="flex flex-col gap-2">
			<h3 className="flex items-center gap-1.5 text-base font-semibold">
				<IconPackageExport className="size-4 text-muted-foreground" />
				المستهلكات
			</h3>
			<p className="text-[11px] text-muted-foreground">
				عدة العملية تُنسخ من القالب عند الإنشاء وهي ضمن سعرها فلا تُعدّل. المحروقات تُضاف في أي وقت
				وتُصرف من المخزون دون فوترة، والبنود الإضافية وحدها تُضاف إلى الفاتورة.
			</p>

			{!invoicePaid && (
				<div className="flex flex-wrap items-center gap-1.5 rounded-md border p-2">
					<Select
						value={addType}
						onValueChange={(v) => setAddType(v as AddableConsumableType)}
					>
						<SelectTrigger
							size="sm"
							dir="rtl"
							className="w-36 text-xs"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{(Object.keys(ADDABLE_TYPE_LABELS) as AddableConsumableType[]).map((t) => (
								<SelectItem
									key={t}
									value={t}
								>
									{ADDABLE_TYPE_LABELS[t]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Combobox
						value={itemId}
						onValueChange={(value) => {
							setItemId(typeof value === "string" ? value : "");
							if (value) setName("");
						}}
					>
						<ComboboxTrigger
							className="flex h-8 w-44 items-center justify-between rounded-md border border-input bg-transparent px-2.5 text-xs"
							disabled={inventoryLoading || mutations.isPending}
						>
							<ComboboxValue
								placeholder="صنف من المخزون..."
								className="truncate"
							>
								{selectedItem?.name}
							</ComboboxValue>
						</ComboboxTrigger>
						<ComboboxContent dir="rtl">
							<ComboboxList>
								{activeItems.length === 0 ? (
									<ComboboxEmpty>لا أصناف في المخزون</ComboboxEmpty>
								) : (
									activeItems.map((item) => (
										<ComboboxItem
											key={item.id}
											value={item.id}
										>
											<span className="truncate">{item.name}</span>
										</ComboboxItem>
									))
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					<Input
						className="h-8 flex-1 text-xs"
						placeholder="أو بند حر (لا يُصرف من المخزون)"
						value={name}
						disabled={Boolean(itemId)}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						className="h-8 w-14 text-xs"
						type="number"
						min={1}
						value={qty}
						onChange={(e) => setQty(e.target.value)}
					/>
					{addType === "ADDITIONAL" && (
						<Input
							className="h-8 w-20 text-xs"
							type="number"
							min={0}
							placeholder={selectedItem ? `السعر (${Number(selectedItem.price)})` : "السعر"}
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					)}
					<Button
						size="sm"
						disabled={mutations.isPending || !canAdd}
						onClick={addConsumable}
					>
						<IconPlus className="size-3.5" />
						إضافة
					</Button>
				</div>
			)}

			<div className="rounded-[4px] border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">البند</TableHead>
							<TableHead className="text-center">النوع</TableHead>
							<TableHead className="text-center">الكمية</TableHead>
							<TableHead className="text-center">القيمة</TableHead>
							<TableHead className="text-center">الصرف</TableHead>
							<TableHead className="text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{c.consumables.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-xs text-muted-foreground"
								>
									لا مستهلكات — لم تُعرّف عدة لإجراءات هذه الحالة وقت إنشائها. عرّفها من إعدادات ‹
									كتالوج الإجراءات ‹ تعريف الإجراء لتُنسخ مع الحالات الجديدة، أو أضف البنود
									يدويًا أعلاه.
								</TableCell>
							</TableRow>
						)}
						{c.consumables.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="text-sm font-medium">{item.nameSnapshot}</TableCell>
								<TableCell className="text-center">
									{item.type === "KIT" ? (
										<Badge
											variant="outline"
											className="gap-1 text-[10px]"
										>
											<IconLock className="size-3" />
											عدة العملية — ضمن السعر
										</Badge>
									) : item.type === "BURNED" ? (
										<Badge
											variant="outline"
											className="gap-1 border-orange-200 bg-orange-50 text-[10px] text-orange-700"
										>
											<IconFlame className="size-3" />
											محروقات — ضمن السعر
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											إضافي — يُفوتر
										</Badge>
									)}
								</TableCell>
								<TableCell className="text-center text-sm tabular-nums text-muted-foreground">
									×{item.quantity}
								</TableCell>
								<TableCell className="text-center text-sm tabular-nums">
									{item.type === "ADDITIONAL" ? (
										`${formatMoney(Number(item.priceSnapshot) * item.quantity)} ر.س`
									) : (
										<span className="text-xs text-muted-foreground">ضمن السعر</span>
									)}
								</TableCell>
								<TableCell className="text-center">
									{item.issuedAt ? (
										<Badge
											variant="outline"
											className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
										>
											<IconCircleCheckFilled className="size-3" />
											صُرف
										</Badge>
									) : item.inventoryItemId ? (
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											يُصرف عند الخروج من العملية
										</Badge>
									) : (
										<span className="text-xs text-muted-foreground">—</span>
									)}
								</TableCell>
								<TableCell className="text-center">
									{/* عدة القالب لا تُحذف من الحالة — تعديلها من الكتالوج */}
									{item.type !== "KIT" && !item.issuedAt && !invoicePaid && (
										<Button
											size="icon"
											variant="ghost"
											className="size-6 text-red-600 hover:text-red-600"
											disabled={mutations.isPending}
											onClick={() => void mutations.removeConsumable(item.id).catch(() => {})}
										>
											<IconTrash className="size-3.5" />
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

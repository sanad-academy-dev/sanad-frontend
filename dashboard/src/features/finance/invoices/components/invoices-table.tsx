import { IconChevronDown, IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { InvoiceActionMenu } from "@/features/finance/invoices/components/invoice-action-menu";
import { VoidInvoiceDialog } from "@/features/finance/invoices/components/void-invoice-dialog";
import { useVoidInvoice } from "@/features/finance/invoices/hooks/use-void-invoice";
import { cn } from "@/lib/utils";
import {
	type InvoiceListItemResponse,
	type InvoiceStatus,
	invoiceSubject,
	type PaymentMethod,
} from "@sanad/contracts/runtime/server/invoices/invoices.type";

// أرقام لاتينية كما في التصميم (350 ر.س / 10/10/2027) لا أرقامًا هندية
const formatMoney = (value: string | number) => {
	const n = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

const money = (value: string | number) => `${formatMoney(value)} ر.س`;

const formatDate = (date: string | Date) => {
	const d = new Date(date);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
	CASH: "كاش",
	CARD: "بطاقة",
	TRANSFER: "تحويل",
};

const STATUS_META: Record<InvoiceStatus, { label: string; color: string }> = {
	PENDING: { label: "غير مدفوعة", color: "#DC2626" },
	PARTIAL: { label: "دفع جزئي", color: "#F59E0B" },
	PAID: { label: "مدفوعة", color: "#008A2E" },
	// [P12B.1] كان VOIDED معنونًا «مسترجعة» — وهي تسمية الردّ لا الإلغاء، وكانت محتملة
	// قبل وجود حالة ردّ حقيقية. الآن لا: الملغاة فاتورة غير مدفوعة أُبطلت، والمسترجعة
	// فاتورة مدفوعة رُدَّت ويُعكَس قيدها (contract KL-4). ملفّ تسميات التقارير كان صحيحًا.
	VOIDED: { label: "ملغاة", color: "#8B5CF6" },
	REFUNDED: { label: "مسترجعة", color: "#B45309" },
};

type ServiceItem = NonNullable<InvoiceListItemResponse["appointment"]>["services"][number];

// حشوات الأعمدة: 19px على كل جانب تُنتج الفاصل 38px بين الأعمدة كما في التصميم،
// وعمودا التحديد والرقم يلتزمان بفواصل التصميم الأضيق (11/12/4)
const SELECT_CELL = "pe-3 ps-2.75";
const CODE_CELL = "pe-4.75 ps-0";

/** بند معروض في الصف المتفرّع — رسوم الحجز أو دورة من دورات الزيارة */
type RowLine = {
	id: string;
	name: string;
	category: string | null;
	amount: number;
	isPaid: boolean;
	/** موجود فقط لبنود الدورات القابلة للسداد المفرد */
	service: ServiceItem | null;
};

// ── لبنات التصميم ───────────────────────────────────────────────────────────

/** وسم بنفسجي فاتح (الفئة / طريقة الدفع) */
const Tag = ({ children }: { children: ReactNode }) => (
	<span className="inline-flex items-center rounded-sm bg-[#6366F1]/13 px-1 py-1.25 text-[10px] leading-2.5 font-normal text-[#5B6ABF]">
		{children}
	</span>
);

/** قيمة أساسية + سطر ثانوي أصغر تحتها (الإجمالي/المتبقي، الخصم/النسبة) */
const Amount = ({
	value,
	note,
}: {
	value: string;
	note?: { text: string; muted?: boolean };
}) => (
	<div className="flex flex-col">
		<span className="text-[12px] leading-4 font-medium text-[#08090A]">{value}</span>
		{note && (
			<span
				className={cn(
					"text-[10px] leading-3.75 font-medium",
					note.muted ? "text-[#9B9B9D]" : "text-[#DC2626]",
				)}
			>
				{note.text}
			</span>
		)}
	</div>
);

const HeadLabel = ({ label, info }: { label: string; info?: boolean }) => (
	<span className="flex items-center gap-1.5 text-[12px] leading-4.5 font-semibold text-[#5C5C5E]">
		{label}
		{info && <IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-45" />}
	</span>
);

/** زر «دفع»/«استكمال» في عمود الإجراءات */
const RowActionButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="h-6 rounded-md border-[0.75px] border-[#0B4642]/12 bg-white px-[5.25px] text-[7px] leading-2.625 font-medium text-[#08090A] hover:bg-[#F5F5F6]"
	>
		{label}
	</button>
);

/** شارة الحالة — نقطة ملوّنة + التسمية + سهم، بشكل زر أبيض */
const StatusPill = ({ status }: { status: InvoiceStatus }) => {
	const { label, color } = STATUS_META[status];
	return (
		<span className="flex h-6 w-20.5 items-center justify-between rounded-md border-[0.75px] border-black/7 bg-white px-2">
			<span
				className="size-1.5 shrink-0 rounded-full"
				style={{ backgroundColor: color }}
			/>
			<span
				className="flex-1 text-center text-[11px] leading-4.125 font-medium"
				style={{ color }}
			>
				{label}
			</span>
			<IconChevronDown
				className="size-2.75 shrink-0"
				style={{ color }}
			/>
		</span>
	);
};

// ── الحالة القابلة للتغيير على صف الفاتورة ──────────────────────────────────

function InvoiceStatusSelect({
	invoice,
	onPay,
}: {
	invoice: InvoiceListItemResponse;
	onPay: () => void;
}) {
	const [voidOpen, setVoidOpen] = useState(false);
	const { voidInvoice, isPending } = useVoidInvoice();
	// [P12B.1] المسترجعة نهائية كالمدفوعة والملغاة. الاسترجاع نفسه يقع من قائمة
	// الإجراءات لا من هذا المُنتقي: هو يحتاج سببًا، والمُنتقي لا يسأل عنه.
	const isTerminal =
		invoice.status === "PAID" || invoice.status === "VOIDED" || invoice.status === "REFUNDED";
	const { label, color } = STATUS_META[invoice.status];

	const handleValueChange = (value: string) => {
		if (value === invoice.status) return;
		if (value === "VOIDED") {
			setVoidOpen(true);
		} else {
			onPay();
		}
	};

	return (
		<>
			<Select
				value={invoice.status}
				onValueChange={handleValueChange}
				disabled={isTerminal}
				// Radix لا يرث اتجاه الصفحة — بدونها يقلب المُشغّل إلى ltr
				dir="rtl"
			>
				{/* آخر svg داخل المُشغّل هو أيقونة Radix الافتراضية — نخفيها لصالح السهم الملوّن */}
				<SelectTrigger
					size="sm"
					aria-label={label}
					className="w-20.5 justify-between gap-0 rounded-md border-[0.75px] border-black/7 bg-white px-2 py-0 data-[size=sm]:h-6 disabled:opacity-100 [&>svg:last-child]:hidden"
				>
					<span
						className="size-1.5 shrink-0 rounded-full"
						style={{ backgroundColor: color }}
					/>
					<span
						className="flex-1 text-center text-[11px] leading-4.125 font-medium"
						style={{ color }}
					>
						{label}
					</span>
					<IconChevronDown
						className="size-2.75 shrink-0"
						style={{ color }}
					/>
				</SelectTrigger>
				<SelectContent position="popper">
					<SelectItem
						value="PENDING"
						disabled={invoice.status !== "PENDING"}
					>
						<span style={{ color: STATUS_META.PENDING.color }}>
							{STATUS_META.PENDING.label}
						</span>
					</SelectItem>
					<SelectItem
						value="PARTIAL"
						disabled={invoice.status !== "PARTIAL"}
					>
						<span style={{ color: STATUS_META.PARTIAL.color }}>
							{STATUS_META.PARTIAL.label}
						</span>
					</SelectItem>
					<SelectItem value="PAID">
						<span style={{ color: STATUS_META.PAID.color }}>{STATUS_META.PAID.label}</span>
					</SelectItem>
					<SelectItem
						value="VOIDED"
						disabled={isTerminal}
					>
						<span style={{ color: STATUS_META.VOIDED.color }}>{STATUS_META.VOIDED.label}</span>
					</SelectItem>
					{/* معروض ليقرأ المُشغّل حالته — بلا هذا السطر تظهر خانة الحالة فارغة
					    لفاتورة مسترجعة. معطَّل دائمًا: الاسترجاع من قائمة الإجراءات. */}
					<SelectItem
						value="REFUNDED"
						disabled
					>
						<span style={{ color: STATUS_META.REFUNDED.color }}>
							{STATUS_META.REFUNDED.label}
						</span>
					</SelectItem>
				</SelectContent>
			</Select>
			<VoidInvoiceDialog
				open={voidOpen}
				onClose={() => setVoidOpen(false)}
				onConfirm={async () => {
					await voidInvoice(invoice.id);
					setVoidOpen(false);
				}}
				isPending={isPending}
				invoiceCode={invoice.code}
			/>
		</>
	);
}

// ── الصفوف ──────────────────────────────────────────────────────────────────

/** بنود الفاتورة كما تُعرض في الصفوف المتفرّعة: رسوم الحجز ثم الدورات */
const rowLines = (invoice: InvoiceListItemResponse): RowLine[] => {
	const subject = invoiceSubject(invoice);
	const serviceById = new Map((invoice.appointment?.services ?? []).map((s) => [s.id, s]));
	const lines: RowLine[] = [];

	if (subject.consultationFee != null && Number(subject.consultationFee) > 0) {
		lines.push({
			id: `${invoice.id}-consultation`,
			name: subject.consultationName ?? "رسوم حجز",
			category: "فحص",
			amount: Number(subject.consultationFee),
			// رسوم الحجز تُحصَّل عند الحجز
			isPaid: true,
			service: null,
		});
	}

	for (const line of subject.lines) {
		lines.push({
			id: line.id,
			name: line.name,
			category: line.category,
			amount: Number(line.priceSnapshot) * line.quantity,
			// بنود التحاليل تُسدَّد مع الفاتورة كاملةً، فحالتها من حالة الفاتورة
			isPaid:
				subject.source !== "APPOINTMENT" ? invoice.status === "PAID" : line.paidAt !== null,
			service: serviceById.get(line.id) ?? null,
		});
	}

	return lines;
};

function InvoiceRow({
	invoice,
	expanded,
	selected,
	onSelect,
	onToggle,
	onPay,
	onServicePay,
	onViewInvoice,
}: {
	invoice: InvoiceListItemResponse;
	expanded: boolean;
	selected: boolean;
	onSelect: (checked: boolean) => void;
	onToggle: () => void;
	onPay: (invoice: InvoiceListItemResponse) => void;
	onServicePay: (invoice: InvoiceListItemResponse, service: ServiceItem) => void;
	onViewInvoice: (invoice: InvoiceListItemResponse) => void;
}) {
	// الفاتورة تتبع زيارةً أو طلب تحاليل — المصدر الموحّد يُخفي الفرق
	const subject = invoiceSubject(invoice);
	const lines = rowLines(invoice);
	const paidCount = lines.filter((line) => line.isPaid).length;

	const total = Number(invoice.total);
	const discount = Number(invoice.discount);
	const subtotal = Number(invoice.subtotal);
	const remaining = Math.max(0, total - Number(invoice.amountPaid));
	const discountRate = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

	// وسم الفئة على صف الفاتورة يجمع فئات بنودها ("فحص + تحليل")
	const categories = [...new Set(lines.map((l) => l.category).filter(Boolean))] as string[];

	const ChevronIcon = expanded ? IconChevronDown : IconChevronLeft;
	const payLabel =
		invoice.status === "PARTIAL" ? "استكمال" : invoice.status === "PENDING" ? "دفع" : null;

	return (
		<>
			<TableRow
				data-state={selected ? "selected" : undefined}
				className="cursor-pointer border-b hover:bg-[#F9F9F9]"
				onClick={onToggle}
			>
				<TableCell
					className={cn("py-2", SELECT_CELL)}
					onClick={(e) => e.stopPropagation()}
				>
					<Checkbox
						checked={selected}
						onCheckedChange={(checked) => onSelect(checked === true)}
						aria-label={`تحديد الفاتورة ${invoice.code}`}
						className="size-4.5 rounded-md border-[1.5px] border-[#E5E5E5] bg-white"
					/>
				</TableCell>

				<TableCell className={cn(CODE_CELL, "py-2")}>
					{/* السهم بين رقم الحجز ومربّع التحديد كما في التصميم */}
					<div className="flex items-center gap-1">
						<ChevronIcon className="size-3.25 shrink-0 text-[#737373]" />
						<span className="text-[12px] leading-2.5 font-medium text-[#08090A]">
							{subject.sourceCode ?? invoice.code}
						</span>
					</div>
				</TableCell>

				<TableCell className="px-4.75 py-2">
					<div className="flex flex-col gap-1.25">
						<span className="text-[12px] leading-2.5 font-medium text-[#08090A]">
							{subject.ownerName}
						</span>
						<span className="text-[12px] leading-2.625 font-bold text-[#08090A]">
							{subject.patientName}
						</span>
					</div>
				</TableCell>

				<TableCell className="px-4.75 py-2 text-[12px] leading-3.875 font-medium text-[#08090A]">
					{paidCount}/{lines.length}
				</TableCell>

				<TableCell className="px-4.75 py-2">
					{categories.length > 0 ? <Tag>{categories.join(" + ")}</Tag> : "—"}
				</TableCell>

				<TableCell className="px-4.75 py-2">
					<Amount
						value={money(total)}
						note={remaining > 0 ? { text: `متبقي: ${money(remaining)}` } : undefined}
					/>
				</TableCell>

				<TableCell className="px-4.75 py-2">
					<Amount
						value={money(discount)}
						note={discount > 0 ? { text: `نسبه: ${discountRate}%`, muted: true } : undefined}
					/>
				</TableCell>

				<TableCell className="px-4.75 py-2 text-[12px] leading-3.875 font-medium text-[#08090A]">
					{formatDate(subject.date ?? invoice.createdAt)}
				</TableCell>

				<TableCell className="px-4.75 py-2">
					{invoice.paymentMethod ? (
						<Tag>{PAYMENT_METHOD_LABEL[invoice.paymentMethod]}</Tag>
					) : (
						"—"
					)}
				</TableCell>

				<TableCell
					className="px-4.75 py-2"
					onClick={(e) => e.stopPropagation()}
				>
					<InvoiceStatusSelect
						invoice={invoice}
						onPay={() => onPay(invoice)}
					/>
				</TableCell>

				<TableCell
					className="px-4.75 py-2"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center gap-1.5">
						{payLabel && (
							<RowActionButton
								label={payLabel}
								onClick={() => onPay(invoice)}
							/>
						)}
						<InvoiceActionMenu
							invoice={invoice}
							onView={() => onViewInvoice(invoice)}
							onEdit={() => onViewInvoice(invoice)}
							onPay={() => onPay(invoice)}
							triggerClassName="size-auto h-5 w-7 rounded-md bg-[#EBEBEB] p-1.25 text-[#5C5C5E] hover:bg-[#E0E0E0]"
						/>
					</div>
				</TableCell>
			</TableRow>

			{expanded &&
				lines.map((line) => (
					<TableRow
						key={line.id}
						className="border-b bg-[#F2F2F2] hover:bg-[#F2F2F2]"
					>
						{/* عمود التحديد فارغ في البنود — يمنح الصف إزاحته الداخلية */}
						<TableCell className="h-13.5 py-0" />

						{/* الحشوة تُحاذي رقم الفاتورة مع رقم الحجز في الصف الأب (مكان السهم) */}
						<TableCell className="h-13.5 py-0 pe-4.75 ps-4.25 text-[12px] leading-2.5 font-medium text-[#08090A]">
							{invoice.code}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0" />

						<TableCell className="h-13.5 px-4.75 py-0 text-[12px] leading-3.875 font-medium text-[#08090A]">
							لـ {line.name}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0">
							{line.category ? <Tag>{line.category}</Tag> : "—"}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0 text-[12px] leading-3.875 font-medium text-[#08090A]">
							{money(line.amount)}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0 text-[12px] leading-3.875 font-medium text-[#08090A]">
							{/* الخصم مسجّل على الفاتورة كاملةً — يُوزَّع على البنود بحصّتها */}
							{money(subtotal > 0 ? (discount * line.amount) / subtotal : 0)}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0 text-[12px] leading-3.875 font-medium text-[#08090A]">
							{formatDate(subject.date ?? invoice.createdAt)}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0">
							{invoice.paymentMethod ? (
								<Tag>{PAYMENT_METHOD_LABEL[invoice.paymentMethod]}</Tag>
							) : (
								"—"
							)}
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0">
							<StatusPill status={line.isPaid ? "PAID" : "PENDING"} />
						</TableCell>

						<TableCell className="h-13.5 px-4.75 py-0">
							<InvoiceActionMenu
								invoice={invoice}
								onView={() => onViewInvoice(invoice)}
								onPay={() =>
									line.service ? onServicePay(invoice, line.service) : onPay(invoice)
								}
								triggerClassName="size-auto h-5 w-7 rounded-md bg-[#EBEBEB] p-1.25 text-[#5C5C5E] hover:bg-[#E0E0E0]"
							/>
						</TableCell>
					</TableRow>
				))}
		</>
	);
}

// ── الجدول ──────────────────────────────────────────────────────────────────

// النسب مشتقّة من عروض الأعمدة في التصميم (1648px) حتى تبقى النسبة نفسها
// على أي عرض شاشة بدل أن يفيض الجدول أفقيًا
const COLUMNS = [
	// عمود التحديد بعرض ثابت — 18px للمربّع وحشوتاه، فلا ينضغط على الشاشات الأضيق
	{ key: "select", label: "", width: "41px" },
	{ key: "code", label: "رقم المعرف/ الحجز", width: "9.36%" },
	{ key: "subject", label: "العميل/الطفل", width: "11.91%" },
	{ key: "service", label: "الدورة", width: "11.91%" },
	{ key: "category", label: "الفئة", width: "8.95%", info: true },
	{ key: "total", label: "الإجمالي", width: "9.66%" },
	{ key: "discount", label: "الخصم", width: "8%" },
	{ key: "date", label: "التاريخ الحجز", width: "10.19%", info: true },
	{ key: "method", label: "طريقة الدفع", width: "9.06%", info: true },
	{ key: "status", label: "حالة", width: "11.08%", info: true },
	{ key: "actions", label: "الإجراءات", width: "7.45%" },
] as const;

interface InvoicesTableProps {
	invoices: InvoiceListItemResponse[];
	isLoading: boolean;
	onPay: (invoice: InvoiceListItemResponse) => void;
	onServicePay: (invoice: InvoiceListItemResponse, service: ServiceItem) => void;
	onViewInvoice: (invoice: InvoiceListItemResponse) => void;
}

export function InvoicesTable({
	invoices,
	isLoading,
	onPay,
	onServicePay,
	onViewInvoice,
}: InvoicesTableProps) {
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

	const allSelected = invoices.length > 0 && selectedIds.length === invoices.length;

	const toggleAll = (checked: boolean) =>
		setSelectedIds(checked ? invoices.map((invoice) => invoice.id) : []);

	const toggleOne = (id: string, checked: boolean) =>
		setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((it) => it !== id)));

	return (
		<div className="min-h-0 flex-1 overflow-auto">
			<Table className="table-fixed">
				<TableHeader>
					<TableRow className="border-b hover:bg-transparent">
						{COLUMNS.map((column) => (
							<TableHead
								key={column.key}
								style={{ width: column.width }}
								className={cn(
									"h-6.5 px-4.75 py-0",
									column.key === "select" && SELECT_CELL,
									column.key === "code" && CODE_CELL,
								)}
							>
								{column.key === "select" ? (
									<Checkbox
										checked={allSelected}
										onCheckedChange={(checked) => toggleAll(checked === true)}
										aria-label="تحديد كل الفواتير"
										className="size-4.5 rounded-md border-[1.5px] border-[#E5E5E5] bg-white"
									/>
								) : (
									<HeadLabel
										label={column.label}
										info={"info" in column ? column.info : false}
									/>
								)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoading &&
						Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i}>
								{COLUMNS.map((column) => (
									<TableCell
										key={column.key}
										className="py-3"
									>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}

					{!isLoading && invoices.length === 0 && (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={COLUMNS.length}
								className="py-16 text-center text-[12px] text-[#5C5C5E]"
							>
								لا توجد فواتير بعد.
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						invoices.map((invoice) => (
							<InvoiceRow
								key={invoice.id}
								invoice={invoice}
								expanded={expandedId === invoice.id}
								selected={selectedIds.includes(invoice.id)}
								onSelect={(checked) => toggleOne(invoice.id, checked)}
								onToggle={() => toggle(invoice.id)}
								onPay={onPay}
								onServicePay={onServicePay}
								onViewInvoice={onViewInvoice}
							/>
						))}
				</TableBody>
			</Table>
		</div>
	);
}

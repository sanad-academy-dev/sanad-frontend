import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import {
	type PaymentLine,
	PaymentModal,
	type PaymentSubject,
} from "@/features/appointments/components/invoice/payment-modal";
import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { CarePlansTab } from "@/features/finance/care-plans/components/care-plans-tab";
import { EnrollmentsTab } from "@/features/finance/care-plans/components/enrollments-tab";
import { FinanceAreaLayout } from "@/features/finance/components/finance-area-layout";
import { DiscountsTab } from "@/features/finance/discounts/components/discounts-tab";
import { ExpensesTab } from "@/features/finance/expenses/components/expenses-tab";
import { InvoicesTable } from "@/features/finance/invoices/components/invoices-table";
import { InvoicesToolbar } from "@/features/finance/invoices/components/invoices-toolbar";
import { useFinanceStats } from "@/features/finance/invoices/hooks/use-finance-stats";
import { useInvoices } from "@/features/finance/invoices/hooks/use-invoices";
import { usePayInvoice } from "@/features/finance/invoices/hooks/use-pay-invoice";
import {
	type FinanceTab,
	isFinanceTab,
} from "@/features/finance/invoices/types/finance-tabs.types";
import type {
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import {
	type InvoiceListItemResponse,
	type InvoiceResponse,
	invoiceSubject,
} from "@sanad/contracts/runtime/server/invoices/invoices.type";

/**
 * `?tab=` makes the four billing destinations addressable, so the unified finance sidebar
 * can link straight to each one without splitting this screen into child routes (that split
 * is on the contract's cleanup list). An unknown or absent tab falls back to الفواتير.
 */
export const Route = createFileRoute("/_pathless-layout/management/finance")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): { tab: FinanceTab } => ({
		tab: isFinanceTab(search.tab) ? search.tab : "invoices",
	}),
});

type ServiceItem = NonNullable<InvoiceListItemResponse["appointment"]>["services"][number];

const money = (value: unknown) =>
	Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

// نافذة الدفع تقرأ مصدرًا محايدًا، فتخدم فواتير الزيارات والتحاليل بلا تفرّع
const paymentSubjectOf = (
	invoice: InvoiceListItemResponse,
	onlyService?: ServiceItem,
): PaymentSubject => {
	const subject = invoiceSubject(invoice);
	const lines: PaymentLine[] = onlyService
		? [
				{
					id: onlyService.id,
					name: onlyService.service.name,
					badge: "دورة",
					amountLabel: `${money(Number(onlyService.priceSnapshot) * onlyService.quantity)} ر.س`,
				},
			]
		: [
				...(subject.consultationFee != null && Number(subject.consultationFee) > 0
					? [
							{
								id: "consultation",
								name: subject.consultationName ?? "كشف",
								badge: "كشف",
								amountLabel: `${money(subject.consultationFee)} ر.س`,
							},
						]
					: []),
				...subject.lines.map((line) => ({
					id: line.id,
					name: line.name,
					badge: subject.source === "LAB" ? "تحليل" : "دورة",
					amountLabel: `${money(Number(line.priceSnapshot) * line.quantity)} ر.س`,
				})),
			];

	return {
		heading: subject.source === "LAB" ? "طلب دفع فاتورة تحاليل" : "طلب دفع فاتورة زيارة",
		ownerName: subject.ownerName,
		date: subject.date ?? invoice.createdAt,
		lines,
	};
};

// حوارات الدفع مبنية على شكل الزيارة؛ فواتير التحاليل تُعرض من خلال نفس
// الشكل عبر مصدر الفاتورة الموحّد بدل تكرار الحوارات لكل مصدر.
const asAppointmentShape = (invoice: InvoiceListItemResponse) => {
	const subject = invoiceSubject(invoice);
	return {
		appointment: {
			startsAt: subject.date ?? invoice.createdAt,
			consultationFeeSnapshot: subject.consultationFee,
			consultationType: subject.consultationName ? { name: subject.consultationName } : null,
			owner: { name: subject.ownerName },
			patient: { name: subject.patientName },
		} as unknown as AppointmentResponse,
		services: subject.lines.map((line) => ({
			id: line.id,
			quantity: line.quantity,
			priceSnapshot: line.priceSnapshot,
			paidAt: line.paidAt,
			service: { name: line.name },
		})) as unknown as AppointmentServiceResponse[],
		ownerName: subject.ownerName,
		patientName: subject.patientName,
	};
};

type ServicePayTarget = {
	invoice: InvoiceListItemResponse;
	service: ServiceItem;
};

function RouteComponent() {
	// the tab lives in the URL so the workspace header can deep-link it and a refresh keeps
	// the place; [NAV-2] moved the tab strip itself into the header (finance-workspace-header)
	const { tab } = Route.useSearch();
	const [search, setSearch] = useState("");
	const [payTarget, setPayTarget] = useState<InvoiceListItemResponse | null>(null);
	const [servicePayTarget, setServicePayTarget] = useState<ServicePayTarget | null>(null);
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);
	const [viewInvoice, setViewInvoice] = useState<InvoiceListItemResponse | null>(null);

	const { invoices, isLoading } = useInvoices();
	const { stats } = useFinanceStats();
	const { pay, isPaying } = usePayInvoice();

	const filtered = useMemo(() => {
		if (!search.trim()) return invoices;
		const q = search.toLowerCase();
		return invoices.filter((inv) => {
			const subject = invoiceSubject(inv);
			return (
				inv.code.toLowerCase().includes(q) ||
				subject.ownerName.toLowerCase().includes(q) ||
				subject.patientName.toLowerCase().includes(q)
			);
		});
	}, [invoices, search]);

	const financeStats: StatItem[] = [
		{
			title: "إجمالي الفواتير",
			value: stats?.total ?? 0,
			tooltip: "إجمالي عدد الفواتير المسجّلة",
		},
		{
			title: "إجمالي الإيرادات",
			value: stats?.revenue ?? 0,
			valueLabel: `ر.س ${(stats?.revenue ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })}`,
			// التفصيل يجعل الرقم قابلًا للتفسير بدل أن يكون مجموعًا مبهمًا
			tooltip: `مجموع المحصّل — فواتير الجلسات: ${(stats?.invoiceRevenue ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} + مبيعات نقاط البيع: ${(stats?.salesRevenue ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })}`,
		},
		{
			title: "فواتير معلّقة",
			value: stats?.pending ?? 0,
			tooltip: "الفواتير التي لم يتم تسديدها بعد",
		},
		{
			title: "فواتير مدفوعة",
			value: stats?.paid ?? 0,
			tooltip: "الفواتير المسدّدة بالكامل",
		},
		{
			title: "فواتير متأخرة",
			value: stats?.overdue ?? 0,
			tooltip: "الفواتير المعلّقة أو الجزئية منذ أكثر من 7 أيام",
		},
	];

	// Full invoice pay
	const handlePay = async (
		amountPaid: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
	) => {
		if (!payTarget) return;
		try {
			const paid = await pay(payTarget.id, amountPaid, insurance);
			if (paid.status === "PAID") {
				setSuccessInvoice(paid);
			} else {
				setPayTarget(null);
			}
		} catch {
			// toast handled by hook
		}
	};

	const handleSuccessClose = () => {
		setSuccessInvoice(null);
		setPayTarget(null);
	};

	// Single-service pay
	const handleServicePay = async (amountPaid: number) => {
		if (!servicePayTarget) return;
		try {
			const paid = await pay(servicePayTarget.invoice.id, amountPaid);
			if (paid.status === "PAID") {
				setSuccessInvoice(paid);
				setServicePayTarget(null);
			} else {
				setServicePayTarget(null);
			}
		} catch {
			// toast handled by hook
		}
	};

	const handleServiceSuccessClose = () => {
		setSuccessInvoice(null);
	};

	return (
		<FinanceAreaLayout>
			<div className="flex flex-1 flex-col overflow-hidden">
				{tab === "invoices" && (
					<>
						{/* [P5-UI-fix] «الفواتير» and «فواتير المبيعات» now sit one tab apart; each
						    screen states its own scope so the two are never mistaken for one list.
						    Contract C3: this is the OPERATIONAL doc — it does not post to the ledger. */}
						<div className="px-[9px] pt-3">
							<h1 className="font-medium text-lg">الفواتير</h1>
							<p className="text-muted-foreground text-sm">
								فواتير الحجوزات والدورات — التشغيل اليومي للأكاديمية.
							</p>
						</div>
						<Stats
							className="px-[9px]"
							stats={financeStats}
							variant="inventory"
						/>
						<hr className="my-2" />
						<InvoicesToolbar
							search={search}
							onSearchChange={setSearch}
						/>
						<hr className="my-2" />
						<InvoicesTable
							invoices={filtered}
							isLoading={isLoading}
							onPay={setPayTarget}
							onServicePay={(invoice, service) => setServicePayTarget({ invoice, service })}
							onViewInvoice={setViewInvoice}
						/>
					</>
				)}

				{tab === "discounts" && <DiscountsTab />}

				{tab === "care-plans" && <CarePlansTab />}

				{tab === "enrollments" && <EnrollmentsTab />}

				{tab === "expenses" && <ExpensesTab />}

				{/* Full invoice pay modal */}
				{payTarget && !successInvoice && (
					<PaymentModal
						open={!!payTarget}
						onClose={() => setPayTarget(null)}
						invoice={payTarget as unknown as InvoiceResponse}
						subject={paymentSubjectOf(payTarget)}
						onPay={handlePay}
						isPaying={isPaying}
					/>
				)}

				{successInvoice && payTarget && (
					<PaymentSuccessModal
						open={!!successInvoice}
						onClose={handleSuccessClose}
						invoice={successInvoice}
						services={asAppointmentShape(payTarget).services}
						ownerName={asAppointmentShape(payTarget).ownerName}
						patientName={asAppointmentShape(payTarget).patientName}
					/>
				)}

				{/* Single-service pay modal */}
				{servicePayTarget && !successInvoice && (
					<PaymentModal
						open={!!servicePayTarget}
						onClose={() => setServicePayTarget(null)}
						invoice={servicePayTarget.invoice as unknown as InvoiceResponse}
						subject={paymentSubjectOf(servicePayTarget.invoice, servicePayTarget.service)}
						onPay={handleServicePay}
						isPaying={isPaying}
						defaultAmount={
							Number(servicePayTarget.service.priceSnapshot) *
							servicePayTarget.service.quantity
						}
					/>
				)}

				{successInvoice && servicePayTarget === null && payTarget === null && (
					<PaymentSuccessModal
						open={!!successInvoice}
						onClose={handleServiceSuccessClose}
						invoice={successInvoice}
						services={[] as unknown as AppointmentServiceResponse[]}
						ownerName=""
						patientName=""
					/>
				)}

				{viewInvoice && !successInvoice && (
					<PaymentSuccessModal
						open={!!viewInvoice}
						onClose={() => setViewInvoice(null)}
						invoice={viewInvoice as unknown as InvoiceResponse}
						services={asAppointmentShape(viewInvoice).services}
						ownerName={asAppointmentShape(viewInvoice).ownerName}
						patientName={asAppointmentShape(viewInvoice).patientName}
					/>
				)}
			</div>
		</FinanceAreaLayout>
	);
}

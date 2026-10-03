import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { GeneralLedgerReport } from "@/server/accounting/reports/general-ledger.service";
import type {
	GrossProfitReport,
	InvoiceTrendsReport,
	LedgerDebugReport,
	PartyLedgerSummaryReport,
} from "@/server/accounting/reports/p9-4-reports.service";
import type {
	PaymentPeriodRow,
	SalesPaymentSummaryRow,
} from "@/server/accounting/reports/payment-reports.service";
import type {
	ItemWisePurchaseRegisterReport,
	PurchaseRegisterReport,
} from "@/server/accounting/reports/purchase-register.service";
import type {
	ArApReport,
	ArApSummaryRow,
} from "@/server/accounting/reports/receivable-payable.service";
import type {
	ItemWiseSalesRegisterReport,
	SalesRegisterReport,
} from "@/server/accounting/reports/sales-register.service";
import type {
	BalanceSheetReport,
	CashFlowReport,
	ProfitAndLossReport,
} from "@/server/accounting/reports/statement-engine/financial-statements.service";
import type { TrialBalanceReport } from "@/server/accounting/reports/trial-balance.service";

/** [P2.6/P2.7 UI] Report hooks — read-only over gl_entry (§18.2). */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export type GeneralLedgerParams = {
	fromDate: string;
	toDate: string;
	accountId?: string;
	showCancelled?: boolean;
};

export const useGeneralLedger = (params: GeneralLedgerParams) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<GeneralLedgerReport>({
		queryKey: ["accounting", "reports", "general-ledger", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["general-ledger"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.accountId ? { accountId: params.accountId } : {}),
					...(params.showCancelled ? { showCancelled: true } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل دفتر الأستاذ"));
			return data as GeneralLedgerReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useTrialBalance = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<TrialBalanceReport>({
		queryKey: ["accounting", "reports", "trial-balance", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["trial-balance"].get({
				query: { fromDate: params.fromDate, toDate: params.toDate },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل ميزان المراجعة"));
			return data as TrialBalanceReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

/* ── [P3.6] party reports ─────────────────────────────────────────────────────────────── */

import type { PartyTrialBalanceReport } from "@/server/accounting/reports/party-trial-balance.service";
import type { PaymentLedgerReportRow } from "@/server/accounting/reports/payment-ledger-report.service";

export const usePartyTrialBalance = (params: {
	fromDate: string;
	toDate: string;
	side: "RECEIVABLE" | "PAYABLE";
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<PartyTrialBalanceReport>({
		queryKey: ["accounting", "reports", "party-trial-balance", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["party-trial-balance"].get({
				query: { fromDate: params.fromDate, toDate: params.toDate, side: params.side },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل ميزان مراجعة الأطراف"));
			return data as PartyTrialBalanceReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const usePaymentLedgerReport = (params: {
	fromDate: string;
	toDate: string;
	accountType?: "RECEIVABLE" | "PAYABLE";
	includeDelinked?: boolean;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<PaymentLedgerReportRow[]>({
		queryKey: ["accounting", "reports", "payment-ledger", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["payment-ledger"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.accountType ? { accountType: params.accountType } : {}),
					...(params.includeDelinked ? { includeDelinked: true } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجل الذمم"));
			return data as PaymentLedgerReportRow[];
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { rows: data ?? [], isLoading };
};

/** [P5.8] §18.4 registers */
export const useSalesRegister = (params: {
	fromDate: string;
	toDate: string;
	partyId?: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<SalesRegisterReport>({
		queryKey: ["accounting", "reports", "sales-register", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["sales-register"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.partyId ? { partyId: params.partyId } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجل المبيعات"));
			return data as SalesRegisterReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useItemWiseSalesRegister = (params: {
	fromDate: string;
	toDate: string;
	partyId?: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<ItemWiseSalesRegisterReport>({
		queryKey: ["accounting", "reports", "item-wise-sales-register", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["item-wise-sales-register"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.partyId ? { partyId: params.partyId } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل السجل التفصيلي"));
			return data as ItemWiseSalesRegisterReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

/** [P6.5] §18.4 purchase registers — the AP mirror */
export const usePurchaseRegister = (params: {
	fromDate: string;
	toDate: string;
	partyId?: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<PurchaseRegisterReport>({
		queryKey: ["accounting", "reports", "purchase-register", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["purchase-register"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.partyId ? { partyId: params.partyId } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجل المشتريات"));
			return data as PurchaseRegisterReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useItemWisePurchaseRegister = (params: {
	fromDate: string;
	toDate: string;
	partyId?: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<ItemWisePurchaseRegisterReport>({
		queryKey: ["accounting", "reports", "item-wise-purchase-register", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["item-wise-purchase-register"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.partyId ? { partyId: params.partyId } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل السجل التفصيلي"));
			return data as ItemWisePurchaseRegisterReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

/** [P7.9] payment reports */
export const usePaymentPeriodReport = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<PaymentPeriodRow[]>({
		queryKey: ["accounting", "reports", "payment-period", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["payment-period"].get({
				query: { fromDate: params.fromDate, toDate: params.toDate },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل تقرير فترات السداد"));
			return data as PaymentPeriodRow[];
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { rows: data ?? [], isLoading };
};

export const useSalesPaymentSummary = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<SalesPaymentSummaryRow[]>({
		queryKey: ["accounting", "reports", "sales-payment-summary", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["sales-payment-summary"].get({
				query: { fromDate: params.fromDate, toDate: params.toDate },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل ملخص المقبوضات"));
			return data as SalesPaymentSummaryRow[];
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { rows: data ?? [], isLoading };
};

/* ── [P9.5] §18.1/§18.3 statement hooks ──────────────────────────────────────────────── */

export const useBalanceSheet = (params: {
	fromDate: string;
	toDate: string;
	periodicity: string;
}) => {
	const { data, isLoading } = useQuery<BalanceSheetReport>({
		queryKey: ["accounting", "reports", "balance-sheet", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["balance-sheet"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل الميزانية العمومية");
			return data as BalanceSheetReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useProfitAndLoss = (params: {
	fromDate: string;
	toDate: string;
	periodicity: string;
	accumulatedValues?: boolean;
}) => {
	const { data, isLoading } = useQuery<ProfitAndLossReport>({
		queryKey: ["accounting", "reports", "profit-and-loss", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["profit-and-loss"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل قائمة الدخل");
			return data as ProfitAndLossReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useCashFlow = (params: {
	fromDate: string;
	toDate: string;
	periodicity: string;
}) => {
	const { data, isLoading } = useQuery<CashFlowReport>({
		queryKey: ["accounting", "reports", "cash-flow", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["cash-flow"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل قائمة التدفقات النقدية");
			return data as CashFlowReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

/* ── [P9.4] §18 register-family reports ──────────────────────────────────────────────── */

export const usePartyLedgerSummary = (params: {
	side: "RECEIVABLE" | "PAYABLE";
	fromDate: string;
	toDate: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<PartyLedgerSummaryReport>({
		queryKey: ["accounting", "reports", "party-ledger-summary", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["party-ledger-summary"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل ملخص أرصدة الأطراف");
			return data as PartyLedgerSummaryReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useGrossProfit = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<GrossProfitReport>({
		queryKey: ["accounting", "reports", "gross-profit", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["gross-profit"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل تقرير الربح الإجمالي");
			return data as GrossProfitReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useInvoiceTrends = (params: { side: "sales" | "purchase"; year: string }) => {
	const enabled = /^\d{4}$/.test(params.year);
	const { data, isLoading } = useQuery<InvoiceTrendsReport>({
		queryKey: ["accounting", "reports", "invoice-trends", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["invoice-trends"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل اتجاهات الفواتير");
			return data as InvoiceTrendsReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useLedgerDebug = () => {
	const { data, isLoading } = useQuery<LedgerDebugReport>({
		queryKey: ["accounting", "reports", "ledger-debug"],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["ledger-debug"].get();
			if (error) throw new Error("تعذّر تحميل فحص الدفاتر");
			return data as LedgerDebugReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useReceivablePayable = (params: {
	side: "RECEIVABLE" | "PAYABLE";
	asOf: string;
	basedOn: string;
	ranges?: string;
	summary?: boolean;
	/** [MI-P5] FR-R12.2 — narrow the ageing to one party type (e.g. Insurer) */
	partyType?: string;
	partyId?: string;
}) => {
	const { data, isLoading } = useQuery<ArApReport & { summary: ArApSummaryRow[] }>({
		queryKey: ["accounting", "reports", "receivable-payable", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["receivable-payable"].get({
				query: params,
			});
			if (error) throw new Error("تعذّر تحميل تقرير الذمم");
			return data as ArApReport & { summary: ArApSummaryRow[] };
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

/* ── [MI-P6] MI §12 reports ───────────────────────────────────────────────────────────── */

import type {
	BenefitUsageReport,
	ClaimsRegisterReport,
	MembershipRevenueReport,
} from "@/server/accounting/reports/membership-insurance-reports.service";

export const useClaimsRegister = (params: {
	fromDate: string;
	toDate: string;
	insurerId?: string;
	status?: string;
}) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<ClaimsRegisterReport>({
		queryKey: ["accounting", "reports", "insurance-claims-register", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["insurance-claims-register"].get({
				query: {
					fromDate: params.fromDate,
					toDate: params.toDate,
					...(params.insurerId ? { insurerId: params.insurerId } : {}),
					...(params.status ? { status: params.status } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجل المطالبات"));
			return data as ClaimsRegisterReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useMembershipRevenue = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<MembershipRevenueReport>({
		queryKey: ["accounting", "reports", "membership-revenue", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["membership-revenue"].get({
				query: params,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل إيراد العضويات"));
			return data as MembershipRevenueReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

export const useBenefitUsage = (params: { fromDate: string; toDate: string }) => {
	const enabled = !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<BenefitUsageReport>({
		queryKey: ["accounting", "reports", "benefit-usage", params],
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["benefit-usage"].get({
				query: params,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل استخدام المزايا"));
			return data as BenefitUsageReport;
		},
		enabled,
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading };
};

import { describe, expect, it } from "vitest";

import { buildInvoiceDocument } from "@/features/finance/invoices/utils/invoice-document";
import type { InvoiceListItemResponse } from "@/server/invoices/invoices.type";

const invoice = (overrides: Partial<Record<string, unknown>> = {}) =>
	({
		id: "i1",
		code: "INV-1234",
		status: "PARTIAL",
		subtotal: 200,
		vatRate: 15,
		vatAmount: 30,
		discount: 10,
		total: 220,
		amountPaid: 100,
		paymentMethod: "CASH",
		paidAt: null,
		createdAt: new Date("2026-07-28"),
		appointment: {
			id: "a1",
			code: "AP-9",
			startsAt: new Date("2026-07-28"),
			consultationFeeSnapshot: 50,
			consultationType: { id: "c", name: "كشف عام" },
			owner: { id: "o", name: "أحمد" },
			patient: { id: "p", name: "سميرة" },
			services: [
				{
					id: "s1",
					quantity: 2,
					priceSnapshot: 75,
					paidAt: null,
					service: { name: "تحليل كيمياء الدم", parent: { parent: { name: "التحاليل" } } },
				},
			],
		},
		labOrder: null,
		...overrides,
	}) as unknown as InvoiceListItemResponse;

describe("invoice document", () => {
	it("carries the invoice identity and parties", () => {
		const html = buildInvoiceDocument(invoice());
		expect(html).toContain("INV-1234");
		expect(html).toContain("سميرة");
		expect(html).toContain("أحمد");
	});

	it("renders each line with its computed total", () => {
		const html = buildInvoiceDocument(invoice());
		expect(html).toContain("تحليل كيمياء الدم");
		// 75 × 2 — الإجمالي محسوب لا منسوخ
		expect(html).toContain("150");
	});

	it("includes the consultation fee as its own line", () => {
		expect(buildInvoiceDocument(invoice())).toContain("كشف عام");
	});

	it("shows the discount row only when there is a discount", () => {
		expect(buildInvoiceDocument(invoice())).toContain("الخصم");
		expect(buildInvoiceDocument(invoice({ discount: 0 }))).not.toContain("الخصم");
	});

	it("computes the remaining balance from total and paid", () => {
		// 220 − 100
		expect(buildInvoiceDocument(invoice())).toContain("120");
	});

	it("never reports a negative balance on overpayment", () => {
		const html = buildInvoiceDocument(invoice({ amountPaid: 500 }));
		expect(html).not.toContain("-380");
	});

	it("translates the status to Arabic", () => {
		expect(buildInvoiceDocument(invoice())).toContain("دفع جزئي");
		expect(buildInvoiceDocument(invoice({ status: "PAID" }))).toContain("مدفوعة");
	});

	it("escapes names so a crafted patient name cannot inject markup", () => {
		const html = buildInvoiceDocument(
			invoice({
				appointment: {
					...(invoice().appointment as object),
					patient: { id: "p", name: "<script>alert(1)</script>" },
				},
			}),
		);
		expect(html).toContain("&lt;script&gt;");
		expect(html).not.toContain("<script>alert(1)</script>");
	});

	it("is a standalone RTL document", () => {
		const html = buildInvoiceDocument(invoice());
		expect(html).toContain("<!doctype html>");
		expect(html).toContain('dir="rtl"');
	});

	it("falls back to the lab order when there is no visit", () => {
		const html = buildInvoiceDocument(
			invoice({
				appointment: null,
				labOrder: {
					id: "l1",
					code: "LT-77",
					createdAt: new Date("2026-07-28"),
					owner: { id: "o", name: "خالد" },
					patient: { id: "p", name: "لونا" },
					items: [
						{
							id: "it1",
							priceSnapshot: 66,
							service: { name: "CBC", parent: { parent: { name: "التحاليل" } } },
						},
					],
				},
			}),
		);
		expect(html).toContain("LT-77");
		expect(html).toContain("CBC");
		expect(html).toContain("لونا");
	});
});

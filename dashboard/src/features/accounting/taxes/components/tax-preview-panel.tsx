import { IconCalculator, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
import { CHARGE_TYPE_LABEL } from "@/features/accounting/taxes/components/tax-template-sheet";
import {
	usePurchaseTaxTemplates,
	useSalesTaxTemplates,
	useTaxPreview,
} from "@/features/accounting/taxes/hooks/use-taxes";
import type { CalcTaxRow } from "@/server/accounting/tax/tax-calculator";

/**
 * [P4.4] The QA preview sandbox: enter items, pick a template (or none), optional doc
 * discount → the server runs the PURE §8 calculator and the full breakdown renders —
 * items with nets, every tax row with its amount and running total, and the seven totals.
 */

type PreviewItem = { qty: string; rate: string };

const NONE = "__none__";

export const TaxPreviewPanel = () => {
	const { rows: salesTemplates } = useSalesTaxTemplates();
	const { rows: purchaseTemplates } = usePurchaseTaxTemplates();
	const { preview, result, isCalculating } = useTaxPreview();

	const [items, setItems] = useState<PreviewItem[]>([{ qty: "1", rate: "100" }]);
	const [templateId, setTemplateId] = useState<string>(NONE);
	const [discountOn, setDiscountOn] = useState<string>(NONE);
	const [discountAmount, setDiscountAmount] = useState("");

	const setItem = (index: number, patch: Partial<PreviewItem>) =>
		setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

	const run = () => {
		const template =
			salesTemplates.find((t) => t.id === templateId) ??
			purchaseTemplates.find((t) => t.id === templateId);
		const taxes: CalcTaxRow[] = (template?.taxes ?? []).map((row) => ({
			key: `${row.idx}`,
			chargeType: row.chargeType,
			accountHead: row.accountHeadId,
			rate: row.rate.toString(),
			taxAmount: row.taxAmount.toString(),
			rowId: row.rowId,
			includedInPrintRate: row.includedInPrintRate,
			category: (row as { category?: CalcTaxRow["category"] }).category,
			addDeductTax: (row as { addDeductTax?: CalcTaxRow["addDeductTax"] }).addDeductTax,
		}));
		preview({
			items: items
				.filter((item) => item.qty && item.rate)
				.map((item, i) => ({ key: `i${i + 1}`, qty: item.qty, rate: item.rate })),
			taxes,
			applyDiscountOn:
				discountOn === NONE ? null : (discountOn as "NET_TOTAL" | "GRAND_TOTAL"),
			discountAmount: discountAmount || null,
		}).catch(() => null);
	};

	const templateRows =
		salesTemplates.find((t) => t.id === templateId)?.taxes ??
		purchaseTemplates.find((t) => t.id === templateId)?.taxes ??
		[];

	const amount = (value: string | undefined) => (
		<TableCell
			className="text-end tabular-nums"
			dir="ltr"
		>
			{value ?? "—"}
		</TableCell>
	);

	return (
		<div className="grid gap-4 p-4 lg:grid-cols-2">
			{/* input side */}
			<div className="space-y-3 rounded-[4px] border p-3">
				<Label className="font-medium">المدخلات</Label>
				{items.map((item, index) => (
					<div
						key={`row-${index.toString()}`}
						className="flex items-center gap-2"
					>
						<span className="text-muted-foreground text-xs">صنف {index + 1}</span>
						<Field className="w-24">
							<Input
								dir="ltr"
								inputMode="decimal"
								placeholder="الكمية"
								className="h-8 text-end tabular-nums"
								value={item.qty}
								onChange={(e) => setItem(index, { qty: e.target.value })}
							/>
						</Field>
						<Field className="w-32">
							<Input
								dir="ltr"
								inputMode="decimal"
								placeholder="السعر"
								className="h-8 text-end tabular-nums"
								value={item.rate}
								onChange={(e) => setItem(index, { rate: e.target.value })}
							/>
						</Field>
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label="حذف"
							disabled={items.length <= 1}
							onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}
				<Button
					variant="outline"
					size="sm"
					onClick={() => setItems((prev) => [...prev, { qty: "1", rate: "0" }])}
				>
					<IconPlus className="size-4" /> صنف
				</Button>

				<Field>
					<Label>قالب الضريبة</Label>
					<Select
						value={templateId}
						onValueChange={setTemplateId}
						dir="rtl"
					>
						<SelectTrigger size="sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={NONE}>— بدون ضرائب —</SelectItem>
							{salesTemplates.map((t) => (
								<SelectItem
									key={t.id}
									value={t.id}
								>
									مبيعات: {t.title}
								</SelectItem>
							))}
							{purchaseTemplates.map((t) => (
								<SelectItem
									key={t.id}
									value={t.id}
								>
									مشتريات: {t.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				<div className="flex items-center gap-2">
					<Field className="w-40">
						<Label>الخصم على</Label>
						<Select
							value={discountOn}
							onValueChange={setDiscountOn}
							dir="rtl"
						>
							<SelectTrigger size="sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>— بدون —</SelectItem>
								<SelectItem value="NET_TOTAL">الصافي</SelectItem>
								<SelectItem value="GRAND_TOTAL">الإجمالي</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field className="w-32">
						<Label>مبلغ الخصم</Label>
						<Input
							dir="ltr"
							inputMode="decimal"
							className="h-8 text-end tabular-nums"
							value={discountAmount}
							onChange={(e) => setDiscountAmount(e.target.value)}
						/>
					</Field>
				</div>

				<Button
					onClick={run}
					disabled={isCalculating}
				>
					<IconCalculator className="size-4" /> احسب
				</Button>

				{templateRows.length > 0 && (
					<div className="text-muted-foreground text-xs">
						{templateRows.length} سطر ضريبة:{" "}
						{templateRows.map((row) => CHARGE_TYPE_LABEL[row.chargeType]).join(" · ")}
					</div>
				)}
			</div>

			{/* result side */}
			<div className="space-y-3 rounded-[4px] border p-3">
				<Label className="font-medium">النتيجة (§8 كاملة)</Label>
				{!result ? (
					<p className="text-muted-foreground text-sm">أدخل البيانات واضغط «احسب».</p>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>الصنف</TableHead>
									<TableHead className="text-end">المبلغ</TableHead>
									<TableHead className="text-end">الصافي</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{result.items.map((item) => (
									<TableRow key={item.key}>
										<TableCell>{item.key}</TableCell>
										{amount(item.amount)}
										{amount(item.netAmount)}
									</TableRow>
								))}
							</TableBody>
						</Table>
						{result.taxes.length > 0 && (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>سطر الضريبة</TableHead>
										<TableHead className="text-end">المبلغ</TableHead>
										<TableHead className="text-end">التراكمي</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{result.taxes.map((tax) => (
										<TableRow key={tax.key}>
											<TableCell>{CHARGE_TYPE_LABEL[tax.chargeType]}</TableCell>
											{amount(tax.taxAmount)}
											{amount(tax.total)}
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
						<div className="space-y-1 rounded-[4px] bg-muted/40 p-2 text-sm">
							{[
								["الصافي", result.netTotal],
								["الضرائب", result.taxTotal],
								["الخصم المطبق", result.discountApplied],
								["الإجمالي", result.grandTotal],
								["الإجمالي المقرّب", result.roundedTotal],
								["تسوية التقريب", result.roundingAdjustment],
							].map(([label, value]) => (
								<div
									key={label}
									className="flex items-center justify-between"
								>
									<span>{label}</span>
									<b
										dir="ltr"
										className="tabular-nums"
									>
										{value}
									</b>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

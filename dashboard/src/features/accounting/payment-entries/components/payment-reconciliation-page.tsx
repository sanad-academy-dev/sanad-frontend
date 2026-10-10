import { IconArrowsExchange, IconLinkOff, IconRefresh } from "@tabler/icons-react";
import { useMemo, useState } from "react";

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
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import {
	usePaymentEntries,
	useReconciliationActions,
	useReconciliationPanes,
} from "@/features/accounting/payment-entries/hooks/use-payment-entries";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { ReconciliationAllocation } from "@/server/accounting/payment-entry/reconciliation.service";

/**
 * [P7.9] «تسوية المدفوعات» (FR-10.1/10.3) — the two-pane matcher: left the party's open
 * credits (payments, on-account JEs, CN/DNs), right the outstanding invoices. Pick ONE
 * credit, type allocations on the invoice rows, then «سوِّ». The unreconcile block below
 * breaks existing allocations of a submitted payment (FR-10.3). All figures are
 * PLE-derived server-side; the screen never computes settlement.
 */

export const PaymentReconciliationPage = () => {
	const { parties } = useParties();
	const [partyType, setPartyType] = useState<"Owner" | "Supplier">("Owner");
	const [partyId, setPartyId] = useState<string | null>(null);
	const { panes, isLoading, refetch } = useReconciliationPanes(partyType, partyId);
	const actions = useReconciliationActions();
	const { entries } = usePaymentEntries();

	const [creditKey, setCreditKey] = useState<string | null>(null);
	const [allocations, setAllocations] = useState<Record<string, string>>({});

	const partyOptions = parties.filter((party) => party.partyType === partyType);
	const selectedCredit = panes.credits.find(
		(row) => `${row.voucherType}:${row.voucherId}` === creditKey,
	);

	// submitted payments of this party that carry live allocations (unreconcile targets)
	const unreconcilable = useMemo(
		() =>
			entries.filter(
				(row) =>
					row.docstatus === "SUBMITTED" &&
					row.partyId === partyId &&
					Number(row.totalAllocatedAmount) > 0,
			),
		[entries, partyId],
	);

	const reconcile = () => {
		if (!partyId || !selectedCredit) return;
		const rows: ReconciliationAllocation[] = Object.entries(allocations)
			.filter(([, amount]) => amount && amount !== "0")
			.map(([key, amount]) => {
				const [invoiceType, invoiceId] = key.split("|");
				return {
					paymentType: selectedCredit.voucherType,
					paymentId: selectedCredit.voucherId,
					invoiceType: invoiceType as string,
					invoiceId: invoiceId as string,
					allocatedAmount: amount,
				};
			});
		if (rows.length === 0) return;
		actions.reconcile({ partyType, partyId, allocations: rows });
		setAllocations({});
		setCreditKey(null);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">تسوية المدفوعات</h1>
				<p className="text-muted-foreground text-sm">
					FR-10.1 — طابِق الأرصدة الدائنة المفتوحة مع الفواتير المستحقة؛ الفك عبر FR-10.3 يعيد
					المستحق بدقة.
				</p>
			</div>

			{/* party picker */}
			<div className="flex items-end gap-2 px-4 py-3">
				<div className="w-36">
					<Label className="text-xs">نوع الطرف</Label>
					<Select
						value={partyType}
						onValueChange={(value) => {
							setPartyType(value as "Owner" | "Supplier");
							setPartyId(null);
							setCreditKey(null);
							setAllocations({});
						}}
						dir="rtl"
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Owner">عميل</SelectItem>
							<SelectItem value="Supplier">مورد</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="w-64">
					<Label className="text-xs">الطرف</Label>
					<Select
						value={partyId ?? ""}
						onValueChange={(value) => {
							setPartyId(value);
							setCreditKey(null);
							setAllocations({});
						}}
						dir="rtl"
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر الطرف..." />
						</SelectTrigger>
						<SelectContent>
							{partyOptions.map((party) => (
								<SelectItem
									key={party.partyId}
									value={party.partyId}
								>
									{party.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => refetch()}
					disabled={!partyId || isLoading}
				>
					<IconRefresh className="size-4" />
					تحديث
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={reconcile}
					disabled={actions.isPending || !selectedCredit}
					className="ms-auto"
				>
					<IconArrowsExchange className="size-4" />
					سوِّ التخصيصات
				</Button>
			</div>

			<div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-auto border-t md:grid-cols-2">
				{/* left — open credits */}
				<div className="min-h-0 overflow-auto border-e">
					<p className="px-3 pt-2 font-semibold text-muted-foreground text-xs">
						الأرصدة الدائنة المفتوحة (اختر واحدًا)
					</p>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-10" />
								<TableHead>المستند</TableHead>
								<TableHead>التاريخ</TableHead>
								<TableHead className="text-end">الرصيد المفتوح</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{panes.credits.map((row) => {
								const key = `${row.voucherType}:${row.voucherId}`;
								return (
									<TableRow
										key={key}
										data-state={creditKey === key ? "selected" : undefined}
										className="cursor-pointer"
										onClick={() => setCreditKey(key)}
									>
										<TableCell>
											<Checkbox
												checked={creditKey === key}
												onCheckedChange={(checked) =>
													setCreditKey(checked === true ? key : null)
												}
												aria-label={`اختيار ${row.voucherNo ?? row.voucherId}`}
											/>
										</TableCell>
										<TableCell dir="ltr">{row.voucherNo ?? row.voucherId}</TableCell>
										<TableCell dir="ltr">
											{formatDisplayDate(row.postingDate?.toString())}
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.outstanding)}
										</TableCell>
									</TableRow>
								);
							})}
							{panes.credits.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="py-8 text-center text-muted-foreground"
									>
										{partyId ? "لا أرصدة دائنة مفتوحة." : "اختر طرفًا أولًا."}
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>

				{/* right — outstanding invoices with allocation inputs */}
				<div className="min-h-0 overflow-auto">
					<p className="px-3 pt-2 font-semibold text-muted-foreground text-xs">
						الفواتير المستحقة (اكتب التخصيص)
					</p>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المستند</TableHead>
								<TableHead>الاستحقاق</TableHead>
								<TableHead className="text-end">المستحق</TableHead>
								<TableHead className="w-32 text-end">التخصيص</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{panes.invoices.map((row) => {
								const key = `${row.voucherType}|${row.voucherId}`;
								return (
									<TableRow key={key}>
										<TableCell dir="ltr">{row.voucherNo ?? row.voucherId}</TableCell>
										<TableCell dir="ltr">
											{formatDisplayDate(row.dueDate?.toString())}
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.outstanding)}
										</TableCell>
										<TableCell>
											<Input
												dir="ltr"
												inputMode="decimal"
												className="h-8 text-end tabular-nums"
												disabled={!selectedCredit}
												value={allocations[key] ?? ""}
												onChange={(event) =>
													setAllocations((prev) => ({
														...prev,
														[key]: event.target.value,
													}))
												}
												aria-label={`تخصيص ${row.voucherNo ?? row.voucherId}`}
											/>
										</TableCell>
									</TableRow>
								);
							})}
							{panes.invoices.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="py-8 text-center text-muted-foreground"
									>
										{partyId ? "لا فواتير مستحقة." : "اختر طرفًا أولًا."}
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* unreconcile — FR-10.3 */}
			<div className="border-t px-4 py-3">
				<p className="mb-2 font-semibold text-muted-foreground text-xs">
					فك تسوية سند (يعيد المستحق بدقة — FR-10.3)
				</p>
				<div className="flex flex-wrap gap-2">
					{unreconcilable.length === 0 ? (
						<p className="text-muted-foreground text-xs">لا سندات مخصصة لهذا الطرف.</p>
					) : (
						unreconcilable.map((row) => (
							<Button
								key={row.id}
								type="button"
								variant="outline"
								size="xs"
								disabled={actions.isPending}
								onClick={() => {
									if (!partyId) return;
									actions.unreconcile({
										paymentType: "payment_entry",
										paymentId: row.id,
										partyType,
										partyId,
										// break ALL of this payment's allocations; per-reference
										// selection arrives with the ⋯ menu when usage demands it
										selections: (row.references ?? []).map((ref) => ({
											againstVoucherType: ref.referenceDoctype,
											againstVoucherId: ref.referenceId,
										})),
									});
								}}
							>
								<IconLinkOff className="size-3.5" />
								{row.documentNo ?? row.id}
							</Button>
						))
					)}
				</div>
			</div>
		</div>
	);
};

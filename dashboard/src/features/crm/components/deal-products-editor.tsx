import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMembershipPlans } from "@/features/accounting/memberships/hooks/use-memberships";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { useServicesForPicker } from "@/features/appointments/hooks/use-services-for-picker";
import { useSaveDealProducts } from "@/features/crm/hooks/use-crm-deals";
import type { CrmDealDetailResponse } from "@/server/crm/crm-deals/crm-deals.type";

/**
 * [CRM-P2] §6 — the products editor.
 *
 * BR-C6.2 governs the whole component: these are INDICATIVE prices. No pricing-seam call,
 * no tax, no benefits engine — the label says «قيمة تقديرية» so nobody reads the total as a
 * quote the clinic is bound to. Defaults come from `ClinicServiceConfig.price` and the
 * plan's `fee` and are then freely editable, because a quote is a negotiation.
 *
 * BR-C6.1 — the server derives `dealValue` from Σ lineTotal when rows exist and keeps the
 * manual figure when there are none. The editor therefore saves the WHOLE list: a row
 * removed here is a row deleted there, and the manual value is only sent when the list is
 * emptied, which is the one case it is allowed to matter.
 *
 * Amounts stay STRINGS end to end (contract C2) — a `number` in this path is a rounding bug
 * waiting for a big enough figure.
 */

type Row = {
	key: string;
	itemType: "SERVICE" | "MEMBERSHIP_PLAN" | "FREE_TEXT";
	itemId?: string;
	label: string;
	qty: string;
	unitPrice: string;
};

const TYPE_LABEL: Record<Row["itemType"], string> = {
	SERVICE: "دورة",
	MEMBERSHIP_PLAN: "باقة عضوية",
	FREE_TEXT: "بند حرّ",
};

/** `qty × unitPrice` for DISPLAY only; the persisted figure is the server's (C2). */
const previewLineTotal = (qty: string, unitPrice: string): string => {
	const q = Number(qty);
	const p = Number(unitPrice);
	if (!Number.isFinite(q) || !Number.isFinite(p)) return "0.00";
	return (Math.round(q * p * 100) / 100).toFixed(2);
};

const rowKey = (index: number) => `row-${index}-${Math.random().toString(36).slice(2, 8)}`;

export const DealProductsEditor = ({
	deal,
	canEdit,
}: {
	deal: CrmDealDetailResponse;
	canEdit: boolean;
}) => {
	const { services } = useServicesForPicker();
	const { plans } = useMembershipPlans("ACTIVE");
	const { saveProducts, isSavingProducts } = useSaveDealProducts();

	const [rows, setRows] = useState<Row[]>([]);
	const [manualValue, setManualValue] = useState("");

	useEffect(() => {
		setRows(
			deal.products.map((product, index) => ({
				key: rowKey(index),
				itemType: product.itemType,
				itemId: product.itemId ?? undefined,
				label: product.label,
				qty: String(product.qty),
				unitPrice: String(product.unitPrice),
			})),
		);
		setManualValue(String(deal.dealValue));
	}, [deal.products, deal.dealValue]);

	const patch = (key: string, next: Partial<Row>) =>
		setRows((current) => current.map((row) => (row.key === key ? { ...row, ...next } : row)));

	/** Choosing an item fills label AND price — the default the counter starts from. */
	const chooseItem = (key: string, itemType: Row["itemType"], itemId: string) => {
		if (itemType === "SERVICE") {
			const service = services.find((item) => item.id === itemId);
			patch(key, {
				itemId,
				label: service?.name ?? "",
				unitPrice:
					service?.price === null || service?.price === undefined
						? "0.00"
						: String(service.price),
			});
			return;
		}
		const plan = plans.find((item) => item.id === itemId);
		patch(key, { itemId, label: plan?.name ?? "", unitPrice: String(plan?.fee ?? "0.00") });
	};

	const total = rows.reduce(
		(sum, row) => sum + Number(previewLineTotal(row.qty, row.unitPrice)),
		0,
	);

	const save = () =>
		void saveProducts({
			id: deal.id,
			products: rows.map((row) => ({
				itemType: row.itemType,
				itemId: row.itemType === "FREE_TEXT" ? undefined : row.itemId,
				label: row.label,
				qty: row.qty,
				unitPrice: row.unitPrice,
			})),
			// only meaningful on an empty list (BR-C6.1); sent then so the value is explicit
			manualDealValue: rows.length === 0 ? manualValue : undefined,
		});

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-[11px] text-muted-foreground">
					الأسعار هنا <strong className="font-semibold">قيمة تقديرية</strong> — بلا ضريبة ولا
					منافع، والفاتورة تُسعّر عند إصدارها
				</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-[12px]">
					<thead>
						<tr className="text-muted-foreground">
							<th className="p-2 text-start font-medium">النوع</th>
							<th className="p-2 text-start font-medium">البند</th>
							<th className="p-2 text-start font-medium">الكمية</th>
							<th className="p-2 text-start font-medium">سعر الوحدة</th>
							<th className="p-2 text-start font-medium">الإجمالي</th>
							<th className="p-2" />
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr
								key={row.key}
								className="border-t"
							>
								<td className="p-2">
									<Select
										value={row.itemType}
										disabled={!canEdit || isSavingProducts}
										onValueChange={(value) =>
											patch(row.key, {
												itemType: value as Row["itemType"],
												itemId: undefined,
												label: "",
											})
										}
									>
										<SelectTrigger className="h-8 w-32 text-[12px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{(Object.keys(TYPE_LABEL) as Row["itemType"][]).map((type) => (
												<SelectItem
													key={type}
													value={type}
												>
													{TYPE_LABEL[type]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</td>
								<td className="p-2">
									{row.itemType === "FREE_TEXT" ? (
										<Input
											value={row.label}
											disabled={!canEdit || isSavingProducts}
											onChange={(event) => patch(row.key, { label: event.target.value })}
											placeholder="الوصف"
											className="h-8 w-56 text-[12px]"
										/>
									) : (
										<Select
											value={row.itemId ?? ""}
											disabled={!canEdit || isSavingProducts}
											onValueChange={(value) => chooseItem(row.key, row.itemType, value)}
										>
											<SelectTrigger className="h-8 w-56 text-[12px]">
												<SelectValue placeholder="اختر" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												{(row.itemType === "SERVICE"
													? services.map((item) => ({ id: item.id, name: item.name }))
													: plans.map((item) => ({ id: item.id, name: item.name }))
												).map((item) => (
													<SelectItem
														key={item.id}
														value={item.id}
													>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								</td>
								<td className="p-2">
									<Input
										value={row.qty}
										dir="ltr"
										inputMode="decimal"
										disabled={!canEdit || isSavingProducts}
										onChange={(event) => patch(row.key, { qty: event.target.value })}
										className="h-8 w-20 text-start text-[12px]"
									/>
								</td>
								<td className="p-2">
									<Input
										value={row.unitPrice}
										dir="ltr"
										inputMode="decimal"
										disabled={!canEdit || isSavingProducts}
										onChange={(event) => patch(row.key, { unitPrice: event.target.value })}
										className="h-8 w-28 text-start text-[12px]"
									/>
								</td>
								<td className="p-2 tabular-nums">
									{formatAmount(previewLineTotal(row.qty, row.unitPrice))}
								</td>
								<td className="p-2">
									{canEdit ? (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-8"
											aria-label="حذف البند"
											disabled={isSavingProducts}
											onClick={() =>
												setRows((current) => current.filter((item) => item.key !== row.key))
											}
										>
											<IconTrash className="size-4" />
										</Button>
									) : null}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{rows.length === 0 ? (
				<div className="flex flex-wrap items-center gap-2">
					{/* BR-C6.1 — with no rows the value is the operator's own figure */}
					<span className="text-[11px] text-muted-foreground">القيمة اليدوية</span>
					<Input
						value={manualValue}
						dir="ltr"
						inputMode="decimal"
						disabled={!canEdit || isSavingProducts}
						onChange={(event) => setManualValue(event.target.value)}
						className="h-8 w-32 text-start text-[12px]"
					/>
				</div>
			) : (
				<p className="text-[12px]">
					<span className="text-muted-foreground">إجمالي البنود</span>{" "}
					<strong className="tabular-nums">{formatAmount(total.toFixed(2))}</strong>
				</p>
			)}

			{canEdit ? (
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 text-[12px]"
						disabled={isSavingProducts}
						onClick={() =>
							setRows((current) => [
								...current,
								{
									key: rowKey(current.length),
									itemType: "FREE_TEXT",
									label: "",
									qty: "1",
									unitPrice: "0.00",
								},
							])
						}
					>
						<IconPlus className="size-4" />
						بند
					</Button>
					<Button
						type="button"
						size="sm"
						className="h-8 text-[12px]"
						disabled={isSavingProducts}
						onClick={save}
					>
						حفظ البنود
					</Button>
				</div>
			) : null}
		</div>
	);
};

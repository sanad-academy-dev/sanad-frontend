import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { SubscriptionSheet } from "@/features/accounting/extended/components/subscription-sheet";
import {
	useRunSubscriptionBilling,
	useSubscriptions,
} from "@/features/accounting/extended/hooks/use-extended";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { SubscriptionStatus } from "@/generated/prisma/enums";

/**
 * [P12.14] Tab «الاشتراكات» (FR-17.2) — recurring billing.
 *
 * The «حتى تاريخ» field defaults to empty (= today) and exists because the run is a pure
 * function of that date: an operator catching up after downtime needs to see what WOULD be
 * generated as of a past date, and a button that could only ever mean "now" would hide that.
 *
 * The run is safe to press twice — the period key in the database refuses a second invoice
 * for a period already billed — but the button still says what it will do rather than just
 * «تشغيل», because "generate invoices" is not an action to click exploratively.
 */

const STATUS: Record<
	SubscriptionStatus,
	{ label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
	TRIALING: { label: "تجريبي", variant: "outline" },
	ACTIVE: { label: "نشط", variant: "default" },
	PAST_DUE: { label: "متأخّر", variant: "destructive" },
	UNPAID: { label: "غير مدفوع", variant: "destructive" },
	CANCELLED: { label: "ملغى", variant: "secondary" },
	COMPLETED: { label: "مكتمل", variant: "secondary" },
};

const INTERVAL: Record<string, string> = {
	DAY: "يومي",
	WEEK: "أسبوعي",
	MONTH: "شهري",
	YEAR: "سنوي",
};

export const SubscriptionsTab = () => {
	const { subscriptions, isLoading } = useSubscriptions();
	const { runBilling, isPending } = useRunSubscriptionBilling();
	const { parties } = useParties();
	const [asOf, setAsOf] = useState("");
	const [sheet, setSheet] = useState(false);

	// [P12.15] اسم الطرف بدل مُعرِّفه الخام — نفس تصحيح تبويب المطالبات
	const partyName = (partyType: string, partyId: string) =>
		parties.find((p) => p.partyType === partyType && p.partyId === partyId)?.name ?? partyId;

	return (
		<>
			<TabIntro
				title="الاشتراكات والفوترة الدوريّة"
				hint="كل فترة تُشتقّ من تاريخ بدء الاشتراك لا من تاريخ التشغيل: تشغيل متأخّر يُعوّض ما فات، وتشغيل مكرَّر لا يُولّد شيئًا. الفواتير المولَّدة تبقى مسودّة ما لم يُطلب خلاف ذلك."
			/>
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<span className="text-muted-foreground text-xs">حتى تاريخ (فارغ = اليوم)</span>
				<DateField
					value={asOf}
					onChange={setAsOf}
					placeholder="حتى تاريخ"
				/>
				<Button
					size="sm"
					variant="outline"
					disabled={isPending}
					onClick={() => runBilling(asOf ? { asOf } : {})}
				>
					توليد الفواتير المستحقّة
				</Button>
				<Button
					size="sm"
					className="ms-auto"
					onClick={() => setSheet(true)}
				>
					<IconPlus className="size-4" />
					اشتراك جديد
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "الطرف" },
						{ label: "الدورة", className: "w-24" },
						{ label: "البداية", className: "w-28" },
						{ label: "آخر فترة مفوترة", className: "w-32" },
						{ label: "الخطط", className: "w-20 text-end" },
						{ label: "الحالة", className: "w-24" },
					]}
					rows={subscriptions}
					isLoading={isLoading}
					emptyMessage="لا اشتراكات بعد. اضغط «اشتراك جديد» لربط عميل بخطط تتكرّر فوترتها بدورة ثابتة."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell className="truncate">
								{partyName(row.partyType, row.partyId)}
							</TableCell>
							<TableCell>
								{row.intervalCount > 1 ? `${row.intervalCount}× ` : ""}
								{INTERVAL[row.interval] ?? row.interval}
							</TableCell>
							<TableCell>{formatDisplayDate(row.startDate)}</TableCell>
							<TableCell>
								{row.lastInvoicedPeriodEnd ? (
									formatDisplayDate(row.lastInvoicedPeriodEnd)
								) : (
									<span className="text-muted-foreground">لم تبدأ الفوترة</span>
								)}
							</TableCell>
							<TableCell className="text-end">{row.plans.length}</TableCell>
							<TableCell>
								<Badge variant={STATUS[row.status]?.variant ?? "outline"}>
									{STATUS[row.status]?.label ?? row.status}
								</Badge>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<SubscriptionSheet
				open={sheet}
				onOpenChange={setSheet}
			/>
		</>
	);
};

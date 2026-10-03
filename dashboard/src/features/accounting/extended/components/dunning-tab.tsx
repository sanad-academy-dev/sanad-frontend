import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DunningSheet,
	DunningTypeSheet,
} from "@/features/accounting/extended/components/dunning-sheets";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import {
	useDunnings,
	useDunningTypes,
	useSubmitDunning,
} from "@/features/accounting/extended/hooks/use-extended";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { DunningStatus } from "@/generated/prisma/enums";

/**
 * [P12.14] Tab «المطالبات» (FR-17.1) — the overdue-collection documents.
 *
 * The columns are chosen so the operator can answer «is this letter worth sending?» without
 * opening anything: how much principal is late, what the delay is costing, and whether the
 * charge has already been posted. `dunningAmount` is shown SEPARATELY from
 * `totalOutstanding` on purpose — the fee and interest are the only new money, and merging
 * them into one figure is exactly the confusion that makes a customer dispute the letter.
 */

const STATUS: Record<
	DunningStatus,
	{ label: string; variant: "outline" | "secondary" | "destructive" | "default" }
> = {
	DRAFT: { label: "مسودّة", variant: "outline" },
	UNRESOLVED: { label: "غير محصّلة", variant: "destructive" },
	RESOLVED: { label: "محصّلة", variant: "default" },
	CANCELLED: { label: "ملغاة", variant: "secondary" },
};

export const DunningTab = () => {
	const { dunnings, isLoading } = useDunnings();
	const { types } = useDunningTypes();
	const { submitDunning, isPending } = useSubmitDunning();
	const { parties } = useParties();
	const [dunningSheet, setDunningSheet] = useState(false);
	const [typeSheet, setTypeSheet] = useState(false);

	// [P12.15] العمود كان يعرض مُعرِّفًا خامًا (cuid) — اسمٌ لا يُقرأ ليس اسمًا
	const partyName = (partyType: string, partyId: string) =>
		parties.find((p) => p.partyType === partyType && p.partyId === partyId)?.name ?? partyId;

	return (
		<>
			<TabIntro
				title="المطالبات بالمتأخّرات"
				hint="تجمع فواتير الطرف المتأخّرة وتُسعّر التأخير: فائدة بسيطة من تاريخ الاستحقاق، ورسم يُفرض مرّة واحدة على المطالبة لا مرّة لكل فاتورة. الاعتماد يُرحّل الفائدة والرسم فقط — الأصل مستحقّ سلفًا ولا يُرحَّل ثانيةً."
			/>

			{/* [P12.15] النوع أوّلًا ثم المطالبة: المطالبة بلا نوع ممكنة، لكنها بلا تسعيرة
			    محفوظة تعني إدخال النسبة والرسم يدويًا في كل مرّة */}
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<span className="text-muted-foreground text-xs">
					{types.length === 0
						? "لا أنواع مطالبات بعد — النوع يحفظ نسبة الفائدة والرسم فلا تُدخلهما في كل مطالبة."
						: `${types.length} نوع مطالبة محفوظ`}
				</span>
				<Button
					size="xs"
					variant="outline"
					className="ms-auto"
					onClick={() => setTypeSheet(true)}
				>
					<IconPlus className="size-3.5" />
					نوع مطالبة
				</Button>
				<Button
					size="xs"
					onClick={() => setDunningSheet(true)}
				>
					<IconPlus className="size-3.5" />
					مطالبة جديدة
				</Button>
			</div>

			<TabShell>
				<DataTable
					headers={[
						{ label: "التاريخ", className: "w-28" },
						{ label: "الطرف" },
						{ label: "الفواتير", className: "w-20 text-end" },
						{ label: "أصل المتأخّرات", className: "w-32 text-end" },
						{ label: "الفائدة والرسم", className: "w-32 text-end" },
						{ label: "الحالة", className: "w-28" },
						{ label: "إجراءات", className: "w-28" },
					]}
					rows={dunnings}
					isLoading={isLoading}
					emptyMessage="لا مطالبات بعد. اضغط «مطالبة جديدة» واختر عميلًا لتُسحب فواتيره المتأخّرة."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>{formatDisplayDate(row.postingDate)}</TableCell>
							<TableCell className="truncate">
								{partyName(row.partyType, row.partyId)}
							</TableCell>
							<TableCell className="text-end">{row.overdues.length}</TableCell>
							<TableCell className="text-end tabular-nums">
								{String(row.totalOutstanding)}
							</TableCell>
							<TableCell className="text-end font-medium tabular-nums">
								{String(row.dunningAmount)}
							</TableCell>
							<TableCell>
								<Badge variant={STATUS[row.status]?.variant ?? "outline"}>
									{STATUS[row.status]?.label ?? row.status}
								</Badge>
							</TableCell>
							<TableCell>
								{row.status === "DRAFT" ? (
									<Button
										size="xs"
										disabled={isPending}
										onClick={() => submitDunning(row.id)}
									>
										اعتماد
									</Button>
								) : (
									<span className="text-muted-foreground text-xs">—</span>
								)}
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<DunningSheet
				open={dunningSheet}
				onOpenChange={setDunningSheet}
			/>
			<DunningTypeSheet
				open={typeSheet}
				onOpenChange={setTypeSheet}
			/>
		</>
	);
};

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { RepostSheet } from "@/features/accounting/extended/components/repost-sheet";
import { useReposts, useRunRepost } from "@/features/accounting/extended/hooks/use-extended";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { RepostStatus } from "@/generated/prisma/enums";

/**
 * [P12.14] Tab «إعادة الترحيل» (FR-6.9).
 *
 * The REASON column is first and unabbreviated, deliberately. Reposting rewrites what the
 * ledger says about a document someone already approved; the sentence explaining why is the
 * whole audit trail, and burying it behind a truncated cell would defeat the point of having
 * made it mandatory.
 *
 * A FAILED request shows its error inline rather than behind a dialog — the operator needs to
 * read it to decide whether to fix the document or abandon the repost.
 */

const STATUS: Record<
	RepostStatus,
	{ label: string; variant: "outline" | "secondary" | "default" | "destructive" }
> = {
	QUEUED: { label: "بالانتظار", variant: "outline" },
	IN_PROGRESS: { label: "قيد التنفيذ", variant: "secondary" },
	COMPLETED: { label: "تمّ", variant: "default" },
	FAILED: { label: "أخفق", variant: "destructive" },
};

export const RepostTab = () => {
	const { reposts, isLoading } = useReposts();
	const { runRepost, isPending } = useRunRepost();
	const [sheet, setSheet] = useState(false);

	return (
		<>
			<TabIntro
				title="إعادة ترحيل الدفتر"
				hint="تعكس قيود مستند مُرحَّل ثم تعيد بناءها بعد تصحيح حساباته. القيود الأصلية لا تُحذف — تبقى ظاهرة مع عكسها، فذاك هو الدليل الذي يسأل عنه المدقّق حين يتغيّر رصيد."
			/>
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<span className="text-muted-foreground text-xs">
					الإنشاء لا يُحرّك الدفتر — «تشغيل» على السطر هو ما يعكس ويعيد البناء.
				</span>
				<Button
					size="xs"
					className="ms-auto"
					onClick={() => setSheet(true)}
				>
					<IconPlus className="size-3.5" />
					طلب جديد
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "السبب" },
						{ label: "التاريخ", className: "w-28" },
						{ label: "المستندات", className: "w-24 text-end" },
						{ label: "الحالة", className: "w-28" },
						{ label: "إجراءات", className: "w-28" },
					]}
					rows={reposts}
					isLoading={isLoading}
					emptyMessage="لا طلبات إعادة ترحيل — وهذا هو الوضع الطبيعي. الطلب يُنشأ بعد تصحيح حسابات مستند مُرحَّل، لا كإجراء دوري."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>
								<p className="text-sm">{row.reason}</p>
								{row.errorMessage && (
									<p className="mt-0.5 text-destructive text-xs">{row.errorMessage}</p>
								)}
							</TableCell>
							<TableCell>{formatDisplayDate(row.createdAt)}</TableCell>
							<TableCell className="text-end">{row.items.length}</TableCell>
							<TableCell>
								<Badge variant={STATUS[row.status]?.variant ?? "outline"}>
									{STATUS[row.status]?.label ?? row.status}
								</Badge>
							</TableCell>
							<TableCell>
								{row.status === "QUEUED" || row.status === "FAILED" ? (
									<Button
										size="xs"
										variant={row.status === "FAILED" ? "outline" : "default"}
										disabled={isPending}
										onClick={() => runRepost(row.id)}
									>
										{row.status === "FAILED" ? "إعادة المحاولة" : "تشغيل"}
									</Button>
								) : (
									<span className="text-muted-foreground text-xs">—</span>
								)}
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<RepostSheet
				open={sheet}
				onOpenChange={setSheet}
			/>
		</>
	);
};

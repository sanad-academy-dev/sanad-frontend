import { IconCoins } from "@tabler/icons-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TierPill } from "@/features/loyalty/components/tier-pill";
import {
	useOwnerLoyaltyStatement,
	useOwnerLoyaltySummary,
} from "@/features/loyalty/hooks/use-loyalty-ledger";
import {
	LEDGER_KIND_LABEL,
	LEDGER_SOURCE_LABEL,
} from "@/features/loyalty/utils/ledger-labels";
import { cn } from "@/lib/utils";

/**
 * [LY-P1] §10.3 — شريحة نقاط وليّ الأمر على ملفّه، بجانب شريحتَي العضوية والرصيد المفتوح.
 *
 * **تختفي بهدوء** في ثلاث حالات: وحدةٌ مطفأة، قارئٌ بلا صلاحية دفتر النقاط (٤٠٣)، ووليّ أمرٌ
 * بلا أيّ حركة. شريحةٌ تقول «٠ نقطة» لأكاديميةٍ لا تشغّل الولاء أصلًا تشوّش ولا تُفيد.
 * ورصيدٌ **سالب** يُعرض كما هو ولا يُقصّ إلى صفر (BR-L5.6): إخفاؤه يجعل استردادًا عكس
 * نقاطًا أُنفقت يبدو كأنّه لم يقع.
 *
 * الرصيد هنا مجموعُ صفوف الدفتر لا عمودًا مخزَّنًا (BR-L9.1)، فما تراه الشريحة هو ما
 * سيراه الاستبدال في LY-P2 حرفيًا.
 *
 * (مستوى وليّ الأمر — الجزء الثالث من §10.3 — يصل في LY-P3 حين تُشتقّ المستويات من الإنفاق؛
 * عرضُ مستوًى قبل اشتقاقه كان سيكون رقمًا مخترَعًا.)
 */
export const OwnerPointsChip = ({ ownerId }: { ownerId: string | null | undefined }) => {
	const [open, setOpen] = useState(false);
	const { summary } = useOwnerLoyaltySummary(ownerId);
	const { entries, isLoading } = useOwnerLoyaltyStatement(ownerId, open);

	if (!summary?.enabled) return null;
	if (summary.balance === 0 && summary.expiringSoon === 0) return null;

	const negative = summary.balance < 0;

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={cn(
					"flex items-center gap-2 rounded-md border px-3 py-2 text-start transition-colors",
					negative
						? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
						: "border-chart-4/25 bg-chart-4/10 text-chart-4 hover:bg-chart-4/15",
				)}
			>
				<IconCoins className="size-4 shrink-0" />
				<span className="font-medium text-sm">نقاط الولاء</span>
				<span className="font-semibold text-sm tabular-nums">
					{summary.balance.toLocaleString("ar-EG")} نقطة
				</span>
				{/* [LY-P3] §10.3 — المستوى، مشتقًّا من الإنفاق لا مُسنَدًا (BR-L4.1).
				    حُجب في LY-P1 عمدًا لأنّه كان سيكون رقمًا مخترَعًا قبل الاشتقاق. */}
				{summary.tier ? (
					<TierPill
						name={summary.tier.name}
						colorToken={summary.tier.colorToken}
					/>
				) : null}
				{negative ? (
					<span className="text-xs">رصيد سالب — لا يُستبدل حتى يُغطّى بكسب لاحق</span>
				) : summary.tier && Number(summary.tier.earnMultiplier) !== 1 ? (
					<span className="text-xs">
						كسبٌ ×{summary.tier.earnMultiplier}
						{summary.expiringSoon > 0
							? ` · ${summary.expiringSoon.toLocaleString("ar-EG")} تنتهي قريبًا`
							: ""}
					</span>
				) : summary.expiringSoon > 0 ? (
					<span className="text-xs">
						{summary.expiringSoon.toLocaleString("ar-EG")} نقطة تنتهي خلال{" "}
						{summary.expiryNoticeDays} يومًا
					</span>
				) : (
					<span className="text-xs">اعرض كشف الحركة</span>
				)}
			</button>

			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				<DialogContent
					className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle>كشف نقاط الولاء</DialogTitle>
						<DialogDescription>
							كل حركة على رصيد هذا وليّ الأمر، الأحدث أولًا. الدفتر إلحاقيّ — لا صفَّ يُعدَّل ولا يُحذف،
							والتصحيح صفٌّ جديد.
							{summary.tier ? (
								<>
									{" "}
									المستوى «{summary.tier.name}» مشتقٌّ من إنفاق {summary.qualifyingSpend} خلال
									آخر {summary.tierWindowMonths} شهرًا، ويُعاد حسابه تلقائيًا — لا يُسنَد يدويًا.
								</>
							) : null}
						</DialogDescription>
					</DialogHeader>

					{isLoading ? (
						<p className="py-8 text-center text-muted-foreground text-sm">جارٍ تحميل الكشف…</p>
					) : entries.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground text-sm">
							لا توجد حركة نقاط على هذا وليّ الأمر بعد.
						</p>
					) : (
						// خمسة أعمدة على عرض هاتف تدفع الحوار أفقيًا — الجدول وحده يمرّر
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-start">التاريخ</TableHead>
										<TableHead className="text-start">الحركة</TableHead>
										<TableHead className="text-start">المصدر</TableHead>
										<TableHead className="text-start">النقاط</TableHead>
										<TableHead className="text-start">تنتهي في</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{entries.map((row) => (
										<TableRow key={row.id}>
											<TableCell className="tabular-nums">
												{new Date(row.earnedAt).toLocaleDateString("ar-EG")}
											</TableCell>
											<TableCell>{LEDGER_KIND_LABEL[row.kind]}</TableCell>
											<TableCell>{LEDGER_SOURCE_LABEL[row.sourceType]}</TableCell>
											<TableCell
												className={cn(
													"font-semibold tabular-nums",
													row.points < 0 ? "text-destructive" : "text-chart-4",
												)}
											>
												{row.points > 0 ? "+" : ""}
												{row.points.toLocaleString("ar-EG")}
											</TableCell>
											<TableCell className="tabular-nums text-muted-foreground">
												{row.expiresAt
													? new Date(row.expiresAt).toLocaleDateString("ar-EG")
													: "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

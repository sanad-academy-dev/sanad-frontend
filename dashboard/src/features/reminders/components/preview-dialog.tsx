import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { formatDateTime } from "@/features/reminders/data/reminders";
import type { PreviewRow } from "@/server/reminders/reminders.type";

/**
 * [RC3] معاينة قاعدة.
 *
 * تعرض ما تنتجه القاعدة على بيانات الأكاديمية **الحقيقية**، عبر نفس مسار الإدراج
 * بالضبط مع `dryRun`. معاينةٌ تسلك مسارًا آخر ليست معاينة بل تخمينٌ متفائل: تعرض
 * نصًّا جميلًا ثم يصل وليّ الأمر شيءٌ آخر.
 *
 * والصفّ المتعذّر يُعرض بسببه لا يُخفى — «١٢ مرشَّحًا و٣ رسائل» بلا تفسيرٍ للفارق
 * يجعل الموظّف يظنّ أن الوحدة معطّلة، بينما التسعة الباقون بلا رقم جوال.
 */
export function PreviewDialog({
	open,
	onOpenChange,
	ruleName,
	isPending,
	summary,
	rows,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ruleName: string;
	isPending: boolean;
	summary?: {
		candidates: number;
		queued: number;
		notDue: number;
		duplicates: number;
		skipped: number;
	};
	rows: PreviewRow[];
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
				<div className="border-b px-4 py-2">
					<DialogTitle className="text-base">معاينة — {ruleName}</DialogTitle>
				</div>

				<div className="flex flex-col gap-3 p-4">
					{isPending ? (
						<div className="flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm">
							<Spinner className="size-4" />
							جارٍ الفحص على بيانات الأكاديمية...
						</div>
					) : (
						<>
							{summary && (
								<div className="flex flex-wrap gap-1.5">
									<Badge variant="outline">{summary.candidates} مرشّح</Badge>
									<Badge variant="secondary">{summary.queued} ستُدرَج</Badge>
									<Badge variant="outline">{summary.notDue} لم يحن وقتها</Badge>
									<Badge variant="outline">{summary.duplicates} أُدرجت من قبل</Badge>
									<Badge variant="outline">{summary.skipped} متعذّرة</Badge>
								</div>
							)}

							{rows.length === 0 ? (
								<p className="py-8 text-center text-muted-foreground text-sm">
									لا رسائل تنتجها هذه القاعدة الآن.
								</p>
							) : (
								<div className="flex flex-col gap-2">
									{rows.map((row) => (
										<div
											key={row.dedupeKey}
											className="flex flex-col gap-1.5 rounded-md border p-3"
										>
											<div className="flex flex-wrap items-center gap-2">
												<span className="font-medium text-sm">{row.ownerName ?? "—"}</span>
												{row.patientName && (
													<span className="text-muted-foreground text-xs">
														{row.patientName}
													</span>
												)}
												{row.channel ? (
													<Badge
														variant="secondary"
														className="text-xs"
													>
														{row.channel}
													</Badge>
												) : (
													<Badge
														variant="outline"
														className="text-xs"
													>
														متعذّرة
													</Badge>
												)}
												{row.scheduledFor && (
													<span className="text-muted-foreground text-xs">
														{formatDateTime(row.scheduledFor)}
													</span>
												)}
											</div>

											{row.skippedReason ? (
												<p className="text-destructive text-xs">{row.skippedReason}</p>
											) : (
												// النصّ كما سيصل بالضبط — بأسطره كما هي
												<pre className="whitespace-pre-wrap font-sans text-muted-foreground text-xs">
													{row.body}
												</pre>
											)}
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>

				<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
					<span className="text-muted-foreground text-xs">
						المعاينة لا تُرسل ولا تُدرج شيئًا.
					</span>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => onOpenChange(false)}
					>
						إغلاق
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

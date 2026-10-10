import { IconCheck, IconClock } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import { GroomingLane, GroomingStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import {
	GROOMING_PRICE_LEVEL_LABELS,
	type GroomingPriceLevel,
} from "@sanad/contracts/runtime/server/grooming/grooming-pricing.service";

// جدول دورات الجلسة — نفس بنية جدول فحوصات الأشعّة: صفّ لكل دورة، حالته
// وأزراره في الصفّ نفسه، ثم الرسوم والخصوم أسفله بمجموع واحد.
//
// الرسوم تظهر أسطرًا مستقلّة لا مطويّةً في السعر: هي التي تفسّر لماذا اختلف
// الرقم عمّا قيل عند الحجز.

/** مستوى السعر لقطةً نصّية على البند — قد يغيب في بنود قديمة */
const priceLevelLabel = (level: string | null) =>
	level && level in GROOMING_PRICE_LEVEL_LABELS
		? GROOMING_PRICE_LEVEL_LABELS[level as GroomingPriceLevel]
		: "سعر مثبَّت";

const money = (value: unknown) =>
	`${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

/** بعد التسليم لا معنى لتعديل ما نُفّذ — السجل يُقفل مع الجلسة */
const isEditable = (status: GroomingStatus) =>
	status !== GroomingStatus.COMPLETED &&
	status !== GroomingStatus.CANCELLED &&
	status !== GroomingStatus.NO_SHOW &&
	status !== GroomingStatus.PICKED_UP;

export function GroomingServicesTable({ session }: { session: GroomingSessionDetail }) {
	const { setItemPerformed, isPending } = useGroomingMutations();
	const editable = isEditable(session.status);

	const performedCount = session.items.filter((i) => i.performed).length;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				<h3 className="font-semibold text-base">دورات الجلسة</h3>
				<span className="text-muted-foreground text-xs tabular-nums">
					نُفِّذ {performedCount} من {session.items.length}
				</span>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">الدورة</TableHead>
							<TableHead className="text-center">المدّة</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
							<TableHead className="text-center">السعر</TableHead>
							<TableHead className="text-center">الإجراء</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{session.items.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground text-sm"
								>
									لا دورات على هذه الجلسة
								</TableCell>
							</TableRow>
						)}

						{session.items.map((item) => (
							<TableRow key={item.id}>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-medium text-sm">{item.nameSnapshot}</span>
										<span className="text-[11px] text-muted-foreground">
											{priceLevelLabel(item.priceLevelSnapshot)}
											{item.quantity > 1 ? ` · ×${item.quantity}` : ""}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-center text-muted-foreground text-xs tabular-nums">
									<span className="inline-flex items-center gap-1">
										<IconClock className="size-3.5" />
										{item.durationSnapshot} د
									</span>
								</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Badge
											variant="outline"
											className={cn(
												"rounded-full text-[10px]",
												item.performed
													? "border-emerald-200 bg-emerald-50 text-emerald-700"
													: "text-muted-foreground",
											)}
										>
											{item.performed ? "نُفِّذت" : "لم تُنفَّذ"}
										</Badge>
										{item.laneSnapshot === GroomingLane.MEDICAL && (
											<Badge
												variant="outline"
												className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700"
											>
												طبية
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell className="text-center text-sm tabular-nums">
									{money(item.priceSnapshot)}
								</TableCell>
								<TableCell className="text-center">
									{editable && (
										<Button
											type="button"
											size="sm"
											variant={item.performed ? "secondary" : "outline"}
											className="gap-1.5"
											disabled={isPending}
											onClick={() => {
												void setItemPerformed({
													id: session.id,
													itemId: item.id,
													performed: !item.performed,
												}).catch(() => {});
											}}
										>
											<IconCheck className="size-3.5" />
											{item.performed ? "تراجع" : "تم التنفيذ"}
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}

						{/* الرسوم والخصوم — سطر لكل واحد بمصدره وسببه */}
						{session.adjustments.map((adj) => (
							<TableRow
								key={adj.id}
								className="bg-muted/30"
							>
								<TableCell colSpan={3}>
									<div className="flex flex-col">
										<span className="text-sm">{adj.labelSnapshot}</span>
										{adj.reason && (
											<span className="text-[11px] text-muted-foreground">{adj.reason}</span>
										)}
									</div>
								</TableCell>
								<TableCell className="text-center text-sm tabular-nums">
									{money(adj.amount)}
								</TableCell>
								<TableCell className="text-center">
									{adj.approvedByOwnerAt && (
										<Badge
											variant="outline"
											className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
										>
											أقرّها وليّ الأمر
										</Badge>
									)}
								</TableCell>
							</TableRow>
						))}

						<TableRow className="font-medium">
							<TableCell
								colSpan={3}
								className="text-start"
							>
								إجمالي التسعيرة
							</TableCell>
							<TableCell className="text-center tabular-nums">
								{money(session.quoteTotal)}
							</TableCell>
							<TableCell className="text-center">
								{session.ownerApprovedQuoteAt ? (
									<Badge
										variant="outline"
										className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
									>
										مُقرَّة
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="text-[10px] text-muted-foreground"
									>
										بانتظار الإقرار
									</Badge>
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

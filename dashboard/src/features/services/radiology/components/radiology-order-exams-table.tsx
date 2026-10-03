import { IconPhoto } from "@tabler/icons-react";

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
import { RADIOLOGY_STAGE_META } from "@/features/services/radiology/data/radiology-data";
import { RadiologyStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// جدول فحوصات الطلب — زر الصف يفتح لوحة الفحص المفرد وتسميته تتبع حالته

const instancesCountOf = (item: RadiologyItemResponse) =>
	item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

const actionLabel = (status: RadiologyStatus): string => {
	switch (status) {
		case RadiologyStatus.QUEUE:
			return "تأكيد طلب الأشعة";
		case RadiologyStatus.SCHEDULED:
			return "بدء تحضير الطفل";
		case RadiologyStatus.PREPARATION:
			return "إكمال تحضير الطفل";
		case RadiologyStatus.IMAGING:
			return "التصوير ورفع الصور";
		case RadiologyStatus.REPORTING:
			return "كتابة التقرير";
		case RadiologyStatus.UNDER_REVIEW:
			return "مراجعة التقرير";
		default:
			return "عرض التقرير";
	}
};

export function RadiologyOrderExamsTable({
	order,
	activeItemId,
	focusItemId,
	onOpenItem,
}: {
	order: RadiologyOrderResponse;
	activeItemId: string | null;
	/** حصر الجدول في فحص بعينه (الفتح من بطاقة اللوحة) */
	focusItemId: string | null;
	onOpenItem: (itemId: string) => void;
}) {
	const items = focusItemId
		? order.items.filter((item) => item.id === focusItemId)
		: order.items;

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-base font-semibold">فحوصات الطلب</h3>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">الفحص</TableHead>
							<TableHead className="text-center">طريقة التصوير</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
							<TableHead className="text-center">الصور</TableHead>
							<TableHead className="text-center">الإجراء</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item) => {
							const imagesCount = instancesCountOf(item);
							const isCancelled = item.status === RadiologyStatus.CANCELLED;
							return (
								<TableRow
									key={item.id}
									className={cn(activeItemId === item.id && "bg-muted/40")}
								>
									<TableCell>
										<div className="flex flex-col">
											<span className="text-sm font-medium">{item.service.name}</span>
											<span className="text-[11px] tabular-nums text-muted-foreground">
												{item.accession}
												{item.bodyPart ? ` · ${item.bodyPart}` : ""}
											</span>
										</div>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{MODALITY_META[item.modality].label}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1">
											<Badge
												variant="outline"
												className="text-[10px]"
											>
												{RADIOLOGY_STATUS_LABELS[item.status]}
											</Badge>
											{/* المرحلة الفرعية — لها معنى داخل التحضير والتصوير فقط */}
											{(item.status === RadiologyStatus.PREPARATION ||
												item.status === RadiologyStatus.IMAGING) && (
												<Badge
													variant="outline"
													className={cn(
														"text-[10px]",
														RADIOLOGY_STAGE_META[item.stage].className,
													)}
												>
													{RADIOLOGY_STAGE_META[item.stage].label}
												</Badge>
											)}
											{item.rejectedAt !== null && (
												<Badge
													variant="outline"
													className="border-rose-200 bg-rose-50 text-[10px] text-rose-700"
												>
													تم رفضها
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell className="text-center">
										{imagesCount > 0 ? (
											<span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
												<IconPhoto className="size-3.5" />
												{imagesCount}
											</span>
										) : (
											<span className="text-xs text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell className="text-center">
										{!isCancelled && (
											<Button
												type="button"
												size="sm"
												variant={activeItemId === item.id ? "secondary" : "outline"}
												onClick={() => onOpenItem(item.id)}
											>
												{actionLabel(item.status)}
											</Button>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

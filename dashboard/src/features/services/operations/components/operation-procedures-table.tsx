import { IconChevronLeft, IconScissors } from "@tabler/icons-react";

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
import { OperationStatus } from "@/generated/prisma/enums";
import {
	OPERATION_LATERALITY_LABELS,
	type OperationCaseDetailResponse,
} from "@sanad/contracts/runtime/server/operations/operations.type";
import {
	OPERATION_STAGE_LABELS,
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";

// جدول إجراءات الحالة — نمط جدول فحوصات طلب الأشعة: زر الصف يفتح لوحة سير
// العمل وتسميته هي الخطوة الحالية لا عبارة عامة.

/** تسمية زر الإجراء = الخطوة الحالية في المسار */
const actionLabel = (c: OperationCaseDetailResponse): string => {
	switch (c.status) {
		case OperationStatus.SCHEDULED:
			return "بدء التحضير";
		case OperationStatus.DISCHARGE:
			return "أوامر الخروج";
		case OperationStatus.FOLLOW_UP:
			return "المتابعة";
		case OperationStatus.COMPLETED:
		case OperationStatus.CANCELLED:
			return "عرض السجل";
		default:
			return c.stage ? OPERATION_STAGE_LABELS[c.stage] : OPERATION_STATUS_LABELS[c.status];
	}
};

export function OperationProceduresTable({
	operationCase: c,
	onOpenWork,
}: {
	operationCase: OperationCaseDetailResponse;
	onOpenWork: () => void;
}) {
	const isCancelled = c.status === OperationStatus.CANCELLED;

	return (
		<div className="flex flex-col gap-3">
			<h3 className="flex items-center gap-1.5 text-base font-semibold">
				<IconScissors className="size-4 text-muted-foreground" />
				إجراءات الحالة
				{c.procedures.length > 1 && (
					<span className="text-sm font-normal text-muted-foreground">
						({c.procedures.length})
					</span>
				)}
			</h3>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">الإجراء</TableHead>
							<TableHead className="text-center">الدرجة</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
							<TableHead className="text-center">الإجراء</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{c.procedures.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center text-sm text-muted-foreground"
								>
									لا إجراءات في هذه الحالة
								</TableCell>
							</TableRow>
						)}
						{c.procedures.map((p) => (
							<TableRow
								key={p.id}
								className={isCancelled ? undefined : "cursor-pointer"}
								onClick={() => {
									if (!isCancelled) onOpenWork();
								}}
							>
								<TableCell>
									<div className="flex flex-col">
										<span className="text-sm font-medium">{p.nameSnapshot}</span>
										{(p.laterality !== "NONE" || p.site) && (
											<span className="text-[11px] text-muted-foreground">
												{p.laterality !== "NONE"
													? OPERATION_LATERALITY_LABELS[p.laterality]
													: ""}
												{p.laterality !== "NONE" && p.site ? " · " : ""}
												{p.site ?? ""}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant="outline"
										className="text-[10px]"
									>
										{OPERATION_TIER_LABELS[c.tier]}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{OPERATION_STATUS_LABELS[c.status]}
										</Badge>
										{/* المرحلة الفرعية — الخطوة الحالية داخل الحالة */}
										{c.stage && (
											<Badge
												variant="outline"
												className="border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700"
											>
												{OPERATION_STAGE_LABELS[c.stage]}
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell
									className="text-center"
									onClick={(e) => e.stopPropagation()}
								>
									{!isCancelled && (
										<Button
											type="button"
											size="sm"
											variant="outline"
											className="gap-1"
											onClick={onOpenWork}
										>
											{actionLabel(c)}
											{/* الشيفرون يشير لجهة فتح اللوحة — يُقلب في RTL */}
											<IconChevronLeft className="size-3.5 rtl:rotate-180" />
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

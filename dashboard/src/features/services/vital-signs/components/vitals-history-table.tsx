import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { TablePagination } from "@/components/common/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { VitalsFreshnessBadge } from "@/features/services/vital-signs/components/vitals-freshness-badge";
import {
	formatVitalValue,
	VITALS_FIELDS,
	VITALS_SOURCE_LABELS,
} from "@/features/services/vital-signs/data/vitals-fields";
import { useDeleteVitalSigns } from "@/features/services/vital-signs/hooks/use-vital-signs-mutations";
import { cn } from "@/lib/utils";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

const PAGE_SIZE = 15;

interface VitalsHistoryTableProps {
	patientId: string;
	records: VitalSignsRecordResponse[];
	onEdit: (record: VitalSignsRecordResponse) => void;
}

export function VitalsHistoryTable({ patientId, records, onEdit }: VitalsHistoryTableProps) {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const { deleteVitalSigns } = useDeleteVitalSigns(patientId);

	const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
	const safePage = Math.min(page, pageCount - 1);
	const rows = records.slice(safePage * pageSize, safePage * pageSize + pageSize);

	return (
		<div className="flex flex-col gap-2">
			<p className="font-semibold text-sm">سجل القياسات</p>

			{/*
			  بلا overflow هنا: مكوّن Table يحمل حاوية التمرير الأفقي أصلًا، وإضافة
			  حاوية ثانية حولها تجعل الجدول w-full داخلها فلا يتجاوزها أبدًا — تنضغط
			  الأعمدة ويُقصّ آخرها بلا أي وسيلة للوصول إليه. الحدّ الأدنى للعرض هو ما
			  يسمح للجدول بتجاوز الحاوية فيعمل تمريرها.
			*/}
			<div className="rounded-[4px] border">
				<Table className="min-w-225">
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">التاريخ</TableHead>
							<TableHead className="text-start">المصدر</TableHead>
							{VITALS_FIELDS.map((spec) => (
								<TableHead
									key={spec.key}
									className="whitespace-nowrap text-start"
								>
									{spec.label}
								</TableHead>
							))}
							<TableHead className="text-start">الضغط</TableHead>
							<TableHead className="text-start">المسجِّل</TableHead>
							<TableHead className="w-10" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{rows.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={VITALS_FIELDS.length + 5}
									className="py-8 text-center text-sm text-muted-foreground"
								>
									لا توجد قياسات مسجّلة لهذا الطفل
								</TableCell>
							</TableRow>
						)}

						{rows.map((record) => {
							// السجل المُصحَّح يبقى ظاهرًا لأنه ما يراه مستنده، لكنه مكتوم
							const superseded = !!record.correction;
							return (
								<TableRow
									key={record.id}
									className={cn(superseded && "opacity-60")}
								>
									<TableCell className="whitespace-nowrap">
										<div className="flex flex-col gap-1">
											<span
												className="tabular-nums text-xs"
												dir="ltr"
											>
												{new Date(record.recordedAt).toLocaleString("en-GB")}
											</span>
											<VitalsFreshnessBadge
												recordedAt={record.recordedAt}
												iconless
												className="w-fit"
											/>
										</div>
									</TableCell>

									<TableCell className="whitespace-nowrap">
										<div className="flex items-center gap-1.5">
											<Badge variant="outline">{VITALS_SOURCE_LABELS[record.source]}</Badge>
											{superseded && <Badge variant="sub">مُصحَّح</Badge>}
											{record.correctsId && <Badge variant="primary">تصحيح</Badge>}
										</div>
									</TableCell>

									{VITALS_FIELDS.map((spec) => (
										<TableCell
											key={spec.key}
											className="tabular-nums"
										>
											{formatVitalValue(record[spec.key] as string | number, spec)}
										</TableCell>
									))}

									<TableCell className="tabular-nums">{record.bloodPressure ?? "—"}</TableCell>

									<TableCell className="whitespace-nowrap text-xs text-muted-foreground">
										{record.recordedBy?.name ?? "—"}
									</TableCell>

									<TableCell>
										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger asChild>
												<Button
													size="icon"
													variant="ghost"
													className="size-7"
												>
													<IconDots className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem
													className="gap-2"
													onSelect={() => onEdit(record)}
												>
													<IconEdit className="size-4" />
													تعديل
												</DropdownMenuItem>
												<DropdownMenuItem
													className="gap-2 text-destructive"
													onSelect={() => void deleteVitalSigns(record.id)}
												>
													<IconTrash className="size-4" />
													حذف
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{records.length > 0 && (
				<TablePagination
					page={safePage}
					pageCount={pageCount}
					totalRows={records.length}
					fromRow={safePage * pageSize + 1}
					toRow={Math.min(records.length, safePage * pageSize + pageSize)}
					onPageChange={setPage}
					pageSize={pageSize}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setPage(0);
					}}
				/>
			)}
		</div>
	);
}

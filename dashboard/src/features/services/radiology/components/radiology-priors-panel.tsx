import { IconHistory, IconPhoto } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRadiologyPriors } from "@/features/services/radiology/hooks/use-radiology-extras";
import { RadiologyViewerDialog } from "@/features/services/radiology/viewer/radiology-viewer-dialog";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// الدراسات السابقة لنفس الطفل ونفس الفحص بعينه. حقل «المقارنة» في التقرير
// بلا هذه اللوحة سؤال بلا مصدر — هنا يراها المدرّب ويفتح صورها قبل أن يكتب.
// «فتح للمقارنة» يفتح العارض على وضع المقارنة جنبًا إلى جنب.

const dateLabel = (value: Date | string | null) =>
	value
		? new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", calendar: "gregory" }).format(
				new Date(value),
			)
		: "—";

export function RadiologyPriorsPanel({ itemId }: { itemId: string }) {
	const { priors, isLoading } = useRadiologyPriors(itemId);
	const [viewerStudyId, setViewerStudyId] = useState<string | null>(null);

	if (isLoading || priors.length === 0) return null;

	return (
		<div className="flex flex-col gap-2 rounded-md border bg-muted/20 p-3">
			<p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
				<IconHistory className="size-3.5" />
				دراسات سابقة لنفس الفحص
				<span className="tabular-nums">({priors.length})</span>
			</p>

			<div className="flex flex-col gap-1.5">
				{priors.map((prior) => {
					// الفحص قد يضم أكثر من دراسة — نفتح أغناها صورًا لا أوّلها،
					// وإلا فُتحت صورة مرفوعة مكان سلسلة DICOM كاملة
					const studies = prior.studies
						.map((study) => ({
							study,
							count: study.series.reduce((n, series) => n + series.instances.length, 0),
						}))
						.filter((row) => row.count > 0)
						.sort((a, b) => b.count - a.count);
					const images = studies.reduce((sum, row) => sum + row.count, 0);
					const richest = studies[0]?.study;
					return (
						<div
							key={prior.id}
							className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border bg-background px-2.5 py-1.5"
						>
							<div className="flex min-w-0 flex-col gap-0.5">
								<div className="flex items-center gap-1.5">
									<span className="truncate text-xs font-medium">{prior.service.name}</span>
									<Badge
										variant="secondary"
										className="rounded-sm text-[10px]"
									>
										{MODALITY_META[prior.modality]?.label ?? prior.modality}
									</Badge>
									{prior.report?.criticalFinding && (
										<Badge
											variant="outline"
											className="rounded-sm border-red-200 bg-red-50 text-[10px] text-red-700"
										>
											حرجة
										</Badge>
									)}
								</div>
								<span className="text-[11px] text-muted-foreground">
									{dateLabel(prior.completedAt ?? prior.createdAt)} · {prior.accession}
									{prior.bodyPart ? ` · ${prior.bodyPart}` : ""}
								</span>
								{prior.report?.impression && (
									<p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
										{prior.report.impression}
									</p>
								)}
							</div>
							{richest && images > 0 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-7 shrink-0 gap-1.5 text-[11px]"
									onClick={() => setViewerStudyId(richest.id)}
								>
									<IconPhoto className="size-3.5" />
									مقارنة ({images})
								</Button>
							)}
						</div>
					);
				})}
			</div>

			<RadiologyViewerDialog
				studyId={viewerStudyId}
				onOpenChange={(open) => {
					if (!open) setViewerStudyId(null);
				}}
			/>
		</div>
	);
}

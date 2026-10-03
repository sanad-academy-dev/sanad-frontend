import { IconPhoto } from "@tabler/icons-react";
import { type ReactNode, useMemo, useState } from "react";

import { dicomImageId } from "@/features/services/radiology/viewer/cornerstone";
import { DicomStackViewer } from "@/features/services/radiology/viewer/dicom-stack-viewer";
import { ImageStackViewer } from "@/features/services/radiology/viewer/image-stack-viewer";
import { useStudyDetail } from "@/features/services/radiology/viewer/use-study-detail";
import { RadiologyModality } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

// جزء عارض واحد: شريط السلاسل + العارض الفعّال لدراسة بعينها. يُستعمل مرّتين
// في وضع المقارنة (الحالية بجانب السابقة)، ومرّة واحدة في العرض العادي.
// كل نسخة تبني محرّك Cornerstone خاصًّا بها (العدّاد داخل DicomStackViewer)،
// فالجزآن يعملان جنبًا إلى جنب بأدوات مستقلّة.

export function RadiologyStudyPane({
	studyId,
	label,
	compact = false,
	enableAi = true,
}: {
	studyId: string;
	/** شارة تعلو الجزء — «الحالية» أو «السابقة» مع تاريخها */
	label?: ReactNode;
	/** يضيّق شريط السلاسل — للعرض المنقسم */
	compact?: boolean;
	/** «اسأل الذكاء الاصطناعي» يبقى على الدراسة الحالية وحدها */
	enableAi?: boolean;
}) {
	const { study, isLoading, isError } = useStudyDetail(studyId);
	const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

	const series = study?.series ?? [];
	const active = series.find((s) => s.id === activeSeriesId) ?? series[0] ?? null;

	// سلسلة DICOM تتوسّع لصورها وإطاراتها (المقاطع متعددة الإطارات تُفرد إطارًا إطارًا)
	const dicomImageIds = useMemo(() => {
		if (!active) return [];
		return active.instances
			.filter((instance) => instance.kind === "DICOM")
			.flatMap((instance) => {
				const frames = instance.frames ?? 1;
				if (frames <= 1) return [dicomImageId(instance.id)];
				// ترقيم الإطارات في wadouri يبدأ من ١ لا من ٠ (المحمّل يطرح واحدًا)
				return Array.from({ length: frames }, (_, i) => dicomImageId(instance.id, i + 1));
			});
	}, [active]);

	const plainImages = active
		? active.instances.filter((instance) => instance.kind === "IMAGE")
		: [];
	const isDicomSeries = dicomImageIds.length > 0;

	if (isLoading) {
		return (
			<div className="flex min-h-0 flex-1 items-center justify-center text-sm text-neutral-400">
				جارٍ تحميل الدراسة...
			</div>
		);
	}

	if (isError || !study) {
		return (
			<div className="flex min-h-0 flex-1 items-center justify-center text-sm text-red-400">
				تعذّر جلب الدراسة
			</div>
		);
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-2">
			{label}
			<div className="flex min-h-0 flex-1 gap-2">
				{/* شريط السلاسل — الأولى تُفتح افتراضيًا */}
				<aside
					className={cn(
						"flex shrink-0 flex-col gap-1.5 overflow-y-auto",
						compact ? "w-32" : "w-48",
					)}
				>
					{series.map((s) => {
						const isActive = s.id === (active?.id ?? null);
						return (
							<button
								key={s.id}
								type="button"
								className={cn(
									"flex flex-col gap-0.5 rounded-md border p-2.5 text-start transition-colors",
									isActive
										? "border-indigo-500 bg-indigo-600/20"
										: "border-neutral-800 bg-neutral-900 hover:bg-neutral-800",
								)}
								onClick={() => setActiveSeriesId(s.id)}
							>
								<span className="flex items-center gap-1.5 text-xs font-medium">
									<IconPhoto className="size-3.5 shrink-0 text-neutral-400" />
									<span className="truncate">
										{s.description || `سلسلة ${s.seriesNumber ?? ""}`.trim() || "سلسلة"}
									</span>
								</span>
								<span className="text-[11px] tabular-nums text-neutral-400">
									{s.instances.length} صورة
									{s.modalityCode ? ` · ${s.modalityCode}` : ""}
									{s.bodyPart ? ` · ${s.bodyPart}` : ""}
								</span>
							</button>
						);
					})}
					{series.length === 0 && (
						<p className="p-2 text-xs text-neutral-500">لا سلاسل في هذه الدراسة</p>
					)}
				</aside>

				{/* العارض الفعّال — DICOM عبر Cornerstone، والصور العادية بعارض بسيط */}
				{active ? (
					isDicomSeries ? (
						<DicomStackViewer
							// إعادة التركيب عند تبديل السلسلة تعيد بناء المكدّس نظيفًا
							key={active.id}
							imageIds={dicomImageIds}
							isCt={study.item.modality === RadiologyModality.CT}
							itemId={enableAi ? study.item.id : null}
						/>
					) : (
						<ImageStackViewer
							key={active.id}
							instances={plainImages}
						/>
					)
				) : (
					<div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
						لا صور مسجّلة في هذه الدراسة
					</div>
				)}
			</div>
		</div>
	);
}

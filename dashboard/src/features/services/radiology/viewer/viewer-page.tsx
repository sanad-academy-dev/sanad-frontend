import { IconBodyScan, IconColumns2, IconHistory, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { useRadiologyPriors } from "@/features/services/radiology/hooks/use-radiology-extras";
import { RadiologyStudyPane } from "@/features/services/radiology/viewer/study-pane";
import { useStudyDetail } from "@/features/services/radiology/viewer/use-study-detail";
import { cn } from "@/lib/utils";
import { LATERALITY_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// صفحة عارض الدراسة — نافذة مستقلة بخلفية داكنة كعوارض PACS: ترويسة بسياق
// الطفل والفحص، ثم جزء العارض. وضع المقارنة يقسم المساحة إلى جزأين:
// الدراسة الحالية بجانب دراسة سابقة لنفس الطفل ونفس الفحص.

const dateLabel = (value: Date | string | null) =>
	value
		? new Date(value).toLocaleDateString("ar-EG", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		: "—";

/** شارة تعلو جزء العارض تُميّز الحالية من السابقة */
function PaneLabel({
	tone,
	title,
	subtitle,
	onClose,
}: {
	tone: "current" | "prior";
	title: string;
	subtitle: string;
	onClose?: () => void;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-2 rounded-md border px-3 py-1.5",
				tone === "current"
					? "border-indigo-500/40 bg-indigo-600/15"
					: "border-amber-500/40 bg-amber-600/15",
			)}
		>
			<div className="flex min-w-0 flex-col">
				<span className="truncate text-xs font-semibold">{title}</span>
				<span
					className="truncate text-[11px] tabular-nums text-neutral-400"
					dir="ltr"
				>
					{subtitle}
				</span>
			</div>
			{onClose && (
				<button
					type="button"
					aria-label="إغلاق المقارنة"
					onClick={onClose}
					className="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
				>
					<IconX className="size-4" />
				</button>
			)}
		</div>
	);
}

export function RadiologyStudyViewer({ studyId }: { studyId: string }) {
	const { study, isLoading, isError } = useStudyDetail(studyId);
	// الدراسة السابقة المعروضة للمقارنة — null يعني عرضًا مفردًا
	const [compareStudyId, setCompareStudyId] = useState<string | null>(null);

	// الفحوصات السابقة: نفس الطفل ونفس الفحص بعينه (يقيّدها الخادم)
	const { priors } = useRadiologyPriors(study?.item.id ?? null, !!study);
	// كل دراسة تحمل صورًا تُعرض خيارًا مستقلًّا. الفحص الواحد قد يضم أكثر من
	// دراسة (صور عادية مرفوعة ثم سلسلة DICOM كاملة مثلًا)؛ الاكتفاء بأولاها
	// كان يُخفي السلسلة الحقيقية ويعرض صورة واحدة مكانها.
	const comparable = priors.flatMap((prior) =>
		prior.studies
			.map((study) => ({
				prior,
				study,
				images: study.series.reduce((sum, se) => sum + se.instances.length, 0),
			}))
			.filter((row) => row.images > 0)
			// الأغنى صورًا أولًا داخل الفحص الواحد — هي الدراسة المقصودة عادةً
			.sort((a, b) => b.images - a.images),
	);

	if (isLoading) {
		return (
			<div className="flex h-full min-h-0 flex-1 items-center justify-center bg-neutral-950 text-sm text-neutral-400">
				جارٍ تحميل الدراسة...
			</div>
		);
	}

	if (isError || !study) {
		return (
			<div className="flex h-full min-h-0 flex-1 items-center justify-center bg-neutral-950 text-sm text-red-400">
				تعذّر جلب الدراسة — تحقّق من تسجيل الدخول وصلاحية الرابط
			</div>
		);
	}

	const item = study.item;
	const selected = comparable.find((row) => row.study.id === compareStudyId) ?? null;

	return (
		<div
			dir="rtl"
			className="flex h-full min-h-0 flex-1 flex-col gap-3 bg-neutral-950 p-3 text-white"
		>
			{/* الترويسة — سياق الطفل والفحص كما يُطبع على الدراسة */}
			<header className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2">
				<div className="flex min-w-0 items-center gap-2">
					<IconBodyScan className="size-5 shrink-0 text-indigo-400" />
					<div className="flex min-w-0 flex-col">
						<span className="truncate text-sm font-bold">
							{item.order.patient.name}
							<span className="ms-2 text-xs font-normal tabular-nums text-neutral-400">
								{item.order.patient.code}
							</span>
						</span>
						<span className="truncate text-xs text-neutral-400">
							{[
								item.order.patient.animalType?.arName,
								item.order.patient.age != null ? `${item.order.patient.age} سنة` : null,
								item.order.owner.name,
							]
								.filter(Boolean)
								.join(" · ")}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{/* المقارنة — الخيارات نفس الفحص لنفس الطفل فقط */}
					{comparable.length > 0 && (
						<label className="flex items-center gap-1.5 text-xs">
							<IconColumns2 className="size-4 shrink-0 text-amber-400" />
							<span className="sr-only">مقارنة بدراسة سابقة</span>
							{/* عنصر أصلي: القائمة المنقولة لا ترث السمة الداكنة ولا الاتجاه */}
							<select
								value={compareStudyId ?? ""}
								onChange={(e) => setCompareStudyId(e.target.value || null)}
								className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-white"
							>
								<option value="">مقارنة بدراسة سابقة…</option>
								{comparable.map(({ prior, study: priorStudy, images }) => (
									<option
										key={priorStudy.id}
										value={priorStudy.id}
									>
										{dateLabel(priorStudy.studyDate ?? prior.completedAt ?? prior.createdAt)} —{" "}
										{prior.accession}
										{priorStudy.description ? ` · ${priorStudy.description}` : ""} ({images}{" "}
										صورة)
									</option>
								))}
							</select>
						</label>
					)}

					<div className="flex min-w-0 flex-col items-end text-end">
						<span className="truncate text-sm font-semibold">
							{item.service.name}
							{item.laterality !== "NONE" && (
								<span className="ms-1 text-xs font-normal text-neutral-400">
									({LATERALITY_LABELS[item.laterality]})
								</span>
							)}
						</span>
						<span
							className="text-xs tabular-nums text-neutral-400"
							dir="ltr"
						>
							{item.accession} · {MODALITY_META[item.modality].dicomCode} ·{" "}
							{dateLabel(study.studyDate ?? study.createdAt)}
						</span>
					</div>
				</div>
			</header>

			{item.order.clinicalInfo && (
				<p className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs text-neutral-300">
					<span className="font-semibold text-neutral-100">السبب السريري: </span>
					{item.order.clinicalInfo}
				</p>
			)}

			{/* بلا مقارنة: جزء واحد بعرض كامل. مع المقارنة: الحالية يمينًا
			    والسابقة يسارًا — ترتيب القراءة العربي من الأحدث إلى الأقدم */}
			<div className="flex min-h-0 flex-1 gap-3">
				<RadiologyStudyPane
					studyId={studyId}
					compact={!!selected}
					label={
						selected ? (
							<PaneLabel
								tone="current"
								title="الدراسة الحالية"
								subtitle={`${item.accession} · ${dateLabel(study.studyDate ?? study.createdAt)}`}
							/>
						) : undefined
					}
				/>

				{selected && (
					<RadiologyStudyPane
						// إعادة التركيب عند تبديل الدراسة السابقة تبني مكدّسًا نظيفًا
						key={selected.study.id}
						studyId={selected.study.id}
						compact
						enableAi={false}
						label={
							<PaneLabel
								tone="prior"
								title="دراسة سابقة"
								subtitle={`${selected.prior.accession} · ${dateLabel(
									selected.study.studyDate ??
										selected.prior.completedAt ??
										selected.prior.createdAt,
								)}`}
								onClose={() => setCompareStudyId(null)}
							/>
						}
					/>
				)}
			</div>

			{/* تقرير الدراسة السابقة — الصورة وحدها لا تكفي للمقارنة */}
			{selected?.prior.report?.impression && (
				<p className="rounded-md border border-amber-500/30 bg-amber-600/10 px-4 py-2 text-xs text-neutral-200">
					<span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
						<IconHistory className="size-3.5" />
						انطباع الدراسة السابقة:
					</span>{" "}
					{selected.prior.report.impression}
				</p>
			)}
		</div>
	);
}

// صفحة العارض المستقلة (المسار) — الجسم نفسه بملء النافذة
export function RadiologyViewerPage({ studyId }: { studyId: string }) {
	return (
		<div className="flex h-svh flex-col bg-neutral-950">
			<RadiologyStudyViewer studyId={studyId} />
		</div>
	);
}

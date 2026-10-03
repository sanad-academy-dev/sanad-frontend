import {
	IconBolt,
	IconChevronRight,
	IconDownload,
	IconId,
	IconListCheck,
	IconMapPin,
	IconSearch,
	IconSparkles,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import {
	ViewGridIcon,
	ViewListIcon,
	ViewOptionsMenu,
} from "@/components/common/view-options-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CandidateDetailSheet } from "@/features/services/staff/components/jobs/candidate-detail-sheet";
import { InterviewDialog } from "@/features/services/staff/components/jobs/interview-dialog";
import { InterviewPrejoinDialog } from "@/features/services/staff/components/jobs/interview-prejoin-dialog";
import { JobActivityLog } from "@/features/services/staff/components/jobs/job-activity-log";
import { JobCandidatesTable } from "@/features/services/staff/components/jobs/job-candidates-table";
import { JobInfoPanel } from "@/features/services/staff/components/jobs/job-info-panel";
import { JobPipelineStrip } from "@/features/services/staff/components/jobs/job-pipeline-strip";
import { JobStatsRow } from "@/features/services/staff/components/jobs/job-stats-row";
import {
	type BoardCandidate,
	JobsBoard,
	jobCandidates,
} from "@/features/services/staff/components/jobs/jobs-board";
import { jobStageCounts, PIPELINE_STAGES } from "@/features/services/staff/data/job-pipeline";
import type { PublishedJob } from "@/features/services/staff/types/jobs.types";
import { interviewRoomCode } from "@/features/services/staff/utils/interview-room";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { cn } from "@/lib/utils";

// تبويبات صفحة الوظيفة — الترتيب هو ترتيب DOM في RTL: «المرشحون» يمينًا
const DETAIL_TABS = [
	{ key: "candidates", label: "المرشحون" },
	{ key: "info", label: "المعلومات" },
	{ key: "activity", label: "سجل النشاط" },
] as const;

type JobDetailTab = (typeof DETAIL_TABS)[number]["key"];

// طرق عرض المرشّحين — الترتيب هو ترتيب DOM في RTL: «جدول» يمينًا و«قائمة» (اللوحة) يسارًا
const CANDIDATES_VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "board" as const, label: "قائمة", Icon: ViewGridIcon },
];

type CandidatesView = (typeof CANDIDATES_VIEW_OPTIONS)[number]["value"];

// مجموعات تصفية المرشّحين (حالة واجهة فقط)
type CandidateFilterKey = "stage" | "city" | "nationality";

// تفاصيل وظيفة واحدة: ترويسة في الهيدر + إحصائيات + مرشّحو الوظيفة
export function JobDetailView({ job, onBack }: { job: PublishedJob; onBack: () => void }) {
	const [tab, setTab] = useState<JobDetailTab>("candidates");
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	const [search, setSearch] = useState("");
	const [view, setView] = useState<CandidatesView>("board");
	const [oldestFirst, setOldestFirst] = useState(false);
	// المرشّح المفتوح في لوحة التفاصيل (تُفتح من يسار الشاشة)
	const [candidate, setCandidate] = useState<BoardCandidate | null>(null);
	// المرشّح المُراد جدولة مقابلة له — يفتح حوار «إنشاء مقابلة»
	const [interviewFor, setInterviewFor] = useState<BoardCandidate | null>(null);
	// المرشّح الذي بدأت معه مقابلة عبر اتصال — يفتح شاشة الاستعداد للمكالمة
	const [callFor, setCallFor] = useState<BoardCandidate | null>(null);
	const [filters, setFilters] = useState<Record<CandidateFilterKey, string[]>>({
		stage: [],
		city: [],
		nationality: [],
	});
	const { setTakeover } = usePageHeaderTakeover();
	const counts = jobStageCounts(job.code);

	// نستولي على بداية الهيدر طوال وجود الصفحة، ونُعيدها كما كانت عند الرجوع
	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
		setTakeover(true);
		return () => setTakeover(false);
	}, [setTakeover]);

	// إحصائيات الوظيفة مشتقّة من مراحل خط التوظيف الخاص بها
	const stats = [
		{ title: "إجمالي الطلبات", value: String(counts.reduce((sum, n) => sum + n, 0)) },
		{ title: "قيد المعالجة", value: String(counts[1] + counts[2] + counts[3]) },
		{ title: "تم التعيين", value: String(counts[4]) },
		{ title: "مرفوضة", value: String(counts[5]) },
	];

	const toggleFilter = (key: CandidateFilterKey, value: string) =>
		setFilters((prev) => ({
			...prev,
			[key]: prev[key].includes(value)
				? prev[key].filter((v) => v !== value)
				: [...prev[key], value],
		}));

	const allCandidates = jobCandidates(job.code);

	const filterGroups: FilterGroup[] = [
		{
			key: "stage",
			label: "المرحلة",
			Icon: IconListCheck,
			options: PIPELINE_STAGES.map((s) => ({ value: s.key, label: s.label })),
			selected: filters.stage,
			onToggle: (v) => toggleFilter("stage", v),
		},
		{
			key: "city",
			label: "المدينة",
			Icon: IconMapPin,
			options: [...new Set(allCandidates.map((c) => c.city))].map((v) => ({
				value: v,
				label: v,
			})),
			selected: filters.city,
			onToggle: (v) => toggleFilter("city", v),
		},
		{
			key: "nationality",
			label: "الجنسية",
			Icon: IconId,
			options: [...new Set(allCandidates.map((c) => c.nationality))].map((v) => ({
				value: v,
				label: v,
			})),
			selected: filters.nationality,
			onToggle: (v) => toggleFilter("nationality", v),
		},
	];

	const q = search.trim().toLowerCase();
	const visibleCandidates = allCandidates
		.filter(
			(c) => !q || c.name.toLowerCase().includes(q) || c.jobCode.toLowerCase().includes(q),
		)
		.filter((c) => filters.stage.length === 0 || filters.stage.includes(c.stageKey))
		.filter((c) => filters.city.length === 0 || filters.city.includes(c.city))
		.filter(
			(c) => filters.nationality.length === 0 || filters.nationality.includes(c.nationality),
		);

	const orderedCandidates = oldestFirst ? [...visibleCandidates].reverse() : visibleCandidates;

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* ترويسة الوظيفة تُحقن في الهيدر العلوي بدل زر الشريط الجانبي والمسار */}
			{slot &&
				createPortal(
					// ترتيب DOM في RTL: سهم الرجوع يمينًا، ثم العنوان والفاصل والمبدّل
					<div
						className="flex h-[27px] items-center gap-1"
						dir="rtl"
					>
						<button
							type="button"
							onClick={onBack}
							aria-label="رجوع إلى قائمة الوظائف"
							className="flex size-4 shrink-0 items-center justify-center text-[#08090A]"
						>
							<IconChevronRight className="size-4" />
						</button>

						<div className="flex items-center gap-3">
							<span className="whitespace-nowrap text-[12px] font-bold leading-[18px] text-[#08090A]">
								وظيفة {job.title || "—"}
							</span>
							<span className="h-4 w-px bg-[#E5E5E5]" />

							{/* مبدّل تبويبات التفاصيل */}
							<div className="flex h-[27px] items-center gap-[1.5px] rounded-[5px] bg-[#F0F0F0] p-[1.5px]">
								{DETAIL_TABS.map(({ key, label }) => (
									<button
										key={key}
										type="button"
										onClick={() => setTab(key)}
										aria-pressed={tab === key}
										className={cn(
											"flex h-6 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] px-[7.5px] py-[3px] text-[11px] font-medium leading-4 transition-colors",
											tab === key
												? "border-[0.75px] border-[#E5E5E5] bg-white text-[#08090A]"
												: "text-[#9B9B9D] hover:text-[#08090A]",
										)}
									>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>,
					slot,
				)}

			{/* الإحصائيات وشريط الأدوات والمراحل تخصّ المرشّحين فقط */}
			{tab === "candidates" && (
				<>
					<JobStatsRow stats={stats} />

					<div className="flex flex-wrap items-center gap-3 border-b border-[#D8D8D8] px-3 py-2">
						<div className="flex flex-wrap items-center gap-2">
							<div className="relative w-[380px] max-w-full">
								<IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9D]" />
								<Input
									placeholder="ابحث عن المرشّح بالاسم، المعرف..."
									className="h-[30px] ps-9 pe-[42px] text-xs"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
								{/* ترتيب DOM في RTL: الاختصار أولًا ⇒ يمينًا، وزر البحث الذكي على يساره */}
								<div className="absolute end-1.5 top-1/2 flex -translate-y-1/2 items-center gap-[3px]">
									<span className="flex h-[16.5px] items-center rounded-[2px] border-[0.75px] border-[#E5E5E5] bg-[#F0F0F0] px-[3px] py-[1.5px] opacity-70">
										<span className="text-[8px] leading-[12px] text-[#9B9B9D]">/</span>
									</span>
									<button
										type="button"
										aria-label="بحث ذكي"
										className="flex size-4 items-center justify-center rounded-[4px] opacity-60"
									>
										<IconBolt className="size-4 text-[#4F6AE0]" />
									</button>
								</div>
							</div>

							<span className="h-6 w-px bg-[#E5E5E5]" />

							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 gap-1.5 text-[11px]"
							>
								<IconSparkles className="size-3.5" />
								نساعدك
							</Button>
							<FiltersMenu
								groups={filterGroups}
								size="sm"
								className="h-7"
							/>
							<ViewOptionsMenu
								options={CANDIDATES_VIEW_OPTIONS}
								view={view}
								onViewChange={setView}
								oldestFirst={oldestFirst}
								onOldestFirstChange={setOldestFirst}
								size="sm"
								className="h-7"
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 gap-1.5 text-[11px]"
							>
								<IconDownload className="size-3.5" />
								تصدير
							</Button>
						</div>
					</div>

					<div className="border-b border-[#D8D8D8] px-3 py-2">
						<JobPipelineStrip counts={counts} />
					</div>
				</>
			)}

			{/* محتوى التبويب النشط */}
			{tab === "candidates" ? (
				view === "board" ? (
					<JobsBoard
						jobCode={job.code}
						candidates={orderedCandidates}
						stages={filters.stage}
						onSelect={setCandidate}
						onAction={(c) => c.stageKey === "interview" && setInterviewFor(c)}
					/>
				) : (
					<JobCandidatesTable
						candidates={orderedCandidates}
						onSelect={setCandidate}
					/>
				)
			) : tab === "info" ? (
				<JobInfoPanel job={job} />
			) : (
				<JobActivityLog scope={job.code} />
			)}

			{/* لوحة تفاصيل المرشّح */}
			<CandidateDetailSheet
				candidate={candidate}
				jobTitle={job.title}
				onClose={() => setCandidate(null)}
				onScheduleInterview={setInterviewFor}
			/>

			{/* حوار «إنشاء مقابلة» وسط الشاشة */}
			<InterviewDialog
				candidate={interviewFor}
				candidates={allCandidates}
				onClose={() => setInterviewFor(null)}
				onStartCall={(c) => setCallFor(c)}
			/>

			{/* شاشة الاستعداد قبل الانضمام (مقابلة عبر اتصال) */}
			<InterviewPrejoinDialog
				open={!!callFor}
				roomCode={callFor ? interviewRoomCode(callFor.jobCode, callFor.id) : null}
				candidateName={callFor?.name ?? ""}
				onClose={() => setCallFor(null)}
			/>
		</div>
	);
}

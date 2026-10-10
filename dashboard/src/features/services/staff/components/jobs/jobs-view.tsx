import {
	IconActivity,
	IconBuilding,
	IconChevronDown,
	IconChevronLeft,
	IconClock,
	IconDots,
	IconDownload,
	IconMapPin,
	IconPlus,
	IconShare,
	IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useState } from "react";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { TableToolbar } from "@/components/common/table-toolbar";
import {
	ViewGridIcon,
	ViewListIcon,
	ViewOptionsMenu,
} from "@/components/common/view-options-menu";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
	AddJobSheet,
	type JobForm,
} from "@/features/services/staff/components/jobs/add-job-sheet";
import { JobDetailView } from "@/features/services/staff/components/jobs/job-detail-view";
import { JobPipelineStrip } from "@/features/services/staff/components/jobs/job-pipeline-strip";
import { JobStatsRow } from "@/features/services/staff/components/jobs/job-stats-row";
import {
	jobFilledPositions,
	jobStageCounts,
} from "@/features/services/staff/data/job-pipeline";
import type { PublishedJob } from "@/features/services/staff/types/jobs.types";
import { exportJobsCsv } from "@/features/services/staff/utils/export-jobs";

// طرق عرض الوظائف — الترتيب هو ترتيب DOM في RTL: «جدول» يمينًا و«قائمة» يسارًا
const VIEW_OPTIONS = [
	{ value: "table" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "cards" as const, label: "قائمة", Icon: ViewGridIcon },
];

type ViewMode = (typeof VIEW_OPTIONS)[number]["value"];

// مجموعات تصفية الوظائف (حالة واجهة فقط) — «الموقع» يجمع المدينة أو الدولة
type JobFilterKey = "department" | "employmentType" | "location";

const jobFilterValue = (job: PublishedJob, key: JobFilterKey) =>
	key === "location" ? job.city || job.country : job[key];

// أعمدة جدول الوظائف (RTL: من اليمين لليسار) — عدا العمود الأول (اسم الوظيفة / المعرّف)
const JOB_COLUMNS = [
	"القسم",
	"النوع",
	"الموقع",
	"الوظائف المتاحة",
	"الحالة",
	"تاريخ الانشاء",
	"الاجراءات",
] as const;

// بطاقات إحصائية (قيم عيّنة مطابقة للتصميم)
const JOB_STATS = [
	{ title: "إجمالي الوظائف", value: "23" },
	{ title: "نشط", value: "16" },
	{ title: "مكتملة", value: "08" },
	{ title: "متوسط التقييم", value: "4/5" },
];

// خلية الوظائف المتاحة: النسبة + قرص تقدّم مصمت 14px (قاعدة رمادية يملؤها قطاع أزرق)
function AvailabilityCell({ filled, total }: { filled: number; total: number }) {
	const pct = total > 0 ? Math.min(filled / total, 1) : 0;
	return (
		// ترتيب DOM في RTL: القرص أولًا ⇒ يمينًا، ثم النسبة يسارًا
		<div className="flex items-end gap-1.5">
			<span
				className="size-3.5 shrink-0 rounded-full bg-[#E5E5E5]"
				// القطاع يبدأ من الأعلى ويدور مع عقارب الساعة — لا ينعكس مع RTL
				style={{ backgroundImage: `conic-gradient(#3B82F6 ${pct * 360}deg, transparent 0)` }}
				aria-hidden="true"
			/>
			<span className="text-[10px] leading-[15px] text-[#08090A] tabular-nums">
				{filled}/{total}
			</span>
		</div>
	);
}

// صف وظيفة واحد في الجدول
function JobRow({ job, onDetails }: { job: PublishedJob; onDetails: () => void }) {
	const total = Number(job.positions) || 0;
	const filled = jobFilledPositions(job.code, total);
	return (
		<tr className="border-b-[0.75px] border-[#D8D8D8] hover:bg-[#FAFAFA]">
			{/* اسم الوظيفة / المعرّف */}
			<td className="h-[34px] ps-3 pe-8">
				<div className="flex items-center gap-3">
					<span className="size-[18px] shrink-0 rounded-[3px] border-[1.5px] border-[#E5E5E5] bg-white" />
					<div className="flex flex-col text-right">
						<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
							{job.title || "—"}
						</span>
						<span className="text-[8px] leading-[12px] text-[#9B9B9D]">#{job.code}</span>
					</div>
				</div>
			</td>
			{/* القسم */}
			<td className="h-[34px] ps-3 pe-8 text-right text-[12px] font-medium text-[#7A5AF8]">
				{job.department || "—"}
			</td>
			{/* النوع */}
			<td className="h-[34px] ps-3 pe-8 text-right text-[12px] font-medium text-[#F97316]">
				{job.employmentType || "—"}
			</td>
			{/* الموقع */}
			<td className="h-[34px] ps-3 pe-8 text-right text-[12px] text-[#08090A]">
				{job.city || job.country || "—"}
			</td>
			{/* الوظائف المتاحة — حشوة نهاية 32px حسب التصميم */}
			<td className="h-[34px] ps-3 pe-8 text-right">
				<AvailabilityCell
					filled={filled}
					total={total}
				/>
			</td>
			{/* الحالة */}
			<td className="h-[34px] ps-3 pe-8 text-right">
				<span className="inline-flex items-center gap-1 rounded-[4px] bg-[#22C55E]/[0.05] px-1.5 py-0.5 text-[10px] text-[#0AA844]">
					<IconChevronDown className="size-2" />
					نشط
				</span>
			</td>
			{/* تاريخ الانشاء */}
			<td className="h-[34px] ps-3 pe-8 text-right text-[10px] text-[#08090A]">
				{format(job.createdAt, "d MMMM yyyy", { locale: arSA })}
			</td>
			{/* الاجراءات */}
			<td className="h-[34px] ps-3 pe-8">
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={onDetails}
						className="flex h-6 items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[10px] text-[#08090A]"
					>
						التفاصيل
						<IconChevronLeft className="size-3.5" />
					</button>
					<button
						type="button"
						className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#161616]"
					>
						<IconDots className="size-3.5" />
					</button>
				</div>
			</td>
		</tr>
	);
}

// بطاقة وظيفة مفصّلة (عرض البطاقات)
function JobCard({ job, onDetails }: { job: PublishedJob; onDetails: () => void }) {
	const total = Number(job.positions) || 0;
	const stageCounts = jobStageCounts(job.code);
	const filled = jobFilledPositions(job.code, total);
	return (
		<div className="flex flex-col gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3">
			{/* الرأس: العنوان والحالة (يمين) + الإجراءات والتاريخ (يسار) */}
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<span className="text-[12px] font-semibold text-[#08090A]">{job.title || "—"}</span>
					{/* الحالة القابلة للتغيير */}
					<span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/[0.05] px-1.5 py-0.5 text-[10px] text-[#0B9F42]">
						<IconChevronDown className="size-2" />
						نشط
						<IconActivity className="size-2" />
					</span>
					{/* شارة النشر */}
					<span className="inline-flex items-center gap-1 rounded-full bg-[#6366F1]/[0.05] px-1.5 py-0.5 text-[10px] text-[#6366F1]">
						نشط
						<IconUser className="size-2" />
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="whitespace-nowrap text-[10px] text-[#6B6B67]">
						أُضيف {format(job.createdAt, "d MMMM yyyy", { locale: arSA })}
					</span>
					<span className="h-3.5 w-px bg-[#E5E5E5]" />
					<button
						type="button"
						className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#161616]"
					>
						<IconDots className="size-3.5" />
					</button>
					<button
						type="button"
						className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#161616]"
					>
						<IconShare className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={onDetails}
						className="flex h-6 items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[10px] text-[#08090A]"
					>
						التفاصيل
						<IconChevronLeft className="size-3.5" />
					</button>
				</div>
			</div>

			{/* بيانات وصفية */}
			<div className="flex items-center gap-2 text-[10px]">
				<span className="whitespace-nowrap text-[#6B6B67]">المعرّف : #{job.code}</span>
				<span className="h-3.5 w-px bg-[#E5E5E5]" />
				<span className="flex items-center gap-1 whitespace-nowrap text-[#08090A]">
					<IconClock className="size-3" />
					{job.employmentType || "—"}
				</span>
				<span className="h-3.5 w-px bg-[#E5E5E5]" />
				<span className="flex items-center gap-1 whitespace-nowrap text-[#08090A]">
					<IconMapPin className="size-3" />
					{job.city || job.country || "—"}
				</span>
				<span className="h-3.5 w-px bg-[#E5E5E5]" />
				<span className="flex items-center gap-1.5 whitespace-nowrap">
					<span className="text-[#6B6B67]">وظائف متاحة :</span>
					<AvailabilityCell
						filled={filled}
						total={total}
					/>
				</span>
			</div>

			{/* مراحل خط التوظيف */}
			<JobPipelineStrip counts={stageCounts} />
		</div>
	);
}

// وظائف عيّنة مؤقتة للعرض (تُحذف عند ربط الـ backend)
const SAMPLE_JOBS: PublishedJob[] = [
	{
		title: "مدرّب",
		department: "الجراحة",
		employmentType: "دوام كامل",
		city: "الرياض",
		country: "السعودية",
		positions: "10",
		closeDate: "2026-08-01",
		workEnv: "حضوري",
		salaryMin: "8000",
		salaryMax: "12000",
		currency: "ر.س",
		payType: "شهري",
		description: "",
		undisclosed: false,
		id: "sample-1",
		code: "2541",
		createdAt: new Date("2026-04-14T00:00:00"),
	},
	{
		title: "فني مختبر",
		department: "المختبر",
		employmentType: "دوام جزئي",
		city: "جدة",
		country: "السعودية",
		positions: "4",
		closeDate: "2026-07-20",
		workEnv: "حضوري",
		salaryMin: "5000",
		salaryMax: "7000",
		currency: "ر.س",
		payType: "شهري",
		description: "",
		undisclosed: false,
		id: "sample-2",
		code: "2542",
		createdAt: new Date("2026-04-10T00:00:00"),
	},
	{
		title: "ممرض",
		department: "الطوارئ",
		employmentType: "عقد مؤقت",
		city: "الدمام",
		country: "السعودية",
		positions: "6",
		closeDate: "2026-07-30",
		workEnv: "هجين",
		salaryMin: "",
		salaryMax: "",
		currency: "",
		payType: "",
		description: "",
		undisclosed: true,
		id: "sample-3",
		code: "2543",
		createdAt: new Date("2026-04-08T00:00:00"),
	},
	{
		title: "موظف استقبال",
		department: "التنمية البشرية",
		employmentType: "دوام كامل",
		city: "مكة",
		country: "السعودية",
		positions: "2",
		closeDate: "2026-08-05",
		workEnv: "حضوري",
		salaryMin: "4000",
		salaryMax: "5500",
		currency: "ر.س",
		payType: "شهري",
		description: "",
		undisclosed: false,
		id: "sample-4",
		code: "2544",
		createdAt: new Date("2026-04-05T00:00:00"),
	},
];

export function JobsView({
	onDetailOpenChange,
}: {
	onDetailOpenChange?: (open: boolean) => void;
}) {
	const [search, setSearch] = useState("");
	const [addOpen, setAddOpen] = useState(false);
	const [jobs, setJobs] = useState<PublishedJob[]>(SAMPLE_JOBS);
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const [oldestFirst, setOldestFirst] = useState(false);
	// الوظيفة المفتوحة تفاصيلها — تعرض لوحة طلبات التوظيف الخاصة بها بدل القائمة
	const [detailJobId, setDetailJobId] = useState<string | null>(null);
	const [filters, setFilters] = useState<Record<JobFilterKey, string[]>>({
		department: [],
		employmentType: [],
		location: [],
	});

	const toggleFilter = (key: JobFilterKey, value: string) =>
		setFilters((prev) => ({
			...prev,
			[key]: prev[key].includes(value)
				? prev[key].filter((v) => v !== value)
				: [...prev[key], value],
		}));

	// خيارات كل مجموعة مشتقّة من الوظائف الموجودة فعلًا
	const optionsOf = (key: JobFilterKey) =>
		[...new Set(jobs.map((j) => jobFilterValue(j, key)).filter(Boolean))].map((v) => ({
			value: v,
			label: v,
		}));

	const filterGroups: FilterGroup[] = [
		{
			key: "department",
			label: "القسم",
			Icon: IconBuilding,
			options: optionsOf("department"),
			selected: filters.department,
			onToggle: (v) => toggleFilter("department", v),
		},
		{
			key: "employmentType",
			label: "النوع",
			Icon: IconClock,
			options: optionsOf("employmentType"),
			selected: filters.employmentType,
			onToggle: (v) => toggleFilter("employmentType", v),
		},
		{
			key: "location",
			label: "الموقع",
			Icon: IconMapPin,
			options: optionsOf("location"),
			selected: filters.location,
			onToggle: (v) => toggleFilter("location", v),
		},
	];

	// نشر وظيفة جديدة: تُضاف لأعلى الجدول مع معرّف وتاريخ مُولّدين
	const handlePublish = (job: JobForm) => {
		setJobs((prev) => [
			{
				...job,
				id: crypto.randomUUID(),
				code: String(Math.floor(1000 + Math.random() * 9000)),
				createdAt: new Date(),
			},
			...prev,
		]);
	};

	// تصفية حسب البحث ثم مجموعات «التصفية» ثم ترتيب حسب تاريخ الإنشاء
	const visibleJobs = jobs
		.filter((j) => {
			const q = search.trim().toLowerCase();
			if (!q) return true;
			return (
				j.title.toLowerCase().includes(q) ||
				j.code.toLowerCase().includes(q) ||
				j.department.toLowerCase().includes(q)
			);
		})
		.filter((j) =>
			filterGroups.every(
				(g) =>
					g.selected.length === 0 ||
					g.selected.includes(jobFilterValue(j, g.key as JobFilterKey)),
			),
		)
		.sort((a, b) =>
			oldestFirst
				? a.createdAt.getTime() - b.createdAt.getTime()
				: b.createdAt.getTime() - a.createdAt.getTime(),
		);

	const detailJob = jobs.find((j) => j.id === detailJobId);

	// تبويبات الموارد البشرية تختفي أثناء فتح وظيفة وترجع عند الرجوع أو مغادرة الصفحة
	useEffect(() => {
		onDetailOpenChange?.(!!detailJob);
		return () => onDetailOpenChange?.(false);
	}, [detailJob, onDetailOpenChange]);

	if (detailJob) {
		return (
			<JobDetailView
				job={detailJob}
				onBack={() => setDetailJobId(null)}
			/>
		);
	}

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			<AddJobSheet
				open={addOpen}
				onClose={() => setAddOpen(false)}
				onPublish={handlePublish}
			/>

			{/* بطاقات إحصائية */}
			<JobStatsRow stats={JOB_STATS} />

			{/* شريط الأدوات */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن المتقدم بالاسم، المعرف..."
				searchClassName="w-[380px]"
				searchValue={search}
				onSearchChange={setSearch}
				// نفس ترتيب صفحة الموظفين: [التصفية] [العرض] [تصدير] بمقاس xs موحّد
				buttonSize="xs"
				showFilter={false}
				showView={false}
				showExport={false}
				leftExtra={
					<>
						<FiltersMenu groups={filterGroups} />
						<ViewOptionsMenu
							options={VIEW_OPTIONS}
							view={viewMode}
							onViewChange={setViewMode}
							oldestFirst={oldestFirst}
							onOldestFirstChange={setOldestFirst}
						/>
						{/* ترتيب DOM في RTL: بعد «العرض» فيظهر على يساره */}
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={() => exportJobsCsv(visibleJobs)}
							disabled={visibleJobs.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
					</>
				}
				actions={
					<Button
						type="button"
						size="sm"
						className="h-[30px] gap-1.5 text-xs font-bold"
						onClick={() => setAddOpen(true)}
					>
						<IconPlus className="size-3.5" />
						إضافة وظيفة جديدة
					</Button>
				}
			/>

			{/* المحتوى: حالة فارغة / جدول / بطاقات */}
			{jobs.length === 0 ? (
				<div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-white py-16">
					<div className="flex flex-col items-center gap-2">
						<img
							src="/jobs-empty.svg"
							alt=""
							width={356}
							height={252}
							className="h-[252px] w-[356px] max-w-full object-contain"
						/>
						<div className="flex w-[356px] max-w-full flex-col items-end gap-4">
							<div className="flex flex-col gap-1 text-right">
								<h2 className="text-[14px] font-bold leading-[27px] text-[#08090A]">
									لا يوجد وظائف حتى الآن
								</h2>
								<p className="text-[12px] font-medium leading-[18px] text-[#08090A]">
									أضف المدرّبين وأرسل دعوات لهم للانضمام، لبناء فريق الأكاديمية وتمكين إدارة
									الزيارات، الجلسات، وسجلات الأطفال بشكل متكامل.
								</p>
							</div>
							<Button
								type="button"
								className="h-[37px] gap-2 rounded-[4px] text-[12px]"
								onClick={() => setAddOpen(true)}
							>
								إضافة أول مدرّب
								<Kbd className="text-white">N ثم D</Kbd>
							</Button>
						</div>
					</div>
				</div>
			) : viewMode === "table" ? (
				/* عرض الجدول */
				<div className="flex min-h-0 flex-1 flex-col overflow-auto bg-white">
					{/* أعمدة متساوية العرض (206px لكل عمود في التصميم عند 1648px) */}
					<table className="w-full table-fixed border-collapse">
						<thead className="sticky top-0 z-10 bg-white">
							<tr className="border-b-[0.75px] border-[#D8D8D8]">
								{/* العمود الوحيد الذي يحمل مربع التحديد — مربّع 18px يمين التسمية */}
								<th className="h-[34px] ps-3 pe-8 text-right">
									<div className="flex items-center gap-3">
										<span className="size-[18px] shrink-0 rounded-[3px] border-[1.5px] border-[#E5E5E5] bg-white" />
										<span className="text-[12px] font-semibold leading-[18px] text-[#5C5C5E]">
											اسم الوظيفة / المعرّف
										</span>
									</div>
								</th>
								{JOB_COLUMNS.map((col) => (
									<th
										key={col}
										className="h-[34px] ps-3 pe-8 text-right text-[12px] font-semibold leading-[18px] text-[#5C5C5E]"
									>
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{visibleJobs.map((job) => (
								<JobRow
									key={job.id}
									job={job}
									onDetails={() => setDetailJobId(job.id)}
								/>
							))}
						</tbody>
					</table>
				</div>
			) : (
				/* عرض البطاقات */
				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto bg-[#F5F5F5] p-3">
					{visibleJobs.map((job) => (
						<JobCard
							key={job.id}
							job={job}
							onDetails={() => setDetailJobId(job.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

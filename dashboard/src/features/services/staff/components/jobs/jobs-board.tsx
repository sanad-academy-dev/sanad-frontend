import {
	type Icon,
	IconBriefcase,
	IconCalendar,
	IconCalendarEvent,
	IconCircleX,
	IconClipboardList,
	IconDots,
	IconFileDescription,
	IconId,
	IconListCheck,
	IconMapPin,
	IconMessage,
	IconPlus,
	IconUserCheck,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { jobStageCounts } from "@/features/services/staff/data/job-pipeline";

// مرشّح واحد في اللوحة (بيانات عيّنة — لا يوجد ربط خلفي بعد)
type Candidate = {
	id: string;
	name: string;
	jobCode: string;
	appliedDate: string;
	nationality: string;
	city: string;
	experience: string;
	stage: number;
	stages: number;
	reviewer: string;
	comments: number;
};

// إجراء أسفل بطاقة المرشّح حسب العمود
type ColumnAction =
	| { kind: "primary"; label: string; icon: ComponentType<{ className?: string }> }
	| { kind: "reject-primary"; label: string }
	| { kind: "banner"; label: string };

type BoardColumn = {
	key: string;
	label: string;
	color: string;
	icon: Icon;
	count: number;
	action: ColumnAction;
};

// أعمدة اللوحة (RTL: من اليمين لليسار)
const BOARD_COLUMNS: BoardColumn[] = [
	{
		key: "applications",
		label: "طلبات التوظيف",
		color: "#08090A",
		icon: IconClipboardList,
		count: 23,
		action: { kind: "primary", label: "إضافة للقائمة المختصرة", icon: IconPlus },
	},
	{
		key: "shortlist",
		label: "القائمة المختصرة",
		color: "#08090A",
		icon: IconListCheck,
		count: 12,
		action: { kind: "primary", label: "جدولة مقابلة", icon: IconCalendarEvent },
	},
	{
		key: "interview",
		label: "المقابلة",
		color: "#F59E0B",
		icon: IconCalendarEvent,
		count: 16,
		action: { kind: "reject-primary", label: "تقديم عرض" },
	},
	{
		key: "offer",
		label: "العرض المقدم",
		color: "#6366F1",
		icon: IconFileDescription,
		count: 8,
		action: { kind: "reject-primary", label: "تعيين" },
	},
	{
		key: "hired",
		label: "التعيين",
		color: "#0B9F42",
		icon: IconUserCheck,
		count: 12,
		action: { kind: "primary", label: "إضافة لقائمة الموظفين", icon: IconPlus },
	},
	{
		key: "rejected",
		label: "مرفوضة",
		color: "#FF6467",
		icon: IconCircleX,
		count: 8,
		action: { kind: "banner", label: "لا يستوفي شروط التعيين" },
	},
];

// مرشّح عيّنة مطابق للتصميم
const SAMPLE_CANDIDATE: Omit<Candidate, "id"> = {
	name: "محمد الصالح",
	jobCode: "JOB-01",
	appliedDate: "11/6/2026",
	nationality: "سعودي",
	city: "مكة",
	experience: "3 سنوات",
	stage: 1,
	stages: 4,
	reviewer: "د.معاذ الغامدي",
	comments: 12,
};

const SAMPLE_NAMES = [
	"محمد الصالح",
	"نورة العتيبي",
	"عبدالله القحطاني",
	"سارة الحربي",
	"خالد الزهراني",
	"ريم الدوسري",
	"فيصل السبيعي",
	"لمى الشمري",
];
const SAMPLE_CITIES = ["مكة", "الرياض", "جدة", "الدمام"];
const SAMPLE_NATIONALITIES = ["سعودي", "مصري", "أردني"];

// مرشّح مع مرحلته في اللوحة
export type BoardCandidate = Candidate & {
	stageKey: string;
	stageLabel: string;
	stageColor: string;
};

// مرشّحو وظيفة واحدة — عيّنة ثابتة مشتقّة من معرّف الوظيفة (لا يوجد ربط خلفي بعد)
export function jobCandidates(jobCode: string): BoardCandidate[] {
	const counts = jobStageCounts(jobCode);
	return BOARD_COLUMNS.flatMap((col, ci) =>
		Array.from({ length: Math.min(counts[ci], 4) }, (_, i) => {
			const n = ci * 7 + i;
			return {
				...SAMPLE_CANDIDATE,
				id: `${col.key}-${i}`,
				name: SAMPLE_NAMES[n % SAMPLE_NAMES.length],
				city: SAMPLE_CITIES[n % SAMPLE_CITIES.length],
				nationality: SAMPLE_NATIONALITIES[n % SAMPLE_NATIONALITIES.length],
				experience: `${1 + (n % 6)} سنوات`,
				jobCode: `#${jobCode}`,
				stageKey: col.key,
				stageLabel: col.label,
				stageColor: col.color,
			};
		}),
	);
}

// صف معلومة داخل بطاقة المرشّح: القيمة يسار — الأيقونة والتسمية يمين
function CandidateInfoRow({
	icon: RowIcon,
	label,
	value,
}: {
	icon: Icon;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1">
				<RowIcon className="size-3 text-[#9B9B9D]" />
				<span className="text-[10px] text-[#9B9B9D]">{label}</span>
			</div>
			<span className="text-[10px] font-medium text-[#08090A]">{value}</span>
		</div>
	);
}

// بطاقة مرشّح
function CandidateCard({
	candidate,
	action,
	onSelect,
	onAction,
}: {
	candidate: BoardCandidate;
	action: ColumnAction;
	onSelect: () => void;
	// إجراء العمود الأساسي (مثل «جدولة مقابلة») — يتصرّف حسب مرحلة المرشّح
	onAction?: (candidate: BoardCandidate) => void;
}) {
	const initials = candidate.name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("");
	const pct = Math.round((candidate.stage / candidate.stages) * 100);

	return (
		<div className="relative flex flex-col gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3">
			{/* طبقة شفافة تغطّي البطاقة كلها لتفتح ملف المرشّح — والأزرار فوقها بـ z-20 */}
			<button
				type="button"
				onClick={onSelect}
				aria-label={`فتح ملف المرشّح ${candidate.name}`}
				className="absolute inset-0 z-10 cursor-pointer rounded-[4px] focus-visible:outline-2 focus-visible:outline-[#4F6AE0]"
			/>

			{/* الرأس: الصورة والاسم (يمين) + معرّف الوظيفة (يسار) */}
			<div className="flex items-center justify-between">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EEF0F5] text-[9px] font-semibold text-[#4F6AE0]">
						{initials}
					</span>
					<span className="truncate text-[12px] font-semibold text-[#08090A]">
						{candidate.name}
					</span>
				</div>
				<span className="shrink-0 text-[10px] text-[#9B9B9D]">{candidate.jobCode}</span>
			</div>

			{/* المعلومات */}
			<div className="flex flex-col gap-2">
				<CandidateInfoRow
					icon={IconCalendar}
					label="تاريخ التقديم"
					value={candidate.appliedDate}
				/>
				<CandidateInfoRow
					icon={IconId}
					label="الجنسية"
					value={candidate.nationality}
				/>
				<CandidateInfoRow
					icon={IconMapPin}
					label="المدينة"
					value={candidate.city}
				/>
				<CandidateInfoRow
					icon={IconBriefcase}
					label="سنوات الخبرة"
					value={candidate.experience}
				/>
			</div>

			{/* شريط المرحلة */}
			<div className="flex items-center gap-2">
				<div className="relative h-[3px] flex-1 rounded-full bg-[#E5E5E5]">
					<div
						className="absolute inset-y-0 right-0 rounded-full bg-[#4F6AE0]"
						style={{ width: `${pct}%` }}
					/>
				</div>
				<span className="whitespace-nowrap text-[8px] text-[#9B9B9D]">
					{candidate.stage}/{candidate.stages} مرحلة
				</span>
			</div>

			{/* التذييل: المراجع (يمين) + التعليقات (يسار) */}
			<div className="flex items-center justify-between border-t border-[#E5E5E5] pt-2">
				<div className="flex items-center gap-1.5">
					<span className="size-5 shrink-0 rounded-full bg-[#EEF0F5]" />
					<div className="flex flex-col items-end">
						<span className="text-[10px] font-medium text-[#08090A]">
							{candidate.reviewer}
						</span>
						<span className="text-[8px] text-[#9B9B9D]">المراجع</span>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<IconMessage className="size-3 text-[#9B9B9D]" />
					<span className="text-[10px] text-[#9B9B9D]">{candidate.comments}</span>
				</div>
			</div>

			{/* إجراء العمود */}
			{action.kind === "primary" && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onAction?.(candidate);
					}}
					className="relative z-20 flex h-[30px] w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#6366F1] text-[12px] font-bold text-white"
				>
					<action.icon className="size-4" />
					{action.label}
				</button>
			)}
			{action.kind === "reject-primary" && (
				<div className="relative z-20 flex items-center gap-2">
					<button
						type="button"
						className="flex h-[30px] items-center justify-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-3 text-[12px] text-[#08090A]"
					>
						<IconX className="size-3.5" />
						رفض
					</button>
					<button
						type="button"
						className="flex h-[30px] flex-1 items-center justify-center rounded-[4px] bg-[#6366F1] text-[12px] font-bold text-white"
					>
						{action.label}
					</button>
				</div>
			)}
			{action.kind === "banner" && (
				<div className="flex h-[30px] w-full items-center justify-center rounded-[4px] bg-[#FF6467]/[0.08] text-[12px] font-medium text-[#FF6467]">
					{action.label}
				</div>
			)}
		</div>
	);
}

// عمود مرحلة واحد
function BoardColumnView({
	column,
	cards,
	onSelect,
	onAction,
}: {
	column: BoardColumn;
	cards: BoardCandidate[];
	onSelect: (candidate: BoardCandidate) => void;
	onAction?: (candidate: BoardCandidate) => void;
}) {
	const ColIcon = column.icon;

	return (
		<div className="flex min-w-0 flex-1 shrink-0 flex-col gap-3 border-s-[0.75px] border-[#E5E5E5] ps-2">
			{/* ترويسة العمود */}
			<div className="flex items-end justify-between py-1.5">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1">
						<ColIcon
							className="size-3.5"
							style={{ color: column.color }}
						/>
						<span
							className="text-[12px] font-semibold"
							style={{ color: column.color }}
						>
							{column.label}
						</span>
					</div>
					<span
						className="flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-medium"
						style={{ color: column.color }}
					>
						{column.count}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						className="flex size-3.5 items-center justify-center text-[#08090A]"
					>
						<IconDots className="size-3.5" />
					</button>
					<button
						type="button"
						className="flex size-3.5 items-center justify-center text-[#08090A]"
					>
						<IconPlus className="size-3.5" />
					</button>
				</div>
			</div>

			{/* البطاقات */}
			{cards.map((c) => (
				<CandidateCard
					key={c.id}
					candidate={c}
					action={column.action}
					onSelect={() => onSelect(c)}
					onAction={onAction}
				/>
			))}
		</div>
	);
}

// لوحة طلبات التوظيف لوظيفة واحدة — تُفتح من «التفاصيل»
export function JobsBoard({
	jobCode,
	candidates,
	stages = [],
	onSelect,
	onAction,
}: {
	jobCode: string;
	candidates: BoardCandidate[];
	// مفاتيح المراحل المختارة من التصفية — فارغة تعني كل المراحل
	stages?: string[];
	onSelect: (candidate: BoardCandidate) => void;
	// إجراء البطاقة الأساسي (مثل «جدولة مقابلة» في عمود المقابلة)
	onAction?: (candidate: BoardCandidate) => void;
}) {
	const counts = jobStageCounts(jobCode);
	const columns = BOARD_COLUMNS.filter((c) => stages.length === 0 || stages.includes(c.key));

	return (
		<div className="flex min-h-0 flex-1 gap-2 overflow-auto bg-[#F5F5F5] px-3 py-3">
			{columns.map((col) => (
				<BoardColumnView
					key={col.key}
					column={{ ...col, count: counts[BOARD_COLUMNS.indexOf(col)] }}
					cards={candidates.filter((c) => c.stageKey === col.key)}
					onSelect={onSelect}
					onAction={onAction}
				/>
			))}
		</div>
	);
}

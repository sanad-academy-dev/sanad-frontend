import {
	IconAlignBoxRightMiddle,
	IconArmchair,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconArrowUp,
	IconBriefcase,
	IconCalendar,
	IconChevronLeft,
	IconCopy,
	IconDots,
	IconDownload,
	IconEye,
	IconId,
	IconLink,
	IconListNumbers,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPhoto,
	IconPlus,
	IconSchool,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { JobActivityLog } from "@/features/services/staff/components/jobs/job-activity-log";
import type { BoardCandidate } from "@/features/services/staff/components/jobs/jobs-board";
import { candidateProfile } from "@/features/services/staff/data/candidate-profile";
import { PIPELINE_STAGES } from "@/features/services/staff/data/job-pipeline";
import type { CandidateDocument } from "@/features/services/staff/types/jobs.types";
import { cn } from "@/lib/utils";

// تبويبات لوحة المرشّح — الترتيب هو ترتيب DOM في RTL: «نظرة عامة» يمينًا
const CANDIDATE_TABS = [
	{ key: "overview", label: "نظرة عامة" },
	{ key: "activity", label: "سجل النشاط" },
	{ key: "notes", label: "الملاحظات" },
] as const;

type CandidateTab = (typeof CANDIDATE_TABS)[number]["key"];

// تسميات مسار الطلب داخل اللوحة — أقصر من تسميات أعمدة اللوحة
const PATH_LABELS = [
	"طلبات الوظيفة",
	"القائمة المختصرة",
	"المقابلة",
	"العروض المقدمة",
	"التعيين",
	"الرفض",
] as const;

// لوحة تفاصيل المرشّح — تُفتح من يسار الشاشة عند الضغط على مرشّح في الجدول أو اللوحة
export function CandidateDetailSheet({
	candidate,
	jobTitle,
	onClose,
	onScheduleInterview,
}: {
	candidate: BoardCandidate | null;
	jobTitle: string;
	onClose: () => void;
	// يُستدعى من زر «جدولة مقابلة» الذي يظهر عند وصول المرشّح لمرحلة المقابلة
	onScheduleInterview?: (candidate: BoardCandidate) => void;
}) {
	const [tab, setTab] = useState<CandidateTab>("overview");
	const [expanded, setExpanded] = useState(false);
	const atInterview = candidate?.stageKey === "interview";

	return (
		<Sheet
			open={!!candidate}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setTab("overview");
					setExpanded(false);
					onClose();
				}
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				className={cn(
					"flex w-full flex-col gap-0 p-0",
					expanded ? "sm:max-w-[calc(100vw-1rem)]!" : "sm:max-w-[1017px]!",
				)}
			>
				{candidate && (
					<>
						<SheetTitle className="sr-only">ملف المرشّح {candidate.name}</SheetTitle>

						{/* ─── الترويسة: مسار التنقّل يمينًا والإجراءات يسارًا ─── */}
						<div className="flex h-[30px] shrink-0 items-center gap-2 border-b-[0.75px] border-[#E5E5E5] ps-3 pe-1.5">
							<nav className="flex shrink-0 items-center gap-[5px]">
								<span className="whitespace-nowrap text-[12px] font-bold leading-[14px] text-[#08090A]">
									الوظائف
								</span>
								<span className="h-4 w-px bg-[#E5E5E5]" />
								{/* في RTL: الأيقونة أولًا ⇒ يمين التسمية */}
								<span className="flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold leading-[18px] text-[#4F6AE0]">
									<IconListNumbers className="size-3.5" />
									{candidate.stageLabel}
								</span>
								<span className="h-4 w-px bg-[#E5E5E5]" />
								<span className="font-mono text-[10px] leading-[15px] text-[#9B9B9D]">
									{candidate.jobCode}
								</span>
								<button
									type="button"
									aria-label="خيارات المرشّح"
									className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									<IconDots className="size-3.5" />
								</button>
							</nav>

							<span className="flex-1" />

							<div className="flex shrink-0 items-center gap-1">
								{/* في مرحلة المقابلة يتحوّل الإجراء الأساسي إلى «جدولة مقابلة» (Figma 4073-444224) */}
								<button
									type="button"
									onClick={atInterview ? () => onScheduleInterview?.(candidate) : undefined}
									className="flex h-[18px] items-center gap-1 whitespace-nowrap rounded-[3px] bg-[#4F6AE0] px-1.5 text-[10px] font-medium leading-none text-white"
								>
									{atInterview ? (
										<>
											جدولة مقابلة
											<IconArmchair className="size-2.5" />
										</>
									) : (
										<>
											<IconPlus className="size-2.5" />
											إضافة للقائمة المختصرة
										</>
									)}
								</button>
								<button
									type="button"
									className="flex h-[18px] items-center gap-1 whitespace-nowrap rounded-[3px] bg-[#FF6467]/[0.05] px-1.5 text-[10px] font-medium leading-none text-[#FF6467]"
								>
									<IconX className="size-2.5" />
									رفض
								</button>
								<button
									type="button"
									aria-label="نسخ رابط الطلب"
									className="flex size-6 items-center justify-center rounded-[6px] text-[#6D6E6F] hover:bg-[#F5F5F5]"
								>
									<IconLink className="size-4" />
								</button>
								<button
									type="button"
									aria-label="نسخ بيانات المرشّح"
									className="flex size-6 items-center justify-center rounded-[6px] text-[#6D6E6F] hover:bg-[#F5F5F5]"
								>
									<IconCopy className="size-4" />
								</button>
								<span className="h-4 w-px bg-[#E5E5E5]" />
								<button
									type="button"
									onClick={() => setExpanded((v) => !v)}
									aria-label={expanded ? "تصغير اللوحة" : "تكبير اللوحة"}
									className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									{expanded ? (
										<IconArrowsDiagonalMinimize2 className="size-3" />
									) : (
										<IconArrowsDiagonal className="size-3" />
									)}
								</button>
								<button
									type="button"
									onClick={onClose}
									aria-label="إغلاق"
									className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									<IconX className="size-3.5" />
								</button>
							</div>
						</div>

						{/* ─── التبويبات (شريط مقسّم) ─── */}
						<div className="flex shrink-0 items-center border-b-[0.75px] border-[#E5E5E5] px-3 py-1">
							<div className="flex w-full items-center justify-start gap-[1.5px] rounded-[5px] bg-[#F0F0F0] p-[1.5px]">
								{CANDIDATE_TABS.map((t) => (
									<button
										key={t.key}
										type="button"
										onClick={() => setTab(t.key)}
										aria-pressed={tab === t.key}
										className={cn(
											"flex h-6 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] px-[7.5px] text-[11px] font-medium leading-4 transition-colors",
											tab === t.key
												? "border-[0.75px] border-[#E5E5E5] bg-white text-[#08090A]"
												: "text-[#9B9B9D] hover:text-[#08090A]",
										)}
									>
										{t.label}
									</button>
								))}
							</div>
						</div>

						{/* ─── محتوى التبويب يمينًا و«التفاصيل» يسارًا (Figma: التفاصيل عند x=0) ───
						    في RTL أول عنصر في DOM يظهر يمينًا، فالشريط الجانبي يأتي أخيرًا */}
						<div className="flex min-h-0 flex-1 overflow-hidden">
							{tab === "overview" ? (
								<CandidateOverviewTab candidate={candidate} />
							) : tab === "activity" ? (
								<JobActivityLog scope={candidate.id} />
							) : (
								<CandidateNotesTab />
							)}

							<CandidateSideDetails
								candidate={candidate}
								jobTitle={jobTitle}
							/>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

// صف معلومة في الشريط الجانبي: الأيقونة والتسمية يمينًا والقيمة يسارًا
function SideRow({
	label,
	icon: Icon,
	children,
}: {
	label: string;
	icon: ComponentType<{ className?: string }>;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<span className="flex shrink-0 items-center gap-1 text-[10px] text-[#9B9B9D]">
				<Icon className="size-3 text-[#9B9B9D]" />
				{label}
			</span>
			{children}
		</div>
	);
}

function SideValue({ children }: { children: ReactNode }) {
	return (
		<span className="min-w-0 truncate text-[10px] font-medium text-[#08090A]">{children}</span>
	);
}

// الشريط الجانبي «التفاصيل»
function CandidateSideDetails({
	candidate,
	jobTitle,
}: {
	candidate: BoardCandidate;
	jobTitle: string;
}) {
	const profile = candidateProfile(candidate.id, candidate.name);

	return (
		// الشريط في يسار الحوار، فحدّه الفاصل على حرفه الأيمن (بداية RTL)
		<aside className="w-[242px] shrink-0 overflow-y-auto border-s-[0.75px] border-[#E5E5E5] p-3">
			<h3 className="py-1 text-[12px] font-semibold text-[#08090A]">التفاصيل</h3>

			{/* اسم المرشّح يمينًا وزر التواصل يسارًا */}
			<div className="flex items-center justify-between gap-2 py-1">
				<span className="flex min-w-0 items-center gap-1.5">
					<span className="flex size-3 shrink-0 items-center justify-center rounded-full bg-[#4F6AE0] text-[6px] font-medium text-white">
						{candidate.name.trim()[0]}
					</span>
					<span className="truncate text-[12px] font-medium text-[#08090A]">
						{candidate.name}
					</span>
				</span>
				<span className="flex shrink-0 items-center gap-1">
					<button
						type="button"
						className="flex h-[17px] items-center rounded-[3px] border-[0.75px] border-[#E5E5E5] bg-white px-1 text-[7px] font-medium leading-none text-[#08090A] hover:bg-[#F5F5F5]"
					>
						إرسال رسالة
					</button>
					<IconChevronLeft className="size-3 text-[#08090A]" />
				</span>
			</div>

			<div className="flex flex-col">
				<SideRow
					label="الوظيفة"
					icon={IconBriefcase}
				>
					<SideValue>{jobTitle || "—"}</SideValue>
				</SideRow>
				<SideRow
					label="الهاتف"
					icon={IconPhone}
				>
					{/* جزيرة LTR: الأرقام تُقرأ من اليسار */}
					<span
						dir="ltr"
						className="text-[10px] font-medium tabular-nums text-[#08090A]"
					>
						{profile.phone}
					</span>
				</SideRow>
				<SideRow
					label="البريد"
					icon={IconMail}
				>
					<span
						dir="ltr"
						className="min-w-0 truncate text-[10px] font-medium text-[#08090A]"
					>
						{profile.email}
					</span>
				</SideRow>
				<SideRow
					label="الجنسية"
					icon={IconId}
				>
					<SideValue>{candidate.nationality}</SideValue>
				</SideRow>
				<SideRow
					label="المدينة"
					icon={IconMapPin}
				>
					<SideValue>{candidate.city}</SideValue>
				</SideRow>
				<SideRow
					label="رقم الوظيفة"
					icon={IconListNumbers}
				>
					<span className="font-mono text-[10px] text-[#08090A]">{candidate.jobCode}</span>
				</SideRow>
				<SideRow
					label="تاريخ التقديم"
					icon={IconCalendar}
				>
					<span className="text-[10px] font-medium tabular-nums text-[#08090A]">
						{candidate.appliedDate}
					</span>
				</SideRow>
				<SideRow
					label="المؤهل"
					icon={IconSchool}
				>
					<SideValue>{profile.education}</SideValue>
				</SideRow>
				<SideRow
					label="الخبرة"
					icon={IconAlignBoxRightMiddle}
				>
					<SideValue>{candidate.experience}</SideValue>
				</SideRow>
			</div>
		</aside>
	);
}

// أيقونة الملف — الزاوية المطوية والشارة مثبّتتان على حرفَي الورقة (رسم ثابت في كل الاتجاهات)
function FileIcon({ kind }: { kind: CandidateDocument["kind"] }) {
	return (
		<span className="relative flex size-10 shrink-0 items-center justify-center">
			<span className="h-10 w-[30px] rounded-[2px] border-[1.5px] border-[#D0D5DD]" />
			<span className="absolute left-[6px] top-[1px] size-[8px] border-b-[1.5px] border-r-[1.5px] border-[#D0D5DD] bg-white" />
			{kind === "pdf" ? (
				<span className="absolute bottom-[7px] left-[2px] flex h-[13px] items-center rounded-[2px] bg-[#F04438] px-[3px] text-[8px] font-bold leading-none text-white">
					PDF
				</span>
			) : (
				<span className="absolute bottom-[7px] left-[3px] flex size-[14px] items-center justify-center rounded-[2px] bg-white">
					<IconPhoto className="size-3.5 text-[#4F6AE0]" />
				</span>
			)}
		</span>
	);
}

// بطاقة مستند مرفق: الأيقونة والاسم يمينًا وأزرار التحميل والمعاينة يسارًا
function DocumentRow({ doc }: { doc: CandidateDocument }) {
	return (
		<div className="flex h-[68px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2.5">
			<FileIcon kind={doc.kind} />
			<div className="flex min-w-0 flex-col gap-1">
				<span className="truncate text-[14px] leading-[21px] text-[#08090A]">{doc.name}</span>
				<span className="flex items-center gap-1 text-[12px] leading-[19px] text-[#6B6B67]">
					{doc.size}
					<span className="text-[#A2ACBA]">•</span>
					<span className="text-[#A2ACBA]">{doc.uploadedAt}</span>
				</span>
			</div>

			<span className="flex-1" />

			<button
				type="button"
				aria-label={`تحميل ${doc.name}`}
				className="flex size-8 items-center justify-center rounded-[8px] text-[#08090A] hover:bg-[#F5F5F5]"
			>
				<IconDownload className="size-4" />
			</button>
			<button
				type="button"
				aria-label={`معاينة ${doc.name}`}
				className="flex size-8 items-center justify-center rounded-[8px] text-[#08090A] hover:bg-[#F5F5F5]"
			>
				<IconEye className="size-4" />
			</button>
		</div>
	);
}

// مسار الطلب — الخطوة الأولى يمينًا، والوصلات المكتملة باللون الأساسي
function PathStepper({ stageKey }: { stageKey: string }) {
	const currentIndex = Math.max(
		0,
		PIPELINE_STAGES.findIndex((s) => s.key === stageKey),
	);

	return (
		<ol className="flex items-start">
			{PATH_LABELS.map((label, i) => {
				const current = i === currentIndex;
				const done = i < currentIndex;
				// الوصلة رقم j تربط الخطوة j بما بعدها، وتمتلئ حتى الخطوة الحالية
				const startFilled = i - 1 <= currentIndex && i > 0;
				const endFilled = i <= currentIndex && i < PATH_LABELS.length - 1;

				return (
					<li
						key={label}
						className="flex min-w-0 flex-1 flex-col items-center gap-2"
					>
						{/* الصف: نصف وصلة يمينًا ثم الدائرة ثم نصف وصلة يسارًا */}
						<div className="flex w-full items-center">
							<span
								className={cn(
									"h-[1.5px] flex-1",
									i === 0 ? "bg-transparent" : startFilled ? "bg-[#4F6AE0]" : "bg-[#F0F0F0]",
								)}
							/>
							<span
								className={cn(
									"flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-medium tabular-nums",
									current || done ? "bg-[#4F6AE0] text-white" : "bg-[#F5F5F5] text-[#9B9B9D]",
								)}
							>
								{i + 1}
							</span>
							<span
								className={cn(
									"h-[1.5px] flex-1",
									i === PATH_LABELS.length - 1
										? "bg-transparent"
										: endFilled
											? "bg-[#4F6AE0]"
											: "bg-[#F0F0F0]",
								)}
							/>
						</div>
						<span
							className={cn(
								"px-1 text-center text-[9px] leading-[14px]",
								current ? "font-medium text-[#4F6AE0]" : "text-[#9B9B9D]",
							)}
						>
							{label}
						</span>
					</li>
				);
			})}
		</ol>
	);
}

// تبويب «نظرة عامة»: المستندات المرفقة + المهارات + مسار الطلب
function CandidateOverviewTab({ candidate }: { candidate: BoardCandidate }) {
	const profile = candidateProfile(candidate.id, candidate.name);

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-y-auto p-3">
			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">المستندات المرفقة</h3>
				<div className="flex flex-col gap-3">
					{profile.documents.map((doc) => (
						<DocumentRow
							key={doc.id}
							doc={doc}
						/>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">المهارات</h3>
				<div className="rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
					<div className="flex flex-wrap gap-2">
						{profile.skills.map((skill, i) => (
							<span
								key={`${skill}-${i}`}
								className="flex h-[26px] items-center whitespace-nowrap rounded-[4px] bg-[#F5F5F5] px-2 text-[11px] text-[#08090A]"
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">مسار الطلب</h3>
				<div className="rounded-[4px] border-[0.75px] border-[#E5E5E5] px-4 py-5">
					<PathStepper stageKey={candidate.stageKey} />
				</div>
			</section>
		</div>
	);
}

// تبويب «الملاحظات»: مربّع ملاحظات عن المرشّح
function CandidateNotesTab() {
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
			<h3 className="text-[12px] font-semibold text-[#08090A]">الملاحظات</h3>
			<div className="relative rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5">
				<textarea
					rows={4}
					placeholder="أضف ملاحظة عن المرشّح..."
					className="w-full resize-none bg-transparent text-[11px] leading-[18px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
				/>
				{/* زاوية ثابتة للزر كما في مربّع ملاحظات المنتج */}
				<button
					type="button"
					aria-label="حفظ الملاحظة"
					className="absolute bottom-2.5 left-2.5 flex size-[24px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5] bg-white"
				>
					<IconArrowUp className="size-3.5 text-[#6D6E6F]" />
				</button>
			</div>
		</div>
	);
}

import {
	IconBriefcase,
	IconCalendar,
	IconCalendarX,
	IconCash,
	IconClock,
	IconDotsCircleHorizontal,
	IconFileDescription,
	IconFolder,
	IconGift,
	IconId,
	IconMapPin,
	IconPencil,
	IconSitemap,
	IconSparkles,
	IconUserCog,
	IconUserHeart,
	IconUsersGroup,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import type { ComponentType, ReactNode } from "react";
import { Fragment } from "react";

import type { PublishedJob } from "@/features/services/staff/types/jobs.types";

type IconType = ComponentType<{ className?: string }>;

// بطاقة داخل صفحة المعلومات: العنوان وأيقونته يمينًا، ورابط «تعديل» يسارًا
function InfoCard({
	title,
	Icon,
	rounded = "rounded-[4px]",
	children,
}: {
	title: string;
	Icon: IconType;
	rounded?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={`flex flex-col gap-3 border-[0.75px] border-[#E5E5E5] bg-white p-3 ${rounded}`}
		>
			<div className="flex items-center justify-between gap-3">
				{/* ترتيب DOM في RTL: الأيقونة أولًا ⇒ يمين العنوان */}
				<span className="flex items-center gap-1">
					<Icon className="size-3.5 shrink-0 text-[#08090A]" />
					<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
						{title}
					</span>
				</span>
				<button
					type="button"
					className="flex items-center gap-1 text-[10px] font-medium leading-[15px] text-[#4F6AE0]"
				>
					<IconPencil className="size-3 shrink-0" />
					تعديل
				</button>
			</div>
			{children}
		</div>
	);
}

// صف «تسمية ← قيمة»: التسمية وأيقونتها يمينًا، والقيمة يسارًا
function InfoRow({ label, Icon, value }: { label: string; Icon: IconType; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="flex items-center gap-1">
				<Icon className="size-3 shrink-0 text-[#9B9B9D]" />
				<span className="text-[10px] leading-[15px] text-[#9B9B9D]">{label}</span>
			</span>
			<span className="text-[10px] font-medium leading-[15px] text-[#08090A]">
				{value || "—"}
			</span>
		</div>
	);
}

// مسؤولو التوظيف (عيّنة — لا يوجد ربط خلفي بعد)
const HIRING_MANAGERS = [
	{ id: "1", name: "خالد التبوكي", role: "مدير الموارد البشرية" },
	{ id: "2", name: "معاذ الغامدي", role: "أخصائي توظيف" },
	{ id: "3", name: "ريم الدوسري", role: "مديرة القسم" },
];

// تصنيفات المرشّح المطلوبة (عيّنة — غير موجودة في نموذج الوظيفة بعد)
const JOB_REQUIREMENTS = [
	{ key: "experience", label: "سنوات الخبرة", Icon: IconBriefcase, value: "٣ سنوات" },
	{ key: "nationality", label: "الجنسية", Icon: IconId, value: "سعودي" },
	{ key: "marital", label: "الحالة الاجتماعية", Icon: IconUserHeart, value: "غير محدد" },
	{ key: "gender", label: "الجنس", Icon: IconUsersGroup, value: "غير محدد" },
];

// مزايا الوظيفة (عيّنة)
const JOB_BENEFITS = [
	"تأمين طبي شامل للموظف وعائلته",
	"بدل سكن ومواصلات شهري",
	"إجازة سنوية ٣٠ يومًا مدفوعة",
	"برامج تدريب وتطوير مستمرة",
	"تذاكر سفر سنوية",
];

// تبويب «المعلومات»: عمود عريض (التصنيفات والتوصيف والمزايا) + عمود جانبي للتفاصيل
export function JobInfoPanel({ job }: { job: PublishedJob }) {
	const closeDate = job.closeDate ? new Date(job.closeDate) : null;
	const validClose = closeDate && !Number.isNaN(closeDate.getTime()) ? closeDate : null;
	const day = 1000 * 60 * 60 * 24;
	const daysLeft = validClose
		? Math.max(Math.ceil((validClose.getTime() - Date.now()) / day), 0)
		: null;
	const totalDays = validClose
		? Math.max(Math.ceil((validClose.getTime() - job.createdAt.getTime()) / day), 1)
		: null;
	const elapsedPct =
		totalDays && daysLeft !== null
			? Math.min(Math.max(((totalDays - daysLeft) / totalDays) * 100, 0), 100)
			: 0;

	const salary = job.undisclosed
		? "غير معلن"
		: [job.salaryMin, job.salaryMax].filter(Boolean).join(" – ");

	return (
		<div className="min-h-0 flex-1 overflow-auto bg-[#F5F5F5] p-3">
			{/* ترتيب DOM في RTL: العمود العريض يمينًا والعمود الجانبي يسارًا */}
			<div className="flex items-start gap-3">
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<InfoCard
						title="التصنيفات"
						Icon={IconSparkles}
						rounded="rounded-[6px]"
					>
						{/* حشوة 50px من جهة البداية و32px من النهاية، وفاصل 1×16 بين كل عنصرين */}
						<div className="flex h-[33px] items-center justify-center gap-[31px] ps-[50px] pe-8">
							{JOB_REQUIREMENTS.map(({ key, label, Icon, value }, i) => (
								<Fragment key={key}>
									{i > 0 && <span className="h-4 w-px shrink-0 bg-[#E5E5E5]" />}
									{/* ترتيب DOM في RTL: أيقونة العنصر يمينًا ثم التسمية فوق القيمة */}
									<span className="flex h-[33px] flex-1 items-center gap-2">
										<span className="flex size-5 shrink-0 items-center justify-center rounded-[2px] bg-[#F5F5F5]">
											<Icon className="size-3 text-[#08090A]" />
										</span>
										<span className="flex min-w-0 flex-col items-start justify-center">
											<span className="whitespace-nowrap text-[10px] leading-[15px] text-[#9B9B9D]">
												{label}
											</span>
											<span className="whitespace-nowrap text-[12px] font-medium leading-[18px] text-[#08090A]">
												{value}
											</span>
										</span>
									</span>
								</Fragment>
							))}
						</div>
					</InfoCard>

					<InfoCard
						title="التوصيف"
						Icon={IconFileDescription}
						rounded="rounded-[6px]"
					>
						<p className="whitespace-pre-wrap text-[10px] leading-[18px] text-[#08090A]">
							{job.description || "لا يوجد توصيف لهذه الوظيفة"}
						</p>
					</InfoCard>

					<InfoCard
						title="المزايا"
						Icon={IconGift}
						rounded="rounded-[6px]"
					>
						<ul className="flex list-inside list-disc flex-col gap-1.5 text-[10px] leading-[18px] text-[#08090A]">
							{JOB_BENEFITS.map((b) => (
								<li key={b}>{b}</li>
							))}
						</ul>
					</InfoCard>
				</div>

				<div className="flex w-[347px] shrink-0 flex-col gap-3">
					<InfoCard
						title="تاريخ إغلاق الوظيفة"
						Icon={IconCalendarX}
					>
						<div className="flex flex-col gap-2">
							<InfoRow
								label="تاريخ النشر"
								Icon={IconCalendar}
								value={format(job.createdAt, "d MMMM، yyyy", { locale: arSA })}
							/>
							<InfoRow
								label="تاريخ الإغلاق"
								Icon={IconCalendarX}
								value={
									validClose
										? format(validClose, "d MMMM، yyyy", { locale: arSA })
										: "غير محدد"
								}
							/>
							<div className="flex items-center gap-6">
								<span className="flex items-center gap-1">
									<IconClock className="size-3 shrink-0 text-[#9B9B9D]" />
									<span className="whitespace-nowrap text-[10px] leading-[15px] text-[#9B9B9D]">
										{daysLeft === null ? "بدون موعد إغلاق" : `${daysLeft} يوم متبقية`}
									</span>
								</span>
								<span className="relative h-[3px] flex-1 rounded-full bg-[#E5E5E5]">
									<span
										className="absolute inset-y-0 right-0 rounded-full bg-[#4F6AE0]"
										style={{ width: `${elapsedPct}%` }}
									/>
								</span>
							</div>
						</div>
					</InfoCard>

					<InfoCard
						title="تفاصيل الوظيفة"
						Icon={IconFolder}
					>
						<div className="flex flex-col gap-2">
							<InfoRow
								label="القسم"
								Icon={IconSitemap}
								value={job.department}
							/>
							<InfoRow
								label="نوع التوظيف"
								Icon={IconBriefcase}
								value={job.employmentType}
							/>
							<InfoRow
								label="مكان العمل"
								Icon={IconClock}
								value={job.workEnv}
							/>
							<InfoRow
								label="الراتب"
								Icon={IconCash}
								value={salary && job.currency ? `${salary} ${job.currency}` : salary}
							/>
							<InfoRow
								label="الموقع"
								Icon={IconMapPin}
								value={[job.city, job.country].filter(Boolean).join("، ")}
							/>
						</div>
					</InfoCard>

					<InfoCard
						title="مدير التوظيف"
						Icon={IconUserCog}
					>
						<div className="flex flex-col gap-2">
							{HIRING_MANAGERS.map((m) => (
								<div
									key={m.id}
									className="flex items-center justify-between gap-2"
								>
									{/* ترتيب DOM في RTL: الصورة الرمزية يمينًا ثم الاسم، وزر المزيد يسارًا */}
									<div className="flex items-center gap-2">
										<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4F6AE0] text-[11px] font-semibold leading-4 text-white">
											{m.name[0]}
										</span>
										<div className="flex flex-col">
											<span className="text-[12px] font-medium leading-4 text-[#08090A]">
												{m.name}
											</span>
											<span className="text-[10px] leading-[15px] text-[#9B9B9D]">
												{m.role}
											</span>
										</div>
									</div>
									<button
										type="button"
										aria-label={`إجراءات ${m.name}`}
										className="flex size-3 shrink-0 items-center justify-center text-[#9B9B9D]"
									>
										<IconDotsCircleHorizontal className="size-3" />
									</button>
								</div>
							))}
						</div>
					</InfoCard>
				</div>
			</div>
		</div>
	);
}

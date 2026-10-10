import {
	IconArrowLeft,
	IconCircleDot,
	IconCircleX,
	IconMoodSmile,
	IconPaperclip,
	IconPencil,
	IconSend,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { Fragment, useState } from "react";

import { useJobNotesStore } from "@/features/services/staff/stores/job-notes.store";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

// شارة مرحلة داخل حدث نقل مرشّح (ألوان التصميم)
type StageBadge = { label: string; bg: string; color: string };

const STAGE_BADGES = {
	interview: { label: "المقابلة", bg: "#DBEAFE", color: "#4F6AE0" },
	rejected: { label: "مرفوض", bg: "#FFE2E2", color: "#FF6467" },
	shortlist: { label: "القائمة المختصرة", bg: "#CEFAFE", color: "#007595" },
	inProgress: { label: "قيد التنفيذ", bg: "#DBEAFE", color: "#4F6AE0" },
} satisfies Record<string, StageBadge>;

// حدث في سجل النشاط — إمّا نص بسيط أو بطاقة نقل مرشّح
type ActivityEntry = {
	id: string;
	Icon: IconType;
	iconColor?: string;
	time: string;
	author: string;
	text?: string;
	move?: { from: StageBadge; to: StageBadge; candidate: string; note?: string };
	divider?: boolean;
};

// سجل عيّنة — لا يوجد ربط خلفي بعد
const ACTIVITY_GROUPS: { day: string; entries: ActivityEntry[] }[] = [
	{
		day: "اليوم",
		entries: [
			{
				id: "t1",
				Icon: IconPencil,
				time: "١٢:١٠ م",
				author: "ماجد المطيري",
				text: "تغيير اسم الوظيفة إلى جراح عظام",
			},
			{
				id: "t2",
				Icon: IconPencil,
				time: "١١:٤٢ ص",
				author: "ماجد المطيري",
				text: "حدّد موعد التقديم إلى ٣٠ أبريل، ٢٠٢٥",
			},
			{
				id: "t3",
				Icon: IconCircleX,
				iconColor: "#FF6467",
				time: "١٠:١٢ ص",
				author: "ماجد المطيري",
				move: {
					from: STAGE_BADGES.interview,
					to: STAGE_BADGES.rejected,
					candidate: "معاذ محمد",
					note: "المرشح لم يعد متاحاً. شكراً لك على تقديمك، بعد المراجعة قرّرنا المضي مع مرشّح آخر أقرب لمتطلبات الوظيفة.",
				},
			},
			{
				id: "t4",
				Icon: IconCircleDot,
				iconColor: "#4F6AE0",
				time: "٠٥:٤٢ ص",
				author: "ماجد المطيري",
				move: {
					from: STAGE_BADGES.shortlist,
					to: STAGE_BADGES.inProgress,
					candidate: "صالح محمد",
				},
				divider: true,
			},
		],
	},
	{
		day: "الأمس",
		entries: [
			{
				id: "y1",
				Icon: IconPencil,
				time: "١٢:١٠ م",
				author: "ماجد المطيري",
				text: "تغيير اسم الوظيفة إلى جراح عظام",
			},
			{
				id: "y2",
				Icon: IconPencil,
				time: "١١:٤٢ ص",
				author: "ماجد المطيري",
				text: "حدّد موعد التقديم إلى ٣٠ أبريل، ٢٠٢٥",
			},
			{
				id: "y3",
				Icon: IconCircleDot,
				iconColor: "#4F6AE0",
				time: "٠٥:٤٢ ص",
				author: "ماجد المطيري",
				move: {
					from: STAGE_BADGES.shortlist,
					to: STAGE_BADGES.inProgress,
					candidate: "صالح محمد",
				},
			},
		],
	},
];

function StageChip({ badge }: { badge: StageBadge }) {
	return (
		<span
			className="flex h-[19px] items-center whitespace-nowrap rounded-full px-2 text-[10px] font-medium leading-[15px]"
			style={{ backgroundColor: badge.bg, color: badge.color }}
		>
			{badge.label}
		</span>
	);
}

// سطر «بواسطة: [صورة] الاسم · الوقت»
function EntryMeta({ author, time }: { author: string; time: string }) {
	return (
		<div className="flex h-3.5 items-center gap-1">
			<span className="flex items-center gap-0.5">
				<span className="text-[8px] leading-3 text-[#5C5C5E]">بواسطة:</span>
				<span className="flex items-center gap-0.5">
					<span className="size-3.5 shrink-0 rounded-full bg-[#EEF0F5]" />
					<span className="text-[8px] leading-3 text-[#08090A]">{author}</span>
				</span>
			</span>
			<span className="text-[8px] leading-3 text-[#5C5C5E]">.</span>
			<span className="text-[8px] leading-3 text-[#5C5C5E]">{time}</span>
		</div>
	);
}

// وقت الملاحظة بأرقام عربية كبقية أحداث السجل
const noteTime = (iso: string) =>
	new Date(iso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

// تبويب «سجل النشاط»: أحداث مجمّعة حسب اليوم + ملاحظات المسؤول + مربّع تعليق.
// scope يفصل ملاحظات كل وظيفة/مرشّح عن غيرها.
export function JobActivityLog({ scope }: { scope: string }) {
	const { data: session } = useSession();
	const { notes, addNote } = useJobNotesStore();
	const [draft, setDraft] = useState("");

	const scopedNotes = notes.filter((n) => n.scope === scope);
	const author = session?.user?.name?.trim() || "أنا";

	const submit = () => {
		const text = draft.trim();
		if (!text) return;
		addNote({ scope, text, author });
		setDraft("");
	};

	return (
		<div className="min-h-0 flex-1 overflow-auto bg-white">
			<div className="mx-auto flex w-[636px] max-w-full flex-col gap-2 px-3 py-4">
				{ACTIVITY_GROUPS.map(({ day, entries }) => (
					<Fragment key={day}>
						<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">
							{day}
						</span>

						{entries.map((entry) => (
							<div
								key={entry.id}
								className={cn(
									"flex items-start gap-3",
									entry.move?.note ? "pb-3" : "",
									entry.divider && "border-b-[0.75px] border-[#E5E5E5] pb-3",
								)}
							>
								{/* ترتيب DOM في RTL: عمود الأيقونة يمينًا ثم المحتوى */}
								<span
									className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4]"
									style={{ color: entry.iconColor ?? "#08090A" }}
								>
									<entry.Icon className="size-3.5" />
								</span>

								<div className="flex min-w-0 flex-1 flex-col gap-1">
									{entry.text && (
										<span className="text-[12px] leading-[18px] text-[#08090A]">
											{entry.text}
										</span>
									)}

									{/* الإطار يظهر فقط عندما يرافق النقلَ نصُّ سبب — وإلّا يظهر السطر مباشرة */}
									{entry.move && (
										<div
											className={cn(
												"flex flex-col gap-2",
												entry.move.note &&
													"w-[458px] max-w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3",
											)}
										>
											<div className="flex flex-wrap items-center gap-1">
												{/* «المرشح [الاسم] نُقل من» ثم شارات المرحلتين */}
												<span className="flex items-center gap-0.5 text-[12px] leading-[18px] text-[#08090A]">
													<span>المرشح</span>
													<span className="font-medium text-[#4F6AE0]">
														{entry.move.candidate}
													</span>
													<span>نُقل من</span>
												</span>
												<span className="flex items-center gap-0">
													<StageChip badge={entry.move.from} />
													<IconArrowLeft className="size-3.5 shrink-0 text-[#08090A]" />
													<StageChip badge={entry.move.to} />
												</span>
											</div>

											{entry.move.note && (
												<p className="rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#F9FAFB] p-2 text-[11px] leading-[18px] text-[#6A7282]">
													{entry.move.note}
												</p>
											)}
										</div>
									)}

									<EntryMeta
										author={entry.author}
										time={entry.time}
									/>
								</div>
							</div>
						))}
					</Fragment>
				))}

				{/* ملاحظات المسؤول — بطاقة لكل ملاحظة محفوظة (Figma node 4073-450227) */}
				{scopedNotes.length > 0 && (
					<div className="flex flex-col gap-2 pt-2">
						<span className="text-[12px] font-semibold leading-[28px] text-[#08090A]">
							ملاحظات المسؤول
						</span>
						{scopedNotes.map((note) => (
							<div
								key={note.id}
								className="flex flex-col gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3"
							>
								<p className="whitespace-pre-wrap text-[11px] text-[#08090A]">{note.text}</p>
								<EntryMeta
									author={note.author}
									time={noteTime(note.createdAt)}
								/>
							</div>
						))}
					</div>
				)}

				{/* مربّع كتابة تعليق */}
				<div className="flex items-start gap-2 pt-4">
					<span className="size-7 shrink-0 rounded-full bg-[#EEF0F5]" />
					<div className="flex flex-1 flex-col gap-3 rounded-[6px] border-[0.75px] border-[#E5E5E5] p-3">
						<input
							type="text"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									submit();
								}
							}}
							placeholder="أضف ملاحظة جديدة..."
							className="w-full bg-transparent text-[11px] leading-[18px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						/>
						{/* الأدوات في نهاية الصف (يساره في RTL) */}
						<div className="flex justify-end gap-2 text-[#9B9B9D]">
							<button
								type="button"
								aria-label="إرفاق ملف"
							>
								<IconPaperclip className="size-3.5" />
							</button>
							<button
								type="button"
								aria-label="إدراج رمز تعبيري"
							>
								<IconMoodSmile className="size-3.5" />
							</button>
							<button
								type="button"
								onClick={submit}
								disabled={!draft.trim()}
								aria-label="إرسال الملاحظة"
								className="transition-colors enabled:hover:text-[#4F6AE0] disabled:opacity-40"
							>
								<IconSend className="size-3.5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

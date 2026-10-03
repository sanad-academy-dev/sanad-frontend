// بطاقة إعلان منشور — مطابقة لتصميم Figma (ترويسة الكاتب + المحتوى + وسائط + تذييل المستلمين)
import {
	IconDots,
	IconMessagePlus,
	IconMoodPlus,
	IconPencil,
	IconPin,
	IconPinnedOff,
	IconSpeakerphone,
	IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteAnnouncementDialog } from "@/features/services/staff/components/announcements/delete-announcement-dialog";
import { cn } from "@/lib/utils";

// بيانات الإعلان المنشور (واجهة فقط حاليًا — لا يوجد موديل Announcement بعد)
export type AnnouncementCardData = {
	id: string;
	content: string;
	typeLabel: string | null;
	authorName: string;
	authorInitials: string;
	recipientInitials: string[];
	recipientCount: number;
	// معرّفات الموظفين المستلمين — تُستخدم لعرض الإعلان في بروفايل كل موظف مستلم.
	// قائمة فارغة مع recipientCount = 0 تعني نشرًا للجميع.
	recipientIds: string[];
	// وقت النشر (ms) — لعرض الزمن النسبي في تبويب إعلانات الموظف
	createdAt: number;
};

export function AnnouncementCard({
	data,
	onDelete,
}: {
	data: AnnouncementCardData;
	onDelete?: (id: string) => void;
}) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [pinned, setPinned] = useState(true);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const visibleAvatars = data.recipientInitials.slice(0, 4);
	const extra = data.recipientCount - visibleAvatars.length;

	return (
		<>
			<div
				dir="rtl"
				className="w-full max-w-[694px] rounded-[4px] border border-[#E5E5E5] bg-white px-2 pt-[11px] pb-2"
			>
				<div className="flex flex-col gap-[19px]">
					{/* الترويسة */}
					<div className="flex items-start justify-between">
						{/* الكاتب (يمين) */}
						<div className="flex items-center gap-[7px]">
							<span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[18px] font-medium text-white">
								{data.authorInitials}
							</span>
							<div className="flex flex-col items-end gap-1">
								<span className="text-[16px] font-semibold leading-tight text-[#4D5869]">
									{data.authorName}
								</span>
								<div className="flex items-center gap-[5px]">
									{data.typeLabel && (
										<span className="flex items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[7px] py-1 text-[10px] font-medium text-[#08090A]">
											<IconSpeakerphone className="size-[14px]" />
											{data.typeLabel}
										</span>
									)}
									<span className="text-[12px] text-[#667085]">الآن</span>
								</div>
							</div>
						</div>

						{/* الإجراءات (يسار) */}
						<div className="flex items-center gap-[13px]">
							{pinned && (
								<button
									type="button"
									aria-label="مثبّت"
								>
									<IconPin className="size-[17px] text-[#08090A]" />
								</button>
							)}
							<Popover
								open={menuOpen}
								onOpenChange={setMenuOpen}
							>
								<PopoverTrigger asChild>
									<button
										type="button"
										className={cn(
											"flex h-[21px] items-center justify-center rounded-[4px] border border-[#E5E5E5] px-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors",
											menuOpen && "bg-[#F9FAFB]",
										)}
										aria-label="خيارات"
									>
										<IconDots className="size-4 text-[#1C1C1C]" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									dir="rtl"
									className="w-[177px] rounded-[4px] border border-[#E5E5E5] p-0 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
								>
									<div className="flex flex-col gap-[6px] px-2 py-3">
										<button
											type="button"
											onClick={() => setMenuOpen(false)}
											className="flex w-full items-center gap-2 rounded-[4px] px-2 py-[6px] text-[12px] font-bold text-[#08090A] transition-colors hover:bg-[#F2F2F2]"
										>
											<IconPencil className="size-4" />
											<span>تعديل</span>
										</button>
										<button
											type="button"
											onClick={() => setPinned((p) => !p)}
											className="flex w-full items-center gap-2 rounded-[4px] px-2 py-[6px] text-[12px] font-bold text-[#08090A] transition-colors hover:bg-[#F2F2F2]"
										>
											{pinned ? (
												<IconPinnedOff className="size-4" />
											) : (
												<IconPin className="size-4" />
											)}
											<span>{pinned ? "إلغاء التثبيت" : "تثبيت"}</span>
										</button>
										<button
											type="button"
											onClick={() => {
												setMenuOpen(false);
												setDeleteOpen(true);
											}}
											className="flex w-full items-center gap-2 rounded-[4px] px-2 py-[6px] text-[12px] font-bold text-[#DC2626] transition-colors hover:bg-[#F2F2F2]"
										>
											<IconTrash className="size-4" />
											<span>حذف</span>
										</button>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					{/* المحتوى */}
					<p className="whitespace-pre-wrap text-right text-[11px] leading-[15px] text-[#08090A]">
						{data.content}
					</p>

					{/* منطقة الوسائط */}
					<div className="flex h-[302px] w-full items-center justify-center rounded-[4px] bg-[#EDECE9]">
						<IconSpeakerphone className="size-[46px] text-[#A0A09C]" />
					</div>

					{/* التذييل */}
					<div className="flex flex-col gap-[7px]">
						<div className="h-px w-full bg-[#E5E5E5]" />
						<div className="flex items-center justify-between">
							{/* أيقونات التفاعل (يسار) */}
							<div className="flex items-center gap-1 text-[#08090A]">
								<IconMoodPlus className="size-3" />
								<IconMessagePlus className="size-[13px]" />
							</div>

							{/* المستلمون (يمين) */}
							<div className="flex items-center gap-[3px]">
								<span className="text-[10px] font-medium text-[#08090A]">
									{data.recipientCount > 0
										? `تم الإرسال إلى ${data.recipientCount} مستلم`
										: "تم النشر للجميع"}
								</span>
								{visibleAvatars.length > 0 && (
									<div className="flex items-center">
										{visibleAvatars.map((initials, i) => (
											<span
												key={`${initials}-${i}`}
												className={cn(
													"-me-[3px] flex size-3 items-center justify-center rounded-full text-[5px] primaryring-1 ring-white",
													i % 2 === 0 ? "bg-[rgba(99,102,241,0.5)]" : "bg-[#B1B2F8]",
												)}
											>
												{initials}
											</span>
										))}
										{extra > 0 && (
											<span className="flex size-3 items-center justify-center rounded-full bg-[rgba(99,102,241,0.5)] text-[5px] primaryring-1 ring-white">
												+{extra}
											</span>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<DeleteAnnouncementDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				onConfirm={() => onDelete?.(data.id)}
				authorName={data.authorName}
				authorInitials={data.authorInitials}
			/>
		</>
	);
}

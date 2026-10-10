// تبويب "الإعلان" في الموارد البشرية: منشئ الإعلان + قائمة الإعلانات المنشورة
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { AnnouncementCard } from "@/features/services/staff/components/announcements/announcement-card";
import { AnnouncementComposer } from "@/features/services/staff/components/announcements/announcement-composer";
import { useAnnouncementsStore } from "@/features/services/staff/stores/announcements.store";

// رسمة الحالة الفارغة (بديل مؤقت عن Humaaans - Message.png بنفس المقاس 210×102)
function EmptyMessageIllustration() {
	return (
		<svg
			width="210"
			height="102"
			viewBox="0 0 210 102"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="لا توجد إعلانات"
		>
			{/* خلفية ناعمة */}
			<ellipse
				cx="105"
				cy="90"
				rx="78"
				ry="9"
				fill="#6366F1"
				opacity="0.06"
			/>

			{/* فقاعة الرسالة الرئيسية */}
			<rect
				x="46"
				y="16"
				width="118"
				height="60"
				rx="10"
				fill="#FFFFFF"
				stroke="#E5E5E5"
				strokeWidth="1.5"
			/>
			<path
				d="M74 76 L74 90 L90 76 Z"
				fill="#FFFFFF"
				stroke="#E5E5E5"
				strokeWidth="1.5"
			/>
			{/* أسطر النص داخل الفقاعة */}
			<rect
				x="60"
				y="30"
				width="90"
				height="6"
				rx="3"
				fill="#EEF0FF"
			/>
			<rect
				x="60"
				y="43"
				width="72"
				height="6"
				rx="3"
				fill="#EEF0FF"
			/>
			<rect
				x="60"
				y="56"
				width="52"
				height="6"
				rx="3"
				fill="#E5E5E5"
			/>

			{/* فقاعة صغيرة بلون العلامة */}
			<circle
				cx="164"
				cy="24"
				r="12"
				fill="#6366F1"
			/>
			<circle
				cx="160"
				cy="24"
				r="1.6"
				fill="#FFFFFF"
			/>
			<circle
				cx="164"
				cy="24"
				r="1.6"
				fill="#FFFFFF"
			/>
			<circle
				cx="168"
				cy="24"
				r="1.6"
				fill="#FFFFFF"
			/>

			{/* عنصر تزييني صغير */}
			<circle
				cx="40"
				cy="30"
				r="6"
				fill="#6366F1"
				opacity="0.18"
			/>
		</svg>
	);
}

export function AnnouncementsView() {
	const { announcements, addAnnouncement, deleteAnnouncement, restoreAnnouncement } =
		useAnnouncementsStore();

	const handlePublish = addAnnouncement;

	const handleDelete = (id: string) => {
		const idx = announcements.findIndex((a) => a.id === id);
		if (idx === -1) return;
		const removed = announcements[idx];
		deleteAnnouncement(id);

		toast.custom(
			(t) => (
				<div
					dir="rtl"
					className="flex w-[356px] items-center justify-between gap-[14px] rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-[6px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
				>
					<div className="flex items-center gap-[6px]">
						<span className="text-right text-[12px] font-semibold text-[#08090A]">
							تم حذف الإعلان "{removed.authorName}" بنجاح
						</span>
						<IconTrash className="size-[15px] shrink-0 text-[#DC2626]" />
					</div>
					<button
						type="button"
						onClick={() => {
							restoreAnnouncement(removed, idx);
							toast.dismiss(t);
						}}
						className="flex items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] py-[5px] text-[11px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]"
					>
						تراجع
					</button>
				</div>
			),
			{ duration: 5000 },
		);
	};

	return (
		<div
			dir="rtl"
			className="flex flex-1 flex-col items-center gap-[35px] overflow-y-auto bg-[#F5F5F5] p-[9px]"
		>
			{/* منشئ الإعلان ثابت في الأعلى — يبقى ظاهرًا دائمًا حتى بعد النشر */}
			<div className="sticky top-0 z-10 flex w-full justify-center bg-[#F5F5F5] pb-3">
				<AnnouncementComposer onPublish={handlePublish} />
			</div>

			{announcements.length > 0 ? (
				// قائمة الإعلانات المنشورة
				<div className="flex w-full max-w-[694px] flex-col gap-[9px]">
					{announcements.map((a) => (
						<AnnouncementCard
							key={a.id}
							data={a}
							onDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				// الحالة الفارغة — لا توجد إعلانات بعد (Frame 1)
				<div className="flex w-full max-w-[694px] flex-1 items-center justify-center rounded-[4px] border border-[#F2F2F2] bg-[rgba(242,242,242,0.24)] p-6">
					{/* Frame 76 */}
					<div className="flex w-[300px] flex-col items-center gap-2">
						<EmptyMessageIllustration />

						{/* العنوان + الوصف (gap 4px) */}
						<div className="flex flex-col items-center gap-1">
							<h3 className="text-center text-[14px] font-bold leading-[27px] text-[#08090A]">
								لا يوجد أي إعلانات حتى الآن
							</h3>
							<p className="w-[300px] text-center text-[12px] font-medium leading-[18px] text-[#08090A]">
								أنشئ إعلانًا جديدًا لمشاركة الأخبار والتعليمات والتحديثات التشغيلية.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

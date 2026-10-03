// تبويب "الإعلانات" في بروفايل الموظف — يعرض الإعلانات الموجّهة لهذا الموظف
// (المرسلة إليه مباشرةً أو المنشورة للجميع)، وتظهر تلقائيًا فور نشرها من تبويب "الإعلان".
import { IconSpeakerphone } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { useMemo } from "react";

import { TabsContent } from "@/components/ui/tabs";
import type { AnnouncementCardData } from "@/features/services/staff/components/announcements/announcement-card";
import { useAnnouncementsStore } from "@/features/services/staff/stores/announcements.store";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";

// إعلان موجّه لهذا الموظف: مُرسل إليه مباشرةً، أو منشور للجميع (recipientCount = 0)
function isForStaff(a: AnnouncementCardData, staffId: string): boolean {
	return a.recipientCount === 0 || a.recipientIds.includes(staffId);
}

function relativeTime(createdAt: number): string {
	if (!createdAt) return "الآن";
	return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: arSA });
}

// بطاقة إعلان مُصغّرة تلائم عرض عمود البروفايل — بنفس لغة تصميم بطاقة الإعلان الأصلية
function ProfileAnnouncementCard({ data }: { data: AnnouncementCardData }) {
	return (
		<div className="flex flex-col gap-3 rounded-[4px] border border-[#E5E5E5] bg-white p-3">
			{/* الترويسة */}
			<div className="flex items-start gap-[7px]">
				<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[13px] font-medium text-white">
					{data.authorInitials}
				</span>
				<div className="flex flex-1 flex-col gap-1">
					<span className="text-[14px] font-semibold leading-tight text-[#4D5869]">
						{data.authorName}
					</span>
					<div className="flex items-center gap-[5px]">
						{data.typeLabel && (
							<span className="flex items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[7px] py-1 text-[10px] font-medium text-[#08090A]">
								<IconSpeakerphone className="size-[13px]" />
								{data.typeLabel}
							</span>
						)}
						<span className="text-[11px] text-[#667085]">{relativeTime(data.createdAt)}</span>
					</div>
				</div>
			</div>

			{/* المحتوى */}
			<p className="whitespace-pre-wrap text-right text-[12px] leading-[18px] text-[#08090A]">
				{data.content}
			</p>

			{/* التذييل */}
			<div className="flex flex-col gap-2">
				<div className="h-px w-full bg-[#E5E5E5]" />
				<span className="text-[10px] font-medium text-[#667085]">
					{data.recipientCount > 0
						? `تم الإرسال إلى ${data.recipientCount} مستلم`
						: "تم النشر للجميع"}
				</span>
			</div>
		</div>
	);
}

// رسمة الحالة الفارغة — لا إعلانات موجّهة لهذا الموظف بعد
function EmptyAnnouncements() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
			<span className="flex size-12 items-center justify-center rounded-full bg-[#EEF0FF]">
				<IconSpeakerphone className="size-6 text-[#6366F1]" />
			</span>
			<div className="flex flex-col items-center gap-1">
				<h3 className="text-[14px] font-bold text-[#08090A]">لا توجد إعلانات</h3>
				<p className="max-w-[260px] text-[12px] font-medium leading-[18px] text-[#667085]">
					ستظهر هنا الإعلانات الموجّهة إلى هذا الموظف تلقائيًا فور نشرها.
				</p>
			</div>
		</div>
	);
}

export function AnnouncementsTab({ staffId }: StaffTabProps) {
	const { announcements } = useAnnouncementsStore();

	const staffAnnouncements = useMemo(
		() => (staffId ? announcements.filter((a) => isForStaff(a, staffId)) : []),
		[announcements, staffId],
	);

	return (
		<TabsContent
			value="announcements"
			className="m-0 flex flex-col p-3"
			dir="rtl"
		>
			{staffAnnouncements.length > 0 ? (
				<div className="flex flex-col gap-[9px]">
					{staffAnnouncements.map((a) => (
						<ProfileAnnouncementCard
							key={a.id}
							data={a}
						/>
					))}
				</div>
			) : (
				<EmptyAnnouncements />
			)}
		</TabsContent>
	);
}

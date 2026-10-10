// بطاقة إنشاء إعلان جديد داخل تبويب "الإعلان" في الموارد البشرية
import {
	IconChevronDown,
	IconExternalLink,
	IconSparkles,
	IconSpeakerphone,
} from "@tabler/icons-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type { AnnouncementCardData } from "@/features/services/staff/components/announcements/announcement-card";
import { AttachPopover } from "@/features/services/staff/components/announcements/attach-popover";
import { RecipientsPopover } from "@/features/services/staff/components/announcements/recipients-popover";
import { SchedulePopover } from "@/features/services/staff/components/announcements/schedule-popover";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

// أنواع الإعلان (واجهة فقط حاليًا — لا يوجد موديل Announcement بعد)
const ANNOUNCEMENT_TYPES = [
	{ value: "ADMINISTRATIVE", label: "إدارية" },
	{ value: "PHARMACEUTICALS", label: "أدوية" },
	{ value: "INVENTORY", label: "مخزون" },
	{ value: "FINANCE", label: "مالية" },
	{ value: "LABORATORY", label: "التحاليل" },
	{ value: "COSMETICS", label: "التجميل" },
	{ value: "MEDICAL", label: "طبية" },
	{ value: "UPDATE", label: "تحديث" },
] as const;

// الحروف الأولى من اسم المستخدم للأفاتار (مثال: "أحمد محمد" → "أم")
function getInitials(name?: string | null): string {
	if (!name) return "؟";
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((p) => p[0]).join("");
}

export function AnnouncementComposer({
	onPublish,
}: {
	onPublish: (announcement: AnnouncementCardData) => void;
}) {
	const { data: session } = useSession();
	const { staff } = useStaff();
	const [content, setContent] = useState("");
	const [whatsappNotify, setWhatsappNotify] = useState(false);
	const [typeOpen, setTypeOpen] = useState(false);
	const [announcementType, setAnnouncementType] = useState<string | null>(null);
	const [recipients, setRecipients] = useState<Set<string>>(new Set());
	const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);

	const toggleRecipient = (id: string) => {
		setRecipients((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const selectedTypeLabel = ANNOUNCEMENT_TYPES.find(
		(t) => t.value === announcementType,
	)?.label;

	const initials = getInitials(session?.user?.name);
	const canPublish = content.trim().length > 0;

	const reset = () => {
		setContent("");
		setWhatsappNotify(false);
		setAnnouncementType(null);
		setRecipients(new Set());
		setScheduleDate(undefined);
	};

	const handlePublish = () => {
		if (!canPublish) return;
		const selected = staff.filter((s) => recipients.has(s.id));
		onPublish({
			id: `${Date.now()}-${recipients.size}`,
			content: content.trim(),
			typeLabel: selectedTypeLabel ?? null,
			authorName: session?.user?.name ?? "مستخدم",
			authorInitials: initials,
			recipientInitials: selected.map((s) => getInitials(s.name)),
			recipientCount: recipients.size,
			recipientIds: selected.map((s) => s.id),
			createdAt: Date.now(),
		});
		reset();
	};

	return (
		<div
			dir="rtl"
			className="w-full max-w-[694px] overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white"
		>
			{/* الترويسة: السؤال + أفاتار المستخدم */}
			<div className="flex flex-col gap-[6px] px-[15px] pt-3">
				<div className="flex items-center gap-1">
					<h2 className="flex-1 text-right text-[12px] font-medium leading-[18px] text-[#08090A]">
						ما الذي تريد مشاركته؟
					</h2>
					<span className="flex size-[18px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] font-normal text-white">
						{initials}
					</span>
				</div>

				{/* منطقة الكتابة */}
				<div className="flex h-[147px] flex-col rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[10.5px] py-[7px]">
					<div className="flex items-center justify-end gap-1">
						<button
							type="button"
							className="flex h-[23px] items-center gap-[6px] rounded-[4px] border border-[#E5E5E5] px-[6px] text-[10px] font-medium text-[#4A5565] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#F9FAFB]"
						>
							<IconExternalLink className="size-[14px]" />
							<span>قالب إعلان</span>
							<IconChevronDown className="size-[11px]" />
						</button>
						<button
							type="button"
							className="flex size-[18px] items-center justify-center rounded-full border border-[#D0D5DD] text-[#344054] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-[#F9FAFB]"
							aria-label="إضافة"
						>
							<IconSparkles className="size-3" />
						</button>
					</div>

					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="اكتب أو انسخ الصق الإعلان .."
						className="mt-[6px] flex-1 resize-none bg-transparent text-right text-[11px] leading-[18px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
					/>
				</div>
			</div>

			{/* شريط الأدوات */}
			<div className="mt-3 flex items-center justify-start gap-[6px] border-t-[0.75px] border-[#E5E5E5] px-3 py-[6px]">
				<Popover
					open={typeOpen}
					onOpenChange={setTypeOpen}
				>
					<PopoverTrigger asChild>
						<button
							type="button"
							className={cn(
								"flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] text-[10px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]",
								typeOpen && "bg-[#F9FAFB]",
							)}
						>
							<IconSpeakerphone className="size-[11px]" />
							<span>{selectedTypeLabel ?? "نوع الإعلان"}</span>
						</button>
					</PopoverTrigger>
					<PopoverContent
						align="start"
						dir="rtl"
						className="w-[180px] rounded-[4px] border-[0.75px] border-[#E5E5E5] p-[0.75px] pt-[3.75px]"
					>
						<div className="px-[9px] py-[3px] text-right text-[12px] font-normal leading-[14px] text-[#08090A]">
							اختر نوع الإعلان...
						</div>
						{ANNOUNCEMENT_TYPES.map((t) => (
							<button
								key={t.value}
								type="button"
								onClick={() => {
									setAnnouncementType(t.value);
									setTypeOpen(false);
								}}
								className={cn(
									"flex h-[25.5px] w-full items-center justify-start rounded-[4px] px-[9px] text-right text-[11px] font-medium leading-[16px] text-[#08090A] transition-colors hover:bg-[#F9FAFB]",
									announcementType === t.value && "bg-[#F3F4F6]",
								)}
							>
								{t.label}
							</button>
						))}
					</PopoverContent>
				</Popover>
				<RecipientsPopover
					selectedIds={recipients}
					onToggle={toggleRecipient}
				/>
				<SchedulePopover
					date={scheduleDate}
					onDateChange={setScheduleDate}
				/>
				<AttachPopover />
			</div>

			{/* شريط النشر */}
			<div className="flex items-center justify-between border-t-[0.75px] border-[#E5E5E5] px-3 py-[7.5px]">
				<button
					type="button"
					onClick={reset}
					className="text-[10px] text-[#737373] transition-colors hover:text-[#08090A]"
				>
					إعادة الضبط
				</button>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1 text-[10px] text-[#737373]">
						<span>إشعار عبر الواتساب</span>
						<Switch
							size="sm"
							checked={whatsappNotify}
							onCheckedChange={setWhatsappNotify}
						/>
					</div>

					<button
						type="button"
						disabled={!canPublish}
						onClick={handlePublish}
						className={cn(
							"flex h-[26px] items-center gap-[5px] rounded-[4px] px-[7px] text-[11px] font-semibold primarytransition-colors",
							canPublish
								? "bg-[#4F6AE0] hover:bg-[#4358c4]"
								: "cursor-not-allowed bg-[rgba(79,106,224,0.31)]",
						)}
					>
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] font-normal leading-[12px]">
							⌘↵
						</span>
						نشر الإعلان
					</button>
				</div>
			</div>
		</div>
	);
}

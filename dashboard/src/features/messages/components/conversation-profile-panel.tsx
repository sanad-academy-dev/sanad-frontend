import {
	IconCalendar,
	IconCopy,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPin,
	IconPinnedOff,
	IconTrash,
	IconVolume,
	IconVolumeOff,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { ProfileDocumentsTab } from "@/features/messages/components/profile-tabs/profile-documents-tab";
import { ProfileLinksTab } from "@/features/messages/components/profile-tabs/profile-links-tab";
import { ProfileMediaTab } from "@/features/messages/components/profile-tabs/profile-media-tab";
import { ProfileMembersTab } from "@/features/messages/components/profile-tabs/profile-members-tab";
import { ProfileVisitsTab } from "@/features/messages/components/profile-tabs/profile-visits-tab";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { ChatMember, Conversation } from "@/features/messages/types/messages.type";
import { PROFILE_TABS } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

export function ConversationProfilePanel({
	conversation,
	onTogglePin,
	onToggleMute,
	onStartCall,
	onAddMember,
	onDelete,
}: {
	conversation: Conversation;
	onTogglePin: () => void;
	onToggleMute: () => void;
	/** بدء مكالمة فيديو للمحادثة */
	onStartCall: () => void;
	onAddMember: (member: ChatMember) => void;
	onDelete: () => void;
}) {
	const close = useMessagesStore((s) => s.closeProfile);
	const tab = useMessagesStore((s) => s.profileTab);
	const setTab = useMessagesStore((s) => s.setProfileTab);

	// إجراءات سريعة — الترتيب في RTL: كتم، تثبيت، بريد، اتصال
	const quickActions: {
		key: string;
		label: string;
		Icon: ComponentType<{ className?: string }>;
		onClick: () => void;
	}[] = [
		{
			key: "mute",
			label: conversation.muted ? "تشغيل الاشعارات" : "كتم الاشعارات",
			Icon: conversation.muted ? IconVolume : IconVolumeOff,
			onClick: onToggleMute,
		},
		{
			key: "pin",
			label: conversation.pinned ? "إلغاء التثبيت" : "تثبيت المحادثة",
			Icon: conversation.pinned ? IconPinnedOff : IconPin,
			onClick: onTogglePin,
		},
		{
			key: "email",
			label: "بريد الكتروني",
			Icon: IconMail,
			onClick: () => {
				if (conversation.email !== "—") window.open(`mailto:${conversation.email}`);
			},
		},
		{
			key: "call",
			label: "اتصال",
			Icon: IconPhone,
			// هاتف معروف → اتصال هاتفي؛ وإلا مكالمة فيديو داخل النظام
			onClick: () => {
				if (conversation.phone !== "—") window.open(`tel:${conversation.phone}`);
				else onStartCall();
			},
		},
	];

	const copy = (value: string, label: string) => {
		void navigator.clipboard?.writeText(value);
		toast.success(`تم نسخ ${label}`);
	};

	return (
		<aside className="flex h-full w-[418px] shrink-0 flex-col border-s">
			{/* الترويسة */}
			<div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b px-3">
				<h2 className="text-[14px] font-semibold text-foreground">بروفايل المحادثة</h2>
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="إغلاق البروفايل"
					className="text-muted-foreground"
					onClick={close}
				>
					<IconX className="size-3.5" />
				</Button>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{/* الهوية */}
				<div className="flex flex-col items-center gap-2 px-3 pt-5">
					<ChatAvatar
						name={conversation.title}
						kind={conversation.kind}
						online={conversation.online}
						size={45}
					/>
					<div className="flex items-center gap-2">
						<span className="text-[16px] font-semibold text-foreground">
							{conversation.title}
						</span>
						{conversation.online && (
							<span className="rounded-[4px] bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
								نشط
							</span>
						)}
					</div>
					<span className="flex items-center gap-1 text-[11px] text-muted-foreground">
						<IconCalendar className="size-3" />
						{conversation.joinedLabel}
					</span>
				</div>

				{/* إجراءات سريعة */}
				<div className="grid grid-cols-4 gap-1.5 px-3 pt-4">
					{quickActions.map(({ key, label, Icon, onClick }) => (
						<button
							key={key}
							type="button"
							onClick={onClick}
							className="flex h-[47px] flex-col items-center justify-center gap-1 rounded-[4px] border transition-colors hover:bg-muted/60"
						>
							<Icon className="size-4 text-muted-foreground" />
							<span className="text-[10px] leading-none text-foreground">{label}</span>
						</button>
					))}
				</div>

				{/* معلومات التواصل */}
				<div className="px-3 pt-4">
					<h3 className="pb-2 text-[12px] font-medium text-foreground">معلومات التواصل</h3>
					<ul className="flex flex-col gap-1">
						<ContactRow
							Icon={IconMail}
							value={conversation.email}
							onCopy={() => copy(conversation.email, "البريد الإلكتروني")}
						/>
						<ContactRow
							Icon={IconPhone}
							value={conversation.phone}
							onCopy={() => copy(conversation.phone, "رقم الجوال")}
						/>
						<ContactRow
							Icon={IconMapPin}
							value={conversation.location}
						/>
					</ul>
				</div>

				{/* التبويبات */}
				<div className="px-3 pt-4">
					<div className="flex items-center gap-0.5 rounded-[4px] bg-muted p-0.5">
						{PROFILE_TABS.map((item) => (
							<button
								key={item.value}
								type="button"
								onClick={() => setTab(item.value)}
								className={cn(
									"h-6 flex-1 rounded-[4px] text-[12px] font-medium transition-colors",
									tab === item.value
										? "bg-background text-foreground shadow-xs"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>

				{tab === "visits" && <ProfileVisitsTab visits={conversation.visits} />}
				{tab === "members" && (
					<ProfileMembersTab
						members={conversation.members}
						onAddMember={onAddMember}
					/>
				)}
				{tab === "media" && <ProfileMediaTab media={conversation.media} />}
				{tab === "links" && <ProfileLinksTab links={conversation.links} />}
				{tab === "documents" && <ProfileDocumentsTab documents={conversation.documents} />}
			</div>

			{/* التذييل — الإجراءات في جهة النهاية (يسار) */}
			<div className="flex shrink-0 items-center justify-end gap-2 border-t px-4 py-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-1.5"
					onClick={onToggleMute}
				>
					{conversation.muted ? (
						<IconVolume className="size-3.5" />
					) : (
						<IconVolumeOff className="size-3.5" />
					)}
					{conversation.muted ? "تشغيل الاشعارات" : "كتم الاشعارات"}
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={onDelete}
				>
					<IconTrash className="size-3.5" />
					حذف المحادثة
				</Button>
			</div>
		</aside>
	);
}

/** صف معلومة تواصل: الأيقونة يمينًا، القيمة، وزر النسخ يسارًا */
function ContactRow({
	Icon,
	value,
	onCopy,
}: {
	Icon: ComponentType<{ className?: string }>;
	value: string;
	onCopy?: () => void;
}) {
	return (
		<li className="flex items-center gap-1.5">
			<Icon className="size-3 shrink-0 text-muted-foreground" />
			<span className="truncate text-[12px] text-foreground">{value}</span>
			{onCopy && (
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="نسخ"
					className="text-muted-foreground"
					onClick={onCopy}
				>
					<IconCopy className="size-3" />
				</Button>
			)}
		</li>
	);
}

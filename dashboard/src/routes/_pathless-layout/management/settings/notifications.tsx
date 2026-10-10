import {
	IconBellFilled,
	IconBolt,
	IconBrandWhatsapp,
	IconChevronLeft,
	IconDeviceDesktop,
	IconFlag,
	IconMail,
	IconMailFilled,
	IconMessage2,
	IconVolume,
	IconWaveSine,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, ContainerRow } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useInboxSettings } from "@/features/inbox/hooks/use-inbox-settings";
import { useUpdateInboxSettings } from "@/features/inbox/hooks/use-update-inbox-settings";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { InboxDesktopAction } from "@/features/settings/notifications/components/inbox-desktop-action";
import { InboxSoundAction } from "@/features/settings/notifications/components/inbox-sound-action";
import { InboxVolumeAction } from "@/features/settings/notifications/components/inbox-volume-action";
import { INBOX_TYPE_OPTIONS } from "@/features/settings/notifications/data/inbox-type-options";
import { useNotifications } from "@/features/settings/notifications/hooks/use-notifications";
import { useUpdateNotifications } from "@/features/settings/notifications/hooks/use-update-notifications";

export const Route = createFileRoute("/_pathless-layout/management/settings/notifications")({
	component: RouteComponent,
});

function RouteComponent() {
	const { notifications, isLoading } = useNotifications();
	const { updateNotifications, isPending } = useUpdateNotifications();
	const disabled = isPending || isLoading;

	// إعدادات الوارد شخصية (لكل مستخدم داخل الأكاديمية) — منفصلة عن إعدادات الأكاديمية أعلاه
	const { settings: inbox, isLoading: inboxLoading } = useInboxSettings();
	const { updateInboxSettings, isPending: inboxPending } = useUpdateInboxSettings();
	const inboxDisabled = inboxPending || inboxLoading;
	// إطفاء المفتاح الرئيسي يُعطّل كل ما تحته — لا تنبيه من أي نوع
	const alertsDisabled = inboxDisabled || !inbox.liveEnabled;

	return (
		<SettingsPageWrapper>
			<Container
				title="الإشعارات"
				description="اختر كيفية تلقي الإشعارات عن الزيارات. ستذهب الإشعارات دائمًا إلى صندوق الوارد الخاص بك."
			>
				<ContainerRow
					title="البريد الإلكتروني"
					subtitle={notifications?.emailEnabled ? "مفعّل" : "معطل"}
					icon={<IconMail className="size-5" />}
					action={
						<Link to="/management/settings/notifications-email">
							<IconChevronLeft className="size-4 text-[#9B9B9D]" />
						</Link>
					}
				/>

				<ContainerRow
					title="الواتساب"
					subtitle="معطل"
					icon={<IconBrandWhatsapp className="size-5" />}
					action={<Badge variant="secondary">متاح قريبًا</Badge>}
				/>

				<ContainerRow
					title="رسائل SMS"
					subtitle="معطل"
					icon={<IconMailFilled className="size-5" />}
					action={<Badge variant="secondary">متاح قريبًا</Badge>}
				/>

				<ContainerRow
					title="تطبيق الجوال"
					subtitle="معطل"
					icon={<IconBellFilled className="size-5" />}
					action={<Badge variant="secondary">متاح قريبًا</Badge>}
				/>
			</Container>

			<Container
				title="الوارد"
				description="تنبيهات لحظية داخل التطبيق عند وصول أي عنصر جديد إلى صندوق الوارد. هذه الإعدادات تخصّك وحدك ولا تؤثّر على بقيّة فريق الأكاديمية."
			>
				<ContainerRow
					title="التنبيه المباشر"
					subtitle="استقبال الإشعارات فور حدوثها دون تحديث الصفحة"
					icon={<IconBolt className="size-5" />}
					action={
						<Switch
							size="sm"
							checked={inbox.liveEnabled}
							disabled={inboxDisabled}
							onCheckedChange={(checked) => updateInboxSettings({ liveEnabled: checked })}
						/>
					}
				/>

				<ContainerRow
					title="النافذة المنبثقة"
					subtitle="إظهار بطاقة تنبيه في زاوية الشاشة عند وصول إشعار"
					icon={<IconMessage2 className="size-5" />}
					action={
						<Switch
							size="sm"
							checked={inbox.toastEnabled}
							disabled={alertsDisabled}
							onCheckedChange={(checked) => updateInboxSettings({ toastEnabled: checked })}
						/>
					}
				/>

				<ContainerRow
					title="صوت التنبيه"
					subtitle="نغمة قصيرة عند وصول إشعار — جرّبها قبل الحفظ"
					icon={<IconWaveSine className="size-5" />}
					action={
						<InboxSoundAction
							soundEnabled={inbox.soundEnabled}
							soundName={inbox.soundName}
							soundVolume={inbox.soundVolume}
							isPending={alertsDisabled}
							onEnabledChange={(checked) => updateInboxSettings({ soundEnabled: checked })}
							onSoundChange={(soundName) => updateInboxSettings({ soundName })}
						/>
					}
				/>

				<ContainerRow
					title="مستوى الصوت"
					subtitle="ارتفاع نغمة التنبيه"
					icon={<IconVolume className="size-5" />}
					action={
						<InboxVolumeAction
							soundEnabled={inbox.soundEnabled}
							soundVolume={inbox.soundVolume}
							isPending={alertsDisabled}
							onVolumeChange={(soundVolume) => updateInboxSettings({ soundVolume })}
						/>
					}
				/>

				<ContainerRow
					title="إشعارات سطح المكتب"
					subtitle="تنبيه على مستوى النظام عندما يكون التبويب في الخلفية — يتطلّب إذن المتصفّح"
					icon={<IconDeviceDesktop className="size-5" />}
					action={
						<InboxDesktopAction
							desktopEnabled={inbox.desktopEnabled}
							isPending={alertsDisabled}
							onEnabledChange={(checked) => updateInboxSettings({ desktopEnabled: checked })}
						/>
					}
				/>

				<ContainerRow
					title="الإشعارات المهمة فقط"
					subtitle="نبّهني للإشعارات عالية الأهمية فقط — يصل الباقي إلى الوارد بصمت"
					icon={<IconFlag className="size-5" />}
					action={
						<Switch
							size="sm"
							checked={inbox.onlyHighImportance}
							disabled={alertsDisabled}
							onCheckedChange={(checked) =>
								updateInboxSettings({ onlyHighImportance: checked })
							}
						/>
					}
				/>
			</Container>

			<Container
				title="أنواع تنبيهات الوارد"
				description="اختر الأنواع التي تُصدر تنبيهًا. الأنواع المُطفأة تصل إلى صندوق الوارد كالمعتاد لكن بلا نافذة أو صوت."
			>
				{INBOX_TYPE_OPTIONS.map((option) => (
					<ContainerRow
						key={option.key}
						title={option.label}
						subtitle={option.subtitle}
						action={
							<Switch
								size="sm"
								checked={inbox[option.key] === true}
								disabled={alertsDisabled}
								onCheckedChange={(checked) => updateInboxSettings({ [option.key]: checked })}
							/>
						}
					/>
				))}
			</Container>

			<Container
				title="التحديثات"
				description="تلقي تحديثات عن الزيارات والمتابعة مع العملاء. ستذهب الإشعارات دائمًا إلى صندوق الوارد الخاص بك."
			>
				<ContainerRow
					title="المتابعة مع العملاء"
					subtitle="تفعيل المتابعة مع العملاء قبل الزيارة ب 24 ساعة"
					action={
						<Switch
							size="sm"
							checked={notifications?.customerFollowUp ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ customerFollowUp: checked })}
						/>
					}
				/>

				<ContainerRow
					title="تحديثات النظام"
					subtitle="تفعيل التحديثات الهامة المتعلقة بالنظام"
					action={
						<Switch
							size="sm"
							checked={notifications?.systemUpdates ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ systemUpdates: checked })}
						/>
					}
				/>
			</Container>
		</SettingsPageWrapper>
	);
}

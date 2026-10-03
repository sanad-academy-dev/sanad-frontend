import { NotificationChannel } from "@/generated/prisma/enums";
import type { ChannelAdapter } from "@/server/reminders/channels/channel.port";
export declare const CHANNEL_ADAPTERS: Readonly<Record<NotificationChannel, ChannelAdapter>>;
export declare const adapterFor: (channel: NotificationChannel) => ChannelAdapter;
/** القنوات التي يمكن للأكاديمية اختيارها فعلًا اليوم — تُعرض مُفعّلة في محرّر القاعدة. */
export declare const configuredChannels: () => NotificationChannel[];

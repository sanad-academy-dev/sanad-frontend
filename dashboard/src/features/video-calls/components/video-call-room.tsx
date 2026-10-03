import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { PendingGuestsPanel } from "@/features/video-calls/components/pending-guests-panel";
import type { VideoCallTokenResponse } from "@/server/video-calls/video-calls.type";

import "@livekit/components-styles/index.css";

// قاعة المكالمة العامة لصفحة /video-call (طاقم الأكاديمية) — واجهة LiveKit الجاهزة
// مع لوحة قبول طلبات الانضمام للمضيف
export const VideoCallRoom = ({
	call,
	onDisconnected,
}: {
	call: Pick<VideoCallTokenResponse, "token" | "serverUrl">;
	onDisconnected?: () => void;
}) => {
	return (
		// واجهة LiveKit مبنية LTR — جزيرة LTR مقصودة داخل الصفحة RTL
		<div
			dir="ltr"
			className="flex min-h-0 flex-1 flex-col"
		>
			<LiveKitRoom
				token={call.token}
				serverUrl={call.serverUrl}
				connect
				audio
				video
				onDisconnected={onDisconnected}
				data-lk-theme="default"
				className="relative min-h-0 flex-1"
			>
				<VideoConference />
				<PendingGuestsPanel />
			</LiveKitRoom>
		</div>
	);
};

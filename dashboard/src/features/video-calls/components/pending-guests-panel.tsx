import { useRemoteParticipants, useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";

import { Button } from "@/components/ui/button";
import { useAdmitGuest } from "@/features/video-calls/hooks/use-admit-guest";

// بطاقات طلبات الانضمام (قاعة الانتظار) — تُعرض فوق الفيديو للمضيف فقط.
// يجب أن تكون داخل LiveKitRoom وداخل حاوية position:relative
export const PendingGuestsPanel = () => {
	const room = useRoomContext();
	const remoteParticipants = useRemoteParticipants({
		updateOnlyOn: [
			RoomEvent.ParticipantConnected,
			RoomEvent.ParticipantDisconnected,
			RoomEvent.ParticipantPermissionsChanged,
			RoomEvent.Connected,
		],
	});
	const { admitGuest, rejectGuest, isPending } = useAdmitGuest(room.name);

	// بانتظار القبول = لا يملك صلاحية النشر بعد
	const pendingGuests = remoteParticipants.filter(
		(p) => p.permissions && !p.permissions.canPublish,
	);
	if (pendingGuests.length === 0) return null;

	return (
		<div
			dir="rtl"
			className="absolute inset-x-0 top-4 z-10 flex flex-col items-center gap-2"
		>
			{pendingGuests.map((p) => (
				<div
					key={p.identity}
					className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-lg"
				>
					<span className="text-sm text-foreground">
						يطلب <span className="font-semibold">{p.name || "ضيف"}</span> الانضمام إلى الجلسة
					</span>
					<Button
						type="button"
						size="sm"
						onClick={() => void admitGuest(p.identity)}
						disabled={isPending}
					>
						قبول
					</Button>
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="text-destructive hover:text-destructive"
						onClick={() => void rejectGuest(p.identity)}
						disabled={isPending}
					>
						رفض
					</Button>
				</div>
			))}
		</div>
	);
};

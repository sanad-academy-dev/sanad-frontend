import {
	RoomAudioRenderer,
	useLocalParticipant,
	useRemoteParticipants,
	useRoomContext,
	useTracks,
	VideoTrack,
} from "@livekit/components-react";
import {
	IconLink,
	IconMessage,
	IconMicrophone,
	IconMicrophoneOff,
	IconPhoneOff,
	IconVideo,
	IconVideoOff,
} from "@tabler/icons-react";
import { RoomEvent, Track } from "livekit-client";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PendingGuestsPanel } from "@/features/video-calls/components/pending-guests-panel";
import { SessionChatPanel } from "@/features/video-calls/components/session-chat-panel";
import { cn } from "@/lib/utils";

const MUTED_RED = "bg-red-500 primaryhover:bg-red-600 hover:text-white";

// منطقة المكالمة داخل صفحة الجلسة: فيديو الضيف كبيرًا، المدرّب في نافذة صغيرة،
// شريط تحكم سفلي أبيض بأزرار مربعة، ولوحة محادثة تنفتح على اليمين.
// الترتيب والاتجاهات منطقية (RTL). يجب أن تكون داخل LiveKitRoom
export const SessionCall = ({
	inviteLink,
	onLeave,
	isHost = true,
}: {
	inviteLink: string | null;
	onLeave: () => void;
	// الضيف يرى نفس واجهة المدرّب لكن بلا أزرار الدعوة ولوحة طلبات الانضمام
	isHost?: boolean;
}) => {
	const room = useRoomContext();
	const { localParticipant, isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();
	const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false });
	const remoteTrack = tracks.find((t) => !t.participant.isLocal);
	const localTrack = tracks.find((t) => t.participant.isLocal);
	const [chatOpen, setChatOpen] = useState(false);
	// مشارك مقبول بلا كاميرا ≠ لا يوجد مشارك — نعرض بطاقة باسمه بدل "بانتظار الانضمام"
	const remoteParticipants = useRemoteParticipants({
		updateOnlyOn: [
			RoomEvent.ParticipantConnected,
			RoomEvent.ParticipantDisconnected,
			RoomEvent.ParticipantPermissionsChanged,
			RoomEvent.Connected,
		],
	});
	const admittedRemote = remoteParticipants.find((p) => p.permissions?.canPublish);

	const copyInviteLink = async () => {
		if (!inviteLink) return;
		await navigator.clipboard.writeText(inviteLink);
		toast.success("تم نسخ رابط الدعوة");
	};

	const hangUp = async () => {
		await room.disconnect();
		onLeave();
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background">
			<RoomAudioRenderer />

			<div className="relative min-h-0 flex-1 overflow-hidden">
				{remoteTrack ? (
					<>
						<VideoTrack
							trackRef={remoteTrack}
							className="size-full object-cover"
						/>
						{/* اسم الضيف — زاوية البداية العلوية (يمين في RTL) كما في التصميم */}
						<span className="absolute top-3 start-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
							{remoteTrack.participant.name || "ضيف"}
						</span>
					</>
				) : admittedRemote ? (
					<div className="flex size-full flex-col items-center justify-center gap-3">
						<div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
							{(admittedRemote.name || "ضيف").slice(0, 2)}
						</div>
						<p className="text-sm font-medium">{admittedRemote.name || "ضيف"}</p>
						<p className="text-xs text-muted-foreground">الكاميرا مغلقة</p>
					</div>
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-3">
						<p className="text-sm text-muted-foreground">
							{isHost ? "بانتظار انضمام صاحب الطفل..." : "بانتظار انضمام المدرّب..."}
						</p>
						{isHost && (
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="gap-1.5 text-foreground"
								onClick={copyInviteLink}
								disabled={!inviteLink}
							>
								<IconLink className="size-4" />
								نسخ رابط الدعوة
							</Button>
						)}
					</div>
				)}

				{/* نافذة المدرّب الصغيرة — زاوية النهاية السفلية (يسار في RTL) كما في التصميم */}
				{localTrack && isCameraEnabled && (
					<div className="absolute bottom-4 end-4 w-56 overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10">
						<VideoTrack
							trackRef={localTrack}
							className="aspect-video w-full object-cover"
							style={{ transform: "scaleX(-1)" }}
						/>
						<span className="absolute bottom-1.5 end-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
							{localParticipant.name || "أنت"}
						</span>
					</div>
				)}

				{chatOpen && <SessionChatPanel onClose={() => setChatOpen(false)} />}
				{isHost && <PendingGuestsPanel />}
			</div>

			{/* شريط التحكم السفلي — المجموعة على يمين الشريط كما في التصميم.
			    أول عنصر في DOM = أقصى اليمين في RTL: الكاميرا ثم المايك ثم الإنهاء
			    (الحمراء يمينًا)، ثم المحادثة والدعوة */}
			<div className="flex h-16 shrink-0 items-center justify-center gap-2.5 border-t bg-background ps-16">
				<Button
					type="button"
					size="icon"
					variant="secondary"
					className={cn("size-12", !isCameraEnabled && MUTED_RED)}
					aria-label={isCameraEnabled ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
					onClick={() => void localParticipant.setCameraEnabled(!isCameraEnabled)}
				>
					{isCameraEnabled ? (
						<IconVideo className="size-5" />
					) : (
						<IconVideoOff className="size-5" />
					)}
				</Button>
				<Button
					type="button"
					size="icon"
					variant="secondary"
					className={cn("size-12", !isMicrophoneEnabled && MUTED_RED)}
					aria-label={isMicrophoneEnabled ? "كتم المايكروفون" : "تشغيل المايكروفون"}
					onClick={() => void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
				>
					{isMicrophoneEnabled ? (
						<IconMicrophone className="size-5" />
					) : (
						<IconMicrophoneOff className="size-5" />
					)}
				</Button>
				<Button
					type="button"
					size="icon"
					className="size-12 bg-red-500 primaryhover:bg-red-600"
					aria-label="إنهاء المكالمة"
					onClick={() => void hangUp()}
				>
					<IconPhoneOff className="size-5" />
				</Button>
				<Button
					type="button"
					size="icon"
					variant="secondary"
					className={cn("size-12", chatOpen && "bg-border")}
					aria-label={chatOpen ? "إغلاق المحادثة" : "فتح المحادثة"}
					onClick={() => setChatOpen((open) => !open)}
				>
					<IconMessage className="size-5" />
				</Button>
				{isHost && (
					<Button
						type="button"
						size="icon"
						variant="secondary"
						className="size-12"
						aria-label="نسخ رابط الدعوة"
						onClick={copyInviteLink}
						disabled={!inviteLink}
					>
						<IconLink className="size-5" />
					</Button>
				)}
			</div>
		</div>
	);
};

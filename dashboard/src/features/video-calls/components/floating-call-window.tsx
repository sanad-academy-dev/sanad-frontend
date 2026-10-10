import {
	LiveKitRoom,
	RoomAudioRenderer,
	useConnectionState,
	useIsSpeaking,
	useLocalParticipant,
	useRemoteParticipants,
	useTracks,
	useTrackToggle,
	VideoTrack,
} from "@livekit/components-react";
import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconMicrophone,
	IconMicrophoneOff,
	IconPhoneOff,
	IconScreenShare,
	IconScreenShareOff,
	IconVideo,
	IconVideoOff,
	IconX,
} from "@tabler/icons-react";
import { ConnectionState, type Participant, Track } from "livekit-client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { useVideoCallToken } from "@/features/video-calls/hooks/use-video-call-token";
import { useCallWindowStore } from "@/features/video-calls/stores/call-window.store";
import { cn } from "@/lib/utils";

/*
 * نافذة المكالمة العائمة بنمط تيليجرام: لوحة داكنة زجاجية، أفاتار كبير
 * بنبض عند التحدث، الاسم والحالة/المؤقّت، وصف أزرار دائرية أسفلها
 * (ميكروفون، كاميرا، مشاركة شاشة، إنهاء). واجهة LiveKit مخصّصة بنا
 * لا شريط أدوات LiveKit الافتراضي. تُسحب من أي سطح غير تفاعلي، وتُصغَّر
 * لكبسولة صغيرة تُبقي الصوت حيًا.
 */

const WINDOW_W = 520;
const WINDOW_H = 520;
const MINI_W = 232;
const MINI_H = 64;
const MARGIN = 16;

const AVATAR_GRADIENT = "bg-[linear-gradient(135deg,#4f6ae0,#7b8cf0)]";

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatElapsed = (seconds: number) => {
	const m = pad2(Math.floor(seconds / 60) % 60);
	const s = pad2(seconds % 60);
	const h = Math.floor(seconds / 3600);
	return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const CALL_PREFIX = /^مكالمة مع\s+/;

const initialsOf = (name: string) =>
	name
		.replace(CALL_PREFIX, "")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

/** حالة الاتصال كنص عربي - تظهر تحت الاسم حتى يبدأ المؤقّت */
const connectionLabel = (state: ConnectionState) => {
	switch (state) {
		case ConnectionState.Connecting:
			return "جارِ الاتصال...";
		case ConnectionState.Reconnecting:
			return "إعادة الاتصال...";
		case ConnectionState.Disconnected:
			return "انقطع الاتصال";
		default:
			return null;
	}
};

export function FloatingCallWindow() {
	const room = useCallWindowStore((s) => s.room);
	const title = useCallWindowStore((s) => s.title);
	const minimized = useCallWindowStore((s) => s.minimized);
	const minimize = useCallWindowStore((s) => s.minimize);
	const restore = useCallWindowStore((s) => s.restore);
	const close = useCallWindowStore((s) => s.close);

	const { call, isLoading, error } = useVideoCallToken(room);

	// موضع النافذة - يبدأ أسفل يسار الشاشة (جهة النهاية في RTL)
	const [pos, setPos] = useState({ x: MARGIN, y: MARGIN });
	const posRef = useRef(pos);
	posRef.current = pos;
	const minimizedRef = useRef(minimized);
	minimizedRef.current = minimized;
	const dragRef = useRef<{
		startX: number;
		startY: number;
		baseX: number;
		baseY: number;
	} | null>(null);
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		if (!room) return;
		setElapsed(0);
		setPos({
			x: MARGIN,
			y: Math.max(MARGIN, window.innerHeight - WINDOW_H - MARGIN),
		});
		const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, [room]);

	// عند التصغير/الاستعادة أبقِ النافذة داخل المنفذ
	useEffect(() => {
		const w = minimized ? MINI_W : WINDOW_W;
		const h = minimized ? MINI_H : WINDOW_H;
		setPos((p) => ({
			x: Math.min(Math.max(p.x, MARGIN), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
			y: Math.min(Math.max(p.y, MARGIN), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
		}));
	}, [minimized]);

	/** السحب من أي سطح غير تفاعلي - مستمعو الحركة على النافذة كلها */
	const onDragStart = (e: React.PointerEvent) => {
		if ((e.target as HTMLElement).closest("button, video, [data-no-drag]")) return;
		e.preventDefault();
		dragRef.current = {
			startX: e.clientX,
			startY: e.clientY,
			baseX: posRef.current.x,
			baseY: posRef.current.y,
		};
		const onMove = (ev: PointerEvent) => {
			const drag = dragRef.current;
			if (!drag) return;
			const w = minimizedRef.current ? MINI_W : WINDOW_W;
			const h = minimizedRef.current ? MINI_H : WINDOW_H;
			setPos({
				x: Math.min(
					Math.max(drag.baseX + (ev.clientX - drag.startX), MARGIN),
					window.innerWidth - w - MARGIN,
				),
				y: Math.min(
					Math.max(drag.baseY + (ev.clientY - drag.startY), MARGIN),
					window.innerHeight - h - MARGIN,
				),
			});
		};
		const onUp = () => {
			dragRef.current = null;
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	if (!room) return null;

	const displayName = title.replace(CALL_PREFIX, "") || "مكالمة فيديو";

	return (
		<div
			dir="rtl"
			onPointerDown={onDragStart}
			style={{
				left: pos.x,
				top: pos.y,
				width: minimized ? MINI_W : WINDOW_W,
				height: minimized ? MINI_H : WINDOW_H,
			}}
			className={cn(
				"fixed z-[70] cursor-move overflow-hidden rounded-[18px] primaryshadow-2xl ring-1 ring-white/10 select-none",
				"bg-[linear-gradient(160deg,#1e2537_0%,#0f1420_55%,#0b0f18_100%)]",
				"transition-[width,height] duration-200 ease-out",
			)}
		>
			{error ? (
				<ErrorBody onClose={close} />
			) : isLoading || !call ? (
				<PendingBody
					name={displayName}
					minimized={minimized}
					onClose={close}
					onRestore={restore}
					onMinimize={minimize}
				/>
			) : (
				<LiveKitRoom
					token={call.token}
					serverUrl={call.serverUrl}
					connect
					audio
					video
					onDisconnected={close}
					className="h-full"
				>
					<RoomAudioRenderer />
					{minimized ? (
						<MiniBody
							name={displayName}
							elapsed={elapsed}
							onRestore={restore}
							onClose={close}
						/>
					) : (
						<FullBody
							name={displayName}
							elapsed={elapsed}
							onMinimize={minimize}
							onClose={close}
						/>
					)}
				</LiveKitRoom>
			)}
		</div>
	);
}

/* ------------- الجسم الكامل ------------- */

function FullBody({
	name,
	elapsed,
	onMinimize,
	onClose,
}: {
	name: string;
	elapsed: number;
	onMinimize: () => void;
	onClose: () => void;
}) {
	const connection = useConnectionState();
	const remotes = useRemoteParticipants();
	const { localParticipant } = useLocalParticipant();
	const peer = remotes[0];
	const status = connectionLabel(connection);

	// فيديو الطرف الآخر (كاميرا أو شاشة) يملأ الخلفية؛ فيديو المحلي في زاوية
	const videoTracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
		onlySubscribed: false,
	});
	const remoteVideo = videoTracks.find(
		(t) => t.participant.identity !== localParticipant.identity && !t.publication?.isMuted,
	);
	const localVideo = videoTracks.find(
		(t) =>
			t.participant.identity === localParticipant.identity &&
			t.source === Track.Source.Camera &&
			!t.publication?.isMuted,
	);

	const peerName = peer?.name || peer?.identity || name;
	const waitingForPeer = connection === ConnectionState.Connected && !peer;

	return (
		<div className="relative flex h-full flex-col">
			{/* فيديو الطرف الآخر كخلفية كاملة */}
			{remoteVideo && (
				<div
					dir="ltr"
					className="absolute inset-0"
				>
					<VideoTrack
						trackRef={remoteVideo}
						className="size-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
				</div>
			)}

			{/* الشريط العلوي: تصغير (يمين) / إغلاق (يسار) */}
			<div className="relative flex items-center justify-between px-3 pt-3">
				<HeaderButton
					label="تصغير المكالمة"
					onClick={onMinimize}
				>
					<IconArrowsDiagonalMinimize2 className="size-4" />
				</HeaderButton>
				<HeaderButton
					label="إغلاق"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</HeaderButton>
			</div>

			{/* المركز: الأفاتار + الاسم + الحالة (الأفاتار يختفي عند وجود فيديو بعيد) */}
			<div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6">
				{!remoteVideo && (
					<div className="relative">
						{/* حلقات النبض عند التحدث - الخطاف يتطلب مشاركًا موجودًا */}
						{peer ? <SpeakingRings participant={peer} /> : <IdleRing />}
						<div
							className={cn(
								"relative flex size-28 items-center justify-center rounded-full text-[40px] font-semibold tracking-wide shadow-xl",
								AVATAR_GRADIENT,
							)}
						>
							{initialsOf(peerName)}
						</div>
					</div>
				)}

				<div
					className={cn("text-center", remoteVideo && "mt-auto mb-2 self-start text-start")}
				>
					<p className="text-[20px] leading-tight font-semibold drop-shadow">{peerName}</p>
					<p className="mt-1 text-[13px] text-white/70 tabular-nums">
						{status ??
							(waitingForPeer ? "في انتظار انضمام الطرف الآخر..." : formatElapsed(elapsed))}
					</p>
				</div>
			</div>

			{/* معاينة الكاميرا المحلية - زاوية سفلية من جهة البداية */}
			{localVideo && (
				<div
					dir="ltr"
					className="absolute end-3 bottom-24 h-[120px] w-[90px] overflow-hidden rounded-[10px] border border-white/20 shadow-lg"
				>
					<VideoTrack
						trackRef={localVideo}
						className="size-full object-cover"
					/>
				</div>
			)}

			<Controls onClose={onClose} />
		</div>
	);
}

/* ------------- الكبسولة المصغّرة ------------- */

function MiniBody({
	name,
	elapsed,
	onRestore,
	onClose,
}: {
	name: string;
	elapsed: number;
	onRestore: () => void;
	onClose: () => void;
}) {
	const remotes = useRemoteParticipants();
	const peer = remotes[0];
	const connection = useConnectionState();
	const status = connectionLabel(connection);
	const { toggle: toggleMic, enabled: micOn } = useTrackToggle({
		source: Track.Source.Microphone,
	});
	const peerName = peer?.name || peer?.identity || name;

	return (
		<div className="flex h-full items-center gap-2.5 px-3">
			<div className="relative shrink-0">
				{peer && <MiniSpeakingRing participant={peer} />}
				<div
					className={cn(
						"relative flex size-9 items-center justify-center rounded-full text-[13px] font-semibold",
						AVATAR_GRADIENT,
					)}
				>
					{initialsOf(peerName)}
				</div>
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-[13px] leading-tight font-semibold">{peerName}</p>
				<p className="text-[11px] text-white/60 tabular-nums">
					{status ?? formatElapsed(elapsed)}
				</p>
			</div>
			<RoundButton
				label={micOn ? "كتم الميكروفون" : "تشغيل الميكروفون"}
				size="sm"
				active={!micOn}
				onClick={() => void toggleMic()}
			>
				{micOn ? (
					<IconMicrophone className="size-4" />
				) : (
					<IconMicrophoneOff className="size-4" />
				)}
			</RoundButton>
			<RoundButton
				label="تكبير المكالمة"
				size="sm"
				onClick={onRestore}
			>
				<IconArrowsDiagonal className="size-4" />
			</RoundButton>
			<RoundButton
				label="إنهاء المكالمة"
				size="sm"
				variant="danger"
				onClick={onClose}
			>
				<IconPhoneOff className="size-4" />
			</RoundButton>
		</div>
	);
}

/* ------------- صف التحكم ------------- */

function Controls({ onClose }: { onClose: () => void }) {
	const { toggle: toggleMic, enabled: micOn } = useTrackToggle({
		source: Track.Source.Microphone,
	});
	const { toggle: toggleCam, enabled: camOn } = useTrackToggle({
		source: Track.Source.Camera,
	});
	const { toggle: toggleScreen, enabled: screenOn } = useTrackToggle({
		source: Track.Source.ScreenShare,
	});

	return (
		<div className="relative flex items-center justify-center gap-4 pt-2 pb-6">
			<RoundButton
				label={screenOn ? "إيقاف مشاركة الشاشة" : "مشاركة الشاشة"}
				active={screenOn}
				onClick={() => void toggleScreen()}
			>
				{screenOn ? (
					<IconScreenShareOff className="size-5" />
				) : (
					<IconScreenShare className="size-5" />
				)}
			</RoundButton>
			<RoundButton
				label={camOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
				active={!camOn}
				onClick={() => void toggleCam()}
			>
				{camOn ? <IconVideo className="size-5" /> : <IconVideoOff className="size-5" />}
			</RoundButton>
			<RoundButton
				label={micOn ? "كتم الميكروفون" : "تشغيل الميكروفون"}
				active={!micOn}
				onClick={() => void toggleMic()}
			>
				{micOn ? (
					<IconMicrophone className="size-5" />
				) : (
					<IconMicrophoneOff className="size-5" />
				)}
			</RoundButton>
			<RoundButton
				label="إنهاء المكالمة"
				variant="danger"
				onClick={onClose}
			>
				<IconPhoneOff className="size-5" />
			</RoundButton>
		</div>
	);
}

/* ------------- حالات ما قبل الاتصال ------------- */

function PendingBody({
	name,
	minimized,
	onClose,
	onRestore,
	onMinimize,
}: {
	name: string;
	minimized: boolean;
	onClose: () => void;
	onRestore: () => void;
	onMinimize: () => void;
}) {
	if (minimized) {
		return (
			<div className="flex h-full items-center gap-2.5 px-3">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
						AVATAR_GRADIENT,
					)}
				>
					{initialsOf(name)}
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-[13px] leading-tight font-semibold">{name}</p>
					<p className="text-[11px] text-white/60">جارِ الاتصال...</p>
				</div>
				<RoundButton
					label="تكبير المكالمة"
					size="sm"
					onClick={onRestore}
				>
					<IconArrowsDiagonal className="size-4" />
				</RoundButton>
				<RoundButton
					label="إنهاء المكالمة"
					size="sm"
					variant="danger"
					onClick={onClose}
				>
					<IconPhoneOff className="size-4" />
				</RoundButton>
			</div>
		);
	}
	return (
		<div className="relative flex h-full flex-col">
			<div className="flex items-center justify-between px-3 pt-3">
				<HeaderButton
					label="تصغير المكالمة"
					onClick={onMinimize}
				>
					<IconArrowsDiagonalMinimize2 className="size-4" />
				</HeaderButton>
				<HeaderButton
					label="إغلاق"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</HeaderButton>
			</div>
			<div className="flex flex-1 flex-col items-center justify-center gap-4">
				<div className="relative">
					<span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
					<div
						className={cn(
							"relative flex size-28 items-center justify-center rounded-full text-[40px] font-semibold shadow-xl",
							AVATAR_GRADIENT,
						)}
					>
						{initialsOf(name)}
					</div>
				</div>
				<div className="text-center">
					<p className="text-[20px] font-semibold">{name}</p>
					<p className="mt-1 text-[13px] text-white/70">جارِ الاتصال...</p>
				</div>
			</div>
			<div className="flex items-center justify-center pt-2 pb-6">
				<RoundButton
					label="إنهاء المكالمة"
					variant="danger"
					onClick={onClose}
				>
					<IconPhoneOff className="size-5" />
				</RoundButton>
			</div>
		</div>
	);
}

function ErrorBody({ onClose }: { onClose: () => void }) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-red-500/20 text-red-300">
				<IconPhoneOff className="size-6" />
			</div>
			<p className="text-[15px] font-semibold">تعذر بدء المكالمة</p>
			<p className="text-[12px] text-white/60">
				تحقق من إعدادات دورة المكالمات ثم أعد المحاولة
			</p>
			<button
				type="button"
				onClick={onClose}
				className="mt-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-white/20"
			>
				إغلاق
			</button>
		</div>
	);
}

/* ------------- مؤشرات التحدث - تُركّب فقط عند وجود مشارك ------------- */

function SpeakingRings({ participant }: { participant: Participant }) {
	const speaking = useIsSpeaking(participant);
	return (
		<>
			<span
				className={cn(
					"absolute inset-0 rounded-full bg-primary/40 transition-opacity",
					speaking ? "animate-ping opacity-60" : "opacity-0",
				)}
			/>
			<span
				className={cn(
					"absolute -inset-2 rounded-full ring-2 transition-colors",
					speaking ? "ring-primary/70" : "ring-white/10",
				)}
			/>
		</>
	);
}

function IdleRing() {
	return <span className="absolute -inset-2 rounded-full ring-2 ring-white/10" />;
}

function MiniSpeakingRing({ participant }: { participant: Participant }) {
	const speaking = useIsSpeaking(participant);
	return (
		<span
			className={cn(
				"absolute -inset-1 rounded-full ring-2 transition-colors",
				speaking ? "ring-primary/80" : "ring-transparent",
			)}
		/>
	);
}

/* ------------- عناصر مساعدة ------------- */

function HeaderButton({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={onClick}
			className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
		>
			{children}
		</button>
	);
}

function RoundButton({
	label,
	onClick,
	children,
	variant = "default",
	active = false,
	size = "md",
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
	variant?: "default" | "danger";
	/** الحالة المطفأة (ميك مكتوم / كاميرا مغلقة) - تُعرض بخلفية بيضاء */
	active?: boolean;
	size?: "md" | "sm";
}) {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={onClick}
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full backdrop-blur transition-all active:scale-95",
				size === "md" ? "size-12" : "size-8",
				variant === "danger"
					? "bg-red-500 primaryshadow-lg shadow-red-500/30 hover:bg-red-400"
					: active
						? "bg-white text-[#0f1420] hover:bg-white/90"
						: "bg-white/15 primaryhover:bg-white/25",
			)}
		>
			{children}
		</button>
	);
}

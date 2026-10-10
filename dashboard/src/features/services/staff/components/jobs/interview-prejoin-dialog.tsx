import {
	IconLink,
	IconMicrophone,
	IconMicrophoneOff,
	IconUsers,
	IconVideo,
	IconVideoOff,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { guestCallUrl } from "@/features/services/staff/utils/interview-room";
import { useVideoCallToken } from "@/features/video-calls/hooks/use-video-call-token";
import { useVideoSessionStore } from "@/features/video-calls/stores/video-session.store";
import { useSession } from "@/lib/auth/client";

// شاشة الاستعداد قبل الانضمام لمقابلة عبر اتصال — نفس تصميم وسير عمل
// «جلسة عن بعد» في الزيارات (session-prejoin-dialog)، مربوطة بقاعة المقابلة.
export function InterviewPrejoinDialog({
	open,
	roomCode,
	candidateName,
	onClose,
}: {
	open: boolean;
	// كود قاعة المقابلة — يُمرَّر إلى صفحة المكالمة عند الانضمام
	roomCode: string | null;
	candidateName: string;
	onClose: () => void;
}) {
	const navigate = useNavigate();
	const { data: session } = useSession();
	const userName = session?.user.name ?? "";

	const {
		audioEnabled,
		videoEnabled,
		audioDeviceId,
		videoDeviceId,
		setAudioEnabled,
		setVideoEnabled,
		setAudioDeviceId,
		setVideoDeviceId,
	} = useVideoSessionStore();

	// الرمز يُطلب هنا لمعرفة اسم القاعة الكامل (رابط الدعوة) والتحقق من التهيئة — كالزيارات
	const { call, isLoading: isTokenLoading } = useVideoCallToken(open ? roomCode : null);

	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	useEffect(() => {
		if (!open) return;
		let cancelled = false;
		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
					audio: true,
				});
				if (cancelled) {
					for (const track of stream.getTracks()) track.stop();
					return;
				}
				// المعاينة مرئية فقط — مقاطع الصوت تُطلب لأخذ إذن أسماء الأجهزة ثم تُكتم
				for (const track of stream.getAudioTracks()) track.stop();
				streamRef.current = stream;
				if (videoRef.current) videoRef.current.srcObject = stream;
				setDevices(await navigator.mediaDevices.enumerateDevices());
			} catch {
				toast.error("تعذر الوصول إلى الكاميرا أو المايكروفون");
				setVideoEnabled(false);
			}
		})();
		return () => {
			cancelled = true;
			if (streamRef.current) {
				for (const track of streamRef.current.getTracks()) track.stop();
				streamRef.current = null;
			}
		};
	}, [open, videoDeviceId, setVideoEnabled]);

	const cameras = devices.filter((d) => d.kind === "videoinput");
	const microphones = devices.filter((d) => d.kind === "audioinput");

	// رابط الدعوة: من اسم القاعة الذي يعيده الخادم إن جهز، وإلا يُبنى محليًا من
	// الأكاديمية النشطة (نفس الصيغة) فيبقى الرابط ظاهرًا وقابلًا للنسخ دائمًا.
	const clinicId = session?.session?.activeClinicId ?? null;
	const roomName = call?.roomName ?? (clinicId && roomCode ? `${clinicId}:${roomCode}` : null);
	const inviteLink = roomName ? guestCallUrl(roomName) : null;

	const copyInviteLink = async () => {
		if (!inviteLink) return;
		await navigator.clipboard.writeText(inviteLink);
		toast.success("تم نسخ رابط الدعوة");
	};

	const handleStart = () => {
		if (!roomCode || !call) return;
		onClose();
		void navigate({ to: "/video-call", search: { room: roomCode } });
	};

	const initials = userName
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => !next && onClose()}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85svh] grid-rows-[auto_minmax(0,1fr)] gap-0 p-0 sm:max-w-[min(48rem,calc(100%-2rem))]"
			>
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle className="text-base">مقابلة عن بعد — {candidateName}</DialogTitle>
				</DialogHeader>

				<div className="flex min-w-0 gap-4 overflow-y-auto p-4 max-md:flex-col">
					{/* لوحة المشاركين + البدء */}
					<div className="flex w-64 shrink-0 flex-col gap-3 max-md:w-full">
						<div className="flex flex-col gap-3 rounded-lg border p-3">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-1.5">
									<IconUsers className="size-4 text-muted-foreground" />
									<span className="text-sm font-semibold">المشاركون</span>
								</div>
								<Button
									type="button"
									size="xs"
									variant="ghost"
									className="h-7 gap-1 text-xs text-primary hover:text-primary"
									onClick={copyInviteLink}
									disabled={!inviteLink}
								>
									<IconLink className="size-3.5" />
									دعوة
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
									{initials}
								</div>
								<span className="min-w-0 truncate text-sm">{userName}</span>
								<span className="text-xs text-muted-foreground">(أنت)</span>
								<span className="ms-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
									المضيف
								</span>
							</div>
							<p className="text-xs text-muted-foreground">
								فقط المضيف يمكنه دعوة المشاركين — انسخ رابط الاجتماع وأرسله للمرشّح.
							</p>
						</div>

						<Button
							type="button"
							className="mt-auto w-full"
							onClick={handleStart}
							disabled={isTokenLoading || !call}
						>
							بدء المقابلة
						</Button>
					</div>

					{/* معاينة الكاميرا */}
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						<div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
							{videoEnabled ? (
								<video
									ref={videoRef}
									autoPlay
									muted
									playsInline
									className="size-full object-cover"
									style={{ transform: "scaleX(-1)" }}
								/>
							) : (
								<div className="flex size-full items-center justify-center">
									<div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
										{initials}
									</div>
								</div>
							)}
							<span className="absolute bottom-2 start-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
								{userName}
							</span>
							<div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
								<Button
									type="button"
									size="icon"
									variant={audioEnabled ? "secondary" : "destructive"}
									className="rounded-full"
									aria-label={audioEnabled ? "كتم المايكروفون" : "تشغيل المايكروفون"}
									onClick={() => setAudioEnabled(!audioEnabled)}
								>
									{audioEnabled ? (
										<IconMicrophone className="size-4" />
									) : (
										<IconMicrophoneOff className="size-4" />
									)}
								</Button>
								<Button
									type="button"
									size="icon"
									variant={videoEnabled ? "secondary" : "destructive"}
									className="rounded-full"
									aria-label={videoEnabled ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
									onClick={() => setVideoEnabled(!videoEnabled)}
								>
									{videoEnabled ? (
										<IconVideo className="size-4" />
									) : (
										<IconVideoOff className="size-4" />
									)}
								</Button>
							</div>
						</div>

						{/* اختيار الأجهزة */}
						<div className="flex gap-2">
							<Select
								dir="rtl"
								value={videoDeviceId ?? cameras[0]?.deviceId ?? ""}
								onValueChange={setVideoDeviceId}
								disabled={cameras.length === 0}
							>
								<SelectTrigger
									size="sm"
									className="min-w-0 flex-1"
								>
									<div className="flex min-w-0 items-center gap-1.5">
										<IconVideo className="size-4 shrink-0 text-muted-foreground" />
										<span className="min-w-0 truncate text-xs">
											{cameras.find(
												(c) => c.deviceId === (videoDeviceId ?? cameras[0]?.deviceId),
											)?.label || "الكاميرا"}
										</span>
									</div>
								</SelectTrigger>
								<SelectContent
									dir="rtl"
									position="popper"
								>
									{cameras.map((c) => (
										<SelectItem
											key={c.deviceId}
											value={c.deviceId}
											textValue={c.label}
										>
											<span className="max-w-56 truncate">{c.label || "كاميرا"}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								dir="rtl"
								value={audioDeviceId ?? microphones[0]?.deviceId ?? ""}
								onValueChange={setAudioDeviceId}
								disabled={microphones.length === 0}
							>
								<SelectTrigger
									size="sm"
									className="min-w-0 flex-1"
								>
									<div className="flex min-w-0 items-center gap-1.5">
										<IconMicrophone className="size-4 shrink-0 text-muted-foreground" />
										<span className="min-w-0 truncate text-xs">
											{microphones.find(
												(m) => m.deviceId === (audioDeviceId ?? microphones[0]?.deviceId),
											)?.label || "المايكروفون"}
										</span>
									</div>
								</SelectTrigger>
								<SelectContent
									dir="rtl"
									position="popper"
								>
									{microphones.map((m) => (
										<SelectItem
											key={m.deviceId}
											value={m.deviceId}
											textValue={m.label}
										>
											<span className="max-w-56 truncate">{m.label || "مايكروفون"}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

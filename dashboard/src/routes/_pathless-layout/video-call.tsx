import { IconCopy, IconVideo, IconVideoPlus } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoCallRoom } from "@/features/video-calls/components/video-call-room";
import { useVideoCallToken } from "@/features/video-calls/hooks/use-video-call-token";
import { useI18n } from "@/hooks/use-i18n";

export const Route = createFileRoute("/_pathless-layout/video-call")({
	validateSearch: (search): { room?: string } => {
		const raw = (search as { room?: string }).room;
		return { room: typeof raw === "string" && raw ? raw : undefined };
	},
	component: RouteComponent,
});

// كود قاعة قصير قابل للمشاركة — مؤقت حتى تُربط المكالمة بموعد الزيارة
const generateRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

function RouteComponent() {
	const { room } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { t } = useI18n();
	const [roomInput, setRoomInput] = useState("");

	const { call, isLoading, error } = useVideoCallToken(room ?? null);

	const joinRoom = (code: string) => {
		const trimmed = code.trim();
		if (!trimmed) return;
		void navigate({ search: { room: trimmed } });
	};

	const leaveRoom = () => {
		void navigate({ search: {} });
	};

	// رابط دعوة عام لصفحة الضيوف — يحمل اسم القاعة الكامل (ببادئة الأكاديمية)
	const copyInviteLink = async (fullRoomName: string) => {
		const url = `${window.location.origin}/call/${encodeURIComponent(fullRoomName)}`;
		await navigator.clipboard.writeText(url);
		toast.success(t("videoCall.room.copied"));
	};

	if (!room) {
		return (
			<div className="flex flex-1 items-center justify-center p-4">
				<div className="flex w-full max-w-md flex-col gap-4 rounded-lg border p-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<IconVideo className="size-6" />
						</div>
						<h2 className="text-lg font-semibold">{t("videoCall.lobby.title")}</h2>
						<p className="text-sm text-muted-foreground">{t("videoCall.lobby.description")}</p>
					</div>
					<Button onClick={() => joinRoom(generateRoomCode())}>
						<IconVideoPlus className="size-4" />
						{t("videoCall.lobby.start")}
					</Button>
					<div className="flex items-center gap-2">
						<hr className="flex-1" />
						<span className="text-xs text-muted-foreground">{t("videoCall.lobby.or")}</span>
						<hr className="flex-1" />
					</div>
					<form
						className="flex gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							joinRoom(roomInput);
						}}
					>
						<Input
							value={roomInput}
							onChange={(e) => setRoomInput(e.target.value)}
							placeholder={t("videoCall.lobby.roomPlaceholder")}
						/>
						<Button
							type="submit"
							variant="outline"
							disabled={!roomInput.trim()}
						>
							{t("videoCall.lobby.join")}
						</Button>
					</form>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-sm text-muted-foreground">{t("videoCall.room.connecting")}</p>
			</div>
		);
	}

	if (error || !call) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
				<p className="text-sm text-destructive">
					{error instanceof Error ? error.message : t("videoCall.room.error")}
				</p>
				<Button
					variant="outline"
					onClick={leaveRoom}
				>
					{t("videoCall.room.back")}
				</Button>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
				<div className="flex items-center gap-2 text-sm">
					<span className="text-muted-foreground">{t("videoCall.room.code")}</span>
					<code
						dir="ltr"
						className="rounded bg-muted px-2 py-0.5 font-mono text-xs"
					>
						{room}
					</code>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => copyInviteLink(call.roomName)}
					>
						<IconCopy className="size-4" />
						{t("videoCall.room.copy")}
					</Button>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={leaveRoom}
				>
					{t("videoCall.room.leave")}
				</Button>
			</div>
			<VideoCallRoom
				call={call}
				onDisconnected={leaveRoom}
			/>
		</div>
	);
}

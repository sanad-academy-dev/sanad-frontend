import { LiveKitRoom } from "@livekit/components-react";
import { IconVideo, IconX } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuestCallGate } from "@/features/video-calls/components/guest-call-gate";
import { GuestQuestionnairePanel } from "@/features/video-calls/components/guest-questionnaire-panel";
import { useGuestCallToken } from "@/features/video-calls/hooks/use-guest-call-token";
import { useI18n } from "@/hooks/use-i18n";

import "@livekit/components-styles/index.css";

// صفحة انضمام الضيوف (أصحاب الأطفال) عبر رابط الدعوة — بلا تسجيل دخول.
// بعد القبول يرى الضيف نفس واجهة مكالمة المدرّب لكن بلا اللوحة الجانبية
export const Route = createFileRoute("/call/$room")({
	component: GuestCallPage,
	ssr: false,
});

const formatElapsed = (seconds: number) => {
	const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
	const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
	const s = String(seconds % 60).padStart(2, "0");
	return `${h}:${m}:${s}`;
};

function GuestCallPage() {
	const { room } = Route.useParams();
	const { t } = useI18n();
	const [nameInput, setNameInput] = useState("");
	const [guestName, setGuestName] = useState<string | null>(null);
	const [hasLeft, setHasLeft] = useState(false);
	const [elapsed, setElapsed] = useState(0);

	const { call, isLoading, error } = useGuestCallToken(room, guestName);
	const inCall = !!guestName && !!call;

	useEffect(() => {
		if (!inCall) return;
		const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, [inCall]);

	const joinCall = () => {
		const trimmed = nameInput.trim();
		if (!trimmed) return;
		setHasLeft(false);
		setGuestName(trimmed);
	};

	const leaveCall = () => {
		setGuestName(null);
		setHasLeft(true);
	};

	if (hasLeft) {
		return (
			<main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background p-4 text-center">
				<p className="text-sm text-muted-foreground">{t("videoCall.guest.ended")}</p>
				<Button
					variant="outline"
					onClick={joinCall}
				>
					{t("videoCall.guest.rejoin")}
				</Button>
			</main>
		);
	}

	if (!guestName) {
		return (
			<main className="flex min-h-svh items-center justify-center bg-background p-4">
				<div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<IconVideo className="size-6" />
						</div>
						<h1 className="text-lg font-semibold">{t("videoCall.guest.title")}</h1>
						<p className="text-sm text-muted-foreground">{t("videoCall.guest.description")}</p>
					</div>
					<form
						className="flex flex-col gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							joinCall();
						}}
					>
						<Input
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
							placeholder={t("videoCall.guest.namePlaceholder")}
							autoFocus
						/>
						<Button
							type="submit"
							disabled={!nameInput.trim()}
						>
							{t("videoCall.guest.join")}
						</Button>
					</form>
				</div>
			</main>
		);
	}

	if (isLoading) {
		return (
			<main className="flex min-h-svh items-center justify-center bg-background">
				<p className="text-sm text-muted-foreground">{t("videoCall.room.connecting")}</p>
			</main>
		);
	}

	if (error || !call) {
		return (
			<main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background p-4 text-center">
				<p className="text-sm text-destructive">
					{error instanceof Error ? error.message : t("videoCall.room.error")}
				</p>
				<Button
					variant="outline"
					onClick={() => setGuestName(null)}
				>
					{t("videoCall.room.back")}
				</Button>
			</main>
		);
	}

	// نفس تخطيط صفحة المدرّب: هيدر بعنوان الجلسة والمؤقّت — بلا لوحة الزيارة الجانبية
	return (
		<main className="flex h-svh flex-col bg-background">
			<header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
				<div className="flex min-w-0 items-center gap-2 text-sm">
					<span className="font-semibold">جلسة عن بعد</span>
					<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
						<span className="size-1.5 animate-pulse rounded-full bg-red-500" />
						جارية الآن
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-3">
					<span
						className="text-sm tabular-nums text-muted-foreground"
						dir="ltr"
					>
						{formatElapsed(elapsed)}
					</span>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-8"
						aria-label="مغادرة الجلسة"
						onClick={leaveCall}
					>
						<IconX className="size-4" />
					</Button>
				</div>
			</header>

			<div className="flex min-h-0 flex-1">
				{/* منطقة المكالمة — أول عنصر في DOM = يمين الصفحة RTL */}
				<LiveKitRoom
					token={call.token}
					serverUrl={call.serverUrl}
					connect
					// الضيف ينضم صامتًا (قاعة انتظار) — تُفعَّل أجهزته بعد قبول المضيف
					audio={false}
					video={false}
					onDisconnected={leaveCall}
					data-lk-theme="default"
					className="flex min-h-0 min-w-0 flex-1 flex-col"
				>
					<GuestCallGate onLeave={leaveCall} />
				</LiveKitRoom>

				{/* الاستبيان الطبي — شريط جانبي على يسار الصفحة كما عند المدرّب */}
				<aside
					dir="rtl"
					className="flex w-90 shrink-0 flex-col border-s bg-background max-lg:hidden"
				>
					<div className="flex h-12 shrink-0 items-center border-b px-4">
						<p className="text-sm font-semibold">الاستبيان الطبي</p>
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto p-4">
						<GuestQuestionnairePanel room={room} />
					</div>
				</aside>
			</div>
		</main>
	);
}

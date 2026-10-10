import { LiveKitRoom } from "@livekit/components-react";
import { IconChevronLeft, IconX } from "@tabler/icons-react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicalExamTab } from "@/features/appointments/components/tabs/clinical-exam/clinical-exam-tab";
import { VisitInfoTab } from "@/features/appointments/components/tabs/visit-info-tab";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { SessionCall } from "@/features/video-calls/components/session-call";
import { SessionPatientFile } from "@/features/video-calls/components/session-patient-file";
import { SessionQuestionnaire } from "@/features/video-calls/components/session-questionnaire";
import { SessionSummaryDialog } from "@/features/video-calls/components/session-summary-dialog";
import { useVideoCallToken } from "@/features/video-calls/hooks/use-video-call-token";
import { useVideoSessionStore } from "@/features/video-calls/stores/video-session.store";
import { getOnboardingStatus } from "@/functions/get-onboarding-status";
import { cn } from "@/lib/utils";

// صفحة الجلسة عن بعد بملء الشاشة (بدون الشريط الجانبي): فيديو المكالمة يمينًا
// ولوحة معلومات الزيارة يسارًا — المدرّب الداخل هو مضيف القاعة
export const Route = createFileRoute("/session/$appointmentId")({
	component: SessionPage,
	ssr: false,
	beforeLoad: async () => {
		const { session, onboardingCompleted } = await getOnboardingStatus();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		if (!onboardingCompleted) {
			throw redirect({ to: "/onboarding" });
		}
	},
});

const formatElapsed = (seconds: number) => {
	const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
	const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
	const s = String(seconds % 60).padStart(2, "0");
	return `${h}:${m}:${s}`;
};

function SessionPage() {
	const { appointmentId } = Route.useParams();
	const navigate = useNavigate();
	const { appointment } = useAppointment(appointmentId);
	const { call, isLoading, error } = useVideoCallToken(appointmentId);
	const { audioEnabled, videoEnabled, audioDeviceId, videoDeviceId } = useVideoSessionStore();

	const [summaryOpen, setSummaryOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("patient-file");
	const [elapsed, setElapsed] = useState(0);
	useEffect(() => {
		const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	const leave = () =>
		void navigate({ to: "/appointments", search: { period: "day", view: "all" } });

	const inviteLink = call
		? `${window.location.origin}/call/${encodeURIComponent(call.roomName)}`
		: null;

	return (
		<main className="flex h-svh flex-col bg-background">
			<header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4">
				<div className="flex min-w-0 items-center gap-2 text-sm">
					<Link
						to="/appointments"
						search={{ period: "day", view: "all" }}
						className="shrink-0 text-muted-foreground hover:text-foreground"
					>
						الزيارات
					</Link>
					<IconChevronLeft className="size-4 shrink-0 text-muted-foreground" />
					<span className="shrink-0 font-semibold">جلسة عن بعد</span>
					{appointment && (
						<>
							<span className="truncate font-semibold">{appointment.patient.name}</span>
							<span
								className="shrink-0 text-xs tabular-nums text-muted-foreground"
								dir="ltr"
							>
								{appointment.code}
							</span>
							<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
								<span className="size-1.5 animate-pulse rounded-full bg-red-500" />
								جارية الآن
							</span>
						</>
					)}
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
						aria-label="إغلاق الجلسة"
						onClick={leave}
					>
						<IconX className="size-4" />
					</Button>
				</div>
			</header>

			<div className="flex min-h-0 flex-1">
				{/* منطقة المكالمة — أول عنصر في DOM = يمين الصفحة RTL */}
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					{call ? (
						<LiveKitRoom
							token={call.token}
							serverUrl={call.serverUrl}
							connect
							audio={
								audioEnabled ? (audioDeviceId ? { deviceId: audioDeviceId } : true) : false
							}
							video={
								videoEnabled ? (videoDeviceId ? { deviceId: videoDeviceId } : true) : false
							}
							onDisconnected={leave}
							data-lk-theme="default"
							className="flex min-h-0 flex-1 flex-col"
						>
							<SessionCall
								inviteLink={inviteLink}
								onLeave={leave}
							/>
						</LiveKitRoom>
					) : (
						<div className="flex flex-1 items-center justify-center bg-neutral-950">
							<p className="text-sm text-white/70">
								{isLoading
									? "جارٍ الاتصال..."
									: error instanceof Error
										? error.message
										: "تعذر الاتصال بالجلسة"}
							</p>
						</div>
					)}
				</div>

				{/* لوحة معلومات الزيارة — يسار الصفحة، حدّها على جهة البداية (بينها وبين الفيديو).
				    تتوسع تلقائيًا على تبويبَي التشخيص ومعلومات الزيارة لكثافة محتواهما */}
				<aside
					dir="rtl"
					className={cn(
						"flex shrink-0 flex-col border-s bg-background transition-[width] duration-200 max-lg:hidden",
						activeTab === "visit-info" || activeTab === "clinical-exam" ? "w-180" : "w-125",
					)}
				>
					<Tabs
						dir="rtl"
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex min-h-0 flex-1 flex-col gap-0"
					>
						<div className="px-3 py-2">
							{/* تبويبات على خلفية بيضاء كما في التصميم — شرائح بحدود بدل الخلفية الرمادية */}
							<TabsList className="h-auto w-full flex-wrap justify-start gap-1.5 bg-transparent p-0">
								<TabsTrigger
									className="flex-none rounded-md border-border bg-background px-2.5 py-1.5"
									value="patient-file"
								>
									ملف الطفل
								</TabsTrigger>
								<TabsTrigger
									className="flex-none rounded-md border-border bg-background px-2.5 py-1.5"
									value="questionnaire"
								>
									الاستبيان الطبي
								</TabsTrigger>
								<TabsTrigger
									className="flex-none rounded-md border-border bg-background px-2.5 py-1.5"
									value="clinical-exam"
								>
									التشخيص
								</TabsTrigger>
								<TabsTrigger
									className="flex-none rounded-md border-border bg-background px-2.5 py-1.5"
									value="visit-info"
								>
									معلومات الزيارة
								</TabsTrigger>
							</TabsList>
						</div>
						<Separator />
						<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
							<TabsContent
								value="patient-file"
								className="min-h-0 overflow-y-auto p-4"
							>
								{appointment && <SessionPatientFile appointment={appointment} />}
							</TabsContent>
							<TabsContent
								value="questionnaire"
								className="min-h-0 overflow-y-auto p-4"
							>
								{appointment && <SessionQuestionnaire appointment={appointment} />}
							</TabsContent>
							<VisitInfoTab appointmentId={appointmentId} />
							<ClinicalExamTab appointmentId={appointmentId} />
						</div>
					</Tabs>
					<Separator />
					<div className="flex items-center gap-2 p-3">
						<Button
							type="button"
							className="flex-1"
							onClick={() => setSummaryOpen(true)}
						>
							تلخيص الجلسة
						</Button>
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							disabled
							title="قريبًا"
						>
							إضافة ملاحظات SOAP
						</Button>
					</div>
				</aside>
			</div>

			{appointment && (
				<SessionSummaryDialog
					appointmentId={appointmentId}
					status={appointment.status}
					patientName={appointment.patient.name}
					open={summaryOpen}
					onOpenChange={setSummaryOpen}
					onEnded={leave}
				/>
			)}
		</main>
	);
}

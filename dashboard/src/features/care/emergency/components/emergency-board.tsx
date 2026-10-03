import {
	IconAlertTriangle,
	IconClipboardCheck,
	IconClock,
	IconFlask,
	IconHeartbeat,
	IconNotes,
	IconPaw,
	IconPill,
	IconRadioactive,
	IconStethoscope,
	IconUser,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TriageBadge, WaitClock } from "@/features/care/emergency/components/triage-badge";
import { EMERGENCY_TICK_MS } from "@/features/care/emergency/hooks/use-emergency";
import {
	formatWait,
	PATIENT_ALERT_LABELS,
	PATIENT_ALERT_TONES,
	STABILITY_TONES,
	TRIAGE_TONES,
	waitedMinutes,
	waitState,
} from "@/features/care/emergency/utils/triage-display";
import type {
	ArrivalStatus,
	EmergencyStability,
	TriageCategory,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { TRIAGE_RULES } from "@sanad/contracts/runtime/server/emergency/emergency.rules";
import {
	ARRIVAL_STATUS_LABELS,
	EMERGENCY_STAGE_LABELS,
	type EmergencyStage,
	STABILITY_LABELS,
} from "@sanad/contracts/runtime/server/emergency/emergency.workflow";

/**
 * [E5] لوحة الطوارئ — **أعمدة مراحل**، واللون شريطٌ على البطاقة.
 *
 * الطبقة الأولى من الوحدة كانت لوحة ألوان: تقول «من الأشدّ؟» ولا تقول «ماذا يحدث له
 * الآن؟». صالة الطوارئ تسأل الثاني: من لم يُفرز، من ينتظر المدرّب، من قيد العلاج ومتى
 * يُعاد تقييمه، ومن جاهز للقرار. فالمراحل هي الأقسام، والترتيب داخل القسم يبقى من
 * الخادم (الأشدّ أعلى) فلا يُعاد هنا.
 *
 * والمرحلة **مشتقّة** على الخادم من حالتَي الوصول والزيارة (`emergencyStageOf`)، لا
 * مخزَّنة — فاللوحة والزيارة يقولان الشيء نفسه دائمًا.
 */

export type BoardProgress = {
	vitals: number;
	exam: "NONE" | "STARTED" | "COMPLETED";
	note: string | null;
	labs: number;
	radiology: number;
	prescriptions: number;
};

export type BoardRow = {
	id: string;
	code: string;
	status: string;
	triageCategory: TriageCategory | null;
	arrivedAt: string | Date | null;
	startsAt: string | Date;
	reason: string | null;
	stage: EmergencyStage;
	reassessmentOverdue: boolean;
	minutesToReassess: number | null;
	progress: BoardProgress;
	emergencyArrival: {
		id: string;
		status: ArrivalStatus;
		stability: EmergencyStability | null;
		lastReassessedAt: string | Date | null;
		presentingComplaint: string;
	} | null;
	patient: {
		id: string;
		name: string;
		code: string;
		animalType: { arName: string } | null;
		alerts: { id: string; kind: string; label: string; severity: string }[];
	} | null;
	owner: { id: string; name: string; phone: string } | null;
	staff: { id: string; name: string } | null;
	triageAssessments: { id: string; category: TriageCategory; attScore: number | null }[];
};

export type BoardArrival = {
	id: string;
	code: string;
	status: ArrivalStatus;
	arrivedAt: string | Date | null;
	expectedAt: string | Date | null;
	provisionalLabel: string | null;
	presentingComplaint: string;
	patient: { id: string; name: string } | null;
	owner: { id: string; name: string } | null;
};

const STAGE_ORDER: EmergencyStage[] = [
	"EN_ROUTE",
	"UNTRIAGED",
	"TRIAGED_WAITING",
	"IN_TREATMENT",
];

export const EmergencyBoard = ({
	rows,
	arrivals,
	isLoading,
	onReassess,
	onDispose,
	onStartTreatment,
	onTriageArrival,
	onConfirmArrival,
}: {
	rows: BoardRow[];
	arrivals: BoardArrival[];
	isLoading: boolean;
	onReassess: (appointmentId: string) => void;
	onDispose: (appointmentId: string) => void;
	onStartTreatment: (appointmentId: string) => void;
	onTriageArrival: (arrival: BoardArrival) => void;
	onConfirmArrival: (arrivalId: string) => void;
}) => {
	// نبض محلّي: الساعات تدقّ بين جولات الشبكة فلا يبدو الرقم جامدًا
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), EMERGENCY_TICK_MS);
		return () => clearInterval(id);
	}, []);

	const byStage = useMemo(() => {
		const map = new Map<EmergencyStage, BoardRow[]>();
		for (const row of rows) {
			const list = map.get(row.stage) ?? [];
			list.push(row);
			map.set(row.stage, list);
		}
		return map;
	}, [rows]);

	const enRoute = arrivals.filter((a) => a.status === "EN_ROUTE");
	const untriaged = arrivals.filter((a) => a.status === "ARRIVED");

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-20 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	if (rows.length === 0 && arrivals.length === 0) {
		return (
			<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
				لا حالات في صالة الطوارئ الآن
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{STAGE_ORDER.map((stage) => {
				const list = byStage.get(stage) ?? [];
				const arrivalList =
					stage === "EN_ROUTE" ? enRoute : stage === "UNTRIAGED" ? untriaged : [];
				const count = list.length + arrivalList.length;
				if (count === 0) return null;
				const isTreatment = stage === "IN_TREATMENT";
				return (
					<section
						key={stage}
						className="flex flex-col gap-2"
					>
						<header
							className={cn(
								"flex items-center gap-2 rounded-md border px-3 py-2",
								stage === "UNTRIAGED" && "border-dashed",
								isTreatment && "bg-muted/40",
							)}
						>
							{stage === "UNTRIAGED" ? (
								<IconAlertTriangle className="size-4 shrink-0 text-muted-foreground" />
							) : isTreatment ? (
								<IconStethoscope className="size-4 shrink-0 text-muted-foreground" />
							) : (
								<IconClock className="size-4 shrink-0 text-muted-foreground" />
							)}
							<span className="font-medium text-sm">{EMERGENCY_STAGE_LABELS[stage]}</span>
							<span className="ms-auto text-muted-foreground text-xs tabular-nums">
								{count}
							</span>
						</header>
						<div className="flex flex-col gap-2">
							{arrivalList.map((arrival) => (
								<ArrivalCard
									key={arrival.id}
									arrival={arrival}
									now={now}
									onTriage={onTriageArrival}
									onConfirm={onConfirmArrival}
								/>
							))}
							{list.map((row) => (
								<BoardCard
									key={row.id}
									row={row}
									now={now}
									onReassess={onReassess}
									onDispose={onDispose}
									onStartTreatment={onStartTreatment}
								/>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
};

/** بطاقة وصولٍ لم يُفرز — على اللوحة كي لا يُنسى في تبويب آخر */
const ArrivalCard = ({
	arrival,
	now,
	onTriage,
	onConfirm,
}: {
	arrival: BoardArrival;
	now: number;
	onTriage: (arrival: BoardArrival) => void;
	onConfirm: (arrivalId: string) => void;
}) => {
	const isEnRoute = arrival.status === "EN_ROUTE";
	const minutes = waitedMinutes(arrival.arrivedAt, now);
	return (
		<div className="flex items-stretch overflow-hidden rounded-md border">
			<span className="w-1 shrink-0 bg-muted" />
			<div className="flex flex-1 items-center gap-3 px-3 py-2">
				<IconPaw className="size-4 shrink-0 text-muted-foreground" />
				<div className="flex min-w-0 flex-col gap-0.5">
					<div className="flex items-center gap-2">
						<span className="font-medium text-sm">
							{arrival.patient?.name ?? arrival.provisionalLabel ?? "غير مسجَّل"}
						</span>
						<Badge
							variant="outline"
							className="text-[11px]"
						>
							{ARRIVAL_STATUS_LABELS[arrival.status]}
						</Badge>
					</div>
					<span className="truncate text-muted-foreground text-xs">
						{arrival.presentingComplaint}
					</span>
				</div>
				<div className="ms-auto flex items-center gap-2">
					{!isEnRoute && minutes != null ? (
						<span className="inline-flex items-center gap-1 text-muted-foreground text-xs tabular-nums">
							<IconClock className="size-3.5" />
							{formatWait(minutes)}
						</span>
					) : null}
					{isEnRoute ? (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onConfirm(arrival.id)}
						>
							تأكيد الوصول
						</Button>
					) : (
						<Button
							size="sm"
							onClick={() => onTriage(arrival)}
						>
							فرز
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

const BoardCard = ({
	row,
	now,
	onReassess,
	onDispose,
	onStartTreatment,
}: {
	row: BoardRow;
	now: number;
	onReassess: (appointmentId: string) => void;
	onDispose: (appointmentId: string) => void;
	onStartTreatment: (appointmentId: string) => void;
}) => {
	const minutes = waitedMinutes(row.arrivedAt, now);
	const state = waitState(row.triageCategory, minutes);
	const att = row.triageAssessments[0]?.attScore ?? null;
	const stability = row.emergencyArrival?.stability ?? null;
	const inTreatment = row.stage === "IN_TREATMENT";
	const ready = inTreatment && stability === "STABLE";
	const cadence = row.triageCategory
		? TRIAGE_RULES[row.triageCategory].reassessmentMinutes
		: null;

	return (
		<div
			className={cn(
				"flex w-full items-stretch gap-0 overflow-hidden rounded-md border",
				ready && "border-primary/40",
				row.reassessmentOverdue && inTreatment && "border-destructive/40",
			)}
		>
			{/* الشريط الملوّن على حافّة البداية — منطقيّ لا فيزيائيّ فينعكس مع الاتجاه */}
			<span
				className={cn(
					"w-1 shrink-0",
					row.triageCategory ? TRIAGE_TONES[row.triageCategory].stripe : "bg-muted",
				)}
			/>
			<div className="flex flex-1 flex-col gap-1.5 px-3 py-2">
				<div className="flex items-center gap-2">
					<IconPaw className="size-4 shrink-0 text-muted-foreground" />
					<span className="font-medium text-sm">{row.patient?.name ?? "غير مسجَّل"}</span>
					{row.patient?.animalType?.arName ? (
						<span className="text-muted-foreground text-xs">
							{row.patient.animalType.arName}
						</span>
					) : null}
					{row.triageCategory ? <TriageBadge category={row.triageCategory} /> : null}
					{att != null ? (
						<Badge
							variant="outline"
							className="text-[11px]"
							title="درجة ATT — شدّة الإصابة"
						>
							ATT {att}
						</Badge>
					) : null}
					{stability ? (
						<span
							className={cn(
								"rounded px-1.5 py-0.5 text-[11px] leading-none",
								STABILITY_TONES[stability],
							)}
						>
							{STABILITY_LABELS[stability]}
						</span>
					) : null}
					<span className="ms-auto">
						{inTreatment ? (
							<ReassessChip
								overdue={row.reassessmentOverdue}
								minutes={row.minutesToReassess}
								cadence={cadence}
							/>
						) : (
							<WaitClock
								minutes={minutes}
								state={state}
								category={row.triageCategory}
							/>
						)}
					</span>
				</div>

				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					{row.owner?.name ? (
						<span className="inline-flex items-center gap-1">
							<IconUser className="size-3.5" />
							{row.owner.name}
						</span>
					) : null}
					{row.staff?.name ? (
						<span className="inline-flex items-center gap-1">
							<IconStethoscope className="size-3.5" />
							{row.staff.name}
						</span>
					) : null}
					{(row.emergencyArrival?.presentingComplaint ?? row.reason) ? (
						<span className="truncate">
							{row.emergencyArrival?.presentingComplaint ?? row.reason}
						</span>
					) : null}
				</div>

				{/* تنبيهات السلامة — تُقرأ قبل لمس الطفل لا بعده */}
				{row.patient?.alerts && row.patient.alerts.length > 0 ? (
					<div className="flex flex-wrap items-center gap-1">
						{row.patient.alerts.map((alert) => (
							<span
								key={alert.id}
								className={cn(
									"rounded px-1.5 py-0.5 text-[11px] leading-none",
									PATIENT_ALERT_TONES[alert.kind] ?? PATIENT_ALERT_TONES.OTHER,
								)}
							>
								{PATIENT_ALERT_LABELS[alert.kind] ?? "تنبيه"}: {alert.label}
							</span>
						))}
					</div>
				) : null}

				{/* شريط التقدّم + الإجراءات — أدوات الزيارة نفسها لا ورقة ثانية (القرار ٢) */}
				{inTreatment || row.stage === "TRIAGED_WAITING" ? (
					<div className="flex flex-wrap items-center gap-1.5 pt-0.5">
						{inTreatment ? <ProgressStrip progress={row.progress} /> : null}
						<span className="ms-auto flex items-center gap-1.5">
							<Button
								size="sm"
								variant="outline"
								onClick={() => onReassess(row.id)}
							>
								إعادة تقييم
							</Button>
							{/* [E5.5] الطريق إلى «قيد العلاج». الأحمر يمشي وحده عند الفرز، وما دونه
							    كان يقف هنا بلا زرّ — والقرار يشترط «جاري الدورة»، فيُسدّ الطرفان. */}
							{inTreatment ? (
								<Button
									size="sm"
									variant={ready ? "default" : "outline"}
									onClick={() => onDispose(row.id)}
								>
									قرار
								</Button>
							) : (
								<Button
									size="sm"
									onClick={() => onStartTreatment(row.id)}
								>
									بدء العلاج
								</Button>
							)}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
};

const ReassessChip = ({
	overdue,
	minutes,
	cadence,
}: {
	overdue: boolean;
	minutes: number | null;
	cadence: number | null;
}) => {
	if (minutes == null) {
		return (
			<span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] text-destructive leading-none">
				<IconAlertTriangle className="size-3" />
				لم يُقيَّم
			</span>
		);
	}
	if (overdue) {
		return (
			<span
				className="inline-flex items-center gap-1 rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] text-destructive leading-none tabular-nums"
				title={cadence ? `إيقاع اللون: كل ${cadence} دقيقة` : undefined}
			>
				<IconAlertTriangle className="size-3" />
				إعادة التقييم متأخّرة {Math.abs(minutes)} د
			</span>
		);
	}
	return (
		<span
			className="inline-flex items-center gap-1 text-muted-foreground text-xs tabular-nums"
			title={cadence ? `إيقاع اللون: كل ${cadence} دقيقة` : undefined}
		>
			<IconClock className="size-3.5" />
			إعادة تقييم بعد {minutes} د
		</span>
	);
};

/** ما أُنجز من أدوات الزيارة — يُقرأ بطرف العين في ممرّ */
const ProgressStrip = ({ progress }: { progress: BoardProgress }) => {
	const chip = (done: boolean, Icon: typeof IconHeartbeat, label: string, count?: number) => (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] leading-none",
				done ? "border-primary/30 bg-primary/5 text-foreground" : "text-muted-foreground",
			)}
			title={label}
		>
			<Icon className="size-3" />
			{label}
			{count != null && count > 0 ? <span className="tabular-nums">{count}</span> : null}
		</span>
	);
	return (
		<>
			{chip(progress.vitals > 0, IconHeartbeat, "قياسات", progress.vitals)}
			{chip(
				progress.exam === "COMPLETED",
				IconClipboardCheck,
				progress.exam === "COMPLETED"
					? "فحص مكتمل"
					: progress.exam === "STARTED"
						? "فحص جارٍ"
						: "فحص",
			)}
			{progress.note ? chip(progress.note !== "DRAFT", IconNotes, "ملاحظة SOAP") : null}
			{chip(progress.labs > 0, IconFlask, "تحاليل", progress.labs)}
			{chip(progress.radiology > 0, IconRadioactive, "أشعة", progress.radiology)}
			{chip(progress.prescriptions > 0, IconPill, "وصفات", progress.prescriptions)}
		</>
	);
};

/** شريط الإنذار فوق اللوحة — المتجاوز يُعرض لا يُبحث عنه */
export const BreachBanner = ({
	breachedCount,
	imminentCount,
	onShow,
}: {
	breachedCount: number;
	imminentCount: number;
	onShow: () => void;
}) => {
	if (breachedCount === 0 && imminentCount === 0) return null;
	return (
		<Button
			type="button"
			variant="ghost"
			onClick={onShow}
			className="flex h-auto w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-start text-sm"
		>
			<IconAlertTriangle className="size-4 shrink-0 text-destructive" />
			<span>
				<strong className="tabular-nums">{breachedCount}</strong> حالة تجاوزت هدف الانتظار
				{imminentCount > 0 ? (
					<>
						، و<strong className="tabular-nums">{imminentCount}</strong> تقترب
					</>
				) : null}
			</span>
		</Button>
	);
};

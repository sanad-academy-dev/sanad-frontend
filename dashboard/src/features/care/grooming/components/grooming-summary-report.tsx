import {
	IconAlertTriangle,
	IconCash,
	IconClipboardCheck,
	IconClock,
	IconPhoto,
	IconPrinter,
	IconScissors,
	IconStethoscope,
	IconWind,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { printGroomingSession } from "@/features/care/grooming/utils/print-grooming-session";
import { getFileUrl } from "@/lib/file-url";
import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import {
	COAT_CONDITION_LABELS,
	GROOMING_FINDING_CATEGORY_LABELS,
	GROOMING_FINDING_SEVERITY_LABELS,
	GROOMING_INCIDENT_KIND_LABELS,
	GROOMING_INCIDENT_SEVERITY_LABELS,
	GROOMING_MOOD_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";
import {
	GROOMING_BEHAVIOR_LABELS,
	GROOMING_DRYING_METHOD_LABELS,
	GROOMING_LANE_LABELS,
	GROOMING_STATUS_LABELS,
	MATTING_GRADE_LABELS,
	PARASITE_FINDING_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

// تقرير الجلسة المكتملة — كل ما سُجّل على المسار في صفحة واحدة تُقرأ وتُطبع،
// على نمط ملخّص الحالة الجراحية. الجلسة المنتهية ليست نموذج عمل انتهى: هي
// وثيقة تُراجَع عند نزاع أو عند حجز الجلسة القادمة.

const dateTime = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const at = (v: Date | string | null | undefined) => (v ? dateTime.format(new Date(v)) : "—");
const money = (v: unknown) =>
	`${Number(v ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

function Section({
	title,
	icon: Icon,
	children,
}: {
	title: string;
	icon: typeof IconScissors;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-2">
			<h4 className="flex items-center gap-1.5 font-semibold text-sm">
				<Icon className="size-4 text-muted-foreground" />
				{title}
			</h4>
			{children}
		</section>
	);
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex items-baseline justify-between gap-2 border-dashed border-b py-1 last:border-0">
			<span className="shrink-0 text-muted-foreground text-xs">{label}</span>
			<span className="min-w-0 truncate font-medium text-xs">{value}</span>
		</div>
	);
}

export function GroomingSummaryReport({ session }: { session: GroomingSessionDetail }) {
	const intake = session.intake;
	const performed = session.items.filter((i) => i.performed);
	const beforePhotos = session.photos.filter((p) => p.kind === "BEFORE");
	const afterPhotos = session.photos.filter((p) => p.kind === "AFTER");
	const openIncidents = session.incidents.filter((i) => !i.resolvedAt);

	// مدّة العهدة من الاستلام إلى التسليم — أوّل رقم يبحث عنه المراجع
	const custodyMinutes =
		session.checkedInAt && session.pickedUpAt
			? Math.round(
					(new Date(session.pickedUpAt).getTime() - new Date(session.checkedInAt).getTime()) /
						60000,
				)
			: null;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<h3 className="font-semibold text-base">تقرير الجلسة {session.code}</h3>
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge variant="secondary">{GROOMING_STATUS_LABELS[session.status]}</Badge>
						<Badge variant="outline">{GROOMING_LANE_LABELS[session.lane]}</Badge>
						{openIncidents.length > 0 && (
							<Badge
								variant="destructive"
								className="gap-1"
							>
								<IconAlertTriangle className="size-3" />
								{openIncidents.length} حادثة مفتوحة
							</Badge>
						)}
					</div>
				</div>
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="gap-1.5"
					onClick={() => printGroomingSession(session)}
				>
					<IconPrinter className="size-3.5" />
					طباعة التقرير
				</Button>
			</div>

			<Separator />

			<Section
				title="الأطراف والأوقات"
				icon={IconClock}
			>
				<div className="grid gap-x-6 sm:grid-cols-2">
					<Fact
						label="الطفل"
						value={`${session.patient.name} (${session.patient.code})`}
					/>
					<Fact
						label="وليّ الأمر"
						value={session.owner?.name ?? "—"}
					/>
					<Fact
						label="المُجمِّل"
						value={session.groomer?.user?.name ?? "—"}
					/>
					<Fact
						label="المحطة"
						value={session.station?.name ?? "—"}
					/>
					<Fact
						label="الاستلام"
						value={at(session.checkedInAt)}
					/>
					<Fact
						label="بدء العمل"
						value={at(session.startedAt)}
					/>
					<Fact
						label="جاهز للاستلام"
						value={at(session.readyAt)}
					/>
					<Fact
						label="التسليم"
						value={at(session.pickedUpAt)}
					/>
					<Fact
						label="الإقفال"
						value={at(session.completedAt)}
					/>
					<Fact
						label="مدّة العهدة"
						value={custodyMinutes != null ? `${custodyMinutes} دقيقة` : "—"}
					/>
				</div>
			</Section>

			{intake && (
				<Section
					title="الفحص القبلي"
					icon={IconClipboardCheck}
				>
					<div className="grid gap-x-6 sm:grid-cols-2">
						<Fact
							label="الوزن"
							value={intake.weightKg != null ? `${Number(intake.weightKg)} كجم` : "—"}
						/>
						<Fact
							label="درجة التعقّد"
							value={MATTING_GRADE_LABELS[intake.mattingGrade]}
						/>
						<Fact
							label="حالة الفرو"
							value={intake.coatCondition ? COAT_CONDITION_LABELS[intake.coatCondition] : "—"}
						/>
						<Fact
							label="الطفيليات"
							value={PARASITE_FINDING_LABELS[intake.parasiteFinding]}
						/>
						<Fact
							label="السلوك"
							value={GROOMING_BEHAVIOR_LABELS[intake.behaviorScore]}
						/>
						<Fact
							label="حلاقة اضطرارية"
							value={
								intake.shaveDownRecommended
									? intake.shaveDownApprovedAt
										? `أقرّها وليّ الأمر — ${at(intake.shaveDownApprovedAt)}`
										: "موصى بها بلا إقرار"
									: "لا"
							}
						/>
					</div>
					{intake.heatDryProhibitedSnapshot && (
						<p className="rounded-[4px] border border-destructive/40 bg-destructive/5 p-2 text-xs">
							مُنع التجفيف الحارّ — {intake.heatDryReasonsSnapshot.join(" · ")}
						</p>
					)}
					{intake.notes && (
						<p className="rounded-[4px] border bg-muted/30 p-2 text-xs leading-relaxed">
							{intake.notes}
						</p>
					)}
				</Section>
			)}

			<Section
				title={`الدورات المنفَّذة (${performed.length} من ${session.items.length})`}
				icon={IconScissors}
			>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">الدورة</TableHead>
								<TableHead className="text-center">الحالة</TableHead>
								<TableHead className="text-center">السعر</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{session.items.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="text-sm">{item.nameSnapshot}</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{item.performed ? "نُفِّذت" : "لم تُنفَّذ"}
										</Badge>
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{money(item.priceSnapshot)}
									</TableCell>
								</TableRow>
							))}
							{session.adjustments.map((adj) => (
								<TableRow
									key={adj.id}
									className="bg-muted/30"
								>
									<TableCell
										colSpan={2}
										className="text-sm"
									>
										{adj.labelSnapshot}
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{money(adj.amount)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Section>

			<Section
				title="التجفيف والتشطيب"
				icon={IconWind}
			>
				<div className="grid gap-x-6 sm:grid-cols-2">
					<Fact
						label="طريقة التجفيف"
						value={
							session.dryingMethod
								? GROOMING_DRYING_METHOD_LABELS[session.dryingMethod]
								: "غير مسجَّلة"
						}
					/>
					<Fact
						label="صور «قبل» / «بعد»"
						value={`${beforePhotos.length} / ${afterPhotos.length}`}
					/>
				</div>
			</Section>

			{session.photos.length > 0 && (
				<Section
					title="التوثيق المصوَّر"
					icon={IconPhoto}
				>
					<div className="grid grid-cols-4 gap-2">
						{session.photos.map((photo) => (
							<img
								key={photo.id}
								src={getFileUrl(photo.url)}
								alt={photo.caption ?? "صورة الجلسة"}
								className="aspect-square w-full rounded-[4px] border object-cover"
							/>
						))}
					</div>
				</Section>
			)}

			{session.findings.length > 0 && (
				<Section
					title="الملاحظات السريرية"
					icon={IconStethoscope}
				>
					{session.findings.map((f) => (
						<div
							key={f.id}
							className="border-b py-2 text-sm last:border-0"
						>
							<div className="flex items-center gap-2">
								<Badge variant="outline">{GROOMING_FINDING_CATEGORY_LABELS[f.category]}</Badge>
								<Badge variant={f.severity === "URGENT" ? "destructive" : "secondary"}>
									{GROOMING_FINDING_SEVERITY_LABELS[f.severity]}
								</Badge>
							</div>
							<p className="mt-1">{f.note}</p>
						</div>
					))}
				</Section>
			)}

			{session.incidents.length > 0 && (
				<Section
					title="الحوادث"
					icon={IconAlertTriangle}
				>
					{session.incidents.map((i) => (
						<div
							key={i.id}
							className="border-b py-2 text-sm last:border-0"
						>
							<div className="flex items-center gap-2">
								<Badge variant="destructive">{GROOMING_INCIDENT_KIND_LABELS[i.kind]}</Badge>
								<Badge variant="secondary">
									{GROOMING_INCIDENT_SEVERITY_LABELS[i.severity]}
								</Badge>
								<Badge variant="outline">{i.resolvedAt ? "مغلقة" : "مفتوحة"}</Badge>
							</div>
							<p className="mt-1">{i.description}</p>
							{i.actionTaken && (
								<p className="mt-0.5 text-muted-foreground text-xs">
									ما اتُّخذ: {i.actionTaken}
								</p>
							)}
						</div>
					))}
				</Section>
			)}

			{session.reportCard && (
				<Section
					title="تقرير وليّ الأمر"
					icon={IconClipboardCheck}
				>
					<div className="grid gap-x-6 sm:grid-cols-2">
						<Fact
							label="مزاج الطفل"
							value={GROOMING_MOOD_LABELS[session.reportCard.moodScore]}
						/>
						<Fact
							label="التكرار الموصى به"
							value={
								session.reportCard.recommendedIntervalWeeks
									? `كل ${session.reportCard.recommendedIntervalWeeks} أسبوعًا`
									: "—"
							}
						/>
					</div>
					<p className="rounded-[4px] border bg-muted/30 p-2 text-xs leading-relaxed">
						{session.reportCard.summary}
					</p>
				</Section>
			)}

			<Section
				title="الفاتورة"
				icon={IconCash}
			>
				{session.invoice ? (
					<div className="grid gap-x-6 sm:grid-cols-2">
						<Fact
							label="رقم الفاتورة"
							value={session.invoice.code}
						/>
						<Fact
							label="الإجمالي"
							value={money(session.invoice.total)}
						/>
						<Fact
							label="المسدَّد"
							value={money(session.invoice.amountPaid)}
						/>
						<Fact
							label="الحالة"
							value={session.invoice.status === "PAID" ? "مسدَّدة" : "غير مسدَّدة بالكامل"}
						/>
					</div>
				) : (
					<p className="text-muted-foreground text-xs">لم تُصدر فاتورة لهذه الجلسة.</p>
				)}
			</Section>
		</div>
	);
}

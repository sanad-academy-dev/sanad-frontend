import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LOCATION_OPTIONS } from "@/features/appointments/data/location-options";
import { PRIORITY_META } from "@/features/appointments/data/status-meta";
import {
	describeHistoryEntry,
	historyTimeLabel,
} from "@/features/services/patients/utils/patient-history";
import { VitalsSnapshotCard } from "@/features/services/vital-signs/components/vitals-snapshot-card";
import { cn } from "@/lib/utils";
import { LAB_STAGE_LABELS, LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";
import type {
	PatientHistoryCarePlan,
	PatientHistoryEntry,
	PatientHistoryLabOrder,
	PatientHistoryRadiologyOrder,
	PatientHistoryVisit,
} from "@/server/patients/patients.type";
import { LATERALITY_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

const DASH = "—";

// الرقم وحده؛ العملة تُذكر في تسمية الخلية. إلصاق «ر.س» بالرقم داخل خلية
// dir="ltr" يخلط اتجاهين في نصّ واحد فينقلب ترتيبهما بصريًا.
const money = (value: string | number | null | undefined) => {
	if (value == null) return DASH;
	const n = Number(value);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : DASH;
};

// أرقام لاتينية كبقية أرقام المعاينة (المبالغ والأوقات) — راجع historyDayLabel
const fullDate = (value: Date | string) =>
	new Date(value).toLocaleDateString("ar-EG-u-nu-latn", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

/** خلية «تسمية فوق قيمة» — الوحدة الوحيدة التي تبني كل شبكات المعاينة */
function Fact({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex flex-col gap-1 rounded-[4px] border p-2.5">
			<span className="text-[11px] text-muted-foreground">{label}</span>
			<span className={cn("text-sm font-medium")}>{value ?? DASH}</span>
		</div>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xs font-semibold text-muted-foreground">{title}</p>
			{children}
		</div>
	);
}

/** فقرة نصّية حرّة — تُخفى تمامًا حين لا يوجد نص، فلا تظهر أقسام فارغة */
function NoteBlock({ title, body }: { title: string; body: string | null }) {
	if (!body?.trim()) return null;
	return (
		<Section title={title}>
			<p className="whitespace-pre-wrap rounded-[4px] border bg-muted/30 p-2.5 text-sm">
				{body}
			</p>
		</Section>
	);
}

function InvoiceFacts({
	invoice,
}: {
	invoice: { code: string; total: unknown; amountPaid: unknown } | null;
}) {
	if (!invoice) return null;
	const total = Number(invoice.total);
	const paid = Number(invoice.amountPaid);
	return (
		<Section title="الفاتورة">
			<div className="grid grid-cols-3 gap-2">
				<Fact
					label="رقم الفاتورة"
					value={invoice.code}
				/>
				<Fact
					label="الإجمالي (ر.س)"
					value={money(total)}
				/>
				<Fact
					label="المتبقّي (ر.س)"
					value={money(Math.max(total - paid, 0))}
				/>
			</div>
		</Section>
	);
}

// ── محتوى كل نوع ─────────────────────────────────────────────────────────────

function VisitPreview({ record }: { record: PatientHistoryVisit }) {
	const doctor = `${record.staff.prefix ?? ""}${record.staff.name}`.trim();
	const location = LOCATION_OPTIONS.find((o) => o.value === record.location);

	return (
		<>
			<div className="grid grid-cols-3 gap-2">
				<Fact
					label="التاريخ"
					value={fullDate(record.startsAt)}
				/>
				<Fact
					label="الوقت"
					value={historyTimeLabel(record.startsAt)}
				/>
				<Fact
					label="المدة"
					value={`${record.durationMinutes} دقيقة`}
				/>
				<Fact
					label="المدرّب"
					value={doctor || DASH}
				/>
				<Fact
					label="وليّ الأمر"
					value={record.owner.name}
				/>
				<Fact
					label="مكان الزيارة"
					value={location?.label ?? DASH}
				/>
				<Fact
					label="نوع الكشف"
					value={record.consultationType?.name ?? DASH}
				/>
				<Fact
					label="القاعة"
					value={record.room?.name ?? DASH}
				/>
				<Fact
					label="الفحص السريري"
					value={record.clinicalExam?.completedAt ? "مكتمل" : "غير مكتمل"}
				/>
			</div>

			{record.services.length > 0 && (
				<Section title={`الدورات (${record.services.length})`}>
					<div className="flex flex-col divide-y rounded-[4px] border">
						{record.services.map((row) => (
							<div
								key={row.id}
								className="flex items-center justify-between gap-2 px-2.5 py-2 text-sm"
							>
								<span className="truncate">{row.service.name}</span>
								{row.quantity > 1 && (
									<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
										×{row.quantity}
									</span>
								)}
							</div>
						))}
					</div>
				</Section>
			)}

			{(record._count.labTestOrders > 0 ||
				record._count.radiologyOrders > 0 ||
				record._count.products > 0) && (
				<div className="grid grid-cols-3 gap-2">
					<Fact
						label="طلبات التحاليل"
						value={record._count.labTestOrders}
					/>
					<Fact
						label="طلبات الأشعة"
						value={record._count.radiologyOrders}
					/>
					<Fact
						label="الأصناف المستهلكة"
						value={record._count.products}
					/>
				</div>
			)}

			<NoteBlock
				title="الأعراض"
				body={record.symptoms}
			/>
			<NoteBlock
				title="الملاحظات السريرية"
				body={record.clinicalNotes}
			/>
			<InvoiceFacts invoice={record.invoice} />
		</>
	);
}

function LabPreview({ record }: { record: PatientHistoryLabOrder }) {
	return (
		<>
			<div className="grid grid-cols-3 gap-2">
				<Fact
					label="تاريخ الطلب"
					value={fullDate(record.createdAt)}
				/>
				<Fact
					label="المدرّب الطالب"
					value={record.requestedBy?.name ?? DASH}
				/>
				<Fact
					label="الأولوية"
					value={record.priority ? PRIORITY_META[record.priority].label : DASH}
				/>
			</div>

			<Section title={`التحاليل (${record.items.length})`}>
				<div className="flex flex-col divide-y rounded-[4px] border">
					{record.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between gap-2 px-2.5 py-2"
						>
							<span className="truncate text-sm">{item.service.name}</span>
							<span className="flex shrink-0 items-center gap-1.5">
								<span className="text-[11px] text-muted-foreground">
									{LAB_STAGE_LABELS[item.sampleStage]}
								</span>
								<Badge
									variant="outline"
									className="font-normal"
								>
									{LAB_STATUS_LABELS[item.status]}
								</Badge>
							</span>
						</div>
					))}
				</div>
			</Section>

			<NoteBlock
				title="ملاحظات"
				body={record.notes}
			/>
			<InvoiceFacts invoice={record.invoice} />
		</>
	);
}

function RadiologyPreview({ record }: { record: PatientHistoryRadiologyOrder }) {
	return (
		<>
			<div className="grid grid-cols-3 gap-2">
				<Fact
					label="تاريخ الطلب"
					value={fullDate(record.createdAt)}
				/>
				<Fact
					label="المدرّب الطالب"
					value={record.requestedBy?.name ?? DASH}
				/>
				<Fact
					label="الأولوية"
					value={record.priority ? PRIORITY_META[record.priority].label : DASH}
				/>
			</div>

			<Section title={`الفحوصات (${record.items.length})`}>
				<div className="flex flex-col divide-y rounded-[4px] border">
					{record.items.map((item) => (
						<div
							key={item.id}
							className="flex flex-col gap-1 px-2.5 py-2"
						>
							<div className="flex items-center justify-between gap-2">
								<span className="truncate text-sm">{item.service.name}</span>
								<Badge
									variant="outline"
									className="shrink-0 font-normal"
								>
									{RADIOLOGY_STATUS_LABELS[item.status]}
								</Badge>
							</div>
							<div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
								<span>{item.modality}</span>
								{item.bodyPart && (
									<>
										<span aria-hidden>·</span>
										<span>{item.bodyPart}</span>
									</>
								)}
								{item.laterality !== "NONE" && (
									<>
										<span aria-hidden>·</span>
										<span>{LATERALITY_LABELS[item.laterality]}</span>
									</>
								)}
								<span aria-hidden>·</span>
								<span
									className="tabular-nums"
									dir="ltr"
								>
									{item.accession}
								</span>
							</div>
						</div>
					))}
				</div>
			</Section>

			<NoteBlock
				title="المعلومات السريرية"
				body={record.clinicalInfo}
			/>
			<NoteBlock
				title="ملاحظات"
				body={record.notes}
			/>
			<InvoiceFacts invoice={record.invoice} />
		</>
	);
}

function CarePlanPreview({ record }: { record: PatientHistoryCarePlan }) {
	return (
		<>
			<div className="grid grid-cols-3 gap-2">
				<Fact
					label="الخطة"
					value={record.carePlan.name}
				/>
				<Fact
					label="تاريخ الاشتراك"
					value={fullDate(record.startedAt)}
				/>
				<Fact
					label="تاريخ الإكمال"
					value={record.completedAt ? fullDate(record.completedAt) : DASH}
				/>
				<Fact
					label="عدد الزيارات"
					value={record._count.visits}
				/>
				<Fact
					label="مدة الخطة"
					value={`${record.carePlan.durationDays} يوم`}
				/>
				<Fact
					label="السعر وقت الاشتراك (ر.س)"
					value={money(record.priceSnapshot as unknown as string)}
				/>
			</div>

			<NoteBlock
				title="ملاحظات"
				body={record.notes}
			/>
		</>
	);
}

// ── النافذة ──────────────────────────────────────────────────────────────────

interface PatientHistoryPreviewDialogProps {
	/** الحدث المعروض — null يعني النافذة مغلقة */
	entry: PatientHistoryEntry | null;
	onOpenChange: (open: boolean) => void;
	/** الانتقال من المعاينة إلى السجل الأصلي */
	onOpenRecord: (entry: PatientHistoryEntry) => void;
}

/**
 * المعاينة السريعة: كل ما في السجل مقروءًا في نافذة واحدة دون مغادرة ملف
 * الطفل. اللوحة الأصلية تبقى للتحرير والإجراءات — هذه للقراءة فقط.
 */
export function PatientHistoryPreviewDialog({
	entry,
	onOpenChange,
	onOpenRecord,
}: PatientHistoryPreviewDialogProps) {
	const meta = entry ? describeHistoryEntry(entry) : null;
	const Icon = meta?.icon;

	return (
		<Dialog
			open={!!entry}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
				dir="rtl"
			>
				{entry && meta && (
					<>
						<div className="flex items-center gap-2 border-b px-4 py-2 pe-10">
							{Icon && (
								<span
									className={cn(
										"flex size-7 shrink-0 items-center justify-center rounded-[4px]",
										meta.iconClassName,
									)}
								>
									<Icon className="size-4" />
								</span>
							)}
							<DialogTitle className="min-w-0 flex-1 truncate text-sm font-semibold">
								{meta.title}
							</DialogTitle>
							<Badge
								variant="outline"
								className="shrink-0 font-normal"
							>
								{meta.statusLabel}
							</Badge>
							<span
								className="shrink-0 text-xs text-muted-foreground tabular-nums"
								dir="ltr"
							>
								{meta.code}
							</span>
						</div>

						<div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-4 py-3">
							{entry.kind === "VISIT" && <VisitPreview record={entry.record} />}
							{entry.kind === "LAB" && <LabPreview record={entry.record} />}
							{entry.kind === "RADIOLOGY" && <RadiologyPreview record={entry.record} />}
							{entry.kind === "VITALS" && (
								<VitalsSnapshotCard
									record={entry.record}
									profile="FULL"
								/>
							)}
							{entry.kind === "CARE_PLAN" && <CarePlanPreview record={entry.record} />}
						</div>

						<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => onOpenChange(false)}
							>
								إغلاق
							</Button>
							<Button
								type="button"
								size="sm"
								onClick={() => onOpenRecord(entry)}
							>
								فتح السجل
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

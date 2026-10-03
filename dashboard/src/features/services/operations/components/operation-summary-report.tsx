import {
	IconBed,
	IconCircleCheckFilled,
	IconClipboardCheck,
	IconFileText,
	IconPackageExport,
	IconPrinter,
	IconScissors,
	IconStethoscope,
	IconVaccine,
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
import { printOperationCase } from "@/features/services/operations/utils/print-operation-case";
import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";
import {
	CONSENT_TYPE_LABELS,
	OPERATION_LATERALITY_LABELS,
	SIGNATURE_METHOD_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.type";
import {
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
	OPERATION_URGENCY_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ملخّص الحالة المكتملة — كل ما سُجّل في المراحل: الفريق والأوقات والموافقات
// وقوائم الأمان وسجل التخدير والعدّ والمستهلكات والتقرير والإفاقة والفاتورة.
// يظهر في تبويب التفاصيل فور اكتمال الحالة (أو إلغائها) بدل نموذج عمل انتهى.

const dateTime = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const timeOnly = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" });

const at = (value: Date | string | null | undefined) =>
	value ? dateTime.format(new Date(value)) : "—";
const clock = (value: Date | string | null | undefined) =>
	value ? timeOnly.format(new Date(value)) : "—";
const money = (value: unknown) =>
	`${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

const CONSUMABLE_TYPE_LABELS: Record<string, string> = {
	KIT: "عدة العملية",
	BURNED: "محروقات",
	ADDITIONAL: "إضافي",
};

const SCOPE_LABELS: Record<string, string> = {
	OPERATION_SIGN_IN: "قائمة الدخول",
	OPERATION_TIME_OUT: "الوقفة الآمنة",
	OPERATION_SIGN_OUT: "قائمة الخروج",
	OPERATION_MINOR_COMBINED: "قائمة الإجراءات الصغرى",
};

const CLAVIEN_LABELS: Record<string, string> = {
	GRADE_I: "الدرجة I",
	GRADE_II: "الدرجة II",
	GRADE_IIIA: "الدرجة IIIa",
	GRADE_IIIB: "الدرجة IIIb",
	GRADE_IVA: "الدرجة IVa",
	GRADE_IVB: "الدرجة IVb",
	GRADE_V: "الدرجة V",
};

const TEAM_ROLE_LABELS: Record<string, string> = {
	PRIMARY_SURGEON: "الجرّاح الأساسي",
	ASSISTANT_SURGEON: "جرّاح مساعد",
	ANESTHETIST: "مدرّب التخدير",
	SCRUB_NURSE: "ممرض التعقيم",
	CIRCULATING_NURSE: "ممرض الجولة",
	OBSERVER: "مراقب",
};

/** قسم في الملخّص — عنوان بأيقونة ثم محتواه، ويُخفى القسم الفارغ */
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
			<h4 className="flex items-center gap-1.5 text-sm font-semibold">
				<Icon className="size-4 text-muted-foreground" />
				{title}
			</h4>
			{children}
		</section>
	);
}

/** سطر «تسمية: قيمة» داخل شبكة الملخّص */
function Fact({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex items-baseline justify-between gap-2 border-b border-dashed py-1 last:border-0">
			<span className="shrink-0 text-xs text-muted-foreground">{label}</span>
			<span className="min-w-0 truncate text-xs font-medium">{value}</span>
		</div>
	);
}

export function OperationSummaryReport({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const surgeon = c.team.find((m) => m.role === "PRIMARY_SURGEON")?.staff.name ?? "—";
	const signedConsents = c.consents.filter((x) => x.signedAt && !x.revokedAt);
	const billableConsumables = c.consumables.filter((x) => x.type === "ADDITIONAL");
	const latestRecovery = c.recoveryAssessments.find((a) => a.score != null);
	const countedConsumables = c.consumables.filter((x) => x.countedQuantity != null);
	const countMismatches = countedConsumables.filter((x) => x.countedQuantity !== x.quantity);
	const isCancelled = c.status === "CANCELLED";

	// مدة الجراحة من الشق إلى الإغلاق — المؤشر الذي يبحث عنه المراجع أولًا
	const surgeryMinutes =
		c.anesthesia?.incisionAt && c.anesthesia?.closureAt
			? Math.round(
					(new Date(c.anesthesia.closureAt).getTime() -
						new Date(c.anesthesia.incisionAt).getTime()) /
						60000,
				)
			: null;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-3">
				<div className="flex min-w-0 flex-col gap-0.5">
					<p className="flex items-center gap-1.5 text-sm font-semibold">
						{isCancelled ? (
							<Badge
								variant="outline"
								className="border-red-200 bg-red-50 text-[10px] text-red-700"
							>
								{OPERATION_STATUS_LABELS[c.status]}
							</Badge>
						) : (
							<Badge
								variant="outline"
								className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
							>
								<IconCircleCheckFilled className="size-3" />
								{OPERATION_STATUS_LABELS[c.status]}
							</Badge>
						)}
						ملخّص الحالة {c.code}
					</p>
					<p className="text-[11px] text-muted-foreground">
						{isCancelled
							? `أُلغيت: ${c.cancelReason ?? "بلا سبب مسجّل"}`
							: "سجل كامل لما نُفّذ وسُجّل في مراحل هذه العملية"}
					</p>
				</div>
				<Button
					size="sm"
					variant="outline"
					className="shrink-0 gap-1.5"
					onClick={() => printOperationCase(c)}
				>
					<IconPrinter className="size-3.5" />
					طباعة
				</Button>
			</div>

			<Section
				title="المعلومات الأساسية"
				icon={IconStethoscope}
			>
				<div className="grid grid-cols-2 gap-x-6">
					<Fact
						label="الطفل"
						value={`${c.patient.name} (${c.patient.code})`}
					/>
					<Fact
						label="وليّ الأمر"
						value={c.owner.name}
					/>
					<Fact
						label="الدرجة"
						value={OPERATION_TIER_LABELS[c.tier]}
					/>
					<Fact
						label="الأولوية"
						value={OPERATION_URGENCY_LABELS[c.urgency]}
					/>
					<Fact
						label="الجرّاح"
						value={surgeon}
					/>
					<Fact
						label="القاعة"
						value={c.room?.name ?? "—"}
					/>
					<Fact
						label="الموعد"
						value={at(c.scheduledAt)}
					/>
					<Fact
						label="التشخيص"
						value={c.diagnosis ?? "—"}
					/>
				</div>
			</Section>

			<Section
				title="الإجراءات المنفَّذة"
				icon={IconScissors}
			>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">الإجراء</TableHead>
								<TableHead className="text-center">الجهة والموضع</TableHead>
								<TableHead className="text-center">السعر</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{c.procedures.map((p) => (
								<TableRow key={p.id}>
									<TableCell className="text-sm font-medium">{p.nameSnapshot}</TableCell>
									<TableCell className="text-center text-xs text-muted-foreground">
										{p.laterality !== "NONE" ? OPERATION_LATERALITY_LABELS[p.laterality] : ""}
										{p.laterality !== "NONE" && p.site ? " · " : ""}
										{p.site ?? (p.laterality === "NONE" ? "—" : "")}
									</TableCell>
									<TableCell className="text-center text-xs tabular-nums">
										{money(p.priceSnapshot)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Section>

			{/* الفريق الجراحي */}
			{c.team.length > 0 && (
				<Section
					title="الفريق"
					icon={IconStethoscope}
				>
					<div className="flex flex-wrap gap-1.5">
						{c.team.map((m) => (
							<Badge
								key={m.id}
								variant="outline"
								className="text-[10px]"
							>
								{TEAM_ROLE_LABELS[m.role] ?? m.role}: {m.staff.name}
							</Badge>
						))}
					</div>
				</Section>
			)}

			<Section
				title="التحضير والموافقات"
				icon={IconFileText}
			>
				<div className="grid grid-cols-2 gap-x-6">
					<Fact
						label="درجة ASA"
						value={
							c.assessment?.asaClass != null
								? `ASA ${c.assessment.asaClass}${c.assessment.asaEmergency ? "E" : ""}`
								: "—"
						}
					/>
					<Fact
						label="التحقق من الصيام"
						value={c.assessment?.fastingVerified ? "مُتحقَّق" : "غير مُتحقَّق"}
					/>
					<Fact
						label="آخر طعام"
						value={at(c.assessment?.lastFoodAt)}
					/>
					<Fact
						label="آخر ماء"
						value={at(c.assessment?.lastWaterAt)}
					/>
				</div>
				{signedConsents.length > 0 ? (
					<div className="flex flex-col gap-1">
						{signedConsents.map((consent) => (
							<div
								key={consent.id}
								className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
							>
								<span className="font-medium">{CONSENT_TYPE_LABELS[consent.type]}</span>
								<span className="text-muted-foreground">
									وقّعها {consent.signerName}
									{consent.signatureMethod
										? ` (${SIGNATURE_METHOD_LABELS[consent.signatureMethod]})`
										: ""}
								</span>
								<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
									{at(consent.signedAt)}
								</span>
							</div>
						))}
					</div>
				) : (
					<p className="text-xs text-muted-foreground">لا موافقات موقَّعة</p>
				)}
			</Section>

			{c.checklistRuns.length > 0 && (
				<Section
					title="قوائم الأمان"
					icon={IconClipboardCheck}
				>
					<div className="flex flex-col gap-1">
						{c.checklistRuns.map((run) => (
							<div
								key={run.id}
								className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
							>
								<span className="font-medium">{SCOPE_LABELS[run.scope] ?? run.scope}</span>
								<span className="text-muted-foreground tabular-nums">
									{run.items.filter((i) => i.response !== null).length}/{run.items.length} بند
								</span>
								{run.items.some((i) => i.response === "NO") && (
									<Badge
										variant="outline"
										className="border-amber-200 bg-amber-50 text-[10px] text-amber-700"
									>
										فيها إجابات «لا»
									</Badge>
								)}
								<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
									{run.completedAt ? `اكتملت ${at(run.completedAt)}` : "لم تكتمل"}
								</span>
							</div>
						))}
					</div>
				</Section>
			)}

			{c.anesthesia && (
				<Section
					title="سجل التخدير والتوقيتات"
					icon={IconVaccine}
				>
					<div className="grid grid-cols-3 gap-x-6">
						<Fact
							label="المخطَّط"
							value={SEDATION_LABELS[c.plannedAnesthesia]}
						/>
						<Fact
							label="الفعلي"
							value={c.anesthesia.actual ? SEDATION_LABELS[c.anesthesia.actual] : "—"}
						/>
						<Fact
							label="مجرى الهواء"
							value={c.anesthesia.airway ?? "—"}
						/>
						<Fact
							label="التمهيد"
							value={clock(c.anesthesia.premedAt)}
						/>
						<Fact
							label="بدء التخدير"
							value={clock(c.anesthesia.inductionAt)}
						/>
						<Fact
							label="الشق"
							value={clock(c.anesthesia.incisionAt)}
						/>
						<Fact
							label="الإغلاق"
							value={clock(c.anesthesia.closureAt)}
						/>
						<Fact
							label="نهاية التخدير"
							value={clock(c.anesthesia.endAnesthesiaAt)}
						/>
						<Fact
							label="نزع الأنبوب"
							value={clock(c.anesthesia.extubationAt)}
						/>
					</div>
					{surgeryMinutes != null && (
						<p className="text-xs text-muted-foreground">
							مدة الجراحة (شق ← إغلاق):{" "}
							<span className="font-medium tabular-nums text-foreground">
								{surgeryMinutes} دقيقة
							</span>
						</p>
					)}
					{c.anesthesia.events.length > 0 && (
						<div className="flex flex-col gap-1">
							{c.anesthesia.events.map((e) => (
								<div
									key={e.id}
									className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
								>
									<span className="shrink-0 font-medium tabular-nums">{clock(e.at)}</span>
									<span className="truncate">
										{e.agentName ?? e.kind}
										{e.dose != null ? ` — ${String(e.dose)}${e.doseUnit ?? ""}` : ""}
										{e.route ? ` (${e.route})` : ""}
										{e.detail ? ` — ${e.detail}` : ""}
									</span>
									<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
										{e.recordedBy?.name ?? ""}
									</span>
								</div>
							))}
						</div>
					)}
				</Section>
			)}

			{(c.consumables.length > 0 || c.implants.length > 0 || c.specimens.length > 0) && (
				<Section
					title="العدّ والغرسات والعينات"
					icon={IconClipboardCheck}
				>
					{/* العدّ مبني على البنود المستدورة فعلًا — لا فئات مجردة */}
					{countedConsumables.length > 0 ? (
						<div className="flex flex-wrap gap-1.5">
							{countedConsumables.map((item) => {
								const diff = (item.countedQuantity as number) - item.quantity;
								return (
									<Badge
										key={item.id}
										variant="outline"
										className={
											diff === 0
												? "gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
												: "gap-1 border-red-200 bg-red-50 text-[10px] text-red-700"
										}
									>
										{item.nameSnapshot}: {item.quantity} ← {item.countedQuantity}
										{diff === 0 ? " (مطابق)" : ` (فرق ${diff > 0 ? "+" : ""}${diff})`}
									</Badge>
								);
							})}
						</div>
					) : (
						<p className="text-xs text-muted-foreground">لم يُسجّل عدّ للبنود المستدورة</p>
					)}
					{countMismatches.length > 0 && (
						<p className="rounded-[4px] border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-800">
							فروق العدّ الموثّقة:{" "}
							{countMismatches
								.map((x) => `${x.nameSnapshot}${x.countNote ? ` — ${x.countNote}` : ""}`)
								.join("، ")}
						</p>
					)}
					{c.implants.length > 0 && (
						<p className="text-xs">
							<span className="text-muted-foreground">الغرسات: </span>
							{c.implants
								.map(
									(i) =>
										`${i.name}${i.lotNumber ? ` (لوط ${i.lotNumber})` : ""}${i.site ? ` — ${i.site}` : ""}`,
								)
								.join("، ")}
						</p>
					)}
					{c.specimens.length > 0 && (
						<p className="text-xs">
							<span className="text-muted-foreground">العينات: </span>
							{c.specimens.map((sp) => sp.label).join("، ")}
						</p>
					)}
				</Section>
			)}

			{c.note && (
				<Section
					title="التقرير الجراحي"
					icon={IconFileText}
				>
					<div className="flex flex-col gap-2 rounded-md border p-3 text-xs">
						{c.note.proceduresPerformed && (
							<div>
								<p className="mb-0.5 font-semibold">ما نُفّذ فعلًا</p>
								<p className="whitespace-pre-wrap text-muted-foreground">
									{c.note.proceduresPerformed}
								</p>
							</div>
						)}
						{c.note.findings && (
							<div>
								<p className="mb-0.5 font-semibold">الموجودات</p>
								<p className="whitespace-pre-wrap text-muted-foreground">{c.note.findings}</p>
							</div>
						)}
						{c.note.technique && (
							<div>
								<p className="mb-0.5 font-semibold">الأسلوب الجراحي</p>
								<p className="whitespace-pre-wrap text-muted-foreground">{c.note.technique}</p>
							</div>
						)}
						{c.note.closureDetails && (
							<div>
								<p className="mb-0.5 font-semibold">الإغلاق</p>
								<p className="whitespace-pre-wrap text-muted-foreground">
									{c.note.closureDetails}
								</p>
							</div>
						)}
						{c.note.estimatedBloodLossMl != null && (
							<p className="text-muted-foreground">
								فقد الدم التقديري:{" "}
								<span className="font-medium tabular-nums text-foreground">
									{c.note.estimatedBloodLossMl} مل
								</span>
							</p>
						)}
						<Separator />
						<p className="text-[11px] text-muted-foreground">
							{c.note.signedAt
								? `وقّعه ${c.note.signedBy?.name ?? ""} — ${at(c.note.signedAt)}`
								: "غير موقَّع"}
						</p>
					</div>
				</Section>
			)}

			{(latestRecovery || c.postOpOrders.length > 0) && (
				<Section
					title="الإفاقة والخروج"
					icon={IconBed}
				>
					{latestRecovery && (
						<p className="text-xs">
							<span className="text-muted-foreground">آخر درجة إفاقة: </span>
							<span className="font-medium tabular-nums">{latestRecovery.score}/10</span>
						</p>
					)}
					{c.postOpOrders.length > 0 && (
						<div className="flex flex-col gap-1">
							{c.postOpOrders.map((o) => (
								<div
									key={o.id}
									className="flex items-start gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
								>
									<span className="min-w-0 flex-1 whitespace-pre-wrap">{o.instructions}</span>
									{o.dueAt && (
										<span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
											{at(o.dueAt)}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</Section>
			)}

			{c.complications.length > 0 && (
				<Section
					title="المضاعفات"
					icon={IconClipboardCheck}
				>
					<div className="flex flex-col gap-1">
						{c.complications.map((x) => (
							<div
								key={x.id}
								className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
							>
								<span className="font-medium">{x.kind}</span>
								{x.clavienDindoGrade && (
									<Badge
										variant="outline"
										className="text-[10px]"
									>
										{CLAVIEN_LABELS[x.clavienDindoGrade] ?? x.clavienDindoGrade}
									</Badge>
								)}
								{x.isSSI && (
									<Badge
										variant="outline"
										className="border-red-200 bg-red-50 text-[10px] text-red-700"
									>
										عدوى موضع جراحة
									</Badge>
								)}
								<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
									{at(x.occurredAt)}
								</span>
							</div>
						))}
					</div>
				</Section>
			)}

			<Section
				title="المستهلكات والفاتورة"
				icon={IconPackageExport}
			>
				{c.consumables.length > 0 && (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-start">البند</TableHead>
									<TableHead className="text-center">النوع</TableHead>
									<TableHead className="text-center">الكمية</TableHead>
									<TableHead className="text-center">القيمة</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{c.consumables.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="text-sm">{item.nameSnapshot}</TableCell>
										<TableCell className="text-center text-xs">
											{CONSUMABLE_TYPE_LABELS[item.type] ?? item.type}
										</TableCell>
										<TableCell className="text-center text-xs tabular-nums">
											×{item.quantity}
										</TableCell>
										<TableCell className="text-center text-xs tabular-nums">
											{item.type === "ADDITIONAL"
												? money(Number(item.priceSnapshot) * item.quantity)
												: "ضمن السعر"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
				{c.invoice ? (
					<div className="grid grid-cols-2 gap-x-6">
						<Fact
							label="رقم الفاتورة"
							value={c.invoice.code}
						/>
						<Fact
							label="بنود إضافية مفوترة"
							value={String(billableConsumables.length)}
						/>
						<Fact
							label="الإجمالي"
							value={money(c.invoice.total)}
						/>
						<Fact
							label="المسدَّد"
							value={money(c.invoice.amountPaid)}
						/>
					</div>
				) : (
					<p className="text-xs text-muted-foreground">لا فاتورة لهذه الحالة</p>
				)}
			</Section>
		</div>
	);
}

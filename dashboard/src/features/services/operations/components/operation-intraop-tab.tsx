import {
	IconCircleCheckFilled,
	IconClockPlus,
	IconHeartRateMonitor,
	IconPlus,
	IconSignature,
	IconSparkles,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DateTimePopover } from "@/components/common/date-time-popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateOperationNote } from "@/features/services/operations/hooks/use-operation-ai";
import { useOperationCaseMutations } from "@/features/services/operations/hooks/use-operation-case";
import { AddVitalsDialog } from "@/features/services/vital-signs/components/add-vitals-dialog";
import { AnesthesiaEventKind, DrugRoute } from "@/generated/prisma/enums";
import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";

const EVENT_KIND_LABELS: Record<AnesthesiaEventKind, string> = {
	DRUG: "جرعة دواء",
	ABX_PROPHYLAXIS: "مضاد حيوي وقائي",
	FLUID: "سوائل",
	POSITION: "وضعية",
	EVENT: "حدث سريري",
	NOTE: "ملاحظة",
};

const ROUTE_LABELS: Record<DrugRoute, string> = {
	IV: "وريدي",
	IM: "عضلي",
	SC: "تحت الجلد",
	PO: "فموي",
	INHALATION: "استنشاقي",
	TOPICAL: "موضعي",
	EPIDURAL: "فوق الجافية",
	OTHER: "آخر",
};

const CONSUMABLE_TYPE_LABELS: Record<string, string> = {
	KIT: "عدة العملية",
	BURNED: "محروقات",
	ADDITIONAL: "إضافي",
};

const MILESTONES = [
	{ key: "premedAt", label: "التمهيد" },
	{ key: "inductionAt", label: "بدء التخدير" },
	{ key: "incisionAt", label: "الشق" },
	{ key: "closureAt", label: "الإغلاق" },
	{ key: "endAnesthesiaAt", label: "نهاية التخدير" },
	{ key: "extubationAt", label: "نزع الأنبوب" },
] as const;

const timeFormatter = new Intl.DateTimeFormat("ar", {
	hour: "2-digit",
	minute: "2-digit",
});

export type IntraopPart = "induction" | "maintenance" | "surgery" | "closing" | "all";

export function OperationIntraopTab({
	operationCase: c,
	part = "all",
	registerSave,
}: {
	operationCase: OperationCaseDetailResponse;
	/** قسم المرحلة الظاهر — لكل خطوة أدواتها لا النموذج كله مكررًا */
	part?: IntraopPart;
	/** تسجيل حفظ المرحلة — زر «التالي» في اللوحة يستدعيه قبل التقدّم */
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const anesthesia = c.anesthesia;
	const note = c.note;
	const [vitalsOpen, setVitalsOpen] = useState(false);

	const showMilestones = part === "induction" || part === "closing" || part === "all";
	const showMonitoring = part === "maintenance" || part === "all";
	const showEvents = part === "induction" || part === "maintenance" || part === "all";
	const showSurgicalItems = part === "surgery" || part === "all";
	const showCounts = part === "closing" || part === "all";
	const showNote = part === "closing" || part === "all";

	// حمولة PUT تستبدل الكل — نحافظ على القيم القائمة عند ختم معلم واحد
	const anesthesiaPayload = () => ({
		actual: anesthesia?.actual ?? null,
		airway: anesthesia?.airway ?? null,
		ettSize: anesthesia?.ettSize ?? null,
		circuit: anesthesia?.circuit ?? null,
		ivAccess: anesthesia?.ivAccess ?? null,
		monitoringIntervalMin: anesthesia?.monitoringIntervalMin ?? 5,
		premedAt: anesthesia?.premedAt ? new Date(anesthesia.premedAt).toISOString() : null,
		inductionAt: anesthesia?.inductionAt
			? new Date(anesthesia.inductionAt).toISOString()
			: null,
		incisionAt: anesthesia?.incisionAt ? new Date(anesthesia.incisionAt).toISOString() : null,
		closureAt: anesthesia?.closureAt ? new Date(anesthesia.closureAt).toISOString() : null,
		endAnesthesiaAt: anesthesia?.endAnesthesiaAt
			? new Date(anesthesia.endAnesthesiaAt).toISOString()
			: null,
		extubationAt: anesthesia?.extubationAt
			? new Date(anesthesia.extubationAt).toISOString()
			: null,
		notes: anesthesia?.notes ?? null,
	});

	/** ختم معلم — الآن أو بوقت يختاره المستخدم (لا ختم آليًا لأي معلم) */
	const stampMilestone = (key: (typeof MILESTONES)[number]["key"], at: Date = new Date()) => {
		void mutations
			.saveAnesthesia({ ...anesthesiaPayload(), [key]: at.toISOString() })
			.catch(() => {});
	};

	return (
		<div className="flex flex-col gap-5">
			{/* المعالم الزمنية */}
			{showMilestones && (
				<div className="flex flex-col gap-2">
					<h4 className="text-sm font-semibold">معالم التخدير</h4>
					<div className="grid grid-cols-3 gap-1.5">
						{MILESTONES.map(({ key, label }) => {
							const value = anesthesia?.[key];
							return (
								<div
									key={key}
									className="flex flex-col items-center gap-1 rounded-md border p-2"
								>
									<span className="text-[11px] text-muted-foreground">{label}</span>
									{value ? (
										<div className="flex items-center gap-1">
											<span className="text-sm font-semibold tabular-nums">
												{timeFormatter.format(new Date(value))}
											</span>
											{/* تصحيح الوقت بعد الختم — الخطأ وارد في غمرة العمل */}
											<DateTimePopover
												value={new Date(value)}
												onChange={(d) => stampMilestone(key, d)}
												placeholder=""
												disabled={mutations.isPending}
												className="h-5 w-6 justify-center p-0 [&>span]:hidden"
												timeLabel="الوقت"
											/>
										</div>
									) : (
										<div className="flex items-center gap-1">
											<Button
												size="sm"
												variant="outline"
												className="h-6 gap-1 px-2 text-[10px]"
												disabled={mutations.isPending}
												onClick={() => stampMilestone(key)}
											>
												<IconClockPlus className="size-3" />
												الآن
											</Button>
											{/* أو وقت يختاره المستخدم */}
											<DateTimePopover
												value={null}
												onChange={(d) => stampMilestone(key, d)}
												placeholder=""
												disabled={mutations.isPending}
												className="h-6 w-7 justify-center p-0"
												timeLabel="الوقت"
											/>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* القياسات أثناء العملية */}
			{showMonitoring && (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h4 className="flex items-center gap-1.5 text-sm font-semibold">
							<IconHeartRateMonitor className="size-4 text-muted-foreground" />
							المراقبة (كل {anesthesia?.monitoringIntervalMin ?? 5} دقائق)
						</h4>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setVitalsOpen(true)}
						>
							<IconPlus className="size-3.5" />
							قياس جديد
						</Button>
					</div>
					{c.vitalSignsRecords.length === 0 ? (
						<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
							لا قياسات بعد — تحت التخدير العام تُسجَّل كل 5 دقائق على الأكثر (AAHA/ACVAA)
						</p>
					) : (
						<div className="overflow-x-auto rounded-md border">
							<table className="w-full text-xs">
								<thead className="bg-muted/40 text-muted-foreground">
									<tr>
										<th className="px-2 py-1.5 text-start font-medium">الوقت</th>
										<th className="px-2 py-1.5 font-medium">نبض</th>
										<th className="px-2 py-1.5 font-medium">تنفس</th>
										<th className="px-2 py-1.5 font-medium">SpO2</th>
										<th className="px-2 py-1.5 font-medium">حرارة</th>
										<th className="px-2 py-1.5 font-medium">ضغط</th>
									</tr>
								</thead>
								<tbody>
									{c.vitalSignsRecords.map((v) => (
										<tr
											key={v.id}
											className="border-t tabular-nums"
										>
											<td className="px-2 py-1.5">
												{timeFormatter.format(new Date(v.recordedAt))}
											</td>
											<td className="px-2 py-1.5 text-center">{v.heartRate ?? "—"}</td>
											<td className="px-2 py-1.5 text-center">{v.respiratoryRate ?? "—"}</td>
											<td className="px-2 py-1.5 text-center">
												{v.oxygenSaturation != null ? `${v.oxygenSaturation}%` : "—"}
											</td>
											<td className="px-2 py-1.5 text-center">
												{v.temperature != null ? String(v.temperature) : "—"}
											</td>
											<td className="px-2 py-1.5 text-center">{v.bloodPressure ?? "—"}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<AddVitalsDialog
						patientId={c.patient.id}
						open={vitalsOpen}
						onOpenChange={setVitalsOpen}
						attachTo={{ type: "OPERATION", id: c.id }}
					/>
				</div>
			)}

			{/* أحداث التخدير */}
			{showEvents && <AnesthesiaEvents operationCase={c} />}

			{/* العدّ الجراحي */}
			{showCounts && <SurgicalCountTable operationCase={c} />}

			{/* الغرسات والعينات */}
			{showSurgicalItems && (
				<>
					<QuickAddList
						title="الغرسات"
						placeholder="اسم الغرسة (الشركة واللوط في الحقول التالية…)"
						items={c.implants.map((i) => ({
							id: i.id,
							label: i.name,
							meta: [i.manufacturer, i.lotNumber && `لوط ${i.lotNumber}`, i.site]
								.filter(Boolean)
								.join(" · "),
						}))}
						onAdd={(label) => mutations.addImplant({ name: label })}
						isPending={mutations.isPending}
					/>
					<QuickAddList
						title="العينات"
						placeholder="وسم العينة كما سيُقرأ في قائمة الخروج"
						items={c.specimens.map((s) => ({
							id: s.id,
							label: s.label,
							meta: s.containerCount > 1 ? `${s.containerCount} حاويات` : "",
						}))}
						onAdd={(label) => mutations.addSpecimen({ label })}
						isPending={mutations.isPending}
					/>
				</>
			)}

			{/* التقرير الجراحي */}
			{showNote && (
				<NoteSection
					operationCase={c}
					noteSigned={Boolean(note?.signedAt)}
					registerSave={registerSave}
				/>
			)}
		</div>
	);
}

function AnesthesiaEvents({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const [kind, setKind] = useState<AnesthesiaEventKind>(AnesthesiaEventKind.DRUG);
	const [agent, setAgent] = useState("");
	const [dose, setDose] = useState("");
	const [doseUnit, setDoseUnit] = useState("mg");
	const [route, setRoute] = useState<DrugRoute>(DrugRoute.IV);

	const isDrug = kind === "DRUG" || kind === "ABX_PROPHYLAXIS" || kind === "FLUID";
	const events = c.anesthesia?.events ?? [];

	const addEvent = () => {
		if (!agent.trim()) return;
		void mutations
			.addAnesthesiaEvent({
				kind,
				agentName: agent.trim(),
				dose: isDrug && dose !== "" ? Number(dose) : null,
				doseUnit: isDrug && dose !== "" ? doseUnit : null,
				route: isDrug ? route : null,
			})
			.then(() => {
				setAgent("");
				setDose("");
			})
			.catch((err: Error) => toast.error(err.message || "تعذّر تسجيل الحدث"));
	};

	return (
		<div className="flex flex-col gap-2">
			<h4 className="text-sm font-semibold">أحداث التخدير</h4>
			<div className="flex flex-wrap items-center gap-1.5 rounded-md border p-2">
				<Select
					value={kind}
					onValueChange={(v) => setKind(v as AnesthesiaEventKind)}
				>
					<SelectTrigger
						size="sm"
						dir="rtl"
						className="w-32"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						position="popper"
						dir="rtl"
					>
						{Object.values(AnesthesiaEventKind).map((k) => (
							<SelectItem
								key={k}
								value={k}
							>
								{EVENT_KIND_LABELS[k]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					className="h-8 flex-1 text-xs"
					placeholder={isDrug ? "الدواء/السائل" : "الوصف"}
					value={agent}
					onChange={(e) => setAgent(e.target.value)}
				/>
				{isDrug && (
					<>
						<Input
							className="h-8 w-16 text-xs"
							type="number"
							min={0}
							placeholder="جرعة"
							value={dose}
							onChange={(e) => setDose(e.target.value)}
						/>
						<Input
							className="h-8 w-14 text-xs"
							placeholder="وحدة"
							value={doseUnit}
							onChange={(e) => setDoseUnit(e.target.value)}
						/>
						<Select
							value={route}
							onValueChange={(v) => setRoute(v as DrugRoute)}
						>
							<SelectTrigger
								size="sm"
								dir="rtl"
								className="w-24"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent
								position="popper"
								dir="rtl"
							>
								{Object.values(DrugRoute).map((r) => (
									<SelectItem
										key={r}
										value={r}
									>
										{ROUTE_LABELS[r]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</>
				)}
				<Button
					size="sm"
					disabled={mutations.isPending || !agent.trim()}
					onClick={addEvent}
				>
					<IconPlus className="size-3.5" />
					تسجيل
				</Button>
			</div>
			{events.length > 0 && (
				<div className="flex flex-col gap-1">
					{events.map((e) => (
						<div
							key={e.id}
							className="flex items-center gap-2 rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
						>
							<span className="shrink-0 font-medium tabular-nums">
								{timeFormatter.format(new Date(e.at))}
							</span>
							<Badge
								variant="outline"
								className="shrink-0 text-[10px]"
							>
								{EVENT_KIND_LABELS[e.kind]}
							</Badge>
							<span className="truncate">
								{e.agentName}
								{e.dose != null ? ` — ${e.dose} ${e.doseUnit ?? ""}` : ""}
								{e.route ? ` (${ROUTE_LABELS[e.route]})` : ""}
								{e.detail ? ` · ${e.detail}` : ""}
							</span>
							<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
								{e.recordedBy.name}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * العدّ الجراحي (S10) — جدول البنود المستدورة فعلًا: ما صُرف يُعدّ
 * قبل الإغلاق. المصدر الوحيد هو مستهلكات الحالة (عدة القالب والمحروقات
 * والإضافي) — لا فئات مجردة منفصلة عمّا خرج من المخزون.
 */
function SurgicalCountTable({
	operationCase: c,
}: {
	operationCase: OperationCaseDetailResponse;
}) {
	const counted = c.consumables.filter((item) => item.countedQuantity != null);
	const mismatched = c.consumables.filter(
		(item) => item.countedQuantity != null && item.countedQuantity !== item.quantity,
	);
	const allCounted = c.consumables.length > 0 && counted.length === c.consumables.length;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<h4 className="flex items-center gap-1.5 text-sm font-semibold">
					العدّ الجراحي (S10)
					{c.consumables.length > 0 && (
						<Badge
							variant="outline"
							className={
								mismatched.length > 0
									? "gap-1 border-red-200 bg-red-50 text-[10px] text-red-700"
									: allCounted
										? "gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
										: "text-[10px] tabular-nums"
							}
						>
							{mismatched.length > 0 ? (
								`فرق في ${mismatched.length} بند`
							) : allCounted ? (
								<>
									<IconCircleCheckFilled className="size-3" />
									مطابق بالكامل
								</>
							) : (
								`عُدّ ${counted.length}/${c.consumables.length}`
							)}
						</Badge>
					)}
				</h4>
			</div>
			<p className="text-[11px] text-muted-foreground">
				يُعدّ ما صُرف فعلًا قبل الإغلاق — أي فرق عن الكمية المصروفة يُوثّق ويُصعّد، ولا يُتجاهل.
			</p>

			{c.consumables.length === 0 ? (
				<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
					لا بنود مستدورة لهذه الحالة — أضف المستهلكات من تبويب الفاتورة أو مرحلة قائمة الخروج
					لتظهر هنا للعدّ.
				</p>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">البند</TableHead>
								<TableHead className="text-center">النوع</TableHead>
								<TableHead className="text-center">المصروف</TableHead>
								<TableHead className="text-center">العدد النهائي</TableHead>
								<TableHead className="text-center">المطابقة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{c.consumables.map((item) => (
								<ConsumableCountRow
									key={item.id}
									operationCase={c}
									item={item}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{mismatched.length > 0 && (
				<p className="rounded-[4px] border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
					فرق في العدّ: {mismatched.map((x) => x.nameSnapshot).join("، ")} — لا تغلق قبل التحقق
					من موضع الفارق وتوثيقه.
				</p>
			)}
		</div>
	);
}

/** صف عدّ لبند مستهلك — العدد النهائي يُقارن بالكمية المصروفة */
function ConsumableCountRow({
	operationCase: c,
	item,
}: {
	operationCase: OperationCaseDetailResponse;
	item: OperationCaseDetailResponse["consumables"][number];
}) {
	const mutations = useOperationCaseMutations(c.id);
	const [value, setValue] = useState(item.countedQuantity?.toString() ?? "");
	const [note, setNote] = useState(item.countNote ?? "");

	const counted = item.countedQuantity;
	const matches = counted != null && counted === item.quantity;
	const mismatch = counted != null && counted !== item.quantity;

	const save = (nextValue: string, nextNote: string) => {
		const parsed = nextValue !== "" ? Number(nextValue) : null;
		if (parsed === item.countedQuantity && nextNote === (item.countNote ?? "")) return;
		void mutations
			.countConsumable({
				consumableId: item.id,
				countedQuantity: parsed,
				countNote: nextNote || null,
			})
			.catch((err: Error) => toast.error(err.message || "تعذّر تسجيل العدّ"));
	};

	return (
		<TableRow>
			<TableCell>
				<div className="flex flex-col">
					<span className="text-sm font-medium">{item.nameSnapshot}</span>
					{/* فرق العدّ يُوثّق في موضعه — لا يُكتفى بشارة حمراء */}
					{mismatch && (
						<Input
							className="mt-1 h-7 text-xs"
							placeholder="أين ذهب الفارق؟ (إلزامي للتوثيق)"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							onBlur={() => save(value, note)}
						/>
					)}
					{!mismatch && item.countNote && (
						<span className="text-[10px] text-muted-foreground">{item.countNote}</span>
					)}
				</div>
			</TableCell>
			<TableCell className="text-center">
				<Badge
					variant="outline"
					className="text-[10px]"
				>
					{CONSUMABLE_TYPE_LABELS[item.type] ?? item.type}
				</Badge>
			</TableCell>
			<TableCell className="text-center text-sm tabular-nums">{item.quantity}</TableCell>
			<TableCell className="text-center">
				<div className="flex items-center justify-center gap-1">
					<Input
						className="h-7 w-16 text-center text-xs"
						type="number"
						min={0}
						placeholder="العدد"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onBlur={() => save(value, note)}
					/>
					{/* المطابق هو الغالب — زر واحد يسجّله دون كتابة */}
					{counted == null && (
						<Button
							size="sm"
							variant="outline"
							className="h-7 px-2 text-[10px]"
							disabled={mutations.isPending}
							onClick={() => {
								setValue(String(item.quantity));
								save(String(item.quantity), note);
							}}
						>
							مطابق
						</Button>
					)}
				</div>
			</TableCell>
			<TableCell className="text-center">
				{matches ? (
					<Badge
						variant="outline"
						className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
					>
						<IconCircleCheckFilled className="size-3" />
						مطابق
					</Badge>
				) : mismatch ? (
					<Badge
						variant="outline"
						className="border-red-200 bg-red-50 text-[10px] tabular-nums text-red-700"
					>
						فرق {counted - item.quantity > 0 ? "+" : ""}
						{counted - item.quantity}
					</Badge>
				) : (
					<span className="text-[10px] text-muted-foreground">لم يُعدّ بعد</span>
				)}
			</TableCell>
		</TableRow>
	);
}

function QuickAddList({
	title,
	placeholder,
	items,
	onAdd,
	isPending,
}: {
	title: string;
	placeholder: string;
	items: { id: string; label: string; meta: string }[];
	onAdd: (label: string) => Promise<unknown>;
	isPending: boolean;
}) {
	const [value, setValue] = useState("");
	return (
		<div className="flex flex-col gap-2">
			<h4 className="text-sm font-semibold">{title}</h4>
			<div className="flex items-center gap-1.5">
				<Input
					className="h-8 flex-1 text-xs"
					placeholder={placeholder}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button
					size="sm"
					variant="outline"
					disabled={isPending || !value.trim()}
					onClick={() => {
						void onAdd(value.trim())
							.then(() => setValue(""))
							.catch(() => {});
					}}
				>
					<IconPlus className="size-3.5" />
					إضافة
				</Button>
			</div>
			{items.map((item) => (
				<div
					key={item.id}
					className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-xs"
				>
					<span className="font-medium">{item.label}</span>
					<span className="text-muted-foreground">{item.meta}</span>
				</div>
			))}
		</div>
	);
}

function NoteSection({
	operationCase: c,
	noteSigned,
	registerSave,
}: {
	operationCase: OperationCaseDetailResponse;
	noteSigned: boolean;
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const mutations = useOperationCaseMutations(c.id);
	const { generateNote, isPending: isGeneratingNote } = useGenerateOperationNote();
	const note = c.note;
	const [proceduresPerformed, setProceduresPerformed] = useState(
		note?.proceduresPerformed ?? "",
	);
	const [findings, setFindings] = useState(note?.findings ?? "");
	const [technique, setTechnique] = useState(note?.technique ?? "");
	const [ebl, setEbl] = useState(note?.estimatedBloodLossMl?.toString() ?? "");
	const [closureDetails, setClosureDetails] = useState(note?.closureDetails ?? "");

	const save = () =>
		mutations.saveNote({
			proceduresPerformed: proceduresPerformed || null,
			findings: findings || null,
			technique: technique || null,
			estimatedBloodLossMl: ebl !== "" ? Number(ebl) : null,
			closureDetails: closureDetails || null,
		});

	// زر «التالي» في اللوحة يحفظ التقرير بنفسه — لا زر حفظ مستقل في كل خطوة
	// biome-ignore lint/correctness/useExhaustiveDependencies: التسجيل يتجدد مع القيم الحالية
	useEffect(() => {
		if (!registerSave) return;
		if (noteSigned) {
			registerSave(null);
			return;
		}
		registerSave(() => save());
		return () => registerSave(null);
	}, [
		registerSave,
		noteSigned,
		proceduresPerformed,
		findings,
		technique,
		ebl,
		closureDetails,
	]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">التقرير الجراحي (بوابة G7)</h4>
				{noteSigned ? (
					<Badge
						variant="outline"
						className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
					>
						<IconCircleCheckFilled className="size-3" />
						موقَّع — {note?.signedBy?.name}
					</Badge>
				) : (
					<Button
						size="sm"
						variant="outline"
						className="gap-1.5"
						disabled={isGeneratingNote}
						onClick={() => {
							void generateNote({ caseId: c.id })
								.then((draft) => {
									// المسودة تهبط في الحقول القابلة للتحرير — لا حفظ آلي
									if (draft.proceduresPerformed)
										setProceduresPerformed(draft.proceduresPerformed);
									if (draft.findings) setFindings(draft.findings);
									if (draft.technique) setTechnique(draft.technique);
									if (draft.closureDetails) setClosureDetails(draft.closureDetails);
								})
								.catch(() => {});
						}}
					>
						<IconSparkles className="size-3.5 text-amber-500" />
						{isGeneratingNote ? "جارٍ الصياغة..." : "مسودة بالذكاء الاصطناعي"}
					</Button>
				)}
			</div>
			<Field>
				<Label className="text-xs font-medium">ما نُفّذ فعلًا</Label>
				<Textarea
					rows={2}
					disabled={noteSigned}
					value={proceduresPerformed}
					onChange={(e) => setProceduresPerformed(e.target.value)}
				/>
			</Field>
			<Field>
				<Label className="text-xs font-medium">الموجودات</Label>
				<Textarea
					rows={2}
					disabled={noteSigned}
					value={findings}
					onChange={(e) => setFindings(e.target.value)}
				/>
			</Field>
			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label className="text-xs font-medium">التقنية</Label>
					<Textarea
						rows={2}
						disabled={noteSigned}
						value={technique}
						onChange={(e) => setTechnique(e.target.value)}
					/>
				</Field>
				<Field>
					<Label className="text-xs font-medium">فقد الدم التقديري (مل)</Label>
					<Input
						type="number"
						min={0}
						disabled={noteSigned}
						value={ebl}
						onChange={(e) => setEbl(e.target.value)}
					/>
					<Label className="mt-2 text-xs font-medium">الإغلاق والدرنقة</Label>
					<Input
						disabled={noteSigned}
						value={closureDetails}
						onChange={(e) => setClosureDetails(e.target.value)}
					/>
				</Field>
			</div>
			{!noteSigned && (
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="outline"
						disabled={mutations.isPending}
						onClick={() => void save().catch(() => {})}
					>
						حفظ التقرير
					</Button>
					<Button
						size="sm"
						disabled={mutations.isPending}
						onClick={() =>
							void save()
								.then(() => mutations.signNote())
								.catch(() => {})
						}
					>
						<IconSignature className="size-3.5" />
						توقيع التقرير
					</Button>
				</div>
			)}
		</div>
	);
}

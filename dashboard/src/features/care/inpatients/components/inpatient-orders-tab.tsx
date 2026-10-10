import {
	IconChevronLeft,
	IconFlask,
	IconPill,
	IconPlus,
	IconRadioactive,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
	ORDER_KIND_META,
	SCHEDULE_PRESETS,
} from "@/features/care/inpatients/data/inpatients-data";
import {
	useCreateOrder,
	useDiscontinueOrder,
	useInpatientOrders,
	useInpatientRequests,
} from "@/features/care/inpatients/hooks/use-inpatients";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { MedicationsPanel } from "@/features/pharmacy/components/medications-panel";
import { AddLabTestModal } from "@/features/services/lab-tests/components/add-lab-test-modal";
import { LabTestSheet } from "@/features/services/lab-tests/components/lab-test-sheet";
import { useSelectedLabTestStore } from "@/features/services/lab-tests/stores/selected-lab-test.store";
import { AddRadiologyModal } from "@/features/services/radiology/components/add-radiology-modal";
import { RadiologyOrderSheet } from "@/features/services/radiology/components/radiology-order-sheet";
import { useSelectedRadiologyOrderStore } from "@/features/services/radiology/stores/selected-radiology-order.store";
import type { InpatientOrderKind } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { generateAdministrationDueTimes } from "@sanad/contracts/runtime/server/inpatients/inpatient-due.service";

/**
 * أوامر الإقامة.
 *
 * النموذج يُظهر الجدولة كخيارات جاهزة (q8h…) لا كحقل حرّ: «كل ٨ ساعات» هو ما
 * يقوله المدرّب فعلًا، وكتابةُ الرقم يدويًّا في كل مرّة تُنتج أخطاءً صامتة.
 *
 * سبب الإيقاف إلزامي: أمرٌ يختفي بلا سبب يُفقد السجل «لماذا أُوقف المضادّ في
 * اليوم الثالث؟» — وهو أوّل ما يُسأل عند مراجعة حالة تدهورت.
 */

const ROUTES = ["IV", "IM", "SC", "PO", "INHALATION", "TOPICAL", "EPIDURAL", "OTHER"] as const;

export function InpatientOrdersTab({
	stayId,
	readOnly,
	patientId,
	ownerId,
	branchId,
}: {
	stayId: string;
	readOnly: boolean;
	patientId: string;
	ownerId: string;
	branchId: string;
}) {
	const { orders, isLoading } = useInpatientOrders(stayId);
	const { requests } = useInpatientRequests(stayId);
	const [adding, setAdding] = useState(false);
	const [labOpen, setLabOpen] = useState(false);
	const [rxOpen, setRxOpen] = useState(false);
	const [imagingOpen, setImagingOpen] = useState(false);

	const preset = { patientId, ownerId, branchId, inpatientStayId: stayId };

	const [labSheetId, setLabSheetId] = useState<string | null>(null);
	const selectLab = useSelectedLabTestStore((st) => st.select);
	const closeLab = useSelectedLabTestStore((st) => st.close);
	const selectImaging = useSelectedRadiologyOrderStore((st) => st.select);

	/**
	 * الفتح يمرّ بمتجر الوحدة نفسها كي تصل «النيّة» (أي بند يُبرز) — وهو ما تقرأه
	 * الورقتان لتفتحا على البند المقصود لا على أوّل بند في الطلب.
	 */
	const openRequest = (r: RequestRow) => {
		if (r.kind === "LAB") {
			selectLab(r.orderId, { tab: "details", itemId: r.itemId, focusItemId: r.itemId });
			setLabSheetId(r.orderId);
			return;
		}
		if (r.kind === "IMAGING") {
			selectImaging(r.orderId, { tab: "details", itemId: r.itemId, focusItemId: r.itemId });
			return;
		}
		// الوصفة معروضة في اللوحة أعلاه — يُفتح مكانها بدل ورقة ثالثة
		setRxOpen(true);
	};

	return (
		<div className="space-y-4">
			{/*
			  [IP2] كل ما يطلبه المدرّب من مكان واحد.
			  الأوامر الدوائية تعيش في الإقامة، والتحاليل والأشعّة تُنشأ في وحدتيهما
			  مربوطةً بالإقامة — لا نسخة ثانية من المختبر داخل التنويم. وما يكتمل
			  منها يدخل فاتورة الإقامة عند الخروج، بلا دفع مسبق.
			*/}
			{!readOnly && (
				<div className="flex flex-wrap items-center gap-2 rounded-[4px] border bg-muted/30 p-3">
					<span className="text-sm font-medium">اطلب للطفل:</span>
					{/* الدواء أوّلًا — أكثر ما يُطلب في العنبر، وكان مدفونًا خلف «أمر جديد» */}
					<Button
						size="sm"
						variant="outline"
						onClick={() => setRxOpen((v) => !v)}
					>
						<IconPill className="size-4" />
						دواء
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setLabOpen(true)}
					>
						<IconFlask className="size-4" />
						تحليل
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setImagingOpen(true)}
					>
						<IconRadioactive className="size-4" />
						أشعّة
					</Button>
					<span className="ms-auto text-[11px] text-muted-foreground">
						يُضاف إلى فاتورة الإقامة عند تنفيذه — بلا دفع مسبق
					</span>
				</div>
			)}

			{rxOpen && (
				<div className="rounded-[4px] border">
					<div className="flex items-center justify-between border-b px-3 py-1.5">
						<span className="text-xs font-medium">وصفة الإقامة</span>
						<span className="text-[11px] text-muted-foreground">
							تُصرف من الصيدلية بلا سداد — وبالصرف يظهر جدولها في ورقة العلاج
						</span>
					</div>
					<div className="p-3">
						<MedicationsPanel
							inpatientStayId={stayId}
							patientId={patientId}
							disabled={readOnly}
						/>
					</div>
				</div>
			)}

			{requests.length > 0 && (
				<div className="rounded-[4px] border">
					<div className="flex items-center justify-between border-b px-3 py-1.5">
						<span className="text-xs font-medium">التحاليل والأشعّة المطلوبة</span>
						<span className="text-[11px] text-muted-foreground tabular-nums">
							{requests.length} طلب — تُحاسَب على فاتورة الإقامة، بلا دفع مسبق
						</span>
					</div>
					<ul className="divide-y">
						{(requests as unknown as RequestRow[]).map((r) => (
							<li key={r.itemId}>
								{/*
								  [IP3] الصفّ يفتح ورقة الطلب نفسها في وحدتها — لا عارضَ نتائج
								  ثانيًا داخل التنويم. ورقة المختبر تحمل النتائج والمدى المرجعي
								  وسلسلة الحفاظ على العيّنة؛ نسخةٌ مبسّطة هنا كانت ستكذب على
								  قارئها بأوّل قيمة حرجة لا تعرض علامتها.
								*/}
								<button
									type="button"
									className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm hover:bg-accent"
									onClick={() => openRequest(r)}
								>
									{r.kind === "LAB" ? (
										<IconFlask className="size-4 shrink-0 text-sky-600" />
									) : r.kind === "PHARMACY" ? (
										<IconPill className="size-4 shrink-0 text-violet-600" />
									) : (
										<IconRadioactive className="size-4 shrink-0 text-amber-600" />
									)}
									<span className="min-w-0 truncate font-medium">{r.serviceName}</span>
									<span className="text-muted-foreground text-xs tabular-nums">{r.code}</span>
									<span
										className={cn(
											"ms-auto rounded-full border px-2 py-0.5 text-[11px]",
											r.status === "COMPLETED"
												? "border-emerald-200 bg-emerald-50 text-emerald-700"
												: r.status === "CANCELLED"
													? "border-border bg-muted text-muted-foreground"
													: "border-amber-200 bg-amber-50 text-amber-700",
										)}
									>
										{REQUEST_STATUS_LABELS[r.status] ?? r.status}
									</span>
									<IconChevronLeft className="size-4 shrink-0 text-muted-foreground" />
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			<LabTestSheet
				labTestId={labSheetId}
				open={Boolean(labSheetId)}
				onClose={() => {
					setLabSheetId(null);
					closeLab();
				}}
			/>
			{/* ورقة الأشعّة تقرأ متجرها بالكامل — تُركَّب بلا خصائص */}
			<RadiologyOrderSheet />

			<AddLabTestModal
				preset={preset}
				open={labOpen}
				onOpenChange={setLabOpen}
			/>
			<AddRadiologyModal
				preset={preset}
				open={imagingOpen}
				onOpenChange={setImagingOpen}
			/>

			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">الأوامر الطبية</h3>
				{!readOnly && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => setAdding((v) => !v)}
					>
						<IconPlus className="size-4" />
						أمر جديد
					</Button>
				)}
			</div>

			{adding && !readOnly && (
				<CreateOrderForm
					stayId={stayId}
					onDone={() => setAdding(false)}
				/>
			)}

			{isLoading ? (
				<div className="space-y-2">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			) : orders.length === 0 ? (
				<p className="rounded border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
					لا أوامر بعد — أضِف أوّل أمر لتُجدول جرعاته تلقائيًا
				</p>
			) : (
				<div className="space-y-2">
					{(orders as unknown as OrderRow[]).map((order) => (
						<OrderCard
							key={order.id}
							order={order}
							stayId={stayId}
							readOnly={readOnly}
						/>
					))}
				</div>
			)}
		</div>
	);
}

type RequestRow = {
	kind: "LAB" | "IMAGING" | "PHARMACY";
	orderId: string;
	itemId: string;
	code: string;
	serviceName: string;
	status: string;
	createdAt: string;
};

/** حالات المختبر والأشعّة معًا — ما يهمّ العنبر هو «قيد التنفيذ / اكتمل / أُلغي» */
const REQUEST_STATUS_LABELS: Record<string, string> = {
	QUEUE: "في الطابور",
	SCHEDULED: "مجدول",
	SAMPLE_COLLECTION: "سحب العيّنة",
	IN_LAB: "في المختبر",
	PREPARATION: "تحضير",
	IMAGING: "تصوير",
	REPORTING: "كتابة التقرير",
	UNDER_REVIEW: "قيد المراجعة",
	COMPLETED: "مكتمل",
	CANCELLED: "ملغي",
	// حالات الوصفة
	DRAFT: "مسوّدة",
	ACTIVE: "بانتظار الصرف",
};

type OrderRow = {
	id: string;
	kind: InpatientOrderKind;
	status: string;
	nameSnapshot: string;
	doseAmount: string | number | null;
	doseUnit: string | null;
	route: string | null;
	rateMlPerHour: string | number | null;
	doseSource: string | null;
	overrideReasonAr: string | null;
	scheduleIntervalHours: number | null;
	scheduleTimes: string[];
	prn: boolean;
	startAt: string | Date;
	endAt: string | Date | null;
	instructionsAr: string | null;
	discontinueReasonAr: string | null;
	orderedBy: { name: string } | null;
};

function OrderCard({
	order,
	stayId,
	readOnly,
}: {
	order: OrderRow;
	stayId: string;
	readOnly: boolean;
}) {
	const kind = ORDER_KIND_META[order.kind];
	const KindIcon = kind.icon;
	const discontinue = useDiscontinueOrder(stayId);
	const [stopping, setStopping] = useState(false);
	const [reason, setReason] = useState("");
	const isActive = order.status === "ACTIVE";

	return (
		<div className={cn("rounded border bg-card p-3", !isActive && "opacity-60")}>
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded bg-muted">
					<KindIcon className="size-4 text-muted-foreground" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span className="text-sm font-medium">{order.nameSnapshot}</span>
						<Badge
							variant="outline"
							className="h-4 px-1 text-[10px]"
						>
							{kind.label}
						</Badge>
						{!isActive && (
							<Badge
								variant="secondary"
								className="h-4 px-1 text-[10px]"
							>
								{order.status === "DISCONTINUED" ? "أُوقف" : "منتهٍ"}
							</Badge>
						)}
						{/* التجاوز يبقى ظاهرًا على الأمر لا مدفونًا في السجل */}
						{order.doseSource === "OVERRIDE" && (
							<Badge
								variant="destructive"
								className="h-4 px-1 text-[10px]"
							>
								جرعة خارج المدى
							</Badge>
						)}
					</div>

					<div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
						{order.doseAmount != null && (
							<span className="font-mono tabular-nums">
								{String(order.doseAmount)} {order.doseUnit ?? ""}
								{order.route ? ` · ${order.route}` : ""}
							</span>
						)}
						{order.rateMlPerHour != null && (
							<span className="font-mono tabular-nums">
								{String(order.rateMlPerHour)} مل/س
							</span>
						)}
						<span>{scheduleLabel(order)}</span>
						{order.orderedBy && <span>د. {order.orderedBy.name}</span>}
					</div>

					{order.overrideReasonAr && (
						<p className="mt-1 text-[11px] text-destructive">
							سبب التجاوز: {order.overrideReasonAr}
						</p>
					)}
					{order.instructionsAr && (
						<p className="mt-1 text-[11px] text-muted-foreground">{order.instructionsAr}</p>
					)}
					{order.discontinueReasonAr && (
						<p className="mt-1 text-[11px] text-muted-foreground">
							سبب الإيقاف: {order.discontinueReasonAr}
						</p>
					)}
				</div>

				{isActive && !readOnly && (
					<Button
						size="sm"
						variant="ghost"
						className="shrink-0"
						onClick={() => setStopping((v) => !v)}
					>
						إيقاف
					</Button>
				)}
			</div>

			{stopping && (
				<div className="mt-3 space-y-2 border-t pt-3">
					<Label
						htmlFor={`stop-${order.id}`}
						className="text-xs"
					>
						سبب الإيقاف <span className="text-destructive">*</span>
					</Label>
					<Textarea
						id={`stop-${order.id}`}
						rows={2}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						disabled={discontinue.isPending}
					/>
					<div className="flex gap-2">
						<Button
							size="sm"
							disabled={reason.trim().length < 3 || discontinue.isPending}
							onClick={() =>
								discontinue.mutate(
									{ orderId: order.id, reasonAr: reason },
									{ onSuccess: () => setStopping(false) },
								)
							}
						>
							تأكيد الإيقاف
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setStopping(false)}
						>
							تراجع
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

const scheduleLabel = (order: OrderRow): string => {
	if (order.prn) return "عند اللزوم";
	if (order.scheduleTimes.length > 0) return order.scheduleTimes.join(" · ");
	if (order.scheduleIntervalHours) return `كل ${order.scheduleIntervalHours} ساعة`;
	return "بلا جدول";
};

/** قيمة `datetime-local` محلية — أقرب ربع ساعة قادم، فلا تُجدول جرعة في الماضي */
const nextQuarterHourLocal = (): string => {
	const d = new Date();
	d.setSeconds(0, 0);
	d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const previewTimeFmt = new Intl.DateTimeFormat("ar", {
	weekday: "short",
	hour: "2-digit",
	minute: "2-digit",
});

function CreateOrderForm({ stayId, onDone }: { stayId: string; onDone: () => void }) {
	const create = useCreateOrder(stayId);
	const [kind, setKind] = useState<InpatientOrderKind>("MEDICATION");
	const [name, setName] = useState("");
	/**
	 * الدواء يُختار من المخزون لا يُكتب: الاختيار يربط الأمر بالصنف فيُخصم عند
	 * الإعطاء ويُسعَّر على الفاتورة، والنصّ الحرّ يبقى بابًا لما ليس في المخزون.
	 */
	const [inventoryItemId, setInventoryItemId] = useState<string | null>(null);
	const [itemComboOpen, setItemComboOpen] = useState(false);
	const { inventory } = useInventory();
	/** أوّل جرعة — المدرّب يقولها؛ «الآن» كان مفروضًا ولا يُرى */
	const [startAt, setStartAt] = useState<string>(nextQuarterHourLocal);
	const [doseAmount, setDoseAmount] = useState("");
	const [doseUnit, setDoseUnit] = useState("مجم");
	const [route, setRoute] = useState<string>("IV");
	const [rate, setRate] = useState("");
	const [intervalHours, setIntervalHours] = useState<number | null>(8);
	const [prn, setPrn] = useState(false);
	const [instructions, setInstructions] = useState("");
	const [overrideReason, setOverrideReason] = useState("");

	const needsDose = kind === "MEDICATION";
	const needsRate = kind === "FLUID";
	const selectedItem = inventory.find((i) => i.id === inventoryItemId);

	/**
	 * جدول الإعطاء المتوقَّع — نفس المولِّد الذي يشغّله الخادم، على أوّل ٤٨ ساعة.
	 * المدرّب يرى ما سيُجدول قبل أن يحفظ، فلا يكتشف بعد الحفظ أن «كل ٨ ساعات»
	 * ابتداءً من ٢:٠٠ فجرًا تعني إيقاظ الطفل في أوقات لم يقصدها.
	 */
	const preview = useMemo(() => {
		const start = new Date(startAt);
		if (prn || !intervalHours || Number.isNaN(start.getTime())) return [];
		return generateAdministrationDueTimes({
			startAt: start,
			endAt: null,
			scheduleIntervalHours: intervalHours,
			scheduleTimes: [],
			prn: false,
			horizonEnd: new Date(start.getTime() + 48 * 60 * 60 * 1000),
			maxOccurrences: 12,
		});
	}, [startAt, prn, intervalHours]);

	const submit = () => {
		create.mutate(
			{
				kind,
				nameSnapshot: name,
				inventoryItemId: needsDose ? inventoryItemId : null,
				doseAmount: needsDose && doseAmount ? Number(doseAmount) : null,
				doseUnit: needsDose ? doseUnit : null,
				route: needsDose || needsRate ? route : null,
				rateMlPerHour: needsRate && rate ? Number(rate) : null,
				overrideReasonAr: overrideReason || null,
				scheduleIntervalHours: prn ? null : intervalHours,
				scheduleTimes: [],
				prn,
				startAt: new Date(startAt).toISOString(),
				instructionsAr: instructions || null,
			},
			{ onSuccess: onDone },
		);
	};

	return (
		<div className="space-y-3 rounded border bg-muted/30 p-3">
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label className="text-xs">نوع الأمر</Label>
					<Select
						value={kind}
						onValueChange={(v) => setKind(v as InpatientOrderKind)}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						{/* popper إلزامي — الافتراضي يخرج خارج الشاشة في RTL */}
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{Object.entries(ORDER_KIND_META).map(([value, meta]) => (
								<SelectItem
									key={value}
									value={value}
								>
									{meta.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label
						htmlFor="order-name"
						className="text-xs"
					>
						{needsDose ? "الدواء" : "الاسم"} <span className="text-destructive">*</span>
					</Label>
					{needsDose ? (
						<Combobox
							open={itemComboOpen}
							onOpenChange={setItemComboOpen}
							value={inventoryItemId ?? ""}
							onValueChange={(value) => {
								const id = typeof value === "string" && value ? value : null;
								setInventoryItemId(id);
								const item = inventory.find((i) => i.id === id);
								if (item) setName(item.name);
							}}
						>
							<ComboboxTrigger
								className="flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-right text-sm"
								disabled={create.isPending}
							>
								<ComboboxValue
									placeholder="اختر من المخزون..."
									className="truncate"
								>
									{selectedItem?.name}
								</ComboboxValue>
							</ComboboxTrigger>
							<ComboboxContent dir="rtl">
								<ComboboxList>
									{inventory.length === 0 ? (
										<ComboboxEmpty>لا أصناف في المخزون</ComboboxEmpty>
									) : (
										inventory.map((item) => (
											<ComboboxItem
												key={item.id}
												value={item.id}
											>
												<span className="truncate">{item.name}</span>
												{item.sku && (
													<span className="ms-auto text-muted-foreground text-xs tabular-nums">
														{item.sku}
													</span>
												)}
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					) : (
						<Input
							id="order-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="قياس علامات حيوية"
							disabled={create.isPending}
						/>
					)}
					{needsDose && (
						<Input
							id="order-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="أو اكتب اسمًا لدواء ليس في المخزون"
							className="h-8 text-xs"
							disabled={create.isPending}
						/>
					)}
				</div>
			</div>

			{needsDose && (
				<div className="grid gap-3 sm:grid-cols-3">
					<div className="space-y-1.5">
						<Label
							htmlFor="order-dose"
							className="text-xs"
						>
							الجرعة
						</Label>
						<Input
							id="order-dose"
							inputMode="decimal"
							value={doseAmount}
							onChange={(e) => setDoseAmount(e.target.value)}
							disabled={create.isPending}
						/>
					</div>
					<div className="space-y-1.5">
						<Label
							htmlFor="order-unit"
							className="text-xs"
						>
							الوحدة
						</Label>
						<Input
							id="order-unit"
							value={doseUnit}
							onChange={(e) => setDoseUnit(e.target.value)}
							disabled={create.isPending}
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-xs">الطريق</Label>
						<Select
							value={route}
							onValueChange={setRoute}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent
								position="popper"
								dir="rtl"
							>
								{ROUTES.map((r) => (
									<SelectItem
										key={r}
										value={r}
									>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			{needsRate && (
				<div className="space-y-1.5">
					<Label
						htmlFor="order-rate"
						className="text-xs"
					>
						المعدّل (مل/ساعة)
					</Label>
					<Input
						id="order-rate"
						inputMode="decimal"
						value={rate}
						onChange={(e) => setRate(e.target.value)}
						disabled={create.isPending}
					/>
				</div>
			)}

			<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
				<div className="space-y-1.5">
					<Label className="text-xs">الجدولة</Label>
					<div className="flex flex-wrap gap-1.5">
						{SCHEDULE_PRESETS.map((preset) => (
							<button
								key={preset.intervalHours}
								type="button"
								onClick={() => {
									setPrn(false);
									setIntervalHours(preset.intervalHours);
								}}
								className={cn(
									"rounded border px-2.5 py-1 text-xs transition-colors",
									!prn && intervalHours === preset.intervalHours
										? "border-primary bg-primary/10 text-primary"
										: "border-border text-muted-foreground hover:bg-accent",
								)}
							>
								{preset.label}
							</button>
						))}
						<button
							type="button"
							onClick={() => setPrn(true)}
							className={cn(
								"rounded border px-2.5 py-1 text-xs transition-colors",
								prn
									? "border-primary bg-primary/10 text-primary"
									: "border-border text-muted-foreground hover:bg-accent",
							)}
						>
							عند اللزوم
						</button>
					</div>
				</div>
				{!prn && (
					<div className="space-y-1.5">
						<Label
							htmlFor="order-start"
							className="text-xs"
						>
							أوّل جرعة
						</Label>
						<Input
							id="order-start"
							type="datetime-local"
							dir="ltr"
							value={startAt}
							onChange={(e) => setStartAt(e.target.value)}
							disabled={create.isPending}
						/>
					</div>
				)}
			</div>

			{preview.length > 0 && (
				<div className="rounded border bg-background">
					<div className="flex items-center justify-between border-b px-3 py-1.5">
						<span className="text-xs font-medium">الجدول المتوقَّع — أوّل ٤٨ ساعة</span>
						<span className="text-[11px] text-muted-foreground tabular-nums">
							{preview.length} جرعة · كل {intervalHours} ساعة
						</span>
					</div>
					<ol className="grid grid-cols-2 gap-x-3 px-3 py-2 text-xs sm:grid-cols-3">
						{preview.map((t, i) => (
							<li
								key={t.toISOString()}
								className="flex items-center gap-1.5 py-0.5 tabular-nums"
							>
								<span className="w-4 text-muted-foreground">{i + 1}.</span>
								{previewTimeFmt.format(t)}
							</li>
						))}
					</ol>
					<p className="border-t px-3 py-1.5 text-[11px] text-muted-foreground">
						يُمدَّد الجدول تلقائيًا يومًا بيوم ما دام الأمر جاريًا
					</p>
				</div>
			)}

			<div className="space-y-1.5">
				<Label
					htmlFor="order-instructions"
					className="text-xs"
				>
					تعليمات (اختياري)
				</Label>
				<Textarea
					id="order-instructions"
					rows={2}
					value={instructions}
					onChange={(e) => setInstructions(e.target.value)}
					disabled={create.isPending}
				/>
			</div>

			<div className="space-y-1.5">
				<Label
					htmlFor="order-override"
					className="text-xs"
				>
					سبب تجاوز مدى الجرعة (يُطلب فقط إن رفض الخادم الجرعة)
				</Label>
				<Input
					id="order-override"
					value={overrideReason}
					onChange={(e) => setOverrideReason(e.target.value)}
					disabled={create.isPending}
				/>
			</div>

			<div className="flex items-center gap-2 border-t pt-3">
				<Button
					size="sm"
					disabled={name.trim().length === 0 || create.isPending}
					onClick={submit}
				>
					حفظ الأمر
				</Button>
				<Button
					size="sm"
					variant="ghost"
					onClick={onDone}
					disabled={create.isPending}
				>
					إلغاء
				</Button>
			</div>
		</div>
	);
}

import {
	IconAlertTriangle,
	IconPill,
	IconPlus,
	IconSend,
	IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { AiFieldButton } from "@/components/common/ai-field-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
	useContextPrescription,
	useDoseContext,
	useDraftSig,
	useDrugOptions,
	usePharmacyMutations,
	usePharmacySettings,
} from "@/features/pharmacy/hooks/use-pharmacy";
import { FREQUENCY_OPTIONS, ROUTE_OPTIONS } from "@sanad/contracts/runtime/server/pharmacy/prescribing.rules";

/**
 * نصّ تعليمات مبدئي حين لا خطّة محسوبة (لا نشرة للمادة).
 *
 * **لا يذكر جرعة**: لا رقم لدى النظام، وذِكرُ رقم هنا اختراع. يُذكر ما هو معروف
 * فعلًا — التواتر والمدّة — ويُترك مقدار الجرعة للمدرّب.
 */
function buildFallbackSig(frequencyLabel: string | null, durationDays: number | null) {
	const parts = ["أعطِ الجرعة الموصوفة"];
	if (frequencyLabel) parts.push(frequencyLabel);
	if (durationDays && durationDays > 0) parts.push(`لمدة ${arabicDays(durationDays)}`);
	return `${parts.join("، ")}.`;
}

/**
 * تمييز العدد في العربية: ١ مفرد، ٢ مثنّى، ٣–١٠ جمع، ١١ فأكثر مفرد منصوب.
 * «لمدة ٧ يوم» تُقرأ ركيكةً على ورقة تذهب إلى وليّ الأمر.
 */
function arabicDays(n: number) {
	if (n === 1) return "يوم واحد";
	if (n === 2) return "يومين";
	if (n >= 3 && n <= 10) return `${n} أيام`;
	return `${n} يومًا`;
}

/**
 * الوحدة المبدئية من شكل المستحضر لا من ثابتٍ واحد: قرصٌ يُصرف بالقرص وشرابٌ
 * بالملّيلتر. الافتراض الثابت «قرص» هو ما جعل أقراصًا فمويّة تُصرف «أمبولة».
 */
function defaultUnitFor(
	strengthUnit: string | null | undefined,
	dosageForm: string | null | undefined,
) {
	const u = (strengthUnit ?? "").toLowerCase();
	const form = (dosageForm ?? "").toLowerCase();
	if (u.includes("/tb") || form.includes("tablet")) return "قرص";
	if (u.includes("/cp") || form.includes("capsule")) return "كبسولة";
	if (
		u.includes("/ml") ||
		form.includes("solution") ||
		form.includes("suspension") ||
		form.includes("drops") ||
		form.includes("injection")
	)
		return "مل";
	if (u.includes("/g") || u.includes("/kg") || form.includes("powder")) return "غرام";
	return "قرص";
}

/** وحدات الصرف الشائعة — قائمة مضبوطة بدل نصّ حرّ يختلف بين مدرّب وآخر */
const QUANTITY_UNITS = [
	"قرص",
	"كبسولة",
	"مل",
	"غرام",
	"عبوة",
	"أمبولة",
	"حقنة",
	"أنبوب",
	"كيس",
];

/**
 * [PH9.1] وصف الدواء داخل «الخطة العلاجية» — BRD §11.1.
 *
 * هذا هو المكان الصحيح للوصف لا شاشة الصيدلية: هنا الوزن والنوع والتشخيص معروفة،
 * وهنا يقرّر المدرّب. شاشة الصيدلية طابور صرف للصيدلي، لا محرّر وصفات.
 *
 * والخطة تُحسب في **الخادم** وتُعاد جاهزة (`buildPrescribingPlan`): كم ملّيغرامًا،
 * وكم ملّيلترًا يُسحب فعلًا، والكمّية الإجمالية، ونصّ التعليمات — والواجهة تعرض ولا
 * تحسب. أي حساب جرعة يُكرَّر هنا يصير نسخةً ثانية تنحرف.
 */
/**
 * [IP3] اللوحة تخدم سياقين: زيارة أو إقامة تنويم. أحدهما يُمرَّر لا كلاهما.
 * وصفة الإقامة تُصرف بلا سداد وتُحاسَب على فاتورة الإقامة، وصرفُها هو ما يُنشئ
 * أمر ورقة العلاج — فلا نسخة ثانية من منتقي الأدوية داخل وحدة التنويم.
 */
export function MedicationsPanel({
	appointmentId,
	inpatientStayId,
	patientId,
	disabled = false,
}: {
	appointmentId?: string;
	inpatientStayId?: string;
	patientId: string | null;
	disabled?: boolean;
}) {
	const { enabled } = usePharmacySettings();
	const { prescription, isLoading } = useContextPrescription(
		{ appointmentId, inpatientStayId },
		enabled,
	);
	const { addItem, issuePrescription, removeItem, isPending } = usePharmacyMutations();

	const [adding, setAdding] = useState(false);

	// الوحدة مطفأة ⇒ لا قسم أصلًا. لا رسالة ولا مساحة فارغة: الشاشة تخصّ أكاديميات
	// فعّلت الصيدلية، وإظهار قسم معطّل لغيرها ضجيج.
	if (!enabled) return null;

	const items = prescription?.items ?? [];
	const isDraft = prescription?.status === "DRAFT";

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-sm">الأدوية الموصوفة</h3>
				<div className="flex items-center gap-2">
					{prescription && (
						<Badge variant={isDraft ? "outline" : "default"}>
							{prescription.code} — {isDraft ? "مسوّدة" : "صادرة"}
						</Badge>
					)}
					{!disabled && isDraft && items.length > 0 && (
						<Button
							size="sm"
							disabled={isPending}
							onClick={() => void issuePrescription(prescription.id)}
						>
							<IconSend className="size-4" />
							إصدار الوصفة
						</Button>
					)}
					{!disabled && (
						<Button
							size="sm"
							variant="outline"
							disabled={isPending || !patientId || prescription?.status === "CANCELLED"}
							onClick={() => setAdding(true)}
						>
							<IconPlus className="size-4" />
							إضافة دواء
						</Button>
					)}
				</div>
			</div>

			{!disabled && isDraft && items.length > 0 && (
				<div className="flex items-start gap-2 rounded-[4px] border border-amber-500/40 bg-amber-500/10 p-2.5">
					<IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
					<p className="text-[11px] leading-relaxed">
						هذه الوصفة <strong>مسوّدة</strong> — لا تظهر في طابور الصيدلية ولا تُحتسب في
						الفاتورة. اضغط «إصدار الوصفة» ليراها الصيدلي ويصرفها.
					</p>
				</div>
			)}

			{isLoading ? (
				<p className="py-6 text-center text-muted-foreground text-xs">جارٍ التحميل…</p>
			) : items.length === 0 ? (
				<div className="flex flex-col items-center gap-1.5 rounded-[4px] border border-dashed py-8 text-center">
					<IconPill className="size-6 text-muted-foreground/50" />
					<p className="text-muted-foreground text-xs">
						لا أدوية موصوفة — تُحسب الجرعة من وزن الطفل ونوعه تلقائيًا
					</p>
				</div>
			) : (
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الدواء</TableHead>
								<TableHead>الجرعة</TableHead>
								<TableHead>التعليمات</TableHead>
								<TableHead>الكمية</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="max-w-56 truncate font-medium">
										{item.nameSnapshot}
									</TableCell>
									<TableCell className="tabular-nums">
										{item.doseAmount ? `${item.doseAmount} ${item.doseUnit ?? ""}` : "—"}
										{item.doseSource === "OVERRIDE" && (
											<Badge
												variant="destructive"
												className="ms-1.5"
											>
												تجاوز
											</Badge>
										)}
									</TableCell>
									<TableCell className="max-w-72 truncate text-muted-foreground text-xs">
										{item.instructionsAr}
									</TableCell>
									<TableCell className="tabular-nums">
										{String(item.quantity)} {item.quantityUnit}
									</TableCell>
									<TableCell className="text-end">
										{!disabled && isDraft && (
											<Button
												size="sm"
												variant="ghost"
												disabled={isPending}
												onClick={() =>
													void removeItem({
														prescriptionId: prescription.id,
														itemId: item.id,
													})
												}
											>
												<IconTrash className="size-4 text-destructive" />
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{adding && patientId && (
				<AddMedication
					patientId={patientId}
					appointmentId={appointmentId}
					inpatientStayId={inpatientStayId}
					prescriptionId={prescription?.id ?? null}
					isPending={isPending}
					onCancel={() => setAdding(false)}
					onSubmit={async (payload) => {
						await addItem(payload);
						setAdding(false);
					}}
				/>
			)}
		</div>
	);
}

/**
 * نموذج إضافة دواء — **النظام يقود**: يختار المدرّب الدواء والتواتر والمدّة، فتظهر
 * الخطة كاملةً قبل الحفظ (الجرعة، الحجم المقيس، الكمّية الإجمالية، التحذيرات، ونصّ
 * التعليمات مُقترحًا وقابلًا للتحرير).
 */
function AddMedication({
	patientId,
	appointmentId,
	inpatientStayId,
	prescriptionId,
	isPending,
	onCancel,
	onSubmit,
}: {
	patientId: string;
	appointmentId?: string;
	inpatientStayId?: string;
	prescriptionId: string | null;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (payload: {
		appointmentId?: string;
		inpatientStayId?: string;
		patientId: string;
		prescriptionId: string | null;
		inventoryItemId: string;
		catalogProductId: string | null;
		nameSnapshot: string;
		doseAmount?: string;
		doseUnit?: string;
		route?: string;
		frequency?: string;
		durationDays?: number;
		quantity: string;
		quantityUnit: string;
		instructionsAr: string;
		doseSource?: "CALCULATED" | "MANUAL" | "OVERRIDE";
		overrideReasonAr?: string;
	}) => Promise<unknown>;
}) {
	const { options } = useDrugOptions();
	const [itemId, setItemId] = useState("");
	const [frequencyCode, setFrequencyCode] = useState("BID");
	const [routeCode, setRouteCode] = useState("");
	const [notes, setNotes] = useState("");
	const [durationDays, setDurationDays] = useState("7");
	const [sig, setSig] = useState("");
	const [sigTouched, setSigTouched] = useState(false);
	const [overrideReason, setOverrideReason] = useState("");
	// صنف بلا ربط بالكتالوج لا خطّة له — الكمّية تُكتب يدويًّا بدل أن يُمنع الوصف
	const [manualQty, setManualQty] = useState("");
	const [manualUnit, setManualUnit] = useState("");
	const { draftSig, isDrafting } = useDraftSig();

	const selected = options.find((o) => o.id === itemId) ?? null;

	const { context } = useDoseContext({
		patientId,
		genericKey: selected?.catalogProduct?.genericKey,
		...(routeCode ? { route: routeCode } : {}),
		frequencyCode,
		durationDays: Number(durationDays) || undefined,
	});

	const plan = context?.plan ?? null;
	// الطريق المعروض: اختيار المدرّب إن وُجد، وإلا اقتراح النشرة. لا يُكتب في الحالة.
	const effectiveRoute = routeCode || (plan?.suggestions.routeCode ?? "");
	// التسمية العربية للتواتر — تُرسل للصياغة بدل الرمز، فالنصّ للوليّ أمر لا للنظام
	const frequencyLabel =
		FREQUENCY_OPTIONS.find((f) => f.code === frequencyCode)?.labelAr ?? null;
	// الكمّية: من الخطة حين تتوفّر، وإلا ما كتبه المدرّب
	const effectiveQty = plan?.totalQuantity ?? (manualQty.trim() || null);
	const suggestedUnit = defaultUnitFor(
		selected?.catalogProduct?.strengthUnit,
		selected?.catalogProduct?.dosageForm,
	);
	const effectiveUnit = plan?.measured?.ok ? plan.measured.unit : manualUnit || suggestedUnit;
	// النصّ المقترح يُملأ تلقائيًا ما لم يحرّره المدرّب — تحريرُه يُثبّته
	// نصّ مبدئي حتى بلا خطّة محسوبة: الحقل إلزامي، وتركُه فارغًا يُبقي زرّ الإضافة
	// معطَّلًا بلا سبب ظاهر للمدرّب.
	const effectiveSig = sigTouched
		? sig
		: (plan?.suggestedSig ??
			(selected ? buildFallbackSig(frequencyLabel, Number(durationDays) || null) : ""));
	const needsOverrideReason = plan?.dose.ok && plan.dose.source === "OVERRIDE";

	const canSubmit =
		!!selected &&
		effectiveSig.trim().length > 0 &&
		!!effectiveQty &&
		(!needsOverrideReason || overrideReason.trim().length > 0);

	/**
	 * ما ينقص للصياغة الآلية — يُعرض في تلميح الزرّ المعطَّل.
	 *
	 * الزرّ لا يُتاح على فراغ: نموذجٌ بلا دواء ولا تواتر يكتب نصًّا عامًّا يبدو
	 * صحيحًا ولا يخصّ هذه الوصفة، والمدرّب لا يعرف لماذا خرج رديئًا (نمط
	 * `AiFieldButton`: التعطيل مقرونًا بالسبب).
	 */
	const missingForSig = [
		!selected ? "اختيار الدواء" : null,
		!frequencyCode ? "التواتر" : null,
	].filter((v): v is string => v !== null);

	const onDraftSig = async () => {
		if (!selected) return;
		const text = await draftSig({
			drugName: selected.name,
			...(plan?.dose.ok ? { doseText: `${plan.dose.mg} mg` } : {}),
			...(plan?.measured?.ok ? { measuredText: plan.measured.display } : {}),
			...(plan?.suggestions.routeCode ? { routeLabel: plan.suggestions.routeCode } : {}),
			...(frequencyLabel ? { frequencyLabel } : {}),
			...(Number(durationDays) ? { durationDays: Number(durationDays) } : {}),
			...(context?.species ? { speciesLabel: context.species } : {}),
			// التحذيرات تُمرَّر كي تُذكر في النصّ — لا كي يخترع النموذج غيرها
			warnings: (plan?.warnings ?? []).map((w) => w.message),
		});
		setSigTouched(true);
		setSig(text);
	};

	return (
		<div className="flex flex-col gap-3 rounded-[4px] border bg-muted/30 p-4">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
				<div className="flex flex-col gap-1.5">
					<Label>الدواء</Label>
					<Select
						value={itemId}
						onValueChange={setItemId}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue placeholder="اختر دواءً من المخزون" />
						</SelectTrigger>
						<SelectContent position="popper">
							{options.map((o) => (
								<SelectItem
									key={o.id}
									value={o.id}
								>
									{/* الاسم التجاري في السجل مُطوَّل («… TABLETS URINARY ACIDIFIER FOR DOGS AND
									    CATS»), فيُقصّ لسطر واحد وتنزل التفاصيل تحته بدل أن تمدّ الحقل */}
									<span className="flex min-w-0 flex-col">
										<span className="truncate">{o.name}</span>
										<span className="truncate text-[11px] text-muted-foreground">
											{[
												o.catalogProduct?.dosageForm,
												o.catalogProduct?.genericKey ? null : "جرعة يدوية",
												`متاح ${o.stock}`,
											]
												.filter(Boolean)
												.join(" · ")}
										</span>
									</span>
									{o.catalogProduct?.dosageForm && (
										<span className="text-muted-foreground">
											{" "}
											· {o.catalogProduct.dosageForm}
										</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>طريق الإعطاء</Label>
					<Select
						value={effectiveRoute}
						onValueChange={setRouteCode}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue placeholder="اختر" />
						</SelectTrigger>
						<SelectContent position="popper">
							{ROUTE_OPTIONS.map((r) => (
								<SelectItem
									key={r.code}
									value={r.code}
								>
									{r.labelAr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label>التواتر</Label>
					<Select
						value={frequencyCode}
						onValueChange={setFrequencyCode}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{FREQUENCY_OPTIONS.map((f) => (
								<SelectItem
									key={f.code}
									value={f.code}
								>
									{f.labelAr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="rx-duration">المدّة (أيام)</Label>
					<Input
						id="rx-duration"
						type="number"
						min={1}
						value={durationDays}
						onChange={(e) => setDurationDays(e.target.value)}
					/>
				</div>
			</div>

			{/* الخطة كما حسبها الخادم — تُعرض قبل الحفظ لا بعده */}
			{selected && plan && (
				<div className="flex flex-col gap-2 rounded-[4px] border bg-background p-3">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
						<span>
							الجرعة:{" "}
							<b className="tabular-nums">
								{plan.dose.ok ? `${plan.dose.mg} mg` : plan.dose.message}
							</b>
						</span>
						{plan.measured?.ok && (
							<span>
								يُسحب: <b className="tabular-nums">{plan.measured.display}</b>
								<span className="text-muted-foreground"> ({plan.measured.basis})</span>
							</span>
						)}
						{plan.measured && !plan.measured.ok && (
							<span className="text-muted-foreground">{plan.measured.message}</span>
						)}
						{plan.totalQuantity && (
							<span>
								الإجمالي: <b className="tabular-nums">{plan.totalQuantity}</b>
							</span>
						)}
					</div>

					{plan.warnings.map((w) => (
						<p
							key={w.kind}
							className="flex items-start gap-1.5 text-[11px] text-destructive"
						>
							<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
							{w.message}
						</p>
					))}
				</div>
			)}

			{needsOverrideReason && (
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="rx-override">سبب تجاوز المدى الموثّق</Label>
					<Input
						id="rx-override"
						value={overrideReason}
						onChange={(e) => setOverrideReason(e.target.value)}
						placeholder="التجاوز مسموح — والصمت عنه ليس كذلك"
					/>
				</div>
			)}

			{/* صنف بلا ربط بالكتالوج: لا خطّة تُحسب، فالكمّية تُكتب. الوصف يبقى ممكنًا
			    والجرعة تُسجَّل `MANUAL` — الحجب كان يمنع الوصف ولا يمنع الخطأ. */}
			{/*
			  يظهر كلّما **لم تُحسب كمّية**، لا حين يكون الصنف غير مربوط فقط.
			  الحالة الغالبة اليوم صنفٌ مربوط بلا نشرة: لا جرعة ⇒ لا حجم ⇒ لا كمّية،
			  وكان الشرط القديم يُخفي الحقول ويُبقي زرّ الإضافة معطَّلًا إلى الأبد.
			*/}
			{selected && !plan?.totalQuantity && (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="rx-qty">الكمية الإجمالية</Label>
						<Input
							id="rx-qty"
							value={manualQty}
							onChange={(e) => setManualQty(e.target.value)}
							placeholder="هذا الصنف غير مربوط بالسجل — لا تُحسب كمّيته"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label>الوحدة</Label>
						<Select
							value={manualUnit || suggestedUnit}
							onValueChange={setManualUnit}
						>
							<SelectTrigger className="w-full min-w-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								{QUANTITY_UNITS.map((u) => (
									<SelectItem
										key={u}
										value={u}
									>
										{u}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="rx-sig">تعليمات الاستعمال</Label>
				{/*
				  الغلاف `relative` يلفّ **الحقل وحده**، لا العنوان معه: الزرّ مُموضَع
				  `absolute top-1.5` فيُقاس من أعلى غلافه — ولو ضمّ العنوان لجلس الزرّ
				  فوق العنوان خارج الحقل. هذا ما كان يحدث، وهو نفس بناء تبويب التغذية.
				*/}
				<div className="relative">
					<AiFieldButton
						iconOnly
						missing={missingForSig}
						isPending={isDrafting}
						onClick={() => void onDraftSig()}
					/>
					<Textarea
						id="rx-sig"
						className="min-h-16 w-full resize-none pt-9"
						value={effectiveSig}
						onChange={(e) => {
							setSigTouched(true);
							setSig(e.target.value);
						}}
						placeholder="تُقترح تلقائيًا من الجرعة والطريق والتواتر"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="rx-notes">ملاحظات (لا تُطبع على الملصق)</Label>
				<Input
					id="rx-notes"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="ملاحظة داخلية للفريق"
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<Button
					size="sm"
					variant="ghost"
					onClick={onCancel}
				>
					إلغاء
				</Button>
				<Button
					size="sm"
					disabled={!canSubmit || isPending}
					onClick={() =>
						void onSubmit({
							appointmentId,
							inpatientStayId,
							patientId,
							prescriptionId,
							// biome-ignore lint/style/noNonNullAssertion: canSubmit يضمن الاختيار
							inventoryItemId: selected!.id,
							catalogProductId: selected?.catalogProductId ?? null,
							// biome-ignore lint/style/noNonNullAssertion: canSubmit يضمن الاختيار
							nameSnapshot: selected!.name,
							doseAmount: plan?.dose.ok ? plan.dose.mg : undefined,
							doseUnit: plan?.dose.ok ? "mg" : undefined,
							route: effectiveRoute || undefined,
							frequency: frequencyCode,
							durationDays: Number(durationDays) || undefined,
							quantity: effectiveQty as string,
							quantityUnit: effectiveUnit,
							instructionsAr: effectiveSig,
							doseSource: plan?.dose.ok ? plan.dose.source : "MANUAL",
							overrideReasonAr: needsOverrideReason ? overrideReason : undefined,
						})
					}
				>
					إضافة
				</Button>
			</div>
		</div>
	);
}

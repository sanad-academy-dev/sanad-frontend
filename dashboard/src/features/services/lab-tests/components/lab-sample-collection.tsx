import {
	IconAlertTriangleFilled,
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconInfoCircle,
	IconStarFilled,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FieldLabel } from "@/components/common/field-label";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { DrawSiteCombobox } from "@/features/services/lab-tests/components/draw-site-combobox";
import {
	useSaveCollectionDetails,
	useSavePreAnalytical,
} from "@/features/services/lab-tests/hooks/use-lab-sample";
import { VitalsPicker } from "@/features/services/vital-signs/components/vitals-picker";
import { LabFastingStatus, LabSampleQuality, LabTubeType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	FASTING_LABELS,
	MEDICATION_OPTIONS,
	NO_MEDICATIONS,
	QUALITY_META,
	TUBE_LABELS,
} from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";

/** Radix لا يقبل قيمة فارغة لعنصر Select */
const NONE = "__none__";

const toNumber = (value: unknown): number | null => {
	if (value == null || value === "") return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
};

const toTimeInput = (value: Date | string | null | undefined) => {
	if (!value) return "";
	const d = new Date(value);
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** وقت اللحظة بصيغة HH:mm — القيمة الافتراضية لوقت الجمع */
const nowTimeInput = () => toTimeInput(new Date());

/** يحوّل وقت HH:mm إلى تاريخ اليوم بذلك الوقت */
const fromTimeInput = (time: string): string | null => {
	if (!time) return null;
	const [h, m] = time.split(":").map(Number);
	if (Number.isNaN(h) || Number.isNaN(m)) return null;
	const d = new Date();
	d.setHours(h, m, 0, 0);
	return d.toISOString();
};

const ATTEMPT_OPTIONS = [1, 2, 3, 4] as const;

/** أيقونات جودة العيّنة — SVG لا رموز تعبيرية */
const QUALITY_ICONS: Record<LabSampleQuality, typeof IconStarFilled> = {
	[LabSampleQuality.EXCELLENT]: IconStarFilled,
	[LabSampleQuality.GOOD]: IconCircleCheckFilled,
	[LabSampleQuality.ACCEPTABLE]: IconAlertTriangleFilled,
	[LabSampleQuality.REJECTED]: IconCircleXFilled,
};

/** أي قسم يُعرض — كل مرحلة عيّنة تعرض قسمها فقط */
export type LabCollectionStep = "pre-analytical" | "collection" | "quality";

// خطوات سحب العيّنة: التقييم ← تفاصيل السحب ← الجودة. لا أزرار حفظ —
// زر «التالي» أسفل اللوحة هو ما يحفظ، عبر الدالة المسجَّلة في registerSave.
export function LabSampleCollection({
	order,
	item,
	step,
	registerSave,
}: {
	order: LabTestOrderResponse;
	item: LabTestItemResponse;
	step: LabCollectionStep;
	/** تُسجِّل دالة حفظ هذه الخطوة لتستدعيها اللوحة عند «التالي» */
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const preAnalytical = order.preAnalytical;
	const collection = item.sampleCollection;
	const { users } = useClinicUsers();
	const { savePreAnalytical } = useSavePreAnalytical();
	const { saveCollection } = useSaveCollectionDetails();

	// ── ① الحالة ──────────────────────────────────────────────────────────
	const [fastingStatus, setFastingStatus] = useState<LabFastingStatus | null>(null);
	const [fastingHours, setFastingHours] = useState("");
	const [medications, setMedications] = useState<string[]>([]);
	const [ivFluids24h, setIvFluids24h] = useState<boolean | null>(null);

	// ── ② الحالة ──────────────────────────────────────────────────────────
	const [tubeType, setTubeType] = useState<LabTubeType | null>(null);
	const [collectedById, setCollectedById] = useState<string | null>(null);
	const [drawSite, setDrawSite] = useState("");
	const [volumeMl, setVolumeMl] = useState("");
	const [attempts, setAttempts] = useState<number | null>(null);
	const [collectedAt, setCollectedAt] = useState("");
	const [quality, setQuality] = useState<LabSampleQuality | null>(null);
	const [collectionNotes, setCollectionNotes] = useState("");

	// بصمة الخادم — نُعيد التعبئة عند تغيّر البيانات فقط حتى لا يُمحى الإدخال
	const seed = useMemo(
		() => JSON.stringify({ pre: preAnalytical ?? {}, col: collection ?? {} }),
		[preAnalytical, collection],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: نُعيد التعبئة عند تغيّر بصمة الخادم فقط
	useEffect(() => {
		setFastingStatus(preAnalytical?.fastingStatus ?? null);
		setFastingHours(
			preAnalytical?.fastingHours != null ? String(preAnalytical.fastingHours) : "",
		);
		setMedications(preAnalytical?.medications ?? []);
		setIvFluids24h(preAnalytical?.ivFluids24h ?? null);
		setTubeType(collection?.tubeType ?? null);
		setCollectedById(collection?.collectedBy?.id ?? null);
		setDrawSite(collection?.drawSite ?? "");
		setVolumeMl(collection?.volumeMl != null ? String(collection.volumeMl) : "");
		setAttempts(collection?.attempts ?? null);
		// وقت الجمع يبدأ من اللحظة الحالية ما لم يُسجَّل وقت سابق
		setCollectedAt(
			collection?.collectedAt ? toTimeInput(collection.collectedAt) : nowTimeInput(),
		);
		setQuality(collection?.quality ?? null);
		setCollectionNotes(collection?.collectionNotes ?? "");
	}, [seed]);

	const needsHours =
		fastingStatus === LabFastingStatus.FASTED || fastingStatus === LabFastingStatus.PARTIAL;
	const hoursMissing = needsHours && !fastingHours.trim();

	// "لا يتناول أدوية" يُلغي البقية والعكس
	const toggleMedication = (option: string) => {
		setMedications((prev) => {
			if (option === NO_MEDICATIONS) return prev.includes(option) ? [] : [NO_MEDICATIONS];
			const withoutNone = prev.filter((m) => m !== NO_MEDICATIONS);
			return withoutNone.includes(option)
				? withoutNone.filter((m) => m !== option)
				: [...withoutNone, option];
		});
	};

	const savePre = () =>
		savePreAnalytical({
			id: order.id,
			fastingStatus,
			fastingHours: toNumber(fastingHours),
			medications,
			ivFluids24h,
		});

	const saveDetails = () =>
		saveCollection({
			itemId: item.id,
			tubeType,
			collectedById,
			drawSite: drawSite.trim() || null,
			volumeMl: toNumber(volumeMl),
			attempts,
			// وقت الجمع الحالي إن لم يُغيَّر — لا يُترك فارغًا
			collectedAt: fromTimeInput(collectedAt || nowTimeInput()),
			quality,
			collectionNotes: collectionNotes.trim() || null,
		});

	// تسجيل دالة حفظ الخطوة المعروضة — يستدعيها زر «التالي» في أسفل اللوحة.
	// بلا مصفوفة اعتماديات: الدالة تلتقط أحدث القيم في كل رسم.
	useEffect(() => {
		if (!registerSave) return;
		registerSave(step === "pre-analytical" ? savePre : saveDetails);
		return () => registerSave(null);
	});

	return (
		<div className="flex flex-col gap-4">
			{/* ① التقييم ما قبل التحليلي */}
			{step === "pre-analytical" && (
				<StepCard
					index="١"
					title="التقييم ما قبل التحليلي"
				>
					<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
						<IconInfoCircle className="size-3.5 shrink-0" />
						هذا الفحص حساس لحالة الصيام
					</p>

					{/* الصيام وساعاته في صف واحد — الحقل يبقى ظاهرًا معطّلًا فلا يقفز التخطيط */}
					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label className="justify-start">هل الطفل صائم؟</Label>
							<div className="grid grid-cols-3 gap-1.5">
								{Object.values(LabFastingStatus).map((value) => (
									<ToggleChip
										key={value}
										active={fastingStatus === value}
										className="px-2"
										onClick={() => setFastingStatus(fastingStatus === value ? null : value)}
									>
										{FASTING_LABELS[value]}
									</ToggleChip>
								))}
							</div>
						</Field>

						<Field data-invalid={hoursMissing}>
							<FieldLabel required={needsHours}>
								<Label htmlFor="fasting-hours">عدد ساعات الصيام</Label>
							</FieldLabel>
							<Input
								id="fasting-hours"
								type="number"
								min={0}
								value={fastingHours}
								disabled={!needsHours}
								aria-invalid={hoursMissing}
								placeholder={needsHours ? "مثال: 12" : "غير مطلوب"}
								onChange={(e) => setFastingHours(e.target.value)}
								className="tabular-nums"
							/>
						</Field>
					</div>

					<Field>
						<Label className="justify-start">
							هل تلقى الطفل سوائل وريدية خلال الـ٢٤ ساعة الماضية؟
						</Label>
						<div className="flex gap-1.5">
							<ToggleChip
								active={ivFluids24h === true}
								className="w-20"
								onClick={() => setIvFluids24h(ivFluids24h === true ? null : true)}
							>
								نعم
							</ToggleChip>
							<ToggleChip
								active={ivFluids24h === false}
								className="w-20"
								onClick={() => setIvFluids24h(ivFluids24h === false ? null : false)}
							>
								لا
							</ToggleChip>
						</div>
					</Field>

					{/* الأدوية — أزرار تُضغط فيتغيّر لونها، و"لا يتناول أدوية" يُلغي البقية */}
					<Field>
						<Label className="justify-start">الأدوية الحالية</Label>
						<div className="flex flex-wrap gap-1.5">
							{[...MEDICATION_OPTIONS, NO_MEDICATIONS].map((option) => (
								<ToggleChip
									key={option}
									active={medications.includes(option)}
									className="w-32"
									onClick={() => toggleMedication(option)}
								>
									{option}
								</ToggleChip>
							))}
						</div>
					</Field>

					{/*
					  آخر قياس يُجلب تلقائيًا مع شارة عمره بدل إعادة كتابته هنا؛ والمربوط
					  يبقى لقطةً ثابتة لهذا الطلب (docs/vital-signs-plan.md §4).
					*/}
					<VitalsPicker
						patientId={order.patient.id}
						target={{ type: "LAB", id: order.id }}
						attached={preAnalytical?.vitalsRecord ?? null}
						profile="BASIC"
					/>
				</StepCard>
			)}

			{/* ② تفاصيل السحب */}
			{step === "collection" && (
				<StepCard
					index="٢"
					title="تفاصيل سحب العيّنة"
				>
					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label className="justify-start">نوع الأنبوب</Label>
							<Select
								dir="rtl"
								value={tubeType ?? NONE}
								onValueChange={(v) => setTubeType(v === NONE ? null : (v as LabTubeType))}
							>
								<SelectTrigger>
									<SelectValue placeholder="اختر نوع الأنبوب" />
								</SelectTrigger>
								{/* popper إجباري: تموضع item-aligned الافتراضي يظهر خارج الشاشة في RTL */}
								<SelectContent
									dir="rtl"
									position="popper"
								>
									<SelectGroup>
										<SelectItem value={NONE}>بدون تحديد</SelectItem>
										{Object.values(LabTubeType).map((value) => (
											<SelectItem
												key={value}
												value={value}
											>
												{TUBE_LABELS[value].label}
												<span className="ms-2 text-[10px] text-muted-foreground">
													{TUBE_LABELS[value].hint}
												</span>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<Label className="justify-start">الفني المجمِّع</Label>
							<Select
								dir="rtl"
								value={collectedById || NONE}
								onValueChange={(v) => setCollectedById(v === NONE ? null : v)}
							>
								<SelectTrigger>
									<SelectValue placeholder="اختر الفني" />
								</SelectTrigger>
								<SelectContent
									dir="rtl"
									position="popper"
								>
									<SelectGroup>
										<SelectItem value={NONE}>بدون تحديد</SelectItem>
										{users.map((u) => (
											<SelectItem
												key={u.id}
												value={u.id}
											>
												{u.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
					</div>

					<Field>
						<Label className="justify-start">موقع السحب</Label>
						<DrawSiteCombobox
							value={drawSite}
							onChange={setDrawSite}
						/>
					</Field>

					<div className="grid grid-cols-2 gap-3">
						<Field>
							<Label
								htmlFor="volume"
								className="justify-start"
							>
								الحجم المجمَّع (مل)
							</Label>
							<Input
								id="volume"
								type="number"
								step="any"
								min={0}
								value={volumeMl}
								onChange={(e) => setVolumeMl(e.target.value)}
								placeholder="—"
								className="tabular-nums"
							/>
						</Field>

						<Field>
							<Label
								htmlFor="collected-at"
								className="justify-start"
							>
								وقت الجمع
							</Label>
							<Input
								id="collected-at"
								type="time"
								value={collectedAt}
								onChange={(e) => setCollectedAt(e.target.value)}
								className="tabular-nums"
							/>
						</Field>
					</div>

					<Field>
						<Label className="justify-start">عدد المحاولات</Label>
						<div className="flex gap-1.5">
							{ATTEMPT_OPTIONS.map((n) => (
								<ToggleChip
									key={n}
									active={attempts === n}
									className="w-12 tabular-nums"
									onClick={() => setAttempts(attempts === n ? null : n)}
								>
									{n === 4 ? "+٣" : n}
								</ToggleChip>
							))}
						</div>
					</Field>

					<Field>
						<Label
							htmlFor="collection-notes"
							className="justify-start"
						>
							ملاحظات الجمع
						</Label>
						<Textarea
							id="collection-notes"
							value={collectionNotes}
							onChange={(e) => setCollectionNotes(e.target.value)}
							placeholder="أي صعوبات أو ملاحظات خاصة..."
							className="min-h-16 text-start"
						/>
					</Field>
				</StepCard>
			)}

			{/* ③ جودة العيّنة */}
			{step === "quality" && (
				<StepCard
					index="٣"
					title="جودة العيّنة"
				>
					<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
						<IconInfoCircle className="size-3.5 shrink-0" />
						العيّنة المرفوضة تحتاج إعادة سحب — سجّل السبب في الملاحظات
					</p>

					<Field>
						<Label className="justify-start">تقييم العيّنة</Label>
						<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
							{Object.values(LabSampleQuality).map((value) => {
								const meta = QUALITY_META[value];
								const Icon = QUALITY_ICONS[value];
								const isActive = quality === value;
								return (
									<button
										key={value}
										type="button"
										aria-pressed={isActive}
										onClick={() => setQuality(isActive ? null : value)}
										className={cn(
											"flex h-8 items-center justify-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors",
											isActive ? meta.className : "hover:border-muted-foreground/40",
										)}
									>
										<Icon className="size-4 shrink-0" />
										{meta.label}
									</button>
								);
							})}
						</div>
					</Field>

					<Field>
						<Label
							htmlFor="quality-notes"
							className="justify-start"
						>
							ملاحظات الجمع
						</Label>
						<Textarea
							id="quality-notes"
							value={collectionNotes}
							onChange={(e) => setCollectionNotes(e.target.value)}
							placeholder="أي صعوبات أو ملاحظات خاصة..."
							className="min-h-16 text-start"
						/>
					</Field>
				</StepCard>
			)}
		</div>
	);
}

/** بطاقة خطوة — رأس مرقّم ثم الحقول، بلا زر حفظ (يحفظ زر «التالي») */
function StepCard({
	index,
	title,
	children,
}: {
	index: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-md border">
			<header className="flex items-center gap-1.5 border-b px-4 py-2 text-sm font-semibold">
				<Badge
					variant="outline"
					className="size-5 justify-center p-0 text-[10px] tabular-nums"
				>
					{index}
				</Badge>
				{title}
			</header>
			<div className="space-y-5 p-4">{children}</div>
		</section>
	);
}

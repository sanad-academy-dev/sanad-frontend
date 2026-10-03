import { IconAlertTriangle, IconHeartbeat } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useMemo, useState } from "react";

import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RegisterArrivalPatient } from "@/features/care/emergency/components/register-arrival-patient";
import { TriageBadge } from "@/features/care/emergency/components/triage-badge";
import {
	useAssessTriage,
	useDiscriminators,
} from "@/features/care/emergency/hooks/use-emergency";
import { STABILITY_TONES, TRIAGE_TONES } from "@/features/care/emergency/utils/triage-display";
import { AddVitalsDialog } from "@/features/services/vital-signs/components/add-vitals-dialog";
import type { EmergencyStability, TriageCategory } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	TRIAGE_CATEGORY_LABELS,
	TRIAGE_CATEGORY_ORDER,
} from "@sanad/contracts/runtime/server/emergency/emergency.rules";
import { STABILITY_LABELS } from "@sanad/contracts/runtime/server/emergency/emergency.workflow";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

/**
 * [E1] ورقة الفرز.
 *
 * ترتيب الشاشة يتبع ترتيب الفعل: يُؤشَّر ما يُرى على الطفل أوّلًا (المُميِّزات)،
 * فيقترح النظام لونًا، ثم تُدخل القياسات إن توفّرت. اللون **مشتقّ لا مُختار** —
 * وتغييره ممكن دائمًا لكنه يطلب سببًا، لأن الفارق بين المقترح والمعتمد هو ما
 * يُقاس لاحقًا (تقرير `overrideRate`).
 */

type TriageSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	arrivalId?: string | null;
	appointmentId?: string | null;
	patientId?: string | null;
	patientLabel?: string | null;
	/** [E5.4] يُستدعى بعد تسجيل طفلٍ لوصولٍ مجهول، فيتابع الفرز بلا إغلاق الورقة */
	onPatientRegistered?: (patientId: string) => void;
};

export const TriageSheet = ({
	open,
	onOpenChange,
	arrivalId,
	appointmentId,
	patientId,
	patientLabel,
	onPatientRegistered,
}: TriageSheetProps) => {
	const { systems, isLoading } = useDiscriminators();
	const { assess, isPending } = useAssessTriage();

	const [selected, setSelected] = useState<string[]>([]);
	const [override, setOverride] = useState<TriageCategory | null>(null);
	const [overrideReason, setOverrideReason] = useState("");
	const [notes, setNotes] = useState("");
	// القياس المربوط بهذا الفرز — تنشئه وحدة العلامات الحيوية ويُمرَّر معرّفه للخادم
	const [vitalsRecord, setVitalsRecord] = useState<VitalSignsRecordResponse | null>(null);
	const [vitalsOpen, setVitalsOpen] = useState(false);
	// [E5] الاستقرار — فارغ يعني «اشتقّه من اللون»؛ الممرّض يصحّحه عند إعادة التقييم
	const [stability, setStability] = useState<EmergencyStability | null>(null);

	// الاقتراح يُحسب في الواجهة من نفس قاعدة الخادم (الأشدّ يفوز) كي يراه الممرّض
	// وهو يؤشّر، لا بعد أن يحفظ. والخادم يعيد حسابه ويبقى هو المرجع.
	const proposed = useMemo<TriageCategory | null>(() => {
		let best: TriageCategory | null = null;
		let bestRank = Number.POSITIVE_INFINITY;
		for (const system of systems) {
			for (const item of system.items) {
				if (!selected.includes(item.code)) continue;
				const rank = TRIAGE_CATEGORY_ORDER.indexOf(item.category as TriageCategory);
				if (rank >= 0 && rank < bestRank) {
					bestRank = rank;
					best = item.category as TriageCategory;
				}
			}
		}
		return best;
	}, [systems, selected]);

	const effective = override ?? proposed;
	const needsReason = override != null && override !== proposed;
	const canSubmit =
		selected.length > 0 && !isPending && (!needsReason || overrideReason.trim().length > 0);

	const toggle = (code: string) =>
		setSelected((prev) =>
			prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
		);

	const reset = () => {
		setSelected([]);
		setOverride(null);
		setOverrideReason("");
		setNotes("");
		setVitalsRecord(null);
		setStability(null);
	};

	const submit = async () => {
		await assess({
			arrivalId: arrivalId ?? undefined,
			appointmentId: appointmentId ?? undefined,
			patientId: patientId ?? null,
			discriminators: selected,
			category: override,
			overrideReason: needsReason ? overrideReason.trim() : null,
			notes: notes.trim() || null,
			stability,
			vitalsRecordId: vitalsRecord?.id ?? null,
		});
		reset();
		onOpenChange(false);
	};

	useHotkey("Mod+Enter", () => void (canSubmit && submit()), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-xl"
			>
				<div className="flex items-center gap-2 border-b px-4 py-2">
					<SheetTitle className="text-base">فرز الحالة</SheetTitle>
					{patientLabel ? (
						<span className="text-muted-foreground text-sm">— {patientLabel}</span>
					) : null}
					{effective ? (
						<span className="ms-auto">
							<TriageBadge category={effective} />
						</span>
					) : null}
				</div>

				<div className="flex-1 overflow-y-auto">
					{/* Radix Tabs يفرض dir=ltr على الجذر — بلا هذا ينعكس اللسان كلّه */}
					<Tabs
						dir="rtl"
						defaultValue="discriminators"
						className="w-full"
					>
						<TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
							<TabsTrigger value="discriminators">المُميِّزات</TabsTrigger>
							<TabsTrigger value="vitals">العلامات الحيوية</TabsTrigger>
							<TabsTrigger value="decision">القرار</TabsTrigger>
						</TabsList>

						<TabsContent
							value="discriminators"
							className="m-0 flex flex-col gap-4 p-4"
						>
							{isLoading ? (
								<p className="text-muted-foreground text-sm">جارٍ تحميل المُميِّزات…</p>
							) : (
								systems.map((system) => (
									<section
										key={system.key}
										className="flex flex-col gap-2"
									>
										<h3 className="font-medium text-sm">{system.label}</h3>
										<div className="flex flex-col gap-1.5">
											{system.items.map((item) => (
												// عنصر قابل للنقر كلّه لا مربّع صغير: الفرز يُؤشَّر بإصبع
												// مستعجلة، وهدفٌ بعرض السطر أسهل من مربّع ١٦ بكسل.
												<button
													type="button"
													key={item.code}
													onClick={() => toggle(item.code)}
													aria-pressed={selected.includes(item.code)}
													className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-start hover:bg-accent/50"
												>
													<Checkbox
														checked={selected.includes(item.code)}
														// النقر يُعالَج على الصفّ — يبقى المربّع مؤشِّرًا بصريًّا
														tabIndex={-1}
														className="pointer-events-none"
													/>
													<span className="text-sm">{item.labelAr}</span>
													<span className="ms-auto">
														<TriageBadge category={item.category as TriageCategory} />
													</span>
												</button>
											))}
										</div>
									</section>
								))
							)}
						</TabsContent>

						<TabsContent
							value="vitals"
							className="m-0 flex flex-col gap-3 p-4"
						>
							{/*
							  [E5.1] القياسات من وحدة العلامات الحيوية نفسها، لا حقول مرصوفة هنا.
							  السجلّ يملكه الطفل لا المستند (docs/vital-signs-plan.md §4)، فالفرز
							  **يربط** سجلًّا ولا ينشئ نسخة ثانية من نموذج القياس. وبهذا يظهر القياس
							  في مخطّطات الطفل وفي شريط آخر قياس كأيّ قياس آخر، ويقرؤه محرّك المديات
							  المرجعية كما يقرأ قياسات العنبر.
							*/}
							{!patientId ? (
								/* [E5.4] لم تعد رسالةً مسدودة: النموذج نفسه هنا */
								arrivalId ? (
									<RegisterArrivalPatient
										arrivalId={arrivalId}
										provisionalLabel={patientLabel}
										onRegistered={(id) => onPatientRegistered?.(id)}
									/>
								) : (
									<p className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-xs">
										سجّل الطفل أوّلًا — القياس يُحفظ في ملفّه لا في هذه الورقة
									</p>
								)
							) : vitalsRecord ? (
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2 rounded-md border px-3 py-2">
										<IconHeartbeat className="size-4 shrink-0 text-muted-foreground" />
										<span className="text-sm">قياس مربوط بهذا الفرز</span>
										<span className="ms-auto text-muted-foreground text-xs tabular-nums">
											{new Date(vitalsRecord.recordedAt).toLocaleTimeString("ar", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
									<Button
										type="button"
										size="sm"
										variant="ghost"
										onClick={() => setVitalsRecord(null)}
									>
										إلغاء الربط
									</Button>
								</div>
							) : (
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="justify-start gap-2"
									onClick={() => setVitalsOpen(true)}
								>
									<IconHeartbeat className="size-4" />
									سجّل القياسات
								</Button>
							)}

							<p className="text-muted-foreground text-xs">
								القياسات اختيارية. درجة ATT لا تُحسب إلا باكتمال محاورها — ونقصُها يُعرض «غير
								مكتملة» بدل رقم مُلفَّق.
							</p>
						</TabsContent>

						<TabsContent
							value="decision"
							className="m-0 flex flex-col gap-4 p-4"
						>
							<div className="flex flex-col gap-2">
								<Label>اللون المقترح</Label>
								{proposed ? (
									<div
										className={cn(
											"flex items-center gap-2 rounded-md px-3 py-2",
											TRIAGE_TONES[proposed].surface,
										)}
									>
										<TriageBadge category={proposed} />
										<span className="text-sm">{TRIAGE_CATEGORY_LABELS[proposed]}</span>
									</div>
								) : (
									<p className="text-muted-foreground text-sm">
										اختر مُميِّزًا واحدًا على الأقلّ — اللون يُشتقّ من الفحص لا من الحدس
									</p>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<Label>اعتماد لون مختلف</Label>
								<Select
									value={override ?? "NONE"}
									onValueChange={(v) =>
										setOverride(v === "NONE" ? null : (v as TriageCategory))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="اعتمد المقترح" />
									</SelectTrigger>
									{/* popper إلزامي: الافتراضي يُعرض خارج الشاشة في RTL */}
									<SelectContent position="popper">
										<SelectItem value="NONE">اعتمد المقترح</SelectItem>
										{TRIAGE_CATEGORY_ORDER.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{TRIAGE_CATEGORY_LABELS[category]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{needsReason ? (
								<div className="flex flex-col gap-2">
									<Label className="flex items-center gap-1.5">
										<IconAlertTriangle className="size-4 text-orange-500" />
										سبب تغيير اللون
									</Label>
									<Textarea
										value={overrideReason}
										onChange={(e) => setOverrideReason(e.target.value)}
										placeholder="لماذا يختلف تقديرك عن المقترح؟"
										rows={2}
									/>
									<p className="text-muted-foreground text-xs">
										الفارق بين المقترح والمعتمد هو ما يُقاس — تغييره بلا سبب يُفرغ المقياس من
										معناه.
									</p>
								</div>
							) : null}

							<div className="flex flex-col gap-2">
								<Label>استقرار الحالة</Label>
								<ToggleGroup
									type="single"
									value={stability ?? ""}
									onValueChange={(v) => setStability((v as EmergencyStability) || null)}
									className="justify-start gap-2"
								>
									{(Object.keys(STABILITY_LABELS) as EmergencyStability[]).map((v) => (
										<ToggleGroupItem
											key={v}
											value={v}
											className={cn(
												"h-8 rounded-md border px-3 text-xs data-[state=on]:border-primary",
												`data-[state=on]:${STABILITY_TONES[v].split(" ")[0]}`,
											)}
										>
											{STABILITY_LABELS[v]}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
								<p className="text-muted-foreground text-xs">
									اتركه فارغًا ليُشتقّ من اللون. «مستقرّ» أثناء العلاج يعني «جاهز للقرار».
								</p>
							</div>

							<div className="flex flex-col gap-2">
								<Label>ملاحظات</Label>
								<Textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={2}
								/>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* الفوتر الموحّد — بلا «حفظ ومتابعة»: الفرز فعلٌ على حالة بعينها لا
				    إدخالٌ متكرّر. وعدّاد المُميِّزات في `extra` بجانب الاختصار. */}
				<FormFooter
					disabled={isPending}
					extra={
						<span className="text-muted-foreground text-xs tabular-nums">
							{selected.length} مُميِّز
						</span>
					}
				>
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						disabled={!canSubmit}
						onClick={submit}
					>
						حفظ الفرز
					</Button>
				</FormFooter>
			</SheetContent>

			{/* نافذة القياس من وحدة العلامات الحيوية — تُربط بالزيارة فور إنشائها حين
			    توجد، وتبقى قياسًا يملكه الطفل حين يكون الفرز من سجلّ وصول */}
			{patientId ? (
				<AddVitalsDialog
					patientId={patientId}
					open={vitalsOpen}
					onOpenChange={setVitalsOpen}
					profile="FULL"
					attachTo={appointmentId ? { type: "VISIT", id: appointmentId } : undefined}
					onSaved={(record) => setVitalsRecord(record)}
				/>
			) : null}
		</Sheet>
	);
};

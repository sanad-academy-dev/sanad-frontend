import { IconCheck, IconSparkles, IconTrash, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SHIFT_TYPES } from "@/features/services/staff/data/shifts";
import { useAiShifts } from "@/features/services/staff/hooks/use-ai-shifts";
import { useUpsertShift } from "@/features/services/staff/hooks/use-upsert-shift";
import { cn } from "@/lib/utils";
import type {
	AiShiftOptions,
	AiShiftSuggestion,
	ShiftType,
} from "@/server/shifts/shifts.type";

const SHIFT_META = new Map(SHIFT_TYPES.map((t) => [t.key, t]));

const DEFAULT_OPTIONS: AiShiftOptions = {
	perShift: { MORNING: 2, EVENING: 2, NIGHT: 1 },
	maxDaysPerStaff: 5,
	notes: "",
	replaceExisting: false,
};

// تسمية اليوم — محصّنة: أي قيمة غير "yyyy-MM-dd" صالحة تُعرض كما هي بدل كسر اللوحة
const dayLabel = (iso: string | undefined) => {
	if (!iso) return "—";
	const d = new Date(`${iso.slice(0, 10)}T00:00:00.000Z`);
	if (Number.isNaN(d.getTime())) return iso;
	return format(d, "EEEE d/M", { locale: arSA });
};

// لوحة «جدولة مناوبة بـ AI»: إعدادات التغطية ← اقتراح ← جدول قابل للتعديل ← تطبيق يدوي.
// لا يُحفظ شيء قبل ضغط «تطبيق الجدول».
export function AiShiftsDialog({
	open,
	onClose,
	days,
	staffNames,
}: {
	open: boolean;
	onClose: () => void;
	// أيام الأسبوع المعروض (yyyy-MM-dd)
	days: string[];
	// معرّف الموظف → اسمه، لعرض الأسماء في المعاينة
	staffNames: Map<string, string>;
}) {
	const { suggest, isSuggesting } = useAiShifts();
	const { upsertAsync } = useUpsertShift();

	const [opts, setOpts] = useState<AiShiftOptions>(DEFAULT_OPTIONS);
	const [plan, setPlan] = useState<{ summary: string; shifts: AiShiftSuggestion[] } | null>(
		null,
	);
	const [isApplying, setIsApplying] = useState(false);

	const setPerShift = (key: ShiftType, value: number) =>
		setOpts((p) => ({ ...p, perShift: { ...p.perShift, [key]: value } }));

	const reset = () => {
		setOpts(DEFAULT_OPTIONS);
		setPlan(null);
	};
	const close = () => {
		reset();
		onClose();
	};

	const runSuggest = async () => {
		try {
			const result = await suggest({ days, options: opts });
			setPlan(result);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	// تعديل يدوي على صفّ مقترح قبل الاعتماد
	const patchShift = (index: number, patch: Partial<AiShiftSuggestion>) =>
		setPlan((p) =>
			p ? { ...p, shifts: p.shifts.map((s, i) => (i === index ? { ...s, ...patch } : s)) } : p,
		);
	const removeShift = (index: number) =>
		setPlan((p) => (p ? { ...p, shifts: p.shifts.filter((_, i) => i !== index) } : p));

	// تغيير النوع يضبط أوقات النوبة القياسية معه
	const changeType = (index: number, type: ShiftType) => {
		const meta = SHIFT_META.get(type);
		patchShift(index, {
			type,
			startMinute: meta?.defaultStart ?? 480,
			endMinute: meta?.defaultEnd ?? 960,
			hours: meta?.defaultHours ?? 8,
		});
	};

	// الاعتماد اليدوي — يحفظ كل صفّ عبر نفس نقطة جدولة المناوبة
	const applyPlan = async () => {
		if (!plan?.shifts.length) return;
		setIsApplying(true);
		try {
			for (const s of plan.shifts) {
				await upsertAsync({
					staffId: s.staffId,
					date: s.date,
					type: s.type,
					startMinute: s.startMinute,
					endMinute: s.endMinute,
					hours: s.hours,
					notes: s.reason || null,
				});
			}
			toast.success(`تم اعتماد ${plan.shifts.length} مناوبة`);
			close();
		} catch (e) {
			toast.error((e as Error).message || "تعذّر اعتماد الجدول");
		} finally {
			setIsApplying(false);
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) close();
			}}
		>
			{/* لوحة جانبية من اليسار — نفس نمط لوحات التطبيق (الدورة/الاختبار) */}
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full! flex-col gap-0 border-e-0 border-s-[0.75px] border-s-border p-0 sm:max-w-[820px]!"
			>
				<div
					dir="rtl"
					className="flex min-h-0 flex-1 flex-col"
				>
					{/* الرأس */}
					<div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
						<SheetTitle className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
							<span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
								<IconSparkles className="size-3.5" />
							</span>
							جدولة المناوبات بالذكاء الاصطناعي
						</SheetTitle>
						<SheetDescription className="sr-only">
							اقتراح جدول مناوبات للأسبوع مع إمكانية التعديل قبل الاعتماد.
						</SheetDescription>
						<Button
							variant="ghost"
							size="icon-sm"
							type="button"
							onClick={close}
							aria-label="إغلاق"
						>
							<IconX className="size-[13px] text-muted-foreground" />
						</Button>
					</div>

					{plan ? (
						/* ===== المعاينة القابلة للتعديل ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
							<div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
								<IconSparkles className="mt-0.5 size-4 shrink-0 text-primary" />
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] font-semibold text-primary">
										اقتراح بـ {plan.shifts.length} مناوبة
									</span>
									<span className="text-[11px] leading-5 text-muted-foreground">
										{plan.summary || "راجع الصفوف وعدّلها ثم اضغط «تطبيق الجدول» للاعتماد."}
									</span>
								</div>
							</div>

							<div className="overflow-hidden rounded-lg border border-border">
								<table className="w-full border-collapse text-[12px]">
									<thead className="bg-muted/40">
										<tr>
											<th className="px-3 py-2 text-start font-medium text-muted-foreground">
												الموظف
											</th>
											<th className="px-3 py-2 text-start font-medium text-muted-foreground">
												اليوم
											</th>
											<th className="px-3 py-2 text-start font-medium text-muted-foreground">
												النوبة
											</th>
											<th className="px-3 py-2 text-start font-medium text-muted-foreground">
												الساعات
											</th>
											<th className="w-10 px-2 py-2" />
										</tr>
									</thead>
									<tbody>
										{plan.shifts.map((s, i) => (
											<tr
												key={`${s.staffId}-${s.date}`}
												className="border-t border-border"
											>
												<td className="px-3 py-1.5 text-foreground">
													{staffNames.get(s.staffId) ?? s.staffId}
												</td>
												<td className="px-3 py-1.5 text-muted-foreground">
													{dayLabel(s.date)}
												</td>
												<td className="px-3 py-1.5">
													<Select
														dir="rtl"
														value={s.type}
														onValueChange={(v) => changeType(i, v as ShiftType)}
													>
														<SelectTrigger className="h-7! w-[130px] text-[12px]">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{SHIFT_TYPES.map((t) => (
																<SelectItem
																	key={t.key}
																	value={t.key}
																>
																	<span className="flex items-center gap-1.5">
																		<span
																			className="size-2 rounded-full"
																			style={{ backgroundColor: t.color }}
																		/>
																		{t.label}
																	</span>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</td>
												<td className="px-3 py-1.5">
													<Input
														type="number"
														min={0}
														max={24}
														value={s.hours}
														onChange={(e) =>
															patchShift(i, { hours: Number(e.target.value) || 0 })
														}
														className="h-7 w-[70px] text-[12px]"
													/>
												</td>
												<td className="px-2 py-1.5">
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														aria-label="حذف المقترح"
														onClick={() => removeShift(i)}
													>
														<IconTrash className="size-3.5 text-destructive" />
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{plan.shifts.length === 0 && (
								<p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
									حذفت كل المقترحات — ارجع للإعدادات لتوليد اقتراح جديد.
								</p>
							)}
						</div>
					) : (
						/* ===== الإعدادات ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
							<p className="text-[11px] leading-5 text-muted-foreground">
								يقرأ الذكاء الاصطناعي موظفي الأكاديمية والمناوبات المجدولة والإجازات المعتمدة لهذا
								الأسبوع ({dayLabel(days[0])} — {dayLabel(days[days.length - 1])})، ثم يقترح
								توزيعًا متوازنًا تراجعه قبل الاعتماد.
							</p>

							<div className="flex flex-col gap-2">
								<span className="text-[12px] font-bold text-foreground">
									التغطية المطلوبة يوميًا
								</span>
								<div className="grid grid-cols-3 gap-3">
									{SHIFT_TYPES.map((t) => (
										<div
											key={t.key}
											className="flex flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2.5"
										>
											<span className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
												<span
													className="size-2 rounded-full"
													style={{ backgroundColor: t.color }}
												/>
												{t.label}
											</span>
											<Input
												type="number"
												min={0}
												max={20}
												value={opts.perShift?.[t.key] ?? 0}
												onChange={(e) => setPerShift(t.key, Number(e.target.value))}
												className="h-8 text-[12px]"
											/>
										</div>
									))}
								</div>
							</div>

							<div className="flex flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2.5">
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] font-semibold text-foreground">
										أقصى أيام عمل للموظف أسبوعيًا
									</span>
									<span className="text-[10px] leading-4 text-muted-foreground">
										يمنع تحميل موظف واحد بكل الأيام.
									</span>
								</div>
								<Input
									type="number"
									min={1}
									max={7}
									value={opts.maxDaysPerStaff ?? 5}
									onChange={(e) =>
										setOpts((p) => ({ ...p, maxDaysPerStaff: Number(e.target.value) }))
									}
									className="h-8 w-[100px] text-[12px]"
								/>
							</div>

							<div className="flex items-start justify-between gap-2 rounded-md border border-border bg-card px-3 py-2.5">
								<div className="flex min-w-0 flex-col gap-0.5">
									<span className="text-[12px] font-semibold text-foreground">
										استبدال المناوبات الحالية
									</span>
									<span className="text-[10px] leading-4 text-muted-foreground">
										مُطفأ: يحترم المجدول مسبقًا ويكمل النواقص. مُفعّل: يقترح جدولًا كاملًا جديدًا.
									</span>
								</div>
								<Switch
									checked={opts.replaceExisting ?? false}
									onCheckedChange={(v) => setOpts((p) => ({ ...p, replaceExisting: v }))}
									aria-label="استبدال المناوبات الحالية"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<span className="text-[12px] font-semibold text-foreground">
									تعليمات إضافية (اختياري)
								</span>
								<Textarea
									value={opts.notes ?? ""}
									onChange={(e) => setOpts((p) => ({ ...p, notes: e.target.value }))}
									placeholder="مثال: نورة لا تعمل ليلًا، وفهد يفضّل نوبة الصباح، وأغلق الجمعة..."
									className="min-h-[80px] text-[12px]"
									disabled={isSuggesting}
								/>
							</div>
						</div>
					)}

					{/* التذييل */}
					<div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-4 py-3">
						<span className="text-[10px] text-muted-foreground">
							لا يُحفظ أي شيء قبل الاعتماد.
						</span>
						<div className="flex items-center gap-1.5">
							{plan && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setPlan(null)}
									className="h-[30px] text-[11px]"
								>
									رجوع للإعدادات
								</Button>
							)}
							<Button
								type="button"
								size="sm"
								disabled={
									isSuggesting || isApplying || (plan ? plan.shifts.length === 0 : false)
								}
								onClick={plan ? applyPlan : runSuggest}
								className={cn("h-[30px] gap-1.5 text-[11px]")}
							>
								{plan ? (
									<>
										<IconCheck className="size-3.5" />
										{isApplying ? "جارٍ الاعتماد..." : `تطبيق الجدول (${plan.shifts.length})`}
									</>
								) : (
									<>
										<IconSparkles className="size-3.5" />
										{isSuggesting ? "جارٍ التوليد..." : "اقترح الجدول"}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RequiredMark } from "@/components/common/required-mark";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	CONTACT_CHANNELS,
	CONTACT_OUTCOMES,
	formatDate,
	latenessLabel,
	latenessTone,
} from "@/features/reminders/data/reminders";
import { useLogContact } from "@/features/reminders/hooks/use-reminders";
import { cn } from "@/lib/utils";
import {
	type RecallContactDialogInput,
	type RecallItem,
	type RecallOwnerRow,
	recallContactFormSchema,
} from "@sanad/contracts/runtime/server/reminders/reminders.type";

/**
 * [RC4] «كلّمتُ هذا وليّ الأمر» — يُملأ **أثناء المكالمة**، وهذا ما يحكم شكله كلّه.
 *
 * موظّفٌ سمّاعته على أذنه لا يفتح قائمةً منسدلة ويقلّبها ويغلقها مرّتين. فالقناة
 * والنتيجة رقائق تُضغط ضغطةً واحدة، والنتائج مصنّفة بما **تفعله بالبند** لا بترتيبٍ
 * اعتباطيّ: مجموعةٌ تُغلقه ومجموعةٌ تُبقيه — لأنّ هذا هو القرار الوحيد الذي يهمّ،
 * وإخفاؤه في سطرٍ باهت تحت القائمة (الصياغة الأولى) جعل الموظّف يختار عشوائيًّا.
 *
 * ── التواصل مربوط ببصمة استحقاق لا بوليّ الأمر ──────────────────────────────────
 *
 * وليّ أمرٌ كُلِّم عن تطعيم كلبه لم يُكلَّم عن فاتورته المتأخّرة، وإغلاقُ الاثنين بمكالمةٍ
 * واحدة يُخفي عملًا لم يحدث. ومع ذلك يبقى «سجّل عن الكلّ» متاحًا — لأنّ مكالمةً واحدة
 * **قد** تغطّي كل شيء، وإجبارُ الموظّف على النموذج ثلاث مرّات يجعله يتوقّف عن التسجيل.
 *
 * ونتيجة «حُجز موعد» تُلغي الرسائل المعلّقة: انتفى السبب، وتذكيرٌ يصل بعد الحجز يجعل
 * التذكيرات كلّها تبدو غافلة.
 */

const SNOOZE_PRESETS = [
	{ label: "أسبوع", days: 7 },
	{ label: "أسبوعان", days: 14 },
	{ label: "شهر", days: 30 },
] as const;

const toDateInput = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const inDays = (days: number) => toDateInput(new Date(Date.now() + days * 86_400_000));

// بلا وسم نوع عمدًا: للمخطّط قيمٌ افتراضية فيختلف نوعُ المدخل عن المخرج، و`zodResolver`
// يستنتج الاثنين. فرضُ نوع المخرج على النموذج (الصياغة الأولى) كسر فحص الأنواع.
const DEFAULTS = {
	channel: "PHONE",
	outcome: "NO_ANSWER",
	notes: null,
	snoozedUntil: null,
} as const satisfies Partial<RecallContactDialogInput>;

export function LogContactDialog({
	open,
	onOpenChange,
	row,
	item,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	row: RecallOwnerRow | null;
	/** `null` = التسجيل عن كل بنود هذا وليّ الأمر دفعةً واحدة */
	item: RecallItem | null;
}) {
	const { logContact, isPending } = useLogContact();

	const {
		control,
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(recallContactFormSchema),
		defaultValues: DEFAULTS,
	});

	// إعادة الضبط عند كل فتح: نموذجٌ يحتفظ بملاحظة وليّ الأمر السابق يسجّلها على التالي
	useEffect(() => {
		if (open) reset(DEFAULTS);
	}, [open, reset]);

	const outcome = watch("outcome");
	const snoozedUntil = watch("snoozedUntil");
	const targets = item ? [item] : (row?.items ?? []);

	const onSubmit = handleSubmit(async (values) => {
		if (!row || targets.length === 0) return;
		// تسلسليًّا لا بالتوازي: صفوفٌ متزامنة على وليّ الأمر نفسه تُربك ترتيب «آخر تواصل»
		// الذي تقرؤه الطاولة، وعددُها هنا ثلاثة أو أربعة لا مئة.
		for (const target of targets) {
			await logContact({
				ownerId: row.ownerId,
				patientId: target.patientId,
				trigger: target.trigger,
				dedupeKey: target.dedupeKey,
				channel: values.channel,
				outcome: values.outcome,
				notes: values.notes?.trim() || null,
				snoozedUntil: values.outcome === "SNOOZED" ? values.snoozedUntil : null,
				bookedAppointmentId: null,
			});
		}
		onOpenChange(false);
	});

	// الاختصار الذي يَعِد به الفوتر — تلميحٌ لا يعمل أسوأ من لا تلميح
	useHotkey("Mod+Enter", () => void (!isPending && onSubmit()), { enabled: open });

	const closing = CONTACT_OUTCOMES.filter((o) => o.closes);
	const keeping = CONTACT_OUTCOMES.filter((o) => !o.closes);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			{/* الرأس يرسم زرّ الإغلاق بنفسه — وإلّا ظهر اثنان (قاعدة RTL ٦) */}
			<DialogContent
				showCloseButton={false}
				className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-lg"
			>
				<FormHeader
					title="تسجيل تواصل"
					variant="dialog"
					identity={row ? { name: row.ownerName, code: row.ownerPhoneE164 } : null}
					onClose={() => onOpenChange(false)}
				/>

				<form onSubmit={onSubmit}>
					<div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
						{/* ── عمّاذا ─────────────────────────────────────────────────────
						    نفس شكل الصفّ على الطاولة، فيتعرّف عليه الموظّف بلا قراءة */}
						<div className="flex flex-col gap-1.5 rounded-[4px] bg-muted/30 p-3">
							{targets.map((target) => (
								<div
									key={target.dedupeKey}
									className="flex items-center gap-2 text-xs"
								>
									<Badge
										variant="outline"
										className="shrink-0 text-[11px]"
									>
										{target.triggerLabel}
									</Badge>
									<span className="min-w-0 flex-1 truncate">
										{target.patientName ?? "—"}
										{target.details && (
											<span className="text-muted-foreground"> — {target.details}</span>
										)}
									</span>
									<span className="shrink-0 tabular-nums text-muted-foreground">
										{formatDate(target.dueAt)}
									</span>
									<span
										className={cn(
											"shrink-0 whitespace-nowrap tabular-nums",
											latenessTone(target.daysUntilDue),
										)}
									>
										{latenessLabel(target.daysUntilDue)}
									</span>
								</div>
							))}
							{!item && targets.length > 1 && (
								<p className="pt-1 text-[11px] text-muted-foreground">
									يُسجَّل على {targets.length} بنود دفعةً واحدة.
								</p>
							)}
						</div>

						{/* ── القناة ──────────────────────────────────────────────────── */}
						<Controller
							name="channel"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.channel}>
									<Label className="justify-start gap-1.5">
										القناة
										<RequiredMark />
									</Label>
									<div className="flex flex-wrap gap-1.5">
										{CONTACT_CHANNELS.map((c) => (
											<ToggleChip
												key={c.value}
												active={field.value === c.value}
												onClick={() => field.onChange(c.value)}
												disabled={isPending}
											>
												{c.label}
											</ToggleChip>
										))}
									</div>
									<FieldError errors={[errors.channel]} />
								</Field>
							)}
						/>

						{/* ── النتيجة ─────────────────────────────────────────────────
						    مجموعتان بحسب الأثر — المعنى على الخيار نفسه لا تحته */}
						<Controller
							name="outcome"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.outcome}>
									<Label className="justify-start gap-1.5">
										النتيجة
										<RequiredMark />
									</Label>

									{/* عموديًّا لا عمودان: خمس رقائق في عمودٍ ضيّق تفيض حتمًا عند
									    ٥١٢ بكسل، والترتيب فوق/تحت يُقرأ أسرع أثناء مكالمة */}
									<div className="flex flex-col gap-3">
										<div className="flex flex-col gap-1.5">
											<span className="text-[11px] font-medium text-muted-foreground">
												يُغلق البند
											</span>
											<div className="flex flex-wrap gap-1.5">
												{closing.map((o) => (
													<ToggleChip
														key={o.value}
														active={field.value === o.value}
														onClick={() => {
															field.onChange(o.value);
															// افتراضٌ معقول للتأجيل بدل حقلٍ فارغ ينتظر
															if (o.value === "SNOOZED" && !snoozedUntil) {
																setValue("snoozedUntil", inDays(7), { shouldValidate: true });
															}
														}}
														disabled={isPending}
													>
														{o.label}
													</ToggleChip>
												))}
											</div>
										</div>

										<div className="flex flex-col gap-1.5">
											<span className="text-[11px] font-medium text-muted-foreground">
												يبقى في القائمة
											</span>
											<div className="flex flex-wrap gap-1.5">
												{keeping.map((o) => (
													<ToggleChip
														key={o.value}
														active={field.value === o.value}
														onClick={() => field.onChange(o.value)}
														disabled={isPending}
													>
														{o.label}
													</ToggleChip>
												))}
											</div>
										</div>
									</div>
									<FieldError errors={[errors.outcome]} />
								</Field>
							)}
						/>

						{/* ── التأجيل — يظهر مع «أجّله وليّ الأمر» وحدها ──────────────────── */}
						{outcome === "SNOOZED" && (
							<Controller
								name="snoozedUntil"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.snoozedUntil}>
										<Label className="justify-start gap-1.5">
											أجّله حتى
											<RequiredMark />
										</Label>
										<div className="flex flex-wrap items-center gap-2">
											<div className="flex flex-wrap gap-1.5">
												{SNOOZE_PRESETS.map((p) => (
													<ToggleChip
														key={p.days}
														active={field.value === inDays(p.days)}
														onClick={() => field.onChange(inDays(p.days))}
														disabled={isPending}
													>
														{p.label}
													</ToggleChip>
												))}
											</div>
											<DateField
												value={field.value ?? ""}
												onChange={field.onChange}
												placeholder="أو تاريخ محدّد"
												invalid={!!errors.snoozedUntil}
												triggerDisabled={isPending}
												// لا معنى لتأجيلٍ إلى الماضي
												disabled={{ before: new Date() }}
												className="min-w-[180px] flex-1"
											/>
										</div>
										<FieldError errors={[errors.snoozedUntil]} />
									</Field>
								)}
							/>
						)}

						{/* ── ملاحظات ────────────────────────────────────────────────── */}
						<Field data-invalid={!!errors.notes}>
							<Label>ملاحظات</Label>
							<Textarea
								rows={2}
								placeholder="ما قاله وليّ الأمر — يُقرأ في المكالمة التالية"
								disabled={isPending}
								{...register("notes")}
							/>
							<FieldError errors={[errors.notes]} />
						</Field>
					</div>

					<FormFooter showShortcut>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending || targets.length === 0}
						>
							تسجيل
						</Button>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

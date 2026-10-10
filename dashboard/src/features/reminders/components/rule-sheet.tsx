import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CHANNEL_ORDER, minutesToClock } from "@/features/reminders/data/reminders";
import { useRuleMutations } from "@/features/reminders/hooks/use-reminders";
import type { NotificationChannel, ReminderTrigger } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { ReminderRuleResponse } from "@/server/reminders/reminders.type";

/**
 * [RC3] محرّر قاعدة التذكير.
 *
 * ── قرارا تصميم يستحقّان الشرح ───────────────────────────────────────────────
 *
 * 1. **الإزاحة تُدخَل بالأيام واتجاه، لا بالساعات موقَّعة.** الخادم يخزّن
 *    `offsetHours` وقد يكون سالبًا (بعد الاستحقاق)، لكن «‎-48‎» في حقلٍ اسمُه
 *    «التوقيت» يُقرأ خطأً حتمًا. الحقلان هنا — رقم + «قبل/بعد» — يُترجَمان إلى
 *    الرقم الموقَّع عند الحفظ.
 *
 * 2. **القناة بلا مزوّد تُعرض مُعطَّلة بسببها لا محذوفة.** حذفُها يجعل الأكاديمية
 *    تظنّ أن الرسائل النصية غير مدعومة أصلًا؛ وإظهارها قابلةً للاختيار يجعلها
 *    تختارها ثم تصمت الوحدة. المعطَّل بتلميحٍ يقول «لا مزوّد مُهيّأ» هو الصدق.
 */

type ChannelMeta = { key: string; label: string; configured: boolean };

export function RuleSheet({
	open,
	onOpenChange,
	rule,
	channels,
	triggerLabels,
	templateTags,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** `null` = قاعدة جديدة */
	rule: ReminderRuleResponse | null;
	channels: ChannelMeta[];
	triggerLabels: Record<string, string>;
	templateTags: { tag: string; labelAr: string }[];
}) {
	const { createRule, updateRule, isPending } = useRuleMutations();

	const [name, setName] = useState("");
	const [trigger, setTrigger] = useState<ReminderTrigger>("VACCINATION_DUE");
	const [offsetDays, setOffsetDays] = useState("14");
	const [offsetDirection, setOffsetDirection] = useState<"before" | "after">("before");
	const [horizonDays, setHorizonDays] = useState("14");
	const [selected, setSelected] = useState<NotificationChannel[]>(["WHATSAPP", "EMAIL"]);
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [repeatAfterDays, setRepeatAfterDays] = useState("");
	const [maxSends, setMaxSends] = useState("1");
	const [quietEnabled, setQuietEnabled] = useState(true);
	const [quietStart, setQuietStart] = useState("21:00");
	const [quietEnd, setQuietEnd] = useState("08:00");

	useEffect(() => {
		if (!open) return;
		if (rule) {
			setName(rule.name);
			setTrigger(rule.trigger);
			setOffsetDays(String(Math.round(Math.abs(rule.offsetHours) / 24) || 0));
			setOffsetDirection(rule.offsetHours < 0 ? "after" : "before");
			setHorizonDays(String(rule.horizonDays));
			setSelected(rule.channels);
			setSubject(rule.subjectTemplate ?? "");
			setBody(rule.bodyTemplate);
			setRepeatAfterDays(rule.repeatAfterDays ? String(rule.repeatAfterDays) : "");
			setMaxSends(String(rule.maxSends));
			setQuietEnabled(rule.quietHoursStart !== null);
			setQuietStart(minutesToClock(rule.quietHoursStart ?? 21 * 60));
			setQuietEnd(minutesToClock(rule.quietHoursEnd ?? 8 * 60));
			return;
		}
		setName("");
		setTrigger("VACCINATION_DUE");
		setOffsetDays("14");
		setOffsetDirection("before");
		setHorizonDays("14");
		setSelected(["WHATSAPP", "EMAIL"]);
		setSubject("");
		setBody("");
		setRepeatAfterDays("");
		setMaxSends("1");
		setQuietEnabled(true);
		setQuietStart("21:00");
		setQuietEnd("08:00");
	}, [open, rule]);

	const toggleChannel = (channel: NotificationChannel) =>
		setSelected((prev) =>
			prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel],
		);

	const canSubmit = name.trim().length > 0 && body.trim().length > 0 && selected.length > 0;

	const submit = async () => {
		const days = Number(offsetDays) || 0;
		const payload = {
			trigger,
			name: name.trim(),
			active: rule?.active ?? false,
			offsetHours: (offsetDirection === "after" ? -1 : 1) * days * 24,
			repeatAfterDays: repeatAfterDays ? Number(repeatAfterDays) : null,
			maxSends: Number(maxSends) || 1,
			channels: selected,
			subjectTemplate: subject.trim() || null,
			bodyTemplate: body,
			quietHoursStart: quietEnabled ? clockToMinutes(quietStart) : null,
			quietHoursEnd: quietEnabled ? clockToMinutes(quietEnd) : null,
			horizonDays: Number(horizonDays) || 14,
		};
		if (rule) await updateRule({ id: rule.id, ...payload });
		else await createRule(payload);
		onOpenChange(false);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
			>
				<div className="border-b px-4 py-2">
					<SheetTitle className="text-base">
						{rule ? "تعديل قاعدة تذكير" : "قاعدة تذكير جديدة"}
					</SheetTitle>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
					<div className="flex flex-col gap-1.5">
						<Label>اسم القاعدة</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="تذكير التطعيم المستحق"
							disabled={isPending}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>السبب</Label>
						<Select
							value={trigger}
							onValueChange={(v) => setTrigger(v as ReminderTrigger)}
							disabled={isPending || Boolean(rule)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								{Object.entries(triggerLabels).map(([key, label]) => (
									<SelectItem
										key={key}
										value={key}
									>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{rule && (
							// تغييرُ السبب على قاعدةٍ قائمة يُغيّر جامعها وقالبها معًا، ويترك
							// رسائل مُدرَجة بسببٍ لم يعد سببها. الإنشاء الجديد أوضح.
							<p className="text-muted-foreground text-xs">
								لا يمكن تغيير سبب قاعدة قائمة — أنشئ قاعدة جديدة بدلًا من ذلك.
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label>التوقيت (أيام)</Label>
							<Input
								type="number"
								inputMode="numeric"
								min={0}
								value={offsetDays}
								onChange={(e) => setOffsetDays(e.target.value)}
								disabled={isPending}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label>الاتجاه</Label>
							<Select
								value={offsetDirection}
								onValueChange={(v) => setOffsetDirection(v as "before" | "after")}
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="before">قبل الاستحقاق</SelectItem>
									<SelectItem value="after">بعد الاستحقاق</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>مدى الاستباق (أيام)</Label>
						<Input
							type="number"
							inputMode="numeric"
							min={1}
							value={horizonDays}
							onChange={(e) => setHorizonDays(e.target.value)}
							disabled={isPending}
						/>
						<p className="text-muted-foreground text-xs">
							كم يومًا في المستقبل يُبحث عن استحقاقات. لا علاقة له بموعد الإرسال.
						</p>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>القنوات (بترتيب التفضيل)</Label>
						<div className="flex flex-wrap gap-1.5">
							{CHANNEL_ORDER.map((key) => {
								const meta = channels.find((c) => c.key === key);
								const configured = meta?.configured ?? false;
								const isOn = selected.includes(key);
								return (
									<Tooltip key={key}>
										<TooltipTrigger asChild>
											<span>
												<Button
													type="button"
													size="sm"
													variant={isOn ? "default" : "outline"}
													disabled={!configured || isPending}
													onClick={() => toggleChannel(key)}
													className={cn(!configured && "opacity-50")}
												>
													{meta?.label ?? key}
												</Button>
											</span>
										</TooltipTrigger>
										<TooltipContent>
											{configured
												? "أوّل قناة قابلة للتسليم تفوز — والبقية احتياط"
												: "لا مزوّد مُهيّأ لهذه القناة في هذه النسخة"}
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label>إعادة التذكير كل (أيام)</Label>
							<Input
								type="number"
								inputMode="numeric"
								min={1}
								value={repeatAfterDays}
								onChange={(e) => setRepeatAfterDays(e.target.value)}
								placeholder="بلا تكرار"
								disabled={isPending}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label>أقصى عدد رسائل</Label>
							<Input
								type="number"
								inputMode="numeric"
								min={1}
								max={10}
								value={maxSends}
								onChange={(e) => setMaxSends(e.target.value)}
								disabled={isPending}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5 rounded-md border p-3">
						<div className="flex items-center justify-between">
							<Label>ساعات الهدوء</Label>
							<Switch
								size="sm"
								checked={quietEnabled}
								onCheckedChange={setQuietEnabled}
								disabled={isPending}
							/>
						</div>
						{quietEnabled && (
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs">من</Label>
									<Input
										type="time"
										value={quietStart}
										onChange={(e) => setQuietStart(e.target.value)}
										disabled={isPending}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs">إلى</Label>
									<Input
										type="time"
										value={quietEnd}
										onChange={(e) => setQuietEnd(e.target.value)}
										disabled={isPending}
									/>
								</div>
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							الرسالة التي يقع موعدها داخل النافذة تُؤجَّل إلى نهايتها — لا تُلغى. بتوقيت الأكاديمية
							لا الخادم.
						</p>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>عنوان الرسالة (للبريد)</Label>
						<Input
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder="تذكير بموعد تطعيم {{patientName}}"
							disabled={isPending}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>نصّ الرسالة</Label>
						<Textarea
							value={body}
							onChange={(e) => setBody(e.target.value)}
							rows={8}
							dir="rtl"
							disabled={isPending}
						/>
						<div className="flex flex-wrap gap-1">
							{templateTags.map((tag) => (
								<Tooltip key={tag.tag}>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={() => setBody((prev) => `${prev}{{${tag.tag}}}`)}
											disabled={isPending}
										>
											<Badge
												variant="outline"
												className="cursor-pointer text-xs"
											>
												{`{{${tag.tag}}}`}
											</Badge>
										</button>
									</TooltipTrigger>
									<TooltipContent>{tag.labelAr}</TooltipContent>
								</Tooltip>
							))}
						</div>
						<p className="flex items-start gap-1.5 text-muted-foreground text-xs">
							<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
							علامة خارج هذه القائمة تُرفض عند الحفظ — لا عند الإرسال.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 border-t px-4 py-2">
					<Button
						size="sm"
						disabled={!canSubmit || isPending}
						onClick={submit}
					>
						حفظ
					</Button>
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

/** «21:00» → دقائق من منتصف الليل. قيمة غير مفهومة تعود إلى الافتراضي لا إلى NaN. */
function clockToMinutes(clock: string): number {
	const [h, m] = clock.split(":").map(Number);
	if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
	return ((h as number) % 24) * 60 + ((m as number) % 60);
}

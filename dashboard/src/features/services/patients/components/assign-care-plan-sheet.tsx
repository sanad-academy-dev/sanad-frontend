import {
	IconCalendarPlus,
	IconClock,
	IconCurrencyDollar,
	IconFilter,
	IconSearch,
	IconStar,
	IconX,
} from "@tabler/icons-react";
import { arSA, enUS } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { minutesToTimeLabel } from "@/features/appointments/utils/time";
import { useCarePlans } from "@/features/finance/care-plans/hooks/use-care-plans";
import { useEnrollmentMutations } from "@/features/finance/care-plans/hooks/use-enrollment-mutations";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

// خانات وقت ثابتة: كل 30 دقيقة من 8 صباحًا حتى 8 مساءً
const TIME_SLOTS: number[] = Array.from(
	{ length: (20 - 8) * 2 + 1 },
	(_, i) => 8 * 60 + i * 30,
);

// يدمج تاريخًا مع دقيقة اليوم في كائن Date محلي
function combineDateAndMinute(date: Date, minute: number): Date {
	const d = new Date(date);
	d.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
	return d;
}

// أقرب خانة وقت متاحة لتاريخ معيّن: أول خانة قادمة إن كان اليوم، وإلا أول خانة في اليوم
function nearestAvailableSlot(date: Date): number {
	const now = new Date();
	const isToday = date.toDateString() === now.toDateString();
	if (!isToday) return TIME_SLOTS[0];
	const currentMinute = now.getHours() * 60 + now.getMinutes();
	return (
		TIME_SLOTS.find((minute) => minute > currentMinute) ?? TIME_SLOTS[TIME_SLOTS.length - 1]
	);
}

function PlanCard({
	plan,
	selected,
	onSelect,
}: {
	plan: CarePlanListItemResponse;
	selected: boolean;
	onSelect: () => void;
}) {
	const rating = plan.ratingCount > 0 ? plan.ratingSum / plan.ratingCount : null;
	const price = Number(plan.price).toLocaleString("ar-SA");

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex w-full flex-col gap-2 rounded-lg border bg-white p-3 text-right transition-colors hover:bg-muted/30",
				selected ? "border-primary ring-1 ring-primary" : "border-[#ebebef]",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-1 flex-col">
					<span className="text-sm font-semibold text-foreground">{plan.name}</span>
					{plan.notes && <span className="text-xs text-muted-foreground">{plan.notes}</span>}
				</div>
				<span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
					{plan.type}
				</span>
			</div>

			<div className="flex items-center justify-start gap-3 text-[11px] text-muted-foreground">
				<span className="flex items-center gap-1 tabular-nums">
					{rating ? (
						<>
							<IconStar className="size-3.5 fill-amber-400 text-amber-400" />
							{rating.toFixed(1)} ({plan.ratingCount})
						</>
					) : (
						"لا يوجد تقييم"
					)}
				</span>
				<span className="text-muted-foreground/40">·</span>
				<span className="flex items-center gap-1 tabular-nums">
					<IconClock className="size-3.5" />
					{plan.visitDurationMins} دقيقة
				</span>
				<span className="text-muted-foreground/40">·</span>
				<span className="flex items-center gap-1 tabular-nums">
					<IconCurrencyDollar className="size-3.5" />
					{price} ر.س
				</span>
			</div>
		</button>
	);
}

export function AssignCarePlanSheet({
	patientId,
	sourceAppointmentId,
	open,
	onOpenChange,
}: {
	patientId: string | null;
	// عند التعيين من داخل موعد مفتوح — تُنشأ جلسات مجدولة لكل زيارة بمدرّب هذا الموعد
	sourceAppointmentId?: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { lang, isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const calendarLocale = lang === "ar" ? arSA : enUS;

	const [search, setSearch] = useState("");
	const [carePlanId, setCarePlanId] = useState<string | null>(null);
	// تاريخ ووقت الزيارة الأولى — تُبنى بقيّة الزيارات بإضافة فواصل الخطة إليها
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [startMinute, setStartMinute] = useState<number | undefined>(undefined);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const { plans, isLoading } = useCarePlans();
	const { patients } = usePatients();
	const { enroll, isEnrolling } = useEnrollmentMutations();

	const patient = patients.find((p) => p.id === patientId);

	useEffect(() => {
		if (!open) return;
		setSearch("");
		setCarePlanId(null);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		setDate(today);
		setStartMinute(nearestAvailableSlot(today));
		setConfirmOpen(false);
	}, [open]);

	const filteredPlans = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return plans;
		return plans.filter(
			(p) =>
				p.name.toLowerCase().includes(term) ||
				p.code.toLowerCase().includes(term) ||
				p.type.toLowerCase().includes(term),
		);
	}, [plans, search]);

	const hasStart = !!date && typeof startMinute === "number";

	const dateLabel = date
		? new Intl.DateTimeFormat(isRtl ? "ar-SA" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(date)
		: undefined;
	const timeLabel =
		typeof startMinute === "number" ? minutesToTimeLabel(startMinute, lang) : undefined;

	const handleSubmit = async () => {
		if (!patientId || !carePlanId || !date || typeof startMinute !== "number") return;
		try {
			await enroll(carePlanId, {
				patientId,
				sourceAppointmentId: sourceAppointmentId ?? undefined,
				startedAt: combineDateAndMinute(date, startMinute).toISOString(),
			});
			onOpenChange(false);
		} catch {
			// toast handled by hook
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			{/*
			  ملفّ الطفل يفتح من اليسار بعرض ⅔ الشاشة. هذا اللوح يلتصق بحافّته اليمنى
			  مع فجوة صغيرة بدلاً من الالتصاق بحافّة الشاشة اليمنى، ويظلّ الملفّ ظاهرًا خلفه.
			*/}
			<SheetContent
				side="left"
				showOverlay={false}
				showCloseButton={false}
				className="flex flex-col gap-0 rounded-lg border p-0 shadow-lg data-[side=left]:inset-y-2 data-[side=left]:left-[calc(66.6667%+0.5rem)] data-[side=left]:right-2 data-[side=left]:h-auto data-[side=left]:w-auto data-[side=left]:max-w-none sm:data-[side=left]:max-w-none"
				dir="rtl"
			>
				<SheetHeader className="p-0">
					<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<SheetTitle className="flex items-center gap-1.5 text-sm font-medium">
							<span className="text-primary">تعيين خطة علاجية</span>
							{patient && (
								<>
									<span className="text-muted-foreground">/</span>
									<span className="text-foreground">{patient.name}</span>
									<span className="text-xs font-normal tabular-nums text-muted-foreground">
										{patient.code}
									</span>
								</>
							)}
						</SheetTitle>

						<Button
							size="icon"
							variant="ghost"
							className="size-8"
							onClick={() => onOpenChange(false)}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				</SheetHeader>

				{/* شريط البحث + الفلترة */}
				<div className="flex items-center gap-2 p-3">
					<div className="relative flex-1">
						<IconSearch className="absolute inset-y-0 right-2.5 my-auto size-4 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ابحث عن الخطة العلاجية بالإسم، المعرف..."
							className="h-9 pr-8 text-right text-sm"
						/>
					</div>
					<Button
						size="sm"
						variant="outline"
						className="h-9 shrink-0 gap-1.5"
					>
						<IconFilter className="size-3.5" />
						فلترة
					</Button>
				</div>

				<Separator />

				{/* قائمة الخطط */}
				<div className="flex-1 space-y-2 overflow-y-auto p-3">
					{isLoading ? (
						<p className="py-8 text-center text-sm text-muted-foreground">جارٍ التحميل...</p>
					) : filteredPlans.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							لا توجد خطط علاجية مطابقة
						</p>
					) : (
						filteredPlans.map((plan) => (
							<PlanCard
								key={plan.id}
								plan={plan}
								selected={carePlanId === plan.id}
								onSelect={() => setCarePlanId((prev) => (prev === plan.id ? null : plan.id))}
							/>
						))
					)}
				</div>

				<Separator />

				{/* الفوتر */}
				<div className="flex items-center gap-2 p-4">
					<Popover
						open={confirmOpen}
						onOpenChange={setConfirmOpen}
					>
						<PopoverTrigger asChild>
							<Button
								className="flex-1"
								disabled={!carePlanId || !hasStart || isEnrolling}
							>
								تعيين الخطة
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align={isRtl ? "end" : "start"}
							dir={dir}
							className="w-[320px] space-y-3 p-3"
						>
							<div className="space-y-1">
								<p className="text-sm font-medium text-foreground">تأكيد الزيارة الأولى</p>
								<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<IconCalendarPlus className="size-3.5 shrink-0" />
									{dateLabel}
									{timeLabel ? ` · ${timeLabel}` : ""}
								</p>
							</div>

							<Calendar
								mode="single"
								className="w-full p-0"
								selected={date}
								onSelect={(d) => {
									setDate(d);
									setStartMinute(d ? nearestAvailableSlot(d) : undefined);
								}}
								disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
								locale={calendarLocale}
							/>

							<div className="space-y-1.5">
								<Label className="text-xs font-medium">وقت الزيارة</Label>
								<div className="grid max-h-36 grid-cols-3 gap-1.5 overflow-y-auto">
									{!date ? (
										<p className="col-span-3 py-2 text-center text-xs text-muted-foreground">
											اختر التاريخ أولاً
										</p>
									) : (
										TIME_SLOTS.map((minute) => {
											const selected = startMinute === minute;
											// تعطيل الأوقات الماضية إذا كان التاريخ المختار هو اليوم
											const now = new Date();
											const isToday = date.toDateString() === now.toDateString();
											const past = isToday && minute <= now.getHours() * 60 + now.getMinutes();
											return (
												<Button
													key={minute}
													type="button"
													variant={selected ? "default" : "outline"}
													size="sm"
													disabled={past}
													onClick={() => setStartMinute(minute)}
													className={cn("h-8 text-xs", past && "opacity-50")}
												>
													{minutesToTimeLabel(minute, lang)}
												</Button>
											);
										})
									)}
								</div>
							</div>

							<Button
								className="w-full"
								disabled={!hasStart || isEnrolling}
								onClick={handleSubmit}
							>
								تأكيد
							</Button>
						</PopoverContent>
					</Popover>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// حاسبة مكافأة نهاية الدورة — وفق نظام العمل السعودي (المادتان 84 و85).
// حساب فوري (live) مع إمكانية تعبئة الأجر وتاريخ المباشرة من موظف مختار.
import { IconDeviceFloppy, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	calculateEndOfService,
	EOS_REASONS,
	type EosReason,
} from "@/features/services/staff/components/payroll/end-of-service";
import { EosSettlementsList } from "@/features/services/staff/components/payroll/eos-settlements-list";
import { useEosMutations } from "@/features/services/staff/hooks/use-end-of-service";
import { useStaffCompensation } from "@/features/services/staff/hooks/use-staff-compensation";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { StaffResponse } from "@/server/staff/staff.type";

// تاريخ اليوم بصيغة YYYY-MM-DD لحقول التاريخ
function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

function toISODate(value: string | Date | null | undefined): string {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function ResultRow({
	label,
	value,
	muted,
}: {
	label: string;
	value: string;
	muted?: boolean;
}) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-[12px] text-muted-foreground">{label}</span>
			<span
				className={`text-[12px] font-semibold tabular-nums ${muted ? "text-muted-foreground" : "text-foreground"}`}
			>
				{value}
			</span>
		</div>
	);
}

export function EndOfServiceDialog({
	open,
	onClose,
	staff,
}: {
	open: boolean;
	onClose: () => void;
	staff: StaffResponse[];
}) {
	const { format } = useCurrency();
	const [employeeId, setEmployeeId] = useState<string>("");
	const [monthlyWage, setMonthlyWage] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>(todayISO());
	const [reason, setReason] = useState<EosReason>("END_OF_CONTRACT");

	const selected = staff.find((s) => s.id === employeeId);
	const { compensation, isLoading: isLoadingCompensation } = useStaffCompensation(employeeId);

	// تعبئة تاريخ المباشرة من تاريخ التوظيف الفعلي (لا من تاريخ إنشاء السجل)
	const handleSelectEmployee = (id: string) => {
		setEmployeeId(id);
		const s = staff.find((x) => x.id === id);
		if (!s) return;
		setStartDate(toISODate(s.hireDate));
		setEndDate(todayISO());
		setMonthlyWage("");
	};

	// الأجر الشهري = الراتب الأساسي + البدلات الثابتة، من ملف تعويضات الموظف
	useEffect(() => {
		if (!compensation) return;
		const allowances = compensation.allowances.reduce((sum, a) => sum + Number(a.amount), 0);
		setMonthlyWage(String(Number(compensation.baseSalary) + allowances));
	}, [compensation]);

	// تنبيهات البيانات الناقصة — الحقول تبقى قابلة للتعبئة يدويًا
	const missingHireDate = !!selected && !selected.hireDate;
	const missingCompensation = !!employeeId && !isLoadingCompensation && !compensation;

	const result = useMemo(
		() =>
			calculateEndOfService({ monthlyWage: Number(monthlyWage), startDate, endDate, reason }),
		[monthlyWage, startDate, endDate, reason],
	);

	const hasResult = result.finalAmount > 0 || result.fullAward > 0;
	// تبويبان: الحاسبة تُنشئ تسوية، والقائمة تعرض ما حُفظ منها
	const [tab, setTab] = useState<"calculator" | "saved">("calculator");

	// الحاسبة كانت تحسب ثم تنسى؛ الحفظ يثبّت المكافأة كالتزام ويُرحّلها للمالية
	const { saveAndApprove, create, approve } = useEosMutations();
	const isSaving = create.isPending || approve.isPending;
	const canSave = !!employeeId && hasResult && !isSaving;

	const handleSave = async () => {
		if (!canSave) return;
		try {
			await saveAndApprove({
				staffId: employeeId,
				reason,
				monthlyWage: Number(monthlyWage),
				startDate,
				endDate,
				serviceYears: result.years,
				serviceMonths: result.months,
				serviceDays: result.days,
				firstFiveMonths: result.firstFiveMonths,
				beyondFiveMonths: result.beyondFiveMonths,
				fullAward: result.fullAward,
				factor: result.factor,
				finalAmount: result.finalAmount,
			});
			onClose();
		} catch {
			// التوست يعرض الخطأ
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[92vh] w-full max-w-3xl! flex-col gap-0 overflow-hidden p-0"
				dir="rtl"
			>
				{/* الترويسة */}
				<div className="flex items-center justify-between px-5 pt-4 pb-3">
					<div className="flex flex-col">
						<DialogTitle className="text-[16px] font-bold text-foreground">
							حاسبة نهاية الدورة
						</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground">
							وفق نظام العمل السعودي (المادتان 84 و85)
						</DialogDescription>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={onClose}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<Separator />

				{/* تبويبا الحاسبة / المحفوظات */}
				<div className="flex items-center gap-1 px-5 pt-3">
					{(
						[
							["calculator", "حاسبة جديدة"],
							["saved", "التسويات المحفوظة"],
						] as const
					).map(([value, label]) => (
						<button
							key={value}
							type="button"
							onClick={() => setTab(value)}
							className={cn(
								"rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
								tab === value
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted",
							)}
						>
							{label}
						</button>
					))}
				</div>

				{tab === "saved" ? (
					<div className="min-h-0 flex-1 overflow-y-auto p-5">
						<EosSettlementsList />
					</div>
				) : (
					<div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-y-auto md:grid-cols-2">
						{/* المدخلات */}
						<div className="flex flex-col gap-3.5 border-b p-5 md:border-b-0 md:border-s">
							<div className="flex flex-col gap-1.5">
								<Label className="text-[12px]">الموظف (اختياري — لتعبئة البيانات)</Label>
								<Select
									value={employeeId}
									onValueChange={handleSelectEmployee}
									dir="rtl"
								>
									<SelectTrigger className="h-9 text-[12px]">
										<SelectValue placeholder="اختر موظفًا..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{staff.map((s) => (
											<SelectItem
												key={s.id}
												value={s.id}
											>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{missingCompensation && (
									<span className="text-[11px] leading-[16px] text-amber-800">
										لا يوجد ملف تعويضات لهذا الموظف — أدخل الأجر يدويًا أو أضِف الملف من صفحة
										الموظف.
									</span>
								)}
								{missingHireDate && (
									<span className="text-[11px] leading-[16px] text-amber-800">
										تاريخ التوظيف غير مسجّل لهذا الموظف — أدخل تاريخ المباشرة يدويًا.
									</span>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-[12px]">الأجر الشهري (ر.س)</Label>
								<Input
									type="number"
									inputMode="numeric"
									min={0}
									placeholder="مثال: 12000"
									className="h-9 text-[12px] tabular-nums"
									value={monthlyWage}
									onChange={(e) => setMonthlyWage(e.target.value)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<Label className="text-[12px]">تاريخ المباشرة</Label>
									<DateField
										value={startDate}
										onChange={setStartDate}
										placeholder="اختر التاريخ..."
										disabled={{
											after: endDate ? new Date(`${endDate}T00:00:00`) : new Date(),
										}}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<Label className="text-[12px]">تاريخ نهاية الدورة</Label>
									<DateField
										value={endDate}
										onChange={setEndDate}
										placeholder="اختر التاريخ..."
										disabled={
											startDate ? { before: new Date(`${startDate}T00:00:00`) } : undefined
										}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-[12px]">سبب انتهاء الدورة</Label>
								<Select
									value={reason}
									onValueChange={(v) => setReason(v as EosReason)}
									dir="rtl"
								>
									<SelectTrigger className="h-9 text-[12px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir="rtl">
										{EOS_REASONS.map((r) => (
											<SelectItem
												key={r.value}
												value={r.value}
											>
												{r.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{reason === "RESIGNATION" && (
									<span className="text-[11px] leading-[16px] text-amber-800">
										في حالة الاستقالة تُطبّق المادة 85: لا تُستحق قبل سنتين، ثلث المكافأة (2–5)،
										ثلثاها (5–10)، وكاملة بعد 10 سنوات.
									</span>
								)}
							</div>
						</div>

						{/* النتيجة */}
						<div className="flex flex-col gap-4 bg-muted/60 p-5">
							{/* مدة الدورة */}
							<div className="flex flex-col gap-1.5 rounded-[4px] border border-border bg-card p-3">
								<span className="text-[11px] text-muted-foreground">مدة الدورة</span>
								<span className="text-[15px] font-bold text-foreground tabular-nums">
									{result.years} سنة، {result.months} شهر، {result.days} يوم
								</span>
							</div>

							{/* تفصيل الاحتساب */}
							<div className="flex flex-col gap-2 rounded-[4px] border border-border bg-card p-3">
								<ResultRow
									label="مكافأة أول 5 سنوات (نصف شهر/سنة)"
									value={`${result.firstFiveMonths.toFixed(2)} شهر`}
									muted
								/>
								<ResultRow
									label="ما بعد 5 سنوات (شهر/سنة)"
									value={`${result.beyondFiveMonths.toFixed(2)} شهر`}
									muted
								/>
								<Separator />
								<ResultRow
									label="المكافأة الكاملة"
									value={format(result.fullAward)}
								/>
								{result.factor < 1 && (
									<ResultRow
										label="نسبة الاستحقاق"
										value={`× ${(result.factor * 100).toFixed(0)}%`}
									/>
								)}
							</div>

							{/* الإجمالي النهائي */}
							<div className="flex flex-col gap-1 rounded-[4px] border border-primary/30 bg-primary/[0.06] p-4">
								<span className="text-[11px] font-medium text-primary">
									مكافأة نهاية الدورة المستحقّة
								</span>
								<span className="text-[22px] font-bold text-primary tabular-nums">
									{format(result.finalAmount)}
								</span>
								{result.factorLabel && (
									<span className="text-[11px] text-primary">{result.factorLabel}</span>
								)}
							</div>

							{!hasResult && (
								<p className="text-[11px] leading-[16px] text-muted-foreground">
									أدخل الأجر الشهري وتاريخي المباشرة والنهاية لعرض المكافأة المستحقّة.
								</p>
							)}

							{/* حفظ التسوية — يعتمدها ويُرحّلها للمالية كمصروف */}
							{hasResult && (
								<div className="flex items-center justify-end gap-2 border-t pt-3">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={onClose}
										className="h-8 text-xs"
									>
										إغلاق
									</Button>
									<Button
										type="button"
										size="sm"
										onClick={handleSave}
										disabled={!canSave}
										className="h-8 gap-1.5 text-xs font-bold"
									>
										<IconDeviceFloppy className="size-3.5" />
										{isSaving ? "جارٍ الحفظ..." : "حفظ التسوية واعتمادها"}
									</Button>
								</div>
							)}

							{/* تنويه قانوني */}
							<div className="flex items-start gap-1.5 text-[10px] leading-[15px] text-muted-foreground">
								<IconInfoCircle className="mt-0.5 size-3.5 shrink-0" />
								<span>
									حساب تقديري وفق المادتين 84 و85 من نظام العمل السعودي. قد تختلف القيمة
									النهائية حسب بنود العقد والبدلات المشمولة وأي مستحقّات أخرى.
								</span>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

import { IconArrowLeft, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useReviewLabQc } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import { WESTGARD_RULES } from "@/features/settings/branches/data/lab-settings";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";
import type { LabTestOrderResponse } from "@/server/lab-tests/lab-tests.type";

// مراجعة ضبط الجودة — نفس بنية حوار «تأكيد الطلب»: تخطيط LTR داخلي بمحاذاة
// يمينية ورأس/تذييل RTL، لكن المحتوى قواعد Westgard المفعّلة لفرع الطلب.
// المراجعة تُحفظ على الطلب (qcReviewedAt/qcRules)، وبعدها يعرض الحوار الإجراء
// التالي: إدخال تقرير أوّل تحليل ينتظره.

const dateTimeLabel = (value: Date | string) =>
	new Date(value).toLocaleString("ar-EG", {
		day: "numeric",
		month: "long",
		hour: "2-digit",
		minute: "2-digit",
	});

export function LabQcReviewDialog({
	order,
	open,
	onOpenChange,
	onOpenItem,
}: {
	order: LabTestOrderResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** فتح لوحة تحليل بعينه — الإجراء التالي بعد اعتماد المراجعة */
	onOpenItem: (itemId: string) => void;
}) {
	const { branch, isLoading } = useBranch(order.branchId);
	const { reviewQc, isPending } = useReviewLabQc();

	const settings = branch ? parseBranchSettings(branch.settings) : null;
	// القواعد المفعّلة لهذا الفرع فقط، بترتيب القائمة المرجعية لا ترتيب الحفظ
	const activeRules = settings
		? WESTGARD_RULES.filter((rule) => settings.labTests.westgardRules.includes(rule.id))
		: [];

	const reviewed = !!order.qcReviewedAt;
	const [checked, setChecked] = useState<string[]>([]);

	// نبدأ من القواعد المحفوظة عند كل فتح — لا يبقى تأشير من جلسة سابقة
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح فقط
	useEffect(() => {
		if (open) setChecked(order.qcRules);
	}, [open, order.id, order.qcReviewedAt]);

	const testsLabel = order.items.map((i) => i.service.name).join("، ") || "—";
	const allPassed = activeRules.length > 0 && activeRules.every((r) => checked.includes(r.id));

	// الإجراء التالي بعد المراجعة: أوّل تحليل بنتائج وبلا تقرير مكتوب
	const nextItem =
		order.items.find(
			(i) => i.status !== LabTestStatus.CANCELLED && i.results.length > 0 && !i.report?.trim(),
		) ?? null;

	const toggle = (ruleId: string, passed: boolean) =>
		setChecked((prev) => (passed ? [...prev, ruleId] : prev.filter((id) => id !== ruleId)));

	const submit = async () => {
		try {
			await reviewQc({ id: order.id, rules: checked });
		} catch {
			// الفشل يُبقي النافذة مفتوحة (التوست يعرض السبب)
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-xl"
			>
				<DialogTitle className="sr-only">مراجعة ضبط الجودة</DialogTitle>

				<div
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
				>
					{/* Header — RTL: المسار يمين وزر الإغلاق يسار */}
					<div
						dir="rtl"
						className="flex items-center justify-between gap-2 border-b p-3"
					>
						<div className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
							<span className="text-indigo-600">مراجعة QC</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">قواعد Westgard</span>
							<span className="text-muted-foreground">›</span>
							<span className="truncate text-foreground">{`${testsLabel} . ${order.code}#`}</span>
						</div>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>

					<div
						dir="rtl"
						className="flex-1 space-y-4 overflow-y-auto p-3"
					>
						{reviewed ? (
							<div className="flex items-start gap-2 rounded-[4px] border border-emerald-200 bg-emerald-50 p-3">
								<IconCircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
								<div className="flex flex-col gap-0.5 text-[12px]">
									<span className="font-medium text-emerald-700">
										اعتُمدت مراجعة ضبط الجودة
									</span>
									<span className="text-emerald-700/80">
										{order.qcReviewedBy?.name ?? "—"} ·{" "}
										{order.qcReviewedAt ? dateTimeLabel(order.qcReviewedAt) : "—"}
									</span>
								</div>
							</div>
						) : (
							<p className="text-[13px] text-foreground">
								راجِع قواعد ضبط الجودة المفعّلة لفرع «{order.branch.name}» قبل اعتماد النتائج.
								القواعد تُدار من إعدادات المختبر للفرع.
							</p>
						)}

						{/* القواعد المفعّلة — مصدرها إعدادات الفرع لا قائمة ثابتة */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-1.5">
									<IconInfoCircle className="size-3.5 text-muted-foreground" />
									<span className="text-[12px] font-medium text-foreground">
										قواعد ضبط الجودة (Westgard)
									</span>
								</div>
								{activeRules.length > 0 && (
									<span className="text-[11px] tabular-nums text-muted-foreground">
										{checked.filter((id) => activeRules.some((r) => r.id === id)).length}/
										{activeRules.length}
									</span>
								)}
							</div>

							<div className="divide-y rounded-[4px] border">
								{isLoading && (
									<p className="px-4 py-3 text-[12px] text-muted-foreground">
										جارٍ تحميل إعدادات الفرع...
									</p>
								)}
								{!isLoading && activeRules.length === 0 && (
									<p className="px-4 py-3 text-[12px] text-muted-foreground">
										لا توجد قواعد Westgard مفعّلة لهذا الفرع. فعّلها من إعدادات الفرع ← التحليلات
										← قواعد ضبط الجودة.
									</p>
								)}
								{activeRules.map((rule) => {
									const passed = checked.includes(rule.id);
									return (
										<label
											key={rule.id}
											htmlFor={`qc-${rule.id}`}
											className={cn(
												"flex items-start gap-2 px-4 py-2.5",
												reviewed ? "cursor-default" : "cursor-pointer",
											)}
										>
											<Checkbox
												id={`qc-${rule.id}`}
												checked={passed}
												disabled={reviewed || isPending}
												onCheckedChange={(value) => toggle(rule.id, value === true)}
												className="mt-0.5 shrink-0"
											/>
											<span className="flex min-w-0 flex-1 flex-col gap-0.5">
												<span
													className={cn(
														"text-[12px] font-semibold",
														passed && "text-muted-foreground line-through",
													)}
												>
													{rule.id}
												</span>
												<span className="text-[11px] leading-relaxed text-muted-foreground">
													{rule.description}
												</span>
											</span>
										</label>
									);
								})}
							</div>
						</div>
					</div>

					{/* Footer — RTL: الزر الرئيسي يمين. بعد الاعتماد يصير الإجراء التالي */}
					<div className="flex items-center gap-2 border-t p-3">
						{reviewed ? (
							nextItem ? (
								<Button
									type="button"
									className="bg-indigo-600 primaryhover:bg-indigo-700"
									onClick={() => {
										onOpenChange(false);
										onOpenItem(nextItem.id);
									}}
								>
									<IconArrowLeft className="size-4 rtl:rotate-180" />
									إدخال تقرير {nextItem.service.name}
								</Button>
							) : (
								<span className="text-[12px] text-muted-foreground">
									كل التحاليل كُتبت تقاريرها — لا إجراء متبقٍّ.
								</span>
							)
						) : (
							<Button
								type="button"
								className="bg-indigo-600 primaryhover:bg-indigo-700"
								disabled={!allPassed || isPending}
								title={allPassed ? undefined : "أشِّر على كل القواعد المفعّلة أولًا"}
								onClick={() => void submit()}
							>
								<IconCircleCheck className="size-4" />
								اعتماد المراجعة
							</Button>
						)}
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							{reviewed ? "إغلاق" : "إلغاء"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

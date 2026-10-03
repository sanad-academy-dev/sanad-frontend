// هيكل معالج المسير: ترويسة + محتوى + خطوات عمودية + تذييل ثابت.
// حوار ملء الشاشة بدل مسار مستقل: الرجوع لصفحة الرواتب يبقى بإغلاق واحد
// ولا يضيف مسارًا يحتاج حراسة وصول منفصلة.
import { IconArrowRight, IconCalendar } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

export interface WizardStepDef {
	title: string;
	description: string;
}

export function WizardShell({
	steps,
	current,
	onStepChange,
	periodLabel,
	runCode,
	onClose,
	onSaveDraft,
	onBack,
	onNext,
	nextLabel,
	nextDisabled,
	canGoBack,
	children,
}: {
	steps: WizardStepDef[];
	current: number;
	onStepChange: (index: number) => void;
	periodLabel: string;
	runCode?: string | null;
	onClose: () => void;
	onSaveDraft?: () => void;
	onBack: () => void;
	onNext: () => void;
	nextLabel: string;
	nextDisabled?: boolean;
	canGoBack: boolean;
	children: ReactNode;
}) {
	return (
		<Dialog
			open
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex h-[100dvh] w-screen max-w-none! flex-col gap-0 rounded-none border-0 p-0 sm:h-[94dvh] sm:w-[96vw] sm:rounded-lg sm:border"
				dir="rtl"
			>
				{/* الترويسة */}
				<header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="size-8 shrink-0"
						onClick={onClose}
						aria-label="رجوع"
					>
						{/* في RTL يشير سهم الرجوع لليمين */}
						<IconArrowRight className="size-4" />
					</Button>

					<div className="flex min-w-0 flex-col">
						<DialogTitle className="font-heading text-lg font-bold text-foreground">
							تشغيل مسير الرواتب
						</DialogTitle>
						<DialogDescription className="sr-only">
							معالج تشغيل مسير رواتب {periodLabel}
						</DialogDescription>
					</div>

					<span className="ms-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs">
						<IconCalendar className="size-3.5 text-muted-foreground" />
						<span className="text-muted-foreground">فترة الاستحقاق:</span>
						<span className="font-medium text-foreground">{periodLabel}</span>
						{runCode && (
							<span className="text-muted-foreground tabular-nums">· {runCode}</span>
						)}
					</span>
				</header>

				{/* المحتوى + الخطوات */}
				<div className="flex min-h-0 flex-1 flex-col-reverse sm:flex-row">
					<main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</main>

					<aside className="shrink-0 border-b border-border p-4 sm:w-[220px] sm:border-b-0 sm:border-s">
						<Stepper
							value={current + 1}
							orientation="vertical"
							indicators={{ completed: <span className="text-sm">✓</span> }}
						>
							<StepperNav className="gap-0">
								{steps.map((step, index) => {
									const isCompleted = index < current;
									const isActive = index === current;
									return (
										<StepperItem
											key={step.title}
											step={index + 1}
											completed={isCompleted}
											className="items-start"
										>
											<StepperTrigger
												className={cn(
													"items-start gap-2.5 py-1",
													// الرجوع متاح للخطوات المكتملة فقط
													isCompleted ? "cursor-pointer" : "cursor-default",
												)}
												onClick={() => {
													if (isCompleted) onStepChange(index);
												}}
											>
												<StepperIndicator
													className={cn(
														"size-6 shrink-0 text-[11px]",
														isCompleted && "bg-emerald-600 primaryring-0",
														isActive && "ring-2 ring-primary/25",
													)}
												>
													{index + 1}
												</StepperIndicator>
												<span className="flex flex-col items-start gap-0.5 text-start">
													<StepperTitle
														className={cn(
															"text-xs",
															isActive
																? "font-bold text-foreground"
																: isCompleted
																	? "text-foreground"
																	: "text-muted-foreground",
														)}
													>
														{step.title}
													</StepperTitle>
													{/* الوصف للخطوة النشطة فقط — يمنع ازدحام العمود */}
													{isActive && (
														<span className="text-[10px] leading-[15px] text-muted-foreground">
															{step.description}
														</span>
													)}
												</span>
											</StepperTrigger>

											{index < steps.length - 1 && (
												<StepperSeparator
													className={cn(
														"ms-3 h-6 w-px border-s border-dashed bg-transparent",
														isCompleted ? "border-emerald-600" : "border-border",
													)}
												/>
											)}
										</StepperItem>
									);
								})}
							</StepperNav>
						</Stepper>
					</aside>
				</div>

				{/* التذييل الثابت */}
				<footer className="flex items-center gap-2 border-t border-border bg-card px-4 py-3">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
					>
						إلغاء
					</Button>

					<div className="ms-auto flex items-center gap-2">
						{onSaveDraft && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={onSaveDraft}
							>
								حفظ كمسودة
							</Button>
						)}
						{canGoBack && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onBack}
							>
								السابق
							</Button>
						)}
						<Button
							type="button"
							size="sm"
							onClick={onNext}
							disabled={nextDisabled}
						>
							{nextLabel}
						</Button>
					</div>
				</footer>
			</DialogContent>
		</Dialog>
	);
}

// الخطوات الست — العنوان والوصف الذي يظهر تحت الخطوة النشطة فقط
export const WIZARD_STEPS: WizardStepDef[] = [
	{ title: "مراجعة الفترة", description: "تأكيد الفترة واختيار الموظفين المشمولين" },
	{ title: "الاحتساب", description: "مراجعة الاستحقاقات وتعديلها يدويًا عند الحاجة" },
	{ title: "اكتشاف المشاكل", description: "حلّ المشاكل المانعة قبل الاعتماد" },
	{ title: "ملخص المسير", description: "مراجعة الإجماليات وتفاصيل الدفع" },
	{ title: "الاعتماد", description: "اعتماد المسير وتجميده نهائيًا" },
	{ title: "الإنهاء", description: "تسجيل الصرف وعرض التقرير" },
];

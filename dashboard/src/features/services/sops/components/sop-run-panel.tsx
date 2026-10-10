import { IconLock, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
	useCompleteSopRun,
	useRespondSopStep,
	useSopRun,
	useStartSopRun,
} from "@/features/services/sops/hooks/use-sop-run";
import type { SopDomain } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { SopRunStepResponse, SopRunTarget } from "@/server/sops/sops.type";

// لوحة بروتوكول العمل القياسي — تنزلق بجانب لوحة الطلب كلوحة البروتوكول الطبي
// في الزيارة. الخطوات تأتي من لقطة التشغيل لا من ثابت في الكود، والعلامات
// تُحفظ على الخادم فلا يضيع التقدّم بإغلاق اللوحة.

/** تجميع الخطوات بعنوان المرحلة — اللقطة مسطّحة والترتيب يحفظ التتابع */
const groupBySection = (steps: SopRunStepResponse[]) => {
	const groups: { title: string; steps: SopRunStepResponse[] }[] = [];
	for (const step of steps) {
		const last = groups.at(-1);
		if (last && last.title === step.sectionTitle) last.steps.push(step);
		else groups.push({ title: step.sectionTitle, steps: [step] });
	}
	return groups;
};

export function SopRunPanel({
	open,
	onClose,
	sheetFraction,
	domain,
	serviceId,
	serviceName,
	target,
}: {
	open: boolean;
	onClose: () => void;
	/** نسبة عرض لوحة الطلب من الشاشة — تتغيّر بفتح التعليقات فتتبعها اللوحة */
	sheetFraction: number;
	domain: SopDomain;
	serviceId: string;
	serviceName: string;
	target: SopRunTarget;
}) {
	const { run, isLoading } = useSopRun(target, open);
	const { startRun, isPending: isStarting } = useStartSopRun();
	const { respondStep } = useRespondSopStep();
	const { completeRun, isPending: isCompleting } = useCompleteSopRun();

	// أول فتح يبدأ التشغيل ويلتقط اللقطة — العرض وحده لا يُنشئ سجلًّا
	useEffect(() => {
		if (!open || isLoading || run || isStarting) return;
		void startRun({ domain, serviceId, target }).catch(() => {});
	}, [open, isLoading, run, isStarting, startRun, domain, serviceId, target]);

	if (typeof document === "undefined") return null;

	const steps = run?.steps ?? [];
	const doneCount = steps.filter((step) => step.response !== null).length;
	const percent = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;
	const isLocked = Boolean(run?.completedAt);
	const allRequiredDone = steps.every((step) => !step.required || step.response !== null);
	const edge = `100vw * ${sheetFraction}`;

	return createPortal(
		<div
			className={cn(
				"fixed top-0 bottom-0 z-60 my-4 flex w-96 flex-col rounded-lg border bg-background shadow-xl",
				open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
			)}
			style={{
				left: open ? `calc(${edge} + 0.75rem)` : `calc(${edge} - 1rem)`,
				transition: "left 300ms ease-in-out, opacity 300ms ease-in-out",
			}}
			dir="rtl"
		>
			<div className="flex shrink-0 items-start justify-between gap-2 border-b px-4 py-2">
				<div className="flex min-w-0 flex-col gap-0.5">
					<span className="truncate text-sm font-semibold">{serviceName}</span>
					<span className="text-[11px] text-muted-foreground">
						بروتوكول العمل القياسي (SOP)
					</span>
				</div>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="size-7"
					aria-label="إغلاق البروتوكول"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</Button>
			</div>

			{isLoading || isStarting ? (
				<div className="flex flex-1 items-center justify-center p-4 text-xs text-muted-foreground">
					جارٍ تحميل البروتوكول...
				</div>
			) : !run ? (
				<div className="flex flex-1 items-center justify-center p-4 text-center text-xs text-muted-foreground">
					لا بروتوكول معرَّفًا لهذه الدورة — عرّفه من إعدادات الدورات.
				</div>
			) : (
				<>
					<div className="flex shrink-0 flex-col gap-1.5 border-b px-4 py-3">
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs font-semibold">التقدم الإجمالي</span>
							<span className="text-[11px] tabular-nums text-muted-foreground">
								{doneCount}/{steps.length} خطوة
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Progress
								value={percent}
								className="h-1.5"
							/>
							<span className="shrink-0 text-[11px] font-medium tabular-nums">{percent}%</span>
						</div>
						{isLocked && (
							<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
								<IconLock className="size-3" />
								مُقفل ومصون — لا تعديل بعد الاكتمال
							</span>
						)}
					</div>

					<div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
						{groupBySection(steps).map((group) => {
							const groupDone = group.steps.filter((s) => s.response !== null).length;
							return (
								<div
									key={group.title}
									className="flex flex-col gap-2"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs font-bold">{group.title}</span>
										<span className="text-[11px] tabular-nums text-muted-foreground">
											{groupDone}/{group.steps.length}
										</span>
									</div>

									<div className="flex flex-col gap-2.5">
										{group.steps.map((step) => {
											const isDone = step.response !== null;
											return (
												<label
													key={step.id}
													htmlFor={`sop-${step.id}`}
													className={cn(
														"flex items-start gap-2",
														isLocked ? "cursor-default" : "cursor-pointer",
													)}
												>
													<Checkbox
														id={`sop-${step.id}`}
														checked={isDone}
														disabled={isLocked}
														onCheckedChange={(value) =>
															void respondStep({
																runId: run.id,
																stepId: step.id,
																target,
																response: value === true ? "CONFIRMED" : null,
															}).catch(() => {})
														}
														className="mt-0.5 shrink-0"
													/>
													<span className="flex min-w-0 flex-1 flex-col gap-1">
														<span
															className={cn(
																"text-xs leading-snug",
																isDone && "text-muted-foreground line-through",
															)}
														>
															{step.textSnapshot}
														</span>
														<span className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
															{step.critical && (
																<span className="rounded-sm bg-destructive/10 px-1.5 py-0.5 font-medium text-destructive">
																	حرج
																</span>
															)}
															{step.ownerRole && <span>{step.ownerRole}</span>}
															{step.ownerRole && step.duration && <span>·</span>}
															{step.duration && <span>{step.duration}</span>}
															{step.respondedBy && (
																<span className="text-muted-foreground/80">
																	— {step.respondedBy.name}
																</span>
															)}
														</span>
													</span>
												</label>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>

					{!isLocked && (
						<div className="flex shrink-0 items-center justify-between gap-2 border-t px-4 py-2">
							<Button
								type="button"
								size="sm"
								disabled={isCompleting || !allRequiredDone}
								onClick={() => void completeRun({ runId: run.id, target }).catch(() => {})}
							>
								إقفال البروتوكول
							</Button>
							<span className="text-[10px] tabular-nums text-muted-foreground">
								نسخة {run.templateVersion}
							</span>
						</div>
					)}
				</>
			)}
		</div>,
		document.body,
	);
}

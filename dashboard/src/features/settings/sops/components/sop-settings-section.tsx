import { IconChecklist, IconPencil, IconRotate } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SopEditorDialog } from "@/features/settings/sops/components/sop-editor-dialog";
import { useRevertSopToSystem, useServiceSop } from "@/features/settings/sops/hooks/use-sops";
import type { SopDomain } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

// قسم بروتوكول العمل القياسي داخل لوحة إعدادات العنصر — نفس الشكل في
// التحاليل والأشعة والعمليات. الأوراق الثلاث أقسام مكدّسة بلا تبويبات،
// فالبروتوكول قسم إضافي لا تبويبًا جديدًا.

export function SopSettingsSection({
	domain,
	serviceId,
	serviceName,
}: {
	domain: SopDomain;
	serviceId: string;
	serviceName: string;
}) {
	const { resolved, isLoading } = useServiceSop(serviceId);
	const { revertSop, isPending: isReverting } = useRevertSopToSystem();
	const [editorOpen, setEditorOpen] = useState(false);

	const template = resolved?.template ?? null;
	const steps = template?.sections.flatMap((section) => section.steps) ?? [];
	const criticalCount = steps.filter((step) => step.critical).length;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<Label className="text-xs font-semibold">بروتوكول العمل القياسي (SOP)</Label>
				<div className="flex items-center gap-1.5">
					{resolved?.isClinicOverride && (
						<Button
							type="button"
							size="sm"
							variant="ghost"
							className="h-7 text-[11px]"
							disabled={isReverting}
							onClick={() => void revertSop({ serviceId, domain }).catch(() => {})}
						>
							<IconRotate className="size-3.5" />
							استعادة بروتوكول النظام
						</Button>
					)}
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="h-7 text-[11px]"
						disabled={isLoading}
						onClick={() => setEditorOpen(true)}
					>
						<IconPencil className="size-3.5" />
						{template ? "تحرير" : "إنشاء بروتوكول"}
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="h-16 animate-pulse rounded-md border bg-muted/30" />
			) : template ? (
				<div className="flex flex-col gap-2 rounded-md border p-3">
					<div className="flex flex-wrap items-center gap-1.5">
						<IconChecklist className="size-4 shrink-0 text-muted-foreground" />
						<span className="text-xs font-semibold">{template.titleAr}</span>
						<span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
							نسخة {template.version}
						</span>
						{resolved?.origin === "INHERITED" && (
							<span className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-500">
								موروث من «{resolved.inheritedFromName}»
							</span>
						)}
						{resolved?.isClinicOverride ? (
							<span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
								مخصّص للأكاديمية
							</span>
						) : (
							<span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
								قالب النظام
							</span>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
						<span className="tabular-nums">{template.sections.length} مرحلة</span>
						<span className="tabular-nums">{steps.length} خطوة</span>
						{criticalCount > 0 && (
							<span className="tabular-nums text-destructive">{criticalCount} حرجة</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						{template.sections.map((section) => (
							<div
								key={section.id}
								className="flex flex-col gap-1"
							>
								<span className="text-[11px] font-bold">{section.titleAr}</span>
								{section.steps.map((step) => (
									<span
										key={step.id}
										className={cn(
											"flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground",
										)}
									>
										<span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
										<span className="min-w-0 flex-1">{step.textAr}</span>
										{step.critical && (
											<span className="shrink-0 rounded-sm bg-destructive/10 px-1 text-[10px] font-medium text-destructive">
												حرج
											</span>
										)}
									</span>
								))}
							</div>
						))}
					</div>

					{template.reference && (
						<span className="text-[10px] leading-relaxed text-muted-foreground">
							مرجع: {template.reference}
						</span>
					)}
				</div>
			) : (
				<div className="rounded-md border border-dashed p-4 text-center text-[11px] text-muted-foreground">
					لا بروتوكول لهذه الدورة ولا لفئتها — أنشئ واحدًا ليظهر لفريق العمل أثناء التنفيذ.
				</div>
			)}

			<SopEditorDialog
				domain={domain}
				serviceId={serviceId}
				serviceName={serviceName}
				resolved={resolved}
				open={editorOpen}
				onOpenChange={setEditorOpen}
			/>
		</div>
	);
}

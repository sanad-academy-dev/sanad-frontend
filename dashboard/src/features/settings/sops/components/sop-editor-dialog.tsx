import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSaveSopTemplate } from "@/features/settings/sops/hooks/use-sops";
import type { ChecklistResponseType, SopDomain } from "@/generated/prisma/enums";
import type { ResolvedSopResponse } from "@/server/sops/sops.type";

// محرر نسخة أكاديمية من بروتوكول العمل القياسي — الحفظ نسخة جديدة دائمًا:
// التشغيلات التقطت لقطتها النصية وقت التنفيذ فلا يمسّ التحرير تاريخًا.

const RESPONSE_TYPE_LABELS: Record<ChecklistResponseType, string> = {
	CONFIRM: "تأكيد",
	YES_NO_NA: "نعم/لا/لا ينطبق",
	TEXT: "نص",
	NUMBER: "رقم",
};

type DraftStep = {
	textAr: string;
	ownerRole: string;
	duration: string;
	note: string;
	critical: boolean;
	required: boolean;
	responseType: ChecklistResponseType;
};

type DraftSection = {
	titleAr: string;
	steps: DraftStep[];
};

const emptyStep = (): DraftStep => ({
	textAr: "",
	ownerRole: "",
	duration: "",
	note: "",
	critical: false,
	required: true,
	responseType: "CONFIRM",
});

const emptySection = (): DraftSection => ({ titleAr: "", steps: [emptyStep()] });

export function SopEditorDialog({
	domain,
	serviceId,
	serviceName,
	resolved,
	open,
	onOpenChange,
}: {
	domain: SopDomain;
	serviceId: string;
	serviceName: string;
	/** القالب الفعّال — تبدأ المسودة منه نظامًا كان أو موروثًا أو نسخة أكاديمية */
	resolved: ResolvedSopResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { saveSop, isPending } = useSaveSopTemplate();
	const [titleAr, setTitleAr] = useState("");
	const [reference, setReference] = useState("");
	const [sections, setSections] = useState<DraftSection[]>([]);

	useEffect(() => {
		if (!open) return;
		const template = resolved?.template;
		setTitleAr(template?.titleAr ?? `بروتوكول ${serviceName}`);
		setReference(template?.reference ?? "");
		setSections(
			template?.sections.map((section) => ({
				titleAr: section.titleAr,
				steps: section.steps.map((step) => ({
					textAr: step.textAr,
					ownerRole: step.ownerRole ?? "",
					duration: step.duration ?? "",
					note: step.note ?? "",
					critical: step.critical,
					required: step.required,
					responseType: step.responseType,
				})),
			})) ?? [emptySection()],
		);
	}, [open, resolved, serviceName]);

	const patchSection = (index: number, patch: Partial<DraftSection>) => {
		setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
	};

	const patchStep = (sectionIndex: number, stepIndex: number, patch: Partial<DraftStep>) => {
		setSections((prev) =>
			prev.map((section, i) =>
				i === sectionIndex
					? {
							...section,
							steps: section.steps.map((step, j) =>
								j === stepIndex ? { ...step, ...patch } : step,
							),
						}
					: section,
			),
		);
	};

	// المسودة تُنظَّف قبل الحفظ — المرحلة بلا عنوان أو بلا خطوة نصّية تُسقط
	const cleaned = sections
		.map((section) => ({
			titleAr: section.titleAr.trim(),
			steps: section.steps.filter((step) => step.textAr.trim()),
		}))
		.filter((section) => section.titleAr && section.steps.length > 0);

	const canSave = titleAr.trim().length > 0 && cleaned.length > 0;

	const save = () => {
		void saveSop({
			domain,
			serviceId,
			titleAr: titleAr.trim(),
			titleEn: null,
			reference: reference.trim() || null,
			sections: cleaned.map((section) => ({
				titleAr: section.titleAr,
				titleEn: null,
				steps: section.steps.map((step) => ({
					textAr: step.textAr.trim(),
					textEn: null,
					ownerRole: step.ownerRole.trim() || null,
					duration: step.duration.trim() || null,
					note: step.note.trim() || null,
					critical: step.critical,
					required: step.required,
					responseType: step.responseType,
				})),
			})),
		})
			.then(() => onOpenChange(false))
			.catch(() => {});
	};

	const stepCount = cleaned.reduce((sum, section) => sum + section.steps.length, 0);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-h-[88vh] w-full min-w-[800px] gap-0 p-0"
			>
				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<DialogTitle className="text-base font-bold">
						تحرير بروتوكول — {serviceName}
					</DialogTitle>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-8"
						onClick={() => onOpenChange(false)}
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<div className="flex max-h-[68vh] flex-col gap-3 overflow-y-auto p-4">
					<p className="text-[11px] text-muted-foreground">
						الحفظ ينشئ نسخة جديدة برقم أعلى وتُعطَّل السابقة — الطلبات التي شغّلت البروتوكول سابقًا
						تحتفظ بلقطتها كما هي.
					</p>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Input
							className="h-8 flex-1 text-xs"
							placeholder="عنوان البروتوكول"
							value={titleAr}
							onChange={(e) => setTitleAr(e.target.value)}
						/>
						<Input
							className="h-8 flex-1 text-xs"
							placeholder="المرجع (اختياري)"
							value={reference}
							onChange={(e) => setReference(e.target.value)}
						/>
					</div>

					{sections.map((section, sectionIndex) => (
						<div
							key={sectionIndex}
							className="flex flex-col gap-2 rounded-md border p-2"
						>
							<div className="flex items-center gap-1.5">
								<Input
									className="h-8 flex-1 text-xs font-semibold"
									placeholder="عنوان المرحلة (مثال: تجهيز العينة)"
									value={section.titleAr}
									onChange={(e) => patchSection(sectionIndex, { titleAr: e.target.value })}
								/>
								<Button
									type="button"
									size="icon"
									variant="ghost"
									className="size-7 text-red-600 hover:text-red-600"
									disabled={sections.length <= 1}
									aria-label="حذف المرحلة"
									onClick={() =>
										setSections((prev) => prev.filter((_, i) => i !== sectionIndex))
									}
								>
									<IconTrash className="size-3.5" />
								</Button>
							</div>

							{section.steps.map((step, stepIndex) => (
								<div
									key={stepIndex}
									className="flex flex-col gap-1.5 rounded-[4px] border bg-muted/20 p-1.5"
								>
									<div className="flex items-center gap-1.5">
										<Input
											className="h-8 flex-1 text-xs"
											placeholder="نص الخطوة"
											value={step.textAr}
											onChange={(e) =>
												patchStep(sectionIndex, stepIndex, { textAr: e.target.value })
											}
										/>
										<Button
											type="button"
											size="icon"
											variant="ghost"
											className="size-7 text-red-600 hover:text-red-600"
											disabled={section.steps.length <= 1}
											aria-label="حذف الخطوة"
											onClick={() =>
												patchSection(sectionIndex, {
													steps: section.steps.filter((_, j) => j !== stepIndex),
												})
											}
										>
											<IconTrash className="size-3.5" />
										</Button>
									</div>

									<div className="flex flex-wrap items-center gap-1.5">
										<Input
											className="h-7 w-32 text-[11px]"
											placeholder="الجهة المنفّذة"
											value={step.ownerRole}
											onChange={(e) =>
												patchStep(sectionIndex, stepIndex, {
													ownerRole: e.target.value,
												})
											}
										/>
										<Input
											className="h-7 w-24 text-[11px]"
											placeholder="الزمن"
											value={step.duration}
											onChange={(e) =>
												patchStep(sectionIndex, stepIndex, { duration: e.target.value })
											}
										/>
										<Select
											value={step.responseType}
											onValueChange={(v) =>
												patchStep(sectionIndex, stepIndex, {
													responseType: v as ChecklistResponseType,
												})
											}
										>
											<SelectTrigger
												size="sm"
												dir="rtl"
												className="w-32"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir="rtl"
											>
												{(Object.keys(RESPONSE_TYPE_LABELS) as ChecklistResponseType[]).map(
													(type) => (
														<SelectItem
															key={type}
															value={type}
														>
															{RESPONSE_TYPE_LABELS[type]}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
										<label
											htmlFor={`sop-critical-${sectionIndex}-${stepIndex}`}
											className="flex cursor-pointer items-center gap-1.5 text-[11px]"
										>
											<Checkbox
												id={`sop-critical-${sectionIndex}-${stepIndex}`}
												checked={step.critical}
												onCheckedChange={(v) =>
													patchStep(sectionIndex, stepIndex, { critical: v === true })
												}
											/>
											حرجة
										</label>
										<label
											htmlFor={`sop-required-${sectionIndex}-${stepIndex}`}
											className="flex cursor-pointer items-center gap-1.5 text-[11px]"
										>
											<Checkbox
												id={`sop-required-${sectionIndex}-${stepIndex}`}
												checked={step.required}
												onCheckedChange={(v) =>
													patchStep(sectionIndex, stepIndex, { required: v === true })
												}
											/>
											إلزامية
										</label>
										<Input
											className="h-7 min-w-40 flex-1 text-[11px]"
											placeholder="ملاحظة (اختياري)"
											value={step.note}
											onChange={(e) =>
												patchStep(sectionIndex, stepIndex, { note: e.target.value })
											}
										/>
									</div>
								</div>
							))}

							<Button
								type="button"
								size="sm"
								variant="outline"
								className="self-start"
								onClick={() =>
									patchSection(sectionIndex, { steps: [...section.steps, emptyStep()] })
								}
							>
								<IconPlus className="size-3.5" />
								خطوة جديدة
							</Button>
						</div>
					))}

					<Button
						type="button"
						size="sm"
						variant="outline"
						className="self-start"
						onClick={() => setSections((prev) => [...prev, emptySection()])}
					>
						<IconPlus className="size-3.5" />
						مرحلة جديدة
					</Button>
				</div>

				<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							size="sm"
							disabled={isPending || !canSave}
							onClick={save}
						>
							حفظ نسخة جديدة
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
					<span className="text-[11px] tabular-nums text-muted-foreground">
						{cleaned.length} مرحلة · {stepCount} خطوة
					</span>
				</div>
			</DialogContent>
		</Dialog>
	);
}

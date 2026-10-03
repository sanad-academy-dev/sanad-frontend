import { IconGripVertical, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSaveChecklistTemplate } from "@/features/services/operations/hooks/use-operation-procedures";
import type { ChecklistResponseType, ChecklistScope } from "@/generated/prisma/enums";
import type { ChecklistTemplateResponse } from "@/server/operation-procedures/operation-procedures.type";

// محرر نسخة أكاديمية من قالب قائمة تحقق (OP8) — الحفظ نسخة جديدة دائمًا:
// تشغيلات الحالات التقطت نسختها وقت التنفيذ فلا يمسّ التحرير تاريخًا (S1، S21).

const RESPONSE_TYPE_LABELS: Record<ChecklistResponseType, string> = {
	CONFIRM: "تأكيد",
	YES_NO_NA: "نعم/لا/لا ينطبق",
	TEXT: "نص",
	NUMBER: "رقم",
};

type DraftItem = {
	textAr: string;
	responseType: ChecklistResponseType;
	required: boolean;
};

export function ChecklistTemplateEditorDialog({
	scope,
	scopeLabel,
	baseTemplate,
	open,
	onOpenChange,
}: {
	scope: ChecklistScope;
	scopeLabel: string;
	baseTemplate: ChecklistTemplateResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { saveTemplate, isPending } = useSaveChecklistTemplate();
	const [items, setItems] = useState<DraftItem[]>([]);

	// المسودة تبدأ من القالب الفعّال الحالي — نظامًا كان أو نسخة أكاديمية
	useEffect(() => {
		if (!open) return;
		setItems(
			baseTemplate?.items.map((item) => ({
				textAr: item.textAr,
				responseType: item.responseType,
				required: item.required,
			})) ?? [{ textAr: "", responseType: "CONFIRM", required: true }],
		);
	}, [open, baseTemplate]);

	const updateItem = (index: number, patch: Partial<DraftItem>) => {
		setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
	};

	const validItems = items.filter((item) => item.textAr.trim());

	const save = () => {
		void saveTemplate({
			scope,
			tier: scope === "OPERATION_MINOR_COMBINED" ? "MINOR" : null,
			nameAr: baseTemplate?.nameAr ?? scopeLabel,
			nameEn: baseTemplate?.nameEn ?? null,
			items: validItems.map((item) => ({
				textAr: item.textAr.trim(),
				required: item.required,
				responseType: item.responseType,
			})),
		})
			.then(() => onOpenChange(false))
			.catch(() => {});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-h-[85vh] w-full max-w-lg gap-0 p-0"
			>
				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<DialogTitle className="text-base font-bold">
						تحرير نسخة أكاديمية — {scopeLabel}
					</DialogTitle>
					<Button
						size="icon"
						variant="ghost"
						className="size-8"
						onClick={() => onOpenChange(false)}
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<div className="flex max-h-[60vh] flex-col gap-1.5 overflow-y-auto p-4">
					<p className="mb-1 text-[11px] text-muted-foreground">
						الحفظ ينشئ نسخة جديدة برقم أعلى وتُعطَّل السابقة — الحالات التي شغّلت القائمة سابقًا
						تحتفظ بنسختها كما هي.
					</p>
					{items.map((item, index) => (
						<div
							key={index}
							className="flex items-center gap-1.5 rounded-md border p-1.5"
						>
							<IconGripVertical className="size-3.5 shrink-0 text-muted-foreground/50" />
							<Input
								className="h-8 flex-1 text-xs"
								placeholder="نص البند"
								value={item.textAr}
								onChange={(e) => updateItem(index, { textAr: e.target.value })}
							/>
							<Select
								value={item.responseType}
								onValueChange={(v) =>
									updateItem(index, { responseType: v as ChecklistResponseType })
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
							<Button
								size="icon"
								variant="ghost"
								className="size-7 text-red-600 hover:text-red-600"
								disabled={items.length <= 1}
								onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
							>
								<IconTrash className="size-3.5" />
							</Button>
						</div>
					))}
					<Button
						size="sm"
						variant="outline"
						className="self-start"
						onClick={() =>
							setItems((prev) => [
								...prev,
								{ textAr: "", responseType: "CONFIRM", required: true },
							])
						}
					>
						<IconPlus className="size-3.5" />
						بند جديد
					</Button>
				</div>

				<div className="flex items-center justify-start gap-2 border-t px-4 py-2">
					<Button
						size="sm"
						disabled={isPending || validItems.length === 0}
						onClick={save}
					>
						حفظ نسخة جديدة
					</Button>
					<Button
						size="sm"
						variant="outline"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

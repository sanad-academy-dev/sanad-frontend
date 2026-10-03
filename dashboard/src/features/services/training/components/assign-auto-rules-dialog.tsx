import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useStaffRoles } from "@/features/settings/roles-permissions/hooks/use-staff-roles";
import { useSpecializationsTree } from "@/features/settings/specializations/hooks/use-specializations-tree";
import type {
	AutoAssignEntity,
	AutoAssignRuleFormInput,
	AutoAssignRuleResponse,
} from "@/server/course-assignments/course-assignments.type";

const ALL = "__ALL__"; // «الكل» → entityId = null

const ENTITY_OPTIONS: { value: AutoAssignEntity; label: string }[] = [
	{ value: "BRANCH", label: "الفرع" },
	{ value: "ROLE", label: "القسم" },
	{ value: "SPECIALIZATION", label: "المجموعة" },
];

type RuleRow = { entityType: AutoAssignEntity; entityId: string | null };

// نافذة قواعد التعيين التلقائي — نفس دلالات المعالج المُركَن لكن برموز التطبيق الافتراضية.
export function AssignAutoRulesDialog({
	open,
	onOpenChange,
	rules,
	onSave,
	isSaving,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	rules: AutoAssignRuleResponse[];
	onSave: (rules: AutoAssignRuleFormInput[]) => void;
	isSaving?: boolean;
}) {
	const { branches } = useBranches();
	const { roles } = useStaffRoles();
	const { tree } = useSpecializationsTree();
	const [rows, setRows] = useState<RuleRow[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: إعادة التعبئة عند الفتح فقط
	useEffect(() => {
		if (open) setRows(rules.map((r) => ({ entityType: r.entityType, entityId: r.entityId })));
	}, [open]);

	const specializations = tree.flatMap((cat) => [
		{ id: cat.id, name: cat.name },
		...cat.children.map((c) => ({ id: c.id, name: c.name })),
	]);

	const optionsFor = (type: AutoAssignEntity): { id: string; name: string }[] => {
		if (type === "BRANCH") return branches.map((b) => ({ id: b.id, name: b.name }));
		if (type === "ROLE") return roles.map((r) => ({ id: r.id, name: r.name }));
		return specializations;
	};

	const setRow = (i: number, patch: Partial<RuleRow>) =>
		setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
	const addRow = () => setRows((prev) => [...prev, { entityType: "BRANCH", entityId: null }]);
	const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-w-[560px]"
			>
				<DialogHeader className="text-start">
					<DialogTitle>التعيين التلقائي</DialogTitle>
					<DialogDescription>
						إذا تحققت أي من هذه القواعد، ينضم الموظف للدورة تلقائيًا عند إضافته أو نقله.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2.5">
					{rows.length === 0 && (
						<p className="rounded-md bg-muted py-4 text-center text-xs text-muted-foreground">
							لا توجد قواعد بعد. أضف قاعدة لبدء التعيين التلقائي.
						</p>
					)}
					{rows.map((row, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: صفوف مطابقة الترتيب قابلة للحذف بالفهرس
						<div
							key={i}
							className="flex items-center gap-2"
						>
							<span className="shrink-0 text-xs text-muted-foreground">
								عند إضافة الموظف إلى
							</span>
							<Select
								dir="rtl"
								value={row.entityType}
								onValueChange={(v) =>
									setRow(i, { entityType: v as AutoAssignEntity, entityId: null })
								}
							>
								<SelectTrigger className="h-9! w-[110px] text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ENTITY_OPTIONS.map((o) => (
										<SelectItem
											key={o.value}
											value={o.value}
										>
											{o.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span className="shrink-0 text-xs text-muted-foreground">=</span>
							<Select
								dir="rtl"
								value={row.entityId ?? ALL}
								onValueChange={(v) => setRow(i, { entityId: v === ALL ? null : v })}
							>
								<SelectTrigger className="h-9! min-w-0 flex-1 text-xs">
									<SelectValue placeholder="اختر..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ALL}>الكل</SelectItem>
									{optionsFor(row.entityType).map((o) => (
										<SelectItem
											key={o.id}
											value={o.id}
										>
											{o.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<button
								type="button"
								onClick={() => removeRow(i)}
								aria-label="حذف القاعدة"
								className="shrink-0 text-muted-foreground hover:text-destructive"
							>
								<IconTrash className="size-4" />
							</button>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addRow}
						className="h-8 w-fit gap-1.5 text-xs"
					>
						<IconPlus className="size-4" />
						إضافة قاعدة
					</Button>
				</div>

				<DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
					<Button
						type="button"
						onClick={() =>
							onSave(rows.map((r) => ({ entityType: r.entityType, entityId: r.entityId })))
						}
						disabled={isSaving}
						className="h-9 text-[13px] font-semibold"
					>
						{isSaving ? "جارٍ الحفظ..." : "حفظ"}
					</Button>
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						className="h-9 text-[13px]"
					>
						إلغاء
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

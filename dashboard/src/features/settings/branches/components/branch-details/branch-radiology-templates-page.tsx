import { IconFileText, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useAllRadiologyTemplates,
	useRadiologyTemplateMutations,
} from "@/features/services/radiology/hooks/use-radiology-extras";
import { useRadiologyTemplates } from "@/features/services/radiology/hooks/use-radiology-templates";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { RadiologyModality } from "@/generated/prisma/enums";
import type {
	RadiologyTemplateFormValues,
	RadiologyTemplateResponse,
} from "@/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// قوالب تقارير الأشعة: نصّ جاهز يملأ أقسام التقرير بنقرة. القالب يُربط بفحص
// بعينه أو بطريقة تصوير كاملة — لا قالب بلا نطاق، وإلا ظهر في كل مكان.

const SECTIONS: {
	key: "technique" | "comparison" | "findings" | "impression" | "recommendations";
	label: string;
	rows: number;
}[] = [
	{ key: "technique", label: "التقنية", rows: 2 },
	{ key: "comparison", label: "المقارنة", rows: 1 },
	{ key: "findings", label: "الموجودات", rows: 5 },
	{ key: "impression", label: "الانطباع", rows: 3 },
	{ key: "recommendations", label: "التوصيات", rows: 2 },
];

const SCOPE_MODALITY = "__modality__";

const emptyDraft = (): RadiologyTemplateFormValues & { id?: string } => ({
	name: "",
	modality: RadiologyModality.XRAY,
	serviceId: null,
	technique: null,
	comparison: null,
	findings: null,
	impression: null,
	recommendations: null,
	isDefault: false,
	active: true,
});

export function BranchRadiologyTemplatesPage({ branchId }: { branchId: string }) {
	const { branch, isLoading: branchLoading } = useBranch(branchId);
	const { templates, isLoading } = useAllRadiologyTemplates();
	const { templates: examTemplates } = useRadiologyTemplates();
	const { saveTemplate, removeTemplate, isPending } = useRadiologyTemplateMutations();

	const [editing, setEditing] = useState<
		(RadiologyTemplateFormValues & { id?: string }) | null
	>(null);

	if (branchLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const scopeLabel = (tpl: RadiologyTemplateResponse) =>
		tpl.service?.name ??
		(tpl.modality ? `كل فحوصات ${MODALITY_META[tpl.modality].label}` : "بلا نطاق");

	const openEdit = (tpl: RadiologyTemplateResponse) =>
		setEditing({
			id: tpl.id,
			name: tpl.name,
			modality: tpl.modality,
			serviceId: tpl.serviceId,
			technique: tpl.technique,
			comparison: tpl.comparison,
			findings: tpl.findings,
			impression: tpl.impression,
			recommendations: tpl.recommendations,
			isDefault: tpl.isDefault,
			active: tpl.active,
		});

	const submit = async () => {
		if (!editing?.name.trim()) return;
		try {
			await saveTemplate(editing);
		} catch {
			return;
		}
		setEditing(null);
	};

	// نطاق القالب: فحص بعينه أو طريقة تصوير — لا كلاهما
	const scopeValue = editing?.serviceId ?? SCOPE_MODALITY;

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الأشعة"
			sectionTo="/management/settings/branch/$branchId/radiology"
			subSection="قوالب التقارير"
		>
			<SectionHeading
				title="قوالب التقارير"
				description="نصوص جاهزة تملأ أقسام التقرير بنقرة — تُختصر بها كتابة الدراسات الطبيعية المتكرّرة."
			/>

			<SettingsCard>
				{isLoading ? (
					<Skeleton className="h-24 w-full rounded-[4px]" />
				) : templates.length === 0 ? (
					<p className="py-4 text-[11px] text-muted-foreground">
						لا توجد قوالب بعد — أضف قالبًا للدراسة الطبيعية الأكثر تكرارًا لديك.
					</p>
				) : (
					templates.map((tpl) => (
						<SettingRow
							key={tpl.id}
							icon={<IconFileText className="size-4" />}
							title={tpl.name}
							description={scopeLabel(tpl)}
							status={
								<div className="flex items-center gap-1.5">
									{tpl.isDefault && (
										<Badge
											variant="outline"
											className="rounded-sm text-[10px]"
										>
											افتراضي
										</Badge>
									)}
									{!tpl.active && (
										<Badge
											variant="outline"
											className="rounded-sm text-[10px] text-muted-foreground"
										>
											معطّل
										</Badge>
									)}
								</div>
							}
							trailing={
								<>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-7 text-[11px]"
										onClick={() => openEdit(tpl)}
									>
										تعديل
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										aria-label={`حذف قالب ${tpl.name}`}
										disabled={isPending}
										onClick={() => void removeTemplate(tpl.id)}
										className="size-7 rounded-lg p-0 text-muted-foreground hover:text-red-600"
									>
										<IconTrash className="size-3.5" />
									</Button>
								</>
							}
						/>
					))
				)}

				<div className="flex justify-start py-3">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setEditing(emptyDraft())}
						className="h-7 gap-1.5 rounded-lg px-2.5 text-[11px]"
					>
						<IconPlus className="size-3.5" />
						إضافة قالب
					</Button>
				</div>
			</SettingsCard>

			<Dialog
				open={!!editing}
				onOpenChange={(open) => {
					if (!open) setEditing(null);
				}}
			>
				<DialogContent
					className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
					dir="rtl"
				>
					<div className="flex flex-col gap-0.5 border-b px-4 py-2 pe-10">
						<DialogTitle className="text-sm font-semibold">
							{editing?.id ? "تعديل القالب" : "قالب تقرير جديد"}
						</DialogTitle>
						<DialogDescription className="text-xs">
							اترك أي قسم فارغًا ليتخطّاه القالب — التطبيق يملأ الأقسام الفارغة فقط ولا يمحو ما
							كُتب.
						</DialogDescription>
					</div>

					{editing && (
						<div className="flex max-h-[68vh] flex-col gap-3 overflow-y-auto px-4 py-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<Label
										htmlFor="tpl-name"
										className="text-xs font-semibold"
									>
										اسم القالب
									</Label>
									<Input
										id="tpl-name"
										value={editing.name}
										disabled={isPending}
										placeholder="مثال: صدر طبيعي"
										onChange={(e) =>
											setEditing((prev) => prev && { ...prev, name: e.target.value })
										}
										className="text-sm"
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs font-semibold">النطاق</Label>
									<Select
										value={scopeValue}
										disabled={isPending}
										dir="rtl"
										onValueChange={(value) =>
											setEditing(
												(prev) =>
													prev && {
														...prev,
														serviceId: value === SCOPE_MODALITY ? null : value,
													},
											)
										}
									>
										<SelectTrigger
											size="sm"
											aria-label="نطاق القالب"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
										>
											<SelectItem value={SCOPE_MODALITY}>طريقة تصوير كاملة</SelectItem>
											{examTemplates.map((exam) => (
												<SelectItem
													key={exam.serviceId}
													value={exam.serviceId}
												>
													{exam.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* طريقة التصوير تُسأل حين يكون النطاق طريقةً لا فحصًا بعينه */}
							{!editing.serviceId && (
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs font-semibold">طريقة التصوير</Label>
									<Select
										value={editing.modality ?? RadiologyModality.XRAY}
										disabled={isPending}
										dir="rtl"
										onValueChange={(value) =>
											setEditing(
												(prev) => prev && { ...prev, modality: value as RadiologyModality },
											)
										}
									>
										<SelectTrigger
											size="sm"
											aria-label="طريقة التصوير"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
										>
											{Object.values(RadiologyModality).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{MODALITY_META[value].label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							{SECTIONS.map(({ key, label, rows }) => (
								<div
									key={key}
									className="flex flex-col gap-1.5"
								>
									<Label className="text-xs font-semibold">{label}</Label>
									<Textarea
										rows={rows}
										value={editing[key] ?? ""}
										disabled={isPending}
										onChange={(e) =>
											setEditing((prev) => prev && { ...prev, [key]: e.target.value })
										}
										className="text-sm"
									/>
								</div>
							))}

							<div className="flex items-center justify-between gap-3 rounded-[4px] border p-2.5">
								<div className="flex flex-col">
									<span className="text-xs font-semibold">القالب الافتراضي</span>
									<span className="text-[11px] text-muted-foreground">
										يُقترح أولًا في محرّر التقرير — واحد لكل نطاق.
									</span>
								</div>
								<Switch
									checked={editing.isDefault}
									disabled={isPending}
									onCheckedChange={(checked) =>
										setEditing((prev) => prev && { ...prev, isDefault: checked })
									}
									aria-label="القالب الافتراضي"
								/>
							</div>

							<div className="flex items-center justify-between gap-3 rounded-[4px] border p-2.5">
								<span className="text-xs font-semibold">مُفعّل</span>
								<Switch
									checked={editing.active}
									disabled={isPending}
									onCheckedChange={(checked) =>
										setEditing((prev) => prev && { ...prev, active: checked })
									}
									aria-label="تفعيل القالب"
								/>
							</div>
						</div>
					)}

					<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isPending}
							onClick={() => setEditing(null)}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={isPending || !editing?.name.trim()}
							onClick={() => void submit()}
						>
							حفظ
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}

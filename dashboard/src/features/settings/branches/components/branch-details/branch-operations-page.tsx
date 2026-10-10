import {
	IconChecklist,
	IconClipboardCheck,
	IconCreditCard,
	IconListNumbers,
	IconPencil,
	IconScissors,
} from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useOperationChecklistTemplates } from "@/features/services/operations/hooks/use-operation-procedures";
import {
	BranchDetailsShell,
	NavRow,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { ChecklistTemplateEditorDialog } from "@/features/settings/operation-procedures/components/checklist-template-editor-dialog";
import { useProtocols } from "@/features/settings/protocols/hooks/use-protocols";
import { useUpdateProtocols } from "@/features/settings/protocols/hooks/use-update-protocols";
import type { ChecklistScope } from "@/generated/prisma/enums";

const SCOPE_LABELS: Record<ChecklistScope, string> = {
	OPERATION_SIGN_IN: "قائمة الدخول (Sign-In)",
	OPERATION_TIME_OUT: "الوقفة الآمنة (Time-Out)",
	OPERATION_SIGN_OUT: "قائمة الخروج (Sign-Out)",
	OPERATION_MINOR_COMBINED: "قائمة الإجراءات الصغرى",
};

export function BranchOperationsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { protocols, isLoading: protocolsLoading } = useProtocols();
	const { updateProtocols, isPending } = useUpdateProtocols();
	const { checklists } = useOperationChecklistTemplates();
	const [editingScope, setEditingScope] = useState<ChecklistScope | null>(null);
	const [scoreDraft, setScoreDraft] = useState<string | null>(null);

	if (isLoading || !branch || protocolsLoading) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const recoveryScoreMin = protocols?.operationRecoveryScoreMin ?? 8;

	// أحدث قالب فعّال لكل نطاق — قالب الأكاديمية يسبق قالب النظام
	const latestByScope = (scope: ChecklistScope) => {
		const candidates = checklists.filter((t) => t.scope === scope);
		return candidates.find((t) => t.clinicId !== null) ?? candidates.find(() => true) ?? null;
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="العمليات الجراحية"
		>
			<SectionHeading
				title="العمليات الجراحية"
				description="بوابات الأمان وقوائم التحقق وكتالوج الإجراءات. الإعدادات على مستوى المنشأة وتشترك فيها كل الفروع."
			/>

			<SettingsCard>
				<NavRow
					icon={<IconScissors className="size-4" />}
					title="كتالوج الإجراءات"
					description="قائمة الإجراءات وأسعارها وتعريفاتها (درجة التعقيد والتخدير والعدة)."
					to="/management/settings/branch/$branchId/operations/catalog"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconChecklist className="size-4" />}
					title="بروتوكولات العمل القياسية"
					description="خطوات تنفيذ كل إجراء — تكمّل قوائم التحقق الجراحية ولا تحل محلها."
					to="/management/settings/branch/$branchId/sops"
					params={{ branchId: branch.id }}
				/>
			</SettingsCard>

			{/* بوابات الأمان — تجاوزات الأكاديمية على المسار (الخطة §3.2) */}
			<div className="flex flex-col gap-2.5">
				<SectionHeading title="بوابات الأمان" />
				<SettingsCard>
					<SettingRow
						icon={<IconCreditCard className="size-4" />}
						title="بوابة السداد (G10)"
						description="سداد فاتورة العملية كاملةً شرط مغادرة «مجدولة» — للحالات الاختيارية. الفورية تتجاوز دائمًا."
						trailing={
							<Switch
								checked={protocols?.operationPaymentGate ?? false}
								disabled={isPending}
								onCheckedChange={(checked) =>
									void updateProtocols({ operationPaymentGate: checked })
								}
								aria-label="بوابة السداد"
							/>
						}
					/>
					<SettingRow
						icon={<IconListNumbers className="size-4" />}
						title="العدّ الجراحي للإجراءات الصغرى (D7)"
						description="إلزام قائمة الخروج (العدّ والعينات) حتى للإجراءات الصغرى."
						trailing={
							<Switch
								checked={protocols?.operationCountsForMinor ?? false}
								disabled={isPending}
								onCheckedChange={(checked) =>
									void updateProtocols({ operationCountsForMinor: checked })
								}
								aria-label="العدّ للإجراءات الصغرى"
							/>
						}
					/>
					<SettingRow
						icon={<IconClipboardCheck className="size-4" />}
						title="حد درجة الإفاقة للخروج (G8)"
						description="أدنى درجة (نمط Aldrete على 10) تسمح بمغادرة الإفاقة. المعيار البشري ≥9 والبيطري الشائع ≥8."
						trailing={
							<Input
								type="number"
								min={0}
								max={10}
								className="h-8 w-20 text-center tabular-nums"
								value={scoreDraft ?? String(recoveryScoreMin)}
								disabled={isPending}
								onChange={(e) => setScoreDraft(e.target.value)}
								onBlur={() => {
									const parsed = Number(scoreDraft);
									setScoreDraft(null);
									if (
										scoreDraft !== null &&
										Number.isInteger(parsed) &&
										parsed >= 0 &&
										parsed <= 10 &&
										parsed !== recoveryScoreMin
									) {
										void updateProtocols({ operationRecoveryScoreMin: parsed });
									}
								}}
								aria-label="حد درجة الإفاقة"
							/>
						}
					/>
				</SettingsCard>
			</div>

			{/* قوالب قوائم التحقق (WHO) */}
			<div className="flex flex-col gap-2.5">
				<SectionHeading
					title="قوائم التحقق الجراحية"
					description="كل تعديل يحفظ نسخة جديدة — الحالات السابقة تحتفظ بنسختها وقت التنفيذ."
				/>
				<SettingsCard>
					{(Object.keys(SCOPE_LABELS) as ChecklistScope[]).map((scope) => {
						const template = latestByScope(scope);
						return (
							<SettingRow
								key={scope}
								icon={<IconClipboardCheck className="size-4" />}
								title={SCOPE_LABELS[scope]}
								description={
									template
										? `${template.items.length} بنود — النسخة ${template.version}`
										: "لا قالب فعّالًا"
								}
								status={
									template ? (
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{template.clinicId ? "نسخة الأكاديمية" : "قالب النظام (WHO)"}
										</Badge>
									) : undefined
								}
								trailing={
									<Button
										size="sm"
										variant="outline"
										className="h-7 gap-1 text-[11px]"
										onClick={() => setEditingScope(scope)}
									>
										<IconPencil className="size-3.5" />
										تحرير نسخة أكاديمية
									</Button>
								}
							/>
						);
					})}
				</SettingsCard>
			</div>

			{editingScope && (
				<ChecklistTemplateEditorDialog
					scope={editingScope}
					scopeLabel={SCOPE_LABELS[editingScope]}
					baseTemplate={latestByScope(editingScope)}
					open={editingScope !== null}
					onOpenChange={(open) => {
						if (!open) setEditingScope(null);
					}}
				/>
			)}
		</BranchDetailsShell>
	);
}

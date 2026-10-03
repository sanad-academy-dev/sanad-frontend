import { IconArrowsExchange } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { MovementSheet } from "@/features/inventory/components/stock/movement-sheet";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
	UserMultiPicker,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useBranchWarehouseState } from "@/features/settings/branches/hooks/use-branch-warehouse-state";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import { useI18n } from "@/hooks/use-i18n";
import type { BranchSettings } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

const COUNT_INTERVALS = [
	{ value: "WEEKLY", label: "كل أسبوع" },
	{ value: "MONTHLY", label: "كل شهر" },
	{ value: "QUARTERLY", label: "كل ربع سنة" },
] as const;

export function BranchWarehousePage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);
	const { setWarehouseEnabled, isPending: warehousePending } =
		useBranchWarehouseState(branchId);
	const { users } = useClinicUsers();
	const { isRtl: isArabic } = useI18n();
	const [transferOpen, setTransferOpen] = useState(false);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const settings = parseBranchSettings(branch.settings);
	const warehouseEnabled = branch.warehouses.some((w) => w.active);

	const update = (patch: Partial<BranchSettings["warehouse"]>) =>
		updateSettings({ ...settings, warehouse: { ...settings.warehouse, ...patch } });

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="المستودع"
		>
			<SectionHeading
				title="المستودع"
				description="إدارة مخزون وأدوية ومستلزمات الفرع بشكل مستقل."
			/>
			<SettingsCard>
				<SettingRow
					title="تفعيل المستودع لهذا الفرع"
					description="المنتجات والمستلزمات والأدوية المضافة لهذا الفرع من الموردين الخارجيين التي تدخل لهذا الفرع"
					trailing={
						<Switch
							checked={warehouseEnabled}
							disabled={warehousePending}
							onCheckedChange={(checked) => setWarehouseEnabled(checked)}
							aria-label="تفعيل المستودع لهذا الفرع"
						/>
					}
				/>
				<SettingRow
					title="طلبات الشراء"
					description="يمكن إنشاء طلب شراء"
					trailing={
						<Switch
							checked={settings.warehouse.purchaseOrders}
							disabled={isPending}
							onCheckedChange={(checked) => update({ purchaseOrders: checked })}
							aria-label="طلبات الشراء"
						/>
					}
				/>
				<SettingRow
					title="نقل بين الفروع"
					description="يمكن نقل الأدوية والمستلزمات بين الفروع"
					trailing={
						<div className="flex items-center gap-2">
							{settings.warehouse.interBranchTransfer && warehouseEnabled && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setTransferOpen(true)}
									className="h-7 gap-1.5 rounded-lg px-2.5 text-[11px]"
								>
									<IconArrowsExchange className="size-3.5" />
									نقل مخزون
								</Button>
							)}
							<Switch
								checked={settings.warehouse.interBranchTransfer}
								disabled={isPending}
								onCheckedChange={(checked) => update({ interBranchTransfer: checked })}
								aria-label="نقل بين الفروع"
							/>
						</div>
					}
				/>
				<SettingRow
					title="الجرد الدوري"
					description="جدولة جرد دوري لمخزون هذا الفرع"
					trailing={
						<div className="flex items-center gap-2">
							{settings.warehouse.periodicCount && (
								<Select
									value={settings.warehouse.periodicCountInterval}
									onValueChange={(value) =>
										update({
											periodicCountInterval:
												value as BranchSettings["warehouse"]["periodicCountInterval"],
										})
									}
									disabled={isPending}
									dir={isArabic ? "rtl" : "ltr"}
								>
									<SelectTrigger
										size="sm"
										className="h-7 w-28 rounded-lg px-2 text-[11px]"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir={isArabic ? "rtl" : "ltr"}>
										{COUNT_INTERVALS.map((interval) => (
											<SelectItem
												key={interval.value}
												value={interval.value}
											>
												{interval.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<Switch
								checked={settings.warehouse.periodicCount}
								disabled={isPending}
								onCheckedChange={(checked) => update({ periodicCount: checked })}
								aria-label="الجرد الدوري"
							/>
						</div>
					}
				/>
				<SettingRow
					title="تنبيهات المخزون"
					description="تمكن تفعيل تنبيهات المستودع لهذا الفرع"
					trailing={
						<Switch
							checked={settings.warehouse.stockAlerts}
							disabled={isPending}
							onCheckedChange={(checked) => update({ stockAlerts: checked })}
							aria-label="تنبيهات المخزون"
						/>
					}
				/>
			</SettingsCard>

			<SectionHeading
				title="مسؤولية المستودع"
				description="حدد كيفية التعامل مع المنتجات والموافقات على الطلبات الواردة وأوامر الشراء في المستودع"
			/>
			<SettingsCard>
				<SettingRow
					title="الإجراء"
					description="عند إنشاء طلب شراء جديد إلى المستودع من يقوم بالموافقة، قم باتخاذ الإجراء التالي"
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.warehouse.purchaseResponsibleIds}
							onChange={(ids) => update({ purchaseResponsibleIds: ids })}
							disabled={isPending}
						/>
					}
				/>
				<SettingRow
					title="الإجراء"
					description="عند إدخال طلب وارد جديد إلى المستودع من يقوم بالموافقة، قم باتخاذ الإجراء التالي"
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.warehouse.receiveResponsibleIds}
							onChange={(ids) => update({ receiveResponsibleIds: ids })}
							disabled={isPending}
						/>
					}
				/>
			</SettingsCard>

			{/* نموذج التحويل مسبق الضبط: نقل من مستودع هذا الفرع إلى مستودع آخر */}
			<MovementSheet
				open={transferOpen}
				onClose={() => setTransferOpen(false)}
				initialType="TRANSFER"
				initialFromWarehouseId={branch.warehouses.find((w) => w.active)?.id}
			/>
		</BranchDetailsShell>
	);
}

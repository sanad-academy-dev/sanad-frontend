import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DimensionSheet } from "@/features/accounting/governance/components/dimension-sheet";
import { useAccountingDimensions } from "@/features/accounting/governance/hooks/use-accounting-dimensions";
import {
	useAccountsSettings,
	useUpdateAccountsSettings,
} from "@/features/accounting/settings/hooks/use-accounts-settings";
import type { AccountingDimensionResponse } from "@/server/accounting/accounting-dimension/accounting-dimension.type";

/**
 * [P11.6] Tab «الأبعاد» (§4.5) — governance config, not a daily screen. The master flag
 * `enable_accounting_dimensions` (§19) is read and written through the EXISTING
 * accounts-settings hooks; the 4 fixed slots render as cards, each editable in a sheet.
 */

const SLOTS = [1, 2, 3, 4] as const;

export const DimensionsTab = () => {
	const { settings, isLoading: settingsLoading } = useAccountsSettings();
	const { updateSettings, isPending: settingsSaving } = useUpdateAccountsSettings();
	const { dimensions, isLoading } = useAccountingDimensions();

	const [sheet, setSheet] = useState<{
		open: boolean;
		slot: number;
		editing: AccountingDimensionResponse | null;
	}>({ open: false, slot: 1, editing: null });

	const bySlot = (slot: number): AccountingDimensionResponse | null =>
		dimensions.find((dimension) => dimension.slot === slot) ?? null;

	return (
		<div className="min-h-0 flex-1 space-y-4 overflow-auto border-t p-4">
			{/* the §19 master switch — without it the dimension columns stay dormant */}
			<div className="flex items-center justify-between rounded-lg border p-3">
				<div>
					<p className="font-medium text-sm">تفعيل الأبعاد المحاسبية</p>
					<p className="text-muted-foreground text-xs">
						يفعّل ختم الأبعاد التحليلية على المستندات وقيود الأستاذ (§19 / §4.5).
					</p>
				</div>
				<Switch
					checked={settings?.enable_accounting_dimensions ?? false}
					onCheckedChange={(next) => updateSettings({ enable_accounting_dimensions: next })}
					disabled={settingsLoading || settingsSaving}
					aria-label="تفعيل الأبعاد المحاسبية"
				/>
			</div>

			{isLoading ? (
				<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{SLOTS.map((slot) => {
						const dimension = bySlot(slot);
						return (
							<Card key={slot}>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">خانة {slot}</span>
										{dimension ? (
											dimension.dimensionName
										) : (
											<span className="font-normal text-muted-foreground">غير مُعرَّف</span>
										)}
									</CardTitle>
									{dimension ? (
										<CardDescription className="flex flex-wrap gap-1">
											{dimension.disabled ? (
												<Badge variant="destructive">معطّل</Badge>
											) : (
												<Badge variant="outline">مُفعّل</Badge>
											)}
											{dimension.mandatoryForBalanceSheet ? (
												<Badge variant="secondary">إلزامي للميزانية</Badge>
											) : null}
											{dimension.mandatoryForProfitAndLoss ? (
												<Badge variant="secondary">إلزامي لقائمة الدخل</Badge>
											) : null}
											{dimension.autoPostBalancingEntry ? (
												<Badge variant="primary">قيد موازنة تلقائي</Badge>
											) : null}
										</CardDescription>
									) : null}
									<CardAction>
										<Button
											variant="ghost"
											size="icon-xs"
											aria-label={dimension ? "تعديل البعد" : "تعريف البعد"}
											onClick={() => setSheet({ open: true, slot, editing: dimension })}
										>
											<IconPencil className="size-4" />
										</Button>
									</CardAction>
								</CardHeader>
								<CardContent className="space-y-1 text-sm">
									{dimension ? (
										<>
											<p>
												<span className="text-muted-foreground">القيمة الافتراضية: </span>
												{dimension.defaultDimensionValue ?? "—"}
											</p>
											<p>
												<span className="text-muted-foreground">حساب الموازنة: </span>
												{dimension.offsettingAccount?.accountName ?? "—"}
											</p>
											<p>
												<span className="text-muted-foreground">الفلتر: </span>
												{dimension.filters[0]
													? `${dimension.filters[0].allowOnly ? "السماح فقط" : "المنع"} — ${dimension.filters[0].accounts.length} حساب / ${dimension.filters[0].values.length} قيمة`
													: "بدون"}
											</p>
										</>
									) : (
										<p className="text-muted-foreground">
											عرّف هذه الخانة لتظهر كعمود تحليلي على القيود.
										</p>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			<DimensionSheet
				open={sheet.open}
				onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
				slot={sheet.slot}
				editing={sheet.editing}
			/>
		</div>
	);
};

import { IconAlertTriangle, IconPackageExport, IconPrinter } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import {
	useDispenseBatches,
	usePharmacyMutations,
	usePharmacySettings,
	usePrescription,
} from "@/features/pharmacy/hooks/use-pharmacy";
import { printDispenseLabel } from "@/features/pharmacy/utils/print-dispense-label";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";

/**
 * [PH12.1] صرف الوصفة — الشاشة التي كانت ناقصة.
 *
 * كان مسار الصرف كاملًا في الخادم منذ [PH3] بلا أي واجهة تستدعيه، فبقيت «الأدوية
 * المصروفة» فارغة أبدًا: لا شيء يمكن أن يُصرف. الطابور كان يعرض الوصفات ونقر الصفّ
 * لا يفعل شيئًا.
 *
 * القرارات هنا تتبع §7: الدفعة **يختارها الصيدلي** لا النظام (الترتيب FEFO اقتراحًا)،
 * والمنتهية تُعرض موسومةً ولا تُصرف، والصرف الجزئي طبيعي فيُعرض المتبقّي لكل بند.
 */
export function DispenseSheet({
	prescriptionId,
	onClose,
}: {
	prescriptionId: string | null;
	onClose: () => void;
}) {
	const { prescription } = usePrescription(prescriptionId);
	const { warehouses } = useWarehouses();
	const { settings } = usePharmacySettings();
	const { clinicInfo } = useClinicInfo();
	const { dispenseItem, isPending } = usePharmacyMutations();

	const [warehouseId, setWarehouseId] = useState("");
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [quantity, setQuantity] = useState("1");
	const [batchId, setBatchId] = useState("");
	// الطباعة قرار الصيدلي لا أثر جانبي للصرف
	const [printLabel, setPrintLabel] = useState(true);
	// المصروف يُجمع من الوقائع: الشاشة تقترح **المتبقّي** لا «1»
	const remainingOf = (item: { quantity: unknown; dispenseEvents: { quantity: number }[] }) =>
		Math.max(
			0,
			Number(item.quantity) - item.dispenseEvents.reduce((n, e) => n + e.quantity, 0),
		);

	// أول مستودع افتراضيًّا — الصيدلي يصرف من مستودعه غالبًا ولا يختار في كل مرّة
	useEffect(() => {
		if (!warehouseId && warehouses.length > 0) setWarehouseId(warehouses[0].id);
	}, [warehouses, warehouseId]);

	const activeItem = prescription?.items.find((i) => i.id === activeItemId) ?? null;
	const { batches } = useDispenseBatches({
		itemId: activeItem?.inventoryItemId ?? undefined,
		warehouseId: warehouseId || undefined,
	});

	const selectedBatch = batches.find((b) => b.id === batchId) ?? null;
	const expiredPicked = selectedBatch?.expired === true;

	const reset = () => {
		setActiveItemId(null);
		setQuantity("1");
		setBatchId("");
	};

	const submit = async () => {
		if (!activeItem) return;
		await dispenseItem({
			prescriptionItemId: activeItem.id,
			warehouseId,
			quantity: Number(quantity) || 1,
			...(batchId ? { batchId } : {}),
		});

		// الملصق يُطبع بما **صُرف** لا بما وُصف (§9.3) — وحين يريده الصيدلي فقط
		if (printLabel)
			printDispenseLabel({
				clinicName: clinicInfo?.name ?? "الأكاديمية",
				clinicLicense: clinicInfo?.licenseNumber ?? null,
				patientName: prescription?.patient?.name ?? "—",
				ownerName: null,
				drugName: activeItem.nameSnapshot,
				strength: null,
				quantity: Number(quantity) || 1,
				quantityUnit: activeItem.quantityUnit,
				doseText: activeItem.doseAmount
					? `${activeItem.doseAmount} ${activeItem.doseUnit ?? ""}`
					: null,
				route: activeItem.route,
				frequency: activeItem.frequency,
				durationDays: activeItem.durationDays,
				instructionsAr: activeItem.instructionsAr,
				batchNo: selectedBatch?.batchNo ?? null,
				expiryDate: selectedBatch?.expiryDate ?? null,
				prescriberName: prescription?.prescriber?.name ?? null,
				dispensedAt: new Date(),
				copies: settings?.defaultLabelCopies ?? 1,
			});

		reset();
	};

	return (
		<Sheet
			open={!!prescriptionId}
			onOpenChange={(open) => {
				if (!open && !isPending) {
					reset();
					onClose();
				}
			}}
		>
			<SheetContent
				className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
				showCloseButton={false}
			>
				<SheetTitle className="sr-only">صرف الوصفة</SheetTitle>

				<div className="flex items-center justify-between border-b px-4 py-2">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-sm">صرف الوصفة</span>
						{prescription && <Badge variant="outline">{prescription.code}</Badge>}
					</div>
					<span className="text-muted-foreground text-xs">
						{prescription?.patient?.name ?? "—"}
					</span>
				</div>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="dispense-warehouse">المستودع</Label>
						<Select
							value={warehouseId}
							onValueChange={setWarehouseId}
						>
							<SelectTrigger
								id="dispense-warehouse"
								className="w-full min-w-0"
							>
								<SelectValue placeholder="اختر المستودع" />
							</SelectTrigger>
							<SelectContent position="popper">
								{warehouses.map((w) => (
									<SelectItem
										key={w.id}
										value={w.id}
									>
										{w.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						{(prescription?.items ?? []).map((item) => {
							const isActive = item.id === activeItemId;
							return (
								<div
									key={item.id}
									className="rounded-[4px] border p-3"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 flex-col">
											<span className="truncate font-medium text-sm">{item.nameSnapshot}</span>
											<span className="text-muted-foreground text-xs">
												موصوف {String(item.quantity)} {item.quantityUnit} · متبقٍّ{" "}
												{remainingOf(item)}
												{item.refillsAllowed > 0 &&
													` · إعادة صرف ${item.refillsUsed}/${item.refillsAllowed}`}
											</span>
										</div>
										<Button
											size="sm"
											variant={isActive ? "secondary" : "outline"}
											onClick={() => {
												setActiveItemId(isActive ? null : item.id);
												setBatchId("");
												setQuantity(String(remainingOf(item) || 1));
											}}
										>
											{isActive ? "إغلاق" : "صرف"}
										</Button>
									</div>

									{isActive && (
										<div className="mt-3 flex flex-col gap-3 border-t pt-3">
											<div className="grid grid-cols-2 gap-3">
												<div className="flex flex-col gap-1.5">
													<Label htmlFor="dispense-qty">الكمية ({item.quantityUnit})</Label>
													<Input
														id="dispense-qty"
														type="number"
														min={1}
														value={quantity}
														onChange={(e) => setQuantity(e.target.value)}
													/>
												</div>
												{batches.length > 0 && (
													<div className="flex flex-col gap-1.5">
														<Label htmlFor="dispense-batch">الدفعة</Label>
														<Select
															value={batchId}
															onValueChange={setBatchId}
														>
															<SelectTrigger
																id="dispense-batch"
																className="w-full min-w-0"
															>
																<SelectValue placeholder="اختياري" />
															</SelectTrigger>
															<SelectContent position="popper">
																{batches.map((b) => (
																	<SelectItem
																		key={b.id}
																		value={b.id}
																	>
																		{b.batchNo} · متاح {b.qty}
																		{b.expired && (
																			<span className="text-destructive"> · منتهية</span>
																		)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>
												)}
											</div>

											{expiredPicked && (
												<p className="flex items-start gap-1.5 text-destructive text-xs">
													<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
													الدفعة منتهية الصلاحية — الخادم سيرفض الصرف منها
												</p>
											)}

											<div className="flex items-center justify-between gap-3">
												<div className="flex items-center gap-2 text-xs">
													<Checkbox
														id="dispense-print-label"
														checked={printLabel}
														onCheckedChange={(v) => setPrintLabel(v === true)}
													/>
													<label
														htmlFor="dispense-print-label"
														className="flex items-center gap-2"
													>
														<IconPrinter className="size-3.5 text-muted-foreground" />
														طباعة الملصق بعد الصرف
													</label>
												</div>
												<Button
													size="sm"
													disabled={isPending || expiredPicked || !(Number(quantity) > 0)}
													onClick={() => void submit()}
												>
													<IconPackageExport className="size-4" />
													صرف
												</Button>
											</div>
										</div>
									)}
								</div>
							);
						})}

						{prescription?.items.length === 0 && (
							<p className="py-6 text-center text-muted-foreground text-xs">
								لا بنود في هذه الوصفة
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-end border-t px-4 py-2">
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={onClose}
					>
						إغلاق
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DisposeBatchDialog } from "@/features/pharmacy/components/dispose-batch-dialog";
import {
	useDispensingReport,
	useExpiredReport,
	useExpiringReport,
	useOverridesReport,
	usePharmacySettings,
} from "@/features/pharmacy/hooks/use-pharmacy";

const day = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/**
 * [PH13.3] تقارير الصيدلية — BRD §12.
 *
 * ثلاثة تقارير في شاشة واحدة لأنها تُقرأ معًا: ماذا صُرف، وأين تُجووزت النشرة،
 * وما يوشك أن ينتهي.
 *
 * سجل التجاوزات (§12.3) هو ما يجعل بوّابة §6.2 ذات معنى: السماح بالتجاوز بلا مكانٍ
 * يُقرأ فيه لاحقًا يجعل «سبب التجاوز» حقلًا يُملأ ولا يُراجَع.
 */
export function PharmacyReportsPage() {
	const { enabled } = usePharmacySettings();
	const { report: dispensing } = useDispensingReport(enabled);
	const { report: overrides } = useOverridesReport(enabled);
	const { report: expiring } = useExpiringReport(enabled);
	const { expired } = useExpiredReport(enabled);
	const [disposing, setDisposing] = useState<{
		id: string;
		batchNo: string;
		qty: number;
		itemName: string;
		controlled: boolean;
	} | null>(null);

	if (!enabled)
		return (
			<div className="p-16 text-center text-muted-foreground text-xs">
				وحدة الصيدلية غير مفعّلة
			</div>
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
			<section className="flex flex-col gap-2">
				<h3 className="font-semibold text-sm">المصروف حسب الدواء</h3>
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الدواء</TableHead>
								<TableHead>الكمية</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(dispensing?.byDrug ?? []).length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={2}
										className="py-6 text-center text-muted-foreground text-xs"
									>
										<span className="font-medium">لا صرف مسجَّل بعد</span>
										<br />
										يجمع هذا الجدول ما صُرف فعلًا من كل دواء خلال المدّة — يمتلئ عند أول صرف من
										طابور الصيدلية أو بيعٍ على الكاونتر.
										<br />
										<span className="text-[10px] opacity-70">
											مثال حين يمتلئ: «أموكسيسيلين ٢٠٠ ملغ — ٤٨ قرصًا»
										</span>
									</TableCell>
								</TableRow>
							) : (
								dispensing?.byDrug.map((row) => (
									<TableRow key={row.name}>
										<TableCell className="max-w-72 truncate">{row.name}</TableCell>
										<TableCell className="tabular-nums">{row.quantity}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="font-semibold text-sm">تجاوزات المدى الموثّق</h3>
				<p className="text-[11px] text-muted-foreground">
					كل جرعة خرجت عن مدى النشرة، بسببها وواصفها — التجاوز مسموح، والصمت عنه ليس كذلك.
				</p>
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الدواء</TableHead>
								<TableHead>الجرعة</TableHead>
								<TableHead>السبب</TableHead>
								<TableHead>الطفل</TableHead>
								<TableHead>الواصف</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(overrides ?? []).length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="py-6 text-center text-muted-foreground text-xs"
									>
										<span className="font-medium">
											لا تجاوزات مسجَّلة — وهذه هي الحالة المرجوّة
										</span>
										<br />
										حين يصف مدرّبٌ جرعةً خارج المدى الموثّق في النشرة، يُطالَب بسبب، ويُسجَّل الصفّ هنا
										للمراجعة. الجدول الفارغ يعني أن كل وصفة بقيت داخل المدى.
										<br />
										<span className="text-[10px] opacity-70">
											مثال حين يمتلئ: «بريدنيزولون — ٦ ملغ/كغ (المدى ٠٫٥–٤) — السبب: بروتوكول
											مناعي، د. ــــ»
										</span>
									</TableCell>
								</TableRow>
							) : (
								overrides?.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="max-w-56 truncate font-medium">
											{row.nameSnapshot}
										</TableCell>
										<TableCell className="tabular-nums">
											{row.doseAmount ? `${row.doseAmount} ${row.doseUnit ?? ""}` : "—"}
										</TableCell>
										<TableCell className="max-w-64 truncate text-xs">
											{row.overrideReasonAr ?? "—"}
										</TableCell>
										<TableCell>{row.prescription.patient?.name ?? "—"}</TableCell>
										<TableCell>{row.prescription.prescriber?.name ?? "—"}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="font-semibold text-sm">المواد المنتهية</h3>
				<p className="text-[11px] text-muted-foreground">
					دفعات فات تاريخها وما زال لها رصيد على الرفّ. لا تُصرف ولا تُباع؛ تُتلَف بشاهد أو أكثر من
					أعضاء الأكاديمية، ويُخصم المخزون ويُقيَّد سجل العهدة للمادة المراقبة في الخطوة نفسها.
				</p>
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الصنف</TableHead>
								<TableHead>الدفعة</TableHead>
								<TableHead>الرصيد</TableHead>
								<TableHead>انتهت في</TableHead>
								<TableHead className="w-28" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{expired.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="py-6 text-center text-muted-foreground text-xs"
									>
										<span className="font-medium">لا مواد منتهية على الرفّ</span>
										<br />
										كل دفعة فات تاريخها أُتلفت أو نفد رصيدها — وهذه هي الحالة المرجوّة.
									</TableCell>
								</TableRow>
							) : (
								expired.map((b) => {
									const controlled = b.item.controlledSubstance.length > 0;
									return (
										<TableRow key={b.id}>
											<TableCell className="max-w-72 truncate">
												{b.item.name}
												{controlled && (
													<Badge
														variant="outline"
														className="ms-1.5"
													>
														مراقبة
													</Badge>
												)}
											</TableCell>
											<TableCell className="tabular-nums">{b.batchNo}</TableCell>
											<TableCell className="tabular-nums">{b.qty}</TableCell>
											<TableCell className="tabular-nums text-destructive">
												{b.expiryDate ? day.format(new Date(b.expiryDate)) : "—"}
											</TableCell>
											<TableCell>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														setDisposing({
															id: b.id,
															batchNo: b.batchNo,
															qty: b.qty,
															itemName: b.item.name,
															controlled,
														})
													}
												>
													<IconTrash className="size-4" />
													إتلاف الدفعة
												</Button>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
				<DisposeBatchDialog
					batch={disposing}
					onClose={() => setDisposing(null)}
				/>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="font-semibold text-sm">دفعات توشك أن تنتهي</h3>
				<p className="text-[11px] text-muted-foreground">
					خلال ٩٠ يومًا. المنتهية تُعرض أيضًا: منعُ صرفها لا يُخرجها من الرفّ، وما لا يظهر في تقرير
					لا يُتلَف.
				</p>
				<div className="rounded-[4px] border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الصنف</TableHead>
								<TableHead>الدفعة</TableHead>
								<TableHead>الكمية</TableHead>
								<TableHead>تنتهي في</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(expiring ?? []).length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="py-6 text-center text-muted-foreground text-xs"
									>
										<span className="font-medium">لا دفعات قاربت الانتهاء</span>
										<br />
										يرصد هذا الجدول الدفعات التي ينتهي مفعولها خلال ٩٠ يومًا كي تُصرف أو تُتلَف قبل
										فواتها — يشمل المنتهية فعلًا، فمنعُ صرفها لا يُخرجها من الرفّ.
										<br />
										<span className="text-[10px] opacity-70">
											مثال حين يمتلئ: «دفعة B-2291 — أموكسيسيلين — تنتهي بعد ١٢ يومًا — ٣٠ قرصًا»
										</span>
									</TableCell>
								</TableRow>
							) : (
								expiring?.map((b) => (
									<TableRow key={b.id}>
										<TableCell>{b.item.name}</TableCell>
										<TableCell className="tabular-nums">{b.batchNo}</TableCell>
										<TableCell className="tabular-nums">{b.qty}</TableCell>
										<TableCell>
											<span className="tabular-nums">
												{b.expiryDate ? day.format(new Date(b.expiryDate)) : "—"}
											</span>
											{b.expired && (
												<Badge
													variant="destructive"
													className="ms-1.5"
												>
													منتهية
												</Badge>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</section>
		</div>
	);
}

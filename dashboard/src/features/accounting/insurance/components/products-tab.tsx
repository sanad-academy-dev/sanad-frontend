import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { ProductSheet } from "@/features/accounting/insurance/components/product-sheet";
import {
	useInsuranceProducts,
	useSetInsuranceProductActive,
} from "@/features/accounting/insurance/hooks/use-insurance";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { InsuranceProductResponse } from "@/server/accounting/insurance/insurance-product.type";

/** [MI-P3] Tab «المنتجات» (MI §8.2) — the coverage definition per insurer. */

export const ProductsTab = () => {
	const { products, isLoading } = useInsuranceProducts();
	const { setProductActive, isPending } = useSetInsuranceProductActive();
	const [sheet, setSheet] = useState(false);
	const [editing, setEditing] = useState<InsuranceProductResponse | null>(null);

	return (
		<>
			<TabIntro
				title="منتجات التأمين"
				hint="المنتج يحدد نسبة التغطية الافتراضية وصفوف الفئات (0% = مستثناة) والسقوف والتحمّل. تعديل منتجٍ لا يمسّ مطالبات أُنشئت — كل مطالبة تلتقط شروطها لحظتها."
			/>
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<Button
					size="sm"
					className="ms-auto"
					onClick={() => {
						setEditing(null);
						setSheet(true);
					}}
				>
					<IconPlus className="size-4" />
					منتج جديد
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "المنتج" },
						{ label: "الشركة", className: "w-40" },
						{ label: "التغطية الافتراضية", className: "w-28 text-end" },
						{ label: "السقف السنوي", className: "w-28 text-end" },
						{ label: "التحمّل", className: "w-28 text-end" },
						{ label: "صفوف الفئات", className: "w-20 text-end" },
						{ label: "البوالص", className: "w-16 text-end" },
						{ label: "الحالة", className: "w-20" },
						{ label: "", className: "w-32" },
					]}
					rows={products}
					isLoading={isLoading}
					emptyMessage="لا منتجات بعد. أنشئ منتجًا يحدد نِسَب التغطية لبوالص الأطفال."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>
								<span className="font-medium">{row.name}</span>
								<span className="ms-2 text-muted-foreground text-xs">{row.code}</span>
							</TableCell>
							<TableCell>{row.insurer.name}</TableCell>
							<TableCell className="text-end">{Number(row.coveragePercentDefault)}%</TableCell>
							<TableCell className="text-end">
								{row.annualCap ? formatAmount(row.annualCap.toString()) : "بلا سقف"}
							</TableCell>
							<TableCell className="text-end">
								{formatAmount(row.deductibleFixed.toString())}
								{Number(row.deductiblePercent) > 0
									? ` + ${Number(row.deductiblePercent)}%`
									: ""}
							</TableCell>
							<TableCell className="text-end">{row.coverageRows.length}</TableCell>
							<TableCell className="text-end">{row._count.policies}</TableCell>
							<TableCell>
								<Badge variant={row.active ? "default" : "secondary"}>
									{row.active ? "فعّال" : "معطّل"}
								</Badge>
							</TableCell>
							<TableCell>
								<div className="flex justify-end gap-1">
									<Button
										size="sm"
										variant="ghost"
										onClick={() => {
											setEditing(row);
											setSheet(true);
										}}
									>
										تعديل
									</Button>
									<Button
										size="sm"
										variant="ghost"
										disabled={isPending}
										onClick={() => setProductActive({ id: row.id, active: !row.active })}
									>
										{row.active ? "تعطيل" : "تفعيل"}
									</Button>
								</div>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<ProductSheet
				open={sheet}
				onOpenChange={setSheet}
				product={editing}
			/>
		</>
	);
};

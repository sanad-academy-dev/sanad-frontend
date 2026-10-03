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
import { InsurerSheet } from "@/features/accounting/insurance/components/insurer-sheet";
import {
	useInsurers,
	useSetInsurerActive,
} from "@/features/accounting/insurance/hooks/use-insurance";
import type { InsurerResponse } from "@/server/accounting/insurance/insurer.type";

/**
 * [MI-P3] Tab «الشركات» (MI §8.1). No delete: deactivate only — the insurer stays on
 * existing policies/claims. Correction #8 note lives on the sheet: account overrides are
 * the party screen's job, not a field here.
 */

export const InsurersTab = () => {
	const { insurers, isLoading } = useInsurers();
	const { setInsurerActive, isPending } = useSetInsurerActive();
	const [sheet, setSheet] = useState(false);
	const [editing, setEditing] = useState<InsurerResponse | null>(null);

	return (
		<>
			<TabIntro
				title="شركات التأمين"
				hint="الشركة طرف مدين (ذمم المطالبات) — تظهر تلقائيًا في «حسابات الأطراف»، وأي حساب مخصص لها يُضبط هناك لا هنا. لا حذف: عطّل الشركة لإيقاف إنشاء منتجات عليها."
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
					شركة جديدة
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "الشركة" },
						{ label: "جهة التواصل", className: "w-40" },
						{ label: "الهاتف", className: "w-28" },
						{ label: "مهلة السداد", className: "w-24 text-end" },
						{ label: "المنتجات", className: "w-16 text-end" },
						{ label: "الحالة", className: "w-20" },
						{ label: "", className: "w-32" },
					]}
					rows={insurers}
					isLoading={isLoading}
					emptyMessage="لا شركات تأمين بعد. أضف الشركة ثم عرّف منتجاتها وبوالص مرضاها."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>
								<span className="font-medium">{row.name}</span>
								<span className="ms-2 text-muted-foreground text-xs">{row.code}</span>
							</TableCell>
							<TableCell>{row.contactPerson ?? "—"}</TableCell>
							<TableCell>
								<span dir="ltr">{row.phone ?? "—"}</span>
							</TableCell>
							<TableCell className="text-end">{row.settlementDays} يومًا</TableCell>
							<TableCell className="text-end">{row._count.products}</TableCell>
							<TableCell>
								<Badge variant={row.active ? "default" : "secondary"}>
									{row.active ? "فعّالة" : "معطّلة"}
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
										onClick={() => setInsurerActive({ id: row.id, active: !row.active })}
									>
										{row.active ? "تعطيل" : "تفعيل"}
									</Button>
								</div>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<InsurerSheet
				open={sheet}
				onOpenChange={setSheet}
				insurer={editing}
			/>
		</>
	);
};

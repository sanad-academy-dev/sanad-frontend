import { IconAlertTriangle, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AddMobileServicesDialog } from "@/features/mobile-clinics/components/add-mobile-services-dialog";
import {
	useMobileServiceCatalog,
	useMobileServiceMutations,
} from "@/features/mobile-clinics/hooks/use-mobile-services";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 });

/**
 * [MC10.1] سجلّ الدورات المسموح بها للأكاديمية المتنقلة.
 *
 * الشاشة تجيب عن سؤالين لا سؤال واحد: **ماذا تستطيع المركبة أن تؤدّي**، و**بكم**. السعر
 * الفارغ ليس نقصًا في البيانات بل قرار: «بسعر الأكاديمية» — ولذلك يُعرض كذلك نصًّا لا كصفر.
 */
export function MobileServicesView() {
	const { entries, isLoading } = useMobileServiceCatalog();
	const { saveEntry, removeEntry, isSaving, isRemoving } = useMobileServiceMutations();
	const [adding, setAdding] = useState(false);

	return (
		<>
			<AddMobileServicesDialog
				open={adding}
				onClose={() => setAdding(false)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex items-center gap-2 border-b px-4 py-2">
					<span className="text-sm font-medium">الدورات المسموح بها</span>
					<span className="text-xs text-muted-foreground tabular-nums">
						{entries.length} دورة
					</span>
					<div className="flex-1" />
					<Button
						size="sm"
						className="h-7 text-xs"
						onClick={() => setAdding(true)}
					>
						<IconPlus className="size-3.5" />
						إضافة دورات
					</Button>
				</div>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Spinner />
					</div>
				) : entries.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
						<IconAlertTriangle className="size-10 text-amber-500" />
						<span className="text-sm font-medium">لا توجد دورات مسموح بها بعد</span>
						{/* الفراغ هنا ليس حالة محايدة: بلا سجلّ لا تُجدوَل زيارة متنقلة أصلًا */}
						<span className="max-w-md text-xs text-muted-foreground">
							ما دام السجلّ فارغًا سيُرفض تحويل أي طلب إلى زيارة متنقلة، لأنّ النظام لا يعرف ما
							تستطيع المركبة أداءه. أضِف الدورات التي تؤدّيها مركباتك للبدء.
						</span>
					</div>
				) : (
					<div className="min-h-0 flex-1 overflow-y-auto">
						<table className="w-full text-sm">
							<thead className="sticky top-0 bg-background">
								<tr className="border-b text-xs text-muted-foreground">
									<th className="px-4 py-2 text-start font-medium">الدورة</th>
									<th className="px-4 py-2 text-start font-medium">سعر التنقّل</th>
									<th className="px-4 py-2 text-start font-medium">المدّة</th>
									<th className="px-4 py-2 text-start font-medium">مفعّلة</th>
									<th className="w-10 px-4 py-2" />
								</tr>
							</thead>
							<tbody>
								{entries.map((entry) => (
									<tr
										key={entry.id}
										className={cn("border-b", !entry.isActive && "opacity-55")}
									>
										<td className="px-4 py-2">
											<div className="flex flex-col">
												<span className="font-medium">{entry.service.name}</span>
												{entry.service.parent && (
													<span className="text-[11px] text-muted-foreground">
														{entry.service.parent.name}
													</span>
												)}
											</div>
										</td>
										<td className="px-4 py-2 tabular-nums">
											{entry.price === null ? (
												<span className="text-xs text-muted-foreground">بسعر الأكاديمية</span>
											) : (
												`${money.format(Number(entry.price))} ر.س`
											)}
										</td>
										<td className="px-4 py-2 tabular-nums">
											{entry.duration === null ? (
												<span className="text-xs text-muted-foreground">بمدّة الأكاديمية</span>
											) : (
												`${entry.duration} د`
											)}
										</td>
										<td className="px-4 py-2">
											<Switch
												checked={entry.isActive}
												disabled={isSaving}
												onCheckedChange={(checked) =>
													saveEntry({
														serviceId: entry.serviceId,
														price: entry.price === null ? null : Number(entry.price),
														duration: entry.duration,
														isActive: checked,
														notes: entry.notes,
													})
												}
											/>
										</td>
										<td className="px-4 py-2">
											<Button
												variant="ghost"
												size="icon"
												className="size-7 text-destructive"
												disabled={isRemoving}
												onClick={() => removeEntry(entry.id)}
												aria-label="إزالة الدورة"
											>
												<IconTrash className="size-4" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
}

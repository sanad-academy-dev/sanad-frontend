import { IconCake } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	useSetPatientBirthDate,
	useUnschedulablePatients,
} from "@/features/services/vaccinations/hooks/use-vaccinations";

/**
 * شريط الأطفال غير القابلة للجدولة.
 *
 * محرّك الاستحقاق يرفض تلفيق تاريخ لطفل مجهول العمر — وهو الصواب. لكن إسقاطه من
 * الطابور بصمت يجعل القائمة تبدو مكتملة وهي ناقصة، فيقرأ الفريق «لا متأخّرين» بينما
 * عشرات الأطفال خارج الحساب أصلًا. الشريط يقول العدد ويعطي طريق الإصلاح في مكانه.
 */
export function UnschedulableStrip() {
	const { patients, isLoading } = useUnschedulablePatients();
	const [open, setOpen] = useState(false);

	if (isLoading || patients.length === 0) return null;

	return (
		<>
			<div className="flex items-center justify-between gap-3 border-t bg-muted/40 px-4 py-2">
				<p className="flex items-center gap-2 text-xs text-muted-foreground">
					<IconCake className="size-4 shrink-0" />
					<span>
						<strong className="font-semibold text-foreground tabular-nums">
							{patients.length}
						</strong>{" "}
						{patients.length === 1 ? "طفل" : "طفلًا"} خارج الجدولة — تاريخ الميلاد ناقص، فلا
						يمكن حساب استحقاق الجرعات المرتبطة بالعمر.
					</span>
				</p>

				<Button
					size="sm"
					variant="outline"
					onClick={() => setOpen(true)}
				>
					أضِف التواريخ
				</Button>
			</div>

			<BirthDateDialog
				open={open}
				onOpenChange={setOpen}
			/>
		</>
	);
}

function BirthDateDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { patients } = useUnschedulablePatients();
	const { setBirthDate, isPending } = useSetPatientBirthDate();
	const [drafts, setDrafts] = useState<Record<string, string>>({});

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[80vh] gap-0 p-0 sm:max-w-2xl">
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle>إضافة تواريخ الميلاد</DialogTitle>
					<DialogDescription>
						الطفل يدخل الجدولة فور حفظ تاريخ ميلاده. التاريخ التقريبي أفضل من غيابه — لكنّه
						يبقى تقديرًا، فصحّحه متى عُرف التاريخ الحقيقي.
					</DialogDescription>
				</DialogHeader>

				<div className="min-h-0 flex-1 overflow-y-auto">
					<table className="w-full text-sm">
						<tbody>
							{patients.map((patient) => (
								<tr
									key={patient.patientId}
									className="border-b last:border-b-0"
								>
									<td className="px-4 py-2">
										<div className="flex min-w-0 flex-col">
											<span className="truncate font-medium">{patient.patientName}</span>
											<span className="truncate text-xs text-muted-foreground">
												{patient.animalTypeName}
												{patient.ownerName ? ` — ${patient.ownerName}` : ""}
											</span>
										</div>
									</td>
									<td className="w-48 px-4 py-2">
										<Input
											type="date"
											dir="ltr"
											className="h-8"
											value={drafts[patient.patientId] ?? ""}
											onChange={(e) =>
												setDrafts((d) => ({ ...d, [patient.patientId]: e.target.value }))
											}
											disabled={isPending}
										/>
									</td>
									<td className="w-24 px-4 py-2 text-end">
										<Button
											size="sm"
											variant="outline"
											disabled={isPending || !drafts[patient.patientId]}
											onClick={() =>
												void setBirthDate({
													patientId: patient.patientId,
													birthDate: drafts[patient.patientId],
												})
											}
										>
											حفظ
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
					>
						إغلاق
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

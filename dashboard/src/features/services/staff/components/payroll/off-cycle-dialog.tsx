import { IconAlertCircle, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	currentPeriod,
	formatPeriod,
	getInitials,
} from "@/features/services/staff/components/payroll/payroll-ui";
import {
	type OffCycleInput,
	usePayrollMutations,
} from "@/features/services/staff/hooks/use-payroll";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { PayrollEarningType } from "@/server/payroll/payroll.type";
import { EARNING_TYPE_LABEL } from "@sanad/contracts/runtime/server/payroll/payroll.type";
import type { StaffResponse } from "@/server/staff/staff.type";

const EARNING_TYPES: PayrollEarningType[] = [
	"BONUS",
	"COMMISSION",
	"ALLOWANCE",
	"EXPENSE_REIMBURSEMENT",
];

type DraftLine = { staffId: string; type: PayrollEarningType; amount: string; note: string };

export function OffCycleDialog({
	open,
	onOpenChange,
	staff,
	onDone,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	staff: StaffResponse[];
	onDone?: () => void;
}) {
	const { format } = useCurrency();
	const period = currentPeriod();
	const [reason, setReason] = useState("");
	const [search, setSearch] = useState("");
	const [lines, setLines] = useState<DraftLine[]>([]);
	const { createOffCycle } = usePayrollMutations(null);

	const selected = useMemo(() => new Set(lines.map((l) => l.staffId)), [lines]);

	const candidates = useMemo(() => {
		const q = search.trim().toLowerCase();
		return staff.filter(
			(s) =>
				!selected.has(s.id) &&
				(!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)),
		);
	}, [staff, search, selected]);

	const total = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
	const hasInvalidAmount = lines.some((l) => !(Number(l.amount) > 0));
	const canSubmit =
		!!reason.trim() && lines.length > 0 && !hasInvalidAmount && !createOffCycle.isPending;

	const addStaff = (staffId: string) =>
		setLines((prev) => [...prev, { staffId, type: "BONUS", amount: "", note: "" }]);

	const patchLine = (staffId: string, patch: Partial<DraftLine>) =>
		setLines((prev) => prev.map((l) => (l.staffId === staffId ? { ...l, ...patch } : l)));

	const removeLine = (staffId: string) =>
		setLines((prev) => prev.filter((l) => l.staffId !== staffId));

	const close = () => {
		onOpenChange(false);
		setTimeout(() => {
			setReason("");
			setSearch("");
			setLines([]);
		}, 200);
	};

	const submit = async () => {
		if (!canSubmit) return;
		const payload: OffCycleInput = {
			periodYear: period.year,
			periodMonth: period.month,
			reason: reason.trim(),
			lines: lines.map((l) => ({
				staffId: l.staffId,
				type: l.type,
				amount: Number(l.amount),
				note: l.note.trim() || null,
			})),
		};
		try {
			await createOffCycle.mutateAsync(payload);
			close();
			onDone?.();
		} catch {
			// الخطأ يظهر كتوست من الـ hook
		}
	};

	const staffById = useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => (next ? onOpenChange(true) : close())}
		>
			<DialogContent className="max-h-[88vh] w-[720px] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-[720px]">
				<DialogHeader>
					<DialogTitle className="text-sm font-bold">مسير خارج الدورة</DialogTitle>
					<DialogDescription className="text-xs">
						صرف استثنائي لفترة {formatPeriod(period.year, period.month)} — المبلغ يُصرف صافيًا
						كما هو، بلا احتساب حضور أو خصومات أو تأمينات.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{/* سبب الصرف */}
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium">
							سبب الصرف <span className="text-destructive">*</span>
						</span>
						<Input
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="مثال: مكافأة أداء الربع الثاني"
							className="h-9 text-xs"
							maxLength={200}
						/>
					</div>

					{/* اختيار الموظفين */}
					<div className="flex flex-col gap-1.5">
						<span className="text-xs font-medium">إضافة موظفين</span>
						<div className="relative">
							<IconSearch className="pointer-events-none absolute end-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="ابحث بالاسم أو المعرّف..."
								className="h-9 pe-8 text-xs"
							/>
						</div>
						{search.trim() && (
							<div className="max-h-40 overflow-y-auto rounded-md border">
								{candidates.length === 0 ? (
									<p className="px-3 py-2.5 text-center text-xs text-muted-foreground">
										لا نتائج
									</p>
								) : (
									candidates.slice(0, 30).map((s) => (
										<button
											key={s.id}
											type="button"
											onClick={() => {
												addStaff(s.id);
												setSearch("");
											}}
											className="flex w-full items-center gap-2 border-b px-3 py-2 text-start last:border-b-0 hover:bg-muted"
										>
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
												{getInitials(s.name)}
											</span>
											<span className="truncate text-xs">{s.name}</span>
											<span className="ms-auto shrink-0 font-mono text-[10px] text-muted-foreground">
												{s.code}
											</span>
											<IconPlus className="size-3.5 shrink-0 text-muted-foreground" />
										</button>
									))
								)}
							</div>
						)}
					</div>

					{/* الأسطر المضافة */}
					{lines.length === 0 ? (
						<div className="flex flex-col items-center gap-2 rounded-md border border-dashed px-6 py-8">
							<IconAlertCircle className="size-5 text-muted-foreground" />
							<p className="text-xs text-muted-foreground">
								لم تُضف أي موظف بعد — ابحث أعلاه وأضف من تريد صرف مبلغ له.
							</p>
						</div>
					) : (
						<div className="overflow-hidden rounded-md border">
							<table className="w-full text-xs">
								<thead className="bg-muted/50">
									<tr className="border-b">
										<th className="px-3 py-2 text-start font-medium">الموظف</th>
										<th className="w-[130px] px-2 py-2 text-start font-medium">النوع</th>
										<th className="w-[110px] px-2 py-2 text-start font-medium">المبلغ</th>
										<th className="px-2 py-2 text-start font-medium">ملاحظة</th>
										<th className="w-10" />
									</tr>
								</thead>
								<tbody>
									{lines.map((line) => {
										const s = staffById.get(line.staffId);
										const invalid = !(Number(line.amount) > 0);
										return (
											<tr
												key={line.staffId}
												className="border-b last:border-b-0"
											>
												<td className="px-3 py-1.5">
													<div className="flex min-w-0 items-center gap-2">
														<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
															{getInitials(s?.name ?? "")}
														</span>
														<span className="truncate">{s?.name}</span>
													</div>
												</td>
												<td className="px-2 py-1.5">
													<Select
														dir="rtl"
														value={line.type}
														onValueChange={(v) =>
															patchLine(line.staffId, { type: v as PayrollEarningType })
														}
													>
														<SelectTrigger className="h-8! w-full text-xs">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{EARNING_TYPES.map((t) => (
																<SelectItem
																	key={t}
																	value={t}
																>
																	{EARNING_TYPE_LABEL[t]}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</td>
												<td className="px-2 py-1.5">
													<Input
														type="number"
														min={0}
														value={line.amount}
														onChange={(e) =>
															patchLine(line.staffId, { amount: e.target.value })
														}
														aria-invalid={invalid}
														aria-label={`مبلغ ${s?.name ?? ""}`}
														className={cn("h-8 text-xs", invalid && "border-destructive")}
													/>
												</td>
												<td className="px-2 py-1.5">
													<Input
														value={line.note}
														onChange={(e) => patchLine(line.staffId, { note: e.target.value })}
														placeholder="اختياري"
														aria-label={`ملاحظة ${s?.name ?? ""}`}
														className="h-8 text-xs"
													/>
												</td>
												<td className="px-2 py-1.5">
													<button
														type="button"
														onClick={() => removeLine(line.staffId)}
														aria-label={`إزالة ${s?.name ?? ""}`}
														className="text-muted-foreground hover:text-destructive"
													>
														<IconTrash className="size-3.5" />
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
								<tfoot className="border-t bg-muted/50">
									<tr>
										<td
											colSpan={2}
											className="px-3 py-2 font-medium"
										>
											الإجمالي ({lines.length} موظف)
										</td>
										<td
											colSpan={3}
											className="px-2 py-2 font-bold"
										>
											{format(total)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					)}
				</div>

				<DialogFooter className="gap-2 sm:justify-start">
					<Button
						type="button"
						size="sm"
						onClick={submit}
						disabled={!canSubmit}
						className="h-8 text-xs font-bold"
					>
						{createOffCycle.isPending ? "جارٍ الإنشاء..." : "إنشاء المسير"}
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={close}
						className="h-8 text-xs"
					>
						إلغاء
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

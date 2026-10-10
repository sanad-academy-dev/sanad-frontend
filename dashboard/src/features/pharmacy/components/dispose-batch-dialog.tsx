import { IconAlertTriangle, IconCheck, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDisposeBatch, useWitnessCandidates } from "@/features/pharmacy/hooks/use-pharmacy";
import { useSession } from "@/lib/auth/client";

/**
 * [PH17] إتلاف دفعة — بشاهد واحد أو أكثر من مستخدمي الأكاديمية.
 *
 * الشاهد يُختار من قائمة الأعضاء لا يُكتب اسمه: الإتلاف واقعة تُراجَع، والاسم الحرّ
 * لا يُراجَع. المنفّذ (المستخدم الحالي) لا يظهر في القائمة لأنه لا يشهد على نفسه.
 */
export function DisposeBatchDialog({
	batch,
	onClose,
}: {
	batch: {
		id: string;
		batchNo: string;
		qty: number;
		itemName: string;
		controlled: boolean;
	} | null;
	onClose: () => void;
}) {
	const { data: session } = useSession();
	const { candidates } = useWitnessCandidates(!!batch);
	const { disposeBatch, isPending } = useDisposeBatch();
	const [qty, setQty] = useState("");
	const [reason, setReason] = useState("منتهية الصلاحية");
	const [witnessIds, setWitnessIds] = useState<string[]>([]);
	const [witnessPickerOpen, setWitnessPickerOpen] = useState(false);

	const meId = session?.user.id;
	const eligible = candidates.filter((c) => c.id !== meId);
	const chosen = eligible.filter((c) => witnessIds.includes(c.id));
	const toggleWitness = (id: string) =>
		setWitnessIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	const n = Number(qty || batch?.qty || 0);
	const canSubmit =
		!!batch && n > 0 && n <= batch.qty && reason.trim() && witnessIds.length > 0;

	const reset = () => {
		setQty("");
		setReason("منتهية الصلاحية");
		setWitnessIds([]);
	};

	const submit = async () => {
		if (!batch) return;
		await toast.promise(
			disposeBatch({ batchId: batch.id, qty: n, reasonAr: reason, witnessIds }),
			{
				loading: "جارٍ تسجيل الإتلاف…",
				success: `أُتلفت ${n} من الدفعة ${batch.batchNo}`,
				error: (e: Error) => e.message,
			},
		);
		reset();
		onClose();
	};

	return (
		<Dialog
			open={!!batch}
			onOpenChange={(o) => {
				if (!o) {
					reset();
					onClose();
				}
			}}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-y-auto sm:max-w-md"
			>
				<DialogTitle className="sr-only">إتلاف الدفعة</DialogTitle>
				<div className="flex items-center gap-2 border-b pb-3">
					<IconTrash className="size-4 text-destructive" />
					<div className="flex min-w-0 flex-col">
						<span className="font-semibold text-sm">إتلاف الدفعة {batch?.batchNo}</span>
						<span className="truncate text-muted-foreground text-xs">{batch?.itemName}</span>
					</div>
				</div>

				<div className="flex flex-col gap-3 py-3">
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="dispose-qty">الكمية (رصيد الدفعة {batch?.qty})</Label>
							<Input
								id="dispose-qty"
								type="number"
								min={1}
								max={batch?.qty}
								placeholder={String(batch?.qty ?? "")}
								value={qty}
								onChange={(e) => setQty(e.target.value)}
								disabled={isPending}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="dispose-reason">السبب</Label>
							<Input
								id="dispose-reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								disabled={isPending}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>
							الشهود — واحد على الأقل{batch?.controlled && "، ويُستحسن اثنان لمادة مراقبة"}
						</Label>
						{/* نفس نمط «إلى: … أضف مسؤول» في إرسال طلب المراجعة بالمصروفات */}
						<div className="flex min-h-10 flex-wrap items-center gap-2 rounded-[4px] border px-2 py-1.5">
							{chosen.map((u) => (
								<span
									key={u.id}
									className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-1 ps-2 pe-1 text-xs"
								>
									<button
										type="button"
										onClick={() => toggleWitness(u.id)}
										className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
										disabled={isPending}
									>
										<IconX className="size-3" />
										<span className="sr-only">إزالة</span>
									</button>
									{u.name}
									<Avatar
										size="sm"
										className="size-4"
									>
										<AvatarFallback className="text-[8px]">{u.name.charAt(0)}</AvatarFallback>
									</Avatar>
								</span>
							))}
							<Popover
								open={witnessPickerOpen}
								onOpenChange={setWitnessPickerOpen}
							>
								<PopoverTrigger asChild>
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="shrink-0"
										disabled={isPending}
									>
										<IconPlus className="size-3.5" />
										أضف شاهدًا
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									dir="rtl"
									className="w-72 p-1"
								>
									<div className="border-b px-2 py-1.5">
										<span className="text-muted-foreground text-xs">اختر الشاهد…</span>
									</div>
									{eligible.length === 0 ? (
										<p className="px-2 py-3 text-center text-muted-foreground text-xs">
											لا أعضاء آخرين في الأكاديمية — أضف مستخدمًا ليشهد
										</p>
									) : (
										eligible.map((u) => {
											const checked = witnessIds.includes(u.id);
											return (
												<button
													key={u.id}
													type="button"
													onClick={() => toggleWitness(u.id)}
													className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
												>
													<span className="flex items-center gap-2">
														<Avatar
															size="sm"
															className="size-6"
														>
															<AvatarFallback className="text-[10px]">
																{u.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														{u.name}
													</span>
													{checked && <IconCheck className="size-4 text-primary" />}
												</button>
											);
										})
									)}
								</PopoverContent>
							</Popover>
						</div>
					</div>

					{batch?.controlled && (
						<p className="flex items-start gap-1.5 rounded-[4px] border border-amber-500/40 bg-amber-500/10 p-2 text-[11px]">
							<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
							مادة مراقبة: يُقيَّد الإتلاف في سجل العهدة باسم المنفّذ والشاهد.
						</p>
					)}
				</div>

				<div className="flex items-center justify-end gap-2 border-t pt-3">
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => {
							reset();
							onClose();
						}}
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						variant="destructive"
						disabled={!canSubmit || isPending}
						onClick={() => void submit()}
					>
						<IconTrash className="size-4" />
						تأكيد الإتلاف
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

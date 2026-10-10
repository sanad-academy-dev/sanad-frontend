import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const AMOUNT_CHIPS = ["50", "100", "أخرى"] as const;

// نافذة "إضافة رصيد" (frame 4172) — للاختبار فقط: لا دفع فعلي بعد
export const AddBalanceModal = ({
	open,
	onOpenChange,
	onAdd,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (amountSar: number, method: string) => void;
}) => {
	const [selected, setSelected] = useState<string>("50");
	const [custom, setCustom] = useState("");
	const [method, setMethod] = useState("cash");
	const [consent, setConsent] = useState(false);

	const amount = selected === "أخرى" ? Number(custom) || 0 : Number(selected);
	const canSubmit = consent && amount > 0;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="max-w-md"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle>إضافة رصيد</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{/* المبلغ */}
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-semibold">المبلغ</span>
						<div className="flex items-center gap-2">
							{AMOUNT_CHIPS.map((chip) => (
								<Button
									key={chip}
									type="button"
									variant={selected === chip ? "default" : "outline"}
									size="sm"
									className="rounded-md"
									onClick={() => setSelected(chip)}
								>
									{chip === "أخرى" ? "أخرى" : `${chip} ر.س`}
								</Button>
							))}
						</div>
					</div>

					{selected === "أخرى" && (
						<Input
							type="number"
							min={1}
							value={custom}
							onChange={(e) => setCustom(e.target.value)}
							placeholder="أدخل المبلغ بالريال"
							className="h-10"
						/>
					)}

					{/* طريقة الدفع */}
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-semibold">حدد طريقة الدفع</span>
						<Select
							value={method}
							onValueChange={setMethod}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="w-40"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cash">كاش</SelectItem>
								<SelectItem value="transfer">تحويل بنكي</SelectItem>
								<SelectItem value="card">بطاقة</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* الموافقة */}
					<div className="flex items-start gap-2 text-xs text-muted-foreground">
						<Checkbox
							id="add-balance-consent"
							checked={consent}
							onCheckedChange={(v) => setConsent(v === true)}
							className="mt-0.5"
						/>
						<label htmlFor="add-balance-consent">
							أوافق على إضافة رصيد للذكاء الاصطناعي، وسياسة الاستخدام المقبولة لشركة أونكس.
						</label>
					</div>

					<Button
						type="button"
						className={cn("rounded-md")}
						disabled={!canSubmit}
						onClick={() => {
							onAdd(amount, method);
							onOpenChange(false);
						}}
					>
						إضافة الرصيد
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

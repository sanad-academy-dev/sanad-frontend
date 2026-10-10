// محرّرات السطر التفاعلية: تعديل قيمة مقترحة، استحقاق إضافي، ملاحظة.
// كل محرّر يحفظ على الخادم مباشرة؛ الصافي يُعاد احتسابه هناك لا هنا.
import {
	IconClock,
	IconNote,
	IconPencil,
	IconPlus,
	IconRotateClockwise,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import {
	EARNING_TYPE_LABEL,
	type PayrollEarningType,
	type PayrollLineResponse,
} from "@sanad/contracts/runtime/server/payroll/payroll.type";

// ─── تعديل قيمة لها اقتراح ────────────────────────────────────

export function OverrideNumberEditor({
	suggested,
	override,
	unit,
	label,
	addLabel,
	onSave,
	onClear,
	disabled,
}: {
	suggested: number;
	override: number | null;
	unit: string;
	// وسم صغير بجانب القيمة (مثل "إضافي")
	label?: string;
	// نص الرابط حين تكون القيمة الفعّالة صفرًا ولا يوجد تجاوز
	addLabel?: string;
	onSave: (value: number) => void;
	onClear: () => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const effective = override ?? suggested;
	const [draft, setDraft] = useState(String(effective));

	const hasOverride = override !== null;
	// لا قيمة ولا تجاوز ⇒ رابط إضافة بدل عرض صفر
	const isEmpty = effective === 0 && !hasOverride;

	return (
		<div className="flex flex-col gap-0.5">
			<div className="flex items-center gap-1">
				{!isEmpty && (
					<span
						className={cn(
							"flex items-center gap-1 text-xs tabular-nums",
							hasOverride ? "font-semibold text-primary" : "text-foreground",
						)}
					>
						<IconClock className="size-3.5 text-muted-foreground" />
						{effective} {unit}
						{label && <span className="text-[10px] text-muted-foreground">{label}</span>}
					</span>
				)}

				<Popover
					open={open}
					onOpenChange={(o) => {
						setOpen(o);
						if (o) setDraft(String(effective));
					}}
				>
					<PopoverTrigger asChild>
						{isEmpty && addLabel ? (
							<button
								type="button"
								disabled={disabled}
								className="flex w-fit items-center gap-0.5 text-[11px] text-primary hover:underline disabled:opacity-50"
							>
								<IconPlus className="size-3" />
								{addLabel}
							</button>
						) : (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-5 text-muted-foreground hover:text-primary"
								disabled={disabled}
								aria-label="تعديل"
							>
								<IconPencil className="size-3.5" />
							</Button>
						)}
					</PopoverTrigger>
					<PopoverContent
						dir="rtl"
						align="start"
						className="w-[220px] p-3"
					>
						<div className="flex flex-col gap-2">
							<Label className="text-[11px]">القيمة اليدوية ({unit})</Label>
							<Input
								type="number"
								min={0}
								step="0.5"
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								className="h-8 text-[12px] tabular-nums"
							/>
							<span className="text-[10px] text-muted-foreground">
								المقترح من السجل: {suggested} {unit}
							</span>
							<div className="flex gap-1.5">
								<Button
									type="button"
									size="sm"
									className="h-7 flex-1 text-[11px]"
									onClick={() => {
										onSave(Number(draft));
										setOpen(false);
									}}
								>
									حفظ
								</Button>
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="h-7 text-[11px]"
									onClick={() => setOpen(false)}
								>
									إلغاء
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{/* العودة للمقترح متاحة فقط عند وجود تجاوز */}
				{hasOverride && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-5 text-muted-foreground hover:text-foreground"
						disabled={disabled}
						onClick={onClear}
						aria-label="الرجوع للمقترح"
						title={`العودة للمقترح (${suggested} ${unit})`}
					>
						<IconRotateClockwise className="size-3.5" />
					</Button>
				)}
			</div>

			{hasOverride && (
				<span className="text-[10px] text-muted-foreground tabular-nums">
					المقترح: {suggested} {unit}
				</span>
			)}
		</div>
	);
}

// ─── استحقاق إضافي ────────────────────────────────────────────

const EARNING_TYPES: PayrollEarningType[] = [
	"ALLOWANCE",
	"BONUS",
	"COMMISSION",
	"EXPENSE_REIMBURSEMENT",
];

export function EarningsEditor({
	line,
	onAdd,
	onRemove,
	disabled,
}: {
	line: PayrollLineResponse;
	onAdd: (type: PayrollEarningType, amount: number, note: string) => void;
	onRemove: (earningId: string) => void;
	disabled?: boolean;
}) {
	const { format } = useCurrency();
	const [open, setOpen] = useState(false);
	const [type, setType] = useState<PayrollEarningType>("BONUS");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");

	const reset = () => {
		setType("BONUS");
		setAmount("");
		setNote("");
	};

	return (
		<div className="flex flex-col gap-1">
			{line.earnings.map((e) => (
				<span
					key={e.id}
					className="flex items-center gap-1 text-[11px] text-foreground"
				>
					<span className="text-muted-foreground">{EARNING_TYPE_LABEL[e.type]}</span>
					<span className="font-medium tabular-nums">{format(e.amount)}</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-4 text-muted-foreground hover:text-destructive"
						disabled={disabled}
						onClick={() => onRemove(e.id)}
						aria-label="حذف الاستحقاق"
					>
						<IconX className="size-3" />
					</Button>
				</span>
			))}

			<Popover
				open={open}
				onOpenChange={(o) => {
					setOpen(o);
					if (!o) reset();
				}}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						disabled={disabled}
						className="flex w-fit items-center gap-0.5 text-[11px] text-primary hover:underline disabled:opacity-50"
					>
						<IconPlus className="size-3" />
						استحقاق إضافي
					</button>
				</PopoverTrigger>
				<PopoverContent
					dir="rtl"
					align="start"
					className="w-[260px] p-3"
				>
					<div className="flex flex-col gap-2.5">
						<div className="flex flex-col gap-1.5">
							<Label className="text-[11px]">نوع الاستحقاق</Label>
							<div className="flex flex-wrap gap-1">
								{EARNING_TYPES.map((t) => (
									<button
										key={t}
										type="button"
										onClick={() => setType(t)}
										className={cn(
											"rounded-[4px] border px-2 py-1 text-[10px] transition-colors",
											type === t
												? "border-primary bg-primary/[0.08] text-primary"
												: "border-border text-muted-foreground hover:bg-muted/40",
										)}
									>
										{EARNING_TYPE_LABEL[t]}
									</button>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-[11px]">المبلغ (ر.س)</Label>
							<Input
								type="number"
								min={0}
								step="0.01"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="h-8 text-[12px] tabular-nums"
							/>
						</div>

						<div className="flex gap-1.5">
							<Button
								type="button"
								size="sm"
								className="h-7 flex-1 text-[11px]"
								disabled={!amount || Number(amount) <= 0}
								onClick={() => {
									onAdd(type, Number(amount), note);
									setOpen(false);
									reset();
								}}
							>
								حفظ
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="h-7 text-[11px]"
								onClick={() => setOpen(false)}
							>
								إلغاء
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

// ─── ملاحظة على السطر ─────────────────────────────────────────

export function NoteEditor({
	note,
	onSave,
	disabled,
}: {
	note: string | null;
	onSave: (value: string | null) => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(note ?? "");

	return (
		<Popover
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (o) setDraft(note ?? "");
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					disabled={disabled}
					className={cn(
						"flex w-fit items-center gap-0.5 text-[11px] hover:underline disabled:opacity-50",
						note ? "text-foreground" : "text-primary",
					)}
					title={note ?? undefined}
				>
					{note ? (
						<>
							<IconNote className="size-3 shrink-0" />
							<span className="max-w-[110px] truncate">{note}</span>
						</>
					) : (
						<>
							<IconPlus className="size-3" />
							ملاحظة
						</>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent
				dir="rtl"
				align="start"
				className="w-[240px] p-3"
			>
				<div className="flex flex-col gap-2">
					<Label className="text-[11px]">ملاحظة على سطر الراتب</Label>
					<Textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						rows={3}
						className="text-[12px]"
						placeholder="سبب التعديل أو ملاحظة للمراجعة..."
					/>
					<div className="flex gap-1.5">
						<Button
							type="button"
							size="sm"
							className="h-7 flex-1 text-[11px]"
							onClick={() => {
								onSave(draft.trim() || null);
								setOpen(false);
							}}
						>
							حفظ
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="h-7 text-[11px]"
							onClick={() => setOpen(false)}
						>
							إلغاء
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

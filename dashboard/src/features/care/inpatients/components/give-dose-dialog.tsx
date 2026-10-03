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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useGiveAdministration,
	useSkipAdministration,
} from "@/features/care/inpatients/hooks/use-inpatients";
import { cn } from "@/lib/utils";

/**
 * نافذة تنفيذ الجرعة — إعطاء أو تخطٍّ أو إيقاف.
 *
 * التخطّي يطلب سببًا إلزاميًّا كما يفعل الخادم: «لم تُعطَ» بلا سبب سطرٌ لا يُقرأ
 * منه شيء بعد أسبوع، والسبب هو ما يميّز «رفض الطفل الأكل» عن «نُسيت».
 *
 * الكمّية المخصومة من المخزون منفصلة عن الجرعة السريرية بحقلَين: الأولى بوحدات
 * المخزون (أمبولة) والثانية بوحدات الدواء (مجم). دمجُهما هو ما يجعل الصيدلية
 * تختلف مع الدفتر.
 */

type Administration = {
	id: string;
	dueAt: string | Date;
	order: {
		nameSnapshot: string;
		doseAmount: string | number | null;
		doseUnit: string | null;
		route: string | null;
		kind: string;
		instructionsAr: string | null;
	};
};

type Mode = "give" | "skip" | "hold";

export function GiveDoseDialog({
	stayId,
	administration,
	open,
	onOpenChange,
}: {
	stayId: string;
	administration: Administration;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [mode, setMode] = useState<Mode>("give");
	const [doseGivenAmount, setDoseGivenAmount] = useState(
		administration.order.doseAmount != null ? String(administration.order.doseAmount) : "",
	);
	const [stockQuantity, setStockQuantity] = useState("");
	const [notesAr, setNotesAr] = useState("");
	const [reason, setReason] = useState("");
	const [eatenFraction, setEatenFraction] = useState("");

	const give = useGiveAdministration(stayId);
	const skip = useSkipAdministration(stayId);
	const isPending = give.isPending || skip.isPending;
	const isFeeding = administration.order.kind === "FEEDING";

	const submit = () => {
		if (mode === "give") {
			give.mutate(
				{
					administrationId: administration.id,
					doseGivenAmount: doseGivenAmount ? Number(doseGivenAmount) : null,
					doseGivenUnit: administration.order.doseUnit,
					stockQuantity: stockQuantity ? Number(stockQuantity) : null,
					notesAr: notesAr || null,
					eatenFraction: isFeeding && eatenFraction ? Number(eatenFraction) : null,
				},
				{ onSuccess: () => onOpenChange(false) },
			);
			return;
		}
		skip.mutate(
			{
				administrationId: administration.id,
				skipReasonAr: reason,
				hold: mode === "hold",
			},
			{ onSuccess: () => onOpenChange(false) },
		);
	};

	const canSubmit = mode === "give" ? !isPending : reason.trim().length >= 3 && !isPending;

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-lg"
			>
				<DialogHeader className="border-b px-4 py-2 text-start">
					<DialogTitle className="text-base">{administration.order.nameSnapshot}</DialogTitle>
					<DialogDescription className="text-xs">
						مستحقّ{" "}
						{new Date(administration.dueAt).toLocaleTimeString("ar", {
							hour: "2-digit",
							minute: "2-digit",
						})}
						{administration.order.route ? ` · ${administration.order.route}` : ""}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 p-4">
					{administration.order.instructionsAr && (
						<p className="rounded border-s-2 border-primary bg-muted/50 px-3 py-2 text-xs">
							{administration.order.instructionsAr}
						</p>
					)}

					{/* اختيار الفعل — ثلاثة أزرار لا قائمة منسدلة: القرار يُتّخذ بضغطة */}
					<div className="grid grid-cols-3 gap-2">
						<ModeButton
							active={mode === "give"}
							onClick={() => setMode("give")}
						>
							أُعطيت
						</ModeButton>
						<ModeButton
							active={mode === "skip"}
							onClick={() => setMode("skip")}
						>
							تُخطّيت
						</ModeButton>
						<ModeButton
							active={mode === "hold"}
							onClick={() => setMode("hold")}
						>
							إيقاف
						</ModeButton>
					</div>

					{mode === "give" ? (
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label
										htmlFor="dose"
										className="text-xs"
									>
										الجرعة المُعطاة {administration.order.doseUnit ?? ""}
									</Label>
									<Input
										id="dose"
										inputMode="decimal"
										value={doseGivenAmount}
										onChange={(e) => setDoseGivenAmount(e.target.value)}
										disabled={isPending}
									/>
								</div>
								<div className="space-y-1.5">
									<Label
										htmlFor="stock"
										className="text-xs"
									>
										المخصوم من المخزون (وحدات)
									</Label>
									<Input
										id="stock"
										inputMode="numeric"
										placeholder="اتركه فارغًا إن لم يُخصم"
										value={stockQuantity}
										onChange={(e) => setStockQuantity(e.target.value)}
										disabled={isPending}
									/>
								</div>
							</div>

							{isFeeding && (
								<div className="space-y-1.5">
									<Label
										htmlFor="eaten"
										className="text-xs"
									>
										ما أُكل من الوجبة (٠–١)
									</Label>
									<Input
										id="eaten"
										inputMode="decimal"
										placeholder="0.5 = نصف الوجبة"
										value={eatenFraction}
										onChange={(e) => setEatenFraction(e.target.value)}
										disabled={isPending}
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<Label
									htmlFor="notes"
									className="text-xs"
								>
									ملاحظة (اختياري)
								</Label>
								<Textarea
									id="notes"
									rows={2}
									value={notesAr}
									onChange={(e) => setNotesAr(e.target.value)}
									disabled={isPending}
								/>
							</div>
						</div>
					) : (
						<div className="space-y-1.5">
							<Label
								htmlFor="reason"
								className="text-xs"
							>
								السبب <span className="text-destructive">*</span>
							</Label>
							<Textarea
								id="reason"
								rows={3}
								placeholder={
									mode === "hold"
										? "أوقف المدرّب هذه الجرعة لأن…"
										: "رفض الطفل الأكل / نُزعت القسطرة / …"
								}
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								disabled={isPending}
							/>
							<p className="text-[11px] text-muted-foreground">
								السبب يظهر في سجل الإقامة — هو ما يميّز قرارًا عن نسيان.
							</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
					<Button
						size="sm"
						disabled={!canSubmit}
						onClick={submit}
					>
						حفظ
					</Button>
					<Button
						size="sm"
						variant="ghost"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function ModeButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"h-10 rounded border text-sm transition-colors",
				active
					? "border-primary bg-primary/10 font-medium text-primary"
					: "border-border text-muted-foreground hover:bg-accent",
			)}
		>
			{children}
		</button>
	);
}

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCrmLostReasons } from "@/features/crm/hooks/use-crm-masters";

/**
 * [CRM-P1] BR-C3.3 — moving a lead into a LOST-kind status requires a reason. The server
 * refuses without one; this dialog is how the UI collects it instead of showing the user a
 * 400. Cancelling must leave the lead where it was, so the caller reverts its optimistic
 * move on `onOpenChange(false)`.
 */
export const LostReasonDialog = ({
	open,
	leadName,
	isSubmitting,
	onConfirm,
	onCancel,
}: {
	open: boolean;
	leadName: string;
	isSubmitting: boolean;
	onConfirm: (input: { lostReasonId: string; lostNotes?: string }) => void;
	onCancel: () => void;
}) => {
	const { lostReasons, isLoading } = useCrmLostReasons();
	const [lostReasonId, setLostReasonId] = useState("");
	const [lostNotes, setLostNotes] = useState("");
	const [touched, setTouched] = useState(false);

	// a fresh drag must not inherit the previous attempt's selection
	useEffect(() => {
		if (open) {
			setLostReasonId("");
			setLostNotes("");
			setTouched(false);
		}
	}, [open]);

	const invalid = touched && !lostReasonId;

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onCancel();
			}}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-y-auto sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>سبب الفقد</DialogTitle>
					<DialogDescription>
						نقل «{leadName}» إلى حالة «مفقود» يوجب تسجيل السبب (BR-C3.3).
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Field data-invalid={invalid}>
						<Label htmlFor="crm-lost-reason">السبب</Label>
						<Select
							value={lostReasonId}
							onValueChange={setLostReasonId}
							disabled={isSubmitting}
						>
							<SelectTrigger
								id="crm-lost-reason"
								aria-invalid={invalid}
								className="w-full"
							>
								<SelectValue placeholder={isLoading ? "جارٍ التحميل..." : "اختر سببًا"} />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{lostReasons.map((reason) => (
									<SelectItem
										key={reason.id}
										value={reason.id}
									>
										{reason.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{invalid ? <FieldError errors={[{ message: "السبب مطلوب" }]} /> : null}
					</Field>

					<Field>
						<Label htmlFor="crm-lost-notes">ملاحظات (اختياري)</Label>
						<Textarea
							id="crm-lost-notes"
							value={lostNotes}
							onChange={(event) => setLostNotes(event.target.value)}
							disabled={isSubmitting}
							rows={3}
						/>
					</Field>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						إلغاء
					</Button>
					<Button
						onClick={() => {
							setTouched(true);
							if (!lostReasonId) return;
							onConfirm({
								lostReasonId,
								...(lostNotes.trim() ? { lostNotes: lostNotes.trim() } : {}),
							});
						}}
						disabled={isSubmitting}
					>
						تأكيد الفقد
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

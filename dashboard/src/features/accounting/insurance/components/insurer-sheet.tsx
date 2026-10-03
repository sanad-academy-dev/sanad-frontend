import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useSaveInsurer } from "@/features/accounting/insurance/hooks/use-insurance";
import type { InsurerResponse } from "@/server/accounting/insurance/insurer.type";
import { insurerSchema } from "@sanad/contracts/runtime/server/accounting/insurance/insurer.type";

/**
 * [MI-P3] Insurer create/edit sheet (MI §8.1). Correction #8: NO account field here —
 * a per-insurer AR override is a `party_account` row on «حسابات الأطراف», and the hint
 * says exactly that so nobody goes looking for a picker that intentionally doesn't exist.
 */

type Draft = {
	name: string;
	contactPerson: string;
	phone: string;
	email: string;
	address: string;
	settlementDays: string;
	notes: string;
};

const EMPTY: Draft = {
	name: "",
	contactPerson: "",
	phone: "",
	email: "",
	address: "",
	settlementDays: "30",
	notes: "",
};

export const InsurerSheet = ({
	open,
	onOpenChange,
	insurer,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	insurer: InsurerResponse | null;
}) => {
	const { saveInsurer, isPending } = useSaveInsurer();
	const [draft, setDraft] = useState<Draft>(EMPTY);

	useEffect(() => {
		if (!open) return;
		setDraft(
			insurer
				? {
						name: insurer.name,
						contactPerson: insurer.contactPerson ?? "",
						phone: insurer.phone ?? "",
						email: insurer.email ?? "",
						address: insurer.address ?? "",
						settlementDays: String(insurer.settlementDays),
						notes: insurer.notes ?? "",
					}
				: EMPTY,
		);
	}, [open, insurer]);

	const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

	const submit = async () => {
		const parsed = insurerSchema.safeParse({
			name: draft.name,
			contactPerson: draft.contactPerson.trim() || null,
			phone: draft.phone.trim() || null,
			email: draft.email.trim() || null,
			address: draft.address.trim() || null,
			settlementDays: draft.settlementDays,
			notes: draft.notes.trim() || null,
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "المدخلات غير صالحة");
			return;
		}
		await saveInsurer({ id: insurer?.id, insurer: parsed.data });
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={insurer ? `تعديل «${insurer.name}»` : "شركة تأمين جديدة"}
			description="حساب الذمم المخصص للشركة (إن لزم) يُضبط من «حسابات الأطراف» — لا حقل له هنا عمدًا"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
			isSaving={isPending}
			submitLabel={insurer ? "حفظ" : "إنشاء"}
		>
			<div className="flex flex-col gap-4 p-4">
				<Field>
					<Label htmlFor="ins-name">اسم الشركة</Label>
					<Input
						id="ins-name"
						value={draft.name}
						onChange={(e) => set({ name: e.target.value })}
						placeholder="شركة التأمين الوطنية"
					/>
				</Field>
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<Label htmlFor="ins-contact">جهة التواصل (مكتب المطالبات)</Label>
						<Input
							id="ins-contact"
							value={draft.contactPerson}
							onChange={(e) => set({ contactPerson: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ins-phone">الهاتف</Label>
						<Input
							id="ins-phone"
							dir="ltr"
							value={draft.phone}
							onChange={(e) => set({ phone: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ins-email">البريد الإلكتروني</Label>
						<Input
							id="ins-email"
							dir="ltr"
							value={draft.email}
							onChange={(e) => set({ email: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="ins-days">مهلة السداد المتوقعة (أيام)</Label>
						<Input
							id="ins-days"
							type="number"
							min={0}
							value={draft.settlementDays}
							onChange={(e) => set({ settlementDays: e.target.value })}
						/>
					</Field>
				</div>
				<Field>
					<Label htmlFor="ins-address">العنوان</Label>
					<Input
						id="ins-address"
						value={draft.address}
						onChange={(e) => set({ address: e.target.value })}
					/>
				</Field>
				<Field>
					<Label htmlFor="ins-notes">ملاحظات</Label>
					<Textarea
						id="ins-notes"
						value={draft.notes}
						onChange={(e) => set({ notes: e.target.value })}
					/>
				</Field>
			</div>
		</AccountingFormSheet>
	);
};

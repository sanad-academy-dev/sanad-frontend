import { useEffect, useState } from "react";

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCreatePosProfile } from "@/features/accounting/extended/hooks/use-pos-shift";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";

/**
 * [P12.15] Create a POS profile — the master a shift opens against (§16).
 *
 * It exists in the ACCOUNTING hub rather than in the till because the two fields that matter
 * are accounting decisions, not cashier ones: which account absorbs a drawer difference, and
 * how large a difference may be absorbed silently. A cashier must not be able to raise their
 * own write-off limit, so the screen that sets it lives behind `mode_of_payment.write` — the
 * same permission the endpoint checks.
 *
 * NO CASHIER LIST HERE, DELIBERATELY. The server treats an empty user list as "any user may
 * open a shift on this profile", which is the right default for a single-till clinic and the
 * only behavior with an endpoint behind it. Restricting a profile to named cashiers needs a
 * clinic-users lookup that does not exist yet; inventing one is out of scope (rule 6) and the
 * gap is recorded in IMPLEMENTATION_PHASES.
 */

const AMOUNT_PATTERN = /^\d+(\.\d{1,9})?$/;
const NONE = "__none__";

export const PosProfileSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { createProfile, isPending } = useCreatePosProfile();
	const { accounts } = useAccounts();
	const { warehouses } = useWarehouses();

	const [name, setName] = useState("");
	const [writeOffLimit, setWriteOffLimit] = useState("0");
	const [writeOffAccountId, setWriteOffAccountId] = useState<string>(NONE);
	const [warehouseId, setWarehouseId] = useState<string>(NONE);

	useEffect(() => {
		if (!open) return;
		setName("");
		setWriteOffLimit("0");
		setWriteOffAccountId(NONE);
		setWarehouseId(NONE);
	}, [open]);

	// نفس مرآة assertPostableAccount: الأوراق القابلة للترحيل فقط
	const postable = accounts.filter((a) => !a.isGroup && !a.freezeAccount && !a.disabled);
	const accountLabel = (id: string) => {
		const account = accounts.find((a) => a.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	const limitInvalid = !AMOUNT_PATTERN.test(writeOffLimit.trim());
	const nameInvalid = name.trim() === "";

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (nameInvalid || limitInvalid) return;
		createProfile({
			name: name.trim(),
			writeOffLimit: writeOffLimit.trim(),
			writeOffAccountId: writeOffAccountId === NONE ? null : writeOffAccountId,
			warehouseId: warehouseId === NONE ? null : warehouseId,
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="ملف نقطة بيع جديد"
			description="الملف يحمل قرارَي الإقفال: أي حساب يستقبل فرق الدرج، وكم فرقًا يُقبل شطبه تلقائيًا (§16)."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="إنشاء"
			submitDisabled={nameInvalid || limitInvalid}
		>
			<Field data-invalid={nameInvalid}>
				<Label>
					اسم الملف <span className="text-rose-500">*</span>
				</Label>
				<Input
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder="مثال: كاشير الاستقبال"
					aria-invalid={nameInvalid}
					disabled={isPending}
				/>
			</Field>

			<Field data-invalid={limitInvalid}>
				<Label>
					حدّ الشطب <span className="text-rose-500">*</span>
				</Label>
				<Input
					dir="ltr"
					inputMode="decimal"
					className="text-end tabular-nums"
					value={writeOffLimit}
					onChange={(event) => setWriteOffLimit(event.target.value)}
					aria-invalid={limitInvalid}
					disabled={isPending}
				/>
				<p className="text-muted-foreground text-xs">
					أكبر فرق درج يُقبل ترحيله تلقائيًا عند الإقفال. صفر = أي فرق يُقبل شطبه (لا حدّ)؛ قيمة
					موجبة تعني أن ما فوقها يُرفض ويحتاج قرارًا إداريًا.
				</p>
			</Field>

			<Field>
				<Label>حساب فروق الدرج</Label>
				<Combobox
					value={writeOffAccountId}
					onValueChange={(value) =>
						setWriteOffAccountId(typeof value === "string" ? value : NONE)
					}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="بلا حساب — الإقفال بفرق سيُرفض"
							className="truncate"
						>
							{writeOffAccountId === NONE ? undefined : accountLabel(writeOffAccountId)}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							<ComboboxItem value={NONE}>— بلا حساب —</ComboboxItem>
							{postable.length === 0 ? (
								<ComboboxEmpty>لا حسابات قابلة للترحيل</ComboboxEmpty>
							) : (
								postable.map((account) => (
									<ComboboxItem
										key={account.id}
										value={account.id}
									>
										<span className="truncate">{accountLabel(account.id)}</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<p className="text-muted-foreground text-xs">
					بلا حساب، أي وردية تُقفل بفرق ستُرفض — الفرق لا بدّ أن يجد طرفًا في الدفتر.
				</p>
			</Field>

			<Field>
				<Label>المستودع</Label>
				<Combobox
					value={warehouseId}
					onValueChange={(value) => setWarehouseId(typeof value === "string" ? value : NONE)}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="اختياري"
							className="truncate"
						>
							{warehouseId === NONE
								? undefined
								: (warehouses.find((w) => w.id === warehouseId)?.name ?? warehouseId)}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							<ComboboxItem value={NONE}>— بلا مستودع —</ComboboxItem>
							{warehouses.length === 0 ? (
								<ComboboxEmpty>لا مستودعات</ComboboxEmpty>
							) : (
								warehouses.map((warehouse) => (
									<ComboboxItem
										key={warehouse.id}
										value={warehouse.id}
									>
										<span className="truncate">{warehouse.name}</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<p className="text-muted-foreground text-xs">
				أي مستخدم يستطيع فتح وردية على هذا الملف — هذا سلوك الخادم الافتراضي حين لا تُحدَّد قائمة
				كاشيرات، وتقييدها بأسماء بعينها ما زال غير متاح من الواجهة.
			</p>
		</AccountingFormSheet>
	);
};

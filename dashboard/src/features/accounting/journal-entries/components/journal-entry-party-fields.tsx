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
import { usePartyOpenVouchers } from "@/features/accounting/parties/hooks/use-parties";
import {
	PARTY_TYPES,
	type PartyListRow,
	type PartyTypeKey,
	partySideOf,
} from "@sanad/contracts/runtime/server/accounting/party/party.type";

/**
 * [P3.3/P3.4] The AR/AP sub-row of a JE grid line: party picker (BR-4.3.3, mandatory)
 * plus the optional «تسوية مقابل» reference picker (BR-7.1.2) listing the party's open
 * vouchers from the payment ledger. Its own component so the open-vouchers query is a
 * real hook keyed by the selected party.
 */

export type JournalEntryPartyFieldsProps = {
	side: "RECEIVABLE" | "PAYABLE";
	partyType: string | null;
	partyId: string | null;
	referenceId: string | null;
	disabled?: boolean;
	parties: PartyListRow[];
	onPartyChange: (partyType: PartyTypeKey | null, partyId: string | null) => void;
	onReferenceChange: (referenceType: string | null, referenceId: string | null) => void;
};

const typeLabelOf = (key: string) => PARTY_TYPES.find((d) => d.key === key)?.labelAr ?? key;

export const JournalEntryPartyFields = ({
	side,
	partyType,
	partyId,
	referenceId,
	disabled,
	parties,
	onPartyChange,
	onReferenceChange,
}: JournalEntryPartyFieldsProps) => {
	const eligible = parties.filter((p) => partySideOf(p.partyType) === side);
	const { openVouchers } = usePartyOpenVouchers(
		partyType && partyId ? (partyType as PartyTypeKey) : null,
		partyId,
	);

	const partyLabel = (type: string | null, id: string | null) => {
		const party = eligible.find((p) => p.partyType === type && p.partyId === id);
		return party ? `${typeLabelOf(party.partyType)} — ${party.name}` : undefined;
	};

	const NONE = "__none__";

	return (
		<div className="ms-4 me-40 flex items-start gap-2">
			<Field className="flex-1">
				<Combobox
					value={partyId ?? ""}
					onValueChange={(value) => {
						const id = typeof value === "string" ? value : "";
						const party = eligible.find((p) => p.partyId === id);
						onPartyChange(party?.partyType ?? null, id || null);
					}}
				>
					<ComboboxTrigger
						className="flex h-8 w-full items-center justify-between rounded-[4px] border border-input border-dashed bg-transparent px-3 py-1.5 text-xs"
						aria-disabled={disabled}
					>
						<ComboboxValue
							placeholder={
								side === "RECEIVABLE"
									? "الطرف (عميل) — مطلوب لحساب الذمم *"
									: "الطرف (مورّد/موظف) — مطلوب لحساب الذمم *"
							}
							className="truncate"
						>
							{partyLabel(partyType, partyId)}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							{eligible.length === 0 ? (
								<ComboboxEmpty>لا أطراف من هذا الجانب</ComboboxEmpty>
							) : (
								eligible.map((party) => (
									<ComboboxItem
										key={`${party.partyType}:${party.partyId}`}
										value={party.partyId}
									>
										<span className="truncate">
											{`${typeLabelOf(party.partyType)} — ${party.name}`}
										</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			{/* [P3.4] settle-against — appears once a party is chosen */}
			{partyId && (
				<Field className="w-64">
					<Combobox
						value={referenceId ?? NONE}
						onValueChange={(value) => {
							const id = typeof value === "string" && value !== NONE ? value : null;
							const target = openVouchers.find((v) => v.voucherId === id);
							onReferenceChange(target?.voucherType ?? null, id);
						}}
					>
						<ComboboxTrigger
							className="flex h-8 w-full items-center justify-between rounded-[4px] border border-input border-dashed bg-transparent px-3 py-1.5 text-xs"
							aria-disabled={disabled}
						>
							<ComboboxValue
								placeholder="تسوية مقابل (اختياري)"
								className="truncate"
							>
								{referenceId
									? (() => {
											const v = openVouchers.find((x) => x.voucherId === referenceId);
											return v
												? `${v.voucherNo ?? v.voucherId} — المستحق ${v.outstanding}`
												: referenceId;
										})()
									: undefined}
							</ComboboxValue>
						</ComboboxTrigger>
						<ComboboxContent dir="rtl">
							<ComboboxList>
								<ComboboxItem value={NONE}>— بدون تسوية —</ComboboxItem>
								{openVouchers.length === 0 ? (
									<ComboboxEmpty>لا مستندات مفتوحة لهذا الطرف</ComboboxEmpty>
								) : (
									openVouchers.map((voucher) => (
										<ComboboxItem
											key={`${voucher.voucherType}:${voucher.voucherId}`}
											value={voucher.voucherId}
										>
											<span className="truncate">
												{voucher.voucherNo ?? voucher.voucherId}
											</span>
											<span
												dir="ltr"
												className="ms-auto font-mono text-muted-foreground text-[10px]"
											>
												{voucher.outstanding}
											</span>
										</ComboboxItem>
									))
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</Field>
			)}
		</div>
	);
};

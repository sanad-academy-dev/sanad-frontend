import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldError, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useAccountingDimensionActions } from "@/features/accounting/governance/hooks/use-accounting-dimensions";
import {
	type AccountingDimensionResponse,
	type UpsertAccountingDimensionFormInput,
	upsertAccountingDimensionSchema,
} from "@sanad/contracts/runtime/server/accounting/accounting-dimension/accounting-dimension.type";

/**
 * [P11.6] Edit sheet for one dimension slot (§4.5). The upsert form drives PUT /dimensions;
 * the filter block underneath is a separate pair of actions (PUT/DELETE /:id/filter) on
 * plain local state — it only appears once the dimension row exists. The offsetting
 * account mirrors the server rule (BR-4.5.3 — a leaf account, required when auto-post is
 * on).
 */

type DimensionFormInput = z.input<typeof upsertAccountingDimensionSchema>;

/** Radix Select forbids an empty item value — sentinel for «بدون حساب موازنة». */
const NO_OFFSET = "__none__";

const emptyToNull = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? null : value;

export type DimensionSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	slot: number;
	/** when set, the sheet edits this defined dimension; otherwise it defines the slot */
	editing?: AccountingDimensionResponse | null;
};

export const DimensionSheet = ({ open, onOpenChange, slot, editing }: DimensionSheetProps) => {
	const { accounts } = useAccounts();
	const { upsert, setFilter, clearFilter, isPending } = useAccountingDimensionActions();
	const isEdit = !!editing;

	const leafAccounts = useMemo(
		() => accounts.filter((account) => !account.isGroup),
		[accounts],
	);
	const accountName = (id: string): string =>
		leafAccounts.find((account) => account.id === id)?.accountName ?? id;

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<DimensionFormInput, unknown, UpsertAccountingDimensionFormInput>({
		resolver: zodResolver(upsertAccountingDimensionSchema),
	});
	const autoPost = watch("autoPostBalancingEntry") ?? false;

	// the filter actions are their own endpoints, not part of the upsert form
	const currentFilter = editing?.filters[0] ?? null;
	const [allowOnly, setAllowOnly] = useState(true);
	const [filterAccountIds, setFilterAccountIds] = useState<string[]>([]);
	const [dimValuesText, setDimValuesText] = useState("");

	useEffect(() => {
		if (!open) return;
		reset({
			slot,
			dimensionName: editing?.dimensionName ?? "",
			referenceDoctype: editing?.referenceDoctype ?? null,
			disabled: editing?.disabled ?? false,
			mandatoryForBalanceSheet: editing?.mandatoryForBalanceSheet ?? false,
			mandatoryForProfitAndLoss: editing?.mandatoryForProfitAndLoss ?? false,
			defaultDimensionValue: editing?.defaultDimensionValue ?? null,
			autoPostBalancingEntry: editing?.autoPostBalancingEntry ?? false,
			offsettingAccountId: editing?.offsettingAccountId ?? null,
		});
		const filter = editing?.filters[0] ?? null;
		setAllowOnly(filter?.allowOnly ?? true);
		setFilterAccountIds(filter?.accounts.map((row) => row.accountId) ?? []);
		setDimValuesText(filter?.values.map((row) => row.dimValue).join("\n") ?? "");
	}, [open, editing, slot, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		upsert(values);
		onOpenChange(false);
	});

	const parsedDimValues = dimValuesText
		.split(/[\n,]/)
		.map((value) => value.trim())
		.filter(Boolean);

	const saveFilter = () => {
		if (!editing) return;
		setFilter(editing.id, {
			allowOnly,
			disabled: false,
			accountIds: filterAccountIds,
			dimValues: parsedDimValues,
		});
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? `تعديل البعد — الخانة ${slot}` : `تعريف البعد — الخانة ${slot}`}
			description="بعد تحليلي يُختم على قيود الأستاذ (§4.5) — التفعيل الكلي من مفتاح «تفعيل الأبعاد المحاسبية» أعلى القائمة."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel={isEdit ? "حفظ" : "تعريف"}
		>
			<Field data-invalid={!!errors.dimensionName}>
				<Label>
					اسم البعد <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.dimensionName}
					placeholder="مثال: الفرع، الحملة، المشروع..."
					{...register("dimensionName")}
					disabled={isPending}
				/>
				<FieldError errors={[errors.dimensionName]} />
			</Field>

			<Field data-invalid={!!errors.referenceDoctype}>
				<Label>نوع المستند المرجعي (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.referenceDoctype}
					placeholder="Branch"
					{...register("referenceDoctype", { setValueAs: emptyToNull })}
					disabled={isPending}
				/>
				<FieldError errors={[errors.referenceDoctype]} />
			</Field>

			<Field data-invalid={!!errors.defaultDimensionValue}>
				<Label>القيمة الافتراضية (اختياري)</Label>
				<Input
					aria-invalid={!!errors.defaultDimensionValue}
					{...register("defaultDimensionValue", { setValueAs: emptyToNull })}
					disabled={isPending}
				/>
				<FieldError errors={[errors.defaultDimensionValue]} />
			</Field>

			<Controller
				name="mandatoryForBalanceSheet"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>إلزامي لحسابات الميزانية</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</Field>
				)}
			/>

			<Controller
				name="mandatoryForProfitAndLoss"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>إلزامي لحسابات الأرباح والخسائر</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</Field>
				)}
			/>

			<Controller
				name="autoPostBalancingEntry"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>ترحيل قيد موازنة تلقائي للبعد</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</Field>
				)}
			/>

			<Controller
				name="offsettingAccountId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.offsettingAccountId}>
						<Label>
							حساب الموازنة
							{autoPost ? <span className="text-rose-500"> *</span> : " (اختياري)"}
						</Label>
						<Select
							value={field.value ?? NO_OFFSET}
							onValueChange={(value) => field.onChange(value === NO_OFFSET ? null : value)}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger aria-invalid={!!errors.offsettingAccountId}>
								<SelectValue placeholder="اختر حسابًا ورقيًا..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value={NO_OFFSET}>بدون</SelectItem>
								{leafAccounts.map((account) => (
									<SelectItem
										key={account.id}
										value={account.id}
									>
										{account.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.offsettingAccountId]} />
					</Field>
				)}
			/>

			<Controller
				name="disabled"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>معطّل</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</Field>
				)}
			/>

			{isEdit && editing ? (
				<>
					<FieldSeparator>فلتر القيم</FieldSeparator>

					<FieldDescription>
						{currentFilter
							? `فلتر حالي: ${currentFilter.allowOnly ? "السماح فقط" : "المنع"} — ${currentFilter.accounts.length} حساب و${currentFilter.values.length} قيمة.`
							: "لا فلتر — كل القيم مسموحة على كل الحسابات."}
					</FieldDescription>

					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>السماح بالقيم المحددة فقط</Label>
						<Switch
							checked={allowOnly}
							onCheckedChange={setAllowOnly}
							disabled={isPending}
						/>
					</Field>

					<Field>
						<Label>الحسابات المشمولة بالفلتر</Label>
						<Combobox
							multiple
							value={filterAccountIds}
							onValueChange={(value) =>
								setFilterAccountIds(Array.isArray(value) ? value : value ? [value] : [])
							}
						>
							<ComboboxChips className="min-h-8 gap-1 px-2 py-1">
								{filterAccountIds.map((id) => (
									<ComboboxChip
										key={id}
										value={id}
										className="text-xs"
									>
										{accountName(id)}
									</ComboboxChip>
								))}
								<ComboboxChipsInput
									className="text-xs"
									placeholder="ابحث عن حساب..."
								/>
							</ComboboxChips>
							<ComboboxContent dir="rtl">
								<ComboboxEmpty>لا نتائج</ComboboxEmpty>
								<ComboboxList>
									{leafAccounts.map((account) => (
										<ComboboxItem
											key={account.id}
											value={account.id}
										>
											{account.accountName}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</Field>

					<Field>
						<Label>قيم البعد (قيمة في كل سطر أو مفصولة بفواصل)</Label>
						<Textarea
							value={dimValuesText}
							onChange={(event) => setDimValuesText(event.target.value)}
							disabled={isPending}
						/>
					</Field>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={
								isPending || filterAccountIds.length === 0 || parsedDimValues.length === 0
							}
							onClick={saveFilter}
						>
							حفظ الفلتر
						</Button>
						{currentFilter ? (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								disabled={isPending}
								onClick={() => clearFilter(editing.id)}
							>
								مسح الفلتر
							</Button>
						) : null}
					</div>
				</>
			) : null}
		</AccountingFormSheet>
	);
};

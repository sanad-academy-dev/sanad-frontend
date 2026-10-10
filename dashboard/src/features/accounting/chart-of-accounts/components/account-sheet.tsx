import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAccountActions } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountRootType, AccountType } from "@/generated/prisma/enums";
import {
	type CreateAccountFormInput,
	type CreateAccountFormValues,
	createAccountSchema,
	type LedgerAccountResponse,
} from "@sanad/contracts/runtime/server/accounting/account/account.type";

const ROOT_TYPE_LABEL: Record<AccountRootType, string> = {
	ASSET: "أصول",
	LIABILITY: "خصوم",
	INCOME: "إيرادات",
	EXPENSE: "مصروفات",
	EQUITY: "حقوق ملكية",
};

export type AccountSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this account; otherwise it creates */
	editing?: LedgerAccountResponse | null;
	/** when creating a child, the parent (fixes rootType) */
	parent?: LedgerAccountResponse | null;
};

const DEFAULTS: CreateAccountFormInput = {
	accountName: "",
	accountNumber: null,
	parentAccountId: null,
	isGroup: false,
	rootType: AccountRootType.ASSET,
	accountType: null,
	balanceMustBe: "NONE",
	freezeAccount: false,
	disabled: false,
};

export const AccountSheet = ({ open, onOpenChange, editing, parent }: AccountSheetProps) => {
	const { create, update, isSaving } = useAccountActions();
	const isEdit = !!editing;
	// rootType is fixed when editing (BR-4.3.2) or when adding under a parent
	const fixedRootType = editing?.rootType ?? parent?.rootType ?? null;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAccountFormInput, unknown, CreateAccountFormValues>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				accountName: editing.accountName,
				accountNumber: editing.accountNumber,
				parentAccountId: editing.parentAccountId,
				isGroup: editing.isGroup,
				rootType: editing.rootType,
				accountType: editing.accountType,
				balanceMustBe: editing.balanceMustBe,
				freezeAccount: editing.freezeAccount,
				disabled: editing.disabled,
			});
		} else {
			reset({
				...DEFAULTS,
				parentAccountId: parent?.id ?? null,
				rootType: parent?.rootType ?? AccountRootType.ASSET,
			});
		}
	}, [open, editing, parent, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) {
			update(editing.id, {
				accountName: values.accountName,
				accountNumber: values.accountNumber,
				accountType: values.accountType,
				balanceMustBe: values.balanceMustBe,
				freezeAccount: values.freezeAccount,
				disabled: values.disabled,
				isGroup: values.isGroup,
			});
		} else {
			create(values);
		}
		onOpenChange(false);
	});

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				className="w-full gap-0 p-0 sm:max-w-md!"
			>
				<SheetHeader className="border-b p-4">
					<SheetTitle>{isEdit ? "تعديل حساب" : "حساب جديد"}</SheetTitle>
					<SheetDescription>
						{parent ? `تحت: ${parent.accountName}` : "حساب في جذر الشجرة"}
					</SheetDescription>
				</SheetHeader>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						<Field data-invalid={!!errors.accountName}>
							<Label>
								اسم الحساب <span className="text-rose-500">*</span>
							</Label>
							<Input
								aria-invalid={!!errors.accountName}
								{...register("accountName")}
								disabled={isSaving}
							/>
							<FieldError errors={[errors.accountName]} />
						</Field>

						<Field>
							<Label>رقم الحساب</Label>
							<Input
								dir="ltr"
								{...register("accountNumber")}
								disabled={isSaving}
							/>
						</Field>

						<Controller
							name="rootType"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.rootType}>
									<Label>نوع الجذر</Label>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										dir="rtl"
										disabled={isSaving || fixedRootType !== null}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.values(AccountRootType).map((rt) => (
												<SelectItem
													key={rt}
													value={rt}
												>
													{ROOT_TYPE_LABEL[rt]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.rootType]} />
								</Field>
							)}
						/>

						<Controller
							name="accountType"
							control={control}
							render={({ field }) => (
								<Field>
									<Label>تصنيف الحساب</Label>
									<Select
										value={field.value ?? "__none__"}
										onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
										dir="rtl"
										disabled={isSaving}
									>
										<SelectTrigger>
											<SelectValue placeholder="بدون تصنيف" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="__none__">بدون تصنيف</SelectItem>
											{Object.values(AccountType).map((at) => (
												<SelectItem
													key={at}
													value={at}
												>
													{at}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="isGroup"
							control={control}
							render={({ field }) => (
								<Field
									orientation="horizontal"
									className="justify-between"
								>
									<Label>حساب مجموعة (يحتوي حسابات فرعية)</Label>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSaving}
									/>
								</Field>
							)}
						/>

						<Controller
							name="freezeAccount"
							control={control}
							render={({ field }) => (
								<Field
									orientation="horizontal"
									className="justify-between"
								>
									<Label>تجميد الحساب (منع الترحيل)</Label>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSaving}
									/>
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
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSaving}
									/>
								</Field>
							)}
						/>
					</div>

					<div className="flex justify-end gap-2 border-t px-4 py-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSaving}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							disabled={isSaving}
						>
							{isEdit ? "حفظ" : "إنشاء"}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
};

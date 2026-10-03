import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useOpeningInvoiceActions,
	useOpeningToolStatus,
} from "@/features/accounting/governance/hooks/use-opening-invoices";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import {
	type CreateOpeningInvoicesFormInput,
	createOpeningInvoicesSchema,
	type OpeningInvoiceToolResult,
} from "@sanad/contracts/runtime/server/accounting/opening/opening-invoice-tool.type";
import type { PartyListRow } from "@/server/accounting/party/party.type";

/**
 * [P12A.1] Tab «الافتتاح» (FR-17.3) — the migration grid: each row becomes a SUBMITTED
 * isOpening invoice whose counterpart leg lands on «الافتتاح المؤقت», so legacy AR/AP
 * arrives with its ageing while P&L stays untouched. Per-row failures render below the
 * grid without aborting the batch (the statement-import result pattern).
 */

const EMPTY_ROW = {
	invoiceType: "sales" as const,
	partyId: "",
	postingDate: "",
	dueDate: null,
	legacyNo: null,
	outstanding: "",
};

export const OpeningTab = () => {
	const { status } = useOpeningToolStatus();
	const { parties } = useParties();
	const { createOpeningInvoices, isPending } = useOpeningInvoiceActions();
	const [lastResult, setLastResult] = useState<OpeningInvoiceToolResult | null>(null);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateOpeningInvoicesFormInput>({
		resolver: zodResolver(createOpeningInvoicesSchema),
		defaultValues: { rows: [EMPTY_ROW] },
	});
	const rows = useFieldArray({ control, name: "rows" });

	const onSubmit = handleSubmit(async (values) => {
		try {
			const result = await createOpeningInvoices(values);
			setLastResult(result);
			if (result.errors.length === 0) reset({ rows: [EMPTY_ROW] });
		} catch {
			// toast already reported the failure; keep the grid for correction
		}
	});

	return (
		<div className="min-h-0 flex-1 overflow-y-auto border-t p-4">
			<div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
				<span className="text-muted-foreground">حساب الافتتاح المؤقت:</span>
				{status?.temporaryOpeningAccount ? (
					<Badge variant="secondary">{status.temporaryOpeningAccount.accountName}</Badge>
				) : (
					<Badge variant="outline">سيُنشأ تلقائيًا عند أول تشغيل</Badge>
				)}
				<span className="text-muted-foreground ms-4">
					فواتير افتتاحية معتمدة: مبيعات {status?.openingSalesInvoices ?? 0} · مشتريات{" "}
					{status?.openingPurchaseInvoices ?? 0}
				</span>
				{!status?.defaultCostCenterId && (
					<Badge variant="destructive">
						لا مركز تكلفة افتراضي في إعدادات المحاسبة — عيِّنه أولًا (§4.1)
					</Badge>
				)}
				{status && !status.defaultReceivableAccountId && (
					<Badge variant="destructive">
						لا «حساب الذمم المدينة الافتراضي» — سطور المبيعات سترفض (BR-4.10.1)
					</Badge>
				)}
				{status && !status.defaultPayableAccountId && (
					<Badge variant="destructive">
						لا «حساب الذمم الدائنة الافتراضي» — سطور المشتريات سترفض (BR-4.10.1)
					</Badge>
				)}
			</div>

			<form onSubmit={onSubmit}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">النوع</TableHead>
							<TableHead className="text-start">الطرف</TableHead>
							<TableHead className="text-start">تاريخ الفاتورة</TableHead>
							<TableHead className="text-start">تاريخ الاستحقاق</TableHead>
							<TableHead className="text-start">رقم الفاتورة السابق</TableHead>
							<TableHead className="text-start">المستحق</TableHead>
							<TableHead className="w-10" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.fields.map((field, index) => (
							<TableRow key={field.id}>
								<TableCell className="min-w-28">
									<Controller
										control={control}
										name={`rows.${index}.invoiceType`}
										render={({ field: f }) => (
											<Select
												value={f.value}
												onValueChange={f.onChange}
											>
												<SelectTrigger size="sm">
													<SelectValue />
												</SelectTrigger>
												<SelectContent dir="rtl">
													<SelectItem value="sales">مبيعات (عميل)</SelectItem>
													<SelectItem value="purchase">مشتريات (مورد)</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</TableCell>
								<TableCell className="min-w-44">
									<Controller
										control={control}
										name={`rows.${index}.partyId`}
										render={({ field: f }) => (
											<Field data-invalid={!!errors.rows?.[index]?.partyId}>
												<PartySelect
													parties={parties}
													control={control}
													index={index}
													value={f.value}
													onChange={f.onChange}
												/>
												<FieldError errors={[errors.rows?.[index]?.partyId]} />
											</Field>
										)}
									/>
								</TableCell>
								<TableCell className="min-w-36">
									<Controller
										control={control}
										name={`rows.${index}.postingDate`}
										render={({ field: f }) => (
											<Field data-invalid={!!errors.rows?.[index]?.postingDate}>
												<DateField
													value={f.value}
													onChange={f.onChange}
													placeholder="تاريخ الفاتورة"
												/>
												<FieldError errors={[errors.rows?.[index]?.postingDate]} />
											</Field>
										)}
									/>
								</TableCell>
								<TableCell className="min-w-36">
									<Controller
										control={control}
										name={`rows.${index}.dueDate`}
										render={({ field: f }) => (
											<DateField
												value={f.value ?? ""}
												onChange={f.onChange}
												placeholder="اختياري"
											/>
										)}
									/>
								</TableCell>
								<TableCell className="min-w-32">
									<Input
										placeholder="INV-1024"
										dir="ltr"
										{...register(`rows.${index}.legacyNo`)}
									/>
								</TableCell>
								<TableCell className="min-w-28">
									<Field data-invalid={!!errors.rows?.[index]?.outstanding}>
										<Input
											inputMode="decimal"
											placeholder="0.00"
											dir="ltr"
											aria-invalid={!!errors.rows?.[index]?.outstanding}
											{...register(`rows.${index}.outstanding`)}
										/>
										<FieldError errors={[errors.rows?.[index]?.outstanding]} />
									</Field>
								</TableCell>
								<TableCell>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										disabled={rows.fields.length === 1}
										onClick={() => rows.remove(index)}
									>
										<IconTrash className="size-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className="mt-3 flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => rows.append(EMPTY_ROW)}
					>
						<IconPlus className="size-4" />
						سطر جديد
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={isPending}
					>
						إنشاء واعتماد فواتير الافتتاح ({rows.fields.length})
					</Button>
				</div>
			</form>

			{lastResult && (
				<div className="mt-4 rounded-md border p-3 text-sm">
					<p className="font-medium">
						نتيجة آخر تشغيل: {lastResult.created.length} فاتورة · {lastResult.errors.length}{" "}
						خطأ
					</p>
					{lastResult.created.length > 0 && (
						<ul className="mt-2 space-y-1">
							{lastResult.created.map((row) => (
								<li
									key={row.id}
									className="text-muted-foreground"
								>
									سطر {row.rowNumber}: {row.invoiceType === "sales" ? "مبيعات" : "مشتريات"}{" "}
									<span dir="ltr">{row.documentNo}</span> — {formatAmount(row.outstanding)}
								</li>
							))}
						</ul>
					)}
					{lastResult.errors.length > 0 && (
						<ul className="mt-2 space-y-1">
							{lastResult.errors.map((row) => (
								<li
									key={row.rowNumber}
									className="text-destructive"
								>
									سطر {row.rowNumber}: {row.message}
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

/** party options follow the row's invoice type — Owner for sales, Supplier for purchase */
const PartySelect = ({
	parties,
	control,
	index,
	value,
	onChange,
}: {
	parties: PartyListRow[];
	control: Control<CreateOpeningInvoicesFormInput>;
	index: number;
	value: string;
	onChange: (next: string) => void;
}) => {
	const invoiceType = useWatch({ control, name: `rows.${index}.invoiceType` });
	const side = invoiceType === "purchase" ? "Supplier" : "Owner";
	const options = parties.filter((party) => party.partyType === side);
	return (
		<Select
			value={value}
			onValueChange={onChange}
		>
			<SelectTrigger size="sm">
				<SelectValue placeholder={side === "Owner" ? "اختر العميل" : "اختر المورد"} />
			</SelectTrigger>
			<SelectContent dir="rtl">
				{options.map((party) => (
					<SelectItem
						key={party.partyId}
						value={party.partyId}
					>
						{party.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

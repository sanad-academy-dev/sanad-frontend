import { IconBan } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { FieldLabel } from "@/components/common/field-label";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVoidVaccinationRecord } from "@/features/services/vaccinations/hooks/use-vaccinations";
import {
	ADVERSE_REACTION_LABELS,
	DOSE_KIND_LABELS,
	VACCINE_ROUTE_LABELS,
	type VaccinationRecordResponse,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

export function VaccinationRecordsTable({
	records,
	isLoading,
	showPatient = true,
	/** شريط الأدوات يظهر في الشاشة المستقلّة فقط — داخل ملف الطفل السياق معروف */
	showToolbar = true,
	search = "",
	onSearchChange,
}: {
	records: VaccinationRecordResponse[];
	isLoading: boolean;
	showPatient?: boolean;
	showToolbar?: boolean;
	search?: string;
	onSearchChange?: (value: string) => void;
}) {
	const [voiding, setVoiding] = useState<VaccinationRecordResponse | null>(null);

	const columns = useMemo<ColumnDef<VaccinationRecordResponse>[]>(() => {
		const base: ColumnDef<VaccinationRecordResponse>[] = [
			{
				accessorKey: "administeredAt",
				header: "التاريخ",
				cell: ({ row }) => (
					<span className="whitespace-nowrap">
						{dateFmt.format(new Date(row.original.administeredAt))}
					</span>
				),
			},
		];

		if (showPatient) {
			base.push({
				id: "patient",
				accessorFn: (r) => `${r.patient.name} ${r.patient.code}`,
				header: "الطفل",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.patient.name}</span>
						<span className="truncate text-xs text-muted-foreground tabular-nums">
							{row.original.patient.code}
						</span>
					</div>
				),
			});
		}

		base.push(
			{
				accessorKey: "vaccineNameSnapshot",
				header: "اللقاح",
				cell: ({ row }) => (
					<span className="truncate">{row.original.vaccineNameSnapshot}</span>
				),
			},
			{
				accessorKey: "batchNo",
				header: "الدفعة",
				cell: ({ row }) => (
					// رقم الدفعة معرّف لا كلمة — يُعزل LTR كي لا تنعكس شرطاته
					<span
						dir="ltr"
						className="block text-start tabular-nums"
					>
						{row.original.batchNo ?? "—"}
					</span>
				),
			},
			{
				accessorKey: "batchExpiryDate",
				header: "الانتهاء",
				cell: ({ row }) => (
					<span className="whitespace-nowrap">
						{row.original.batchExpiryDate
							? dateFmt.format(new Date(row.original.batchExpiryDate))
							: "—"}
					</span>
				),
			},
			{
				// نافذة الحماية: الجرعة ليست حماية لحظة حقنها. عمود «التاريخ» وحده كان
				// يُقرأ حمايةً فوريّة، وعليه تُبنى قرارات قبولٍ في صالات مشتركة.
				accessorKey: "protectiveFromAt",
				header: "بدء الحماية",
				cell: ({ row }) => {
					const from = row.original.protectiveFromAt;
					if (!from) return <span className="text-muted-foreground">—</span>;
					const at = new Date(from);
					if (at > new Date()) {
						return (
							<span className="whitespace-nowrap text-amber-700">
								قيد اكتساب المناعة — {dateFmt.format(at)}
							</span>
						);
					}
					return <span className="whitespace-nowrap">{dateFmt.format(at)}</span>;
				},
			},
			{
				id: "dose",
				header: "الجرعة",
				cell: ({ row }) => (
					<span className="whitespace-nowrap">
						{DOSE_KIND_LABELS[row.original.doseKind]} #{row.original.doseNumber}
					</span>
				),
			},
			{
				accessorKey: "route",
				header: "الطريق",
				cell: ({ row }) => VACCINE_ROUTE_LABELS[row.original.route],
			},
			{
				id: "vet",
				accessorFn: (r) => r.administeredBy?.name ?? "",
				header: "المدرّب",
				cell: ({ row }) => (
					<span className="truncate">{row.original.administeredBy?.name ?? "—"}</span>
				),
			},
			{
				accessorKey: "adverseReaction",
				header: "التفاعل",
				cell: ({ row }) =>
					row.original.adverseReaction === "NONE" ? (
						<span className="text-muted-foreground">—</span>
					) : (
						<Badge variant="destructive">
							{ADVERSE_REACTION_LABELS[row.original.adverseReaction]}
						</Badge>
					),
			},
			{
				id: "actions",
				header: "",
				size: 110,
				cell: ({ row }) => (
					<div className="flex justify-end">
						{row.original.isVoided ? (
							// السجل المُبطل يبقى ظاهرًا موسومًا — الإبطال أثر موثّق لا محو
							<Badge variant="secondary">مُبطل</Badge>
						) : (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setVoiding(row.original)}
							>
								<IconBan className="size-4" />
								إبطال
							</Button>
						)}
					</div>
				),
			},
		);

		return base;
	}, [showPatient]);

	const table = useReactTable({
		data: records,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
		...(onSearchChange
			? {
					state: { globalFilter: search },
					onGlobalFilterChange: (updater: unknown) =>
						onSearchChange(
							typeof updater === "function"
								? (updater as (old: string) => string)(search)
								: (updater as string),
						),
				}
			: {}),
	});

	return (
		<>
			<div className="flex min-h-0 flex-1 flex-col">
				{showToolbar && (
					<TableToolbar
						className="border-t"
						searchPlaceholder="ابحث باسم الطفل أو اللقاح..."
						searchValue={search}
						onSearchChange={onSearchChange}
					/>
				)}

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					emptyState={{
						title: "لا جرعات مسجَّلة بعد",
						description: "يظهر هنا كل ما أُعطي فعلًا برقم دفعته وتاريخ صلاحيتها والمدرّب المُعطي.",
					}}
				/>
			</div>

			<VoidRecordDialog
				record={voiding}
				onClose={() => setVoiding(null)}
			/>
		</>
	);
}

function VoidRecordDialog({
	record,
	onClose,
}: {
	record: VaccinationRecordResponse | null;
	onClose: () => void;
}) {
	const [reason, setReason] = useState("");
	const [touched, setTouched] = useState(false);
	const { voidRecord, isPending } = useVoidVaccinationRecord();

	const invalid = reason.trim().length < 3;

	const submit = () => {
		setTouched(true);
		if (invalid || !record) return;
		void voidRecord(
			{ id: record.id, voidReason: reason.trim(), restoreStock: true },
			{
				onSuccess: () => {
					setReason("");
					setTouched(false);
					onClose();
				},
			},
		);
	};

	return (
		<Dialog
			open={Boolean(record)}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent className="max-h-[80vh] gap-0 p-0 sm:max-w-md">
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle>إبطال سجل تطعيم</DialogTitle>
					<DialogDescription>
						السجل الطبي لا يُحذف. سيبقى ظاهرًا موسومًا بالإبطال وسببه، وستعود الكمية إلى الدفعة
						بحركة مخزون معاكسة.
					</DialogDescription>
				</DialogHeader>

				<div className="p-4">
					<Field data-invalid={touched && invalid}>
						<FieldLabel required>
							<Label>سبب الإبطال</Label>
						</FieldLabel>
						<Input
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="مثال: أُدخل على الطفل الخطأ"
							aria-invalid={touched && invalid}
							disabled={isPending}
						/>
						{touched && invalid && <FieldError errors={[{ message: "سبب الإبطال مطلوب" }]} />}
					</Field>
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={submit}
						disabled={isPending}
					>
						إبطال السجل
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

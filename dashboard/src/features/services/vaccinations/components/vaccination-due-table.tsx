import { IconBrandWhatsapp } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { LuSyringe } from "react-icons/lu";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VaccinationStatusBadge } from "@/features/services/vaccinations/components/vaccination-status-badge";
import { buildWhatsAppLink } from "@/features/services/vaccinations/utils/vaccination-reminder";
import type { VaccinationDueRow } from "@/server/vaccinations/vaccinations.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

const SPECIES_FILTER = [
	{ value: "ALL", label: "كل الأنواع" },
	{ value: "DOG", label: "كلاب" },
	{ value: "CAT", label: "قطط" },
] as const;

const lateness = (days: number | null) => {
	if (days === null) return "—";
	if (days < 0) return `متأخّر ${Math.abs(days)} يومًا`;
	if (days === 0) return "اليوم";
	return `بعد ${days} يومًا`;
};

export function VaccinationDueTable({
	rows,
	isLoading,
	isError,
	clinicName,
	search,
	onSearchChange,
	species,
	onSpeciesChange,
	onAdminister,
}: {
	rows: VaccinationDueRow[];
	isLoading: boolean;
	isError?: boolean;
	clinicName: string;
	search: string;
	onSearchChange: (value: string) => void;
	species: string;
	onSpeciesChange: (value: string) => void;
	onAdminister: (patientId: string | null, dueAntigenCodes?: string[]) => void;
}) {
	const columns = useMemo<ColumnDef<VaccinationDueRow>[]>(
		() => [
			{
				accessorKey: "patientName",
				header: "الطفل",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patientName}</span>
						<span className="truncate text-xs text-muted-foreground tabular-nums">
							{row.original.patientCode}
						</span>
					</div>
				),
			},
			{
				accessorKey: "animalTypeName",
				header: "النوع",
				cell: ({ row }) => (
					<span className="text-muted-foreground">{row.original.animalTypeName}</span>
				),
			},
			{
				accessorKey: "ownerName",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.ownerName ?? "—"}</span>
						{row.original.ownerPhone && (
							// الهاتف معرّف رقمي لا نص عربي — عزله يمنع انعكاس ترتيب خاناته
							<span
								dir="ltr"
								className="truncate text-start text-xs text-muted-foreground tabular-nums"
							>
								{row.original.ownerPhone}
							</span>
						)}
					</div>
				),
			},
			{
				accessorKey: "dueAntigens",
				header: "الجرعات المستحقة",
				cell: ({ row }) => (
					<span className="line-clamp-2 text-sm">{row.original.dueAntigens.join("، ")}</span>
				),
			},
			{
				accessorKey: "dueAt",
				header: "تاريخ الاستحقاق",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="whitespace-nowrap">
							{row.original.dueAt ? dateFmt.format(new Date(row.original.dueAt)) : "—"}
						</span>
						<span className="whitespace-nowrap text-xs text-muted-foreground">
							{lateness(row.original.daysUntilDue)}
						</span>
					</div>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => <VaccinationStatusBadge status={row.original.status} />,
			},
			{
				id: "actions",
				header: "",
				size: 150,
				cell: ({ row }) => {
					const waLink = buildWhatsAppLink(row.original, clinicName);
					return (
						<div className="flex items-center justify-end gap-1">
							<Button
								size="sm"
								variant="outline"
								// الصف يعرف ما استحقّ — يُمرَّر مع الطفل كي تقترح النافذة اللقاح المغطّي
								onClick={() =>
									onAdminister(row.original.patientId, row.original.dueAntigenCodes)
								}
							>
								<LuSyringe className="size-4" />
								سجّل جرعة
							</Button>

							{/* لا مُرسِل واتساب في النظام: الزر يفتح المحادثة برسالة جاهزة والإرسال
							    فعل بشري. رقم غائب ⇒ زر معطّل بسبب مُفصح لا زر صامت. */}
							<Tooltip>
								<TooltipTrigger asChild>
									<span>
										<Button
											size="icon-sm"
											variant="ghost"
											disabled={!waLink}
											asChild={Boolean(waLink)}
										>
											{waLink ? (
												<a
													href={waLink}
													target="_blank"
													rel="noopener noreferrer"
												>
													<IconBrandWhatsapp className="size-4" />
												</a>
											) : (
												<IconBrandWhatsapp className="size-4" />
											)}
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent>
									{waLink
										? "فتح واتساب برسالة تذكير جاهزة"
										: "لا رقم هاتف مسجَّل لوليّ أمر هذا الطفل"}
								</TooltipContent>
							</Tooltip>
						</div>
					);
				},
			},
		],
		[clinicName, onAdminister],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : updater),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم الطفل أو وليّ الأمر..."
				searchValue={search}
				onSearchChange={onSearchChange}
				leftExtra={
					<Select
						value={species}
						onValueChange={onSpeciesChange}
					>
						<SelectTrigger className="h-6 w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{SPECIES_FILTER.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
				actions={
					<Button
						size="sm"
						onClick={() => onAdminister(null)}
					>
						<LuSyringe />
						تسجيل جرعة
					</Button>
				}
			/>

			{/* الفشل يُقال صراحةً ولا يُعرض كقائمة فارغة: «لا جرعات مستحقة» طمأنينة، وتعذّر
			    القراءة ليس طمأنينة — الخلط بينهما يُخفي متأخّرين خلف رسالة مريحة. */}
			{isError ? (
				<p className="p-6 text-center text-sm text-destructive">
					تعذّر جلب الجرعات المستحقة. هذه ليست قائمة فارغة — أعِد المحاولة، وإن تكرّر الخطأ فراجع
					حالة الخادم.
				</p>
			) : (
				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					emptyState={{
						title: "لا جرعات مستحقة حاليًا",
						description:
							"تظهر هنا الأطفال التي تأخّرت عن جرعة أو تستحقها قريبًا. الطفل بلا تاريخ ميلاد لا يمكن جدولته — أضِف تاريخ الميلاد من ملفّه.",
					}}
				/>
			)}
		</div>
	);
}

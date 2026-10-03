import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useCrmLeadSources } from "@/features/crm/hooks/use-crm-masters";
import { useCrmSlaPolicies, useCrmSlaPolicyActions } from "@/features/crm/hooks/use-crm-sla";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import type { CrmSlaPolicyResponse } from "@/server/crm/crm-sla/crm-sla.type";

/**
 * [CRM-P5] «سياسات الاستجابة» (§10.1).
 *
 * الهدف بالدقائق محسوبٌ على **وقت العمل** لا الساعة الجدارية، والشاشة تقول ذلك صراحةً:
 * «١٢٠ دقيقة» على أكاديميةٍ تُغلق الرابعة عصرًا تعني صباح الغد، ومن لا يعرف ذلك سيقرأ
 * التقارير خطأً (§17.2 صفّ ٢٢).
 *
 * [UI] على عقد `/services/staff`: `TableToolbar` + `TableDataView`، والمحرّر في لوحٍ
 * جانبيّ لا بطاقة داخلية.
 */
export const Route = createFileRoute("/_pathless-layout/crm/sla-policies")({
	component: CrmSlaPoliciesRoute,
});

const EMPTY = {
	name: "",
	appliesTo: "BOTH" as const,
	firstResponseMinutes: 60,
	order: 0,
	isActive: true,
	sources: [] as { sourceId: string; firstResponseMinutes: number | null }[],
};

const APPLIES_LABEL: Record<string, string> = {
	LEAD: "العملاء المحتملون",
	DEAL: "الصفقات",
	BOTH: "كلاهما",
};

function CrmSlaPoliciesRoute() {
	const { hasPermission } = usePermissions();
	const canCreate = hasPermission(PERMISSIONS.CRM_SETTINGS_CREATE);
	const canEdit = hasPermission(PERMISSIONS.CRM_SETTINGS_EDIT);

	const [includeInactive, setIncludeInactive] = useState(false);
	const { policies, isLoading } = useCrmSlaPolicies(includeInactive);
	const { sources } = useCrmLeadSources();
	const { createPolicy, updatePolicy, removePolicy, isSaving } = useCrmSlaPolicyActions();

	const [sheetOpen, setSheetOpen] = useState(false);
	const [draft, setDraft] = useState(EMPTY);
	const [editing, setEditing] = useState<CrmSlaPolicyResponse | null>(null);

	const startCreate = () => {
		setEditing(null);
		setDraft(EMPTY);
		setSheetOpen(true);
	};

	const startEdit = useCallback((policy: CrmSlaPolicyResponse) => {
		setEditing(policy);
		setDraft({
			name: policy.name,
			appliesTo: policy.appliesTo as "BOTH",
			firstResponseMinutes: policy.firstResponseMinutes,
			order: policy.order,
			isActive: policy.isActive,
			sources: policy.sources.map((row) => ({
				sourceId: row.sourceId,
				firstResponseMinutes: row.firstResponseMinutes,
			})),
		});
		setSheetOpen(true);
	}, []);

	const closeSheet = () => {
		setSheetOpen(false);
		setEditing(null);
		setDraft(EMPTY);
	};

	const submit = async () => {
		if (editing) await updatePolicy({ id: editing.id, ...draft });
		else await createPolicy(draft);
		closeSheet();
	};

	const toggleSource = (sourceId: string) =>
		setDraft((current) => ({
			...current,
			sources: current.sources.some((row) => row.sourceId === sourceId)
				? current.sources.filter((row) => row.sourceId !== sourceId)
				: [...current.sources, { sourceId, firstResponseMinutes: null }],
		}));

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي السياسات",
				value: policies.length,
				tooltip: "تُطبَّق أولاها المطابِقة عند إنشاء العميل المحتمل أو الصفقة",
			},
			{
				title: "فعّالة",
				value: policies.filter((policy) => policy.isActive).length,
				tooltip: "غير الفعّالة لا تُطبَّق على سجلٍّ جديد، ولا تُغيّر جلسات قائمة",
			},
			{
				title: "مقصورة على مصادر",
				value: policies.filter((policy) => policy.sources.length > 0).length,
				tooltip: "سياسةٌ بلا مصادر تنطبق على كل المصادر",
			},
		],
		[policies],
	);

	const columns = useMemo<ColumnDef<CrmSlaPolicyResponse>[]>(
		() => [
			{ accessorKey: "name", header: "السياسة" },
			{
				accessorKey: "appliesTo",
				header: "النطاق",
				cell: ({ row }) => (
					<span className="text-sm">{APPLIES_LABEL[row.original.appliesTo]}</span>
				),
			},
			{
				accessorKey: "firstResponseMinutes",
				header: "هدف الاستجابة",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.firstResponseMinutes} دقيقة عمل</span>
				),
			},
			{
				id: "sources",
				header: "المصادر",
				cell: ({ row }) =>
					row.original.sources.length === 0 ? (
						<span className="text-muted-foreground text-sm">كل المصادر</span>
					) : (
						<div className="flex flex-wrap gap-1">
							{row.original.sources.map((source) => (
								<Badge
									key={source.id}
									variant="secondary"
								>
									{source.source.name}
									{source.firstResponseMinutes ? ` · ${source.firstResponseMinutes}د` : ""}
								</Badge>
							))}
						</div>
					),
			},
			{ accessorKey: "order", header: "الترتيب" },
			{
				id: "state",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={row.original.isActive ? "primary" : "secondary"}>
						{row.original.isActive ? "فعّالة" : "متوقّفة"}
					</Badge>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) =>
					canEdit ? (
						<div className="flex justify-end">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => startEdit(row.original)}
									>
										<IconPencil className="size-4" />
										تعديل
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2 text-destructive"
										onSelect={() => void removePolicy(row.original.id)}
									>
										<IconTrash className="size-4" />
										حذف
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : null,
			},
		],
		[canEdit, removePolicy, startEdit],
	);

	const table = useReactTable({
		data: policies,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/sla-policies" />

			<Stats
				className="px-4 grid-cols-3"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex items-center gap-2">
						<Switch
							id="crm-sla-inactive"
							checked={includeInactive}
							onCheckedChange={setIncludeInactive}
						/>
						<Label
							htmlFor="crm-sla-inactive"
							className="font-normal text-[12px]"
						>
							إظهار المتوقّفة
						</Label>
					</div>
				}
				actions={
					canCreate ? (
						<Button
							size="sm"
							onClick={startCreate}
						>
							<IconPlus />
							سياسة جديدة
						</Button>
					) : null
				}
			/>

			{/* §17.2 صفّ ٢٢ — الوحدة معلنة في الشاشة لا مخبوءة في التوثيق */}
			<div className="border-b bg-muted/30 px-4 py-2.5">
				<p className="text-muted-foreground text-xs">
					الهدف يُحسب بـ<span className="font-medium">دقائق العمل</span>: أيّام العمل وورديّاتها
					من إعدادات الجدولة، والفجوة بين الورديتين لا تُحتسب. ردٌّ خارج الدوام يُسجَّل بوقته الحقيقيّ
					ولا يُقرَّب.
				</p>
			</div>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا توجد سياسات استجابة",
					description:
						"أضِف سياسة ليحصل كل عميل محتمل أو صفقة جديدة على مهلة استجابة تُقاس بوقت العمل",
				}}
			/>

			<Sheet
				open={sheetOpen}
				onOpenChange={(open) => (open ? setSheetOpen(true) : closeSheet())}
			>
				<SheetContent
					side="left"
					className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
					showCloseButton={false}
				>
					<FormHeader
						title={editing ? "تعديل السياسة" : "سياسة استجابة جديدة"}
						onClose={closeSheet}
					/>

					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						<div className="space-y-2">
							<Label htmlFor="sla-name">اسم السياسة</Label>
							<Input
								id="sla-name"
								value={draft.name}
								onChange={(event) => setDraft({ ...draft, name: event.target.value })}
								disabled={isSaving}
							/>
						</div>

						<div className="space-y-2">
							<Label>النطاق</Label>
							<Select
								value={draft.appliesTo}
								onValueChange={(value) => setDraft({ ...draft, appliesTo: value as "BOTH" })}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{Object.entries(APPLIES_LABEL).map(([value, label]) => (
										<SelectItem
											key={value}
											value={value}
										>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label htmlFor="sla-minutes">هدف الاستجابة (دقائق عمل)</Label>
								<Input
									id="sla-minutes"
									type="number"
									min={1}
									dir="ltr"
									value={draft.firstResponseMinutes}
									onChange={(event) =>
										setDraft({ ...draft, firstResponseMinutes: Number(event.target.value) })
									}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sla-order">الترتيب</Label>
								<Input
									id="sla-order"
									type="number"
									min={0}
									dir="ltr"
									value={draft.order}
									onChange={(event) =>
										setDraft({ ...draft, order: Number(event.target.value) })
									}
									disabled={isSaving}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>المصادر</Label>
							<p className="text-muted-foreground text-xs">
								لا تختر شيئًا لتنطبق السياسة على كل المصادر. اختيار مصدرٍ يقصرها عليه.
							</p>
							<div className="flex flex-wrap gap-2">
								{sources.map((source) => {
									const selected = draft.sources.some((row) => row.sourceId === source.id);
									return (
										<Button
											key={source.id}
											type="button"
											size="sm"
											variant={selected ? "default" : "outline"}
											onClick={() => toggleSource(source.id)}
										>
											{source.name}
										</Button>
									);
								})}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Switch
								id="sla-active"
								checked={draft.isActive}
								onCheckedChange={(checked) => setDraft({ ...draft, isActive: checked })}
							/>
							<Label
								htmlFor="sla-active"
								className="font-normal"
							>
								فعّالة
							</Label>
						</div>
					</div>

					<FormFooter
						className="mt-auto"
						disabled={isSaving}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={closeSheet}
							disabled={isSaving}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={
								isSaving || draft.name.trim().length === 0 || draft.firstResponseMinutes < 1
							}
							onClick={() => void submit()}
						>
							{editing ? "حفظ" : "إضافة"}
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}

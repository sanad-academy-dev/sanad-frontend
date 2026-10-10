import {
	IconCircleCheck,
	IconCircleX,
	IconDots,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useCrmEmailIdentity,
	useCrmEmailTemplateActions,
	useCrmEmailTemplates,
} from "@/features/crm/hooks/use-crm-email";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import { TEMPLATE_VARIABLES } from "@sanad/contracts/runtime/server/crm/crm-email/crm-email.rules";
import type { CrmEmailTemplateResponse } from "@/server/crm/crm-email/crm-email.type";

/**
 * [CRM-P3] «قوالب البريد» (§9.1) — the templates master.
 *
 * It also shows the SENDER IDENTITY, which is not decoration. The envelope is one shared
 * account (O-CRM-6 §2.1), so a user who cannot see the display name their mail leaves under,
 * and where replies land, is being asked to send blind.
 *
 * [UI] Laid out on the `/services/staff` contract: `TableToolbar` + `TableDataView`, and the
 * editor moved out of an inline card into the standard sheet. The toolbar's search and export
 * stay hidden — this list is loaded whole and has no export path, and a control that does
 * nothing is worse than no control.
 */
export const Route = createFileRoute("/_pathless-layout/crm/email-templates")({
	component: CrmEmailTemplatesRoute,
});

const EMPTY = { name: "", subject: "", body: "" };

function CrmEmailTemplatesRoute() {
	const { hasPermission } = usePermissions();
	const canCreate = hasPermission(PERMISSIONS.CRM_SETTINGS_CREATE);
	const canEdit = hasPermission(PERMISSIONS.CRM_SETTINGS_EDIT);

	const [includeInactive, setIncludeInactive] = useState(false);
	const { templates, isLoading } = useCrmEmailTemplates(includeInactive);
	const { identity } = useCrmEmailIdentity();
	const { createTemplate, updateTemplate, removeTemplate, isSaving } =
		useCrmEmailTemplateActions();

	const [sheetOpen, setSheetOpen] = useState(false);
	const [draft, setDraft] = useState(EMPTY);
	const [editing, setEditing] = useState<CrmEmailTemplateResponse | null>(null);

	const startCreate = () => {
		setEditing(null);
		setDraft(EMPTY);
		setSheetOpen(true);
	};

	// useCallback لا للأداء: `columns` تعتمد عليها، ومرجع جديد كل رسم يُعيد بناء الأعمدة دائمًا
	const startEdit = useCallback((template: CrmEmailTemplateResponse) => {
		setEditing(template);
		setDraft({ name: template.name, subject: template.subject, body: template.body });
		setSheetOpen(true);
	}, []);

	const closeSheet = () => {
		setSheetOpen(false);
		setEditing(null);
		setDraft(EMPTY);
	};

	const submit = async () => {
		if (editing) await updateTemplate({ id: editing.id, ...draft });
		else await createTemplate(draft);
		closeSheet();
	};

	const canSubmit =
		draft.name.trim().length > 0 &&
		draft.subject.trim().length > 0 &&
		draft.body.trim().length > 0;

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد
	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي القوالب",
				value: templates.length,
				tooltip: includeInactive
					? "كل القوالب، النشطة وغير النشطة"
					: "القوالب النشطة فقط — فعّل «إظهار غير النشطة» لعرض الباقي",
			},
			{
				title: "نشطة",
				value: templates.filter((template) => template.active).length,
				tooltip: "قوالب متاحة للاختيار عند إرسال بريد من خطّ الزمن",
			},
			{
				title: "غير نشطة",
				value: templates.filter((template) => !template.active).length,
				tooltip: "قوالب مُعطّلة لا تظهر في محرّر البريد",
			},
			{
				title: "المتغيّرات المتاحة",
				value: TEMPLATE_VARIABLES.length,
				tooltip: "عدد المتغيّرات التي يمكن إدراجها في الموضوع أو النصّ",
			},
		],
		[templates, includeInactive],
	);

	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => templates, [templates]);

	const columns = useMemo<ColumnDef<CrmEmailTemplateResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "الاسم",
				cell: ({ row }) => <span className="font-medium text-sm">{row.original.name}</span>,
			},
			{
				accessorKey: "subject",
				header: "الموضوع",
				cell: ({ row }) => <span className="text-sm">{row.original.subject}</span>,
			},
			{
				accessorKey: "active",
				header: "الحالة",
				cell: ({ row }) =>
					row.original.active ? (
						<p className="flex items-center gap-1 text-sm">
							<IconCircleCheck className="size-4 text-emerald-500" />
							<span className="text-emerald-500">نشط</span>
						</p>
					) : (
						<p className="flex items-center gap-1 text-muted-foreground text-sm">
							<IconCircleX className="size-4" />
							<span>غير نشط</span>
						</p>
					),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) =>
					canEdit ? (
						// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
						<div onClick={(e) => e.stopPropagation()}>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-8"
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => startEdit(row.original)}
									>
										<IconPencil className="size-4" />
										تعديل
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="gap-2 text-destructive"
										onSelect={() => void removeTemplate(row.original.id)}
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
		[canEdit, removeTemplate, startEdit],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/email-templates" />

			<Stats
				className="px-4 grid-cols-4"
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
							id="crm-templates-inactive"
							checked={includeInactive}
							onCheckedChange={setIncludeInactive}
						/>
						<Label
							htmlFor="crm-templates-inactive"
							className="text-[12px] font-normal"
						>
							إظهار غير النشطة
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
							قالب جديد
						</Button>
					) : null
				}
			/>

			{/* §9.1 — ما سيراه المستلِم فعلًا، قبل أن يُرسَل شيء */}
			<div className="border-b bg-muted/30 px-4 py-2.5">
				<p className="font-medium text-sm">هويّة المُرسِل</p>
				<p className="text-muted-foreground text-xs">
					<span>الاسم الظاهر: </span>
					{identity?.fromName ?? "—"}
					<span className="px-2">·</span>
					<span>عنوان الردّ: </span>
					{identity?.replyTo ?? (
						<span className="text-destructive">
							غير محدَّد — لن تصل ردود العملاء إلى الأكاديمية. أضِف بريد الأكاديمية في إعداداتها.
						</span>
					)}
				</p>
			</div>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا توجد قوالب بعد",
					description: "أضِف قالبًا لتتمكّن من إرسال رسائل موحّدة من خطّ زمن العميل أو الصفقة",
					...(canCreate ? { action: { label: "قالب جديد", onClick: startCreate } } : {}),
				}}
			/>

			<Sheet
				open={sheetOpen}
				onOpenChange={(open) => !open && closeSheet()}
			>
				<SheetContent
					side="left"
					showCloseButton={false}
					dir="rtl"
					className="flex w-full flex-col gap-0 p-0 sm:max-w-xl!"
				>
					<FormHeader
						title={editing ? `تعديل: ${editing.name}` : "قالب جديد"}
						onClose={closeSheet}
					/>

					<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
						<p className="text-right font-semibold text-sm">بيانات القالب</p>

						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="crm-template-name"
								className="text-sm"
							>
								اسم القالب
							</Label>
							<Input
								id="crm-template-name"
								value={draft.name}
								onChange={(event) => setDraft({ ...draft, name: event.target.value })}
								placeholder="اسم القالب"
								disabled={isSaving}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="crm-template-subject"
								className="text-sm"
							>
								الموضوع
							</Label>
							<Input
								id="crm-template-subject"
								value={draft.subject}
								onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
								placeholder="الموضوع — يقبل المتغيّرات"
								disabled={isSaving}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="crm-template-body"
								className="text-sm"
							>
								نصّ الرسالة
							</Label>
							<Textarea
								id="crm-template-body"
								value={draft.body}
								onChange={(event) => setDraft({ ...draft, body: event.target.value })}
								placeholder="نصّ الرسالة"
								rows={8}
								disabled={isSaving}
							/>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<span className="text-[11px] text-muted-foreground">المتغيّرات المتاحة:</span>
							{TEMPLATE_VARIABLES.map((variable) => (
								<button
									key={variable}
									type="button"
									className="rounded border px-1.5 py-0.5 text-[11px] hover:bg-accent"
									onClick={() => setDraft({ ...draft, body: `${draft.body}{{${variable}}}` })}
								>
									{`{{${variable}}}`}
								</button>
							))}
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
							disabled={!canSubmit || isSaving}
							onClick={() => void submit()}
						>
							{editing ? "حفظ التعديل" : "إضافة القالب"}
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}

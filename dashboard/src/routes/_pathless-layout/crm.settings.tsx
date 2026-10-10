import { zodResolver } from "@hookform/resolvers/zod";
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
import { Controller, useForm } from "react-hook-form";

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
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
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import {
	type CrmMasterDraft,
	useCrmDealStatuses,
	useCrmIndustries,
	useCrmLeadSources,
	useCrmLeadStatuses,
	useCrmLostReasons,
	useCrmMasterActions,
} from "@/features/crm/hooks/use-crm-masters";
import { useCrmSettings, useCrmSettingsActions } from "@/features/crm/hooks/use-crm-settings";
import { useCrmSlaPolicies } from "@/features/crm/hooks/use-crm-sla";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { CrmDealStatusKind, CrmLeadStatusKind } from "@/generated/prisma/enums";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import {
	CRM_STATUS_COLOR_TOKENS,
	type CrmDealStatusResponse,
	type CrmIndustryResponse,
	type CrmLeadSourceResponse,
	type CrmLeadStatusResponse,
	type CrmLostReasonResponse,
	type CrmMasterKind,
	type CrmStatusColorToken,
} from "@sanad/contracts/runtime/server/crm/crm-masters/crm-masters.type";
import {
	type CrmSettingsFormInput,
	crmSettingsSchema,
} from "@sanad/contracts/runtime/server/crm/crm-settings/crm-settings.type";

/**
 * [CRM-P6] «إعدادات إدارة العملاء» — الشاشة التي أغلقت فجوتين معروفتين (§17.2 صفّ ١٥):
 *
 *   ١. الأنواع الخمسة المرجعية في §2 (حالات العملاء المحتملين، حالات الصفقات، المصادر،
 *      أسباب الفقد، القطاعات) شُحنت في CRM-P0 بمسارات HTTP كاملة و**بلا شاشة واحدة**.
 *      ماستر لا يستطيع أحدٌ تحريره ليس ماستر — والقاعدة ١٢ لا تقبل مسار إعدادٍ عبر الـ API.
 *   ٢. مفتاح الوحدة نفسه `enableCrmModule` (§14/§0.3) لم يكن له أيّ سطح: تشغيل الوحدة
 *      كان يتطلّب استدعاء `PATCH /crm/settings` يدويًا.
 *
 * لماذا شاشةٌ واحدة لا خمس: الأنواع الخمسة عائلةٌ واحدة بجدولٍ واحد الشكل (اسم + حالة،
 * وزيادتان للحالتين)، فخمس شاشات كانت ستكرّر نفس الجدول والمحرّر خمس مرّات — وهو تحديدًا
 * ما رفضناه في الخادم حين جُمعت في موردٍ واحد بأربعة ملفات.
 *
 * ما ليس هنا عمدًا: `crmWhatsappProvider` يُحرَّر في «واتساب» مع بيانات اعتماده — فصلُه
 * عنها كان سيجعل الحقل يعِد بما لا يفعله وحده.
 *
 * [UI] على عقد `/services/staff`: شريط الوحدة، `Stats`، `TableToolbar`، `TableDataView`،
 * والمحرّر في لوحٍ جانبيّ. مُنتقي النوع في `leftExtra` بدل تبويباتٍ ثانية — الشاشة لها
 * شريط تبويبات واحد بالفعل (شريط الوحدة)، وشريطان فوق بعضهما يُربكان أيّهما الموضع.
 */
export const Route = createFileRoute("/_pathless-layout/crm/settings")({
	component: CrmSettingsRoute,
});

type CrmMasterRow =
	| CrmLeadStatusResponse
	| CrmDealStatusResponse
	| CrmLeadSourceResponse
	| CrmLostReasonResponse
	| CrmIndustryResponse;

const KIND_LABEL: Record<CrmMasterKind, string> = {
	"lead-statuses": "حالات العملاء المحتملين",
	"deal-statuses": "حالات الصفقات",
	"lead-sources": "المصادر",
	"lost-reasons": "أسباب الفقد",
	industries: "القطاعات",
};

const KIND_ORDER: CrmMasterKind[] = [
	"lead-statuses",
	"deal-statuses",
	"lead-sources",
	"lost-reasons",
	"industries",
];

const LEAD_KIND_LABEL: Record<string, string> = {
	OPEN: "مفتوحة",
	CONVERTED: "محوَّلة",
	LOST: "مفقودة",
};

const DEAL_KIND_LABEL: Record<string, string> = {
	OPEN: "مفتوحة",
	WON: "مكسوبة",
	LOST: "مفقودة",
};

/** «بدون» ليس قيمةً فارغة: Radix Select يرفض `value=""`، فيُترجَم إلى `null` عند الحفظ. */
const NO_POLICY = "none";

const EMPTY_DRAFT = {
	name: "",
	active: true,
	color: "chart-1" as CrmStatusColorToken,
	order: 0,
	leadKind: "OPEN" as (typeof CrmLeadStatusKind)[keyof typeof CrmLeadStatusKind],
	dealKind: "OPEN" as (typeof CrmDealStatusKind)[keyof typeof CrmDealStatusKind],
	defaultProbability: 0,
};

function CrmSettingsRoute() {
	const { hasPermission } = usePermissions();
	const canCreate = hasPermission(PERMISSIONS.CRM_SETTINGS_CREATE);
	const canEdit = hasPermission(PERMISSIONS.CRM_SETTINGS_EDIT);

	const [kind, setKind] = useState<CrmMasterKind>("lead-statuses");
	const [includeInactive, setIncludeInactive] = useState(false);

	const leadStatuses = useCrmLeadStatuses(includeInactive);
	const dealStatuses = useCrmDealStatuses(includeInactive);
	const leadSources = useCrmLeadSources(includeInactive);
	const lostReasons = useCrmLostReasons(includeInactive);
	const industries = useCrmIndustries(includeInactive);

	const { createMaster, updateMaster, removeMaster, isSaving } = useCrmMasterActions();

	const { settings, isLoading: settingsLoading } = useCrmSettings();
	const { saveSettings, isSaving: savingSettings } = useCrmSettingsActions();
	const { policies } = useCrmSlaPolicies();

	const { rows, isLoading } = useMemo<{ rows: CrmMasterRow[]; isLoading: boolean }>(() => {
		switch (kind) {
			case "lead-statuses":
				return { rows: leadStatuses.statuses, isLoading: leadStatuses.isLoading };
			case "deal-statuses":
				return { rows: dealStatuses.statuses, isLoading: dealStatuses.isLoading };
			case "lead-sources":
				return { rows: leadSources.sources, isLoading: leadSources.isLoading };
			case "lost-reasons":
				return { rows: lostReasons.lostReasons, isLoading: lostReasons.isLoading };
			default:
				return { rows: industries.industries, isLoading: industries.isLoading };
		}
	}, [kind, leadStatuses, dealStatuses, leadSources, lostReasons, industries]);

	// ── §14: إعدادات الوحدة ───────────────────────────────────────────────────────────
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<CrmSettingsFormInput>({
		resolver: zodResolver(crmSettingsSchema),
		// `values` لا `defaultValues`: القراءة تصل بعد أوّل رسم، و`defaultValues` كانت
		// ستُثبِّت النموذج على الافتراضيات وتعرض «مطفأة» على أكاديميةٍ مفعِّلة
		values: {
			enableCrmModule: settings.enableCrmModule,
			crmDefaultSlaPolicyId: settings.crmDefaultSlaPolicyId,
			crmEmailFromName: settings.crmEmailFromName,
		},
	});

	const submitSettings = handleSubmit(async (values) => {
		await saveSettings({
			enableCrmModule: values.enableCrmModule,
			crmDefaultSlaPolicyId: values.crmDefaultSlaPolicyId || null,
			crmEmailFromName: values.crmEmailFromName?.trim()
				? values.crmEmailFromName.trim()
				: null,
		});
	});

	// ── §2: محرّر الماسترز ────────────────────────────────────────────────────────────
	const [sheetOpen, setSheetOpen] = useState(false);
	const [draft, setDraft] = useState(EMPTY_DRAFT);
	const [editingId, setEditingId] = useState<string | null>(null);

	const startCreate = () => {
		setEditingId(null);
		setDraft({ ...EMPTY_DRAFT, order: rows.length });
		setSheetOpen(true);
	};

	const startEdit = useCallback((row: CrmMasterRow) => {
		setEditingId(row.id);
		setDraft({
			...EMPTY_DRAFT,
			name: row.name,
			active: row.active,
			color: "color" in row ? (row.color as CrmStatusColorToken) : EMPTY_DRAFT.color,
			order: "order" in row ? row.order : 0,
			// التصنيفان اتحادان متقاطعان لا متطابقان — الاستثناء الصريح هو ما يُضيّق النوع
			leadKind: "kind" in row && row.kind !== "WON" ? row.kind : EMPTY_DRAFT.leadKind,
			dealKind: "kind" in row && row.kind !== "CONVERTED" ? row.kind : EMPTY_DRAFT.dealKind,
			defaultProbability:
				"defaultProbability" in row
					? Number(row.defaultProbability)
					: EMPTY_DRAFT.defaultProbability,
		});
		setSheetOpen(true);
	}, []);

	const closeSheet = () => {
		setSheetOpen(false);
		setEditingId(null);
		setDraft(EMPTY_DRAFT);
	};

	/** يُبنى الاتحاد المميَّز هنا: كلّ نوعٍ يرسل جسمه هو، لا شكلًا فضفاضًا يقبله الخادم صدفةً. */
	const buildDraft = (): CrmMasterDraft => {
		const name = draft.name.trim();
		switch (kind) {
			case "lead-statuses":
				return {
					kind,
					values: {
						name,
						active: draft.active,
						color: draft.color,
						order: draft.order,
						kind: draft.leadKind,
					},
				};
			case "deal-statuses":
				return {
					kind,
					values: {
						name,
						active: draft.active,
						color: draft.color,
						order: draft.order,
						kind: draft.dealKind,
						defaultProbability: draft.defaultProbability,
					},
				};
			default:
				return { kind, values: { name, active: draft.active } };
		}
	};

	const submitMaster = async () => {
		const payload = buildDraft();
		if (editingId) await updateMaster(editingId, payload);
		else await createMaster(payload);
		closeSheet();
	};

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "حالة الوحدة",
				value: settings.enableCrmModule ? 1 : 0,
				valueLabel: settingsLoading ? "…" : settings.enableCrmModule ? "مفعّلة" : "مطفأة",
				tooltip: "الوحدة مطفأة افتراضيًا؛ كل مسارات إدارة العملاء ترفض ما دامت مطفأة (§0.3)",
			},
			{
				title: KIND_LABEL[kind],
				value: rows.length,
				tooltip: "عدد الصفوف المعروضة في النوع المحدَّد",
			},
			{
				title: "الفعّالة",
				value: rows.filter((row) => row.active).length,
				tooltip: "الصفّ غير الفعّال يبقى على السجلّات القديمة ولا يُعرض في قوائم الاختيار",
			},
			{
				title: "سياسة الاستجابة الافتراضية",
				value: settings.crmDefaultSlaPolicyId ? 1 : 0,
				valueLabel:
					policies.find((policy) => policy.id === settings.crmDefaultSlaPolicyId)?.name ??
					"بدون",
				tooltip: "تُطبَّق حين لا تطابق أيُّ سياسةٍ مرتَّبة العميلَ المحتمل أو الصفقة",
			},
		],
		[kind, rows, settings, settingsLoading, policies],
	);

	const columns = useMemo<ColumnDef<CrmMasterRow>[]>(() => {
		const base: ColumnDef<CrmMasterRow>[] = [
			{
				accessorKey: "name",
				header: "الاسم",
				cell: ({ row }) =>
					"color" in row.original ? (
						<LeadStatusPill
							name={row.original.name}
							color={row.original.color}
						/>
					) : (
						<span className="text-sm">{row.original.name}</span>
					),
			},
		];

		if (kind === "lead-statuses" || kind === "deal-statuses") {
			base.push(
				{
					id: "kind",
					header: "التصنيف",
					cell: ({ row }) => {
						if (!("kind" in row.original)) return null;
						const labels = kind === "lead-statuses" ? LEAD_KIND_LABEL : DEAL_KIND_LABEL;
						return <span className="text-sm">{labels[row.original.kind]}</span>;
					},
				},
				{ accessorKey: "order", header: "الترتيب" },
			);
		}

		if (kind === "deal-statuses") {
			base.push({
				id: "probability",
				header: "الاحتمال الافتراضي",
				cell: ({ row }) =>
					"defaultProbability" in row.original ? (
						<span
							className="text-sm"
							dir="ltr"
						>
							{String(row.original.defaultProbability)}%
						</span>
					) : null,
			});
		}

		base.push(
			{
				id: "state",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={row.original.active ? "primary" : "secondary"}>
						{row.original.active ? "فعّال" : "متوقّف"}
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
										onSelect={() => void removeMaster(row.original.id, kind)}
									>
										<IconTrash className="size-4" />
										حذف
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : null,
			},
		);

		return base;
	}, [canEdit, kind, removeMaster, startEdit]);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	const isStatusKind = kind === "lead-statuses" || kind === "deal-statuses";

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/settings" />

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			{/* §14 — مفتاح الوحدة وإعداداها العامّة */}
			<form
				className="border-t bg-muted/20 px-4 py-3"
				onSubmit={(event) => {
					event.preventDefault();
					void submitSettings();
				}}
			>
				<div className="flex flex-wrap items-end gap-4">
					<Controller
						name="enableCrmModule"
						control={control}
						render={({ field }) => (
							<div className="flex items-center gap-2 pb-1.5">
								<Switch
									id="crm-enable"
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									disabled={!canEdit || savingSettings}
								/>
								<Label
									htmlFor="crm-enable"
									className="font-normal"
								>
									تفعيل وحدة إدارة العملاء
								</Label>
							</div>
						)}
					/>

					<Controller
						name="crmDefaultSlaPolicyId"
						control={control}
						render={({ field }) => (
							<Field className="w-64">
								<FieldLabel htmlFor="crm-default-sla">سياسة الاستجابة الافتراضية</FieldLabel>
								<Select
									value={field.value ?? NO_POLICY}
									onValueChange={(value) => field.onChange(value === NO_POLICY ? null : value)}
									disabled={!canEdit || savingSettings}
								>
									<SelectTrigger
										id="crm-default-sla"
										className="w-full"
									>
										<SelectValue placeholder="بدون" />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value={NO_POLICY}>بدون</SelectItem>
										{policies.map((policy) => (
											<SelectItem
												key={policy.id}
												value={policy.id}
											>
												{policy.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Field
						className="w-64"
						data-invalid={!!errors.crmEmailFromName}
					>
						<FieldLabel htmlFor="crm-from-name">اسم المُرسِل في البريد</FieldLabel>
						<Input
							id="crm-from-name"
							aria-invalid={!!errors.crmEmailFromName}
							disabled={!canEdit || savingSettings}
							{...register("crmEmailFromName")}
						/>
						<FieldError errors={[errors.crmEmailFromName]} />
					</Field>

					{canEdit ? (
						<Button
							type="submit"
							size="sm"
							className="mb-0.5"
							disabled={savingSettings || !isDirty}
						>
							حفظ الإعدادات
						</Button>
					) : null}
				</div>
				<FieldDescription className="mt-2">
					إطفاء المفتاح يُغلق كل شاشات الوحدة ومساراتها فورًا ولا يحذف بياناتها. مزوّد واتساب
					وبيانات اعتماده يُضبطان في شاشة «واتساب» لا هنا.
				</FieldDescription>
			</form>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex flex-wrap items-center gap-1.5">
						{KIND_ORDER.map((value) => (
							<Button
								key={value}
								type="button"
								size="xs"
								variant={kind === value ? "default" : "outline"}
								onClick={() => setKind(value)}
							>
								{KIND_LABEL[value]}
							</Button>
						))}
						<span className="mx-1 h-4 w-px bg-border" />
						<Switch
							id="crm-masters-inactive"
							checked={includeInactive}
							onCheckedChange={setIncludeInactive}
						/>
						<Label
							htmlFor="crm-masters-inactive"
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
							إضافة
						</Button>
					) : null
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: `لا توجد ${KIND_LABEL[kind]}`,
					description: "أضِف صفًّا ليظهر في قوائم الاختيار عبر شاشات إدارة العملاء",
				}}
			/>

			<Sheet
				open={sheetOpen}
				onOpenChange={(open) => (open ? setSheetOpen(true) : closeSheet())}
			>
				<SheetContent
					side="left"
					className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
					showCloseButton={false}
				>
					<FormHeader
						title={`${editingId ? "تعديل" : "إضافة"} — ${KIND_LABEL[kind]}`}
						onClose={closeSheet}
					/>

					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						<div className="space-y-2">
							<Label htmlFor="master-name">الاسم</Label>
							<Input
								id="master-name"
								value={draft.name}
								onChange={(event) => setDraft({ ...draft, name: event.target.value })}
								disabled={isSaving}
							/>
						</div>

						{isStatusKind ? (
							<>
								<div className="space-y-2">
									<Label>التصنيف</Label>
									<Select
										value={kind === "lead-statuses" ? draft.leadKind : draft.dealKind}
										onValueChange={(value) =>
											setDraft(
												kind === "lead-statuses"
													? { ...draft, leadKind: value as typeof draft.leadKind }
													: { ...draft, dealKind: value as typeof draft.dealKind },
											)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{Object.keys(
												kind === "lead-statuses" ? CrmLeadStatusKind : CrmDealStatusKind,
											).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{(kind === "lead-statuses" ? LEAD_KIND_LABEL : DEAL_KIND_LABEL)[
														value
													] ?? value}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-muted-foreground text-xs">
										التصنيف يقرّر السلوك لا الاسم: خطّ الأنابيب يحتاج حالةً واحدة على الأقلّ من كلّ
										تصنيف، ولا يمكن تعطيل آخر حالةٍ في تصنيفها.
									</p>
								</div>

								<div className="space-y-2">
									<Label>اللون</Label>
									<div className="flex flex-wrap gap-2">
										{CRM_STATUS_COLOR_TOKENS.map((token) => (
											<button
												key={token}
												type="button"
												onClick={() => setDraft({ ...draft, color: token })}
												aria-label={token}
												aria-pressed={draft.color === token}
											>
												<LeadStatusPill
													name={draft.color === token ? "✓" : "  "}
													color={token}
												/>
											</button>
										))}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label htmlFor="master-order">الترتيب</Label>
										<Input
											id="master-order"
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
									{kind === "deal-statuses" ? (
										<div className="space-y-2">
											<Label htmlFor="master-probability">الاحتمال الافتراضي (٪)</Label>
											<Input
												id="master-probability"
												type="number"
												min={0}
												max={100}
												dir="ltr"
												value={draft.defaultProbability}
												onChange={(event) =>
													setDraft({
														...draft,
														defaultProbability: Number(event.target.value),
													})
												}
												disabled={isSaving}
											/>
										</div>
									) : null}
								</div>
							</>
						) : null}

						<div className="flex items-center gap-2">
							<Switch
								id="master-active"
								checked={draft.active}
								onCheckedChange={(checked) => setDraft({ ...draft, active: checked })}
							/>
							<Label
								htmlFor="master-active"
								className="font-normal"
							>
								فعّال
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
							disabled={isSaving || draft.name.trim().length === 0}
							onClick={() => void submitMaster()}
						>
							{editingId ? "حفظ" : "إضافة"}
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}

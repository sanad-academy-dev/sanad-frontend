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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { TierPill } from "@/features/loyalty/components/tier-pill";
import {
	useLoyaltyProgramActions,
	useLoyaltyPrograms,
} from "@/features/loyalty/hooks/use-loyalty-program";
import {
	useLoyaltySettings,
	useLoyaltySettingsActions,
} from "@/features/loyalty/hooks/use-loyalty-settings";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import {
	LOYALTY_TIER_COLOR_TOKENS,
	type LoyaltyProgramResponse,
	type LoyaltyTierColorToken,
} from "@sanad/contracts/runtime/server/loyalty/loyalty-program/loyalty-program.type";

/**
 * [LY-P0] «برنامج الولاء» (BRD §10.2) — قواعد البرنامج، محرّر مستوياته، ومفتاح الوحدة.
 *
 * لماذا المفتاح هنا لا في شاشةٍ مستقلّة: أمسكت CRM-P6 العيب المقابل (§17.2 صفّ ٢٤) —
 * مفتاح وحدةٍ بلا أيّ سطح، فكان تشغيلها يعني نداء الـ API يدويًا بينما رسالة الرفض
 * تُحيل المستخدم إلى شاشةٍ لا وجود لها. الشريط أعلى الجدول هو ذلك السطح، وهو أوّل ما
 * يقع عليه البصر لأنّه أوّل ما يجب فعله.
 *
 * [UI] على عقد `/services/staff`: العنوان من مسار التخطيط لا من `<h1>`، `Stats` مشتقّة
 * من القائمة المحمّلة بلا نقطة نهاية جديدة، `TableToolbar` بالإجراء الأساسي في `actions`،
 * `TableDataView` بحالاته الثلاث، إجراءات الصفّ في `IconDots`، والمحرّر في لوحٍ جانبيّ
 * `FormHeader` → أقسام → `FormFooter`.
 *
 * ولا حقل بحث ولا تصفية: الأكاديمية تملك برنامجًا واحدًا فعّالًا (BR-L3.1)، فشريط بحثٍ فوق
 * صفٍّ أو صفّين زينةٌ لا وظيفة — والعقد يقول إنّ الأداة تظهر حيث يسندها شيء حقيقي.
 */
export const Route = createFileRoute("/_pathless-layout/management/loyalty-program")({
	component: LoyaltyProgramRoute,
});

const EMPTY_PROGRAM = {
	name: "",
	earnRate: 1,
	redemptionRate: 0.1,
	minRedemptionPoints: 100,
	maxRedemptionPercent: 50,
	pointsValidityMonths: 12,
	membershipMultiplier: 1,
	active: true,
};

const EMPTY_TIER = {
	name: "",
	minSpend: 0,
	earnMultiplier: 1,
	order: 0,
	colorToken: LOYALTY_TIER_COLOR_TOKENS[0] as LoyaltyTierColorToken,
	active: true,
};

const num = (value: unknown) => Number(value ?? 0);

function LoyaltyProgramRoute() {
	const { hasPermission } = usePermissions();
	const canCreate = hasPermission(PERMISSIONS.LOYALTY_SETTINGS_CREATE);
	const canEdit = hasPermission(PERMISSIONS.LOYALTY_SETTINGS_EDIT);

	const { settings, isLoading: settingsLoading } = useLoyaltySettings();
	const { saveSettings, isSaving: savingSettings } = useLoyaltySettingsActions();
	const moduleOn = settings.enableLoyaltyModule;

	const [includeInactive, setIncludeInactive] = useState(false);
	const { programs, isLoading } = useLoyaltyPrograms(moduleOn, includeInactive);
	const {
		createProgram,
		updateProgram,
		removeProgram,
		createTier,
		updateTier,
		removeTier,
		isSaving,
	} = useLoyaltyProgramActions();

	// ── §13 — شريط الإعدادات ──────────────────────────────────────────────────────────
	const [windowMonths, setWindowMonths] = useState<number | null>(null);
	const [noticeDays, setNoticeDays] = useState<number | null>(null);
	const effectiveWindow = windowMonths ?? settings.loyaltyTierWindowMonths;
	const effectiveNotice = noticeDays ?? settings.loyaltyExpiryNoticeDays;
	const settingsDirty =
		effectiveWindow !== settings.loyaltyTierWindowMonths ||
		effectiveNotice !== settings.loyaltyExpiryNoticeDays;

	// ── محرّر البرنامج ────────────────────────────────────────────────────────────────
	const [sheetOpen, setSheetOpen] = useState(false);
	const [draft, setDraft] = useState(EMPTY_PROGRAM);
	const [editing, setEditing] = useState<LoyaltyProgramResponse | null>(null);
	const [tierDraft, setTierDraft] = useState(EMPTY_TIER);
	const [editingTierId, setEditingTierId] = useState<string | null>(null);

	const startCreate = () => {
		setEditing(null);
		setDraft(EMPTY_PROGRAM);
		setSheetOpen(true);
	};

	const startEdit = useCallback((program: LoyaltyProgramResponse) => {
		setEditing(program);
		setDraft({
			name: program.name,
			earnRate: num(program.earnRate),
			redemptionRate: num(program.redemptionRate),
			minRedemptionPoints: program.minRedemptionPoints,
			maxRedemptionPercent: num(program.maxRedemptionPercent),
			pointsValidityMonths: program.pointsValidityMonths,
			membershipMultiplier: num(program.membershipMultiplier),
			active: program.active,
		});
		setSheetOpen(true);
	}, []);

	const closeSheet = () => {
		setSheetOpen(false);
		setEditing(null);
		setDraft(EMPTY_PROGRAM);
		setTierDraft(EMPTY_TIER);
		setEditingTierId(null);
	};

	const submitProgram = async () => {
		if (editing) await updateProgram({ id: editing.id, ...draft });
		else await createProgram(draft);
		closeSheet();
	};

	const submitTier = async () => {
		if (!editing) return;
		if (editingTierId) await updateTier({ id: editingTierId, ...tierDraft });
		else await createTier({ programId: editing.id, ...tierDraft });
		setTierDraft(EMPTY_TIER);
		setEditingTierId(null);
	};

	// نسخةٌ حيّة من البرنامج المحرَّر: بعد إضافة مستوًى تُبطَل الاستعلامات، فتُقرأ
	// المستويات من القائمة المحدَّثة لا من اللقطة التي فُتح بها اللوح
	const editingLive = editing
		? (programs.find((program) => program.id === editing.id) ?? editing)
		: null;

	const stats = useMemo<StatItem[]>(() => {
		const active = programs.find((program) => program.active);
		return [
			{
				title: "حالة الوحدة",
				value: moduleOn ? 1 : 0,
				valueLabel: settingsLoading ? "…" : moduleOn ? "مفعّلة" : "مطفأة",
				tooltip: "الوحدة مطفأة افتراضيًا؛ كل مسارات الولاء ترفض ما دامت مطفأة (§0.3)",
			},
			{
				title: "البرنامج الفعّال",
				value: active ? 1 : 0,
				valueLabel: active?.name ?? "بدون",
				tooltip: "برنامج فعّال واحد لكل أكاديمية — معدّلان متوازيان يجعلان الرصيد بلا معنى",
			},
			{
				title: "المستويات",
				value: active?.tiers.length ?? 0,
				tooltip: "برنامج بلا مستويات مشروع: الجميع يكسب بالمعدّل الأساسي",
			},
			{
				title: "صلاحية النقاط",
				value: active?.pointsValidityMonths ?? 0,
				valueLabel: active ? `${active.pointsValidityMonths} شهرًا` : "—",
				tooltip: "تُحسب من تاريخ كسب كل دفعة نقاط على حدة",
			},
		];
	}, [programs, moduleOn, settingsLoading]);

	const columns = useMemo<ColumnDef<LoyaltyProgramResponse>[]>(
		() => [
			{ accessorKey: "name", header: "البرنامج" },
			{
				id: "earn",
				header: "الكسب",
				cell: ({ row }) => (
					<span
						className="text-sm"
						dir="ltr"
					>
						{num(row.original.earnRate)} نقطة / ريال
					</span>
				),
			},
			{
				id: "redeem",
				header: "قيمة النقطة",
				cell: ({ row }) => (
					<span
						className="text-sm"
						dir="ltr"
					>
						{num(row.original.redemptionRate)} ريال
					</span>
				),
			},
			{
				id: "limits",
				header: "حدود الاستبدال",
				cell: ({ row }) => (
					<span className="text-muted-foreground text-sm">
						من {row.original.minRedemptionPoints} نقطة · حتى{" "}
						{num(row.original.maxRedemptionPercent)}٪
					</span>
				),
			},
			{
				id: "tiers",
				header: "المستويات",
				cell: ({ row }) =>
					row.original.tiers.length === 0 ? (
						<span className="text-muted-foreground text-sm">بلا مستويات</span>
					) : (
						<div className="flex flex-wrap gap-1">
							{row.original.tiers.map((tier) => (
								<TierPill
									key={tier.id}
									name={tier.name}
									colorToken={tier.colorToken}
								/>
							))}
						</div>
					),
			},
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
							<DropdownMenu dir="rtl">
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
										تعديل والمستويات
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="gap-2 text-destructive"
										onSelect={() => void removeProgram(row.original.id)}
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
		[canEdit, removeProgram, startEdit],
	);

	const table = useReactTable({
		data: programs,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Stats
				className="grid-cols-4 px-4"
				stats={stats}
			/>

			{/* §13 — مفتاح الوحدة وإعداداتها. أوّل ما يجب فعله، فأوّل ما يُرى. */}
			<form
				className="border-t bg-muted/20 px-4 py-3"
				onSubmit={(event) => {
					event.preventDefault();
					void saveSettings({
						loyaltyTierWindowMonths: effectiveWindow,
						loyaltyExpiryNoticeDays: effectiveNotice,
					});
				}}
			>
				<div className="flex flex-wrap items-end gap-4">
					<div className="flex items-center gap-2 pb-1.5">
						<Switch
							id="loyalty-enable"
							checked={moduleOn}
							disabled={!canEdit || savingSettings}
							onCheckedChange={(checked) =>
								void saveSettings({ enableLoyaltyModule: checked })
							}
						/>
						<Label
							htmlFor="loyalty-enable"
							className="font-normal"
						>
							تفعيل وحدة الولاء
						</Label>
					</div>

					<div className="w-48 space-y-2">
						<Label htmlFor="loyalty-window">نافذة احتساب المستوى (بالأشهر)</Label>
						<Input
							id="loyalty-window"
							type="number"
							min={1}
							max={120}
							dir="ltr"
							value={effectiveWindow}
							disabled={!canEdit || savingSettings}
							onChange={(event) => setWindowMonths(Number(event.target.value))}
						/>
					</div>

					<div className="w-48 space-y-2">
						<Label htmlFor="loyalty-notice">التنبيه قبل انتهاء النقاط (بالأيام)</Label>
						<Input
							id="loyalty-notice"
							type="number"
							min={1}
							max={365}
							dir="ltr"
							value={effectiveNotice}
							disabled={!canEdit || savingSettings}
							onChange={(event) => setNoticeDays(Number(event.target.value))}
						/>
					</div>

					{canEdit ? (
						<Button
							type="submit"
							size="sm"
							className="mb-0.5"
							disabled={savingSettings || !settingsDirty}
						>
							حفظ الإعدادات
						</Button>
					) : null}
				</div>
				<p className="mt-2 text-muted-foreground text-xs">
					إطفاء المفتاح يُغلق مسارات الوحدة فورًا ولا يحذف بياناتها. النقاط في هذه المرحلة تُضبط
					قواعدها فقط — الكسب والاستبدال يصلان في مرحلتين تاليتين.
				</p>
			</form>

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
							id="loyalty-inactive"
							checked={includeInactive}
							onCheckedChange={setIncludeInactive}
						/>
						<Label
							htmlFor="loyalty-inactive"
							className="font-normal text-[12px]"
						>
							إظهار المتوقّفة
						</Label>
					</div>
				}
				actions={
					canCreate && moduleOn ? (
						<Button
							size="sm"
							onClick={startCreate}
						>
							<IconPlus />
							برنامج جديد
						</Button>
					) : null
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={moduleOn && isLoading}
				emptyState={
					moduleOn
						? {
								title: "لا يوجد برنامج ولاء بعد",
								description:
									"أضِف برنامجًا لتحديد معدّل الكسب وقيمة النقطة وحدود الاستبدال — ثم تصل مراحل الكسب والاستبدال",
							}
						: {
								title: "وحدة الولاء غير مفعّلة",
								description: "فعّل الوحدة من الشريط أعلاه لتتمكّن من إعداد برنامج النقاط",
							}
				}
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
						title={editing ? "تعديل البرنامج" : "برنامج ولاء جديد"}
						onClose={closeSheet}
					/>

					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						<div className="space-y-2">
							<Label htmlFor="program-name">اسم البرنامج</Label>
							<Input
								id="program-name"
								value={draft.name}
								disabled={isSaving}
								onChange={(event) => setDraft({ ...draft, name: event.target.value })}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label htmlFor="program-earn">نقاط لكل ريال</Label>
								<Input
									id="program-earn"
									type="number"
									min={0}
									step="0.0001"
									dir="ltr"
									value={draft.earnRate}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, earnRate: Number(event.target.value) })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="program-redeem">قيمة النقطة (ريال)</Label>
								<Input
									id="program-redeem"
									type="number"
									min={0}
									step="0.0001"
									dir="ltr"
									value={draft.redemptionRate}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, redemptionRate: Number(event.target.value) })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="program-min">الحدّ الأدنى للاستبدال (نقاط)</Label>
								<Input
									id="program-min"
									type="number"
									min={0}
									dir="ltr"
									value={draft.minRedemptionPoints}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, minRedemptionPoints: Number(event.target.value) })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="program-max">سقف الاستبدال من الفاتورة (٪)</Label>
								<Input
									id="program-max"
									type="number"
									min={0}
									max={100}
									dir="ltr"
									value={draft.maxRedemptionPercent}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, maxRedemptionPercent: Number(event.target.value) })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="program-validity">صلاحية النقاط (أشهر)</Label>
								<Input
									id="program-validity"
									type="number"
									min={1}
									dir="ltr"
									value={draft.pointsValidityMonths}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, pointsValidityMonths: Number(event.target.value) })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="program-membership">مضاعِف حاملي العضوية</Label>
								<Input
									id="program-membership"
									type="number"
									min={0}
									step="0.01"
									dir="ltr"
									value={draft.membershipMultiplier}
									disabled={isSaving}
									onChange={(event) =>
										setDraft({ ...draft, membershipMultiplier: Number(event.target.value) })
									}
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Switch
								id="program-active"
								checked={draft.active}
								onCheckedChange={(checked) => setDraft({ ...draft, active: checked })}
							/>
							<Label
								htmlFor="program-active"
								className="font-normal"
							>
								فعّال
							</Label>
						</div>

						{/* §4 — محرّر المستويات: صفوفٌ أبناء، نفس نمط مزايا خطة العضوية */}
						<div className="space-y-3 border-t pt-4">
							<div className="flex items-center justify-between">
								<Label className="text-[13px]">المستويات</Label>
								<span className="text-muted-foreground text-[11px]">
									سلطتها الوحيدة مضاعِف الكسب
								</span>
							</div>

							{!editing ? (
								<p className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
									احفظ البرنامج أولًا ثمّ أضِف مستوياته — المستوى ابنٌ للبرنامج فلا يوجد قبله.
									وبرنامجٌ بلا مستويات مشروع: الجميع يكسب بالمعدّل الأساسي.
								</p>
							) : (
								<>
									{editingLive && editingLive.tiers.length > 0 ? (
										<div className="space-y-1.5">
											{editingLive.tiers.map((tier) => (
												<div
													key={tier.id}
													className="flex items-center gap-2 rounded-md border p-2"
												>
													<TierPill
														name={tier.name}
														colorToken={tier.colorToken}
													/>
													<span
														className="text-[11px] text-muted-foreground"
														dir="ltr"
													>
														≥ {num(tier.minSpend)} · ×{num(tier.earnMultiplier)}
													</span>
													<div className="ms-auto flex items-center gap-1">
														<Button
															type="button"
															variant="ghost"
															size="icon-sm"
															aria-label={`تعديل ${tier.name}`}
															onClick={() => {
																setEditingTierId(tier.id);
																setTierDraft({
																	name: tier.name,
																	minSpend: num(tier.minSpend),
																	earnMultiplier: num(tier.earnMultiplier),
																	order: tier.order,
																	// العمود نصٌّ في Prisma بينما المسودّة اتحادٌ مغلق —
																	// والقيمة من الخادم مصادَقٌ عليها على الحدّ أصلًا
																	colorToken: tier.colorToken as LoyaltyTierColorToken,
																	active: tier.active,
																});
															}}
														>
															<IconPencil className="size-3.5" />
														</Button>
														<Button
															type="button"
															variant="ghost"
															size="icon-sm"
															className="text-destructive"
															aria-label={`حذف ${tier.name}`}
															onClick={() => void removeTier(tier.id)}
														>
															<IconTrash className="size-3.5" />
														</Button>
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground text-xs">
											لا مستويات بعد — الجميع يكسب بالمعدّل الأساسي.
										</p>
									)}

									<div className="space-y-3 rounded-md border p-3">
										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-1.5">
												<Label htmlFor="tier-name">اسم المستوى</Label>
												<Input
													id="tier-name"
													value={tierDraft.name}
													disabled={isSaving}
													onChange={(event) =>
														setTierDraft({ ...tierDraft, name: event.target.value })
													}
												/>
											</div>
											<div className="space-y-1.5">
												<Label htmlFor="tier-spend">الإنفاق المؤهِّل</Label>
												<Input
													id="tier-spend"
													type="number"
													min={0}
													dir="ltr"
													value={tierDraft.minSpend}
													disabled={isSaving}
													onChange={(event) =>
														setTierDraft({
															...tierDraft,
															minSpend: Number(event.target.value),
														})
													}
												/>
											</div>
											<div className="space-y-1.5">
												<Label htmlFor="tier-multiplier">مضاعِف الكسب</Label>
												<Input
													id="tier-multiplier"
													type="number"
													min={0}
													step="0.01"
													dir="ltr"
													value={tierDraft.earnMultiplier}
													disabled={isSaving}
													onChange={(event) =>
														setTierDraft({
															...tierDraft,
															earnMultiplier: Number(event.target.value),
														})
													}
												/>
											</div>
											<div className="space-y-1.5">
												<Label htmlFor="tier-order">الترتيب</Label>
												<Input
													id="tier-order"
													type="number"
													min={0}
													dir="ltr"
													value={tierDraft.order}
													disabled={isSaving}
													onChange={(event) =>
														setTierDraft({ ...tierDraft, order: Number(event.target.value) })
													}
												/>
											</div>
										</div>

										<div className="space-y-1.5">
											<Label>اللون</Label>
											<div className="flex flex-wrap gap-2">
												{LOYALTY_TIER_COLOR_TOKENS.map((token) => (
													<button
														key={token}
														type="button"
														aria-label={token}
														aria-pressed={tierDraft.colorToken === token}
														onClick={() => setTierDraft({ ...tierDraft, colorToken: token })}
													>
														<TierPill
															name={tierDraft.colorToken === token ? "✓" : "　"}
															colorToken={token}
														/>
													</button>
												))}
											</div>
										</div>

										<div className="flex items-center gap-2">
											<Button
												type="button"
												size="sm"
												disabled={isSaving || tierDraft.name.trim().length === 0}
												onClick={() => void submitTier()}
											>
												{editingTierId ? "حفظ المستوى" : "إضافة مستوى"}
											</Button>
											{editingTierId ? (
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => {
														setEditingTierId(null);
														setTierDraft(EMPTY_TIER);
													}}
												>
													إلغاء التعديل
												</Button>
											) : null}
										</div>
									</div>
								</>
							)}
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
							onClick={() => void submitProgram()}
						>
							{editing ? "حفظ" : "إضافة"}
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}

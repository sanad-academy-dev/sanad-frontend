import {
	IconBookmark,
	IconPin,
	IconPinFilled,
	IconTrash,
	IconWorld,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	useCrmSavedViewActions,
	useCrmSavedViews,
} from "@/features/crm/hooks/use-crm-saved-views";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import type { CrmSavedViewResponse } from "@/server/crm/crm-sla/crm-sla.type";

/**
 * [CRM-P6] §11.3 — «العروض المحفوظة» في شريط أدوات العملاء المحتملين والصفقات.
 *
 * v1 يحفظ ما تحمله الشاشة فعلًا: المرشّحات والتخطيط (جدول/لوحة). `sort` و`visibleColumns`
 * موجودان في المخطط ويُحفظان فارغين — لا لأنّهما نُسيا، بل لأنّ الشاشتين لا تملكان اليوم
 * ترتيبًا مخصّصًا ولا مُنتقي أعمدة، وحفظُ قيمةٍ لا مصدر لها كان سيُنشئ بيانات لا تصف شيئًا.
 *
 * النشر (`isPublic`) محكوم بـ`crm_settings.edit` (§17.2 صفّ ٢٣): عرضٌ منشور حالةٌ مشتركة
 * تظهر على شاشات الزملاء. المفتاح يُخفى لمن لا يملكها بدل أن يُعرض فيرفضه الخادم.
 * والتعديل والحذف مقصوران على صاحب العرض — الخادم يفرضها، والقائمة تُخفيها اتّساقًا.
 */
export function SavedViewsMenu({
	entity,
	currentUserId,
	filters,
	layout,
	onApply,
}: {
	entity: "LEAD" | "DEAL";
	currentUserId: string | null;
	filters: Record<string, unknown>;
	layout: "LIST" | "KANBAN";
	onApply: (view: CrmSavedViewResponse) => void;
}) {
	const { hasPermission } = usePermissions();
	const canPublish = hasPermission(PERMISSIONS.CRM_SETTINGS_EDIT);

	const { views } = useCrmSavedViews(entity);
	const { saveView, updateView, removeView, isSaving } = useCrmSavedViewActions();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [name, setName] = useState("");
	const [isPublic, setIsPublic] = useState(false);

	const submit = async () => {
		await saveView({
			entity,
			name: name.trim(),
			filters,
			layout,
			isPublic: canPublish ? isPublic : false,
		});
		setDialogOpen(false);
		setName("");
		setIsPublic(false);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="xs"
						variant="outline"
						className="gap-1.5"
					>
						<IconBookmark className="size-3.5" />
						العروض المحفوظة
						{views.length > 0 ? (
							<span className="text-muted-foreground">({views.length})</span>
						) : null}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-72"
				>
					<DropdownMenuLabel className="text-[11px] font-normal text-muted-foreground">
						عروضك والعروض المنشورة للأكاديمية
					</DropdownMenuLabel>

					{views.length === 0 ? (
						<div className="px-2 py-3 text-center text-[12px] text-muted-foreground">
							لا عروض محفوظة بعد
						</div>
					) : (
						views.map((view) => {
							const isOwn = view.userId === currentUserId;
							return (
								<DropdownMenuItem
									key={view.id}
									className="flex items-center gap-2"
									onSelect={() => onApply(view)}
								>
									{view.isPinned ? (
										<IconPinFilled className="size-3.5 shrink-0 text-primary" />
									) : null}
									<span className="flex-1 truncate">{view.name}</span>
									{view.isPublic ? (
										<IconWorld
											className="size-3.5 shrink-0 text-muted-foreground"
											aria-label="منشور للأكاديمية"
										/>
									) : null}
									{isOwn ? (
										<>
											<button
												type="button"
												aria-label={view.isPinned ? "إلغاء التثبيت" : "تثبيت"}
												className="text-muted-foreground hover:text-foreground"
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													void updateView({
														id: view.id,
														entity,
														name: view.name,
														isPinned: !view.isPinned,
													});
												}}
											>
												<IconPin className="size-3.5" />
											</button>
											<button
												type="button"
												aria-label="حذف العرض"
												className="text-muted-foreground hover:text-destructive"
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													void removeView(view.id);
												}}
											>
												<IconTrash className="size-3.5" />
											</button>
										</>
									) : (
										// عرض زميلك: يُطبَّق ولا يُحرَّر — الملكية هي الحدّ، لا الصلاحية
										<span className="shrink-0 text-[10px] text-muted-foreground">
											{view.user?.name ?? "—"}
										</span>
									)}
								</DropdownMenuItem>
							);
						})
					)}

					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => setDialogOpen(true)}>
						حفظ العرض الحالي…
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>حفظ العرض الحالي</DialogTitle>
						<DialogDescription>
							يُحفظ ما تعرضه الشاشة الآن: المرشّحات والتخطيط (جدول أو لوحة).
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="saved-view-name">اسم العرض</Label>
							<Input
								id="saved-view-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								disabled={isSaving}
							/>
						</div>

						{canPublish ? (
							<div className="flex items-center gap-2">
								<Switch
									id="saved-view-public"
									checked={isPublic}
									onCheckedChange={setIsPublic}
									disabled={isSaving}
								/>
								<Label
									htmlFor="saved-view-public"
									className="font-normal"
								>
									نشره لكل الأكاديمية
								</Label>
							</div>
						) : null}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setDialogOpen(false)}
							disabled={isSaving}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={isSaving || name.trim().length === 0}
							onClick={() => void submit()}
						>
							حفظ
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

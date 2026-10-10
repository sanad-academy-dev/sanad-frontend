import { IconDeviceHeartMonitor, IconPlus, IconTrash } from "@tabler/icons-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	BranchDetailsShell,
	SectionHeading,
	SettingRow,
	SettingsCard,
	StatusDot,
} from "@/features/settings/branches/components/branch-details/shared";
import {
	ANALYZER_CATEGORIES,
	type LabAnalyzer,
} from "@/features/settings/branches/data/lab-settings";
import { useLabSettings } from "@/features/settings/branches/hooks/use-lab-settings";
import { useI18n } from "@/hooks/use-i18n";

/** صيغة العدد العربية الصحيحة لأماكن الجهاز */
const slotsLabel = (slots: number) => {
	if (slots === 1) return "مكان واحد";
	if (slots === 2) return "مكانان";
	return slots <= 10 ? `${slots} أماكن` : `${slots} مكانًا`;
};

export function BranchLabAnalyzersPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, isPending, lab, configDisabled, update } =
		useLabSettings(branchId);
	const { isRtl: isArabic } = useI18n();

	const [addOpen, setAddOpen] = useState(false);
	const [draft, setDraft] = useState({
		name: "",
		category: ANALYZER_CATEGORIES[0],
		slots: "1",
	});

	if (isLoading || !branch || !lab) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const updateAnalyzer = (id: string, patch: Partial<LabAnalyzer>) =>
		update({ analyzers: lab.analyzers.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

	const addAnalyzer = async () => {
		const name = draft.name.trim();
		if (!name) return;
		// معرّف فريد لا يعتمد على طول القائمة — الحذف ثم الإضافة باسم مكرّر كان
		// يُنتج معرّفًا مطابقًا فيقترن الجهازان في التبديل والحذف وعدّ الإشغال
		const id = crypto.randomUUID();
		try {
			await update({
				analyzers: [
					...lab.analyzers,
					{
						id,
						name,
						category: draft.category,
						connected: false,
						slots: Math.max(1, Number(draft.slots) || 1),
					},
				],
			});
		} catch {
			return;
		}
		setDraft({ name: "", category: ANALYZER_CATEGORIES[0], slots: "1" });
		setAddOpen(false);
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التحليلات"
			sectionTo="/management/settings/branch/$branchId/lab-tests"
			subSection="أجهزة التحليل"
		>
			<SectionHeading
				title="أجهزة التحليل"
				description="الأجهزة المربوطة بمختبر هذا الفرع ترسل النتائج تلقائيًا إلى طلبات التحليل."
			/>
			<SettingsCard>
				{lab.analyzers.map((analyzer) => (
					<SettingRow
						key={analyzer.id}
						icon={<IconDeviceHeartMonitor className="size-4" />}
						title={analyzer.name}
						description={`${analyzer.category} · ${slotsLabel(analyzer.slots)}`}
						status={
							<StatusDot
								on={analyzer.connected}
								onLabel="متصل"
								offLabel="غير متصل"
							/>
						}
						trailing={
							<>
								{/* عدد الأماكن = كم عيّنة يعالجها الجهاز في آنٍ واحد */}
								<Label
									htmlFor={`slots-${analyzer.id}`}
									className="text-[11px] text-muted-foreground"
								>
									الأماكن
								</Label>
								<Input
									id={`slots-${analyzer.id}`}
									type="number"
									min={1}
									max={50}
									value={analyzer.slots}
									disabled={configDisabled}
									onChange={(e) =>
										void updateAnalyzer(analyzer.id, {
											slots: Math.max(1, Number(e.target.value) || 1),
										})
									}
									className="h-7 w-16 text-center text-xs tabular-nums"
								/>
								<Switch
									checked={analyzer.connected}
									disabled={configDisabled}
									onCheckedChange={(checked) =>
										void updateAnalyzer(analyzer.id, { connected: checked })
									}
									aria-label={`ربط جهاز ${analyzer.name}`}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									disabled={configDisabled}
									aria-label={`حذف جهاز ${analyzer.name}`}
									onClick={() =>
										void update({
											analyzers: lab.analyzers.filter((a) => a.id !== analyzer.id),
										})
									}
									className="size-7 rounded-lg p-0 text-muted-foreground hover:text-red-600"
								>
									<IconTrash className="size-3.5" />
								</Button>
							</>
						}
					/>
				))}
				{lab.analyzers.length === 0 && (
					<p className="py-4 text-[11px] text-muted-foreground">
						لا توجد أجهزة تحليل مضافة لهذا الفرع بعد.
					</p>
				)}
				<div className="flex justify-start py-3">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={configDisabled}
						onClick={() => setAddOpen(true)}
						className="h-7 gap-1.5 rounded-lg px-2.5 text-[11px]"
					>
						<IconPlus className="size-3.5" />
						إضافة جهاز تحليل
					</Button>
				</div>
			</SettingsCard>

			<Dialog
				open={addOpen}
				onOpenChange={setAddOpen}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>إضافة جهاز تحليل</DialogTitle>
						<DialogDescription>
							أضف جهاز تحليل جديد لمختبر هذا الفرع، ثم فعّل الاتصال به من القائمة.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="analyzer-name"
								className="text-xs font-semibold"
							>
								اسم الجهاز
							</Label>
							<Input
								id="analyzer-name"
								value={draft.name}
								placeholder="مثال: Mindray BC-6800"
								disabled={isPending}
								onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										void addAnalyzer();
									}
								}}
								className="text-sm"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="analyzer-slots"
								className="text-xs font-semibold"
							>
								عدد الأماكن
							</Label>
							<Input
								id="analyzer-slots"
								type="number"
								min={1}
								max={50}
								value={draft.slots}
								disabled={isPending}
								onChange={(e) => setDraft((prev) => ({ ...prev, slots: e.target.value }))}
								className="text-sm tabular-nums"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold">التصنيف</Label>
							<Select
								value={draft.category}
								onValueChange={(value) => setDraft((prev) => ({ ...prev, category: value }))}
								disabled={isPending}
								dir={isArabic ? "rtl" : "ltr"}
							>
								<SelectTrigger
									size="sm"
									aria-label="تصنيف الجهاز"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={isArabic ? "rtl" : "ltr"}
								>
									{ANALYZER_CATEGORIES.map((category) => (
										<SelectItem
											key={category}
											value={category}
										>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAddOpen(false)}
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							disabled={isPending || !draft.name.trim()}
							onClick={() => void addAnalyzer()}
						>
							إضافة
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}

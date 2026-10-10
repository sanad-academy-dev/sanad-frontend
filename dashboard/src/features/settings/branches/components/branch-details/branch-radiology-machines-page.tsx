import { IconDeviceDesktopAnalytics, IconPlus, IconTrash } from "@tabler/icons-react";
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
	RADIOLOGY_MODALITY_OPTIONS,
	type RadiologyMachine,
} from "@/features/settings/branches/data/radiology-settings";
import { useRadiologySettings } from "@/features/settings/branches/hooks/use-radiology-settings";
import { RadiologyModality } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

const modalityLabel = (value: string) =>
	MODALITY_META[value as RadiologyModality]?.label ?? value;

export function BranchRadiologyMachinesPage({ branchId }: { branchId: string }) {
	const { branch, isLoading, isPending, radiology, configDisabled, update } =
		useRadiologySettings(branchId);
	const { isRtl: isArabic } = useI18n();

	const [addOpen, setAddOpen] = useState(false);
	const [draft, setDraft] = useState({
		name: "",
		modality: RADIOLOGY_MODALITY_OPTIONS[0].value as string,
		room: "",
	});

	if (isLoading || !branch || !radiology) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	// الأجهزة مجمّعة بطريقة التصوير وبترتيب التعداد الثابت
	const groupedMachines = Object.values(RadiologyModality)
		.map(
			(modality) =>
				[
					modality as string,
					radiology.machines.filter((m) => m.modality === modality),
				] as const,
		)
		.filter(([, machines]) => machines.length > 0);

	const updateMachine = (id: string, patch: Partial<RadiologyMachine>) =>
		update({
			machines: radiology.machines.map((m) => (m.id === id ? { ...m, ...patch } : m)),
		});

	const addMachine = async () => {
		const name = draft.name.trim();
		if (!name) return;
		// معرّف فريد لا يعتمد على طول القائمة: الحذف ثم الإضافة باسم مكرّر كان
		// يُنتج معرّفًا مطابقًا، فيقترن الجهازان في التبديل والحذف وعدّ الإشغال.
		const id = crypto.randomUUID();
		try {
			await update({
				machines: [
					...radiology.machines,
					{
						id,
						name,
						modality: draft.modality,
						room: draft.room.trim(),
						connected: false,
						slots: 1,
					},
				],
			});
		} catch {
			return;
		}
		setDraft({ name: "", modality: RADIOLOGY_MODALITY_OPTIONS[0].value, room: "" });
		setAddOpen(false);
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الأشعة"
			sectionTo="/management/settings/branch/$branchId/radiology"
			subSection="أجهزة التصوير"
		>
			<SectionHeading
				title="أجهزة التصوير"
				description="أجهزة هذا الفرع وغرفها — تُعيَّن للفحوصات في خطوة التحضير ويُحسب إشغالها تلقائيًا."
			/>
			<SettingsCard>
				{/* الأجهزة مجمّعة حسب طريقة التصوير — قوائم سير العمل تُفلتر بها،
				    فالتجميع هنا يُطابق ما سيراه الفنّي عند تعيين الجهاز */}
				{groupedMachines.map(([modality, machines]) => (
					<div
						key={modality}
						className="flex flex-col"
					>
						<p className="border-b bg-muted/30 px-1 py-1.5 text-[11px] font-semibold text-muted-foreground">
							{modalityLabel(modality)}
							<span className="ms-1.5 font-normal tabular-nums">({machines.length})</span>
						</p>
						{machines.map((machine) => (
							<SettingRow
								key={machine.id}
								icon={<IconDeviceDesktopAnalytics className="size-4" />}
								title={machine.name}
								description={machine.room || "بلا قاعة محددة"}
								status={
									<StatusDot
										on={machine.connected}
										onLabel="فعّال"
										offLabel="معطّل"
									/>
								}
								trailing={
									<>
										<Switch
											checked={machine.connected}
											disabled={configDisabled}
											onCheckedChange={(checked) =>
												void updateMachine(machine.id, { connected: checked })
											}
											aria-label={`تفعيل جهاز ${machine.name}`}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											disabled={configDisabled}
											aria-label={`حذف جهاز ${machine.name}`}
											onClick={() =>
												void update({
													machines: radiology.machines.filter((m) => m.id !== machine.id),
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
					</div>
				))}
				{radiology.machines.length === 0 && (
					<p className="py-4 text-[11px] text-muted-foreground">
						لا توجد أجهزة تصوير مضافة لهذا الفرع بعد.
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
						إضافة جهاز تصوير
					</Button>
				</div>
			</SettingsCard>

			<Dialog
				open={addOpen}
				onOpenChange={setAddOpen}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>إضافة جهاز تصوير</DialogTitle>
						<DialogDescription>
							أضف جهاز تصوير جديد لهذا الفرع، ثم فعّله من القائمة ليقبل تعيين الفحوصات.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="machine-name"
								className="text-xs font-semibold"
							>
								اسم الجهاز
							</Label>
							<Input
								id="machine-name"
								value={draft.name}
								placeholder="مثال: جهاز الأشعة السينية الرقمي (DR)"
								disabled={isPending}
								onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										void addMachine();
									}
								}}
								className="text-sm"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs font-semibold">طريقة التصوير</Label>
							<Select
								value={draft.modality}
								onValueChange={(value) => setDraft((prev) => ({ ...prev, modality: value }))}
								disabled={isPending}
								dir={isArabic ? "rtl" : "ltr"}
							>
								<SelectTrigger
									size="sm"
									aria-label="طريقة التصوير"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={isArabic ? "rtl" : "ltr"}
								>
									{RADIOLOGY_MODALITY_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="machine-room"
								className="text-xs font-semibold"
							>
								القاعة
							</Label>
							<Input
								id="machine-room"
								value={draft.room}
								placeholder="مثال: قاعة الأشعة 1"
								disabled={isPending}
								onChange={(e) => setDraft((prev) => ({ ...prev, room: e.target.value }))}
								className="text-sm"
							/>
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
							onClick={() => void addMachine()}
						>
							إضافة
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}

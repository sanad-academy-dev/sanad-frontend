import { useState } from "react";
import { IconHeartbeat, IconPill, IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useQuickUpdateRequest } from "../../hooks/use-digital-registration";

interface RequestMedicalSectionProps {
	request: CampaignRequestItem;
	campaignId?: string;
}

export function RequestMedicalSection({
	request,
	campaignId = "",
}: RequestMedicalSectionProps) {
	const [allergyInput, setAllergyInput] = useState("");
	const [allergyPopoverOpen, setAllergyPopoverOpen] = useState(false);

	const [medicationInput, setMedicationInput] = useState("");
	const [medicationPopoverOpen, setMedicationPopoverOpen] = useState(false);

	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	// Get allergies list (from allergiesList or parse from allergies string)
	const allergies: string[] = Array.isArray(request.allergiesList) && request.allergiesList.length > 0
		? (request.allergiesList as string[])
		: request.allergies
		? [request.allergies]
		: [];

	// Get medications list
	const medications: string[] = Array.isArray(request.medications) && request.medications.length > 0
		? request.medications.map((m: any) => typeof m === "string" ? m : m.name)
		: [];

	const handleAddAllergy = () => {
		const val = allergyInput.trim();
		if (!val) return;
		const nextList = [...allergies, val];
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: {
					allergiesList: nextList,
					allergies: nextList.join("، "),
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إضافة حساسية: ${val}`);
					setAllergyInput("");
					setAllergyPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إضافة الحساسية");
				},
			},
		);
	};

	const handleRemoveAllergy = (index: number) => {
		const nextList = allergies.filter((_, i) => i !== index);
		quickUpdateMutation.mutate({
			requestId: request.id,
			data: {
				allergiesList: nextList,
				allergies: nextList.length > 0 ? nextList.join("، ") : null,
			},
		});
	};

	const handleAddMedication = () => {
		const val = medicationInput.trim();
		if (!val) return;
		const nextList = [...medications, val];
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: {
					medications: nextList,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إضافة الدواء: ${val}`);
					setMedicationInput("");
					setMedicationPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إضافة الدواء");
				},
			},
		);
	};

	const handleRemoveMedication = (index: number) => {
		const nextList = medications.filter((_, i) => i !== index);
		quickUpdateMutation.mutate({
			requestId: request.id,
			data: {
				medications: nextList,
			},
		});
	};

	return (
		<div
			className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 space-y-1.5 font-sans shadow-2xs"
			dir="rtl"
		>
			<h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
				<IconHeartbeat className="size-3.5 text-rose-500" />
				<span>المعلومات الطبية</span>
			</h4>

			<div className="space-y-1.5 text-xs">
				{/* سطر الحساسية */}
				<div className="flex items-center justify-between gap-2 py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 text-[10px]">الحساسية</span>
					<div className="flex items-center gap-1 flex-wrap justify-end">
						{allergies.map((item, idx) => (
							<Badge
								key={idx}
								variant="outline"
								className="gap-0.5 border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 text-[9px] px-1 py-0 font-semibold"
							>
								<span>{item}</span>
								<button
									type="button"
									onClick={() => handleRemoveAllergy(idx)}
									className="text-rose-400 hover:text-rose-700"
								>
									<IconX className="size-2" />
								</button>
							</Badge>
						))}

						<Popover open={allergyPopoverOpen} onOpenChange={setAllergyPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[9.5px] border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary gap-0.5"
								>
									<IconPlus className="size-2.5 text-primary" />
									<span>إضافة حساسية</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-56 p-2" dir="rtl">
								<p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
									اسم الحساسية أو المسبب
								</p>
								<div className="flex items-center gap-1">
									<Input
										value={allergyInput}
										onChange={(e) => setAllergyInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddAllergy();
											}
										}}
										placeholder="مثال: الفول السوداني"
										className="h-6.5 text-[10.5px] flex-1"
									/>
									<Button size="sm" className="h-6.5 text-[10.5px] px-2" onClick={handleAddAllergy}>
										إضافة
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* سطر الأدوية */}
				<div className="flex items-center justify-between gap-2 py-0.5">
					<span className="text-zinc-500 dark:text-zinc-400 text-[10px]">الأدوية</span>
					<div className="flex items-center gap-1 flex-wrap justify-end">
						{medications.map((item, idx) => (
							<Badge
								key={idx}
								variant="outline"
								className="gap-0.5 border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 text-[9px] px-1 py-0 font-semibold"
							>
								<IconPill className="size-2 text-blue-500" />
								<span>{item}</span>
								<button
									type="button"
									onClick={() => handleRemoveMedication(idx)}
									className="text-blue-400 hover:text-blue-700"
								>
									<IconX className="size-2" />
								</button>
							</Badge>
						))}

						<Popover open={medicationPopoverOpen} onOpenChange={setMedicationPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[9.5px] border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary gap-0.5"
								>
									<IconPlus className="size-2.5 text-primary" />
									<span>إضافة دواء</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent align="end" className="w-56 p-2" dir="rtl">
								<p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
									اسم الدواء والجرعة
								</p>
								<div className="flex items-center gap-1">
									<Input
										value={medicationInput}
										onChange={(e) => setMedicationInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddMedication();
											}
										}}
										placeholder="مثال: بخاخ فنتولين"
										className="h-6.5 text-[10.5px] flex-1"
									/>
									<Button size="sm" className="h-6.5 text-[10.5px] px-2" onClick={handleAddMedication}>
										إضافة
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</div>
	);
}

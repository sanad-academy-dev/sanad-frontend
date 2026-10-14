import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FormHeader } from "@/components/common/form-header";
import { FormFooter } from "@/components/common/form-footer";
import { FieldLabel } from "@/components/common/field-label";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { IconCertificate, IconId, IconVaccine } from "@tabler/icons-react";
import type { Campaign } from "../types/campaign.types";

export function AddCampaignSheet({
	open,
	onClose,
	campaign,
}: {
	open: boolean;
	onClose: () => void;
	campaign?: Campaign | null;
}) {
	const isEditing = !!campaign;
	const [requireId, setRequireId] = useState(true);
	const [requireVaccine, setRequireVaccine] = useState(true);
	const [requireBirthCert, setRequireBirthCert] = useState(true);

	useEffect(() => {
		if (open) {
			setRequireId(true);
			setRequireVaccine(true);
			setRequireBirthCert(true);
		}
	}, [open, campaign]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onClose();
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => !isOpen && onClose()}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full sm:max-w-xl! gap-0 flex flex-col p-0"
			>
				<FormHeader
					title={isEditing ? "تعديل الحملة" : "حملة جديدة"}
					onClose={onClose}
				/>

				<div className="flex-1 overflow-y-auto">
					<form
						id="add-campaign-form"
						onSubmit={handleSubmit}
						className="flex flex-col gap-0"
						dir="rtl"
					>
						<div className="px-4 pt-4 pb-2">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								معلومات الحملة
							</p>
						</div>

						<div className="flex flex-col gap-4 px-4 pb-6">
							{/* اسم الحملة */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">اسم الحملة</Label>
								</FieldLabel>
								<Input
									name="name"
									defaultValue={campaign?.name || ""}
									placeholder="يُرجى كتابة اسم الحملة..."
									className="w-full text-right text-sm"
									required
								/>
							</div>

							{/* الفئة العمرية */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">الفئة العمرية</Label>
								</FieldLabel>
								<Select defaultValue={campaign?.ageGroup || ""}>
									<SelectTrigger
										className="w-full text-right text-sm"
										dir="rtl"
									>
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem
											value="2-3"
											className="text-right"
										>
											2-3 سنوات
										</SelectItem>
										<SelectItem
											value="3-4"
											className="text-right"
										>
											3-4 سنوات
										</SelectItem>
										<SelectItem
											value="4-5"
											className="text-right"
										>
											4-5 سنوات
										</SelectItem>
										{isEditing && campaign.ageGroup && (
											<SelectItem
												value={campaign.ageGroup}
												className="text-right"
											>
												{campaign.ageGroup}
											</SelectItem>
										)}
									</SelectContent>
								</Select>
							</div>

							{/* الفصل المستهدف */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الفصل المستهدف</Label>
								<Select defaultValue="">
									<SelectTrigger
										className="w-full text-right text-sm"
										dir="rtl"
									>
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem
											value="النجوم"
											className="text-right"
										>
											النجوم
										</SelectItem>
										<SelectItem
											value="القمر"
											className="text-right"
										>
											القمر
										</SelectItem>
										<SelectItem
											value="الشمس"
											className="text-right"
										>
											الشمس
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* تاريخ البدء */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">تاريخ البدء</Label>
								</FieldLabel>
								{/* Extracting 'YYYY-MM-DD' safely if startDate is present in a different format */}
								<Input
									type="date"
									className="text-sm"
									defaultValue={
										campaign?.startDate
											? new Date(campaign.startDate).toISOString().split("T")[0]
											: ""
									}
								/>
							</div>

							{/* تاريخ الانتهاء */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">تاريخ الانتهاء</Label>
								</FieldLabel>
								<Input
									type="date"
									className="text-sm"
								/>
							</div>

							{/* المقاعد المتاحة */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">المقاعد المتاحة</Label>
								</FieldLabel>
								<Select
									defaultValue={campaign?.maxCapacity ? String(campaign.maxCapacity) : ""}
								>
									<SelectTrigger
										className="w-full text-right text-sm"
										dir="rtl"
									>
										<SelectValue placeholder="اختر..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem
											value="15"
											className="text-right"
										>
											15
										</SelectItem>
										<SelectItem
											value="20"
											className="text-right"
										>
											20
										</SelectItem>
										<SelectItem
											value="25"
											className="text-right"
										>
											25
										</SelectItem>
										<SelectItem
											value="30"
											className="text-right"
										>
											30
										</SelectItem>
										{isEditing && campaign.maxCapacity && (
											<SelectItem
												value={String(campaign.maxCapacity)}
												className="text-right"
											>
												{campaign.maxCapacity}
											</SelectItem>
										)}
									</SelectContent>
								</Select>
							</div>

							{/* المتطلبات */}
							<div className="flex flex-col gap-2">
								<Label className="text-sm font-medium">المتطلبات</Label>
								<div className="flex flex-col gap-2">
									<div
										role="button"
										tabIndex={0}
										onClick={() => setRequireId((prev) => !prev)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setRequireId((prev) => !prev);
											}
										}}
										className={cn(
											"flex items-center justify-between rounded-md border p-2.5 cursor-pointer transition-colors select-none",
											requireId
												? "border-primary/40 bg-primary/5"
												: "border-border bg-background hover:bg-muted/50",
										)}
									>
										<div className="flex items-center gap-2.5">
											<IconId
												className={cn(
													"size-4",
													requireId ? "text-primary" : "text-muted-foreground",
												)}
											/>
											<span className="text-sm font-medium">صورة الهوية</span>
										</div>
										<Switch
											checked={requireId}
											onCheckedChange={setRequireId}
											onClick={(e) => e.stopPropagation()}
										/>
									</div>

									<div
										role="button"
										tabIndex={0}
										onClick={() => setRequireVaccine((prev) => !prev)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setRequireVaccine((prev) => !prev);
											}
										}}
										className={cn(
											"flex items-center justify-between rounded-md border p-2.5 cursor-pointer transition-colors select-none",
											requireVaccine
												? "border-primary/40 bg-primary/5"
												: "border-border bg-background hover:bg-muted/50",
										)}
									>
										<div className="flex items-center gap-2.5">
											<IconVaccine
												className={cn(
													"size-4",
													requireVaccine ? "text-primary" : "text-muted-foreground",
												)}
											/>
											<span className="text-sm font-medium">شهادة التطعيم</span>
										</div>
										<Switch
											checked={requireVaccine}
											onCheckedChange={setRequireVaccine}
											onClick={(e) => e.stopPropagation()}
										/>
									</div>

									<div
										role="button"
										tabIndex={0}
										onClick={() => setRequireBirthCert((prev) => !prev)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setRequireBirthCert((prev) => !prev);
											}
										}}
										className={cn(
											"flex items-center justify-between rounded-md border p-2.5 cursor-pointer transition-colors select-none",
											requireBirthCert
												? "border-primary/40 bg-primary/5"
												: "border-border bg-background hover:bg-muted/50",
										)}
									>
										<div className="flex items-center gap-2.5">
											<IconCertificate
												className={cn(
													"size-4",
													requireBirthCert ? "text-primary" : "text-muted-foreground",
												)}
											/>
											<span className="text-sm font-medium">شهادة الميلاد</span>
										</div>
										<Switch
											checked={requireBirthCert}
											onCheckedChange={setRequireBirthCert}
											onClick={(e) => e.stopPropagation()}
										/>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				<FormFooter
					continueAdding={false}
					onContinueAddingChange={() => {}}
					disabled={false}
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="add-campaign-form"
						size="sm"
					>
						{isEditing ? "حفظ التعديلات" : "إنشاء الحملة"}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}

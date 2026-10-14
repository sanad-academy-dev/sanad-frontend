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
import { useCreateCampaign, useUpdateCampaign } from "../hooks/use-digital-registration";

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
	const [name, setName] = useState("");
	const [ageGroup, setAgeGroup] = useState("");
	const [targetClass, setTargetClass] = useState("");
	const [capacity, setCapacity] = useState("30");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [status, setStatus] = useState<"ACTIVE" | "DRAFT" | "COMPLETED" | "CLOSED">("ACTIVE");
	const [requireId, setRequireId] = useState(true);
	const [requireVaccine, setRequireVaccine] = useState(true);
	const [requireBirthCert, setRequireBirthCert] = useState(true);

	const createMutation = useCreateCampaign();
	const updateMutation = useUpdateCampaign();

	useEffect(() => {
		if (open) {
			if (campaign) {
				setName(campaign.name || "");
				setAgeGroup(campaign.ageGroup || "");
				setTargetClass(campaign.targetClass || "");
				setCapacity(String(campaign.maxCapacity || campaign.capacity || 30));
				setStartDate(campaign.startDate ? campaign.startDate.split("T")[0] : "");
				setEndDate(campaign.endDate ? campaign.endDate.split("T")[0] : "");
				setStatus(campaign.status || "ACTIVE");
				setRequireId(campaign.requireId ?? true);
				setRequireVaccine(campaign.requireVaccine ?? true);
				setRequireBirthCert(campaign.requireBirthCert ?? true);
			} else {
				setName("");
				setAgeGroup("2-3");
				setTargetClass("النجوم");
				setCapacity("30");
				setStartDate("");
				setEndDate("");
				setStatus("ACTIVE");
				setRequireId(true);
				setRequireVaccine(true);
				setRequireBirthCert(true);
			}
		}
	}, [open, campaign]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		const payload: Partial<Campaign> = {
			name: name.trim(),
			ageGroup: ageGroup.trim() || "2-3 سنوات",
			targetClass: targetClass.trim() || null,
			capacity: Number(capacity) || 30,
			status,
			startDate: startDate ? new Date(startDate).toISOString() : null,
			endDate: endDate ? new Date(endDate).toISOString() : null,
			requireId,
			requireVaccine,
			requireBirthCert,
		};

		if (isEditing && campaign) {
			await updateMutation.mutateAsync({ id: campaign.id, data: payload });
		} else {
			await createMutation.mutateAsync(payload);
		}

		onClose();
	};

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
									value={name}
									onChange={(e) => setName(e.target.value)}
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
								<Select value={ageGroup} onValueChange={setAgeGroup}>
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر الفئة العمرية..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="2-3 سنوات" className="text-right">
											2-3 سنوات
										</SelectItem>
										<SelectItem value="3-4 سنوات" className="text-right">
											3-4 سنوات
										</SelectItem>
										<SelectItem value="4-5 سنوات" className="text-right">
											4-5 سنوات
										</SelectItem>
										<SelectItem value="6-9 سنوات" className="text-right">
											6-9 سنوات
										</SelectItem>
										<SelectItem value="10-14 سنة" className="text-right">
											10-14 سنة
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* الفصل المستهدف */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">الفصل / المسار المستهدف</Label>
								<Select value={targetClass} onValueChange={setTargetClass}>
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر الفصل..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="النجوم" className="text-right">
											النجوم
										</SelectItem>
										<SelectItem value="القمر" className="text-right">
											القمر
										</SelectItem>
										<SelectItem value="الشمس" className="text-right">
											الشمس
										</SelectItem>
										<SelectItem value="المستكشف" className="text-right">
											مسار المستكشف
										</SelectItem>
										<SelectItem value="المفكر" className="text-right">
											مسار المفكر
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* حالة الحملة */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">حالة الحملة</Label>
								<Select value={status} onValueChange={(val: any) => setStatus(val)}>
									<SelectTrigger className="w-full text-right text-sm" dir="rtl">
										<SelectValue placeholder="اختر الحالة..." />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="ACTIVE" className="text-right">
											نشط (مفتوحة للتسجيل)
										</SelectItem>
										<SelectItem value="DRAFT" className="text-right">
											مسودة
										</SelectItem>
										<SelectItem value="COMPLETED" className="text-right">
											مكتملة (ممتلئة)
										</SelectItem>
										<SelectItem value="CLOSED" className="text-right">
											مغلقة
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* تاريخ البدء والانتهاء */}
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-sm font-medium">تاريخ البدء</Label>
									</FieldLabel>
									<Input
										type="date"
										className="text-sm"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-sm font-medium">تاريخ الانتهاء</Label>
									</FieldLabel>
									<Input
										type="date"
										className="text-sm"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
									/>
								</div>
							</div>

							{/* المقاعد المتاحة */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-sm font-medium">السعة (عدد المقاعد المتاحة)</Label>
								</FieldLabel>
								<Input
									type="number"
									min="1"
									max="500"
									value={capacity}
									onChange={(e) => setCapacity(e.target.value)}
									className="text-sm text-right"
									required
								/>
							</div>

							{/* المتطلبات والمستندات المشروطة */}
							<div className="flex flex-col gap-2">
								<Label className="text-sm font-medium">المستندات المطلوبة للتقديم</Label>
								<div className="flex flex-col gap-2">
									<div
										role="button"
										tabIndex={0}
										onClick={() => setRequireId((prev) => !prev)}
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
											<span className="text-sm font-medium">الهوية الوطنية لولي الأمر</span>
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
											<span className="text-sm font-medium">شهادة التطعيم واللقاحات</span>
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
											<span className="text-sm font-medium">شهادة ميلاد الطفل</span>
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
					disabled={isSubmitting}
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
						disabled={isSubmitting}
					>
						{isSubmitting
							? "جاري الحفظ..."
							: isEditing
								? "حفظ التعديلات"
								: "إنشاء الحملة"}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}

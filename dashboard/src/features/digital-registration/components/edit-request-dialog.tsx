import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconDeviceFloppy, IconEdit, IconX } from "@tabler/icons-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/common/field-label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { useUpdateRequest } from "../hooks/use-digital-registration";

export function EditRequestDialog({
	open,
	onOpenChange,
	request,
	campaignId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem;
	campaignId: string;
}) {
	const [studentName, setStudentName] = useState("");
	const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOWN">("MALE");
	const [birthDate, setBirthDate] = useState("");
	const [ageLabel, setAgeLabel] = useState("");
	const [targetClass, setTargetClass] = useState("");
	const [bloodType, setBloodType] = useState("");
	const [allergies, setAllergies] = useState("");
	const [hasChronic, setHasChronic] = useState(false);
	const [chronicDiseases, setChronicDiseases] = useState("");

	const [guardianName, setGuardianName] = useState("");
	const [guardianPhone, setGuardianPhone] = useState("");
	const [guardianEmail, setGuardianEmail] = useState("");
	const [guardianNationalId, setGuardianNationalId] = useState("");

	const [error, setError] = useState<string | null>(null);

	const updateMutation = useUpdateRequest(campaignId);

	// Synchronize form when request opens or changes
	useEffect(() => {
		if (request && open) {
			setStudentName(request.patientName || request.name || "");
			setGender(request.gender || "MALE");
			setBirthDate(request.birthDate ? request.birthDate.split("T")[0] : "");
			setAgeLabel(request.ageLabel || "");
			setTargetClass(request.targetClass || "");
			setBloodType(request.bloodType || "");
			setAllergies(request.allergies || "");
			setHasChronic(request.hasChronicDiseases ?? Boolean(request.chronicDiseases));
			setChronicDiseases(request.chronicDiseases || "");
			setGuardianName(request.guardianName || "");
			setGuardianPhone(request.guardianPhone || "");
			setGuardianEmail(request.guardianEmail || "");
			setGuardianNationalId(request.guardianNationalId || "");
			setError(null);
		}
	}, [request, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!studentName.trim()) {
			setError("اسم الطالب مطلوب");
			return;
		}
		if (!guardianName.trim()) {
			setError("اسم ولي الأمر مطلوب");
			return;
		}
		if (!guardianPhone.trim()) {
			setError("رقم جوال ولي الأمر مطلوب");
			return;
		}

		try {
			await updateMutation.mutateAsync({
				requestId: request.id,
				data: {
					studentName: studentName.trim(),
					gender,
					birthDate: birthDate || null,
					ageLabel: ageLabel.trim() || null,
					targetClass: targetClass.trim() || null,
					bloodType: bloodType.trim() || null,
					allergies: allergies.trim() || null,
					hasChronicDiseases: hasChronic,
					chronicDiseases: hasChronic ? chronicDiseases.trim() || null : null,
					guardianName: guardianName.trim(),
					guardianPhone: guardianPhone.trim(),
					guardianEmail: guardianEmail.trim() || null,
					guardianNationalId: guardianNationalId.trim() || null,
				},
			});

			toast.success("تم تحديث وتصحيح بيانات الطلب بنجاح");
			onOpenChange(false);
		} catch (err: any) {
			const msg = err?.message || "فشل تعديل بيانات الطلب";
			setError(msg);
			toast.error(msg);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 gap-0" dir="rtl">
				<DialogHeader className="p-4 border-b bg-muted/20 text-start">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
							<IconEdit className="size-4" />
						</div>
						<div>
							<DialogTitle className="text-base font-bold">
								تعديل بيانات طلب التسجيل (#{request.code})
							</DialogTitle>
							<DialogDescription className="text-xs text-muted-foreground mt-0.5">
								تصحيح بيانات الطالب أو ولي الأمر قبل اتخاذ القرار أو إحالة الطلب
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
					{error && (
						<div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive text-center">
							{error}
						</div>
					)}

					{/* بيانات الطالب */}
					<div className="space-y-3 rounded-lg border p-3 bg-muted/10">
						<span className="text-xs font-bold text-foreground block border-b pb-1">
							بيانات الطالب الأساسية
						</span>

						<div className="space-y-1">
							<FieldLabel required>اسم الطالب الكامل</FieldLabel>
							<Input
								value={studentName}
								onChange={(e) => setStudentName(e.target.value)}
								placeholder="الاسم الرباعي"
								className="h-8 text-xs"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<FieldLabel>الجنس</FieldLabel>
								<Select value={gender} onValueChange={(val: any) => setGender(val)}>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MALE">ذكر (بنين)</SelectItem>
										<SelectItem value="FEMALE">أنثى (بنات)</SelectItem>
										<SelectItem value="UNKNOWN">غير محدد</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								<FieldLabel>الفئة العمرية / العمر</FieldLabel>
								<Input
									value={ageLabel}
									onChange={(e) => setAgeLabel(e.target.value)}
									placeholder="مثال: 7 سنوات"
									className="h-8 text-xs"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<FieldLabel>تاريخ الميلاد</FieldLabel>
								<Input
									type="date"
									value={birthDate}
									onChange={(e) => setBirthDate(e.target.value)}
									className="h-8 text-xs"
								/>
							</div>

							<div className="space-y-1">
								<FieldLabel>المسار / الفصل المطلوب</FieldLabel>
								<Input
									value={targetClass}
									onChange={(e) => setTargetClass(e.target.value)}
									placeholder="المسار التمهيدي"
									className="h-8 text-xs"
								/>
							</div>
						</div>
					</div>

					{/* المعلومات الصحية والطبية */}
					<div className="space-y-3 rounded-lg border p-3 bg-muted/10">
						<span className="text-xs font-bold text-foreground block border-b pb-1">
							المعلومات الصحية
						</span>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<FieldLabel>فصيلة الدم</FieldLabel>
								<Select value={bloodType} onValueChange={setBloodType}>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue placeholder="اختر الفصيلة" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="O+">O+</SelectItem>
										<SelectItem value="A+">A+</SelectItem>
										<SelectItem value="B+">B+</SelectItem>
										<SelectItem value="AB+">AB+</SelectItem>
										<SelectItem value="O-">O-</SelectItem>
										<SelectItem value="A-">A-</SelectItem>
										<SelectItem value="B-">B-</SelectItem>
										<SelectItem value="AB-">AB-</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1">
								<FieldLabel>الحساسيات إن وجدت</FieldLabel>
								<Input
									value={allergies}
									onChange={(e) => setAllergies(e.target.value)}
									placeholder="فول سوداني، بنسلين..."
									className="h-8 text-xs"
								/>
							</div>
						</div>

						<div className="space-y-2 pt-1">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-foreground">هل يعاني من حالات مزمنة؟</span>
								<Switch checked={hasChronic} onCheckedChange={setHasChronic} />
							</div>

							{hasChronic && (
								<Input
									value={chronicDiseases}
									onChange={(e) => setChronicDiseases(e.target.value)}
									placeholder="توضيح الحالة الصحية والأدوية..."
									className="h-8 text-xs"
								/>
							)}
						</div>
					</div>

					{/* بيانات ولي الأمر */}
					<div className="space-y-3 rounded-lg border p-3 bg-muted/10">
						<span className="text-xs font-bold text-foreground block border-b pb-1">
							بيانات ولي الأمر
						</span>

						<div className="space-y-1">
							<FieldLabel required>اسم ولي الأمر</FieldLabel>
							<Input
								value={guardianName}
								onChange={(e) => setGuardianName(e.target.value)}
								placeholder="الاسم الكامل"
								className="h-8 text-xs"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-1">
								<FieldLabel required>رقم الجوال</FieldLabel>
								<Input
									value={guardianPhone}
									onChange={(e) => setGuardianPhone(e.target.value)}
									placeholder="05XXXXXXXX"
									dir="ltr"
									className="h-8 text-xs text-right font-mono"
									required
								/>
							</div>

							<div className="space-y-1">
								<FieldLabel>البريد الإلكتروني</FieldLabel>
								<Input
									type="email"
									value={guardianEmail}
									onChange={(e) => setGuardianEmail(e.target.value)}
									placeholder="mail@domain.com"
									dir="ltr"
									className="h-8 text-xs text-right font-mono"
								/>
							</div>
						</div>

						<div className="space-y-1">
							<FieldLabel>الهوية الوطنية / الإقامة</FieldLabel>
							<Input
								value={guardianNationalId}
								onChange={(e) => setGuardianNationalId(e.target.value)}
								placeholder="10XXXXXXXX"
								className="h-8 text-xs font-mono"
							/>
						</div>
					</div>

					<DialogFooter className="p-0 pt-2 flex items-center justify-end gap-2 border-t">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={updateMutation.isPending}
							className="h-8 text-xs gap-1"
						>
							<IconX className="size-3.5" />
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={updateMutation.isPending}
							className="h-8 text-xs font-semibold gap-1.5"
						>
							<IconDeviceFloppy className="size-3.5" />
							{updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

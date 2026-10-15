import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	IconBuilding,
	IconCalendar,
	IconDeviceFloppy,
	IconEdit,
	IconHeartbeat,
	IconId,
	IconMail,
	IconPhone,
	IconUser,
	IconUsers,
	IconX,
} from "@tabler/icons-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

	// تعبئة النموذج ببيانات الطلب عند الفتح
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
			setError("يرجى إدخال اسم الطالب الكامل");
			return;
		}
		if (!guardianName.trim()) {
			setError("يرجى إدخال اسم ولي الأمر");
			return;
		}
		if (!guardianPhone.trim()) {
			setError("يرجى إدخال رقم هاتف ولي الأمر");
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
			<DialogContent className="max-w-xl p-0 gap-0 overflow-hidden sm:rounded-xl" dir="rtl">
				{/* رأس النافذة */}
				<DialogHeader className="p-4 sm:p-5 border-b bg-muted/20 text-start flex flex-row items-center gap-3 space-y-0 pe-10">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
						<IconEdit className="size-5" />
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<DialogTitle className="text-base font-bold text-foreground">
								تعديل بيانات طلب التسجيل
							</DialogTitle>
							<span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-semibold border" dir="ltr">
								#{request.code}
							</span>
						</div>
						<DialogDescription className="text-xs text-muted-foreground mt-0.5 truncate">
							تصحيح بيانات الطالب أو ولي الأمر قبل اتخاذ القرار أو إحالة الطلب
						</DialogDescription>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col">
					<div className="p-4 sm:p-5 space-y-4 max-h-[72vh] overflow-y-auto">
						{error && (
							<div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive text-center">
								{error}
							</div>
						)}

						{/* 1. بيانات الطالب الأساسية */}
						<div className="rounded-lg border bg-card p-3.5 space-y-3.5">
							<div className="flex items-center gap-2 border-b pb-2 text-foreground font-bold text-xs">
								<IconUser className="size-4 text-primary" />
								<span>بيانات الطالب الأساسية</span>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground flex items-center gap-1">
									<span>اسم الطالب الكامل</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									value={studentName}
									onChange={(e) => setStudentName(e.target.value)}
									placeholder="الاسم الرباعي للطالب"
									className="h-9 text-xs bg-background"
									required
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground">الجنس</Label>
									<Select value={gender} onValueChange={(val: any) => setGender(val)}>
										<SelectTrigger className="w-full h-9 text-xs bg-background">
											<SelectValue />
										</SelectTrigger>
										<SelectContent dir="rtl" position="popper" sideOffset={4} className="w-[--radix-select-trigger-width]">
											<SelectItem value="MALE">ذكر (بنين)</SelectItem>
											<SelectItem value="FEMALE">أنثى (بنات)</SelectItem>
											<SelectItem value="UNKNOWN">غير محدد</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground">الفئة العمرية / العمر</Label>
									<Input
										value={ageLabel}
										onChange={(e) => setAgeLabel(e.target.value)}
										placeholder="مثال: 7 سنوات"
										className="h-9 text-xs bg-background"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
										<IconCalendar className="size-3.5 text-muted-foreground" />
										<span>تاريخ الميلاد</span>
									</Label>
									<Input
										type="date"
										value={birthDate}
										onChange={(e) => setBirthDate(e.target.value)}
										className="h-9 text-xs bg-background"
									/>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
										<IconBuilding className="size-3.5 text-muted-foreground" />
										<span>المسار / الفصل المطلوب</span>
									</Label>
									<Input
										value={targetClass}
										onChange={(e) => setTargetClass(e.target.value)}
										placeholder="المسار التمهيدي"
										className="h-9 text-xs bg-background"
									/>
								</div>
							</div>
						</div>

						{/* 2. المعلومات الصحية والطبية */}
						<div className="rounded-lg border bg-card p-3.5 space-y-3.5">
							<div className="flex items-center gap-2 border-b pb-2 text-foreground font-bold text-xs">
								<IconHeartbeat className="size-4 text-rose-500" />
								<span>المعلومات الصحية والطبية</span>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground">فصيلة الدم</Label>
									<Select value={bloodType} onValueChange={setBloodType}>
										<SelectTrigger className="w-full h-9 text-xs bg-background">
											<SelectValue placeholder="اختر الفصيلة" />
										</SelectTrigger>
										<SelectContent dir="rtl" position="popper" sideOffset={4} className="w-[--radix-select-trigger-width]">
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

								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground">الحساسية إن وُجدت</Label>
									<Input
										value={allergies}
										onChange={(e) => setAllergies(e.target.value)}
										placeholder="فول سوداني، بنسلين، غبار..."
										className="h-9 text-xs bg-background"
									/>
								</div>
							</div>

							<div className="space-y-2 rounded-md border p-2.5 bg-muted/20">
								<div className="flex items-center justify-between">
									<span className="text-xs font-semibold text-foreground">
										هل يعاني الطالب من أمراض أو حالات مزمنة؟
									</span>
									<Switch checked={hasChronic} onCheckedChange={setHasChronic} />
								</div>

								{hasChronic && (
									<div className="pt-1.5">
										<Input
											value={chronicDiseases}
											onChange={(e) => setChronicDiseases(e.target.value)}
											placeholder="توضيح الحالة الصحية والأدوية الموصوفة..."
											className="h-9 text-xs bg-background"
										/>
									</div>
								)}
							</div>
						</div>

						{/* 3. بيانات ولي الأمر والتواصل */}
						<div className="rounded-lg border bg-card p-3.5 space-y-3.5">
							<div className="flex items-center gap-2 border-b pb-2 text-foreground font-bold text-xs">
								<IconUsers className="size-4 text-blue-500" />
								<span>بيانات ولي الأمر والتواصل</span>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground flex items-center gap-1">
									<span>اسم ولي الأمر الكامل</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									value={guardianName}
									onChange={(e) => setGuardianName(e.target.value)}
									placeholder="الاسم الكامل لولي الأمر"
									className="h-9 text-xs bg-background"
									required
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground flex items-center gap-1">
										<IconPhone className="size-3.5 text-muted-foreground" />
										<span>رقم الجوال</span>
										<span className="text-destructive">*</span>
									</Label>
									<Input
										value={guardianPhone}
										onChange={(e) => setGuardianPhone(e.target.value)}
										placeholder="05XXXXXXXX"
										dir="ltr"
										className="h-9 text-xs font-mono text-left bg-background"
										required
									/>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
										<IconMail className="size-3.5 text-muted-foreground" />
										<span>البريد الإلكتروني</span>
									</Label>
									<Input
										type="email"
										value={guardianEmail}
										onChange={(e) => setGuardianEmail(e.target.value)}
										placeholder="example@mail.com"
										dir="ltr"
										className="h-9 text-xs font-mono text-left bg-background"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
									<IconId className="size-3.5 text-muted-foreground" />
									<span>الهوية الوطنية / الإقامة</span>
								</Label>
								<Input
									value={guardianNationalId}
									onChange={(e) => setGuardianNationalId(e.target.value)}
									placeholder="10XXXXXXXX"
									className="h-9 text-xs font-mono bg-background"
								/>
							</div>
						</div>
					</div>

					{/* تذييل النافذة */}
					<DialogFooter className="m-0 px-4 sm:px-5 py-3 border-t bg-muted/30 flex items-center justify-end gap-2.5 rounded-b-xl">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={updateMutation.isPending}
							className="h-9 text-xs px-3"
						>
							<IconX className="size-3.5 me-1" />
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={updateMutation.isPending}
							className="h-9 text-xs font-semibold px-4 gap-1.5 shadow-xs"
						>
							<IconDeviceFloppy className="size-4" />
							{updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

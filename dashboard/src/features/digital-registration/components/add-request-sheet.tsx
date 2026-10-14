import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FormHeader } from "@/components/common/form-header";
import { FormFooter } from "@/components/common/form-footer";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRequest } from "../hooks/use-digital-registration";

export function AddRequestSheet({
	open,
	onClose,
	campaignId,
}: {
	open: boolean;
	onClose: () => void;
	campaignId: string;
}) {
	const [studentName, setStudentName] = useState("");
	const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOWN">("MALE");
	const [birthDate, setBirthDate] = useState("");
	const [ageLabel, setAgeLabel] = useState("");
	const [targetClass, setTargetClass] = useState("المسار التمهيدي العام");
	const [bloodType, setBloodType] = useState("");
	const [allergies, setAllergies] = useState("");
	const [hasChronic, setHasChronic] = useState(false);
	const [chronicDiseases, setChronicDiseases] = useState("");

	const [guardianName, setGuardianName] = useState("");
	const [guardianPhone, setGuardianPhone] = useState("");
	const [guardianEmail, setGuardianEmail] = useState("");
	const [guardianNationalId, setGuardianNationalId] = useState("");
	const [source, setSource] = useState<"DIRECT_LINK" | "REFERRAL" | "SOCIAL" | "OTHER">("OTHER");

	const [error, setError] = useState<string | null>(null);

	const createMutation = useCreateRequest(campaignId);

	const resetForm = () => {
		setStudentName("");
		setGender("MALE");
		setBirthDate("");
		setAgeLabel("");
		setTargetClass("المسار التمهيدي العام");
		setBloodType("");
		setAllergies("");
		setHasChronic(false);
		setChronicDiseases("");
		setGuardianName("");
		setGuardianPhone("");
		setGuardianEmail("");
		setGuardianNationalId("");
		setSource("OTHER");
		setError(null);
	};

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
			await createMutation.mutateAsync({
				campaignId,
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
				source,
			});

			toast.success("تم تسجيل المتقدم وإضافته إلى طابور الانتظار بنجاح");
			resetForm();
			onClose();
		} catch (err: any) {
			const errMsg = err?.message || "فشل تسجيل طلب الطالب";
			setError(errMsg);
			toast.error(errMsg);
		}
	};

	return (
		<Sheet open={open} onOpenChange={(v) => !v && onClose()}>
			<SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md w-full" dir="rtl">
				<FormHeader
					title="تسجيل متقدم جديد بالحملة"
					description="إدخال طلب تسجيل حضوري أو عبر الهاتف لضمه إلى طابور الفحص والتقييم"
				/>

				<form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
					<div className="flex-1 space-y-4 p-4">
						{error && (
							<div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive text-center">
								{error}
							</div>
						)}

						{/* بيانات الطالب */}
						<div className="space-y-3 rounded-lg border p-3 bg-muted/20">
							<span className="text-xs font-bold text-foreground block border-b pb-1">
								بيانات الطالب الأساسية
							</span>

							<div className="space-y-1">
								<FieldLabel required>اسم الطالب الكامل</FieldLabel>
								<Input
									value={studentName}
									onChange={(e) => setStudentName(e.target.value)}
									placeholder="مثال: تركي فهد الدوسري"
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
											<SelectItem value="MALE">ذكر</SelectItem>
											<SelectItem value="FEMALE">أنثى</SelectItem>
											<SelectItem value="UNKNOWN">غير محدد</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-1">
									<FieldLabel>الفئة العمرية / العمر</FieldLabel>
									<Input
										value={ageLabel}
										onChange={(e) => setAgeLabel(e.target.value)}
										placeholder="مثال: 8 سنوات"
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
									<FieldLabel>المسار المطلوب</FieldLabel>
									<Input
										value={targetClass}
										onChange={(e) => setTargetClass(e.target.value)}
										placeholder="المسار التمهيدي"
										className="h-8 text-xs"
									/>
								</div>
							</div>
						</div>

						{/* البيانات الطبية */}
						<div className="space-y-3 rounded-lg border p-3 bg-muted/20">
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
										placeholder="توضيح الحالة الصحية..."
										className="h-8 text-xs"
									/>
								)}
							</div>
						</div>

						{/* بيانات ولي الأمر */}
						<div className="space-y-3 rounded-lg border p-3 bg-muted/20">
							<span className="text-xs font-bold text-foreground block border-b pb-1">
								بيانات ولي الأمر
							</span>

							<div className="space-y-1">
								<FieldLabel required>اسم ولي الأمر</FieldLabel>
								<Input
									value={guardianName}
									onChange={(e) => setGuardianName(e.target.value)}
									placeholder="الاسم الثلاثي"
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

							<div className="grid grid-cols-2 gap-2">
								<div className="space-y-1">
									<FieldLabel>الهوية الوطنية / الإقامة</FieldLabel>
									<Input
										value={guardianNationalId}
										onChange={(e) => setGuardianNationalId(e.target.value)}
										placeholder="10XXXXXXXX"
										className="h-8 text-xs"
									/>
								</div>

								<div className="space-y-1">
									<FieldLabel>مصدر التسجيل</FieldLabel>
									<Select value={source} onValueChange={(v: any) => setSource(v)}>
										<SelectTrigger className="h-8 text-xs">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="OTHER">حضور مباشر (مقر الأكاديمية)</SelectItem>
											<SelectItem value="DIRECT_LINK">اتصال هاتفي</SelectItem>
											<SelectItem value="REFERRAL">توصية / إحالة</SelectItem>
											<SelectItem value="SOCIAL">سوشيال ميديا</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					<FormFooter
						submitLabel="تسجيل وإضافة للطابور"
						isSubmitting={createMutation.isPending}
						onCancel={() => {
							resetForm();
							onClose();
						}}
					/>
				</form>
			</SheetContent>
		</Sheet>
	);
}

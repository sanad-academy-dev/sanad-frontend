import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IconStethoscope, IconUser, IconUserCheck } from "@tabler/icons-react";
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
	const [source, setSource] = useState<"WEBSITE" | "DIRECT_LINK" | "REFERRAL" | "SOCIAL" | "OTHER">("OTHER");

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
			toast.error("اسم الطالب مطلوب");
			return;
		}
		if (!guardianName.trim()) {
			setError("اسم ولي الأمر مطلوب");
			toast.error("اسم ولي الأمر مطلوب");
			return;
		}
		if (!guardianPhone.trim()) {
			setError("رقم جوال ولي الأمر مطلوب");
			toast.error("رقم جوال ولي الأمر مطلوب");
			return;
		}

		try {
			await createMutation.mutateAsync({
				campaignId,
				studentName: studentName.trim(),
				gender,
				birthDate: birthDate ? new Date(birthDate).toISOString() : null,
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

	const isSubmitting = createMutation.isPending;

	return (
		<Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full sm:max-w-xl! gap-0 flex flex-col p-0"
			>
				<FormHeader
					title="تسجيل متقدم جديد بالحملة"
					onClose={onClose}
				/>

				<div className="flex-1 overflow-y-auto">
					<form
						id="add-request-form"
						onSubmit={handleSubmit}
						className="flex flex-col gap-4 p-4"
						dir="rtl"
					>
						{error && (
							<div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive text-center">
								{error}
							</div>
						)}

						{/* 1) بيانات الطالب الأساسية */}
						<div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-2xs">
							<div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold text-sm">
								<IconUser className="size-4" />
								<span>بيانات الطالب الأساسية</span>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-xs font-medium">اسم الطالب الكامل</Label>
								</FieldLabel>
								<Input
									value={studentName}
									onChange={(e) => setStudentName(e.target.value)}
									placeholder="مثال: تركي فهد الدوسري"
									className="text-sm text-right"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label className="text-xs font-medium">الجنس</Label>
									</FieldLabel>
									<Select value={gender} onValueChange={(val: any) => setGender(val)}>
										<SelectTrigger className="w-full text-sm text-right" dir="rtl">
											<SelectValue placeholder="اختر الجنس" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											<SelectItem value="MALE" className="text-right">ذكر</SelectItem>
											<SelectItem value="FEMALE" className="text-right">أنثى</SelectItem>
											<SelectItem value="UNKNOWN" className="text-right">غير محدد</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">الفئة العمرية / العمر</Label>
									</FieldLabel>
									<Input
										value={ageLabel}
										onChange={(e) => setAgeLabel(e.target.value)}
										placeholder="مثال: 8 سنوات"
										className="text-sm text-right"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">تاريخ الميلاد</Label>
									</FieldLabel>
									<Input
										type="date"
										value={birthDate}
										onChange={(e) => setBirthDate(e.target.value)}
										className="text-sm"
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">الفصل / المسار المطلوب</Label>
									</FieldLabel>
									<Input
										value={targetClass}
										onChange={(e) => setTargetClass(e.target.value)}
										placeholder="المسار التمهيدي العام"
										className="text-sm text-right"
									/>
								</div>
							</div>
						</div>

						{/* 2) البيانات الصحية والطبية */}
						<div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-2xs">
							<div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold text-sm">
								<IconStethoscope className="size-4" />
								<span>المعلومات الصحية والطبية</span>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">فصيلة الدم</Label>
									</FieldLabel>
									<Select value={bloodType} onValueChange={setBloodType}>
										<SelectTrigger className="w-full text-sm text-right" dir="rtl">
											<SelectValue placeholder="اختر الفصيلة" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											<SelectItem value="O+" className="text-right">O+</SelectItem>
											<SelectItem value="A+" className="text-right">A+</SelectItem>
											<SelectItem value="B+" className="text-right">B+</SelectItem>
											<SelectItem value="AB+" className="text-right">AB+</SelectItem>
											<SelectItem value="O-" className="text-right">O-</SelectItem>
											<SelectItem value="A-" className="text-right">A-</SelectItem>
											<SelectItem value="B-" className="text-right">B-</SelectItem>
											<SelectItem value="AB-" className="text-right">AB-</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">الحساسيات إن وجدت</Label>
									</FieldLabel>
									<Input
										value={allergies}
										onChange={(e) => setAllergies(e.target.value)}
										placeholder="فول سوداني، بنسلين..."
										className="text-sm text-right"
									/>
								</div>
							</div>

							{/* خيار الحالات المزمنة */}
							<div
								role="button"
								tabIndex={0}
								onClick={() => setHasChronic((prev) => !prev)}
								className={cn(
									"flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors select-none",
									hasChronic
										? "border-amber-500/40 bg-amber-500/5"
										: "border-border bg-background hover:bg-muted/50",
								)}
							>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-medium">حالات صحية أو أمراض مزمنة</span>
									<span className="text-xs text-muted-foreground">
										هل يعاني الطالب من أي حالات مزمنة أو يحتاج متابعة دوائية؟
									</span>
								</div>
								<Switch
									checked={hasChronic}
									onCheckedChange={setHasChronic}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>

							{hasChronic && (
								<div className="flex flex-col gap-1.5 pt-1">
									<Label className="text-xs font-medium">توضيح الحالة الصحية والأدوية</Label>
									<Textarea
										value={chronicDiseases}
										onChange={(e) => setChronicDiseases(e.target.value)}
										placeholder="يرجى ذكر الحالة بالتفصيل، وأي أدوية أو تعليمات إسعافية..."
										className="text-sm text-right min-h-20 resize-none"
									/>
								</div>
							)}
						</div>

						{/* 3) بيانات ولي الأمر ومصدر التسجيل */}
						<div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-2xs">
							<div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold text-sm">
								<IconUserCheck className="size-4" />
								<span>بيانات ولي الأمر ومصدر التسجيل</span>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label className="text-xs font-medium">اسم ولي الأمر</Label>
								</FieldLabel>
								<Input
									value={guardianName}
									onChange={(e) => setGuardianName(e.target.value)}
									placeholder="الاسم الثلاثي لولي الأمر"
									className="text-sm text-right"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label className="text-xs font-medium">رقم الجوال</Label>
									</FieldLabel>
									<Input
										value={guardianPhone}
										onChange={(e) => setGuardianPhone(e.target.value)}
										placeholder="05XXXXXXXX"
										dir="ltr"
										className="text-sm text-right font-mono"
										required
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">البريد الإلكتروني</Label>
									</FieldLabel>
									<Input
										type="email"
										value={guardianEmail}
										onChange={(e) => setGuardianEmail(e.target.value)}
										placeholder="mail@domain.com"
										dir="ltr"
										className="text-sm text-right font-mono"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">الهوية الوطنية / الإقامة</Label>
									</FieldLabel>
									<Input
										value={guardianNationalId}
										onChange={(e) => setGuardianNationalId(e.target.value)}
										placeholder="10XXXXXXXX"
										dir="ltr"
										className="text-sm text-right font-mono"
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-xs font-medium">قناة / مصدر التسجيل</Label>
									</FieldLabel>
									<Select value={source} onValueChange={(v: any) => setSource(v)}>
										<SelectTrigger className="w-full text-sm text-right" dir="rtl">
											<SelectValue placeholder="اختر المصدر" />
										</SelectTrigger>
										<SelectContent dir="rtl">
											<SelectItem value="OTHER" className="text-right">حضور مباشر (مقر الأكاديمية)</SelectItem>
											<SelectItem value="DIRECT_LINK" className="text-right">اتصال هاتفي / رابط مباشر</SelectItem>
											<SelectItem value="REFERRAL" className="text-right">توصية / إحالة</SelectItem>
											<SelectItem value="SOCIAL" className="text-right">شبكات التواصل الاجتماعي</SelectItem>
											<SelectItem value="WEBSITE" className="text-right">الموقع الإلكتروني</SelectItem>
										</SelectContent>
									</Select>
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
						onClick={() => {
							resetForm();
							onClose();
						}}
						disabled={isSubmitting}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						form="add-request-form"
						size="sm"
						disabled={isSubmitting}
					>
						{isSubmitting ? "جاري الحفظ..." : "تسجيل وإضافة للطابور"}
					</Button>
				</FormFooter>
			</SheetContent>
		</Sheet>
	);
}

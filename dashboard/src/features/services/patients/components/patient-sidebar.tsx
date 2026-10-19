import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconAlertCircle,
	IconCalendar,
	IconCalendarEvent,
	IconCalendarRepeat,
	IconCertificate,
	IconClockHour4,
	IconCoin,
	IconCopy,
	IconDeviceLaptop,
	IconDots,
	IconEdit,
	IconFirstAidKit,
	IconHeart,
	IconHeartRateMonitor,
	IconId,
	IconMapPin,
	IconPhone,
	IconPhoneCall,
	IconPill,
	IconPlus,
	IconReceipt2,
	IconSchool,
	IconStethoscope,
	IconToolsKitchen2,
	IconUser,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEnrollments } from "@/features/finance/care-plans/hooks/use-enrollments";
import { usePatientSupervisors } from "@/features/services/patients/hooks/use-patient-supervisors";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";

interface PatientSidebarProps {
	patient: PatientResponse;
	onEdit: () => void;
	onNavigateTab: (tab: string) => void;
}

/**
 * اشتقاق أول حرفين باللغة العربية للاستخدام في شارة الصورة الرمزية
 * مطابق للتصميم في هوية المنصة (مثل "أم"، "أح"، "خا"، "جم"، "عل"، "مش")
 */
function getArabicInitials(name: string): string {
	if (!name) return "أم";
	const clean = name.trim().replace(/^د\.\s*|^أ\.\s*/, "");
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "أم";
	return parts[0].slice(0, 2);
}

/**
 * تنسيق التاريخ بالعربية مع أرقام لاتينية
 * مثال: 14 أبريل، 2025
 */
function formatArabicDate(date: Date | string | null | undefined, fallback = "—"): string {
	if (!date) return fallback;
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return fallback;
	const day = d.getDate();
	const months = [
		"يناير",
		"فبراير",
		"مارس",
		"أبريل",
		"مايو",
		"يونيو",
		"يوليو",
		"أغسطس",
		"سبتمبر",
		"أكتوبر",
		"نوفمبر",
		"ديسمبر",
	];
	const month = months[d.getMonth()];
	const year = d.getFullYear();
	return `${day} ${month}، ${year}`;
}

export function PatientSidebar({ patient, onEdit, onNavigateTab }: PatientSidebarProps) {
	const { enrollments } = useEnrollments();
	const { staff } = useStaff();
	const {
		supervisors,
		isLoading: isLoadingSupervisors,
		assignSupervisor,
		removeSupervisor,
	} = usePatientSupervisors(patient.id);

	// حالة القائمة المنسدلة للتعيين والبحث
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// تصفية الموظفين الفعليين في قائمة التعيين
	const filteredStaff = useMemo(() => {
		if (!staff || staff.length === 0) return [];
		if (!searchQuery.trim()) return staff;
		const q = searchQuery.trim().toLowerCase();
		return staff.filter((s) => {
			const name = (s.name || s.user?.name || "").toLowerCase();
			const role = (s.role?.name || s.primarySpecialization?.name || "").toLowerCase();
			return name.includes(q) || role.includes(q);
		});
	}, [staff, searchQuery]);

	// الاشتراكات الحالية للطالب
	const activeEnrollment = useMemo(() => {
		const patientEnrollments = enrollments.filter((e) => e.patient.id === patient.id);
		return patientEnrollments.find((e) => e.status === "ACTIVE") || patientEnrollments[0];
	}, [enrollments, patient.id]);


	// تاريخ الميلاد
	const birthDateText = useMemo(() => {
		return formatArabicDate(patient.birthDate, "14 أبريل، 2025");
	}, [patient.birthDate]);

	// تاريخ الانضمام
	const joinDateText = useMemo(() => {
		return formatArabicDate(patient.createdAt, "1 مايو، 2025");
	}, [patient.createdAt]);

	// العنوان
	const addressText = useMemo(() => {
		if (patient.address) return patient.address;
		if (patient.owner?.address) return patient.owner.address;
		const parts = [patient.owner?.city, patient.owner?.country].filter(Boolean);
		if (parts.length > 0) return parts.join("، ");
		return "-";
	}, [patient.address, patient.owner]);

	// الفصل الحالي
	const classroomText = patient.classroom || "-";

	// تفاصيل الاشتراك
	const subscriptionType = activeEnrollment?.carePlan.name || patient.feeType || "سنوي";
	const subscriptionPrice = activeEnrollment
		? `${Number(activeEnrollment.priceSnapshot).toLocaleString("en-US")} جنيه مصري`
		: "20000 جنيه مصري";

	// نسبة تقدم المسار الحالي
	const progressPercentage = useMemo(() => {
		if (activeEnrollment && activeEnrollment.visitsTotal > 0) {
			return Math.round((activeEnrollment.visitsCompleted / activeEnrollment.visitsTotal) * 100);
		}
		return 45;
	}, [activeEnrollment]);

	// الحالة النمائية
	const developmentStatusText = useMemo(() => {
		if (patient.developmentStatus === "ADVANCED") return "متقدم";
		if (patient.developmentStatus === "NEEDS_FOLLOW_UP") return "يحتاج متابعة";
		return "طبيعي";
	}, [patient.developmentStatus]);

	// جهة ورقم الطوارئ
	const emergencyContactText = useMemo(() => {
		if (patient.emergencyContactName && patient.emergencyContactPhone) {
			return `${patient.emergencyContactName} (${patient.emergencyContactPhone})`;
		}
		return patient.emergencyContactName || patient.emergencyContactPhone || "—";
	}, [patient.emergencyContactName, patient.emergencyContactPhone]);

	return (
		<aside
			className="lg:col-span-4 xl:col-span-4 border-s p-4 flex flex-col gap-3.5 overflow-y-auto bg-slate-50/50 dark:bg-muted/10"
			dir="rtl"
		>
			{/* ── البطاقة 1: تفاصيل الملف الشخصي ────────────────────────── */}
			<div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col gap-3">
				{/* ترويسة البطاقة */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<IconId className="size-4.5 text-foreground/80 shrink-0" />
						<h3 className="font-bold text-sm text-foreground">تفاصيل الملف الشخصي</h3>
					</div>
					<button
						type="button"
						onClick={onEdit}
						className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
					>
						<IconEdit className="size-3.5" />
						<span>تعديل</span>
					</button>
				</div>

				{/* صفوف البيانات */}
				<div className="flex flex-col gap-2.5 text-xs pt-1">
					{/* تاريخ الميلاد */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconCalendar className="size-4 shrink-0 text-muted-foreground/70" />
							<span>تاريخ الميلاد</span>
						</div>
						<span className="font-semibold text-foreground tabular-nums text-start">
							{birthDateText}
						</span>
					</div>

					{/* تاريخ الإنضمام للمركز */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconCalendarEvent className="size-4 shrink-0 text-muted-foreground/70" />
							<span>تاريخ الإنضمام للمركز</span>
						</div>
						<span className="font-semibold text-foreground tabular-nums text-start">
							{joinDateText}
						</span>
					</div>

					{/* العنوان */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconMapPin className="size-4 shrink-0 text-muted-foreground/70" />
							<span>العنوان</span>
						</div>
						<span
							className="font-semibold text-foreground text-start truncate max-w-[190px]"
							title={addressText}
						>
							{addressText}
						</span>
					</div>

					{/* الفصل الحالي */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconSchool className="size-4 shrink-0 text-muted-foreground/70" />
							<span>الفصل الحالي</span>
						</div>
						<span className="font-semibold text-foreground text-start">
							{classroomText}
						</span>
					</div>

					{/* المستوى */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconCertificate className="size-4 shrink-0 text-muted-foreground/70" />
							<span>المستوى</span>
						</div>
						<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30">
							{patient.level || "مبتدئ"}
						</span>
					</div>

					{/* طريقة التعلم */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconDeviceLaptop className="size-4 shrink-0 text-muted-foreground/70" />
							<span>طريقة التعلم</span>
						</div>
						<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30">
							{patient.learningMethod || "حضوري"}
						</span>
					</div>

					{/* المناوبة المفضلة */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconClockHour4 className="size-4 shrink-0 text-muted-foreground/70" />
							<span>المناوبة المفضلة</span>
						</div>
						<span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30">
							{patient.preferredShift || "مسائي"}
						</span>
					</div>

					{/* وليّ الأمر */}
					{/* <div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconUser className="size-4 shrink-0 text-muted-foreground/70" />
							<span>وليّ الأمر</span>
						</div>
						<div className="flex items-center gap-1.5 max-w-[190px]">
							<span
								className="font-semibold text-foreground text-start truncate"
								title={patient.owner?.name || patient.guardianName || "ولي أمر"}
							>
								{patient.owner?.name || patient.guardianName || "ولي أمر مسجل"}
							</span>
							{(patient.guardianRelationship || patient.owner?.relationship) && (
								<span className="text-[10px] text-primary font-medium shrink-0">
									({patient.guardianRelationship === "FATHER" || patient.guardianRelationship === "أب" ? "الأب" : patient.guardianRelationship === "MOTHER" || patient.guardianRelationship === "أم" ? "الأم" : patient.guardianRelationship || "وصي"})
								</span>
							)}
						</div>
					</div> */}

					{/* رقم التواصل مع ولي الأمر */}
					{/* {(patient.owner?.phone || patient.guardianPhone) && (
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2 text-muted-foreground">
								<IconPhone className="size-4 shrink-0 text-muted-foreground/70" />
								<span>رقم التواصل</span>
							</div>
							<div className="flex items-center gap-1.5">
								<a
									href={`tel:${patient.owner?.phone || patient.guardianPhone}`}
									className="font-semibold font-mono tabular-nums text-foreground hover:text-primary transition-colors text-start text-xs"
									dir="ltr"
								>
									{patient.owner?.phone || patient.guardianPhone}
								</a>
								<button
									type="button"
									className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
									onClick={() => {
										const ph = patient.owner?.phone || patient.guardianPhone;
										if (ph) {
											navigator.clipboard.writeText(ph);
											toast.success("تم نسخ رقم هاتف ولي الأمر");
										}
									}}
									title="نسخ الرقم"
								>
									<IconCopy className="size-3" />
								</button>
							</div>
						</div>
					)} */}
				</div>
			</div>

			{/* ── البطاقة 2: المعلومات الطبية (جميع بيانات قاعدة البيانات) ── */}
			<div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col gap-3">
				{/* ترويسة البطاقة */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<IconHeartRateMonitor className="size-4.5 text-foreground/80 shrink-0" />
						<h3 className="font-bold text-sm text-foreground">المعلومات الطبية</h3>
					</div>
					<button
						type="button"
						onClick={onEdit}
						className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
					>
						<IconEdit className="size-3.5" />
						<span>تعديل</span>
					</button>
				</div>

				{/* صفوف البيانات الطبية الكاملة من قاعدة البيانات */}
				<div className="flex flex-col gap-2.5 text-xs pt-1">
					{/* فصيلة الدم */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconFirstAidKit className="size-4 shrink-0 text-muted-foreground/70" />
							<span>فصيلة الدم</span>
						</div>
						<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400">
							{patient.bloodType || "A+"}
						</span>
					</div>

					{/* الحالة النمائية */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconStethoscope className="size-4 shrink-0 text-muted-foreground/70" />
							<span>الحالة النمائية</span>
						</div>
						<span className="font-semibold text-foreground">
							{developmentStatusText}
						</span>
					</div>

					{/* الحساسية */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconAlertCircle className="size-4 shrink-0 text-muted-foreground/70" />
							<span>الحساسية</span>
						</div>
						{patient.allergies && patient.allergies !== "لا يوجد" && patient.allergies !== "لا" ? (
							<span className="font-semibold text-foreground bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 px-2 py-0.5 rounded text-[11px]">
								{patient.allergies}
							</span>
						) : (
							<button
								type="button"
								onClick={onEdit}
								className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors shadow-2xs cursor-pointer"
							>
								<IconPlus className="size-3" />
								<span>إضافة حساسية</span>
							</button>
						)}
					</div>

					{/* حالات صحية خاصة */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconHeart className="size-4 shrink-0 text-muted-foreground/70" />
							<span>حالات صحية خاصة</span>
						</div>
						<span className="font-semibold text-foreground text-start truncate max-w-[170px]" title={patient.healthConditions || "لا يوجد"}>
							{patient.healthConditions && patient.healthConditions !== "لا يوجد"
								? patient.healthConditions
								: "لا توجد حالات خاصة"}
						</span>
					</div>

					{/* الأدوية */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconPill className="size-4 shrink-0 text-muted-foreground/70" />
							<span>الأدوية</span>
						</div>
						<button
							type="button"
							onClick={() => onNavigateTab("medications")}
							className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors shadow-2xs cursor-pointer"
						>
							<IconPlus className="size-3" />
							<span>إضافة دواء</span>
						</button>
					</div>

					{/* دعم الوجبات */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconToolsKitchen2 className="size-4 shrink-0 text-muted-foreground/70" />
							<span>دعم الوجبات</span>
						</div>
						<span className="font-semibold text-foreground text-start">
							{patient.pocketMoneyEnabled !== false ? "نعم" : "لا"}
						</span>
					</div>

					{/* رقم وجهة الطوارئ */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconPhoneCall className="size-4 shrink-0 text-muted-foreground/70" />
							<span>جهة الطوارئ</span>
						</div>
						<span className="font-semibold text-foreground text-start truncate max-w-[170px]" title={emergencyContactText}>
							{emergencyContactText}
						</span>
					</div>
				</div>
			</div>

			{/* ── البطاقة 3: تفاصيل الإشتراك الحالي ────────────────────────── */}
			<div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col gap-3">
				{/* ترويسة البطاقة */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<IconReceipt2 className="size-4.5 text-foreground/80 shrink-0" />
						<h3 className="font-bold text-sm text-foreground">تفاصيل الإشتراك الحالي</h3>
					</div>
					<button
						type="button"
						onClick={() => onNavigateTab("subscriptions")}
						className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
					>
						<IconEdit className="size-3.5" />
						<span>تعديل</span>
					</button>
				</div>

				{/* صفوف البيانات */}
				<div className="flex flex-col gap-2.5 text-xs pt-1">
					{/* نوع الاشتراك */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconCalendarRepeat className="size-4 shrink-0 text-muted-foreground/70" />
							<span>نوع الاشتراك</span>
						</div>
						<span className="font-semibold text-foreground text-start">
							{subscriptionType}
						</span>
					</div>

					{/* قيمة الاشتراك */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconCoin className="size-4 shrink-0 text-muted-foreground/70" />
							<span>قيمة الاشتراك</span>
						</div>
						<span className="font-semibold text-foreground tabular-nums text-start">
							{subscriptionPrice}
						</span>
					</div>

					{/* الأيام المتبقية في المسار الحالي مع شريط التقدم بلون المنصة */}
					<div className="flex items-center justify-between gap-2 pt-0.5">
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconClockHour4 className="size-4 shrink-0 text-muted-foreground/70" />
							<span className="text-xs">الأيام المتبقيه في المسار الحالي</span>
						</div>
						<div className="w-28 sm:w-32 h-1.5 rounded-full bg-slate-200 dark:bg-muted overflow-hidden shrink-0">
							<div
								className="h-full bg-primary rounded-full transition-all duration-300"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* ── البطاقة 4: مسؤولين ────────────────────────────────────────── */}
			<div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col gap-3">
				{/* ترويسة البطاقة */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<IconUsers className="size-4.5 text-foreground/80 shrink-0" />
						<h3 className="font-bold text-sm text-foreground">مسؤولين</h3>
						{supervisors.length > 0 && (
							<span className="text-[11px] font-semibold text-muted-foreground">
								({supervisors.length})
							</span>
						)}
					</div>

					{/* زر التعيين مع القائمة المنسدلة (Popover) مباشرة تحته */}
					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer select-none"
								aria-label="تعيين مسؤول"
							>
								<span>تعيين</span>
								<IconUserPlus className="size-3.5" />
							</button>
						</PopoverTrigger>

						<PopoverContent
							align="start"
							sideOffset={6}
							className="w-72 p-2 rounded-2xl border border-border/80 shadow-xl bg-card text-foreground"
							dir="rtl"
						>
							{/* حقل البحث: تحديد مسؤول... */}
							<div className="relative mb-1.5 px-1 pt-1 pb-2 border-b border-border/50">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="تحديد مسؤول..."
									className="w-full h-8.5 px-3 text-xs bg-muted/40 rounded-xl border border-border/60 focus:border-primary focus:bg-background focus:outline-none transition-all placeholder:text-muted-foreground font-medium"
									autoFocus
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
									>
										×
									</button>
								)}
							</div>

							{/* قائمة الموظفين الفعليين من النظام */}
							<div className="max-h-64 overflow-y-auto space-y-1 py-1 pr-0.5">
								{filteredStaff.length === 0 ? (
									<div className="py-6 text-center text-xs text-muted-foreground">
										{searchQuery ? "لا يوجد موظف مطابق للبحث" : "لا يوجد موظفون في النظام"}
									</div>
								) : (
									filteredStaff.map((s) => {
										const staffName = s.name || s.user?.name || "موظف";
										const staffRole =
											s.role?.name || s.primarySpecialization?.name || "مشرف متابعة";
										const initials = getArabicInitials(staffName);
										const isAssigned = supervisors.some((sup) => sup.staffId === s.id);

										return (
											<button
												key={s.id}
												type="button"
												onClick={async () => {
													if (isAssigned) {
														toast.info(`${staffName} مُعيّن بالفعل`);
														return;
													}
													await assignSupervisor(s.id, staffRole, staffName);
													setPopoverOpen(false);
													setSearchQuery("");
												}}
												className={cn(
													"w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-right group",
													isAssigned
														? "bg-primary/10 border border-primary/20 cursor-default"
														: "hover:bg-muted/80 active:scale-[0.99]"
												)}
											>
												<div className="flex items-center gap-3 min-w-0">
													{/* دائرة الحروف الرمزية بلون المنصة الأساسي */}
													<div className="size-8.5 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
														{initials}
													</div>
													<div className="flex flex-col min-w-0 text-right">
														<span className="font-semibold text-xs text-foreground truncate">
															{staffName}
														</span>
														<span className="text-[11px] text-muted-foreground truncate">
															{staffRole}
														</span>
													</div>
												</div>

												{isAssigned && (
													<span className="text-[11px] font-medium text-primary px-2 py-0.5 rounded-full bg-primary/15 shrink-0">
														معيّن
													</span>
												)}
											</button>
										);
									})
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* قائمة المسؤولين المعينين للطالب بهوية المنصة */}
				{isLoadingSupervisors ? (
					<div className="py-4 text-center text-xs text-muted-foreground">
						جارٍ تحميل المسؤولين...
					</div>
				) : supervisors.length === 0 ? (
					<div className="py-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
						لم يتم تعيين أي مسؤول بعد. انقر على "تعيين" للإضافة.
					</div>
				) : (
					<div className="flex flex-col divide-y divide-border/40 pt-1">
						{supervisors.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-2"
							>
								<div className="flex items-center gap-3 min-w-0">
									{/* الصورة الرمزية بلون المنصة الأساسي بالحرفين */}
									<div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
										{item.initial || getArabicInitials(item.name)}
									</div>
									<div className="flex flex-col min-w-0">
										<span className="font-bold text-xs text-foreground truncate">
											{item.name}
										</span>
										<span className="text-[11px] text-muted-foreground truncate">
											{item.role || "مدير الموارد البشرية"}
										</span>
									</div>
								</div>

								{/* قائمة الإجراءات */}
								<DropdownMenu dir="rtl">
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="size-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
											aria-label="خيارات المسؤول"
										>
											<IconDots className="size-4" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											className="text-xs gap-2 text-destructive focus:text-destructive"
											onSelect={() => removeSupervisor(item.staffId, item.name)}
										>
											إزالة المسؤول
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))}
					</div>
				)}
			</div>
		</aside>
	);
}

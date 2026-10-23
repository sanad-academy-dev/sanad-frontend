import {
	IconAlertCircle,
	IconArrowsExchange,
	IconBrandWhatsapp,
	IconCalendarCheck,
	IconCopy,
	IconDots,
	IconEdit,
	IconExternalLink,
	IconFileText,
	IconHeartHandshake,
	IconMail,
	IconMapPin,
	IconPhone,
	IconPhoneCall,
	IconSchool,
	IconShieldCheck,
	IconUserOff,
	IconUsers,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { PatientPolicyCard } from "@/features/accounting/insurance/components/patient-policy-card";
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { cn } from "@/lib/utils";

interface GuardianTabProps extends PatientTabProps {
	onTransferOwnership?: () => void;
	onEditPatient?: () => void;
}

function formatRelationship(rel?: string | null): string {
	if (!rel) return "ولي أمر";
	const u = rel.toUpperCase().trim();
	if (u === "FATHER" || rel === "أب") return "الأب";
	if (u === "MOTHER" || rel === "أم") return "الأم";
	if (u === "GUARDIAN" || rel.includes("وصي") || rel.includes("كفيل")) return "وصي / كفيل";
	if (u === "BROTHER" || rel === "أخ") return "الأخ";
	if (u === "SISTER" || rel === "أخت") return "الأخت";
	if (u === "GRANDFATHER" || rel === "جد") return "الجد";
	if (u === "GRANDMOTHER" || rel === "جدة") return "الجدة";
	if (u === "UNCLE" || rel === "عم" || rel === "خال") return "العم / الخال";
	return rel;
}

function InfoField({
	label,
	icon,
	children,
	action,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col justify-between gap-1.5 rounded-lg border p-3 bg-card">
			<div className="flex items-center justify-between gap-2 text-muted-foreground">
				<div className="flex items-center gap-1.5">
					<span className="size-3.5 shrink-0 flex items-center justify-center">{icon}</span>
					<p className="text-xs">{label}</p>
				</div>
				{action && <div className="shrink-0">{action}</div>}
			</div>
			<div className="text-sm font-semibold text-foreground pt-0.5">{children}</div>
		</div>
	);
}

function GuardianTabSkeleton() {
	return (
		<div className="flex flex-col gap-4 p-4" dir="rtl">
			<Skeleton className="h-20 w-full rounded-lg" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<Skeleton className="h-16 rounded-lg" />
				<Skeleton className="h-16 rounded-lg" />
				<Skeleton className="h-16 rounded-lg" />
			</div>
			<Skeleton className="h-32 w-full rounded-lg" />
		</div>
	);
}

export function GuardianTab({
	patientId,
	onTransferOwnership,
	onEditPatient,
}: GuardianTabProps) {
	const { patient, isLoading: isPatientLoading } = usePatient(patientId);
	const { patients: allPatients } = usePatients();
	const [selectedGuardianIndex, setSelectedGuardianIndex] = useState(0);

	if (isPatientLoading && !patient) {
		return (
			<TabsContent value="guardian" className="m-0" dir="rtl">
				<GuardianTabSkeleton />
			</TabsContent>
		);
	}

	if (!patient) {
		return (
			<TabsContent value="guardian" className="m-0 p-6" dir="rtl">
				<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
					<IconAlertCircle className="size-10 text-amber-500" />
					<p className="font-semibold text-foreground">تعذر العثور على بيانات الطالب</p>
					<p className="text-xs text-muted-foreground">تأكد من صحة معرف الطالب والمحاولة مجدداً</p>
				</div>
			</TabsContent>
		);
	}

	const rawGuardians =
		patient.guardians && patient.guardians.length > 0
			? (patient.guardians
					.map((g) => {
						if (!g.owner) return null;
						return {
							...g.owner,
							relationship:
								g.relationship ||
								g.owner.relationship ||
								patient.guardianRelationship,
						};
					})
					.filter(Boolean) as Array<
					NonNullable<typeof patient.owner> & { relationship?: string | null }
				>)
			: patient.owner
				? [
						{
							...patient.owner,
							relationship:
								patient.guardianRelationship || patient.owner.relationship,
						},
					]
				: [];

	const guardiansList =
		rawGuardians.length > 0
			? rawGuardians
			: patient.guardianName || patient.guardianPhone
				? [
						{
							id: "direct",
							code: null,
							name: patient.guardianName || "ولي أمر غير محدد",
							phone: patient.guardianPhone || null,
							email: patient.guardianEmail || null,
							relationship: patient.guardianRelationship || null,
							active: true,
							address: patient.address || null,
							city: null,
							country: null,
							notes: null,
							createdAt: patient.createdAt,
						},
					]
				: [];

	const hasAnyGuardian = guardiansList.length > 0;
	const activeGuardian =
		guardiansList[selectedGuardianIndex] || guardiansList[0];

	const guardianName = activeGuardian?.name || "ولي أمر غير محدد";
	const guardianPhone = activeGuardian?.phone || "";
	const guardianEmail = activeGuardian?.email || "";
	const guardianRelationship =
		activeGuardian?.relationship || patient.guardianRelationship;
	const guardianCode = activeGuardian?.code;
	const isOwnerActive = activeGuardian ? activeGuardian.active !== false : true;
	const cleanPhone = guardianPhone.replace(/\D/g, "");

	const guardianAddress =
		activeGuardian?.address ||
		[activeGuardian?.city, activeGuardian?.country].filter(Boolean).join("، ") ||
		patient.address ||
		"";

	// الطلاب الآخرين المسجلين تحت نفس ولي الأمر
	const siblingPatients = allPatients.filter((p) => {
		if (p.id === patient.id) return false;
		if (activeGuardian?.id && activeGuardian.id !== "direct") {
			if (p.owner?.id === activeGuardian.id) return true;
			if (p.guardians?.some((g) => g.owner?.id === activeGuardian.id)) return true;
		}
		const thisPhone = activeGuardian?.phone;
		const otherPhone = p.owner?.phone || p.guardianPhone;
		if (thisPhone && otherPhone && thisPhone === otherPhone) {
			return true;
		}
		return false;
	});

	const copyText = (text: string, label: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast.success(`تم نسخ ${label}`);
	};

	return (
		<TabsContent
			value="guardian"
			className="m-0 p-4 flex flex-col gap-4 overflow-y-auto"
			dir="rtl"
		>
			{!hasAnyGuardian ? (
				/* حالة عدم وجود ولي أمر مسجل */
				<div className="rounded-lg border border-dashed border-border p-8 flex flex-col items-center justify-center text-center gap-4 bg-muted/10">
					<div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
						<IconUserOff className="size-6" />
					</div>
					<div className="flex flex-col gap-1 max-w-md">
						<h3 className="font-bold text-sm text-foreground">
							لا يوجد ولي أمر مرتبط بهذا الطالب حتى الآن
						</h3>
						<p className="text-xs text-muted-foreground leading-relaxed">
							يمكنك ربط ولي أمر مسجل في النظام بهذا الطالب أو تحديث بيانات التواصل الخاصة به
							لتمكين المتابعة والتواصل واستخراج الفواتير.
						</p>
					</div>

					<div className="flex items-center gap-2 pt-2">
						{onTransferOwnership && (
							<Button size="sm" onClick={onTransferOwnership} className="gap-1.5">
								<IconArrowsExchange className="size-4" />
								<span>ربط ولي أمر</span>
							</Button>
						)}
						{onEditPatient && (
							<Button size="sm" variant="outline" onClick={onEditPatient} className="gap-1.5">
								<IconEdit className="size-4" />
								<span>إضافة بيانات التواصل</span>
							</Button>
						)}
					</div>
				</div>
			) : (
				<>
					{/* شريط التبديل بين أولياء الأمور في حال وجود أكثر من ولي أمر */}
					{guardiansList.length > 1 && (
						<div className="flex items-center justify-between gap-2 p-1.5 rounded-lg border bg-muted/30 flex-wrap">
							<div className="flex items-center gap-1.5 overflow-x-auto">
								<span className="text-xs font-medium text-muted-foreground px-2 flex items-center gap-1 shrink-0">
									<IconUsers className="size-3.5" />
									<span>أولياء الأمور ({guardiansList.length}):</span>
								</span>
								<div className="flex items-center gap-1 flex-wrap">
									{guardiansList.map((g, idx) => {
										const isSelected = selectedGuardianIndex === idx;
										return (
											<button
												key={g.id || idx}
												type="button"
												onClick={() => setSelectedGuardianIndex(idx)}
												className={cn(
													"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer select-none",
													isSelected
														? "bg-background text-foreground font-semibold shadow-xs border border-border"
														: "text-muted-foreground hover:text-foreground hover:bg-background/50",
												)}
											>
												<InitialsAvatar
													name={g.name}
													className={cn(
														"size-4 rounded-full text-[9px] shrink-0",
														isSelected
															? "bg-primary text-primary-foreground"
															: "bg-muted text-muted-foreground",
													)}
												/>
												<span>{g.name}</span>
												<span className="text-[10px] text-muted-foreground">
													({formatRelationship(g.relationship)})
												</span>
											</button>
										);
									})}
								</div>
							</div>

							{onEditPatient && (
								<Button
									size="sm"
									variant="ghost"
									onClick={onEditPatient}
									className="h-7 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
								>
									<IconEdit className="size-3.5" />
									<span>إدارة أولياء الأمور</span>
								</Button>
							)}
						</div>
					)}

					{/* ── ترويسة وهوية ولي الأمر ── */}
					<div className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card">
						<div className="flex items-center gap-3 min-w-0">
							<InitialsAvatar
								name={guardianName}
								className="size-11 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0"
							/>
							<div className="flex flex-col gap-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<h2 className="font-bold text-base text-foreground truncate">{guardianName}</h2>
									<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
										{formatRelationship(guardianRelationship)}
									</span>
									<span
										className={cn(
											"inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
											isOwnerActive
												? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
												: "bg-muted text-muted-foreground border-border",
										)}
									>
										{isOwnerActive ? "نشط" : "غير نشط"}
									</span>
									
								</div>
								<p className="text-xs text-muted-foreground">
									ولي أمر الطالب: <span className="font-semibold text-foreground">{patient.name}</span>
								</p>
							</div>
						</div>

						{/* الإجراءات السريعة */}
						<div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
							{guardianPhone && (
								<>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30"
										onClick={() => window.open(`https://wa.me/${cleanPhone}`, "_blank")}
									>
										<IconBrandWhatsapp className="size-3.5" />
										<span>واتساب</span>
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="h-8 gap-1.5 text-xs"
										onClick={() => window.open(`tel:${guardianPhone}`, "_self")}
									>
										<IconPhone className="size-3.5 text-primary" />
										<span>اتصال</span>
									</Button>
								</>
							)}

							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-8 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
										title="خيارات إضافية"
										aria-label="خيارات إضافية"
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44">
									{guardianPhone && (
										<DropdownMenuItem
											className="gap-2 text-xs cursor-pointer"
											onSelect={() => copyText(guardianPhone, "رقم الهاتف")}
										>
											<IconCopy className="size-3.5" />
											<span>نسخ رقم الهاتف</span>
										</DropdownMenuItem>
									)}
									{guardianEmail && (
										<DropdownMenuItem
											className="gap-2 text-xs cursor-pointer"
											onSelect={() => copyText(guardianEmail, "البريد الإلكتروني")}
										>
											<IconCopy className="size-3.5" />
											<span>نسخ البريد الإلكتروني</span>
										</DropdownMenuItem>
									)}
									{(guardianPhone || guardianEmail) && (onTransferOwnership || onEditPatient) && (
										<DropdownMenuSeparator />
									)}
									{onTransferOwnership && (
										<DropdownMenuItem
											className="gap-2 text-xs cursor-pointer"
											onSelect={onTransferOwnership}
										>
											<IconArrowsExchange className="size-3.5 text-primary" />
											<span>نقل الملكية</span>
										</DropdownMenuItem>
									)}
									{onEditPatient && (
										<DropdownMenuItem
											className="gap-2 text-xs cursor-pointer"
											onSelect={onEditPatient}
										>
											<IconEdit className="size-3.5" />
											<span>تعديل بيانات الطفل</span>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* ── بيانات الاتصال والتواصل ── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2 px-1">
							<IconPhone className="size-4 text-emerald-600 shrink-0" />
							<h3 className="text-sm font-bold text-foreground">بيانات الاتصال والتواصل</h3>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{/* الهاتف */}
							<InfoField
								label="رقم الهاتف"
								icon={<IconPhone className="size-3.5 text-muted-foreground" />}
								action={
									guardianPhone ? (
										<button
											type="button"
											onClick={() => copyText(guardianPhone, "رقم الهاتف")}
											className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
										>
											<IconCopy className="size-3" />
											<span>نسخ</span>
										</button>
									) : undefined
								}
							>
								{guardianPhone ? (
									<a
										href={`tel:${guardianPhone}`}
										className="font-mono tabular-nums text-xs font-bold text-primary hover:underline"
										dir="ltr"
									>
										{guardianPhone}
									</a>
								) : (
									<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
								)}
							</InfoField>

							{/* البريد الإلكتروني */}
							<InfoField
								label="البريد الإلكتروني"
								icon={<IconMail className="size-3.5 text-muted-foreground" />}
								action={
									guardianEmail ? (
										<button
											type="button"
											onClick={() => copyText(guardianEmail, "البريد الإلكتروني")}
											className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
										>
											<IconCopy className="size-3" />
											<span>نسخ</span>
										</button>
									) : undefined
								}
							>
								{guardianEmail ? (
									<a
										href={`mailto:${guardianEmail}`}
										className="text-xs font-medium text-primary hover:underline truncate block"
										dir="ltr"
										title={guardianEmail}
									>
										{guardianEmail}
									</a>
								) : (
									<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
								)}
							</InfoField>

							{/* العنوان ومكان الإقامة */}
							<InfoField
								label="العنوان ومكان الإقامة"
								icon={<IconMapPin className="size-3.5 text-muted-foreground" />}
							>
								<span
									className="text-xs font-medium truncate block"
									title={guardianAddress || "غير مسجل"}
								>
									{guardianAddress || "غير مسجل"}
								</span>
							</InfoField>

							{/* تاريخ التسجيل */}
							<InfoField
								label="تاريخ تسجيل الحساب"
								icon={<IconCalendarCheck className="size-3.5 text-muted-foreground" />}
							>
								<span className="text-xs font-medium tabular-nums">
									{activeGuardian?.createdAt
										? new Date(activeGuardian.createdAt).toLocaleDateString("ar-EG", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})
										: "—"}
								</span>
							</InfoField>
						</div>
					</div>

					{/* ── جهة الاتصال في حالات الطوارئ ── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between px-1">
							<div className="flex items-center gap-2">
								<IconHeartHandshake className="size-4 text-rose-600 shrink-0" />
								<h3 className="text-sm font-bold text-foreground">جهة الاتصال في حالات الطوارئ</h3>
							</div>
							<span className="text-xs text-muted-foreground">
								للتواصل في الحالات العاجلة عند تعذر الوصول لولي الأمر
							</span>
						</div>

						{patient.emergencyContactName || patient.emergencyContactPhone ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<InfoField
									label="اسم جهة / شخص الطوارئ"
									icon={<IconHeartHandshake className="size-3.5 text-muted-foreground" />}
								>
									<span className="text-xs font-semibold">
										{patient.emergencyContactName || "غير محدد"}
									</span>
								</InfoField>

								<InfoField
									label="رقم هاتف الطوارئ"
									icon={<IconPhoneCall className="size-3.5 text-muted-foreground" />}
									action={
										patient.emergencyContactPhone ? (
											<button
												type="button"
												onClick={() =>
													copyText(patient.emergencyContactPhone!, "رقم هاتف الطوارئ")
												}
												className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
											>
												<IconCopy className="size-3" />
												<span>نسخ</span>
											</button>
										) : undefined
									}
								>
									{patient.emergencyContactPhone ? (
										<div className="flex items-center justify-between gap-2">
											<a
												href={`tel:${patient.emergencyContactPhone}`}
												className="font-mono tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
												dir="ltr"
											>
												{patient.emergencyContactPhone}
											</a>
											<a
												href={`tel:${patient.emergencyContactPhone}`}
												className="text-[11px] text-muted-foreground hover:text-foreground"
											>
												اتصال
											</a>
										</div>
									) : (
										<span className="text-muted-foreground text-xs font-normal">غير مسجل</span>
									)}
								</InfoField>
							</div>
						) : (
							<div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground bg-muted/10 flex items-center justify-between">
								<span>لا توجد جهة اتصال بديلة لحالات الطوارئ مسجلة للطالب</span>
								{onEditPatient && (
									<button
										type="button"
										onClick={onEditPatient}
										className="text-primary hover:underline font-medium cursor-pointer"
									>
										إضافة جهة طوارئ
									</button>
								)}
							</div>
						)}
					</div>

					{/* ── الطلاب الآخرون لنفس ولي الأمر (الإخوة بالمركز) ── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between px-1">
							<div className="flex items-center gap-2">
								<IconUsers className="size-4 text-primary shrink-0" />
								<h3 className="text-sm font-bold text-foreground">الطلاب الآخرون لنفس ولي الأمر</h3>
								{siblingPatients.length > 0 && (
									<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
										{siblingPatients.length}
									</span>
								)}
							</div>
						</div>

						{siblingPatients.length === 0 ? (
							<div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground bg-muted/10">
								لا يوجد طلاب آخرون مسجلون تحت هذا الحساب في المركز
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{siblingPatients.map((sib) => (
									<Link
										key={sib.id}
										to="/services/patients/$patientId"
										params={{ patientId: sib.id }}
										className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all group"
									>
										<div className="flex items-center gap-3 min-w-0">
											<InitialsAvatar
												name={sib.name}
												className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0"
											/>
											<div className="flex flex-col min-w-0">
												<span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
													{sib.name}
												</span>
												<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
													<span className="font-mono">{sib.code}</span>
													{sib.classroom && (
														<>
															<span>•</span>
															<span>{sib.classroom}</span>
														</>
													)}
												</div>
											</div>
										</div>
										<IconExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
									</Link>
								))}
							</div>
						)}
					</div>

					{/* ── ملاحظات ولي الأمر ── */}
					{patient.owner?.notes && (
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-2 px-1">
								<IconFileText className="size-4 text-amber-600 shrink-0" />
								<h3 className="text-sm font-bold text-foreground">ملاحظات ولي الأمر</h3>
							</div>
							<div className="rounded-lg border p-3 text-xs text-foreground bg-card whitespace-pre-wrap leading-relaxed">
								{patient.owner.notes}
							</div>
						</div>
					)}

					{/* ── بطاقة وثيقة التأمين ── */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2 px-1">
							<IconShieldCheck className="size-4 text-emerald-600 shrink-0" />
							<h3 className="text-sm font-bold text-foreground">وثيقة التأمين الصحي</h3>
						</div>
						<PatientPolicyCard patientId={patient.id} />
					</div>
				</>
			)}
		</TabsContent>
	);
}

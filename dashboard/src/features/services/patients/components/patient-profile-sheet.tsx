import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconArrowsExchange,
	IconBan,
	IconCake,
	IconChevronLeft,
	IconCircleCheck,
	IconCircleOff,
	IconCopy,
	IconDots,
	IconEdit,
	IconPhone,
	IconTrash,
	IconUser,
	IconWeight,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientPolicyCard } from "@/features/accounting/insurance/components/patient-policy-card";
import { DeletePatientDialog } from "@/features/services/patients/components/delete-patient-dialog";
import { DisablePatientDialog } from "@/features/services/patients/components/disable-patient-dialog";
import { PatientSheet } from "@/features/services/patients/components/patient-sheet";
import { TransferOwnershipDialog } from "@/features/services/patients/components/transfer-ownership-dialog";
import { ConsentsTab } from "@/features/services/patients/components/tabs/consents-tab";
import { DocumentsTab } from "@/features/services/patients/components/tabs/documents-tab";
import { GuardianTab } from "@/features/services/patients/components/tabs/guardian-tab";
import { HistoryTab } from "@/features/services/patients/components/tabs/history-tab";
import { InpatientsTab } from "@/features/services/patients/components/tabs/inpatients-tab";
import { MedicationsTab } from "@/features/services/patients/components/tabs/medications-tab";
import { NutritionTab } from "@/features/services/patients/components/tabs/nutrition-tab";
import { OverviewTab } from "@/features/services/patients/components/tabs/overview-tab";
import { SubscriptionsTab } from "@/features/services/patients/components/tabs/subscriptions-tab";
import { VaccinationsTab } from "@/features/services/patients/components/tabs/vaccinations-tab";
import { VitalSignsTab } from "@/features/services/patients/components/tabs/vital-signs-tab";
import type { PatientProfileSheetProps } from "@/features/services/patients/types/patient-profile-sheet.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";

export function PatientProfileSheet({
	patient,
	open,
	onClose,
	onPatientChange,
}: PatientProfileSheetProps) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";

	const [editTarget, setEditTarget] = useState<PatientResponse | null>(null);
	const [transferTarget, setTransferTarget] = useState<PatientResponse | null>(null);
	const [disableTarget, setDisableTarget] = useState<PatientResponse | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<PatientResponse | null>(null);
	const [expanded, setExpanded] = useState(false);
	// التبويب مُتحكَّم به: سجل الطفل ينقل إلى تبويب العلامات الحيوية أو الخطط
	// حين لا لوحة مستقلة للسجل المطلوب فتحه
	const [activeTab, setActiveTab] = useState("overview");

	const copyPhone = () => {
		if (!patient?.owner?.phone) return;
		navigator.clipboard.writeText(patient.owner.phone);
		toast.success("تم النسخ");
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) onClose();
				}}
			>
				<SheetContent
					side={side}
					showCloseButton={false}
					className={cn(
						"gap-0 transition-[width,max-width] duration-200",
						expanded
							? "w-[91vw]! max-w-[91vw]! sm:w-[91vw]! sm:max-w-[91vw]!"
							: "w-2/3! max-w-2/3! sm:w-2/3! sm:max-w-2/3!",
					)}
					dir="rtl"
				>
					<SheetHeader className="p-0">
						<div className="flex items-center gap-2 justify-between px-4 py-2 border-b">
							<SheetTitle className="flex items-center gap-2 font-bold text-lg">
								<p>الطلاب</p>
								<IconChevronLeft className="size-4" />
								{patient && (
									<>
										<InitialsAvatar name={patient.name} />
										<p>{patient.name}</p>
										<span className="text-xs text-muted-foreground tabular-nums font-normal">
											{patient.code}
										</span>
									</>
								)}
							</SheetTitle>

							<div className="flex items-center gap-1">
								<DropdownMenu dir="rtl">
									<DropdownMenuTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="size-8"
										>
											<IconDots className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuItem
											className="gap-2"
											onSelect={() => patient && setEditTarget(patient)}
										>
											<IconEdit className="size-4" />
											تعديل
										</DropdownMenuItem>
										<DropdownMenuItem
											className="gap-2"
											onSelect={() => patient && setTransferTarget(patient)}
										>
											<IconArrowsExchange className="size-4" />
											نقل ملكية
										</DropdownMenuItem>
										<DropdownMenuItem
											className="gap-2"
											onSelect={() => patient && setDisableTarget(patient)}
										>
											<IconBan className="size-4" />
											{patient?.active ? "تعطيل" : "تفعيل"}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive gap-2"
											onSelect={() => patient && setDeleteTarget(patient)}
										>
											<IconTrash className="size-4" />
											حذف
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={() => setExpanded((v) => !v)}
									aria-label={expanded ? "تصغير" : "توسيع"}
								>
									{expanded ? (
										<IconArrowsDiagonalMinimize2 className="size-4" />
									) : (
										<IconArrowsDiagonal className="size-4" />
									)}
								</Button>

								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={onClose}
								>
									<IconX className="size-4" />
								</Button>
							</div>
						</div>
					</SheetHeader>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="justify-end flex-1 gap-0 flex flex-col overflow-hidden"
					>
						<div className="px-3 py-2">
							<TabsList className="w-full justify-end">
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="documents"
								>
									المستندات
									<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										0
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="consents"
								>
									الموافقات
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="subscriptions"
								>
									خطط علاجية
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="history"
								>
									سجل الطالب
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="inpatients"
								>
									التنويم
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="medications"
								>
									الأدوية
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="vaccinations"
								>
									التطعيمات
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="nutrition"
								>
									التغذية
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="vital-signs"
								>
									العلامات الحيوية
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="guardian"
								>
									بيانات ولي الأمر
								</TabsTrigger>
								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="overview"
								>
									نظرة عامة
								</TabsTrigger>
							</TabsList>
						</div>

						<Separator />

						<div className="grid grid-cols-9 h-full overflow-hidden">
							<div
								className="col-span-2 border-s p-4 flex flex-col gap-6 overflow-y-auto"
								dir="rtl"
							>
								{/* [MI-P6] §11 — بطاقة البوليصة على ملف الطفل (تختفي بلا تأمين) */}
								<PatientPolicyCard patientId={patient?.id} />

								{/* بيانات وليّ الأمر */}
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">بيانات وليّ الأمر</p>

									{patient?.owner ? (
										<>
											<div className="flex items-center gap-1.5">
												<IconUser className="size-4 text-muted-foreground shrink-0" />
												<span className="text-sm truncate">{patient.owner.name}</span>
											</div>

											{patient.owner.phone && (
												<div className="flex items-center justify-between gap-2">
													<div className="flex items-center gap-1.5">
														<IconPhone className="size-4 text-muted-foreground shrink-0" />
														<span
															className="text-sm tabular-nums"
															dir="ltr"
														>
															{patient.owner.phone}
														</span>
													</div>

													<Button
														size="xs"
														variant="outline"
														className="h-7 text-xs"
														onClick={copyPhone}
													>
														<IconCopy className="size-3" />
														نسخ
													</Button>
												</div>
											)}
										</>
									) : (
										<p className="text-sm text-muted-foreground">لا يوجد وليّ أمر مرتبط</p>
									)}
								</div>

								{/* التفاصيل */}
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">التفاصيل</p>

									{/* active flag */}
									<div className="flex items-center gap-1.5">
										{patient?.active ? (
											<IconCircleCheck className="size-4 text-emerald-600" />
										) : (
											<IconCircleOff className="size-4 text-muted-foreground" />
										)}
										<span className="text-sm font-medium">{patient?.active ? "نشط" : "غير نشط"}</span>
									</div>

									{/* classroom */}
									{patient?.classroom && (
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">الفصل</span>
											<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border">
												{patient.classroom}
											</span>
										</div>
									)}

									{/* feeType */}
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs text-muted-foreground">نوع الرسوم</span>
										<span className="text-xs font-medium">
											{patient?.feeType || "—"}
										</span>
									</div>

									{/* pocketMoneyEnabled */}
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs text-muted-foreground">المصروف</span>
										<span
											className={cn(
												"inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
												patient?.pocketMoneyEnabled !== false
													? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
													: "bg-muted text-muted-foreground border-border",
											)}
										>
											{patient?.pocketMoneyEnabled !== false ? "مفعّل" : "معطّل"}
										</span>
									</div>

									{/* age */}
									{patient?.age != null && (
										<div className="flex items-center gap-1.5">
											<IconCake className="size-4 text-muted-foreground" />
											<span className="text-sm">{patient.age} سنوات</span>
										</div>
									)}

									{/* weight */}
									{patient?.weight != null && (
										<div className="flex items-center gap-1.5">
											<IconWeight className="size-4 text-muted-foreground" />
											<span className="text-sm">{patient.weight} كجم</span>
										</div>
									)}

									{/* nationalId */}
									{patient?.nationalId && (
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">رقم الهوية</span>
											<span className="text-xs font-mono tabular-nums">{patient.nationalId}</span>
										</div>
									)}

									{/* bloodType */}
									{patient?.bloodType && (
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">فصيلة الدم</span>
											<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400">
												{patient.bloodType}
											</span>
										</div>
									)}

									{/* transportation */}
									{patient?.transportation && (
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs text-muted-foreground">وسيلة النقل</span>
											<span className="text-xs truncate max-w-[130px]" title={patient.transportation}>
												{patient.transportation}
											</span>
										</div>
									)}
								</div>

								{/* Dates */}
								<div className="flex flex-col gap-3">
									{patient?.createdAt && (
										<div className="flex items-center justify-between gap-2">
											<span className="font-semibold text-sm">تاريخ التسجيل</span>
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{new Date(patient.createdAt).toLocaleDateString("en-GB")}
											</span>
										</div>
									)}
								</div>
							</div>

							<div className="col-span-7 overflow-y-auto">
								{activeTab === "overview" && <OverviewTab patientId={patient?.id ?? ""} />}
								{activeTab === "guardian" && (
									<GuardianTab
										patientId={patient?.id ?? ""}
										onTransferOwnership={() => patient && setTransferTarget(patient)}
										onEditPatient={() => patient && setEditTarget(patient)}
									/>
								)}
								{activeTab === "history" && (
									<HistoryTab
										patientId={patient?.id ?? ""}
										onNavigateTab={setActiveTab}
									/>
								)}
								{activeTab === "vaccinations" && (
									<VaccinationsTab patientId={patient?.id ?? ""} />
								)}
								{activeTab === "inpatients" && <InpatientsTab patientId={patient?.id ?? ""} />}
								{activeTab === "medications" && (
									<MedicationsTab patientId={patient?.id ?? ""} />
								)}
								{activeTab === "nutrition" && <NutritionTab patientId={patient?.id ?? ""} />}
								{activeTab === "vital-signs" && (
									<VitalSignsTab patientId={patient?.id ?? ""} />
								)}
								{activeTab === "documents" && <DocumentsTab patientId={patient?.id ?? ""} />}
								{activeTab === "consents" && <ConsentsTab patientId={patient?.id ?? ""} />}
								{activeTab === "subscriptions" && (
									<SubscriptionsTab patientId={patient?.id ?? ""} />
								)}
							</div>
						</div>
					</Tabs>
				</SheetContent>
			</Sheet>

			<PatientSheet
				open={!!editTarget}
				onClose={() => setEditTarget(null)}
				patient={editTarget}
				onSuccess={(updated) => {
					setEditTarget(null);
					onPatientChange?.(updated);
				}}
			/>
			<DisablePatientDialog
				patient={disableTarget}
				onClose={() => setDisableTarget(null)}
				onSuccess={(updated) => {
					setDisableTarget(null);
					onPatientChange?.(updated);
				}}
			/>
			<TransferOwnershipDialog
				patient={transferTarget}
				onClose={() => setTransferTarget(null)}
				onSuccess={(updated) => {
					setTransferTarget(null);
					onPatientChange?.(updated);
				}}
			/>
			<DeletePatientDialog
				patient={deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onSuccess={() => {
					setDeleteTarget(null);
					onClose();
				}}
			/>
		</>
	);
}

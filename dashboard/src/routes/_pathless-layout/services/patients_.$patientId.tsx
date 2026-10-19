import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconAlertTriangle,
	IconArrowsExchange,
	IconBan,
	IconChevronLeft,
	IconCircleCheck,
	IconCircleOff,
	IconCopy,
	IconDots,
	IconEdit,
	IconPhone,
	IconTrash,
	IconUser,
} from "@tabler/icons-react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { PatientSidebar } from "@/features/services/patients/components/patient-sidebar";
import { DeletePatientDialog } from "@/features/services/patients/components/delete-patient-dialog";
import { DisablePatientDialog } from "@/features/services/patients/components/disable-patient-dialog";
import { PatientSheet } from "@/features/services/patients/components/patient-sheet";
import { ConsentsTab } from "@/features/services/patients/components/tabs/consents-tab";
import { DocumentsTab } from "@/features/services/patients/components/tabs/documents-tab";
import { HistoryTab } from "@/features/services/patients/components/tabs/history-tab";
import { InpatientsTab } from "@/features/services/patients/components/tabs/inpatients-tab";
import { MedicationsTab } from "@/features/services/patients/components/tabs/medications-tab";
import { NutritionTab } from "@/features/services/patients/components/tabs/nutrition-tab";
import { OverviewTab } from "@/features/services/patients/components/tabs/overview-tab";
import { SubscriptionsTab } from "@/features/services/patients/components/tabs/subscriptions-tab";
import { VaccinationsTab } from "@/features/services/patients/components/tabs/vaccinations-tab";
import { VitalSignsTab } from "@/features/services/patients/components/tabs/vital-signs-tab";
import { TransferOwnershipDialog } from "@/features/services/patients/components/transfer-ownership-dialog";
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import { getSession } from "@/functions/get-session";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_pathless-layout/services/patients_/$patientId")({
	component: PatientDetailPage,
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session?.session?.role === "MEMBER") {
			let perms: string[] = [];
			try {
				perms = JSON.parse(session.session.permissions ?? "[]");
			} catch {
				perms = [];
			}
			const canView =
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_LIMITED) ||
				perms.includes(PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL);
			if (!canView) throw redirect({ to: "/dashboard" });
		}
	},
});

const PATIENT_TABS = [
	{ value: "overview", label: "نظرة عامة" },
	{ value: "history", label: "سجل الطالب" },
	{ value: "vital-signs", label: "العلامات الحيوية" },
	{ value: "nutrition", label: "التغذية" },
	{ value: "vaccinations", label: "التطعيمات" },
	{ value: "medications", label: "الأدوية" },
	{ value: "inpatients", label: "التنويم" },
	{ value: "subscriptions", label: "خطط علاجية" },
	{ value: "consents", label: "الموافقات" },
	{ value: "documents", label: "المستندات" },
] as const;

type PatientTabValue = (typeof PATIENT_TABS)[number]["value"];

function PatientDetailPage() {
	const { patientId } = Route.useParams();
	const navigate = useNavigate();
	const { patient, isLoading, refetch } = usePatient(patientId);

	const [editTarget, setEditTarget] = useState<PatientResponse | null>(null);
	const [transferTarget, setTransferTarget] = useState<PatientResponse | null>(null);
	const [disableTarget, setDisableTarget] = useState<PatientResponse | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<PatientResponse | null>(null);
	const [activeTab, setActiveTab] = useState<PatientTabValue>("overview");

	// فتحة الهيدر العلوي في التخطيط العام — نحقن فيها مسار التنقل والتبويبات الموحدة
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	const copyPhone = () => {
		if (!patient?.owner?.phone) return;
		navigator.clipboard.writeText(patient.owner.phone);
		toast.success("تم النسخ");
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-[400px]">
				<Spinner />
			</div>
		);
	}

	if (!patient) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
				<IconAlertTriangle className="size-10 text-amber-500" />
				<h2 className="text-lg font-bold">لم يتم العثور على الطالب</h2>
				<p className="text-sm text-muted-foreground">الطالب المطلوب غير موجود أو تم حذفه.</p>
				<Button
					asChild
					variant="outline"
				>
					<Link to="/services/patients">العودة لقائمة الطلاب</Link>
				</Button>
			</div>
		);
	}

	const isFemale = patient.gender === "FEMALE";
	const genderText = isFemale ? "أنثى" : "ذكر";

	// ترويسة الصفحة الموحدة مع الديزاين سيستم — تُحقن عبر الـ Portal في شريط الهيدر العلوي
	const headerContent = (
		<div
			className="flex items-center gap-2"
			dir="rtl"
		>
			{/* مسار التنقل: الطلاب > اسم الطالب */}
			<Link
				to="/services/patients"
				className="whitespace-nowrap text-xs font-semibold text-foreground hover:underline"
			>
				الطلاب
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">
				{patient.name}
			</span>

			{/* قائمة خيارات الطالب المصغرة */}
			<DropdownMenu dir="rtl">
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-6 text-muted-foreground hover:text-foreground"
					>
						<IconDots className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem
						className="gap-2 text-xs"
						onSelect={() => setEditTarget(patient)}
					>
						<IconEdit className="size-3.5" />
						تعديل البيانات
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-xs"
						onSelect={() => setTransferTarget(patient)}
					>
						<IconArrowsExchange className="size-3.5" />
						نقل ملكية
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-xs"
						onSelect={() => setDisableTarget(patient)}
					>
						<IconBan className="size-3.5" />
						{patient.active ? "تعطيل الحساب" : "تفعيل الحساب"}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2 text-xs text-destructive"
						onSelect={() => setDeleteTarget(patient)}
					>
						<IconTrash className="size-3.5" />
						حذف الطالب
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* فاصل */}
			<span className="h-4 w-px bg-border shrink-0" />

			{/* تبويبات الطالب في الهيدر العلوي */}
			<nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
				{PATIENT_TABS.map((tItem) => {
					const isActive = activeTab === tItem.value;
					return (
						<button
							key={tItem.value}
							type="button"
							onClick={() => setActiveTab(tItem.value)}
							aria-pressed={isActive}
							className={cn(
								"flex h-[26px] items-center justify-center whitespace-nowrap rounded-[4px] border-[0.75px] px-2.5 text-[11px] font-medium transition-colors",
								isActive
									? "border-border bg-background font-semibold text-foreground shadow-2xs"
									: "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
							)}
						>
							{tItem.label}
						</button>
					);
				})}
			</nav>
		</div>
	);

	return (
		<div
			className="flex flex-1 flex-col min-h-0 overflow-hidden"
			dir="rtl"
		>
			{/* حقن الترويسة والتبويبات في الهيدر العلوي الموحد */}
			{slot && createPortal(headerContent, slot)}

			{/* جسم الصفحة الرئيسي: تقسيم عمودين (البيانات الجانبية + محتوى التبويب) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">

         {/* منطقة التبويب المفتوح */}
				<main className="lg:col-span-8 xl:col-span-8 flex-1 min-h-0 overflow-y-auto p-4">
					<Tabs
						value={activeTab}
						onValueChange={(v) => setActiveTab(v as PatientTabValue)}
						className="h-full"
					>
						{activeTab === "overview" && <OverviewTab patientId={patient.id} />}
						{activeTab === "history" && (
							<HistoryTab
								patientId={patient.id}
								onNavigateTab={(tab) => setActiveTab(tab as PatientTabValue)}
							/>
						)}
						{activeTab === "vital-signs" && <VitalSignsTab patientId={patient.id} />}
						{activeTab === "nutrition" && <NutritionTab patientId={patient.id} />}
						{activeTab === "vaccinations" && <VaccinationsTab patientId={patient.id} />}
						{activeTab === "medications" && <MedicationsTab patientId={patient.id} />}
						{activeTab === "inpatients" && <InpatientsTab patientId={patient.id} />}
						{activeTab === "subscriptions" && <SubscriptionsTab patientId={patient.id} />}
						{activeTab === "consents" && <ConsentsTab patientId={patient.id} />}
						{activeTab === "documents" && <DocumentsTab patientId={patient.id} />}
					</Tabs>
				</main>

				{/* العمود الجانبي (التصميم الجديد الموحّد مع بطاقات البيانات الطبية والملف الشخصي والاشتراك والمسؤولين) */}
				<PatientSidebar
					patient={patient}
					onEdit={() => setEditTarget(patient)}
					onNavigateTab={(tab) => setActiveTab(tab as PatientTabValue)}
				/>

				
			</div>

			{/* حوارات التعديل والإجراءات */}
			<PatientSheet
				open={!!editTarget}
				onClose={() => setEditTarget(null)}
				patient={editTarget}
				onSuccess={() => {
					setEditTarget(null);
					refetch();
				}}
			/>
			<DisablePatientDialog
				patient={disableTarget}
				onClose={() => setDisableTarget(null)}
				onSuccess={() => {
					setDisableTarget(null);
					refetch();
				}}
			/>
			<TransferOwnershipDialog
				patient={transferTarget}
				onClose={() => setTransferTarget(null)}
				onSuccess={() => {
					setTransferTarget(null);
					refetch();
				}}
			/>
			<DeletePatientDialog
				patient={deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onSuccess={() => {
					setDeleteTarget(null);
					navigate({ to: "/services/patients" });
				}}
			/>
		</div>
	);
}

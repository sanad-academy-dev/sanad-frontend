import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { IconBellRinging } from "@tabler/icons-react";

import {
	CampaignDetailsHeader,
	type RegistrationView,
} from "@/features/digital-registration/components/campaign-details-header";
import { RegistrationStatsBar } from "@/features/digital-registration/components/campaign-details-stats";
import { CampaignDetailsToolbar } from "@/features/digital-registration/components/campaign-details-toolbar";
import { CampaignRequestsKanban } from "@/features/digital-registration/components/campaign-requests-kanban";
import { CampaignInfo } from "@/features/digital-registration/components/campaign-info";
import { RegistrationActivityLog } from "@/features/digital-registration/components/registration-activity-log";
import { AddRequestSheet } from "@/features/digital-registration/components/add-request-sheet";
import {
	useCampaigns,
	useCampaignRequests,
} from "@/features/digital-registration/hooks/use-digital-registration";
import { downloadCsv } from "@/lib/csv";
import { downloadExcel } from "@/lib/export-excel";

export const Route = createFileRoute("/_pathless-layout/digital-registration")({
	component: DigitalRegistrationRoute,
});

function DigitalRegistrationRoute() {
	const [view, setView] = useState<RegistrationView>("requests");
	const [searchQuery, setSearchQuery] = useState("");
	const [genderFilter, setGenderFilter] = useState("ALL");
	const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);

	// Fetch campaigns to automatically resolve the active workspace
	const { data: campaigns = [] } = useCampaigns();
	const activeCampaignId = campaigns[0]?.id || "default";

	// Fetch requests for the active registration campaign
	const { data: requests = [] } = useCampaignRequests(activeCampaignId);

	// Dynamic counts calculation for the 5 stats cards matching the screenshot
	const statsCounts = useMemo(() => {
		let queue = 0;
		let evaluation = 0;
		let waiting = 0;
		let accepted = 0;
		let rejected = 0;

		for (const r of requests) {
			if (r.status === "QUEUE" || r.column === "queue") {
				queue++;
			} else if (r.status === "EVALUATION" || r.column === "check-in") {
				evaluation++;
			} else if (
				r.status === "REVIEW" ||
				r.status === "AWAITING_REPLY" ||
				r.column === "in-service" ||
				r.column === "awaiting-payment"
			) {
				waiting++;
			} else if (r.status === "ACCEPTED" || r.column === "done") {
				accepted++;
			} else if (r.status === "REJECTED" || r.column === "cancelled") {
				rejected++;
			}
		}

		return {
			queue,
			evaluation,
			waiting,
			accepted,
			rejected,
		};
	}, [requests]);

	const filteredRequests = useMemo(() => {
		return requests.filter((item) => {
			if (genderFilter !== "ALL" && item.gender !== genderFilter) {
				return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.trim().toLowerCase();
				const matchName =
					item.patientName?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
				const matchCode = item.code?.toLowerCase().includes(q);
				const matchPhone = item.guardianPhone?.toLowerCase().includes(q);
				const matchGuardian = item.guardianName?.toLowerCase().includes(q);
				const matchClass = item.targetClass?.toLowerCase().includes(q);
				const matchNationalId = item.guardianNationalId?.toLowerCase().includes(q);
				const matchConvertedPatient = item.convertedPatientCode?.toLowerCase().includes(q);
				const matchConvertedOwner = item.convertedOwnerCode?.toLowerCase().includes(q);

				if (
					!matchName &&
					!matchCode &&
					!matchPhone &&
					!matchGuardian &&
					!matchClass &&
					!matchNationalId &&
					!matchConvertedPatient &&
					!matchConvertedOwner
				) {
					return false;
				}
			}
			return true;
		});
	}, [requests, searchQuery, genderFilter]);

	const getApplicantExportData = () => {
		const headers = [
			"كود الطلب",
			"اسم الطالب",
			"الجنس",
			"الفئة العمرية",
			"تاريخ الميلاد",
			"المسار / الصف المطلوب",
			"حالة الطلب",
			"اسم ولي الأمر",
			"رقم جوال ولي الأمر",
			"البريد الإلكتروني",
			"الهوية الوطنية / الإقامة",
			"فصيلة الدم",
			"الحساسيات والاحتياجات",
			"أمراض مزمنة",
			"تفاصيل الأمراض المزمنة",
			"حالة المستندات",
			"موعد جلسة التقييم",
			"الفاحص المسؤول",
			"كود ملف الطالب المعتمد",
			"كود ملف ولي الأمر المعتمد",
			"تاريخ التقديم",
		];

		const rows = filteredRequests.map((a) => {
			const statusArabic =
				a.status === "QUEUE"
					? "طابور"
					: a.status === "EVALUATION"
						? "التقييم"
						: a.status === "REVIEW"
							? "قيد المراجعة"
							: a.status === "AWAITING_REPLY"
								? "قائمة الانتظار"
								: a.status === "ACCEPTED"
									? "مقبول"
									: a.status === "REJECTED"
										? "مرفوض"
										: a.statusLabel || a.status;

			const assessmentDate = a.assessmentAppointment?.startsAt
				? new Intl.DateTimeFormat("ar-EG", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}).format(new Date(a.assessmentAppointment.startsAt))
				: "لم يحدد";

			const docTotal = a.documents?.total || 3;
			const docCount = a.documents?.count || 0;
			const docStatus = `${docCount}/${docTotal} (${docCount >= docTotal ? "مكتمل" : "ناقص"})`;

			let cleanDate = "-";
			if (a.date) {
				cleanDate = a.date.includes("T") ? a.date.split("T")[0] : a.date;
			}

			return [
				a.code,
				a.patientName || a.name,
				a.gender === "MALE" ? "ذكر" : a.gender === "FEMALE" ? "أنثى" : "غير محدد",
				a.ageLabel || "-",
				a.birthDate ? a.birthDate.split("T")[0] : "-",
				a.targetClass || "-",
				statusArabic,
				a.guardianName,
				String(a.guardianPhone || ""),
				a.guardianEmail || "-",
				String(a.guardianNationalId || "-"),
				a.bloodType || "-",
				a.allergies || "لا توجد",
				a.hasChronicDiseases ? "نعم" : "لا",
				a.hasChronicDiseases ? a.chronicDiseases || "غير محدد" : "لا يوجد",
				docStatus,
				assessmentDate,
				a.assessmentAppointment?.staffName || "-",
				a.convertedPatientCode || "-",
				a.convertedOwnerCode || "-",
				cleanDate,
			];
		});

		return { headers, rows };
	};

	const handleExportExcel = async () => {
		if (filteredRequests.length === 0) {
			toast.error("لا توجد طلبات متقدمين مطابقة للتصدير");
			return;
		}

		const { headers, rows } = getApplicantExportData();

		try {
			await downloadExcel({
				fileName: "طلبات-التسجيل-الرقمي-سند",
				sheetName: "طلبات القبول",
				headers,
				rows,
			});
			toast.success(`تم تصدير ${filteredRequests.length} طلب بنجاح إلى ملف Excel`);
		} catch (error) {
			console.error("Applicants export error:", error);
			toast.error("حدث خطأ أثناء تصدير ملف الإكسل");
		}
	};

	const handleExportCsv = () => {
		if (filteredRequests.length === 0) {
			toast.error("لا توجد طلبات متقدمين مطابقة للتصدير");
			return;
		}

		const { headers, rows } = getApplicantExportData();
		downloadCsv("sanad-registration-applicants", headers, rows as any);
		toast.success(`تم تصدير بيانات ${filteredRequests.length} متقدم بنجاح إلى ملف CSV`);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			{/* Header with Title and Tabs injected into page-header-slot */}
			<CampaignDetailsHeader
				activeView={view}
				onChangeView={setView}
				requestsCount={requests.length}
			/>

			{/* VIEW 1: REQUESTS KANBAN (Matches screenshot exactly) */}
			{view === "requests" && (
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					{/* Top Horizontal Stat Cards */}
					<RegistrationStatsBar
						queueCount={statsCounts.queue}
						evaluationCount={statsCounts.evaluation}
						waitingCount={statsCounts.waiting}
						acceptedCount={statsCounts.accepted}
						rejectedCount={statsCounts.rejected}
					/>

					{/* Toolbar with Search, Filters, Export, Assistant & Add Button */}
					<CampaignDetailsToolbar
						searchValue={searchQuery}
						onSearchChange={setSearchQuery}
						genderFilter={genderFilter}
						onGenderFilterChange={setGenderFilter}
						onOpenAddRequest={() => setIsAddRequestOpen(true)}
						onExport={handleExportExcel}
						onExportCsv={handleExportCsv}
					/>

					{/* Live Indicator Banner matching screenshot */}
					<div className="flex items-center justify-between px-4 py-0.5 text-xs text-muted-foreground border-b border-border/40" dir="rtl">
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<IconBellRinging className="size-3.5 text-primary animate-pulse" />
							<span className="font-semibold text-[11px] text-foreground">مباشر</span>
							<span className="text-[10px] text-muted-foreground">· التحديث اللحظي مفعل لطلبات القبول</span>
						</div>
						<span className="text-[10px] text-muted-foreground font-mono">
							إجمالي المتقدمين: {requests.length}
						</span>
					</div>

					{/* Kanban Board */}
					<div className="flex-1 min-h-0 overflow-y-auto">
						<CampaignRequestsKanban
							campaignId={activeCampaignId}
							searchQuery={searchQuery}
							genderFilter={genderFilter}
							onOpenAddRequest={() => setIsAddRequestOpen(true)}
						/>
					</div>

					{/* Add Request Modal / Sheet */}
					<AddRequestSheet
						open={isAddRequestOpen}
						onClose={() => setIsAddRequestOpen(false)}
						campaignId={activeCampaignId}
					/>
				</div>
			)}

			{/* VIEW 2: INFORMATION */}
			{view === "info" && (
				<div className="flex-1 min-h-0 overflow-y-auto">
					<CampaignInfo campaignId={activeCampaignId} />
				</div>
			)}

			{/* VIEW 3: ACTIVITY LOG */}
			{view === "activity" && (
				<div className="flex-1 min-h-0 overflow-y-auto">
					<RegistrationActivityLog campaignId={activeCampaignId} />
				</div>
			)}
		</div>
	);
}

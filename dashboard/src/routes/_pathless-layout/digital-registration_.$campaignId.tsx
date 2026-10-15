import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { CampaignDetailsStats } from "@/features/digital-registration/components/campaign-details-stats";
import { CampaignDetailsHeader, type CampaignView } from "@/features/digital-registration/components/campaign-details-header";
import { CampaignDetailsToolbar } from "@/features/digital-registration/components/campaign-details-toolbar";
import { CampaignRequestsKanban } from "@/features/digital-registration/components/campaign-requests-kanban";
import { CampaignInfo } from "@/features/digital-registration/components/campaign-info";
import { AddRequestSheet } from "@/features/digital-registration/components/add-request-sheet";
import { useCampaignRequests, useCampaignDetails } from "@/features/digital-registration/hooks/use-digital-registration";
import { downloadCsv } from "@/lib/csv";
import { downloadExcel } from "@/lib/export-excel";

export const Route = createFileRoute("/_pathless-layout/digital-registration_/$campaignId")({
	component: CampaignDetailsRoute,
});

function CampaignDetailsRoute() {
	const { campaignId } = Route.useParams();
	const [view, setView] = useState<CampaignView>("requests");
	const [searchQuery, setSearchQuery] = useState("");
	const [genderFilter, setGenderFilter] = useState("ALL");
	const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);

	const { data: requests = [] } = useCampaignRequests(campaignId);
	const { data: campaign } = useCampaignDetails(campaignId);

	const filteredRequests = useMemo(() => {
		return requests.filter((item) => {
			if (genderFilter !== "ALL" && item.gender !== genderFilter) {
				return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.trim().toLowerCase();
				const matchName = item.patientName?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
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
					? "طابور الانتظار"
					: a.status === "EVALUATION"
						? "التقييم والمقابلة"
						: a.status === "REVIEW"
							? "المراجعة والتدقيق"
							: a.status === "AWAITING_REPLY"
								? "انتظار رد ولي الأمر"
								: a.status === "ACCEPTED"
									? "مقبول نهائي"
									: a.status === "REJECTED"
										? "مرفوض"
										: a.statusLabel || a.status;

			const assessmentDate = a.assessmentAppointment?.startsAt
				? new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
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
		const safeCampaignCode = campaign?.code || campaignId.slice(0, 8);
		const safeCampaignName = campaign?.name ? `-${campaign.name.replace(/[\\/:*?"<>|]/g, "_").slice(0, 20)}` : "";

		try {
			await downloadExcel({
				fileName: `متقدمو-حملة-${safeCampaignCode}${safeCampaignName}`,
				sheetName: `متقدمين ${safeCampaignCode}`,
				headers,
				rows,
			});
			toast.success(`تم تصدير بيانات ${filteredRequests.length} متقدم بنجاح إلى ملف Excel منظم`);
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
		const safeCampaignCode = campaign?.code || campaignId.slice(0, 8);
		downloadCsv(`applicants-${safeCampaignCode}`, headers, rows as any);
		toast.success(`تم تصدير بيانات ${filteredRequests.length} متقدم بنجاح إلى ملف CSV`);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CampaignDetailsHeader 
				campaignId={campaignId} 
				activeView={view}
				onChangeView={setView}
			/>
			
			{view === "requests" && (
				<>
					<CampaignDetailsToolbar
						searchValue={searchQuery}
						onSearchChange={setSearchQuery}
						genderFilter={genderFilter}
						onGenderFilterChange={setGenderFilter}
						onOpenAddRequest={() => setIsAddRequestOpen(true)}
						onExport={handleExportExcel}
						onExportCsv={handleExportCsv}
					/>
					<hr className="my-2" />
					<CampaignRequestsKanban
						campaignId={campaignId}
						searchQuery={searchQuery}
						genderFilter={genderFilter}
					/>
					<AddRequestSheet
						open={isAddRequestOpen}
						onClose={() => setIsAddRequestOpen(false)}
						campaignId={campaignId}
					/>
				</>
			)}

			{view === "stats" && <CampaignDetailsStats campaignId={campaignId} />}

			{view === "info" && <CampaignInfo campaignId={campaignId} />}
		</div>
	);
}

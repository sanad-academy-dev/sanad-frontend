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

	const handleExport = () => {
		if (filteredRequests.length === 0) {
			toast.error("لا توجد طلبات متقدمين مطابقة للتصدير");
			return;
		}

		const headers = [
			"كود الطلب",
			"اسم الطالب",
			"الجنس",
			"الفئة العمرية",
			"تاريخ الميلاد",
			"المسار المطلوب",
			"فصيلة الدم",
			"الحساسيات",
			"حالات مزمنة",
			"اسم ولي الأمر",
			"رقم الجوال",
			"البريد الإلكتروني",
			"الهوية الوطنية",
			"حالة الطلب",
			"المستندات",
			"كود ملف الطالب المعتمد",
			"كود ملف ولي الأمر المعتمد",
			"تاريخ التقديم",
		];

		const rows = filteredRequests.map((a) => [
			a.code,
			a.patientName || a.name,
			a.gender === "MALE" ? "ذكر" : a.gender === "FEMALE" ? "أنثى" : "غير محدد",
			a.ageLabel || "-",
			a.birthDate ? a.birthDate.split("T")[0] : "-",
			a.targetClass || "-",
			a.bloodType || "-",
			a.allergies || "-",
			a.hasChronicDiseases ? a.chronicDiseases || "نعم" : "لا",
			a.guardianName,
			a.guardianPhone,
			a.guardianEmail || "-",
			a.guardianNationalId || "-",
			a.statusLabel,
			`${a.documents.count}/${a.documents.total}`,
			a.convertedPatientCode || "-",
			a.convertedOwnerCode || "-",
			a.date || "-",
		]);

		const safeCampaignCode = campaign?.code || campaignId.slice(0, 8);
		downloadCsv(`applicants-${safeCampaignCode}`, headers, rows);
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
						onExport={handleExport}
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

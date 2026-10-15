import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { CampaignsStats } from "@/features/digital-registration/components/campaigns-stats";
import { CampaignsTable } from "@/features/digital-registration/components/campaigns-table";
import { CampaignsToolbar } from "@/features/digital-registration/components/campaigns-toolbar";
import { DigitalRegistrationHeader } from "@/features/digital-registration/components/digital-registration-header";
import { useCampaigns } from "@/features/digital-registration/hooks/use-digital-registration";
import { downloadCsv } from "@/lib/csv";
import { downloadExcel } from "@/lib/export-excel";

export const Route = createFileRoute("/_pathless-layout/digital-registration")({
	component: DigitalRegistrationRoute,
});

function DigitalRegistrationRoute() {
	const { data: campaigns = [] } = useCampaigns();
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL");

	const filteredCampaigns = useMemo(() => {
		return campaigns.filter((c) => {
			if (statusFilter !== "ALL" && c.status !== statusFilter) {
				return false;
			}
			if (searchValue.trim()) {
				const q = searchValue.trim().toLowerCase();
				const matchName = c.name?.toLowerCase().includes(q);
				const matchCode = c.code?.toLowerCase().includes(q);
				const matchAge = c.ageGroup?.toLowerCase().includes(q);
				if (!matchName && !matchCode && !matchAge) {
					return false;
				}
			}
			return true;
		});
	}, [campaigns, searchValue, statusFilter]);

	const getCampaignExportData = () => {
		const headers = [
			"كود الحملة",
			"اسم الحملة",
			"الحالة",
			"الفئة العمرية",
			"المسار / الصف المستهدف",
			"إجمالي الطلبات",
			"المقبولين",
			"قيد الانتظار",
			"المرفوضين",
			"السعة المستغلة",
			"السعة القصوى",
			"نسبة الاستيعاب",
			"تاريخ البدء",
			"تاريخ الانتهاء",
			"المستندات المطلوبة",
			"ملاحظات",
		];

		const rows = filteredCampaigns.map((c) => {
			const statusLabel =
				c.status === "ACTIVE"
					? "نشطة"
					: c.status === "COMPLETED"
						? "مكتملة"
						: c.status === "DRAFT"
							? "مسودة"
							: "مغلقة";

			const reqDocs = [
				c.requireBirthCert && "شهادة ميلاد",
				c.requireVaccine && "كرت التطعيم",
				c.requireId && "الهوية الوطنية",
			]
				.filter(Boolean)
				.join(" - ");

			const capacity = c.capacity ?? 0;
			const maxCapacity = c.maxCapacity ?? 0;
			const ratio = maxCapacity > 0 ? `${Math.round((capacity / maxCapacity) * 100)}%` : "0%";

			const startDate = c.startDate ? c.startDate.split("T")[0] : "-";
			const endDate = c.endDate ? c.endDate.split("T")[0] : "-";

			return [
				c.code,
				c.name,
				statusLabel,
				c.ageGroup || "-",
				c.targetClass || "عام / جميع المسارات",
				c.requests ?? 0,
				c.accepted ?? 0,
				c.pending ?? 0,
				c.rejected ?? 0,
				capacity,
				maxCapacity,
				ratio,
				startDate,
				endDate,
				reqDocs || "لا توجد مستندات إلزامية",
				c.notes || "-",
			];
		});

		return { headers, rows };
	};

	const handleExportExcel = async () => {
		if (filteredCampaigns.length === 0) {
			toast.error("لا توجد بيانات حملات مطابقة للتصدير");
			return;
		}

		const { headers, rows } = getCampaignExportData();

		try {
			await downloadExcel({
				fileName: "حملات-التسجيل-الرقمي",
				sheetName: "حملات التسجيل",
				headers,
				rows,
			});
			toast.success(`تم تصدير ${filteredCampaigns.length} حملة بنجاح إلى ملف Excel منظم`);
		} catch (error) {
			console.error("Campaigns export error:", error);
			toast.error("حدث خطأ أثناء تصدير ملف الإكسل");
		}
	};

	const handleExportCsv = () => {
		if (filteredCampaigns.length === 0) {
			toast.error("لا توجد بيانات حملات مطابقة للتصدير");
			return;
		}

		const { headers, rows } = getCampaignExportData();
		downloadCsv("sanad-registration-campaigns", headers, rows as any);
		toast.success(`تم تصدير ${filteredCampaigns.length} حملة بنجاح إلى ملف CSV`);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<DigitalRegistrationHeader />
			<CampaignsStats />
			<CampaignsToolbar
				searchValue={searchValue}
				onSearchChange={setSearchValue}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				onExport={handleExportExcel}
				onExportCsv={handleExportCsv}
			/>
			<CampaignsTable
				data={campaigns}
				globalFilter={searchValue}
				onGlobalFilterChange={setSearchValue}
				statusFilter={statusFilter}
			/>
		</div>
	);
}

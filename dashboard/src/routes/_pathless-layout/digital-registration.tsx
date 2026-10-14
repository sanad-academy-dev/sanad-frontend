import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { CampaignsStats } from "@/features/digital-registration/components/campaigns-stats";
import { CampaignsTable } from "@/features/digital-registration/components/campaigns-table";
import { CampaignsToolbar } from "@/features/digital-registration/components/campaigns-toolbar";
import { DigitalRegistrationHeader } from "@/features/digital-registration/components/digital-registration-header";
import { useCampaigns } from "@/features/digital-registration/hooks/use-digital-registration";
import { downloadCsv } from "@/lib/csv";

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

	const handleExport = () => {
		if (filteredCampaigns.length === 0) {
			toast.error("لا توجد بيانات حملات مطابقة للتصدير");
			return;
		}

		const headers = [
			"كود الحملة",
			"اسم الحملة",
			"الفئة العمرية",
			"الحالة",
			"إجمالي الطلبات",
			"المقبولين",
			"قيد الانتظار",
			"السعة المستغلة",
			"السعة القصوى",
			"تاريخ البداية",
			"تاريخ النهاية",
		];

		const rows = filteredCampaigns.map((c) => [
			c.code,
			c.name,
			c.ageGroup,
			c.status === "ACTIVE"
				? "نشط"
				: c.status === "COMPLETED"
					? "مكتمل"
					: c.status === "DRAFT"
						? "مسودة"
						: "مغلق",
			c.requests,
			c.accepted,
			c.pending,
			c.capacity,
			c.maxCapacity,
			c.startDate || "-",
			c.endDate || "-",
		]);

		downloadCsv("sanad-registration-campaigns", headers, rows);
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
				onExport={handleExport}
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

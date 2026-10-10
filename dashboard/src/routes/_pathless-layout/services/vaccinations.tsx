import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Stats } from "@/components/common/stats";
import { AdministerVaccinationSheet } from "@/features/services/vaccinations/components/administer-vaccination-sheet";
import { ProtocolsPanel } from "@/features/services/vaccinations/components/protocols-panel";
import { UnschedulableStrip } from "@/features/services/vaccinations/components/unschedulable-strip";
import { VaccinationDueTable } from "@/features/services/vaccinations/components/vaccination-due-table";
import { VaccinationRecordsTable } from "@/features/services/vaccinations/components/vaccination-records-table";
import {
	VACCINATION_TABS,
	VaccinationsHeader,
	type VaccinationTab,
} from "@/features/services/vaccinations/components/vaccinations-header";
import { VaccineSheet } from "@/features/services/vaccinations/components/vaccine-sheet";
import { VaccinesTable } from "@/features/services/vaccinations/components/vaccines-table";
import {
	useVaccinationDue,
	useVaccinationRecords,
	useVaccinationStats,
	useVaccines,
} from "@/features/services/vaccinations/hooks/use-vaccinations";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { CatalogSpecies } from "@/generated/prisma/enums";
import type { VaccineResponse } from "@/server/vaccinations/vaccinations.type";

const VALID_SPECIES = ["ALL", "DOG", "CAT"];

export const Route = createFileRoute("/_pathless-layout/services/vaccinations")({
	// حالة الشاشة تعيش في الرابط: الصفحة تُشارَك وتُعاد بحالتها بعد التحديث
	validateSearch: (search): { tab: VaccinationTab; q: string; species: string } => {
		const raw = (search as { tab?: string }).tab;
		const tab = VACCINATION_TABS.some((t) => t.value === raw)
			? (raw as VaccinationTab)
			: "due";
		const species = String((search as { species?: string }).species ?? "ALL");
		return {
			tab,
			q: String((search as { q?: string }).q ?? "").slice(0, 120),
			species: VALID_SPECIES.includes(species) ? species : "ALL",
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, q, species } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [administerFor, setAdministerFor] = useState<string | null>(null);
	const [administerAntigens, setAdministerAntigens] = useState<string[] | undefined>();
	const [administerOpen, setAdministerOpen] = useState(false);
	const [vaccineSheetOpen, setVaccineSheetOpen] = useState(false);
	const [editingVaccine, setEditingVaccine] = useState<VaccineResponse | null>(null);

	const speciesFilter = species === "ALL" ? undefined : (species as CatalogSpecies);

	const { statItems } = useVaccinationStats();
	const {
		rows,
		isLoading: dueLoading,
		isError: dueError,
	} = useVaccinationDue({ species: speciesFilter });
	const { records, isLoading: recordsLoading } = useVaccinationRecords({ take: 200 });
	const { vaccines, isLoading: vaccinesLoading } = useVaccines({ species: speciesFilter });
	const { clinicInfo } = useClinicInfo();

	const setSearch = (patch: Partial<{ tab: VaccinationTab; q: string; species: string }>) =>
		void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	const openAdminister = (patientId: string | null, dueAntigenCodes?: string[]) => {
		setAdministerFor(patientId);
		setAdministerAntigens(dueAntigenCodes);
		setAdministerOpen(true);
	};

	const openVaccineSheet = (vaccine: VaccineResponse | null) => {
		setEditingVaccine(vaccine);
		setVaccineSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<VaccinationsHeader
				active={tab}
				// البحث حالة خاصة بكل تبويب — تبديل التبويب يُفرغه بدل أن يرشّح جدولًا
				// بمصطلح كُتب لجدول آخر
				onChange={(next) => setSearch({ tab: next, q: "" })}
			/>

			<Stats
				className="px-4"
				stats={statItems}
			/>

			{/* النقص يُقال قبل القائمة: طابور يبدو فارغًا وأطفال خارج الحساب أصلًا
			    يُقرأ «لا متأخّرين» وهو ليس كذلك */}
			{tab === "due" && <UnschedulableStrip />}

			{tab === "due" && (
				<VaccinationDueTable
					rows={rows}
					isLoading={dueLoading}
					isError={dueError}
					clinicName={clinicInfo?.name ?? "الأكاديمية"}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					species={species}
					onSpeciesChange={(value) => setSearch({ species: value })}
					onAdminister={openAdminister}
				/>
			)}

			{tab === "records" && (
				<VaccinationRecordsTable
					records={records}
					isLoading={recordsLoading}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
				/>
			)}

			{tab === "vaccines" && (
				<VaccinesTable
					vaccines={vaccines}
					isLoading={vaccinesLoading}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					onEdit={(vaccine) => openVaccineSheet(vaccine)}
					onCreate={() => openVaccineSheet(null)}
				/>
			)}

			{tab === "protocols" && <ProtocolsPanel />}

			<AdministerVaccinationSheet
				open={administerOpen}
				onOpenChange={setAdministerOpen}
				patientId={administerFor ?? undefined}
				dueAntigenCodes={administerAntigens}
			/>

			<VaccineSheet
				open={vaccineSheetOpen}
				onOpenChange={setVaccineSheetOpen}
				vaccine={editingVaccine}
			/>
		</div>
	);
}

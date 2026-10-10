import { useMemo } from "react";
import {
	type FilterOption,
	type StaffFilterState,
	StaffFilters,
} from "@/features/booking/components/staff-filters";
import { StaffList } from "@/features/booking/components/staff-list";
import { BookingWizard } from "@/features/booking/components/wizard/booking-wizard";
import { useBookingSearchParams } from "@/features/booking/hooks/use-booking-search-params";
import { usePublicClinicServices } from "@/features/booking/hooks/use-public-clinic-services";
import { usePublicClinicStaff } from "@/features/booking/hooks/use-public-clinic-staff";

const dedupeById = (options: FilterOption[]): FilterOption[] => {
	const seen = new Map<string, FilterOption>();
	for (const opt of options) {
		if (!seen.has(opt.id)) seen.set(opt.id, opt);
	}
	return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const OnlineAppointmentsSection = ({ clinicSlug }: { clinicSlug: string }) => {
	const { staff, isLoading } = usePublicClinicStaff(clinicSlug);
	const { services: bookableServices } = usePublicClinicServices(clinicSlug);

	const { search, setQuery, setSpecialization, setService, setCity, setStaff } =
		useBookingSearchParams();

	const filters: StaffFilterState = {
		query: search.q ?? "",
		specializationId: search.specializationId ?? null,
		serviceId: search.serviceId ?? null,
		city: search.city ?? null,
	};

	const onFiltersChange = (next: StaffFilterState) => {
		if (next.query !== filters.query) setQuery(next.query);
		if (next.specializationId !== filters.specializationId)
			setSpecialization(next.specializationId);
		if (next.serviceId !== filters.serviceId) setService(next.serviceId);
		if (next.city !== filters.city) setCity(next.city);
	};

	const bookableServiceIds = useMemo(
		() => new Set(bookableServices.map((s) => s.id)),
		[bookableServices],
	);

	const { specializationOptions, serviceOptions, cityOptions } = useMemo(() => {
		const specs: FilterOption[] = [];
		const services: FilterOption[] = [];
		const cities = new Set<string>();

		for (const s of staff) {
			if (s.primarySpecialization) specs.push(s.primarySpecialization);
			if (s.secondarySpecialization) specs.push(s.secondarySpecialization);
			for (const sv of s.services) {
				if (bookableServiceIds.has(sv.service.id)) services.push(sv.service);
			}
			if (s.branch?.city) cities.add(s.branch.city);
		}

		return {
			specializationOptions: dedupeById(specs),
			serviceOptions: dedupeById(services),
			cityOptions: Array.from(cities).sort(),
		};
	}, [staff, bookableServiceIds]);

	const filtered = useMemo(() => {
		const q = filters.query.trim().toLowerCase();
		return staff.filter((s) => {
			if (q && !s.name.toLowerCase().includes(q)) return false;

			if (filters.specializationId) {
				const matchesSpec =
					s.primarySpecialization?.id === filters.specializationId ||
					s.secondarySpecialization?.id === filters.specializationId;
				if (!matchesSpec) return false;
			}

			if (filters.serviceId) {
				const hasService = s.services.some((sv) => sv.service.id === filters.serviceId);
				if (!hasService) return false;
			}

			if (filters.city && s.branch?.city !== filters.city) return false;

			return true;
		});
	}, [staff, filters.query, filters.specializationId, filters.serviceId, filters.city]);

	const selectedStaff = useMemo(
		() => staff.find((s) => s.id === search.staffId) ?? null,
		[staff, search.staffId],
	);

	const selectedService = useMemo(
		() => bookableServices.find((s) => s.id === search.serviceId) ?? null,
		[bookableServices, search.serviceId],
	);

	return (
		<section
			id="book"
			className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6"
		>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="flex flex-col gap-4 bg-white p-4 rounded-[4px] h-fit">
					<StaffFilters
						value={filters}
						onChange={onFiltersChange}
						specializationOptions={specializationOptions}
						serviceOptions={serviceOptions}
						cityOptions={cityOptions}
					/>

					<StaffList
						staff={filtered}
						isLoading={isLoading}
						totalCount={staff.length}
						selectedId={search.staffId ?? null}
						onSelect={setStaff}
						onClearFilters={() =>
							onFiltersChange({
								query: "",
								specializationId: null,
								serviceId: null,
								city: null,
							})
						}
					/>
				</div>

				<div className="flex flex-col gap-4 bg-white p-4 rounded-[4px]">
					<BookingWizard
						clinicSlug={clinicSlug}
						selectedStaff={selectedStaff}
						selectedService={selectedService}
					/>
				</div>
			</div>
		</section>
	);
};

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

import type {
	BookingSearch,
	BookingStep,
} from "@/server/public-bookings/public-bookings.type";

type NavOptions = { replace?: boolean };

export const useBookingSearchParams = () => {
	const search = useSearch({ from: "/book/$slug" }) as BookingSearch;
	const navigate = useNavigate({ from: "/book/$slug" });

	const update = useCallback(
		(patch: Partial<BookingSearch>, options: NavOptions = { replace: true }) => {
			void navigate({
				search: (prev) => {
					const next = { ...(prev as BookingSearch), ...patch };
					for (const k of Object.keys(next) as (keyof BookingSearch)[]) {
						const v = next[k];
						if (v === undefined || v === null || v === "") delete next[k];
					}
					return next;
				},
				replace: options.replace ?? true,
			});
		},
		[navigate],
	);

	const setQuery = useCallback((q: string) => update({ q: q || undefined }), [update]);

	const setSpecialization = useCallback(
		(id: string | null) => update({ specializationId: id ?? undefined }),
		[update],
	);

	const setService = useCallback(
		(id: string | null) => {
			update({
				serviceId: id ?? undefined,
				date: undefined,
				slot: undefined,
				step: undefined,
			});
		},
		[update],
	);

	const setCity = useCallback(
		(c: string | null) => update({ city: c ?? undefined }),
		[update],
	);

	const setStaff = useCallback(
		(id: string | null) => {
			update({ staffId: id ?? undefined, date: undefined, slot: undefined, step: undefined });
		},
		[update],
	);

	const setDate = useCallback(
		(d: string | null) => update({ date: d ?? undefined, slot: undefined }),
		[update],
	);

	const setSlot = useCallback(
		(s: number | null) => update({ slot: s ?? undefined }),
		[update],
	);

	const setStep = useCallback(
		(s: BookingStep) => update({ step: s }, { replace: false }),
		[update],
	);

	return {
		search,
		setQuery,
		setSpecialization,
		setService,
		setCity,
		setStaff,
		setDate,
		setSlot,
		setStep,
	};
};

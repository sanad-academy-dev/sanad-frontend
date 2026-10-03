import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
	CLIENT_TICK_MS,
	INLINE_PILL_CAP,
	LONG_WAIT_MIN,
	NO_SHOW_MIN,
	REFETCH_INTERVAL_MS,
} from "@/features/appointments/data/alert-thresholds";
import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";
import { mapAppointmentToCard } from "@/features/appointments/utils/map-appointment-card";
import { api } from "@/lib/api";
import type { AppointmentKanbanResponse } from "@/server/appointments/appointments.type";

export type AppointmentAlertCategory = "emergency" | "no-show" | "long-wait";

export type AppointmentAlert = {
	appointmentId: string;
	card: AppointmentCardData;
	category: AppointmentAlertCategory;
	minutes: number;
	alsoLongWait: boolean;
};

export type AlertsLiveState = "live" | "disconnected";

const SEVERITY: Record<AppointmentAlertCategory, number> = {
	emergency: 0,
	"no-show": 1,
	"long-wait": 2,
};

const EMPTY: AppointmentKanbanResponse[] = [];

export const useAppointmentAlerts = () => {
	const { data, isError, failureCount, dataUpdatedAt } = useQuery<AppointmentKanbanResponse[]>(
		{
			queryKey: ["appointments", "list", "day"],
			queryFn: async () => {
				const res = await api.appointments.list.get({ query: { period: "day" } });
				if (res.error) throw new Error("فشل جلب الزيارات");
				const value = res.data;
				return Array.isArray(value) ? (value as AppointmentKanbanResponse[]) : [];
			},
			staleTime: 30_000,
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: false,
		},
	);

	const [nowMs, setNowMs] = useState(() => Date.now());
	useEffect(() => {
		const id = setInterval(() => setNowMs(Date.now()), CLIENT_TICK_MS);
		return () => clearInterval(id);
	}, []);

	const { visible, overflow, total } = useMemo(() => {
		const cards = (data ?? EMPTY).map(mapAppointmentToCard);
		const alerts: AppointmentAlert[] = [];

		for (const card of cards) {
			if (card.column === "done" || card.column === "cancelled") continue;

			const waitMin = Math.floor((nowMs - card.enteredCurrentStatusAt.getTime()) / 60_000);
			const isInWaitingColumn = card.column === "queue" || card.column === "check-in";
			const longWait = isInWaitingColumn && waitMin >= LONG_WAIT_MIN;

			if (card.isEmergency) {
				alerts.push({
					appointmentId: card.id,
					card,
					category: "emergency",
					minutes: longWait ? waitMin : 0,
					alsoLongWait: longWait,
				});
				continue;
			}

			if (card.column === "scheduled") {
				const lateMin = Math.floor((nowMs - card.startsAt.getTime()) / 60_000);
				if (lateMin >= NO_SHOW_MIN) {
					alerts.push({
						appointmentId: card.id,
						card,
						category: "no-show",
						minutes: lateMin,
						alsoLongWait: false,
					});
				}
				continue;
			}

			if (longWait) {
				alerts.push({
					appointmentId: card.id,
					card,
					category: "long-wait",
					minutes: waitMin,
					alsoLongWait: true,
				});
			}
		}

		alerts.sort((a, b) => {
			const s = SEVERITY[a.category] - SEVERITY[b.category];
			if (s !== 0) return s;
			return b.minutes - a.minutes;
		});

		return {
			visible: alerts.slice(0, INLINE_PILL_CAP),
			overflow: alerts.slice(INLINE_PILL_CAP),
			total: alerts.length,
		};
	}, [data, nowMs]);

	const isStale = dataUpdatedAt > 0 && nowMs - dataUpdatedAt > REFETCH_INTERVAL_MS * 2;
	const liveState: AlertsLiveState =
		isError || failureCount >= 2 || isStale ? "disconnected" : "live";

	return { visible, overflow, total, liveState };
};

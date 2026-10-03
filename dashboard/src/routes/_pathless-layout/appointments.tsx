import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { AppointmentAlertsStrip } from "@/features/appointments/components/alerts/appointment-alerts-strip";
import { AppointmentsHeader } from "@/features/appointments/components/appointments-header";
import { AppointmentsKanban } from "@/features/appointments/components/appointments-kanban";
import { AppointmentsToolbar } from "@/features/appointments/components/appointments-toolbar";
import type {
	AppointmentsPeriod,
	AppointmentsView,
} from "@/features/appointments/types/appointment.types";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

const VALID_PERIODS: AppointmentsPeriod[] = ["day", "week", "all"];
const VALID_VIEWS: AppointmentsView[] = ["all", "for-me"];

export const Route = createFileRoute("/_pathless-layout/appointments")({
	validateSearch: (
		search,
	): { period: AppointmentsPeriod; view: AppointmentsView; openAppointment?: string } => {
		const raw = (search as { period?: string }).period;
		const period = VALID_PERIODS.includes(raw as AppointmentsPeriod)
			? (raw as AppointmentsPeriod)
			: "day";
		const rawView = (search as { view?: string }).view;
		const view = VALID_VIEWS.includes(rawView as AppointmentsView)
			? (rawView as AppointmentsView)
			: "all";
		// معرّف زيارة لفتح تفاصيلها مباشرة (من إشعار الوارد مثلًا)
		const rawOpen = (search as { openAppointment?: string }).openAppointment;
		const openAppointment = typeof rawOpen === "string" && rawOpen ? rawOpen : undefined;
		return { period, view, openAppointment };
	},
	component: RouteComponent,
});

const APPOINTMENTS_STATS: StatItem[] = [
	{ title: "إجمالي الزيارات", value: 0, tooltip: "العدد الكلي للزيارات المسجلة" },
	{ title: "أكاديمية", value: 0, tooltip: "الزيارات التي تم إنجازها" },
	{ title: "عن بعد", value: 0, tooltip: "الزيارات التي تم إلغاؤها" },
	{ title: "متنقل", value: 0, tooltip: "الزيارات التي لم تم إنجازها بعد" },
	{ title: "تمت", value: 0, tooltip: "الزيارات التي لم تم إنجازها بعد" },
];

function RouteComponent() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const handleViewChange = (next: AppointmentsView) => {
		void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<AppointmentsHeader
				active={view}
				onChange={handleViewChange}
			/>
			<Stats
				className="px-4"
				stats={APPOINTMENTS_STATS}
			/>
			<hr className="my-2" />
			<AppointmentsToolbar />
			<hr className="my-2" />
			<AppointmentAlertsStrip />
			<hr className="my-2" />
			<AppointmentsKanban />
		</div>
	);
}

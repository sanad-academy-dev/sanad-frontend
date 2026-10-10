import type { TFunction } from "i18next";
import type { CardId } from "@/features/dashboard/stores/dashboard.store";

export const getCardLabels = (t: TFunction): Record<CardId, string> => ({
	"card-1": t("dashboard.cards.labels.revenue"),
	"card-2": t("dashboard.cards.labels.clinicCases"),
	"card-3": t("dashboard.cards.labels.performanceDistribution"),
	"card-4": t("dashboard.cards.labels.notes"),
	"card-5": t("dashboard.cards.labels.appointments"),
	"card-6": t("dashboard.cards.labels.tasks"),
	"card-7": t("dashboard.cards.labels.criticalAlerts"),
	"card-8": t("dashboard.cards.labels.inventoryAlerts"),
	"card-9": t("dashboard.cards.labels.appointmentVolume"),
	"card-11": t("dashboard.cards.labels.staffWorkload"),
	"card-12": t("dashboard.cards.labels.appointmentKpis"),
	"card-13": t("dashboard.cards.labels.vaccinationDue"),
});

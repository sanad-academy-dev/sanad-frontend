import type { ReactNode } from "react";
import type { ChartPieDonutDatum } from "@/components/ui/chart-pie-donut";
import type { CardId } from "@/features/dashboard/stores/dashboard.store";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";

export interface BaseDashboardCardProps extends DashboardCardProps {
	cardId: CardId;
	children?: ReactNode;
	headerAction?: ReactNode;
	tabs?: ReactNode;
	icon?: ReactNode;
	/** أصناف إضافية لجذر البطاقة (مثل تجاوز المحاذاة العمودية للمحتوى) */
	className?: string;
}

export interface DashboardCardSwitcherProps extends DashboardCardProps {
	id: CardId;
}

export type DistributionTab = "patients" | "services";

export interface PerformanceDistributionPanelProps {
	data: ChartPieDonutDatum[];
	expanded: boolean;
	isArabic: boolean;
	centerLabel: string;
}

export interface StatItem {
	title: string;
	value: number;
	tooltip: string;
	percentage?: boolean;
	valueLabel?: string;
}

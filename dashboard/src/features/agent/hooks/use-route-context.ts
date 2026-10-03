import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

import { useI18n } from "@/hooks/use-i18n";

// يحوّل المسار الحالي إلى مفتاح سياق يفهمه كتالوج الأوامر + تسمية عربية للعرض
const ROUTE_CONTEXT: { match: RegExp; context: string; label: string }[] = [
	{
		match: /\/hr\/employees|\/staff/,
		context: "hr.employees",
		label: "الموارد البشرية > الموظفين",
	},
	{ match: /\/hr\b/, context: "hr", label: "الموارد البشرية" },
	{ match: /\/appointments/, context: "appointments", label: "الجلسات" },
	{ match: /\/patients\/[^/]+$/, context: "patients.detail", label: "الأطفال > التفاصيل" },
	{ match: /\/patients/, context: "patients", label: "الأطفال" },
	{ match: /\/owners\/[^/]+$/, context: "owners.detail", label: "أولياء الأمور > التفاصيل" },
	{ match: /\/owners/, context: "owners", label: "أولياء الأمور" },
	{ match: /\/dashboard|\/$/, context: "dashboard", label: "الرئيسية" },
];

export const useRouteContext = () => {
	const { pathname } = useLocation();
	const { t } = useI18n();

	return useMemo(() => {
		const found = ROUTE_CONTEXT.find((r) => r.match.test(pathname));
		return {
			context: found?.context,
			label: found?.label ?? t("agent.contextUnknown"),
		};
	}, [pathname, t]);
};

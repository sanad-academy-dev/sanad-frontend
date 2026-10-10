import { IconAlertTriangle, IconClock } from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import type { ReactNode } from "react";

import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	daysUntilExpiry,
	resolveExpiryStatus,
} from "@sanad/contracts/runtime/server/clinic-documents/clinic-documents.type";

/**
 * حالة صلاحية المستند. الحساب مشترك مع الخادم (resolveExpiryStatus) فلا تتعارض
 * الشارة مع العدّاد الذي يظهر فوقها في بطاقات الإحصاء.
 */
export function ExpiryBadge({ expiresAt }: { expiresAt: Date | string | null }) {
	const { t, lang } = useI18n();
	const status = resolveExpiryStatus(expiresAt);

	if (status === "NONE" || !expiresAt)
		return <span className="text-muted-foreground text-xs">{t("documents.expiry.none")}</span>;

	const days = daysUntilExpiry(expiresAt) ?? 0;

	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-xs tabular-nums">
				{format(new Date(expiresAt), "d MMMM yyyy", { locale: lang === "ar" ? arSA : enUS })}
			</span>

			{status === "EXPIRED" ? (
				<Pill tone="destructive">
					<IconAlertTriangle className="size-3" />
					{/* الأيام تُعرض بقيمة موجبة — «منذ» تحمل الإشارة */}
					{t("documents.expiry.expiredSince", { days: Math.abs(days) })}
				</Pill>
			) : status === "EXPIRING" ? (
				<Pill tone="warning">
					<IconClock className="size-3" />
					{days === 0
						? t("documents.expiry.expiresToday")
						: t("documents.expiry.expiresIn", { days })}
				</Pill>
			) : null}
		</div>
	);
}

function Pill({ tone, children }: { tone: "destructive" | "warning"; children: ReactNode }) {
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-medium text-[11px]",
				tone === "destructive"
					? "bg-destructive/10 text-destructive"
					: "bg-amber-500/10 text-amber-700 dark:text-amber-500",
			)}
		>
			{children}
		</span>
	);
}

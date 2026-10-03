import { IconFileText } from "@tabler/icons-react";

import { Spinner } from "@/components/ui/spinner";
import { useEosSettlements } from "@/features/services/staff/hooks/use-end-of-service";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import {
	EOS_REASON_LABEL,
	EOS_STATUS_LABEL,
} from "@sanad/contracts/runtime/server/end-of-service/end-of-service.type";

const STATUS_STYLE: Record<string, string> = {
	DRAFT: "bg-muted text-muted-foreground",
	APPROVED: "bg-emerald-50 text-emerald-600",
	PAID: "bg-blue-50 text-blue-600",
	CANCELLED: "bg-rose-50 text-rose-600",
};

const fmtDate = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

/** استعراض التسويات المحفوظة — الحاسبة تُنشئ، وهذه تعرض ما حُفظ فعلًا. */
export function EosSettlementsList() {
	const { settlements, isLoading } = useEosSettlements();
	const { format } = useCurrency();

	if (isLoading) {
		return (
			<div className="flex justify-center py-10">
				<Spinner />
			</div>
		);
	}

	if (settlements.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-12">
				<IconFileText className="size-6 text-muted-foreground" />
				<p className="text-[13px] font-semibold">لا توجد تسويات محفوظة</p>
				<p className="text-[11px] text-muted-foreground">
					احسب مكافأة موظف من تبويب الحاسبة ثم احفظها لتظهر هنا.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-[12px]">
				<thead className="bg-muted/50">
					<tr className="border-b">
						<th className="px-4 py-2.5 text-start font-medium">الموظف</th>
						<th className="px-3 py-2.5 text-start font-medium">سبب الانتهاء</th>
						<th className="px-3 py-2.5 text-start font-medium">مدة الدورة</th>
						<th className="px-3 py-2.5 text-start font-medium">تاريخ النهاية</th>
						<th className="px-3 py-2.5 text-start font-medium">المكافأة</th>
						<th className="px-4 py-2.5 text-start font-medium">الحالة</th>
					</tr>
				</thead>
				<tbody>
					{settlements.map((s) => (
						<tr
							key={s.id}
							className="border-b last:border-b-0"
						>
							<td className="px-4 py-2.5">
								<p className="font-semibold text-foreground">{s.staffName}</p>
								<p className="font-mono text-[10px] text-muted-foreground">{s.code}</p>
							</td>
							<td className="px-3 py-2.5 text-muted-foreground">
								{EOS_REASON_LABEL[s.reason] ?? s.reason}
							</td>
							<td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
								{s.serviceYears} سنة {s.serviceMonths} شهر
							</td>
							<td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
								{fmtDate(s.endDate)}
							</td>
							<td className="px-3 py-2.5 font-bold whitespace-nowrap">
								{format(s.finalAmount)}
							</td>
							<td className="px-4 py-2.5">
								<span
									className={cn(
										"rounded-full px-2 py-0.5 text-[10px] font-medium",
										STATUS_STYLE[s.status] ?? "bg-muted text-muted-foreground",
									)}
								>
									{EOS_STATUS_LABEL[s.status] ?? s.status}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

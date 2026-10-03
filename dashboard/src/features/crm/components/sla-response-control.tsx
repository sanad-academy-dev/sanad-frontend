import { Button } from "@/components/ui/button";
import { SlaBadge } from "@/features/crm/components/sla-badge";

/**
 * [CRM-P6] §10.3/§10.4 — الشارة ومعها الفعل الذي يغيّرها.
 *
 * لماذا مكوّنٌ واحد بدلًا من زرٍّ مرصوصٍ بجانب `SlaBadge` في كل صفحة: الشارة والفعل
 * مرتبطان منطقيًّا — الزرّ يظهر **فقط** حين توجد مهلةٌ لم تُوفَ بعد، وهي نفس الحالة التي
 * تجعل الشارة «بانتظار الرد» أو «تجاوز المهلة». فصلُهما كان سيسمح لصفحةٍ أن تعرض إحداهما
 * دون الأخرى، وهو تحديدًا ما حدث حتى الآن.
 *
 * ومتى يُستعمل الزرّ: حين يقع الردّ **خارج النظام** — مكالمة، أو رسالة من هاتف الموظّف.
 * الردود داخل النظام (بريد §9.1، واتساب §9.2) تُسجَّل نفسها تلقائيًّا عبر
 * `markFirstResponse`، فلا يحتاج أحدٌ إلى الضغط بعدها.
 */
export const SlaResponseControl = ({
	responseBy,
	firstRespondedAt,
	canEdit,
	isPending,
	onMarkResponded,
}: {
	responseBy: string | Date | null;
	firstRespondedAt: string | Date | null;
	canEdit: boolean;
	isPending?: boolean;
	onMarkResponded: () => unknown;
}) => {
	if (!responseBy) return null;

	return (
		<div className="flex items-center gap-2">
			<SlaBadge
				responseBy={responseBy}
				firstRespondedAt={firstRespondedAt}
			/>
			{!firstRespondedAt && canEdit ? (
				<Button
					type="button"
					size="sm"
					variant="outline"
					className="h-7 text-[11px]"
					disabled={isPending}
					title="للردود التي تقع خارج النظام — مكالمة أو رسالة من هاتف الموظّف"
					onClick={() => void onMarkResponded()}
				>
					تم الرد
				</Button>
			) : null}
		</div>
	);
};

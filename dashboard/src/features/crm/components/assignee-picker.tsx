import { useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";

/**
 * [CRM-P6] §3.2/§11.4 — «المسؤول» في ترويسة العميل المحتمل والصفقة.
 *
 * لماذا في مرحلة التلميع لا في CRM-P1: مسارا `POST /crm/{leads,deals}/:id/assign` شُحنا
 * محكومَين ومُختبَرَين منذ CRM-P1/P2، وخطّافاهما `useAssignLead`/`useAssignDeal` كُتبا —
 * **ولم يستدعِهما شيء قطّ**. فالإسناد كان موجودًا في الـ API ومستحيلًا في المنتج،
 * والترويسة تعرض «غير مُسنَد» بلا وسيلةٍ لتغييرها. أمسكته جولة القاعدة ١٢ لهذه المرحلة
 * حين احتاجت الخطوة السادسة أن تُسنِد لتملأ جدول «الموظفون» في §12.
 *
 * القارئ بلا صلاحية إسناد يرى الاسم نصًّا كما كان — لا قائمةً معطَّلة تَعِد بما لا تُعطي.
 */

/** Radix Select يرفض `value=""`، فـ«غير مُسنَد» قيمةٌ صريحة تُترجَم إلى `null`. */
const UNASSIGNED = "unassigned";

export function AssigneePicker({
	value,
	valueName,
	canAssign,
	disabled,
	onAssign,
}: {
	value: string | null;
	valueName: string | null;
	canAssign: boolean;
	disabled?: boolean;
	/** `toast.promise` لا يعيد `Promise`، فالنوع هنا هو ما تعيده خطّافات الإسناد فعلًا. */
	onAssign: (ownerUserId: string | null) => unknown;
}) {
	const { users, isLoading } = useClinicUsers();
	const [open, setOpen] = useState(false);

	if (!canAssign) {
		return (
			<span className="text-[12px]">
				{valueName ?? <span className="text-muted-foreground">غير مُسنَد</span>}
			</span>
		);
	}

	return (
		<Select
			open={open}
			onOpenChange={setOpen}
			value={value ?? UNASSIGNED}
			onValueChange={(next) => void onAssign(next === UNASSIGNED ? null : next)}
			disabled={disabled || isLoading}
		>
			<SelectTrigger
				className="h-8 w-44 text-[12px]"
				aria-label="المسؤول"
			>
				<SelectValue placeholder="غير مُسنَد" />
			</SelectTrigger>
			<SelectContent dir="rtl">
				<SelectItem value={UNASSIGNED}>غير مُسنَد</SelectItem>
				{users.map((user) => (
					<SelectItem
						key={user.id}
						value={user.id}
					>
						{user.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

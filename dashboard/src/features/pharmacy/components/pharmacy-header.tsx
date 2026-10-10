import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const PHARMACY_TABS = [
	{ value: "ACTIVE", label: "طابور الصرف" },
	{ value: "DRAFT", label: "المسوّدات" },
	{ value: "COUNTER", label: "الكاونتر" },
	{ value: "COMPLETED", label: "المكتملة" },
	{ value: "CANCELLED", label: "الملغاة" },
	// أقسام الوحدة لا حالات وصفة — تُميَّز بالبادئة كي لا تُقرأ مرشِّحًا للطابور
	{ value: "FORMULARY", label: "النشرات الدوائية" },
	{ value: "REPORTS", label: "التقارير" },
] as const;

export type PharmacyTab = (typeof PHARMACY_TABS)[number]["value"];

/**
 * مبدّل تبويبات شاشة الصيدلية — يُنقل إلى فتحة رأس الصفحة كما تفعل شاشات التجميل
 * والتغذية والتطعيمات والأشعّة والمختبر.
 *
 * الصفحات لا ترسم رأسها بنفسها (عقد التصميم §4.0): وضع التبويبات في الجسم يزحزح
 * الجدول عن موضعه المعتاد ويجعل الشاشة غريبة عن شقيقاتها — وهو ما كانت عليه هذه
 * الشاشة قبل التصحيح.
 */
export function PharmacyHeader({
	active,
	onChange,
}: {
	active: PharmacyTab;
	onChange: (tab: PharmacyTab) => void;
}) {
	const { isRtl } = useI18n();
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir={isRtl ? "rtl" : "ltr"}
		>
			<span className="h-[18px] w-px bg-border" />

			<nav className="flex items-center gap-[3.49px]">
				{PHARMACY_TABS.map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px] leading-[16px]",
								isActive
									? "border-[0.75px] border-border bg-muted text-foreground"
									: "text-muted-foreground",
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</nav>
		</div>,
		slot,
	);
}

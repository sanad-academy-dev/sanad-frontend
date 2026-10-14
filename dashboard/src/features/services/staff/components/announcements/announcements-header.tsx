import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/use-i18n";

export function AnnouncementsHeader() {
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
			<h1 className="text-sm font-bold text-foreground">الإعلانات</h1>
		</div>,
		slot,
	);
}

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function QuizzesHeader() {
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir="rtl"
		>
			<h1 className="text-sm font-bold text-foreground">الاختبارات</h1>
		</div>,
		slot,
	);
}

import { useEffect, useRef } from "react";

interface UseKanbanAutoScrollOptions {
	containerRef: React.RefObject<HTMLDivElement | null>;
	isDragging: boolean;
	/** المسافة بالبكسل من حافة الحاوية التي يبدأ عندها التمرير التلقائي (الافتراضي 110px) */
	edgeThreshold?: number;
	/** أقصى سرعة تمرير بالبكسل في كل إطار 60fps (الافتراضي 24px) */
	maxSpeed?: number;
	/** دالة رد نداء تُستدعى عند انتهاء السحب من أي مكان */
	onDragStop?: () => void;
}

/**
 * هوك مخصص للتمرير الأفقي التلقائي والسلس أثناء سحب البطاقات في لوحات الكانبان
 * مصمم ومختبر خصيصاً ليتوافق مع اتجاه RTL العربي في جميع المتصفحات الحديثة.
 */
export function useKanbanAutoScroll({
	containerRef,
	isDragging,
	edgeThreshold = 110,
	maxSpeed = 24,
	onDragStop,
}: UseKanbanAutoScrollOptions) {
	const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
	const rafIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isDragging) {
			pointerPosRef.current = null;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			if (containerRef.current) {
				containerRef.current.style.scrollBehavior = "";
			}
			return;
		}

		// تعطيل scroll-behavior السلس من الـ CSS مؤقتاً أثناء السحب لضمان استجابة لحظية في كل إطار
		if (containerRef.current) {
			containerRef.current.style.scrollBehavior = "auto";
		}

		const handlePointerMove = (e: PointerEvent | MouseEvent) => {
			pointerPosRef.current = { x: e.clientX, y: e.clientY };
		};

		const handlePointerEnd = () => {
			pointerPosRef.current = null;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			onDragStop?.();
		};

		window.addEventListener("pointermove", handlePointerMove, { passive: true });
		window.addEventListener("mousemove", handlePointerMove, { passive: true });
		window.addEventListener("pointerup", handlePointerEnd, { passive: true });
		window.addEventListener("mouseup", handlePointerEnd, { passive: true });
		window.addEventListener("pointercancel", handlePointerEnd, { passive: true });

		const step = () => {
			const container = containerRef.current;
			const pos = pointerPosRef.current;

			if (container && pos) {
				const rect = container.getBoundingClientRect();
				const { x, y } = pos;

				// التأكد من أن مؤشر الماوس يقع ضمن النطاق الرأسي لحاوية الكانبان مع هامش مريح
				const inVerticalRange = y >= rect.top - 80 && y <= rect.bottom + 80;

				if (inVerticalRange) {
					const leftBoundary = rect.left + edgeThreshold;
					const rightBoundary = rect.right - edgeThreshold;

					let scrollDelta = 0;

					if (x < leftBoundary && x >= rect.left - 120) {
						// بالقرب من الحافة اليسرى: في اتجاه RTL هذا يوجه نحو الأعمدة البعيدة (مثل الرفض وبانتظار الدفع)
						const distance = Math.max(0, leftBoundary - x);
						const ratio = Math.min(1, distance / edgeThreshold);
						// تسارع ناعم متدرج لراحة اليد والتحكم الكامل
						const speed = Math.max(2, Math.round(ratio * ratio * maxSpeed));
						scrollDelta = -speed;
					} else if (x > rightBoundary && x <= rect.right + 120) {
						// بالقرب من الحافة اليمنى: في اتجاه RTL هذا يوجه نحو بداية اللوحة (مثل الطابور والمختصرة)
						const distance = Math.max(0, x - rightBoundary);
						const ratio = Math.min(1, distance / edgeThreshold);
						const speed = Math.max(2, Math.round(ratio * ratio * maxSpeed));
						scrollDelta = speed;
					}

					if (scrollDelta !== 0) {
						if (typeof container.scrollBy === "function") {
							container.scrollBy({ left: scrollDelta, behavior: "auto" });
						} else {
							container.scrollLeft += scrollDelta;
						}
					}
				}
			}

			rafIdRef.current = requestAnimationFrame(step);
		};

		rafIdRef.current = requestAnimationFrame(step);

		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("mousemove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerEnd);
			window.removeEventListener("mouseup", handlePointerEnd);
			window.removeEventListener("pointercancel", handlePointerEnd);

			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			if (containerRef.current) {
				containerRef.current.style.scrollBehavior = "";
			}
		};
	}, [isDragging, containerRef, edgeThreshold, maxSpeed, onDragStop]);
}

import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

// لوح التوقيع المرسوم — يُخرج data URL. مشترك بين موافقات العمليات وموافقات
// الطفل: التوقيع سجل قانوني، فتطبيقان له يعنيان سلوكين قد يفترقان.

export const SignaturePad = ({
	value,
	onChange,
	disabled,
}: {
	value: string | null;
	onChange: (dataUrl: string | null) => void;
	disabled?: boolean;
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const drawingRef = useRef(false);
	const dirtyRef = useRef(false);

	const pointOf = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		const canvas = e.currentTarget;
		const rect = canvas.getBoundingClientRect();
		// القماش قد يُعرض بحجم مختلف عن دقّته — نحوّل الإحداثيات
		return {
			x: ((e.clientX - rect.left) / rect.width) * canvas.width,
			y: ((e.clientY - rect.top) / rect.height) * canvas.height,
		};
	};

	const handleDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		if (disabled) return;
		const ctx = e.currentTarget.getContext("2d");
		if (!ctx) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drawingRef.current = true;
		const { x, y } = pointOf(e);
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.strokeStyle = "#1e293b";
		ctx.beginPath();
		ctx.moveTo(x, y);
	};

	const handleMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		if (!drawingRef.current) return;
		const ctx = e.currentTarget.getContext("2d");
		if (!ctx) return;
		const { x, y } = pointOf(e);
		ctx.lineTo(x, y);
		ctx.stroke();
		dirtyRef.current = true;
	};

	const handleUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		if (!drawingRef.current) return;
		drawingRef.current = false;
		if (dirtyRef.current) onChange(e.currentTarget.toDataURL("image/png"));
	};

	const clear = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
		dirtyRef.current = false;
		onChange(null);
	};

	return (
		<div className="flex flex-col gap-1.5">
			<canvas
				ref={canvasRef}
				width={520}
				height={160}
				className="h-28 w-full touch-none rounded-md border bg-white"
				onPointerDown={handleDown}
				onPointerMove={handleMove}
				onPointerUp={handleUp}
				onPointerLeave={handleUp}
			/>
			<div className="flex items-center justify-between">
				<span className="text-[10px] text-muted-foreground">
					{value ? "التوقيع محفوظ — ارسم مجددًا للإضافة" : "ارسم التوقيع داخل الإطار"}
				</span>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					className="h-6 px-2 text-[10px]"
					disabled={disabled}
					onClick={clear}
				>
					مسح وإعادة
				</Button>
			</div>
		</div>
	);
};

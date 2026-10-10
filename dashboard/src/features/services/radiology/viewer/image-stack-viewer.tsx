import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { instanceFileUrl } from "@/features/services/radiology/viewer/cornerstone";
import { cn } from "@/lib/utils";
import type { RadiologyInstanceResponse } from "@/server/radiology/radiology-procedure.type";

// عارض الصور العادية (JPEG/PNG من السونار) — تنقّل بسيط مع شريط مصغّرات.
// ملفات DICOM لها عارض Cornerstone الكامل؛ هذا للسلاسل غير DICOM فقط.

export function ImageStackViewer({ instances }: { instances: RadiologyInstanceResponse[] }) {
	const [index, setIndex] = useState(0);
	const current = instances[index];

	if (!current) {
		return (
			<div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
				لا صور في هذه السلسلة
			</div>
		);
	}

	const go = (delta: number) =>
		setIndex((prev) => Math.min(instances.length - 1, Math.max(0, prev + delta)));

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-2">
			<div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-neutral-800 bg-black">
				<img
					src={instanceFileUrl(current.id)}
					alt={current.fileName ?? "صورة فحص"}
					className="absolute inset-0 size-full object-contain"
				/>
				{instances.length > 1 && (
					<>
						<button
							type="button"
							aria-label="الصورة السابقة"
							disabled={index === 0}
							className="absolute inset-y-0 start-0 flex w-12 items-center justify-center text-neutral-400 hover:primarydisabled:opacity-30"
							onClick={() => go(-1)}
						>
							<IconChevronRight className="size-6 rtl:rotate-180" />
						</button>
						<button
							type="button"
							aria-label="الصورة التالية"
							disabled={index === instances.length - 1}
							className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-neutral-400 hover:primarydisabled:opacity-30"
							onClick={() => go(1)}
						>
							<IconChevronLeft className="size-6 rtl:rotate-180" />
						</button>
					</>
				)}
				<div
					className="pointer-events-none absolute bottom-2 right-2 text-[11px] tabular-nums text-neutral-300"
					dir="ltr"
				>
					{index + 1} / {instances.length}
				</div>
			</div>

			{instances.length > 1 && (
				<div className="flex gap-1.5 overflow-x-auto pb-1">
					{instances.map((instance, i) => (
						<button
							key={instance.id}
							type="button"
							className={cn(
								"size-14 shrink-0 overflow-hidden rounded border",
								i === index ? "border-indigo-500" : "border-neutral-800 opacity-60",
							)}
							onClick={() => setIndex(i)}
						>
							<img
								src={instanceFileUrl(instance.id)}
								alt=""
								className="size-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

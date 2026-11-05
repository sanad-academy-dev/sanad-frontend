import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	IconPrinter,
	IconX,
	IconDownload,
	IconZoomIn,
	IconZoomOut,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { StudentRequestPrintDocument } from "./student-request-print-document";

interface StudentRequestPrintModalProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function StudentRequestPrintModal({
	request,
	open,
	onOpenChange,
}: StudentRequestPrintModalProps) {
	const [zoomLevel, setZoomLevel] = useState<number>(100);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!request) return null;

	const handlePrint = () => {
		window.print();
	};

	return (
		<>
			{/* ─── 1. Print Preview Dialog on Screen ────────────────────────────── */}
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					className="sm:max-w-4xl max-w-[96vw] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl z-[9999]"
					dir="rtl"
					showCloseButton={false}
				>
					{/* Modal Header */}
					<div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 select-none">
						<div className="flex items-center gap-2">
							<div className="size-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
								<IconPrinter className="size-4" />
							</div>
							<div>
								<h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
									معاينة طباعة استمارة الطالب
								</h2>
								<p className="text-[11px] text-zinc-500 font-medium">
									{request.patientName || request.name} • #{request.code}
								</p>
							</div>
						</div>

						{/* Actions & Zoom */}
						<div className="flex items-center gap-2">
							{/* Zoom controls */}
							<div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700 text-xs">
								<button
									type="button"
									onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
									className="p-1 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
									title="تصغير"
								>
									<IconZoomOut className="size-3.5" />
								</button>
								<span className="text-[10.5px] font-mono px-1.5 text-zinc-600 dark:text-zinc-300">
									{zoomLevel}%
								</span>
								<button
									type="button"
									onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
									className="p-1 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
									title="تكبير"
								>
									<IconZoomIn className="size-3.5" />
								</button>
							</div>

							{/* Print Button */}
							<Button
								type="button"
								size="sm"
								onClick={handlePrint}
								className="h-8 px-4 text-xs font-bold bg-[#5B50E5] hover:bg-[#4E43D8] text-white shadow-sm rounded-lg flex items-center gap-1.5 cursor-pointer"
							>
								<IconPrinter className="size-4" />
								<span>طباعة المستند</span>
							</Button>

							{/* Close Button */}
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="size-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
								title="إغلاق"
							>
								<IconX className="size-4" />
							</button>
						</div>
					</div>

					{/* Modal Body: A4 Paper Preview */}
					<div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-200/80 dark:bg-zinc-950 scrollbar-thin">
						<div
							style={{
								transform: `scale(${zoomLevel / 100})`,
								transformOrigin: "top center",
								transition: "transform 0.15s ease",
							}}
							className="bg-white text-zinc-900 shadow-2xl rounded-sm border border-zinc-300 max-w-[210mm] w-full min-h-[297mm] transition-all"
						>
							<StudentRequestPrintDocument request={request} />
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* ─── 2. Dedicated Print Root Portal for window.print() ────────────── */}
			{isMounted &&
				createPortal(
					<div id="student-request-print-root">
						<StudentRequestPrintDocument request={request} />
					</div>,
					document.body,
				)}
		</>
	);
}

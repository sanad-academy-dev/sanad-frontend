import { IconEye, IconFileUpload, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
	useDeleteRadiologyImages,
	useUploadStudy,
} from "@/features/services/radiology/hooks/use-upload-study";
import { RadiologyViewerDialog } from "@/features/services/radiology/viewer/radiology-viewer-dialog";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ⑥ رفع الصور — ملفات DICOM (تُقرأ ترويساتها في المتصفح) أو صور عادية من
// السونار. الملفات تُرفع للتخزين ثم يُسجَّل تسلسل دراسة←سلاسل←صور على الخادم.

const PHASE_LABELS = {
	idle: "",
	parsing: "قراءة الترويسات",
	uploading: "رفع الملفات",
	registering: "تسجيل الدراسة",
} as const;

const formatBytes = (bytes: number | null | undefined) => {
	if (!bytes) return "—";
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} ك.ب`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
};

export function RadiologyImageUpload({
	item,
	orderId,
	readOnly = false,
}: {
	item: RadiologyItemResponse;
	orderId: string;
	readOnly?: boolean;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	// الدراسة المعروضة في العارض المنبثق — null يعني مغلق
	const [viewerStudyId, setViewerStudyId] = useState<string | null>(null);
	// هدف الحذف بانتظار التأكيد — الحذف لا رجعة فيه
	const [pendingDelete, setPendingDelete] = useState<{
		kind: "instance" | "series" | "study";
		id: string;
		label: string;
		count: number;
	} | null>(null);
	const { deleteImages, isPending: isDeleting } = useDeleteRadiologyImages();
	const { uploadStudies, progress, isUploading } = useUploadStudy();

	const handleFiles = (list: FileList | null) => {
		if (!list || list.length === 0) return;
		void uploadStudies({ itemId: item.id, orderId, files: [...list] });
		// إعادة الضبط حتى يُقبل اختيار الملفات نفسها مرة أخرى
		if (inputRef.current) inputRef.current.value = "";
	};

	const openViewer = (studyId: string) => setViewerStudyId(studyId);

	return (
		<div className="flex flex-col gap-4">
			{!readOnly && (
				<>
					<input
						ref={inputRef}
						type="file"
						multiple
						accept=".dcm,application/dicom,image/*"
						className="hidden"
						onChange={(e) => handleFiles(e.target.files)}
					/>
					{/* منطقة الرفع — DICOM بامتداد ‎.dcm أو بلا امتداد، والصور العادية تُقبل */}
					<button
						type="button"
						disabled={isUploading}
						className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/40 disabled:opacity-60"
						onClick={() => inputRef.current?.click()}
					>
						<IconFileUpload className="size-8 text-muted-foreground" />
						<span className="text-sm font-medium">اختر ملفات DICOM أو صورًا لرفعها</span>
						<span className="text-xs text-muted-foreground">
							‎.dcm من جهاز التصوير، أو JPEG/PNG من السونار — تُقرأ الترويسات وتُجمَّع تلقائيًا في
							دراسات وسلاسل
						</span>
					</button>

					{isUploading && progress.phase !== "idle" && (
						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>{PHASE_LABELS[progress.phase]}</span>
								<span className="tabular-nums">
									{progress.done}/{progress.total}
								</span>
							</div>
							<Progress value={progress.total ? (progress.done / progress.total) * 100 : 0} />
						</div>
					)}
				</>
			)}

			{/* الدراسات المسجّلة — دراسة ← سلاسل ← عدد الصور، مع فتح العارض */}
			{item.studies.length === 0 ? (
				<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
					لا صور مرفوعة لهذا الفحص بعد
				</p>
			) : (
				<div className="flex flex-col gap-2">
					{item.studies.map((study) => {
						const instanceCount = study.series.reduce(
							(sum, series) => sum + series.instances.length,
							0,
						);
						return (
							<div
								key={study.id}
								className="flex flex-col gap-2 rounded-md border bg-card p-3"
							>
								<div className="flex items-center justify-between gap-2">
									<div className="flex min-w-0 items-center gap-1.5">
										<IconPhoto className="size-4 shrink-0 text-muted-foreground" />
										<span className="truncate text-sm font-medium">
											{study.description || "دراسة تصوير"}
										</span>
										{study.modality && (
											<Badge
												variant="outline"
												className="text-[10px]"
											>
												{MODALITY_META[study.modality].label}
											</Badge>
										)}
										<span className="shrink-0 text-xs tabular-nums text-muted-foreground">
											{instanceCount} صورة
										</span>
									</div>
									<div className="flex shrink-0 items-center gap-1.5">
										<Button
											type="button"
											size="sm"
											variant="outline"
											className="gap-1.5"
											onClick={() => openViewer(study.id)}
										>
											<IconEye className="size-3.5" />
											فتح العارض
										</Button>
										{!readOnly && (
											<Button
												type="button"
												size="icon-sm"
												variant="ghost"
												aria-label="حذف الدراسة"
												title="حذف الدراسة بكل صورها"
												disabled={isDeleting}
												className="text-muted-foreground hover:text-destructive"
												onClick={() =>
													setPendingDelete({
														kind: "study",
														id: study.id,
														label: study.description || "الدراسة",
														count: instanceCount,
													})
												}
											>
												<IconTrash className="size-3.5" />
											</Button>
										)}
									</div>
								</div>
								<div className="flex flex-col gap-1">
									{study.series.map((series) => {
										const seriesLabel =
											series.description ||
											`سلسلة ${series.seriesNumber ?? ""}`.trim() ||
											"سلسلة";
										return (
											<details
												key={series.id}
												className="rounded border bg-muted/20"
											>
												<summary className="flex cursor-pointer items-center justify-between gap-2 px-2 py-1.5 text-xs">
													<span className="truncate">
														{seriesLabel}
														{series.bodyPart ? ` · ${series.bodyPart}` : ""}
													</span>
													<span className="flex shrink-0 items-center gap-2">
														<span className="tabular-nums text-muted-foreground">
															{series.instances.length} ×{" "}
															{formatBytes(
																series.instances.reduce((s, i) => s + (i.sizeBytes ?? 0), 0),
															)}
														</span>
														{!readOnly && (
															<Button
																type="button"
																size="icon-sm"
																variant="ghost"
																aria-label="حذف السلسلة"
																title="حذف السلسلة"
																disabled={isDeleting}
																className="text-muted-foreground hover:text-destructive"
																onClick={(e) => {
																	e.preventDefault();
																	setPendingDelete({
																		kind: "series",
																		id: series.id,
																		label: seriesLabel,
																		count: series.instances.length,
																	});
																}}
															>
																<IconTrash className="size-3.5" />
															</Button>
														)}
													</span>
												</summary>
												{/* صور السلسلة — لحذف صورة بعينها رُفعت خطأً */}
												<div className="flex flex-col gap-0.5 border-t px-2 py-1.5">
													{series.instances.map((instance, i) => (
														<div
															key={instance.id}
															className="flex items-center justify-between gap-2 text-[11px]"
														>
															<span className="truncate text-muted-foreground">
																{instance.instanceNumber ?? i + 1}.{" "}
																{instance.fileName ?? instance.sopUid}
															</span>
															<span className="flex shrink-0 items-center gap-1.5">
																<span className="tabular-nums text-muted-foreground">
																	{formatBytes(instance.sizeBytes)}
																</span>
																{!readOnly && (
																	<Button
																		type="button"
																		size="icon-sm"
																		variant="ghost"
																		aria-label="حذف الصورة"
																		disabled={isDeleting}
																		className="size-6 text-muted-foreground hover:text-destructive"
																		onClick={() =>
																			setPendingDelete({
																				kind: "instance",
																				id: instance.id,
																				label: instance.fileName ?? "الصورة",
																				count: 1,
																			})
																		}
																	>
																		<IconTrash className="size-3" />
																	</Button>
																)}
															</span>
														</div>
													))}
												</div>
											</details>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* العارض المنبثق — يفتح فوق اللوحة بحجم ٩٠٪ من الشاشة */}
			<RadiologyViewerDialog
				studyId={viewerStudyId}
				onOpenChange={(open) => {
					if (!open) setViewerStudyId(null);
				}}
			/>

			{/* تأكيد الحذف — الصور جزء من السجل الطبي فلا تُحذف بنقرة واحدة */}
			<Dialog
				open={!!pendingDelete}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent
					dir="rtl"
					className="max-w-sm"
				>
					<DialogHeader>
						<DialogTitle>
							{pendingDelete?.kind === "study"
								? "حذف الدراسة"
								: pendingDelete?.kind === "series"
									? "حذف السلسلة"
									: "حذف الصورة"}
						</DialogTitle>
						<DialogDescription>
							سيُحذف {pendingDelete?.count ?? 0}{" "}
							{(pendingDelete?.count ?? 0) === 1 ? "ملف" : "ملفًا"} من «{pendingDelete?.label}»
							نهائيًا. لا يمكن التراجع — أعِد الرفع إن لزم.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isDeleting}
							onClick={() => setPendingDelete(null)}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							variant="destructive"
							disabled={isDeleting}
							onClick={() => {
								if (!pendingDelete) return;
								void deleteImages({
									kind: pendingDelete.kind,
									id: pendingDelete.id,
									orderId,
								})
									.then(() => setPendingDelete(null))
									.catch(() => {});
							}}
						>
							<IconTrash className="size-3.5" />
							حذف
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

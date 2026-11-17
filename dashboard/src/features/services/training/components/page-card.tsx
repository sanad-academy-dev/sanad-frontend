import {
	IconCopy,
	IconDots,
	IconEye,
	IconFileCheck,
	IconFileDescription,
	IconPencil,
	IconSchool,
	IconTrash,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TrainingPage } from "../hooks/use-training-pages";
import { cleanPageSummary, extractSystemTag } from "./page-dialog";

const fmtDate = (d: string) =>
	new Date(d).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });

function StatusPill({ status }: { status: "PUBLISHED" | "DRAFT" }) {
	const published = status === "PUBLISHED";
	return (
		<span
			className={cn(
				"inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border bg-background px-2 py-0.5 text-[10px] font-semibold",
				published
					? "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
					: "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
			)}
		>
			<span
				className={cn("size-1.5 rounded-full", published ? "bg-emerald-500" : "bg-amber-500")}
			/>
			{published ? "منشورة" : "مسودة"}
		</span>
	);
}

function Chip({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
			{children}
		</span>
	);
}

export function PageCard({
	page,
	onEdit,
	onPreview,
	onDuplicate,
	onPublishToggle,
	onDelete,
}: {
	page: TrainingPage;
	onEdit: () => void;
	onPreview: () => void;
	onDuplicate: () => void;
	onPublishToggle: () => void;
	onDelete: () => void;
}) {
	const published = page.status === "PUBLISHED";
	const stage =
		(page as { academicStage?: string }).academicStage ||
		extractSystemTag(page.summary, "stage") ||
		extractSystemTag(page.summary, "المرحلة");
	const cleanSummary = cleanPageSummary(page.summary);

	return (
		<div
			className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-sm text-right"
			dir="rtl"
		>
			{/* رأس البطاقة */}
			<div className="flex flex-col gap-2 p-3.5 pb-2">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
							{page.category || "عام وتوجيهي"}
						</span>
						{stage && stage !== "بدون مرحلة دراسية" && stage !== "بدون مرحلة" && (
							<span className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[10.5px] font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
								<IconSchool className="size-3 shrink-0" />
								<span>{stage}</span>
							</span>
						)}
					</div>
					<StatusPill status={page.status} />
				</div>

				{/* العنوان والملخص */}
				<div className="flex flex-col gap-1 pt-1">
					<button
						type="button"
						onClick={onPreview}
						className="line-clamp-1 text-right text-[13.5px] font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
						title={page.title}
					>
						{page.title || "صفحة بدون عنوان"}
					</button>
					<p
						className="line-clamp-2 min-h-[34px] text-[11px] leading-relaxed text-muted-foreground"
						title={cleanSummary}
					>
						{cleanSummary || "لا يوجد ملخص مضاف لهذه الصفحة حتى الآن."}
					</p>
				</div>
			</div>

			{/* الرقاقات والمعلومات */}
			<div className="flex flex-wrap items-center gap-1.5 px-3.5 py-1 text-[11px]">
				<Chip>
					<IconEye className="size-3 text-muted-foreground" />
					<span>{page.viewsCount || 0} مشاهدة</span>
				</Chip>
				<span className="text-[10px] text-muted-foreground me-auto">
					{fmtDate(page.updatedAt)}
				</span>
			</div>

			{/* شريط الإجراءات السفلي */}
			<div className="flex items-center justify-between gap-2 border-t border-border/80 bg-muted/20 px-3 py-2 mt-2">
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={onEdit}
						className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
					>
						<IconPencil className="size-3 text-muted-foreground" />
						تعديل
					</button>

					<button
						type="button"
						onClick={onPreview}
						className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
					>
						<IconEye className="size-3 text-muted-foreground" />
						معاينة
					</button>
				</div>

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger
						aria-label="خيارات الصفحة"
						className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
					>
						<IconDots className="size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[160px]"
					>
						<DropdownMenuItem onClick={onEdit}>
							<IconPencil className="size-4" />
							تحرير المحتوى
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onPreview}>
							<IconEye className="size-4" />
							معاينة لايف
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDuplicate}>
							<IconCopy className="size-4" />
							استنساخ كمسودة
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={onPublishToggle}>
							{published ? (
								<>
									<IconFileDescription className="size-4 text-amber-600" />
									تحويل إلى مسودة
								</>
							) : (
								<>
									<IconFileCheck className="size-4 text-emerald-600" />
									نشر الصفحة
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={onDelete}
						>
							<IconTrash className="size-4" />
							حذف الصفحة
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

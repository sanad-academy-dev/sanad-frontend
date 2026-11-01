import { useState } from "react";
import { IconCheck, IconEdit, IconNotes, IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useQuickUpdateRequest } from "../../hooks/use-digital-registration";

interface RequestInternalNotesProps {
	request: CampaignRequestItem;
	campaignId?: string;
}

export function RequestInternalNotes({
	request,
	campaignId = "",
}: RequestInternalNotesProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [noteText, setNoteText] = useState(request.notes || "");
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	const handleSave = () => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { notes: noteText.trim() || null },
			},
			{
				onSuccess: () => {
					toast.success("تم تحديث ملاحظات المراجع بنجاح");
					setIsEditing(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تحديث الملاحظات");
				},
			},
		);
	};

	return (
		<div className="space-y-1.5" dir="rtl">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
						<IconNotes className="size-3 text-primary" />
						<span>ملاحظات المراجع</span>
					</h4>
					<Badge
						variant="outline"
						className="border-zinc-200 text-zinc-500 dark:border-zinc-700 text-[9px] px-1 py-0"
					>
						داخلية
					</Badge>
				</div>

				{!isEditing && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-5 px-1.5 text-[10px] text-primary hover:bg-primary/10 gap-0.5"
						onClick={() => {
							setNoteText(request.notes || "");
							setIsEditing(true);
						}}
					>
						{request.notes ? (
							<>
								<IconEdit className="size-2.5" />
								<span>تعديل</span>
							</>
						) : (
							<>
								<IconPlus className="size-2.5" />
								<span>إضافة ملاحظة</span>
							</>
						)}
					</Button>
				)}
			</div>

			{isEditing ? (
				<div className="rounded-md border border-primary/40 bg-white dark:bg-zinc-900 p-2 space-y-1.5">
					<Textarea
						value={noteText}
						onChange={(e) => setNoteText(e.target.value)}
						placeholder="اكتب ملاحظات التدقيق الداخلي للطالب..."
						className="min-h-14 text-[11px] resize-none"
					/>
					<div className="flex items-center justify-end gap-1.5">
						<Button
							size="sm"
							variant="outline"
							className="h-6 text-[10px]"
							onClick={() => setIsEditing(false)}
							disabled={quickUpdateMutation.isPending}
						>
							<IconX className="size-2.5" />
							<span>إلغاء</span>
						</Button>
						<Button
							size="sm"
							className="h-6 text-[10px] gap-1"
							onClick={handleSave}
							disabled={quickUpdateMutation.isPending}
						>
							<IconCheck className="size-2.5" />
							<span>{quickUpdateMutation.isPending ? "جاري الحفظ..." : "حفظ"}</span>
						</Button>
					</div>
				</div>
			) : (
				<div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-2.5 flex items-start justify-between gap-2 shadow-2xs">
					<p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed min-w-0 flex-1">
						{request.notes ? (
							request.notes
						) : (
							<span className="text-zinc-400 dark:text-zinc-500 italic text-[10.5px]">
								لا توجد ملاحظات تدقيق داخلية مدونة بعد.
							</span>
						)}
					</p>
				</div>
			)}
		</div>
	);
}

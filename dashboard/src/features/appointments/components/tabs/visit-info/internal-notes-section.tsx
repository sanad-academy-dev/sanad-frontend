import { IconArrowUp, IconEyeOff } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InternalNoteItem } from "@/features/appointments/components/tabs/visit-info/internal-note-item";
import { MentionTextarea } from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useAppointmentInternalNotes } from "@/features/appointments/hooks/use-appointment-internal-notes";
import { useCreateInternalNote } from "@/features/appointments/hooks/use-create-internal-note";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

interface InternalNotesSectionProps {
	appointmentId: string;
}

export function InternalNotesSection({ appointmentId }: InternalNotesSectionProps) {
	const { notes, isLoading } = useAppointmentInternalNotes(appointmentId);
	const { createNote, isPending } = useCreateInternalNote(appointmentId);
	const { appointment } = useAppointment(appointmentId);
	const { branch } = useBranch(appointment?.branchId ?? "");
	const { staff } = useStaff();

	// ميزة الإشارات (@) مشروطة بتفعيلها في إعدادات الفرع — وإلا لا تظهر قائمة
	const mentionsEnabled = branch ? parseBranchSettings(branch.settings).queue.mentions : false;
	// مرشّحو الإشارة: كل موظفي الأكاديمية بالاسم — فارغة إن كانت الميزة معطّلة
	const mentionables = useMemo(
		() => (mentionsEnabled ? staff.map((s) => ({ id: s.id, name: s.name })) : []),
		[mentionsEnabled, staff],
	);
	const [draft, setDraft] = useState("");
	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);

	const handleSave = async () => {
		const trimmed = draft.trim();
		if (trimmed.length === 0) return;
		await createNote({ body: trimmed, mentionedStaffIds });
		setDraft("");
		setMentionedStaffIds([]);
	};

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<p className="font-semibold text-base">الملاحظات الداخلية</p>
				<Badge
					variant="secondary"
					className="text-[10px]"
				>
					<IconEyeOff className="size-3.5" />
					سري دائمًا
				</Badge>
			</div>

			<div className="relative rounded-md border bg-card">
				<MentionTextarea
					value={draft}
					onChange={setDraft}
					users={mentionables}
					onMentionsChange={setMentionedStaffIds}
					placeholder={
						mentionsEnabled
							? "أضف ملاحظة داخلية... اكتب @ للإشارة إلى زميل"
							: "أضف ملاحظة داخلية..."
					}
					className="min-h-28 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
					disabled={isPending}
				/>
				<Button
					size="icon-xs"
					variant="outline"
					className="absolute bottom-2 end-2 z-10 size-7 rounded-full border enabled:border-indigo-600 enabled:bg-indigo-600 enabled:primaryenabled:hover:bg-indigo-700"
					onClick={handleSave}
					disabled={isPending || draft.trim().length === 0}
				>
					<IconArrowUp className="size-3.5" />
				</Button>
			</div>

			{isLoading ? (
				<InternalNotesSectionSkeleton />
			) : notes.length === 0 ? (
				<p className="text-muted-foreground text-xs">لا توجد ملاحظات داخلية</p>
			) : (
				<div className="flex flex-col gap-2">
					{notes.map((note) => (
						<InternalNoteItem
							key={note.id}
							appointmentId={appointmentId}
							note={note}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function InternalNotesSectionSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: 2 }).map((_, i) => (
				<div
					key={i}
					className="rounded-md border bg-card p-3"
				>
					<div className="mb-2 flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="size-6 rounded-md" />
					</div>
					<div className="flex flex-col gap-1.5">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-3/4" />
					</div>
				</div>
			))}
		</div>
	);
}

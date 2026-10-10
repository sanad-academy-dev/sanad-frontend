import { IconDots } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteInternalNote } from "@/features/appointments/hooks/use-delete-internal-note";
import { useUpdateInternalNote } from "@/features/appointments/hooks/use-update-internal-note";
import { useSession } from "@/lib/auth/client";
import type { AppointmentInternalNoteResponse } from "@/server/appointments/appointments.type";

interface InternalNoteItemProps {
	appointmentId: string;
	note: AppointmentInternalNoteResponse;
}

// يُبرز رموز الإشارة (@اسم) المطابقة للمستخدمين المُشار إليهم داخل نص الملاحظة
function renderBody(body: string, mentions: AppointmentInternalNoteResponse["mentions"]) {
	if (mentions.length === 0) return body;
	// أطول الأسماء أولًا لتفادي مطابقة جزئية لاسم يبدأ باسم آخر
	const names = mentions
		.map((m) => m.staff.name)
		.sort((a, b) => b.length - a.length)
		.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`@(?:${names.join("|")})`, "g");
	const parts = body.split(pattern);
	const tokens = body.match(pattern) ?? [];
	return parts.flatMap((part, i) => {
		const token = tokens[i];
		return [
			part,
			token ? (
				<span
					key={`m-${i}`}
					className="font-medium text-primary"
				>
					{token}
				</span>
			) : null,
		];
	});
}

export function InternalNoteItem({ appointmentId, note }: InternalNoteItemProps) {
	const { data: session } = useSession();
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(note.body);
	const { updateNote, isPending: isUpdating } = useUpdateInternalNote(appointmentId);
	const { deleteNote, isPending: isDeleting } = useDeleteInternalNote(appointmentId);

	const isAuthor = session?.user.id === note.author.id;
	const relative = formatDistanceToNow(new Date(note.createdAt), {
		addSuffix: true,
		locale: arSA,
	});

	const handleSave = async () => {
		const trimmed = draft.trim();
		if (trimmed.length === 0 || trimmed === note.body) {
			setIsEditing(false);
			setDraft(note.body);
			return;
		}
		await updateNote({ noteId: note.id, body: trimmed });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setDraft(note.body);
		setIsEditing(false);
	};

	return (
		<div className="rounded-md border bg-card p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<span className="font-medium text-foreground">{note.author.name}</span>
					<span>•</span>
					<span>{relative}</span>
				</div>
				{isAuthor && !isEditing && (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								size="icon-xs"
								variant="ghost"
								className="size-6"
							>
								<IconDots className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem onSelect={() => setIsEditing(true)}>تعديل</DropdownMenuItem>
							<DropdownMenuItem
								onSelect={() => {
									void deleteNote(note.id);
								}}
								disabled={isDeleting}
							>
								حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
			{isEditing ? (
				<div className="flex flex-col gap-2">
					<Textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						className="min-h-20 resize-none"
						disabled={isUpdating}
					/>
					<div className="flex items-center justify-end gap-2">
						<Button
							size="xs"
							variant="ghost"
							onClick={handleCancel}
							disabled={isUpdating}
						>
							إلغاء
						</Button>
						<Button
							size="xs"
							onClick={handleSave}
							disabled={isUpdating}
						>
							حفظ
						</Button>
					</div>
				</div>
			) : (
				<p className="whitespace-pre-wrap text-sm">{renderBody(note.body, note.mentions)}</p>
			)}
		</div>
	);
}

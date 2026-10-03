import { IconArrowUp, IconDots, IconEyeOff } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	MentionTextarea,
	type MentionUser,
} from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import {
	useAddLabComment,
	useDeleteLabComment,
	useUpdateLabComment,
} from "@/features/services/lab-tests/hooks/use-lab-comments";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useSession } from "@/lib/auth/client";
import type {
	LabCommentResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";

// تعليقات الطلب الداخلية — نفس تصميم الملاحظات الداخلية في الزيارة:
// حقل كتابة بإشارات (@) في الأعلى، ثم التعليقات الأحدث أولًا.

/** الحرفان الأولان من الاسم — بديل الصورة في أفاتار كاتب التعليق */
const initialsOf = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0] ?? "")
		.join("")
		.toUpperCase();

/** يُبرز رموز الإشارة (@اسم) المطابقة للمُشار إليهم داخل نص التعليق */
function renderBody(body: string, mentions: LabCommentResponse["mentions"]) {
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

export function LabOrderComments({
	order,
	showHeader = true,
}: {
	order: LabTestOrderResponse;
	/** يُخفى داخل عمود التعليقات لأن ترويسة العمود تحمل العنوان نفسه */
	showHeader?: boolean;
}) {
	const { staff } = useStaff();
	const mentionables = useMemo<MentionUser[]>(
		() => staff.map((s) => ({ id: s.id, name: s.name })),
		[staff],
	);
	const { addComment, isPending } = useAddLabComment();
	const [draft, setDraft] = useState("");
	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);

	const handleSave = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		void addComment({ id: order.id, body: trimmed, mentionedStaffIds })
			.then(() => {
				setDraft("");
				setMentionedStaffIds([]);
			})
			.catch(() => {});
	};

	return (
		<section className="flex flex-col gap-3">
			{showHeader && (
				<div className="flex items-center gap-2">
					<p className="text-base font-semibold">التعليقات</p>
					<Badge
						variant="secondary"
						className="text-[10px]"
					>
						<IconEyeOff className="size-3.5" />
						داخلية — لا تظهر للوليّ أمر
					</Badge>
				</div>
			)}

			<div className="relative rounded-md border bg-card">
				<MentionTextarea
					value={draft}
					onChange={setDraft}
					users={mentionables}
					onMentionsChange={setMentionedStaffIds}
					placeholder="أضف تعليقًا... اكتب @ للإشارة إلى زميل"
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

			{order.comments.length === 0 ? (
				<p className="text-xs text-muted-foreground">لا توجد تعليقات بعد</p>
			) : (
				<div className="flex flex-col gap-2">
					{order.comments.map((comment) => (
						<LabCommentItem
							key={comment.id}
							comment={comment}
							mentionables={mentionables}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function LabCommentItem({
	comment,
	mentionables,
}: {
	comment: LabCommentResponse;
	mentionables: MentionUser[];
}) {
	const { data: session } = useSession();
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(comment.body);
	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>(
		comment.mentions.map((m) => m.staff.id),
	);
	const { updateComment, isPending: isUpdating } = useUpdateLabComment();
	const { deleteComment, isPending: isDeleting } = useDeleteLabComment();

	// التعديل والحذف لصاحب التعليق وحده — والخادم يتحقّق أيضًا
	const isAuthor = session?.user.id === comment.author.id;
	const relative = formatDistanceToNow(new Date(comment.createdAt), {
		addSuffix: true,
		locale: arSA,
	});
	const isBusy = isUpdating || isDeleting;

	const handleSave = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		void updateComment({ commentId: comment.id, body: trimmed, mentionedStaffIds })
			.then(() => setIsEditing(false))
			.catch(() => {});
	};

	return (
		<div className="rounded-md border bg-card p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
					{/* صورة الكاتب (أحرف اسمه) ثم الاسم بجانبها ثم زمن النشر نسبيًا */}
					<Avatar size="sm">
						<AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
							{initialsOf(comment.author.name)}
						</AvatarFallback>
					</Avatar>
					<span className="truncate font-semibold text-foreground">{comment.author.name}</span>
					<span>•</span>
					<span className="shrink-0">{relative}</span>
					{comment.updatedAt > comment.createdAt && <span className="shrink-0">• عُدِّل</span>}
				</div>
				{isAuthor && !isEditing && (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="size-6"
								disabled={isBusy}
							>
								<IconDots className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onSelect={() => setIsEditing(true)}>تعديل</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={() => {
									void deleteComment({ commentId: comment.id }).catch(() => {});
								}}
							>
								حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{isEditing ? (
				<div className="flex flex-col gap-2">
					<MentionTextarea
						value={draft}
						onChange={setDraft}
						users={mentionables}
						onMentionsChange={setMentionedStaffIds}
						disabled={isBusy}
						className="min-h-20"
					/>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							disabled={isBusy || draft.trim().length === 0}
							onClick={handleSave}
						>
							حفظ
						</Button>
						<Button
							size="sm"
							variant="outline"
							disabled={isBusy}
							onClick={() => {
								setDraft(comment.body);
								setIsEditing(false);
							}}
						>
							إلغاء
						</Button>
					</div>
				</div>
			) : (
				<p className="whitespace-pre-wrap text-sm">
					{renderBody(comment.body, comment.mentions)}
				</p>
			)}
		</div>
	);
}

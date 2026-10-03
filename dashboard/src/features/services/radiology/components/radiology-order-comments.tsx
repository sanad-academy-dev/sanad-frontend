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
	useAddRadiologyComment,
	useDeleteRadiologyComment,
} from "@/features/services/radiology/hooks/use-radiology-comments";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useSession } from "@/lib/auth/client";
import type {
	RadiologyCommentResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";

// تعليقات طلب الأشعة — نفس تعليقات التحاليل شكلًا وسلوكًا: حقل كتابة بإشارات
// (@) في الأعلى ثم التعليقات. داخلية لا تظهر للوليّ أمر.

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
function renderBody(body: string, mentions: RadiologyCommentResponse["mentions"]) {
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

export function RadiologyOrderComments({
	order,
	showHeader = true,
}: {
	order: RadiologyOrderResponse;
	showHeader?: boolean;
}) {
	const { staff } = useStaff();
	// لا يُعرض للإشارة إلا موظّف له حساب مستخدم — الإشارة إلى موظّف بلا حساب
	// لا تصل أحدًا، فإخفاؤه أصدق من إشارة صامتة
	const mentionables = useMemo<MentionUser[]>(
		() => staff.filter((s) => s.user?.id).map((s) => ({ id: s.id, name: s.name })),
		[staff],
	);
	const { addComment, isPending } = useAddRadiologyComment();
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
						<RadiologyCommentItem
							key={comment.id}
							comment={comment}
							orderId={order.id}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function RadiologyCommentItem({
	comment,
	orderId,
}: {
	comment: RadiologyCommentResponse;
	orderId: string;
}) {
	const { data: session } = useSession();
	const { deleteComment, isPending } = useDeleteRadiologyComment();

	// الحذف لصاحب التعليق وحده — والخادم يتحقّق أيضًا
	const isAuthor = session?.user.id === comment.author.id;
	const relative = formatDistanceToNow(new Date(comment.createdAt), {
		addSuffix: true,
		locale: arSA,
	});

	return (
		<div className="rounded-md border bg-card p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
					<Avatar size="sm">
						<AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
							{initialsOf(comment.author.name)}
						</AvatarFallback>
					</Avatar>
					<span className="truncate font-semibold text-foreground">{comment.author.name}</span>
					<span>•</span>
					<span className="shrink-0">{relative}</span>
				</div>
				{isAuthor && (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="size-6"
								disabled={isPending}
							>
								<IconDots className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={() => {
									void deleteComment({ commentId: comment.id, orderId }).catch(() => {});
								}}
							>
								حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			<p className="whitespace-pre-wrap text-sm">
				{renderBody(comment.body, comment.mentions)}
			</p>
		</div>
	);
}

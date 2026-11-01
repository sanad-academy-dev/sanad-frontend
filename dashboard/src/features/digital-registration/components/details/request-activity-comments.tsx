import { useEffect, useRef, useState } from "react";
import {
	IconAt,
	IconArrowUp,
	IconCornerDownLeft,
	IconLoader2,
	IconMoodSmile,
	IconPaperclip,
	IconSend,
	IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem, RegistrationCommentItem } from "../../types/campaign-request.types";
import {
	useAddRequestComment,
	useDeleteRequestComment,
} from "../../hooks/use-digital-registration";

interface RequestActivityCommentsProps {
	request: CampaignRequestItem;
	campaignId?: string;
}

function formatArabicRelativeTime(dateString: string): string {
	if (!dateString) return "الآن";
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
		if (diffSec < 30) return "منذ ثوانٍ";
		if (diffSec < 60) return "منذ دقيقة";
		const diffMin = Math.floor(diffSec / 60);
		if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
		const diffHours = Math.floor(diffMin / 60);
		if (diffHours === 1) return "منذ ساعة";
		if (diffHours === 2) return "منذ ساعتين";
		if (diffHours < 24) return `منذ ${diffHours} ساعة`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays === 1) return "أمس";
		if (diffDays === 2) return "منذ يومين";
		if (diffDays < 7) return `منذ ${diffDays} أيام`;
		return date.toLocaleDateString("ar-EG", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return "مؤخراً";
	}
}

export function RequestActivityComments({
	request,
	campaignId = "",
}: RequestActivityCommentsProps) {
	const [commentDraft, setCommentDraft] = useState("");
	const [commentsList, setCommentsList] = useState<RegistrationCommentItem[]>(
		request.comments || [],
	);
	const commentsContainerRef = useRef<HTMLDivElement>(null);

	const addCommentMutation = useAddRequestComment(campaignId, request.id);
	const deleteCommentMutation = useDeleteRequestComment(campaignId, request.id);

	// Synchronize with external request prop updates
	useEffect(() => {
		if (request.comments) {
			setCommentsList(request.comments);
		}
	}, [request.comments]);

	const handleSendComment = () => {
		const trimmed = commentDraft.trim();
		if (!trimmed) return;

		// 1. Optimistic UI update: show immediately without latency
		const tempId = `temp-${Date.now()}`;
		const optimisticComment: RegistrationCommentItem = {
			id: tempId,
			authorName: "د. أحمد جمال",
			body: trimmed,
			createdAt: new Date().toISOString(),
		};

		setCommentsList((prev) => [optimisticComment, ...prev]);
		setCommentDraft("");

		// Smooth scroll to top of comments list where new comment is shown
		if (commentsContainerRef.current) {
			commentsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
		}

		// 2. Perform backend mutation
		addCommentMutation.mutate(
			{ requestId: request.id, content: trimmed },
			{
				onSuccess: (savedComment) => {
					toast.success("تمت إضافة التعليق بنجاح");
					if (savedComment && savedComment.id) {
						setCommentsList((prev) =>
							prev.map((c) => (c.id === tempId ? savedComment : c)),
						);
					}
				},
				onError: (err: any) => {
					// Rollback on error
					setCommentsList((prev) => prev.filter((c) => c.id !== tempId));
					setCommentDraft(trimmed);
					toast.error(err.message || "فشل إضافة التعليق");
				},
			},
		);
	};

	const handleDeleteComment = (commentId: string) => {
		// Optimistically remove comment
		const previousList = [...commentsList];
		setCommentsList((prev) => prev.filter((c) => c.id !== commentId));

		deleteCommentMutation.mutate(commentId, {
			onSuccess: () => {
				toast.success("تم حذف التعليق بنجاح");
			},
			onError: (err: any) => {
				// Rollback on failure
				setCommentsList(previousList);
				toast.error(err.message || "فشل حذف التعليق");
			},
		});
	};

	return (
		<div
			className="rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-3 font-sans shadow-2xs"
			dir="rtl"
		>
			{/* رأس القسم: سجل النشاط والتعليقات مطابق لتصميم الصورة المرجعية */}
			<div className="flex items-center justify-between">
				<h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
					<span>سجل النشاط والتعليقات</span>
				</h4>
				<span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
					{commentsList.length} {commentsList.length === 1 ? "نشاط" : "نشاطات"}
				</span>
			</div>

			{/* قائمة التعليقات السابقة */}
			<div
				ref={commentsContainerRef}
				className="space-y-2 max-h-56 overflow-y-auto pr-0.5 scrollbar-thin"
			>
				{commentsList.length === 0 ? (
					<div className="text-center py-4 text-[11px] text-zinc-400 dark:text-zinc-500 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
						لا توجد نشاطات أو تعليقات مدونة بعد.
					</div>
				) : (
					commentsList.map((c) => {
						const initials = (c.authorName || "فريق")
							.split(" ")
							.filter(Boolean)
							.slice(0, 2)
							.map((w) => w[0])
							.join("");

						return (
							<div
								key={c.id}
								className="group relative rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 p-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
							>
								{/* سطر بيانات الكاتب والوقت والنوع */}
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2 min-w-0">
										{/* الأفاتار الدائري الأزرق كما في الصورة المرجعية */}
										<div className="size-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-2xs">
											{initials || "أم"}
										</div>

										<div className="flex items-center gap-1.5 text-[11px] flex-wrap min-w-0">
											<span className="font-bold text-zinc-900 dark:text-zinc-100">
												{c.authorName || "عضو الفريق"}
											</span>
											<span className="text-zinc-300 dark:text-zinc-700">•</span>
											<span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
												طلب زيارة
											</span>
											<span className="text-zinc-300 dark:text-zinc-700">•</span>
											<span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
												{formatArabicRelativeTime(c.createdAt)}
											</span>
										</div>
									</div>

									{/* زر حذف التعليق المباشر عند تمرير المؤشر */}
									<button
										type="button"
										onClick={() => handleDeleteComment(c.id)}
										className="size-6 rounded flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
										title="حذف التعليق"
									>
										<IconTrash className="size-3.5" />
									</button>
								</div>

								{/* نص التعليق المعروض بوضوح تام */}
								<div className="mt-1.5 pr-8">
									<p className="text-[11px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap break-words">
										{c.body}
									</p>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* صندوق كتابة التعليق الجديد المطابق للصورة تماماً */}
			<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 space-y-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-2xs">
				<Textarea
					value={commentDraft}
					onChange={(e) => setCommentDraft(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSendComment();
						}
					}}
					placeholder="اكتب تعليقاً للفريق....."
					className="min-h-14 text-xs resize-none bg-transparent border-none shadow-none focus-visible:ring-0 p-1 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 leading-relaxed"
				/>

				{/* شريط الأدوات السفلي */}
				<div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80">
					{/* أيقونات المرفقات والرموز التعبيرية على اليمين كما بالصورة */}
					<div className="flex items-center gap-1 text-zinc-400">
						<button
							type="button"
							className="size-6 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
							title="رفع وسائط"
						>
							<IconArrowUp className="size-3.5" />
						</button>
						<button
							type="button"
							className="size-6 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
							title="رموز تعبيرية"
						>
							<IconMoodSmile className="size-3.5" />
						</button>
						<button
							type="button"
							className="size-6 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
							title="إشارة @"
						>
							<IconAt className="size-3.5" />
						</button>
						<button
							type="button"
							className="size-6 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
							title="إرفاق ملف"
						>
							<IconPaperclip className="size-3.5" />
						</button>
					</div>

					{/* زر الإرسال على اليسار مع مؤشر التحميل ودعم Enter */}
					<div className="flex items-center gap-2">
						<span className="text-[9.5px] text-zinc-400 hidden sm:inline-flex items-center gap-0.5">
							<span>Enter للإرسال</span>
							<IconCornerDownLeft className="size-2.5 opacity-70" />
						</span>
						<Button
							size="sm"
							className="h-7 text-xs px-3 gap-1.5 bg-primary text-primary-foreground font-semibold rounded-md shadow-2xs hover:bg-primary/90 transition-colors disabled:opacity-50"
							onClick={handleSendComment}
							disabled={addCommentMutation.isPending || !commentDraft.trim()}
						>
							{addCommentMutation.isPending ? (
								<>
									<IconLoader2 className="size-3 animate-spin" />
									<span>إرسال...</span>
								</>
							) : (
								<>
									<IconSend className="size-3" />
									<span>إرسال</span>
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

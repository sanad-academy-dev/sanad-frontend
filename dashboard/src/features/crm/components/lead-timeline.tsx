import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import {
	type CrmSubjectType,
	useAddLeadComment,
	useAddLeadNote,
	useAddLeadTask,
} from "@/features/crm/hooks/use-crm-activities";
import {
	useCrmEmailIdentity,
	useCrmEmailTemplates,
	useSendCrmEmail,
} from "@/features/crm/hooks/use-crm-email";
import { useCrmTimeline } from "@/features/crm/hooks/use-crm-timeline";
import {
	useCrmWhatsappSettings,
	useSendCrmWhatsapp,
} from "@/features/crm/hooks/use-crm-whatsapp";

/**
 * [CRM-P1] §8.3 — the unified timeline: status changes, notes, tasks, comments, email and
 * WhatsApp, with composer tabs.
 *
 * [CRM-P3] The merge moved to the SERVER. This component used to call four hooks and sort
 * the union in the browser, which could not paginate — the browser cannot know where page
 * two begins without first fetching every row of every type. It now reads one paginated
 * endpoint, and the entries arrive ready to render.
 */

const formatAt = (value: string | Date): string =>
	new Date(value).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" });

/**
 * [CRM-P2] `referenceType` — the §8.1 tables serve leads AND deals, so this component does
 * too. It stays named `LeadTimeline` because renaming it would touch the P1 screens for no
 * behavioural gain; the prop is what decides which subject it reads.
 */
export const LeadTimeline = ({
	leadId,
	referenceType = "LEAD",
}: {
	leadId: string;
	referenceType?: CrmSubjectType;
}) => {
	const { entries, isLoading, hasMore, loadMore, isLoadingMore } = useCrmTimeline(
		leadId,
		referenceType,
	);

	const { addNote, isAdding: isAddingNote } = useAddLeadNote(leadId, referenceType);
	const { addTask, isAdding: isAddingTask } = useAddLeadTask(leadId, referenceType);
	const { addComment, isAdding: isAddingComment } = useAddLeadComment(leadId, referenceType);
	const { templates } = useCrmEmailTemplates();
	const { identity } = useCrmEmailIdentity();
	const { sendEmail, isSending } = useSendCrmEmail(leadId, referenceType);
	const { settings: whatsappSettings } = useCrmWhatsappSettings();
	const { sendWhatsapp, isSending: isSendingWhatsapp } = useSendCrmWhatsapp(
		leadId,
		referenceType,
	);

	const [noteText, setNoteText] = useState("");
	const [commentText, setCommentText] = useState("");
	const [taskTitle, setTaskTitle] = useState("");
	const [templateId, setTemplateId] = useState<string>("");
	const [whatsappText, setWhatsappText] = useState("");

	return (
		<div className="space-y-4">
			<Tabs defaultValue="note">
				<TabsList>
					<TabsTrigger value="note">ملاحظة</TabsTrigger>
					<TabsTrigger value="task">مهمة</TabsTrigger>
					<TabsTrigger value="comment">تعليق</TabsTrigger>
					<TabsTrigger value="email">بريد</TabsTrigger>
					<TabsTrigger value="whatsapp">واتساب</TabsTrigger>
				</TabsList>

				<TabsContent
					value="note"
					className="space-y-2 pt-3"
				>
					<Textarea
						value={noteText}
						onChange={(event) => setNoteText(event.target.value)}
						placeholder="اكتب ملاحظة..."
						rows={3}
						disabled={isAddingNote}
					/>
					<Button
						size="sm"
						disabled={isAddingNote || noteText.trim().length === 0}
						onClick={async () => {
							await addNote({ content: noteText.trim() });
							setNoteText("");
						}}
					>
						إضافة ملاحظة
					</Button>
				</TabsContent>

				<TabsContent
					value="task"
					className="space-y-2 pt-3"
				>
					<Input
						value={taskTitle}
						onChange={(event) => setTaskTitle(event.target.value)}
						placeholder="عنوان المهمة"
						disabled={isAddingTask}
					/>
					<Button
						size="sm"
						disabled={isAddingTask || taskTitle.trim().length === 0}
						onClick={async () => {
							await addTask({ title: taskTitle.trim() });
							setTaskTitle("");
						}}
					>
						إضافة مهمة
					</Button>
				</TabsContent>

				<TabsContent
					value="comment"
					className="space-y-2 pt-3"
				>
					<Textarea
						value={commentText}
						onChange={(event) => setCommentText(event.target.value)}
						placeholder="اكتب تعليقًا..."
						rows={3}
						disabled={isAddingComment}
					/>
					<Button
						size="sm"
						disabled={isAddingComment || commentText.trim().length === 0}
						onClick={async () => {
							await addComment({ content: commentText.trim() });
							setCommentText("");
						}}
					>
						إضافة تعليق
					</Button>
				</TabsContent>

				{/* §9.1 — الإرسال بقالب. الهويّة معروضةٌ هنا لأنّ الظرف عالميّ: لا يُطلب من
				    المستخدم أن يرسل دون أن يعرف بأيّ اسمٍ تخرج رسالته وأين تعود الردود. */}
				<TabsContent
					value="email"
					className="space-y-2 pt-3"
				>
					<p className="text-[11px] text-muted-foreground">
						تُرسَل باسم «{identity?.fromName ?? "—"}»
						{identity?.replyTo ? (
							<> والردود إلى {identity.replyTo}</>
						) : (
							<span className="text-destructive"> — لا عنوان ردّ، فلن تصل ردود العملاء</span>
						)}
					</p>
					<Select
						value={templateId}
						onValueChange={setTemplateId}
					>
						<SelectTrigger className="w-full text-[12px]">
							<SelectValue placeholder="اختر قالبًا" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{templates.map((template) => (
								<SelectItem
									key={template.id}
									value={template.id}
								>
									{template.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						disabled={isSending || !templateId}
						onClick={async () => {
							await sendEmail({ templateId });
							setTemplateId("");
						}}
					>
						إرسال
					</Button>
					{templates.length === 0 ? (
						<p className="text-[11px] text-muted-foreground">
							لا توجد قوالب — أضِفها من «قوالب البريد».
						</p>
					) : null}
				</TabsContent>

				{/* §9.2 — نصّ حرّ لا قالب: البوّابة الكلاسيكيّة لا تفرض قوالب معتمَدة مسبقًا،
				    وهو سبب اختيارها على WABA. حالة القناة معروضةٌ قبل الإرسال لأنّ غير
				    المضبوطة تُسجّل «فشل الإرسال» بدل أن ترسل. */}
				<TabsContent
					value="whatsapp"
					className="space-y-2 pt-3"
				>
					{whatsappSettings && !whatsappSettings.configured ? (
						<p className="text-[11px] text-destructive">
							قناة واتساب غير مضبوطة — ستُسجَّل الرسالة بحالة «فشل الإرسال» ولن تصل. اضبطها من
							«واتساب» في إعدادات إدارة العملاء.
						</p>
					) : null}
					<Textarea
						value={whatsappText}
						onChange={(event) => setWhatsappText(event.target.value)}
						placeholder="اكتب رسالة واتساب..."
						rows={3}
						disabled={isSendingWhatsapp}
					/>
					<Button
						size="sm"
						disabled={isSendingWhatsapp || whatsappText.trim().length === 0}
						onClick={async () => {
							await sendWhatsapp({ body: whatsappText.trim() });
							setWhatsappText("");
						}}
					>
						إرسال
					</Button>
				</TabsContent>
			</Tabs>

			<ol className="space-y-3 border-s ps-4">
				{isLoading ? (
					<p className="text-[12px] text-muted-foreground">جارٍ التحميل...</p>
				) : null}
				{!isLoading && entries.length === 0 ? (
					<p className="text-[12px] text-muted-foreground">لا يوجد نشاط بعد</p>
				) : null}
				{entries.map((entry) => (
					<li
						key={entry.id}
						className="relative"
					>
						<span
							className="absolute -start-[21px] top-1.5 size-2 rounded-full bg-border"
							aria-hidden
						/>
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-[12px] font-semibold">{entry.title}</span>
							{entry.kind === "status" && entry.meta ? (
								<LeadStatusPill
									name={entry.meta}
									color={null}
									className="border-dashed"
								/>
							) : null}
							<span className="ms-auto text-[11px] text-muted-foreground">
								{formatAt(entry.at)}
							</span>
						</div>
						{entry.body ? (
							<p className="mt-1 whitespace-pre-wrap text-[12px] text-muted-foreground">
								{entry.body}
							</p>
						) : null}
						{entry.author ? (
							<p className="mt-1 text-[11px] text-muted-foreground">{entry.author}</p>
						) : null}
					</li>
				))}
			</ol>

			{/* [CRM-P3] صار ممكنًا حين انتقل الدمج إلى الخادم: الخيط الطويل يُقرأ صفحةً صفحة */}
			{hasMore ? (
				<Button
					variant="outline"
					size="sm"
					className="w-full text-[12px]"
					disabled={isLoadingMore}
					onClick={() => void loadMore()}
				>
					{isLoadingMore ? "جارٍ التحميل..." : "عرض المزيد"}
				</Button>
			) : null}
		</div>
	);
};

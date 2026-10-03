import { IconArrowUp, IconAt, IconMoodSmile, IconPaperclip } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { EmojiPicker } from "@/features/messages/components/emoji-picker";
import type { ChatMember } from "@/features/messages/types/messages.type";

/** الحد الأقصى لحجم المرفق — مطابق لحد الخادم في chat.model */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * صندوق كتابة الرسالة: Enter يرسل (Shift+Enter سطر جديد)، وشريط أدوات
 * فعّال — إرسال، رموز تعبيرية، إشارة لعضو، وإرفاق ملف (الروابط داخل النص
 * تُكتشف تلقائيًا وتُعرض قابلة للنقر).
 */
export function MessageComposer({
	members,
	onSend,
	onUpload,
}: {
	/** أعضاء المحادثة — قائمة الإشارة @ */
	members: ChatMember[];
	onSend: (body: string) => void;
	/** رفع ملف كرسالة مرفق */
	onUpload: (file: File) => void;
}) {
	const [value, setValue] = useState("");
	const [emojiOpen, setEmojiOpen] = useState(false);
	const [mentionOpen, setMentionOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const canSend = value.trim().length > 0;

	const send = () => {
		if (!canSend) return;
		onSend(value);
		setValue("");
		textareaRef.current?.focus();
	};

	/** إدراج نص عند موضع المؤشر مع إبقاء التركيز */
	const insertAtCursor = (text: string) => {
		const el = textareaRef.current;
		if (!el) {
			setValue((v) => v + text);
			return;
		}
		const start = el.selectionStart ?? value.length;
		const end = el.selectionEnd ?? value.length;
		const next = value.slice(0, start) + text + value.slice(end);
		setValue(next);
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(start + text.length, start + text.length);
		});
	};

	const pickFile = (file: File | null) => {
		if (!file) return;
		if (file.size > MAX_FILE_BYTES) return; // الخادم يرفضه أيضًا — طفرة الرفع تعرض الخطأ
		onUpload(file);
	};

	return (
		<div className="shrink-0 p-3">
			<div className="rounded-[6px] border bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:shadow-sm">
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						// Enter يرسل — Shift+Enter سطر جديد
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							send();
						}
					}}
					rows={2}
					placeholder="اكتب رسالتك..."
					className="min-h-[44px] w-full resize-none bg-transparent px-3 pt-2.5 text-[13px] leading-5 text-foreground outline-none placeholder:text-muted-foreground"
				/>

				{/* شريط الأدوات — يبدأ من اليسار كما في التصميم */}
				<TooltipProvider delayDuration={400}>
					<div
						dir="ltr"
						className="flex items-center gap-1 border-t bg-muted/30 px-2 py-1.5"
					>
						{/* الإرسال */}
						<Button
							type="button"
							size="icon"
							onClick={send}
							disabled={!canSend}
							aria-label="إرسال (Enter)"
							className="rounded-full"
						>
							<IconArrowUp className="size-4" />
						</Button>

						<span className="mx-1 h-5 w-px bg-border" />

						{/* رموز تعبيرية */}
						<Popover
							open={emojiOpen}
							onOpenChange={setEmojiOpen}
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<PopoverTrigger asChild>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label="رمز تعبيري"
											className="text-muted-foreground"
										>
											<IconMoodSmile className="size-4" />
										</Button>
									</PopoverTrigger>
								</TooltipTrigger>
								<TooltipContent>رمز تعبيري</TooltipContent>
							</Tooltip>
							<PopoverContent
								align="start"
								className="w-auto p-0"
							>
								<EmojiPicker onPick={(emoji) => insertAtCursor(emoji)} />
							</PopoverContent>
						</Popover>

						{/* إشارة إلى عضو */}
						<Popover
							open={mentionOpen}
							onOpenChange={setMentionOpen}
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<PopoverTrigger asChild>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											aria-label="إشارة إلى عضو"
											className="text-muted-foreground"
										>
											<IconAt className="size-4" />
										</Button>
									</PopoverTrigger>
								</TooltipTrigger>
								<TooltipContent>إشارة إلى عضو</TooltipContent>
							</Tooltip>
							<PopoverContent
								align="start"
								dir="rtl"
								className="w-56 p-1"
							>
								{members.length === 0 ? (
									<p className="px-2 py-3 text-center text-[12px] text-muted-foreground">
										لا يوجد أعضاء
									</p>
								) : (
									members.map((member) => (
										<button
											key={member.id}
											type="button"
											onClick={() => {
												insertAtCursor(`@${member.name} `);
												setMentionOpen(false);
											}}
											className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-start transition-colors hover:bg-muted"
										>
											<ChatAvatar
												name={member.name}
												online={member.online}
												size={24}
											/>
											<span className="truncate text-[13px]">{member.name}</span>
										</button>
									))
								)}
							</PopoverContent>
						</Popover>

						{/* إرفاق ملف — يُرسل كرسالة مرفق (حتى 10 م.ب) */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label="إرفاق ملف"
									className="text-muted-foreground"
									onClick={() => fileInputRef.current?.click()}
								>
									<IconPaperclip className="size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>إرفاق ملف (حتى 10 م.ب)</TooltipContent>
						</Tooltip>
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							onChange={(e) => {
								pickFile(e.target.files?.[0] ?? null);
								e.target.value = "";
							}}
						/>
					</div>
				</TooltipProvider>
			</div>
		</div>
	);
}

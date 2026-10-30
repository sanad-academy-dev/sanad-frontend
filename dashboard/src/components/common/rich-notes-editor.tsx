import {
	IconBold,
	IconCheck,
	IconChevronDown,
	IconClearFormatting,
	IconCode,
	IconCopy,
	IconItalic,
	IconLink,
	IconList,
	IconQuote,
	IconStrikethrough,
	IconTerminal2,
	IconUnderline,
} from "@tabler/icons-react";
import {
	type ChangeEvent,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface RichNotesEditorProps {
	/** قيمة النص الحالي */
	value?: string;
	/** دالة التحديث عند تغيير المحتوى */
	onChange?: (value: string) => void;
	/** النص الإرشادي الفارغ */
	placeholder?: string;
	/** كلاسات مخصصة */
	className?: string;
	/** شكل الحدود: علوي فقط (border-top-only) أو محاط كامل (bordered) أو بدون حدود (ghost) */
	variant?: "border-top-only" | "bordered" | "ghost";
	/** الحد الأدنى لارتفاع مساحة الكتابة */
	minHeight?: number | string;
	/** هل المحرر للقراءة فقط */
	readOnly?: boolean;
	/** تعطيل المحرر */
	disabled?: boolean;
	/** معرف الحقل */
	id?: string;
	/** اسم الحقل */
	name?: string;
	/** محاذاة النص */
	dir?: "rtl" | "ltr";
}

/**
 * محرر ملاحظات ونصوص غني موحّد للمنصة:
 * - يدعم شريط أدوات عائم (Aa, B, I, S, U, روابط, اقتباس, أكواد, قوائم, نسخ)
 * - يدعم نمط الحدود العلوية فقط (مفيش أي بوردر يمين أو شمال أو تحت)
 * - متوافق مع نصوص Markdown وPlain text
 * - قابل لإعادة الاستخدام في كافة الشاشات والنوافذ المنبثقة
 */
export function RichNotesEditor({
	value = "",
	onChange,
	placeholder = "أضف ملاحظات أو تفاصيل هنا...",
	className,
	variant = "border-top-only",
	minHeight = 90,
	readOnly = false,
	disabled = false,
	id,
	name,
	dir = "rtl",
}: RichNotesEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [copied, setCopied] = useState(false);

	// تطبيق التعديل التنسيقي على التحديد الحالي في textarea
	const applyFormat = useCallback(
		(
			prefix: string,
			suffix = "",
			placeholderText = "",
			mode: "wrap" | "line" | "replace" = "wrap",
		) => {
			const textarea = textareaRef.current;
			if (!textarea || readOnly || disabled) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;
			const selectedText = text.substring(start, end);

			let newText = text;
			let newCursorStart = start;
			let newCursorEnd = end;

			if (mode === "line") {
				// تنسيق بداية السطر الحالي (مثل العناوين والاقتباس والقوائم)
				const lastNewline = text.lastIndexOf("\n", start - 1);
				const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
				const nextNewline = text.indexOf("\n", end);
				const lineEnd = nextNewline === -1 ? text.length : nextNewline;
				const currentLine = text.substring(lineStart, lineEnd);

				// إزالة أي بادئات سابقة لو كان نفس النمط أو تنظيف
				const cleanedLine = currentLine.replace(/^(#{1,3}\s*|>\s*|-\s*|\d+\.\s*)/, "");
				const formattedLine = `${prefix}${cleanedLine}`;

				newText = text.substring(0, lineStart) + formattedLine + text.substring(lineEnd);
				newCursorStart = lineStart + prefix.length;
				newCursorEnd = lineStart + formattedLine.length;
			} else if (mode === "replace") {
				const replacement = prefix;
				newText = text.substring(0, start) + replacement + text.substring(end);
				newCursorStart = start + replacement.length;
				newCursorEnd = newCursorStart;
			} else {
				// وضع الالتفاف wrap: فحص إذا كان النص المحدد ملفوفاً بالفعل لإلغاء التنسيق
				const hasWrapper =
					selectedText.startsWith(prefix) && (suffix ? selectedText.endsWith(suffix) : true);

				if (hasWrapper) {
					// إزالة التنسيق (Unwrap)
					const unwrapped = selectedText.slice(
						prefix.length,
						suffix ? -suffix.length : undefined,
					);
					newText = text.substring(0, start) + unwrapped + text.substring(end);
					newCursorStart = start;
					newCursorEnd = start + unwrapped.length;
				} else {
					// تطبيق التنسيق
					const contentToWrap = selectedText || placeholderText;
					const wrapped = `${prefix}${contentToWrap}${suffix}`;
					newText = text.substring(0, start) + wrapped + text.substring(end);
					newCursorStart = start + prefix.length;
					newCursorEnd = newCursorStart + contentToWrap.length;
				}
			}

			onChange?.(newText);

			// إعادة التركيز وتحديد النص التنسيقي
			requestAnimationFrame(() => {
				textarea.focus();
				textarea.setSelectionRange(newCursorStart, newCursorEnd);
			});
		},
		[onChange, readOnly, disabled],
	);

	// إزالة كافة التنسيقات من التحديد
	const handleClearFormatting = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea || readOnly || disabled) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const selectedText = text.substring(start, end);

		if (!selectedText) return;

		// تنظيف markdown وعلامات html الأساسية
		const cleaned = selectedText
			.replace(/\*\*(.*?)\*\*/g, "$1")
			.replace(/\*(.*?)\*/g, "$1")
			.replace(/~~(.*?)~~/g, "$1")
			.replace(/<u>(.*?)<\/u>/gi, "$1")
			.replace(/`{1,3}(.*?)`{1,3}/gs, "$1")
			.replace(/^#{1,6}\s+/gm, "")
			.replace(/^>\s+/gm, "")
			.replace(/^-\s+/gm, "")
			.replace(/\[(.*?)\]\(.*?\)/g, "$1");

		const newText = text.substring(0, start) + cleaned + text.substring(end);
		onChange?.(newText);

		requestAnimationFrame(() => {
			textarea.focus();
			textarea.setSelectionRange(start, start + cleaned.length);
		});
	}, [onChange, readOnly, disabled]);

	// نسخ النص للحافظة
	const handleCopy = useCallback(async () => {
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			toast.success("تم نسخ الملاحظات إلى الحافظة");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("تعذر نسخ النص");
		}
	}, [value]);

	// اختصارات لوحة المفاتيح الشائعة
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key === "b" || e.key === "B") {
					e.preventDefault();
					applyFormat("**", "**", "نص عريض");
				} else if (e.key === "i" || e.key === "I") {
					e.preventDefault();
					applyFormat("*", "*", "نص مائل");
				} else if (e.key === "u" || e.key === "U") {
					e.preventDefault();
					applyFormat("<u>", "</u>", "نص مسطر");
				} else if (e.key === "k" || e.key === "K") {
					e.preventDefault();
					applyFormat("[", "](https://)", "رابط");
				}
			}
		},
		[applyFormat],
	);

	// كلاسات الحاوية بناءً على variant
	const containerStyles = cn(
		"w-full transition-colors",
		variant === "border-top-only" &&
			"border-t border-border border-x-0 border-b-0 rounded-none bg-transparent pt-2.5 pb-4 px-4 sm:px-5",
		variant === "bordered" && "rounded-lg border border-border bg-card p-3 shadow-2xs",
		variant === "ghost" && "border-none bg-transparent p-2",
		className,
	);

	return (
		<div
			className={containerStyles}
			dir={dir}
		>
			{/* شريط الأدوات العائم بالأعلى جهة اليمين (مطابق للصورة) */}
			{!readOnly && (
				<div className="flex items-center justify-end mb-2">
					<div className="flex items-center gap-0.5 rounded-lg border border-border/80 bg-background/95 backdrop-blur-xs px-1.5 py-1 shadow-2xs">
						{/* 1. قائمة حجم ونمط الخط (Aa) */}
						<DropdownMenu
							dir={dir}
							modal={false}
						>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									disabled={disabled}
									className="h-7 px-1.5 gap-0.5 rounded flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer outline-none"
									title="أنماط النصوص والعناوين"
								>
									<span>Aa</span>
									<IconChevronDown className="size-3 opacity-60" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-36 text-xs"
							>
								<DropdownMenuItem
									onClick={() => applyFormat("", "", "", "line")}
									className="cursor-pointer text-xs"
								>
									نص عادي
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applyFormat("# ", "", "", "line")}
									className="cursor-pointer text-xs font-bold"
								>
									عنوان رئيسي (H1)
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applyFormat("## ", "", "", "line")}
									className="cursor-pointer text-xs font-semibold"
								>
									عنوان فرعي (H2)
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applyFormat("### ", "", "", "line")}
									className="cursor-pointer text-xs font-medium"
								>
									عنوان صغير (H3)
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* 2. عريض Bold */}
						<ToolbarButton
							onClick={() => applyFormat("**", "**", "نص عريض")}
							disabled={disabled}
							title="عريض (Ctrl+B)"
						>
							<IconBold className="size-3.5 stroke-[2.4]" />
						</ToolbarButton>

						{/* 3. مائل Italic */}
						<ToolbarButton
							onClick={() => applyFormat("*", "*", "نص مائل")}
							disabled={disabled}
							title="مائل (Ctrl+I)"
						>
							<IconItalic className="size-3.5" />
						</ToolbarButton>

						{/* 4. مشطوب Strikethrough */}
						<ToolbarButton
							onClick={() => applyFormat("~~", "~~", "نص مشطوب")}
							disabled={disabled}
							title="مشطوب"
						>
							<IconStrikethrough className="size-3.5" />
						</ToolbarButton>

						{/* 5. مسطر Underline */}
						<ToolbarButton
							onClick={() => applyFormat("<u>", "</u>", "نص مسطر")}
							disabled={disabled}
							title="مسطر (Ctrl+U)"
						>
							<IconUnderline className="size-3.5" />
						</ToolbarButton>

						{/* 6. رابط Link */}
						<ToolbarButton
							onClick={() => applyFormat("[", "](https://)", "رابط")}
							disabled={disabled}
							title="إدراج رابط (Ctrl+K)"
						>
							<IconLink className="size-3.5" />
						</ToolbarButton>

						{/* 7. اقتباس Quote */}
						<ToolbarButton
							onClick={() => applyFormat("> ", "", "", "line")}
							disabled={disabled}
							title="اقتباس"
						>
							<IconQuote className="size-3.5" />
						</ToolbarButton>

						{/* 8. مسح التنسيق Clear Formatting */}
						<ToolbarButton
							onClick={handleClearFormatting}
							disabled={disabled}
							title="إلغاء التنسيق المحدد"
						>
							<IconClearFormatting className="size-3.5" />
						</ToolbarButton>

						{/* 9. كود برمجي مضمن Inline Code */}
						<ToolbarButton
							onClick={() => applyFormat("`", "`", "code")}
							disabled={disabled}
							title="كود مضمن"
						>
							<IconCode className="size-3.5" />
						</ToolbarButton>

						{/* 10. كتلة كود Code Block */}
						<ToolbarButton
							onClick={() => applyFormat("```\n", "\n```", "code")}
							disabled={disabled}
							title="كتلة كود برمجية"
						>
							<IconTerminal2 className="size-3.5" />
						</ToolbarButton>

						{/* 11. قائمة نقطية Bullet List */}
						<ToolbarButton
							onClick={() => applyFormat("- ", "", "", "line")}
							disabled={disabled}
							title="قائمة نقطية"
						>
							<IconList className="size-3.5" />
						</ToolbarButton>

						{/* فاصل رأسي */}
						<div className="h-4 w-px bg-border/80 mx-0.5" />

						{/* 12. نسخ المحتوى Copy */}
						<ToolbarButton
							onClick={handleCopy}
							disabled={disabled || !value}
							title="نسخ الملاحظات"
						>
							{copied ? (
								<IconCheck className="size-3.5 text-primary" />
							) : (
								<IconCopy className="size-3.5" />
							)}
						</ToolbarButton>
					</div>
				</div>
			)}

			{/* مساحة كتابة الملاحظات (بدون أي حدود داخلية أو حلقات تركيز مزعجة) */}
			<textarea
				ref={textareaRef}
				id={id}
				name={name}
				value={value}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				readOnly={readOnly}
				disabled={disabled}
				dir={dir}
				style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
				className={cn(
					"w-full bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none shadow-none resize-none",
					"text-xs sm:text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 font-sans text-right",
					"disabled:cursor-not-allowed disabled:opacity-50",
				)}
			/>
		</div>
	);
}

/** زر شريط الأدوات الصغير */
function ToolbarButton({
	children,
	onClick,
	disabled,
	title,
}: {
	children: ReactNode;
	onClick: () => void;
	disabled?: boolean;
	title: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className="size-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none"
		>
			{children}
		</button>
	);
}

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
	IconListNumbers,
	IconQuote,
	IconStrikethrough,
	IconTerminal2,
	IconUnderline,
} from "@tabler/icons-react";
import type {
	FocusEvent as ReactFocusEvent,
	MouseEvent as ReactMouseEvent,
	ReactNode,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface RichNotesEditorProps {
	/** قيمة النص أو محتوى HTML الحالي */
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
	/** إظهار شريط الأدوات دائماً (افتراضياً: يظهر فقط عند الكتابة والتفاعل) */
	alwaysShowToolbar?: boolean;
}

/**
 * تحويل نصوص الماركداون القديمة أو النصوص العادية إلى HTML متوافق للعرض الفوري
 */
function parseInitialContent(val: string): string {
	if (!val) return "";
	// إذا كان النص بالفعل بتنسيق HTML
	if (/<[a-z][\s\S]*>/i.test(val)) {
		return val;
	}
	// تحويل نصوص الماركداون الشائعة إلى عناصر HTML حقيقية
	let html = val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

	html = html
		.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
		.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<i>$1</i>")
		.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/gi, "<u>$1</u>")
		.replace(/~~(.*?)~~/g, "<s>$1</s>")
		.replace(
			/`([^`]+)`/g,
			'<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">$1</code>',
		)
		.replace(/\r\n|\n/g, "<br>");

	return html;
}

/**
 * محرر نصوص وملاحظات تفاعلي مرئي (WYSIWYG مثل مايكروسوفت وورد تماماً):
 * - يظهر شريط التنسيق بسلاسة عند البدء في الكتابة أو التركيز على الحقل
 * - يظهر الخط العريض (Bold) والمائل والمسطر مباشرة أثناء الكتابة
 * - شريط أدوات عائم يدعم تفعيل وإلغاء الأنماط بنقرة زر أو باختصارات الكيبورد (Ctrl+B, Ctrl+I, Ctrl+U)
 * - يدعم بوردر علوي فقط وبدون أي بوردر يمين أو شمال أو أسفل
 * - زر نسخ الملاحظات بنقرة واحدة
 */
export function RichNotesEditor({
	value = "",
	onChange,
	placeholder = "أضف ملاحظات أو تفاصيل لهذا الفصل...",
	className,
	variant = "border-top-only",
	minHeight = 90,
	readOnly = false,
	disabled = false,
	id,
	dir = "rtl",
	alwaysShowToolbar = false,
}: RichNotesEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const isTypingRef = useRef(false);
	const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// حالات التفاعل لإظهار شريط الأدوات عند الكتابة
	const [isFocused, setIsFocused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [isEmpty, setIsEmpty] = useState(true);
	const [copied, setCopied] = useState(false);

	// حالات الأزرار النشطة (تضيء عند تواجد المؤشر على نص منسق مثل Word)
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrike, setIsStrike] = useState(false);
	const [isList, setIsList] = useState(false);
	const [isOrderedList, setIsOrderedList] = useState(false);
	const [isBlockquote, setIsBlockquote] = useState(false);
	const [currentHeading, setCurrentHeading] = useState<string>("p");

	// فحص ما إذا كان المحرر فارغاً لإظهار الـ Placeholder
	const checkIsEmpty = useCallback(() => {
		if (!editorRef.current) return;
		const text = editorRef.current.innerText || "";
		setIsEmpty(text.trim() === "");
	}, []);

	// تحديث حالات الأزرار النشطة بناءً على موقع المؤشر والتحديد الحالي
	const updateActiveStates = useCallback(() => {
		if (typeof document === "undefined" || !editorRef.current) return;
		try {
			setIsBold(document.queryCommandState("bold"));
			setIsItalic(document.queryCommandState("italic"));
			setIsUnderline(document.queryCommandState("underline"));
			setIsStrike(document.queryCommandState("strikeThrough"));
			setIsList(document.queryCommandState("insertUnorderedList"));
			setIsOrderedList(document.queryCommandState("insertOrderedList"));

			// فحص الكتلة الحالية (H1, H2, H3, Blockquote)
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				let node: Node | null = selection.anchorNode;
				let heading = "p";
				let inQuote = false;
				while (node && node !== editorRef.current) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const tag = (node as HTMLElement).tagName.toLowerCase();
						if (["h1", "h2", "h3"].includes(tag)) heading = tag;
						if (tag === "blockquote") inQuote = true;
					}
					node = node.parentNode;
				}
				setCurrentHeading(heading);
				setIsBlockquote(inQuote);
			}
		} catch {
			// تجاهل أي استثناءات تحديد
		}
	}, []);

	// مزامنة القيمة الخارجية الأولية أو عند تغييرها من الخارج بدون تشويش المؤشر
	useEffect(() => {
		if (!editorRef.current) return;
		if (isTypingRef.current) return;

		const parsed = parseInitialContent(value);
		if (editorRef.current.innerHTML !== parsed) {
			editorRef.current.innerHTML = parsed;
			checkIsEmpty();
		}
	}, [value, checkIsEmpty]);

	// متابعة تغيير التحديد في المتصفح لتحديث حالة الأزرار النشطة تلقائياً
	useEffect(() => {
		const handleSelectionChange = () => {
			if (document.activeElement === editorRef.current) {
				updateActiveStates();
			}
		};
		document.addEventListener("selectionchange", handleSelectionChange);
		return () => document.removeEventListener("selectionchange", handleSelectionChange);
	}, [updateActiveStates]);

	// تنظيف المؤقت عند إلغاء التركيب
	useEffect(() => {
		return () => {
			if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
		};
	}, []);

	// التعامل مع التركيز Focus
	const handleFocus = useCallback(() => {
		if (blurTimerRef.current) {
			clearTimeout(blurTimerRef.current);
			blurTimerRef.current = null;
		}
		setIsFocused(true);
		updateActiveStates();
	}, [updateActiveStates]);

	// التعامل مع فقد التركيز Blur بسلاسة دون اختفاء فجائي
	const handleBlur = useCallback(
		(e: ReactFocusEvent) => {
			if (isMenuOpen) return;

			const related = e.relatedTarget as Node | null;
			if (containerRef.current && related && containerRef.current.contains(related)) {
				return;
			}

			blurTimerRef.current = setTimeout(() => {
				if (!isMenuOpen && document.activeElement !== editorRef.current) {
					setIsFocused(false);
				}
			}, 150);
		},
		[isMenuOpen],
	);

	// التعامل مع الإدخال وتحديث القيمة
	const handleInput = useCallback(() => {
		if (!editorRef.current) return;
		isTypingRef.current = true;
		checkIsEmpty();
		updateActiveStates();

		const content = editorRef.current.innerHTML;
		const isEffectivelyEmpty =
			editorRef.current.innerText.trim() === "" &&
			!content.includes("<img") &&
			!content.includes("<hr");

		onChange?.(isEffectivelyEmpty ? "" : content);

		setTimeout(() => {
			isTypingRef.current = false;
		}, 100);
	}, [onChange, checkIsEmpty, updateActiveStates]);

	// تنفيذ أمر التنسيق المباشر (WYSIWYG execCommand)
	const exec = useCallback(
		(command: string, arg?: string) => {
			if (readOnly || disabled || !editorRef.current) return;
			editorRef.current.focus();
			document.execCommand(command, false, arg);
			handleInput();
			updateActiveStates();
		},
		[readOnly, disabled, handleInput, updateActiveStates],
	);

	// إدراج أو تعديل رابط
	const handleLink = useCallback(() => {
		if (readOnly || disabled || !editorRef.current) return;
		const selection = window.getSelection();
		const currentText = selection?.toString() || "";
		const url = window.prompt("أدخل رابط URL (مثال: https://example.com):", "https://");
		if (url) {
			if (!currentText) {
				exec(
					"insertHTML",
					`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
				);
			} else {
				exec("createLink", url);
			}
		}
	}, [readOnly, disabled, exec]);

	// كود برمجي مضمن
	const handleInlineCode = useCallback(() => {
		if (readOnly || disabled || !editorRef.current) return;
		const selection = window.getSelection();
		const selected = selection?.toString() || "كود";
		exec(
			"insertHTML",
			`<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] text-foreground border border-border/40">${selected}</code>`,
		);
	}, [readOnly, disabled, exec]);

	// كتلة كود كاملة
	const handleCodeBlock = useCallback(() => {
		if (readOnly || disabled || !editorRef.current) return;
		const selection = window.getSelection();
		const selected = selection?.toString() || "كود برمجي هنا...";
		exec(
			"insertHTML",
			`<pre class="bg-muted/40 p-2.5 rounded-md font-mono text-xs overflow-x-auto my-1.5 border border-border/60"><code>${selected}</code></pre>`,
		);
	}, [readOnly, disabled, exec]);

	// اقتباس
	const handleQuote = useCallback(() => {
		if (isBlockquote) {
			exec("formatBlock", "<p>");
		} else {
			exec("formatBlock", "<blockquote>");
		}
	}, [isBlockquote, exec]);

	// إزالة كافة التنسيقات
	const handleClearFormatting = useCallback(() => {
		exec("removeFormat");
		exec("formatBlock", "<p>");
	}, [exec]);

	// نسخ النص للحافظة
	const handleCopy = useCallback(async () => {
		if (!editorRef.current) return;
		const text = editorRef.current.innerText.trim();
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("تم نسخ الملاحظات إلى الحافظة");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("تعذر نسخ النص");
		}
	}, []);

	// حالة ظهور شريط التنسيق: عند الكتابة أو التركيز على الحقل أو التحويم
	const showToolbar =
		!readOnly && !disabled && (alwaysShowToolbar || isFocused || isMenuOpen || isHovered);

	// كلاسات الحاوية بناءً على variant
	const containerStyles = cn(
		"relative w-full transition-colors",
		variant === "border-top-only" &&
			"border-t border-border border-x-0 border-b-0 rounded-none bg-transparent pt-2.5 pb-4 px-4 sm:px-5",
		variant === "bordered" && "rounded-lg border border-border bg-card p-3 shadow-2xs",
		variant === "ghost" && "border-none bg-transparent p-2",
		className,
	);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: mouse enter/leave toggles toolbar visibility on hover
		<div
			ref={containerRef}
			className={containerStyles}
			dir={dir}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* شريط الأدوات العائم بالأعلى جهة اليمين — يظهر بسلاسة عند الكتابة في الحقل */}
			{!readOnly && (
				<div
					className={cn(
						"flex items-center justify-end transition-all duration-200 ease-out",
						showToolbar
							? "opacity-100 translate-y-0 max-h-12 mb-2.5 pointer-events-auto"
							: "opacity-0 -translate-y-1 max-h-0 mb-0 overflow-hidden pointer-events-none",
					)}
				>
					<div className="flex items-center gap-0.5 rounded-lg border border-border/80 bg-background/95 backdrop-blur-xs px-1.5 py-1 shadow-2xs select-none">
						{/* 1. قائمة نمط وحجم الخط (Aa ▾) */}
						<DropdownMenu
							dir={dir}
							modal={false}
							open={isMenuOpen}
							onOpenChange={(open) => {
								setIsMenuOpen(open);
								if (open) setIsFocused(true);
							}}
						>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									disabled={disabled}
									onMouseDown={(e) => e.preventDefault()}
									className={cn(
										"h-7 px-1.5 gap-0.5 rounded flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer outline-none",
										currentHeading !== "p"
											? "bg-primary/15 text-primary border border-primary/30 font-bold"
											: "text-muted-foreground hover:text-foreground hover:bg-muted/80",
									)}
									title="أنماط النصوص والعناوين"
								>
									<span>Aa</span>
									<IconChevronDown className="size-3 opacity-60" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-40 text-xs"
							>
								<DropdownMenuItem
									onClick={() => exec("formatBlock", "<p>")}
									className="cursor-pointer text-xs flex items-center justify-between"
								>
									<span>نص عادي</span>
									{currentHeading === "p" && <IconCheck className="size-3.5 text-primary" />}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => exec("formatBlock", "<h1>")}
									className="cursor-pointer text-xs font-bold flex items-center justify-between"
								>
									<span>عنوان رئيسي (H1)</span>
									{currentHeading === "h1" && <IconCheck className="size-3.5 text-primary" />}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => exec("formatBlock", "<h2>")}
									className="cursor-pointer text-xs font-semibold flex items-center justify-between"
								>
									<span>عنوان فرعي (H2)</span>
									{currentHeading === "h2" && <IconCheck className="size-3.5 text-primary" />}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => exec("formatBlock", "<h3>")}
									className="cursor-pointer text-xs font-medium flex items-center justify-between"
								>
									<span>عنوان صغير (H3)</span>
									{currentHeading === "h3" && <IconCheck className="size-3.5 text-primary" />}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* 2. عريض Bold (تظهر الكلمات عريضة مباشرة مثل الوورد) */}
						<ToolbarButton
							onClick={() => exec("bold")}
							active={isBold}
							disabled={disabled}
							title="عريض (Ctrl+B)"
						>
							<IconBold className="size-3.5 stroke-[2.6]" />
						</ToolbarButton>

						{/* 3. مائل Italic */}
						<ToolbarButton
							onClick={() => exec("italic")}
							active={isItalic}
							disabled={disabled}
							title="مائل (Ctrl+I)"
						>
							<IconItalic className="size-3.5" />
						</ToolbarButton>

						{/* 4. مشطوب Strikethrough */}
						<ToolbarButton
							onClick={() => exec("strikeThrough")}
							active={isStrike}
							disabled={disabled}
							title="مشطوب"
						>
							<IconStrikethrough className="size-3.5" />
						</ToolbarButton>

						{/* 5. مسطر Underline */}
						<ToolbarButton
							onClick={() => exec("underline")}
							active={isUnderline}
							disabled={disabled}
							title="مسطر (Ctrl+U)"
						>
							<IconUnderline className="size-3.5" />
						</ToolbarButton>

						{/* 6. رابط Link */}
						<ToolbarButton
							onClick={handleLink}
							disabled={disabled}
							title="إدراج رابط"
						>
							<IconLink className="size-3.5" />
						</ToolbarButton>

						{/* 7. اقتباس Quote */}
						<ToolbarButton
							onClick={handleQuote}
							active={isBlockquote}
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
							onClick={handleInlineCode}
							disabled={disabled}
							title="كود مضمن"
						>
							<IconCode className="size-3.5" />
						</ToolbarButton>

						{/* 10. كتلة كود كاملة Code Block */}
						<ToolbarButton
							onClick={handleCodeBlock}
							disabled={disabled}
							title="كتلة كود برمجية"
						>
							<IconTerminal2 className="size-3.5" />
						</ToolbarButton>

						{/* 11. قائمة نقطية Bullet List */}
						<ToolbarButton
							onClick={() => exec("insertUnorderedList")}
							active={isList}
							disabled={disabled}
							title="قائمة نقطية"
						>
							<IconList className="size-3.5" />
						</ToolbarButton>

						{/* قائمة رقمية Numbered List */}
						<ToolbarButton
							onClick={() => exec("insertOrderedList")}
							active={isOrderedList}
							disabled={disabled}
							title="قائمة رقمية"
						>
							<IconListNumbers className="size-3.5" />
						</ToolbarButton>

						{/* فاصل رأسي */}
						<div className="h-4 w-px bg-border/80 mx-0.5" />

						{/* 12. نسخ المحتوى Copy */}
						<ToolbarButton
							onClick={handleCopy}
							disabled={disabled || isEmpty}
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

			{/* مساحة التحرير المرئية الحقيقية (WYSIWYG ContentEditable مثل برنامج Word) */}
			<div className="relative w-full">
				{isEmpty && (
					<div
						className="absolute top-0 right-0 pointer-events-none select-none text-xs sm:text-[13px] text-muted-foreground/60 leading-relaxed font-sans text-right"
						dir={dir}
					>
						{placeholder}
					</div>
				)}

				{/* biome-ignore lint/a11y/useSemanticElements: contenteditable element acts as a rich WYSIWYG editor */}
				<div
					ref={editorRef}
					id={id}
					role="textbox"
					tabIndex={0}
					aria-multiline="true"
					contentEditable={!readOnly && !disabled}
					suppressContentEditableWarning={true}
					onInput={handleInput}
					onKeyUp={updateActiveStates}
					onMouseUp={updateActiveStates}
					onFocus={handleFocus}
					onBlur={handleBlur}
					dir={dir}
					style={{
						minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
					}}
					className={cn(
						"w-full bg-transparent border-none outline-none ring-0 shadow-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0",
						"text-xs sm:text-[13px] leading-relaxed text-foreground font-sans text-right cursor-text",
						"[&_b]:font-bold [&_strong]:font-bold",
						"[&_i]:italic [&_em]:italic",
						"[&_u]:underline [&_u]:underline-offset-2",
						"[&_s]:line-through [&_strike]:line-through [&_s]:opacity-80",
						"[&_h1]:text-base [&_h1]:sm:text-lg [&_h1]:font-bold [&_h1]:my-1.5 [&_h1]:leading-snug",
						"[&_h2]:text-sm [&_h2]:sm:text-base [&_h2]:font-bold [&_h2]:my-1.5 [&_h2]:leading-snug",
						"[&_h3]:text-xs [&_h3]:sm:text-sm [&_h3]:font-semibold [&_h3]:my-1 [&_h3]:leading-snug",
						"[&_blockquote]:border-r-2 [&_blockquote]:border-primary/60 [&_blockquote]:pr-3 [&_blockquote]:py-1 [&_blockquote]:my-1.5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/20 [&_blockquote]:rounded-l",
						"[&_ul]:list-disc [&_ul]:pr-5 [&_ul]:my-1 [&_ul]:space-y-0.5",
						"[&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:my-1 [&_ol]:space-y-0.5",
						"[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px] [&_code]:text-foreground [&_code]:border [&_code]:border-border/40",
						"[&_pre]:bg-muted/40 [&_pre]:p-2.5 [&_pre]:rounded-md [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-1.5 [&_pre]:border [&_pre]:border-border/60",
						"[&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80",
						disabled && "cursor-not-allowed opacity-50",
					)}
				/>
			</div>
		</div>
	);
}

/** زر شريط الأدوات الصغير المتجاوب مع حالة التفعيل */
function ToolbarButton({
	children,
	onClick,
	active = false,
	disabled = false,
	title,
}: {
	children: ReactNode;
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	title: string;
}) {
	return (
		<button
			type="button"
			onMouseDown={(e: ReactMouseEvent) => {
				// منع فقدان التركيز من محرر النصوص عند النقر على أزرار التنسيق
				e.preventDefault();
			}}
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={cn(
				"size-7 rounded flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none select-none",
				active
					? "bg-primary/15 text-primary border border-primary/30 font-bold shadow-2xs"
					: "text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted",
			)}
		>
			{children}
		</button>
	);
}

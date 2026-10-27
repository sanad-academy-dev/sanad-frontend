import { useState, useRef, useEffect } from "react";
import {
	IconCube,
	IconPaperclip,
	IconArrowUp,
	IconChevronDown,
	IconX,
	IconCheck,
	IconSparkles,
	IconRefresh,
	IconLayoutSidebarRightCollapse,
	IconLayoutSidebar,
	IconCode,
	IconRobot,
	IconBrain,
	IconSchool,
	IconFileDescription,
	IconUsers,
	IconCalendarPlus,
	IconArrowBackUp,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SanadLogo } from "@/components/common/sanad-logo";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LearningMode } from "@/server/classrooms/classrooms.type";

export interface ClassroomAgentFormState {
	name: string;
	code: string;
	description: string;
	category: string;
	capacity: number | string;
	notes: string;
	ageGroup: string;
	branch: string;
	classification: string;
	learningMode: LearningMode | "";
	selectedIcon: string;
	selectedIconType?: "icon" | "emoji";
	selectedColor: string;
}

export interface ClassroomAgentPanelProps {
	onClose: () => void;
	onApplyData: (data: Partial<ClassroomAgentFormState>) => void;
	currentValues: ClassroomAgentFormState;
}

interface ChatMessage {
	id: string;
	sender: "user" | "agent";
	text: string;
	timestamp: Date;
	suggestedData?: Partial<ClassroomAgentFormState>;
	applied?: boolean;
}

// رسم مكعبات أيزومترية مطابقة تماماً للخلفية في الصورة المرفقة
function IsometricCubesPattern() {
	// مصفوفة صفوف المكعبات تشكل هرماً مقلوباً كما في الصورة
	const rows = [
		{ count: 11, y: 15 },
		{ count: 10, y: 32 },
		{ count: 9, y: 49 },
		{ count: 8, y: 66 },
		{ count: 7, y: 83 },
		{ count: 6, y: 100 },
		{ count: 5, y: 117 },
		{ count: 4, y: 134 },
		{ count: 3, y: 151 },
		{ count: 2, y: 168 },
		{ count: 1, y: 185 },
	];

	const r = 5.5; // نصف قطر المكعب
	const dx = 18; // التباعد الأفقي
	const centerX = 160;

	return (
		<svg
			viewBox="0 0 320 205"
			className="w-full max-w-[280px] h-auto pointer-events-none select-none text-foreground/20 dark:text-foreground/15 transition-opacity"
			fill="none"
		>
			{rows.map((row, rowIdx) => {
				const startX = centerX - ((row.count - 1) * dx) / 2;
				const rowOpacity = 0.12 + (rowIdx / rows.length) * 0.35;

				return Array.from({ length: row.count }).map((_, colIdx) => {
					const cx = startX + colIdx * dx;
					const cy = row.y;

					// رؤوس المكعب السداسي
					const v0 = `${cx},${cy - r}`; // Top
					const v1 = `${cx + r * 0.866},${cy - r * 0.5}`; // Top right
					const v2 = `${cx + r * 0.866},${cy + r * 0.5}`; // Bottom right
					const v3 = `${cx},${cy + r}`; // Bottom
					const v4 = `${cx - r * 0.866},${cy + r * 0.5}`; // Bottom left
					const v5 = `${cx - r * 0.866},${cy - r * 0.5}`; // Top left

					return (
						<g key={`${rowIdx}-${colIdx}`} opacity={rowOpacity}>
							{/* إطار المكعب الخارجي */}
							<polygon
								points={`${v0} ${v1} ${v2} ${v3} ${v4} ${v5}`}
								stroke="currentColor"
								strokeWidth="0.8"
							/>
							{/* خطوط الأيزومتري الثلاثة نحو المركز */}
							<line
								x1={cx}
								y1={cy}
								x2={cx}
								y2={cy - r}
								stroke="currentColor"
								strokeWidth="0.8"
							/>
							<line
								x1={cx}
								y1={cy}
								x2={cx + r * 0.866}
								y2={cy + r * 0.5}
								stroke="currentColor"
								strokeWidth="0.8"
							/>
							<line
								x1={cx}
								y1={cy}
								x2={cx - r * 0.866}
								y2={cy + r * 0.5}
								stroke="currentColor"
								strokeWidth="0.8"
							/>
						</g>
					);
				});
			})}
		</svg>
	);
}

// قائمة المهارات الذكية المتاحة في القائمة السفلية
const AGENT_SKILLS = [
	{
		id: "full-auto",
		label: "صياغة وتوليد البيانات كاملة",
		icon: IconSparkles,
		prompt: "قم بصياغة متكاملة لبيانات فصل جديد بالاسم والكود والوصف والخصائص المناسبة",
	},
	{
		id: "coding-kids",
		label: "مسار البرمجة للأطفال (8-12 سنة)",
		icon: IconCode,
		prompt: "أريد صياغة فصل لتعليم البرمجة للأطفال من سن 8 إلى 12 سنة بنمط عن بعد",
	},
	{
		id: "robotics-teens",
		label: "الروبوت والذكاء الاصطناعي (13-16 سنة)",
		icon: IconRobot,
		prompt: "أريد صياغة فصل روبوتكس وذكاء اصطناعي تفاعلي حضوري في مختبر الابتكار",
	},
	{
		id: "scope-desc",
		label: "اقتراح وصف وأهداف تعليمية",
		icon: IconFileDescription,
		prompt: "اقترح وصفاً شاملاً وأهدافاً تعليمية واضحة للفصل",
	},
	{
		id: "capacity-schedule",
		label: "تخطيط السعة ونمط التعلم",
		icon: IconCalendarPlus,
		prompt: "حدد السعة المثالية ونمط التعلم المناسب للفصل",
	},
	{
		id: "team-staff",
		label: "توزيع الموظفين والمدربين",
		icon: IconUsers,
		prompt: "اقترح أفضل تشكيل لفريق التدريب والمشرفين لهذا الفصل",
	},
];

export function ClassroomAgentPanel({
	onClose,
	onApplyData,
	currentValues,
}: ClassroomAgentPanelProps) {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// التمرير التلقائي لآخر رسالة
	// biome-ignore lint/correctness/useExhaustiveDependencies: التمرير عند تغير الرسائل أو بدء التوليد
	useEffect(() => {
		if (messages.length > 0) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isGenerating]);

	// معالجة توليد الاقتراحات الذكية بحسب استعلام المستخدم أو الزر المختار
	const handleGenerate = (customPrompt?: string) => {
		const promptText = (customPrompt || input).trim();
		if (!promptText && !attachedFileName) return;

		const userMsg: ChatMessage = {
			id: String(Date.now()),
			sender: "user",
			text: promptText || `تحليل المستند: ${attachedFileName}`,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsGenerating(true);

		// محاكاة استجابة الذكاء الاصطناعي بدقة وسرعة
		setTimeout(() => {
			let suggested: Partial<ClassroomAgentFormState> = {};
			let replyText = "";

			const lower = promptText.toLowerCase();

			if (lower.includes("نطاق") || lower.includes("حدّد النطاق")) {
				suggested = {
					name: currentValues.name || "مختبر البرمجة والابتكار الرقمي",
					code: currentValues.code || "INNOV-01",
					description:
						"فصل تدريبي تطبيقي يركز على إتقان التفكير الخوارزمي وبناء نماذج برمجية حقيقية بالتعاون مع منصة سند.",
					notes: "المخرجات المتوقعة: إنجاز 3 مشاريع عملية وعرضها في المعرض النهائي.",
					category: "مختلط",
					ageGroup: "8-12 سنة",
					classification: "برمجة",
					selectedIcon: "code",
					selectedColor: "indigo",
				};
				replyText =
					"تم تحديد نطاق الفصل الدراسي بدقة: الأهداف التعليمية، الفئة العمرية المستهدفة، ومخرجات المشاريع المطلوبة.";
			} else if (lower.includes("طلبات العملاء") || lower.includes("ابحث في طلبات")) {
				suggested = {
					name: "الذكاء الاصطناعي وبناء الروبوتات",
					code: "AI-BOT-02",
					description:
						"المسار الأكثر طلباً بناءً على تسجيلات الطلاب الأخيرة: تدريب عملي مكثف على برمجة المتحكمات والذكاء الاصطناعي.",
					capacity: 15,
					category: "مختلط",
					ageGroup: "13-16 سنة",
					branch: "فرع التجمع",
					classification: "ذكاء اصطناعي",
					learningMode: "IN_PERSON",
					selectedIcon: "robot",
					selectedColor: "blue",
				};
				replyText =
					"استناداً إلى تحليل طلبات أولياء الأمور والطلاب الأكثر إقبالاً، قمت بصياغة هذا الفصل بمسار الذكاء الاصطناعي والروبوتكس.";
			} else if (lower.includes("جدول") || lower.includes("الزمني") || lower.includes("خطط الجدول")) {
				suggested = {
					learningMode: "HYBRID",
					capacity: 12,
					notes:
						"الجدول المقترح: حصتان أسبوعياً (الأحد والثلاثاء من 4:00 إلى 6:00 مساءً) + جلسة مراجعة أونلاين كل سبت.",
					branch: "عن بعد (أونلاين)",
					classification: "برمجة",
				};
				replyText =
					"تمت مواءمة الجدول الزمني المقترح والسعة الاستيعابية المثلى مع دعم النمط الهجين لتحقيق أعلى كفاءة تعليمية.";
			} else if (lower.includes("فريق") || lower.includes("اختر الفريق")) {
				suggested = {
					notes:
						"الفريق التدريسي الموصى به: مدرب رئيسي متخصص في علوم الحاسب + مشرف أنشطة وتوجيه تربوي.",
					capacity: 10,
				};
				replyText =
					"تم ترشيح الهيكل التدريسي المناسب لتغطية متطلبات الفصل والمتابعة الفردية لكل طالب.";
			} else if (lower.includes("روبوت") || lower.includes("ذكاء اصطناعي")) {
				suggested = {
					name: "الروبوت والذكاء الاصطناعي التطبيقي",
					code: "RB-AI",
					description:
						"تطبيق عملي لمشاريع الروبوتات وتحديات الذكاء الاصطناعي التوليدي في مختبر الابتكار بسند.",
					category: "مختلط",
					capacity: 14,
					ageGroup: "13-16 سنة",
					learningMode: "IN_PERSON",
					branch: "الفرع الرئيسي",
					classification: "ذكاء اصطناعي",
					selectedIcon: "robot",
					selectedColor: "indigo",
					notes: "المعدات والحقائب التدريبية متوفرة في القاعة.",
				};
				replyText =
					"تم إعداد كامل متطلبات فصل الروبوت والذكاء الاصطناعي: السعة، القاعة المناسبة، والوصف الشامل.";
			} else if (lower.includes("برمج") || lower.includes("أطفال")) {
				suggested = {
					name: "مسار البرمجة للمبتكرين الصغار",
					code: "KIDS-DEV",
					description:
						"رحلة تفاعلية ممتعة يتعلم فيها الصغار أساسيات التفكير المنطقي وكتابة الأكواد عبر ألعاب ومشاريع مشوقة.",
					category: "مختلط",
					capacity: 10,
					ageGroup: "8-12 سنة",
					learningMode: "REMOTE",
					branch: "عن بعد (أونلاين)",
					classification: "برمجة",
					selectedIcon: "code",
					selectedColor: "emerald",
					notes: "يتطلب حاسوباً شخصياً واتصالاً مستقراً بالإنترنت.",
				};
				replyText =
					"تمت صياغة فصل تدريب الصغار على البرمجة بأسلوب تفاعلي وتحديد الشروط التقنية اللازمة.";
			} else {
				// صياغة شاملة عامة
				suggested = {
					name: currentValues.name || "رواد الأعمال والمشاريع الرقمية",
					code: currentValues.code || "PRJ-01",
					description:
						"فصل تطبيقي لتأسيس المشاريع وصقل مهارات القيادة والعمل الجماعي بأسلوب مبتكر يدعمه مدربو سند.",
					category: "مختلط",
					capacity: 16,
					ageGroup: "17+ سنة",
					learningMode: "HYBRID",
					classification: "إدارة أعمال",
					selectedIcon: "briefcase",
					selectedColor: "amber",
					notes: "جلسات تدريبية عملية وتوجيه مستمر مع شهادة معتمدة.",
				};
				replyText =
					"لقد قمت بتحليل طلبك وصياغة مقترح متكامل للفصل يشمل الاسم الكودي، الوصف، الفئة، والسعة الملائمة.";
			}

			const botMsg: ChatMessage = {
				id: String(Date.now() + 1),
				sender: "agent",
				text: replyText,
				timestamp: new Date(),
				suggestedData: suggested,
				applied: false,
			};

			setMessages((prev) => [...prev, botMsg]);
			setIsGenerating(false);

			// تطبيق البيانات فورياً مع إشعار للمستخدم لتوفير الوقت
			onApplyData(suggested);
			toast.success("قام سند بصياغة بيانات الفصل وتطبيقها في النموذج بنجاح!");
		}, 600);
	};

	const handleApplySpecificMessage = (msgId: string, data?: Partial<ClassroomAgentFormState>) => {
		if (!data) return;
		onApplyData(data);
		setMessages((prev) =>
			prev.map((m) => (m.id === msgId ? { ...m, applied: true } : m)),
		);
		toast.success("تم تطبيق بيانات الاقتراح على النموذج!");
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAttachedFileName(file.name);
		toast.info(`تم إرفاق: ${file.name}`);
		handleGenerate(`قم بتحليل ملف التوصيف المرفق (${file.name}) وصياغة بيانات الفصل منه`);
	};

	const handleResetChat = () => {
		setMessages([]);
		setInput("");
		setAttachedFileName(null);
		toast.info("تم بدء جلسة صياغة جديدة");
	};

	return (
		<aside
			aria-label="لوحة سند لصياغة الفصل مع الذكاء الاصطناعي"
			className="w-full md:w-[380px] lg:w-[410px] shrink-0 border-s border-border bg-white dark:bg-card/95 flex flex-col justify-between overflow-hidden relative transition-all duration-300"
		>
			{/* 1. الترويسة العلوية للوحة الذكاء الاصطناعي (أزرار إخفاء وإغلاق كما في الصورة المرفقة) */}
			<div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/50 shrink-0 bg-background/50 backdrop-blur-xs">
				{/* اليمين في RTL: شارة سند الذكي */}
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
						<SanadLogo iconOnly className="size-3" />
						<span>سند الذكي</span>
					</div>
					{messages.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							onClick={handleResetChat}
							className="size-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
							title="بدء صياغة جديدة"
						>
							<IconArrowBackUp className="size-3.5" />
						</Button>
					)}
				</div>

				{/* اليسار في RTL: زر إخفاء وزر الإغلاق X مطابق تماماً للصورة */}
				<div className="flex items-center gap-1.5">
					{/* زر إخفاء مع أيقونة سايدبار مطابق تماماً للصورة المرفقة */}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						className="h-7 px-2.5 text-xs gap-1.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-medium cursor-pointer"
						title="إخفاء لوحة المساعد"
					>
						<span>إخفاء</span>
						<IconLayoutSidebarRightCollapse className="size-3.5" />
					</Button>

					{/* زر الإغلاق X */}
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={onClose}
						className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
						title="إغلاق لوحة سند"
					>
						<IconX className="size-4" />
					</Button>
				</div>
			</div>

			{/* 2. المحتوى الداخلي: في حالة عدم وجود رسائل يظهر التصميم المطابق 100% للصورة المرفقة */}
			<div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-center relative">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center text-center my-auto animate-in fade-in-50 duration-300">
						{/* شبكة المكعبات الأيزومترية المطابقة للصورة */}
						<div className="relative flex justify-center mb-1">
							<IsometricCubesPattern />
						</div>

						{/* أيقونة المكعب المركزية في رأس الهرم */}
						<div className="size-7 rounded-lg flex items-center justify-center text-foreground/85 mb-2 -mt-1">
							<IconCube className="size-5 stroke-[1.8]" />
						</div>

						{/* العنوان الرئيسي والوصف المطابق للصورة */}
						<h3 className="text-sm font-bold text-foreground mb-1 tracking-tight">
							صياغة مشروع جديد
						</h3>
						<p className="text-[11px] text-muted-foreground max-w-[270px] leading-relaxed mb-4">
							يحدد المشروع نتيجة واضحة وموعداً للإنجاز، ويجمع المهام والمستندات المرتبطة به.
						</p>

						{/* أزرار الاقتراحات السريعة (Pill Chips) المطابقة تماماً للصورة */}
						<div className="flex flex-col items-center gap-1.5 w-full max-w-[320px]">
							<div className="flex items-center justify-center gap-1.5 flex-wrap">
								<button
									type="button"
									onClick={() => handleGenerate("حدّد النطاق والأهداف التعليمية لهذا الفصل")}
									className="rounded-full border border-border/80 bg-background/90 dark:bg-card/90 px-3 py-1 text-xs text-foreground/80 font-medium hover:border-primary/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
								>
									حدّد النطاق
								</button>
								<button
									type="button"
									onClick={() => handleGenerate("ابحث في طلبات العملاء والطلاب الأكثر إقبالاً")}
									className="rounded-full border border-border/80 bg-background/90 dark:bg-card/90 px-3 py-1 text-xs text-foreground/80 font-medium hover:border-primary/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
								>
									ابحث في طلبات العملاء
								</button>
								<button
									type="button"
									onClick={() => handleGenerate("خطط الجدول الزمني ونمط التعلم المناسب")}
									className="rounded-full border border-border/80 bg-background/90 dark:bg-card/90 px-3 py-1 text-xs text-foreground/80 font-medium hover:border-primary/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
								>
									خطط الجدول الزمني
								</button>
							</div>
							<div className="flex items-center justify-center">
								<button
									type="button"
									onClick={() => handleGenerate("اختر الفريق التدريسي والمشرفين الملائمين")}
									className="rounded-full border border-border/80 bg-background/90 dark:bg-card/90 px-3 py-1 text-xs text-foreground/80 font-medium hover:border-primary/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
								>
									اختر الفريق
								</button>
							</div>
						</div>
					</div>
				) : (
					/* عرض سجل الرسائل التفاعلية عند بدء المحادثة */
					<div className="space-y-3.5 my-auto">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={cn(
									"flex flex-col gap-1.5 animate-in fade-in-30 duration-200",
									msg.sender === "user" ? "items-start" : "items-end",
								)}
							>
								{/* رأس الرسالة */}
								<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
									{msg.sender === "agent" ? (
										<>
											<SanadLogo iconOnly className="size-3" />
											<span className="font-semibold text-primary">سند الذكي</span>
										</>
									) : (
										<span>أنت</span>
									)}
								</div>

								{/* فقاعة الرسالة */}
								<div
									className={cn(
										"rounded-2xl p-3 text-xs leading-relaxed max-w-[90%] shadow-2xs",
										msg.sender === "user"
											? "bg-primary text-primary-foreground rounded-tr-xs"
											: "bg-muted/60 dark:bg-muted/40 border border-border/60 text-foreground rounded-tl-xs",
									)}
								>
									<p>{msg.text}</p>

									{/* بطاقة معاينة القيم المقترحة */}
									{msg.suggestedData && (
										<div className="mt-2.5 pt-2.5 border-t border-border/40 space-y-1.5">
											<div className="text-[11px] font-semibold text-foreground flex items-center justify-between">
												<span>البيانات المقترحة للفصل:</span>
												{msg.applied ? (
													<span className="text-[10px] text-emerald-600 flex items-center gap-1">
														<IconCheck className="size-3" /> تم التطبيق
													</span>
												) : (
													<button
														type="button"
														onClick={() =>
															handleApplySpecificMessage(msg.id, msg.suggestedData)
														}
														className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
													>
														إعادة التطبيق
													</button>
												)}
											</div>
											<div className="grid grid-cols-2 gap-1.5 text-[10px] bg-background/80 dark:bg-card/80 p-2 rounded-lg border border-border/40">
												{msg.suggestedData.name && (
													<div className="col-span-2">
														<span className="text-muted-foreground">الاسم: </span>
														<span className="font-semibold text-foreground">
															{msg.suggestedData.name}
														</span>
													</div>
												)}
												{msg.suggestedData.code && (
													<div>
														<span className="text-muted-foreground">المعرف: </span>
														<span className="font-mono">{msg.suggestedData.code}</span>
													</div>
												)}
												{msg.suggestedData.capacity && (
													<div>
														<span className="text-muted-foreground">السعة: </span>
														<span>{msg.suggestedData.capacity} طلاب</span>
													</div>
												)}
												{msg.suggestedData.ageGroup && (
													<div>
														<span className="text-muted-foreground">الفئة: </span>
														<span>{msg.suggestedData.ageGroup}</span>
													</div>
												)}
												{msg.suggestedData.learningMode && (
													<div>
														<span className="text-muted-foreground">النمط: </span>
														<span>{msg.suggestedData.learningMode}</span>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						))}

						{isGenerating && (
							<div className="flex items-center gap-2 p-2 text-xs text-muted-foreground animate-pulse">
								<Spinner className="size-3.5 text-primary" />
								<span>جاري صياغة بيانات الفصل مع سند...</span>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* 3. صندوق الإدخال السفلي المطابق تماماً لتصميم الصورة المرفقة */}
			<div className="p-3 bg-muted/20 border-t border-border/50 shrink-0">
				{attachedFileName && (
					<div className="flex items-center justify-between text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-lg mb-2">
						<span className="truncate">ملف مرفق: {attachedFileName}</span>
						<button
							type="button"
							onClick={() => setAttachedFileName(null)}
							className="text-muted-foreground hover:text-destructive"
						>
							<IconX className="size-3" />
						</button>
					</div>
				)}

				<div className="rounded-2xl border border-border/80 bg-background p-2.5 shadow-2xs focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
					{/* حقل النص */}
					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleGenerate();
							}
						}}
						placeholder="ضع مشروعك مع مدير..."
						rows={2}
						className="w-full text-xs bg-transparent border-0 resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/60 leading-relaxed text-right"
					/>

					{/* شريط الأدوات السفلي داخل الصندوق (المهارات يمين + إرفاق وإرسال يسار) */}
					<div className="flex items-center justify-between pt-1 border-t border-border/30 mt-1">
						{/* قائمة المهارات الذكية المنسدلة */}
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-6 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground font-medium rounded-md cursor-pointer"
								>
									<IconCube className="size-3 text-muted-foreground" />
									<span>المهارات</span>
									<IconChevronDown className="size-3 opacity-60" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-56 p-1 rounded-xl shadow-md border bg-popover"
							>
								<DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold text-muted-foreground">
									مهارات سند الذكية
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{AGENT_SKILLS.map((skill) => {
									const IconComp = skill.icon;
									return (
										<DropdownMenuItem
											key={skill.id}
											onClick={() => handleGenerate(skill.prompt)}
											className="cursor-pointer text-xs flex items-center gap-2 py-1.5"
										>
											<IconComp className="size-3.5 text-primary shrink-0" />
											<span>{skill.label}</span>
										</DropdownMenuItem>
									);
								})}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* أزرار الإرفاق والإرسال */}
						<div className="flex items-center gap-1.5">
							{/* إدخال الملف المخفي */}
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								accept=".pdf,.doc,.docx,.txt,.json,.csv"
								onChange={handleFileUpload}
							/>

							{/* زر المشبك للإرفاق */}
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								onClick={() => fileInputRef.current?.click()}
								className="size-6 text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
								title="إرفاق ملف مرجعي"
							>
								<IconPaperclip className="size-3.5" />
							</Button>

							{/* زر الإرسال الدائري مع السهم العلوي كما في الصورة */}
							<Button
								type="button"
								size="icon-xs"
								onClick={() => handleGenerate()}
								disabled={(!input.trim() && !attachedFileName) || isGenerating}
								className={cn(
									"size-6.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center justify-center cursor-pointer shadow-2xs",
									(!input.trim() && !attachedFileName) && "opacity-40 cursor-not-allowed",
								)}
								title="إرسال الطلب"
							>
								<IconArrowUp className="size-3.5 stroke-[2.5]" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

import {
	IconArrowBackUp,
	IconArrowsDiagonalMinimize2,
	IconArrowUp,
	IconCheck,
	IconCube,
	IconPaperclip,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { SanadLogo } from "@/components/common/sanad-logo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface TrackAgentFormState {
	name: string;
	code: string;
	description: string;
	notes?: string;
	category: string;
	duration: string;
	ageGroup: string;
	coursesCount: number;
	price: number;
	selectedTrainer?: string;
	locationMode?: "ONLINE" | "IN_PERSON" | "HYBRID";
}

export interface TrackAgentPanelProps {
	onClose: () => void;
	onCloseDialog?: () => void;
	onApplyData: (data: Partial<TrackAgentFormState>) => void;
	currentValues: TrackAgentFormState;
}

interface ChatMessage {
	id: string;
	sender: "user" | "agent";
	text: string;
	timestamp: Date;
	suggestedData?: Partial<TrackAgentFormState>;
	applied?: boolean;
}

// رسم مكعبات أيزومترية متناسقة للخلفية
function IsometricCubesPattern() {
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

	const r = 5.5;
	const dx = 18;
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

					const v0 = `${cx},${cy - r}`;
					const v1 = `${cx + r * 0.866},${cy - r * 0.5}`;
					const v2 = `${cx + r * 0.866},${cy + r * 0.5}`;
					const v3 = `${cx},${cy + r}`;
					const v4 = `${cx - r * 0.866},${cy + r * 0.5}`;
					const v5 = `${cx - r * 0.866},${cy - r * 0.5}`;

					return (
						<g key={`${rowIdx}-${colIdx}`} opacity={rowOpacity}>
							<polygon
								points={`${v0} ${v1} ${v2} ${v3} ${v4} ${v5}`}
								stroke="currentColor"
								strokeWidth="0.8"
							/>
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

export function TrackAgentPanel({
	onClose,
	onApplyData,
	currentValues,
}: TrackAgentPanelProps) {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isGenerating]);

	const handleGenerate = (promptText: string) => {
		const userQuery = promptText.trim();
		if (!userQuery) return;

		const userMsg: ChatMessage = {
			id: String(Date.now()),
			sender: "user",
			text: userQuery,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsGenerating(true);

		setTimeout(() => {
			const lower = userQuery.toLowerCase();
			let suggested: Partial<TrackAgentFormState> = {};
			let replyText = "";

			if (lower.includes("برمج") || lower.includes("أطفال") || lower.includes("كود")) {
				suggested = {
					name: "البرمجة والمنطق للصغار",
					code: "PR-02",
					description:
						"مسار تدريبي تأسيسي يهدف لتعليم الأطفال مهارات التفكير البرمجي وبناء الألعاب والتطبيقات التفاعلية.",
					category: "البرمجة والمنطق",
					duration: "6 أسابيع",
					ageGroup: "9-11 سنة",
					coursesCount: 4,
					price: 7000,
					locationMode: "ONLINE",
					selectedTrainer: "أحمد الشمري",
				};
				replyText =
					"تم تصميم مسار البرمجة والمنطق بنجاح: حددت المدة بـ 6 أسابيع و 4 دورات تدريبية متسلسلة وتكلفة مناسبة.";
			} else if (lower.includes("توحد") || lower.includes("تخاطب") || lower.includes("تأهيل")) {
				suggested = {
					name: "تأهيل النطق والتخاطب الشامل للأطفال",
					code: "REHAB-SP",
					description:
						"برنامج إكلينيكي وتأهيلي متكامل لتطوير القدرات اللغوية والتعبيرية لدى الأطفال ذوي صعوبات التواصل.",
					category: "طبي وتأهيلي",
					duration: "8 أسابيع",
					ageGroup: "4-6 سنه",
					coursesCount: 5,
					price: 9500,
					locationMode: "IN_PERSON",
					selectedTrainer: "د. هدى السعيد",
				};
				replyText =
					"تمت صياغة بيانات مسار تأهيل النطق والتخاطب للأطفال مع تحديد المقاعد والقاعة والمدة المناسبة.";
			} else if (lower.includes("معلم") || lower.includes("رياض أطفال") || lower.includes("مرب")) {
				suggested = {
					name: "إعداد معلمات رياض الأطفال المتقدم",
					code: "KDG-PRO",
					description:
						"تأهيل الكادر التعليمي على أحدث استراتيجيات التعلم النشط وإدارة البيئة الصفية التفاعلية.",
					category: "تدريب تربوي",
					duration: "4 أسابيع",
					ageGroup: "26+ سنة",
					coursesCount: 3,
					price: 5000,
					locationMode: "ONLINE",
					selectedTrainer: "أ. نورة الغامدي",
				};
				replyText =
					"تمت صياغة مسار تأهيل المعلمات وتحديد المحاور الأساسية للدورات وساعات الاعتماد.";
			} else {
				suggested = {
					name: currentValues.name || "مسار الذكاء الاصطناعي والتكنولوجيا المتقدمة",
					code: currentValues.code || "AI-TRK-01",
					description:
						"رحلة تعليمية تطبيقية تركز على استخدام أدوات الذكاء الاصطناعي وحل المشكلات بأساليب مبتكرة.",
					category: "البرمجة والمنطق",
					duration: "8 أسابيع",
					ageGroup: "15-17 سنة",
					coursesCount: 4,
					price: 8500,
					locationMode: "HYBRID",
					selectedTrainer: "فيصل خالد",
				};
				replyText =
					"قمت بتحليل طلبك وصياغة مسار تدريبي متكامل بالاسم والكود والوصف والمدة والتصنيف المناسب.";
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

			onApplyData(suggested);
			toast.success("قام مساعد سند بصياغة بيانات المسار وتطبيقها في النموذج بنجاح!");
		}, 600);
	};

	const handleApplySpecific = (msgId: string, data?: Partial<TrackAgentFormState>) => {
		if (!data) return;
		onApplyData(data);
		setMessages((prev) =>
			prev.map((m) => (m.id === msgId ? { ...m, applied: true } : m)),
		);
		toast.success("تم تطبيق الاقتراح على النموذج!");
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAttachedFileName(file.name);
		toast.info(`تم إرفاق: ${file.name}`);
		handleGenerate(`قم بتحليل ملف التوصيف التدريبي المرفق (${file.name}) وصياغة بيانات المسار منه`);
	};

	const handleResetChat = () => {
		setMessages([]);
		setInput("");
		setAttachedFileName(null);
		toast.info("تم بدء جلسة صياغة جديدة");
	};

	return (
		<aside
			aria-label="لوحة سند لصياغة المسار التدريبي مع الذكاء الاصطناعي"
			className="w-full md:w-1/2 flex-1 min-w-0 border-0 border-none bg-[#F8F9FA] dark:bg-muted/25 flex flex-col justify-between overflow-hidden relative transition-all duration-300 animate-in fade-in-0"
		>
			{/* الترويسة العلوية للوحة المساعد */}
			<div className="flex h-10 items-center justify-between gap-2 border-b border-border px-4 shrink-0 bg-transparent">
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
						<SanadLogo iconOnly className="size-3" />
						<span>سند الذكي</span>
					</div>
					{messages.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							onClick={handleResetChat}
							className="size-6 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
							title="بدء صياغة جديدة"
						>
							<IconArrowBackUp className="size-3" />
						</Button>
					)}
				</div>

				<div className="flex items-center gap-0.5">
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={onClose}
						className="size-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
						title="إغلاق لوحة المساعد"
					>
						<IconArrowsDiagonalMinimize2 className="size-3.5" />
					</Button>
				</div>
			</div>

			{/* محتوى المحادثة والرسائل */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
						<IsometricCubesPattern />
						<div className="mt-3">
							<h4 className="text-xs font-bold text-foreground">
								مساعد سند الذكي لصياغة المسارات التدريبية
							</h4>
							<p className="text-[11px] text-muted-foreground mt-1 max-w-[270px] leading-relaxed">
								اكتب فكرة المسار أو جمهوره المستهدف، وسيقوم المساعد باقتراح الاسم، التوصيف، المدة، والتصنيف المناسب وتعبئتها فورياً.
							</p>
						</div>

						{/* مقترحات سريعة */}
						<div className="mt-4 flex flex-col gap-1.5 w-full max-w-[290px]">
							{[
								"اقترح مسار برمجة ومنطق للأطفال الصغار",
								"صمم مسار تأهيل النطق والتخاطب للتوحد",
								"إعداد معلمات رياض الأطفال المتقدم",
							].map((prompt) => (
								<button
									key={prompt}
									type="button"
									onClick={() => handleGenerate(prompt)}
									className="text-right text-[11px] px-2.5 py-1.5 rounded-md border border-border bg-background hover:bg-muted/70 hover:border-primary/40 text-foreground transition-all cursor-pointer flex items-center justify-between group"
								>
									<span className="truncate">{prompt}</span>
									<IconSparkles className="size-3 text-muted-foreground group-hover:text-primary shrink-0 ms-1" />
								</button>
							))}
						</div>
					</div>
				) : (
					messages.map((msg) => (
						<div
							key={msg.id}
							className={cn(
								"flex flex-col gap-1 text-xs max-w-[85%]",
								msg.sender === "user" ? "ms-auto items-end" : "me-auto items-start",
							)}
						>
							<div
								className={cn(
									"rounded-xl px-3 py-2 text-xs leading-relaxed",
									msg.sender === "user"
										? "bg-primary text-primary-foreground"
										: "bg-background border border-border text-foreground shadow-2xs",
								)}
							>
								{msg.text}
							</div>

							{/* زر تطبيق المقترح إن وُجد */}
							{msg.suggestedData && (
								<button
									type="button"
									onClick={() => handleApplySpecific(msg.id, msg.suggestedData)}
									className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium mt-0.5 cursor-pointer"
								>
									{msg.applied ? (
										<>
											<IconCheck className="size-3" />
											<span>تم التطبيق</span>
										</>
									) : (
										<>
											<IconSparkles className="size-3" />
											<span>تطبيق في النموذج</span>
										</>
									)}
								</button>
							)}
						</div>
					))
				)}

				{isGenerating && (
					<div className="flex items-center gap-2 text-xs text-muted-foreground me-auto bg-background border px-3 py-2 rounded-xl">
						<Spinner className="size-3.5" />
						<span>سند يحلل المعطيات ويصيغ المسار...</span>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* شريط الإدخال السفلي */}
			<div className="p-3 border-t border-border bg-background shrink-0">
				{attachedFileName && (
					<div className="flex items-center justify-between text-[11px] bg-muted/50 border px-2 py-1 rounded mb-2">
						<span className="truncate">{attachedFileName}</span>
						<button
							type="button"
							onClick={() => setAttachedFileName(null)}
							className="text-muted-foreground hover:text-foreground"
						>
							<IconX className="size-3" />
						</button>
					</div>
				)}

				<div className="relative flex items-center gap-1.5">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileUpload}
						className="hidden"
						accept=".pdf,.doc,.docx,.txt"
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={() => fileInputRef.current?.click()}
						className="size-7 text-muted-foreground hover:text-foreground shrink-0"
						title="إرفاق ملف توصيف تدريبي"
					>
						<IconPaperclip className="size-3.5" />
					</Button>

					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleGenerate(input);
							}
						}}
						placeholder="اكتب ما تحتاجه لصياغة المسار..."
						rows={1}
						className="flex-1 min-h-[32px] max-h-24 resize-none text-xs bg-muted/30 border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-right"
					/>

					<Button
						type="button"
						size="icon-xs"
						disabled={!input.trim() || isGenerating}
						onClick={() => handleGenerate(input)}
						className="size-7 shrink-0 cursor-pointer"
						title="إرسال"
					>
						<IconArrowUp className="size-3.5" />
					</Button>
				</div>
			</div>
		</aside>
	);
}


import { useState } from "react";
import {
	IconArrowsDiagonal,
	IconArrowsMinimize,
	IconInfoCircle,
	IconMail,
	IconSend,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";
import type { StaffResponse } from "@/server/staff/staff.type";

export interface AssignStaffConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	classroom?: ClassroomResponse | null;
	classroomName?: string;
	selectedStaff: StaffResponse[];
	onConfirm: (options: {
		enableMessage: boolean;
		subject: string;
		message: string;
		notifyManager: boolean;
	}) => void;
	isPending?: boolean;
}

function initialsOf(name: string) {
	if (!name) return "م";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

function formatStaffCount(count: number): string {
	const padded = String(count).padStart(2, "0");
	if (count === 1) return `${padded} موظف`;
	if (count === 2) return `${padded} موظفان`;
	if (count >= 3 && count <= 10) return `${padded} موظفين`;
	return `${padded} موظف`;
}

const AI_MESSAGES = [
	"مرحبًا، لقد تم تكليفك رسميًا بالانضمام إلى الكادر التعليمي للفصل الدراسي. تجد عبر المنصة قائمة الطلاب والجداول المعتمدة لمباشرة المهام بنجاح.",
	"يسرنا إبلاغك بتعيينك ضمن فريق عمل هذا الفصل الدراسي. نتطلع لمساهمتك القيمة في متابعة الطلاب وتطوير المهارات الأكاديمية والعملية.",
	"تحية طيبة، تم إسناد هذا الفصل إليك لتولي التدريس والإشراف الأكاديمي. يمكنك الاطلاع على بيانات الطلاب وخطة الفصل من لوحة التحكم.",
];

export function AssignStaffConfirmDialog({
	open,
	onOpenChange,
	classroom,
	classroomName,
	selectedStaff,
	onConfirm,
	isPending = false,
}: AssignStaffConfirmDialogProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [enableMessage, setEnableMessage] = useState(true);
	const [subject, setSubject] = useState("تعيين موظف جديد");
	const [message, setMessage] = useState(
		"مرحبًا، لقد قمنا بإضافتك للفصل الدراسي. نأمل لك وللطلاب تجربة متميزة وموفقة في تحقيق الأهداف التعليمية.",
	);
	const [notifyManager, setNotifyManager] = useState(false);
	const [isGeneratingAI, setIsGeneratingAI] = useState(false);

	const targetClassName = classroom?.name || classroomName || "الفصل الدراسي";

	// توليد نص بالذكاء الاصطناعي
	const handleGenerateAI = () => {
		setIsGeneratingAI(true);
		setTimeout(() => {
			const randomMsg = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
			setMessage(randomMsg.replace("للفصل الدراسي", `لفصل ${targetClassName}`));
			setIsGeneratingAI(false);
			toast.success("تم إنشاء نص الرسالة بنجاح بالذكاء الاصطناعي ✨");
		}, 400);
	};

	const handleFormSubmit = () => {
		onConfirm({
			enableMessage,
			subject,
			message,
			notifyManager,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"z-[70] p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl transition-all duration-300",
					isExpanded ? "sm:max-w-3xl" : "sm:max-w-xl",
				)}
				dir="rtl"
			>
				{/* ترويسة البوب أب: العنوان والمسار + أزرار التوسيع والإغلاق */}
				<DialogHeader className="p-4 pb-3 border-b border-border/60 flex flex-row items-center justify-between space-y-0 text-right">
					<DialogTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
						<span className="text-muted-foreground">تعيين موظف لـ فصل</span>
						<span className="text-muted-foreground">›</span>
						<span className="inline-flex items-center gap-1 font-bold text-foreground">
							<span className="text-sm">⚙️</span>
							{targetClassName}
						</span>
					</DialogTitle>

					<div className="flex items-center gap-1 shrink-0">
						<button
							type="button"
							onClick={() => setIsExpanded((prev) => !prev)}
							title={isExpanded ? "تصغير" : "توسيع"}
							className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
						>
							{isExpanded ? (
								<IconArrowsMinimize className="size-3.5" />
							) : (
								<IconArrowsDiagonal className="size-3.5" />
							)}
						</button>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							title="إغلاق"
							className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
						>
							<IconX className="size-4" />
						</button>
					</div>
				</DialogHeader>

				{/* محتوى البوب أب مطابق تماماً للصورة */}
				<div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
					{/* عدد الموظفين وصندوق الأفاتارات المحددون */}
					<div className="space-y-1.5 text-right">
						<div className="flex items-center justify-start text-xs font-bold text-foreground">
							{formatStaffCount(selectedStaff.length)}
						</div>

						{/* صندوق الأفاتار كما في الصورة */}
						<div className="min-h-[58px] p-2.5 rounded-xl border border-border/80 bg-muted/10 flex items-center justify-start gap-2 flex-wrap">
							{selectedStaff.map((staffMember) => (
								<div
									key={staffMember.id}
									title={`${staffMember.name}${staffMember.role ? ` (${typeof staffMember.role === "string" ? staffMember.role : staffMember.role?.name})` : ""}`}
									className="size-9 rounded-full bg-[#8296FF] text-white flex items-center justify-center text-xs font-bold shadow-2xs border-2 border-background transition-transform hover:scale-110 cursor-pointer overflow-hidden"
								>
									{staffMember.avatar ? (
										<img
											src={staffMember.avatar}
											alt={staffMember.name}
											className="size-full object-cover rounded-full"
										/>
									) : (
										<span>{initialsOf(staffMember.name)}</span>
									)}
								</div>
							))}
						</div>
					</div>

					{/* صف التبديل (الوضع + إغلاق رسالة / تضمين رسالة) */}
					<div className="flex items-center justify-between pt-1">
						<div className="flex items-center gap-1.5">
							<span className="text-xs font-bold text-foreground">الوضع</span>
							<IconInfoCircle className="size-3.5 text-muted-foreground/70" />
							<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
								مطلوب
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-foreground">
								{enableMessage ? "إغلاق رسالة" : "تضمين رسالة"}
							</span>
							<Switch
								checked={enableMessage}
								onCheckedChange={setEnableMessage}
								aria-label="تفعيل أو إغلاق الرسالة"
							/>
						</div>
					</div>

					{/* الحقلان (الموضوع ونص الرسالة) يظهران عند تفعيل الرسالة كما طلب المستخدم */}
					{enableMessage && (
						<div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
							{/* حقل الموضوع */}
							<div className="space-y-1.5 text-right">
								<Input
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="موضوع الرسالة..."
									className="h-10 rounded-xl border border-border/80 text-xs px-3 font-medium bg-background"
								/>
							</div>

							{/* حقل نص الرسالة مع زر الذكاء الاصطناعي */}
							<div className="space-y-2 text-right">
								<div className="flex items-center justify-between">
									<label className="text-xs font-bold text-foreground">
										نص رسالة
									</label>
									<Button
										type="button"
										variant="outline"
										size="xs"
										onClick={handleGenerateAI}
										disabled={isGeneratingAI}
										className="h-7 gap-1.5 text-[11px] font-semibold text-primary border-primary/30 hover:bg-primary/5 hover:text-primary cursor-pointer"
									>
										<IconSparkles className="size-3.5 text-primary" />
										{isGeneratingAI ? "جاري الإنشاء..." : "إنشاء بالذكاء الاصطناعي"}
									</Button>
								</div>

								<Textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									rows={4}
									placeholder="اكتب نص الرسالة هنا..."
									className="rounded-xl border border-border/80 p-3 text-xs leading-relaxed resize-none bg-background focus-visible:ring-1"
								/>
							</div>
						</div>
					)}
				</div>

				{/* فوتر البوب أب: إشعار للمدير (يمين) + زر التعيين والإرسال (يسار) */}
				<div className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-3">
					{/* خيار إشعار للمدير عبر البريد */}
					<div className="flex items-center gap-2">
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							id="notify-manager-switch"
						/>
						<label
							htmlFor="notify-manager-switch"
							className="text-xs font-medium text-foreground cursor-pointer select-none"
						>
							إشعار للمدير عبر البريد
						</label>
					</div>

					{/* زر التعيين وإرسال الرسالة */}
					<Button
						type="button"
						size="sm"
						onClick={handleFormSubmit}
						disabled={isPending || selectedStaff.length === 0}
						className="gap-2 px-5 font-semibold text-xs bg-[#4F6AE0] hover:bg-[#435bc4] text-white shadow-sm cursor-pointer"
					>
						{enableMessage ? (
							<>
								<IconSparkles className="size-3.5 text-white/90" />
								{isPending ? "جاري التعيين والإرسال..." : "تعيين وإرسال رسالة"}
							</>
						) : (
							<>
								<IconSend className="size-3.5 text-white/90" />
								{isPending ? "جاري التعيين..." : "تأكيد التعيين"}
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

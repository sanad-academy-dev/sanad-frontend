import { IconArrowBarLeft, IconChevronLeft, IconMail, IconPhone } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface RegistrationDrawerHeaderProps {
	title: string;
	patientName: string;
	code?: string;
	onClose: () => void;
	titleClassName?: string;
}

/**
 * الرأس الموحد لجميع لوحات الإجراءات (Drawers) في التسجيل الإلكتروني
 * يطابق تماماً النموذج المعتمد:
 * - جهة اليمين (RTL): [العنوان] › [أيقونة دائرية للطالب] [اسم الطالب] - #[الكود]
 * - جهة اليسار (RTL): زر إغلاق اللوحة
 */
export function RegistrationDrawerHeader({
	title,
	patientName,
	code,
	onClose,
	titleClassName,
}: RegistrationDrawerHeaderProps) {
	const initial = (patientName || "ط").trim().slice(0, 1);

	return (
		<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-right bg-white dark:bg-zinc-900 shrink-0">
			{/* جهة اليمين (في RTL): العنوان › الحرف الأول للطالب + الاسم */}
			<div className="flex items-center gap-1.5 min-w-0">
				<span className={cn("text-[12px] font-bold text-zinc-900 dark:text-zinc-100 truncate", titleClassName)}>
					{title}
				</span>
				<IconChevronLeft className="size-3 text-muted-foreground shrink-0" />
				<div className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs shrink-0">
					{initial}
				</div>
				<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[140px]">
					{patientName}
				</span>
			</div>

			{/* جهة اليسار (في RTL): زر إغلاق / طي اللوحة */}
			<button
				type="button"
				onClick={onClose}
				className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
				title="إغلاق"
			>
				<IconArrowBarLeft className="size-4" />
			</button>
		</div>
	);
}

interface RegistrationDrawerGuardianCardProps {
	guardianName?: string | null;
	guardianPhone?: string | null;
	guardianEmail?: string | null;
	patientName: string;
	className?: string;
}

/**
 * بطاقة ولي الأمر الموحدة في أعلى محتوى لوحات الإجراءات
 * يطابق تماماً النموذج المعتمد:
 * - جهة اليمين (RTL): [أيقونة دائرية زرقاء بالحروف الأولى لولي الأمر] [اسم ولي الأمر] + ولي أمر الطالب: [اسم الطالب]
 * - جهة اليسار (RTL): رقم هاتف ولي الأمر + البريد الإلكتروني مع الأيقونات
 */
export function RegistrationDrawerGuardianCard({
	guardianName,
	guardianPhone,
	guardianEmail,
	patientName,
	className,
}: RegistrationDrawerGuardianCardProps) {
	const initials = (guardianName || "ول").trim().slice(0, 2);

	return (
		<div
			className={cn(
				"rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-3 flex items-center justify-between shadow-2xs",
				className,
			)}
		>
			{/* جهة اليمين (في RTL): بيانات ولي أمر الطالب مع الأيقونة الدائرية */}
			<div className="flex items-center gap-2.5">
				<div className="size-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
					{initials}
				</div>
				<div className="text-right">
					<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
						{guardianName || "ولي الأمر"}
					</p>
					<p className="text-[10px] text-muted-foreground">
						ولي أمر الطالب: {patientName}
					</p>
				</div>
			</div>

			{/* جهة اليسار (في RTL): الهاتف والبريد الإلكتروني */}
			<div className="space-y-1 text-left" dir="ltr">
				{guardianPhone && (
					<div className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
						<IconPhone className="size-3 text-zinc-400 shrink-0" />
						<span>{guardianPhone}</span>
					</div>
				)}
				{guardianEmail && (
					<div className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
						<IconMail className="size-3 text-zinc-400 shrink-0" />
						<span className="truncate max-w-[150px]">{guardianEmail}</span>
					</div>
				)}
			</div>
		</div>
	);
}

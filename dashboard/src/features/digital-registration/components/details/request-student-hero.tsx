import { useState } from "react";
import {
	IconSend,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestStudentHeroProps {
	request: CampaignRequestItem;
	onStatusChange?: (status: CampaignRequestItem["status"]) => void;
}

function computeAgeLabel(birthDate?: string | null, fallbackAge?: string | null): string {
	if (fallbackAge && fallbackAge.trim()) {
		return fallbackAge;
	}
	if (birthDate) {
		const birth = new Date(birthDate);
		if (!isNaN(birth.getTime())) {
			const now = new Date();
			let years = now.getFullYear() - birth.getFullYear();
			const m = now.getMonth() - birth.getMonth();
			if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
				years--;
			}
			if (years > 0) {
				return `${years} ${years <= 10 ? "سنوات" : "سنة"}`;
			}
			const months = Math.max(1, (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth());
			return `${months} شهر`;
		}
	}
	return "غير محدد";
}

export function RequestStudentHero({
	request,
}: RequestStudentHeroProps) {
	const [reminderSent, setReminderSent] = useState(false);

	const handleSendReminder = () => {
		toast.success(`تم إرسال تذكير بموعد المقابلة لولي الأمر (${request.guardianPhone}) عبر الواتساب`);
		setReminderSent(true);
	};

	const probability = request.attendanceProbability ?? 92;
	const displayAge = computeAgeLabel(request.birthDate, request.ageLabel);

	return (
		<div className="space-y-2" dir="rtl">
			{/* شريط الهيدر العلوي: اسم الطالب + بيانات العمر + كود الطلب بدون شارة الحالة المكررة */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<div className="size-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
						<IconUser className="size-3.5" />
					</div>
					<h2 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
						{request.patientName}
					</h2>
					<span className="text-[10.5px] text-muted-foreground font-medium">
						• {request.gender === "MALE" ? "ذكر" : "أنثى"} • {displayAge}
					</span>
				</div>

				{/* كود الطلب المنظومي */}
				<Badge
					variant="outline"
					className="font-mono text-[10px] font-bold border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-1.5 py-0"
				>
					#{request.code}
				</Badge>
			</div>

			{/* مؤشر احتمال حضور المقابلة الذكي */}
			<div className="flex items-center justify-between gap-2 rounded-md border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 px-2.5 py-1 text-[10.5px]">
				<div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-semibold">
					<IconSparkles className="size-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
					<span>
						احتمال حضور المقابلة {probability}%
					</span>
				</div>

				<button
					type="button"
					onClick={handleSendReminder}
					disabled={reminderSent}
					className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
				>
					<IconSend className="size-2.5" />
					<span>{reminderSent ? "تم إرسال التذكير" : "إرسال تذكير"}</span>
				</button>
			</div>
		</div>
	);
}

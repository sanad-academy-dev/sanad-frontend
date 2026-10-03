import {
	IconBook2,
	IconClipboardList,
	IconFile,
	IconFileCheck,
	IconRoute,
	IconSchool,
	type TablerIcon,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ContentOption = {
	key: "course" | "page" | "quiz" | "assignment" | "path" | "wiki";
	label: string;
	description: string;
	Icon: TablerIcon;
	tint: string;
	fg: string;
	badge?: string;
	available?: boolean;
};

// خيارات «إنشاء محتوى جديد» — حاليًا «الدورة» و«الاختبار» فقط مفعّلان؛ البقية «قريباً».
const OPTIONS: ContentOption[] = [
	{
		key: "course",
		label: "دورة تدريبية",
		description: "إنشاء ونشر محتوى تعليمي متكامل للمتدربين.",
		Icon: IconSchool,
		tint: "bg-[#4F6AE0]/10",
		fg: "text-[#4F6AE0]",
		available: true,
	},
	{
		key: "quiz",
		label: "اختبار",
		description: "إنشاء اختبار لتقييم فهم المتدربين للمادة.",
		Icon: IconFileCheck,
		tint: "bg-[#F5C33B]/15",
		fg: "text-[#B45309]",
		available: true,
	},
	{
		key: "page",
		label: "صفحة",
		description: "إنشاء صفحة مستقلة تحتوي على محتوى تعليمي.",
		Icon: IconFile,
		tint: "bg-[#F97316]/10",
		fg: "text-[#F97316]",
		badge: "قريباً",
	},
	{
		key: "assignment",
		label: "تكليف",
		description: "إنشاء تكاليف للمتدربين لإنجازها ضمن مهلة محددة.",
		Icon: IconClipboardList,
		tint: "bg-[#8B5CF6]/10",
		fg: "text-[#8B5CF6]",
		badge: "قريباً",
	},
	{
		key: "path",
		label: "مسار تعلّم",
		description: "إنشاء رحلة تعلّم مرتّبة ومتسلسلة يتبعها المتدرب.",
		Icon: IconRoute,
		tint: "bg-[#EC4899]/10",
		fg: "text-[#EC4899]",
		badge: "قريباً",
	},
	{
		key: "wiki",
		label: "ويكي",
		description: "قاعدة معرفة للمعلومات المرتبطة بالدورة التدريبية.",
		Icon: IconBook2,
		tint: "bg-[#14857A]/10",
		fg: "text-[#14857A]",
		badge: "قريباً",
	},
];

// قائمة «إنشاء محتوى جديد» — تُفتح من الزر المُمرَّر كـ children (يُستخدم كـ trigger).
export function CreateContentMenu({
	children,
	onSelectCourse,
	onSelectQuiz,
}: {
	children: ReactNode;
	onSelectCourse: () => void;
	onSelectQuiz: () => void;
}) {
	const handle = (opt: ContentOption) => {
		if (opt.key === "course") onSelectCourse();
		if (opt.key === "quiz") onSelectQuiz();
	};

	return (
		// المحتوى يُطبع في body خارج شجرة الصفحة، وRadix لا يقرأ dir من الـ DOM — لذا يُمرَّر صراحةً
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-[272px] p-1"
			>
				<DropdownMenuLabel className="px-1.5 pt-0.5 pb-1 text-[11px] font-bold text-foreground">
					إنشاء محتوى جديد
				</DropdownMenuLabel>

				{OPTIONS.map((opt) => {
					const { Icon } = opt;
					return (
						<DropdownMenuItem
							key={opt.key}
							disabled={!opt.available}
							onSelect={() => handle(opt)}
							className="items-start gap-2 rounded-[6px] p-1.5"
						>
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-[6px]",
									opt.tint,
									opt.fg,
								)}
							>
								<Icon className="size-[14px]" />
							</span>
							<span className="flex min-w-0 flex-col">
								<span className="flex items-center gap-1">
									<span className="text-[11px] font-bold leading-4 text-foreground">
										{opt.label}
									</span>
									{opt.badge && (
										<span className="rounded-[3px] bg-muted px-1 text-[8px] font-semibold text-muted-foreground">
											{opt.badge}
										</span>
									)}
								</span>
								<span className="text-[10px] leading-[14px] text-muted-foreground">
									{opt.description}
								</span>
							</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

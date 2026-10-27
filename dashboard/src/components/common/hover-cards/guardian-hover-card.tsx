import type React from "react";
import {
	IconPhone,
	IconMail,
	IconMapPin,
	IconUsers,
	IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface GuardianHoverData {
	id?: string | number;
	name: string;
	phone?: string | null;
	email?: string | null;
	relationship?: string | null;
	address?: string | null;
	city?: string | null;
	active?: boolean;
	code?: string | null;
	studentsCount?: number | null;
	studentsNames?: string[] | null;
}

export interface GuardianHoverCardProps {
	guardian: GuardianHoverData;
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	openDelay?: number;
	closeDelay?: number;
}

function getInitialLetter(name?: string | null): string {
	if (!name) return "—";
	const trimmed = name.trim();
	if (!trimmed) return "—";
	return Array.from(trimmed)[0].toUpperCase();
}

export function GuardianHoverCard({
	guardian,
	children,
	align = "center",
	side = "top",
	openDelay = 150,
	closeDelay = 100,
}: GuardianHoverCardProps) {
	const initial = getInitialLetter(guardian.name);
	const rel = guardian.relationship || "ولي أمر";

	return (
		<HoverCard openDelay={openDelay} closeDelay={closeDelay}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent
				align={align}
				side={side}
				sideOffset={8}
				dir="rtl"
				className="w-76 p-3.5 shadow-xl border border-border/70 rounded-2xl bg-popover/95 backdrop-blur-md"
			>
				{/* 1. الترويسة: الحرف الأولي، الاسم، شارة صلة القرابة */}
				<div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-border/50">
					<div className="flex items-center gap-2.5 min-w-0">
						{/* دائرة الحرف بلون سند الموف الأنيق */}
						<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:border-purple-900/60 dark:text-purple-300 text-xs font-bold shadow-2xs">
							{initial}
						</div>

						<div className="flex flex-col min-w-0">
							<h4 className="text-xs font-bold text-foreground truncate leading-tight">
								{guardian.name}
							</h4>
							<span className="text-[10px] text-muted-foreground truncate">
								{rel}
							</span>
						</div>
					</div>

					{/* شارة صلة القرابة */}
					<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900 shrink-0">
						{rel}
					</span>
				</div>

				{/* 2. بيانات الاتصال والتفاصيل */}
				<div className="space-y-1.5 py-2.5 border-b border-border/50 text-xs">
					{/* رقم الهاتف */}
					{guardian.phone && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconPhone className="size-3.5 text-primary shrink-0" />
								<span>رقم الهاتف:</span>
							</span>
							<div className="flex items-center gap-1.5">
								<a
									href={`tel:${guardian.phone}`}
									onClick={(e) => e.stopPropagation()}
									className="font-mono text-foreground hover:text-primary font-medium"
									dir="ltr"
								>
									{guardian.phone}
								</a>
								<a
									href={`https://wa.me/${guardian.phone.replace(/[^0-9]/g, "")}`}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="text-emerald-600 hover:text-emerald-700 p-0.5"
									title="محادثة عبر واتساب"
								>
									<IconBrandWhatsapp className="size-3.5" />
								</a>
							</div>
						</div>
					)}

					{/* البريد الإلكتروني */}
					{guardian.email && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconMail className="size-3.5 text-muted-foreground shrink-0" />
								<span>البريد:</span>
							</span>
							<a
								href={`mailto:${guardian.email}`}
								onClick={(e) => e.stopPropagation()}
								className="text-foreground hover:text-primary truncate max-w-[150px] font-mono text-[10px]"
								title={guardian.email}
							>
								{guardian.email}
							</a>
						</div>
					)}

					{/* المدينة أو العنوان */}
					{(guardian.city || guardian.address) && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconMapPin className="size-3.5 text-muted-foreground shrink-0" />
								<span>العنوان:</span>
							</span>
							<span className="text-foreground truncate max-w-[150px]">
								{[guardian.city, guardian.address].filter(Boolean).join("، ")}
							</span>
						</div>
					)}

					{/* عدد الطلاب التابعين */}
					{guardian.studentsCount !== undefined &&
						guardian.studentsCount !== null && (
							<div className="flex items-center justify-between text-[11px]">
								<span className="text-muted-foreground flex items-center gap-1.5">
									<IconUsers className="size-3.5 text-muted-foreground shrink-0" />
									<span>الأبناء المسجلون:</span>
								</span>
								<span className="font-semibold text-primary">
									{guardian.studentsCount} طلاب
								</span>
							</div>
						)}
				</div>

				
			</HoverCardContent>
		</HoverCard>
	);
}

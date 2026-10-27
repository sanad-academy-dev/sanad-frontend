import type React from "react";
import {
	IconPhone,
	IconMail,
	IconBuilding,
	IconBriefcase,
	IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface StaffHoverData {
	id: string;
	name: string;
	phone?: string | null;
	role?: string | null;
	email?: string | null;
	image?: string | null;
	branch?: string | null;
	employmentType?: string | null;
	active?: boolean;
}

export interface StaffHoverCardProps {
	staff: StaffHoverData;
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	openDelay?: number;
	closeDelay?: number;
}

function initialsOf(name: string): string {
	if (!name) return "—";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

const EMPLOYMENT_TRANSLATION: Record<string, string> = {
	FULL_TIME: "دوام كامل",
	PART_TIME: "دوام جزئي",
};

export function StaffHoverCard({
	staff,
	children,
	align = "center",
	side = "top",
	openDelay = 150,
	closeDelay = 100,
}: StaffHoverCardProps) {
	const initials = initialsOf(staff.name);
	const roleTitle = staff.role || "كادر المركز";
	const isActive = staff.active !== false;

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
				{/* 1. الترويسة: الحرف أو الصورة، الاسم، الدور */}
				<div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-border/50">
					<div className="flex items-center gap-2.5 min-w-0">
						{/* الصورة أو الحروف الأولية */}
						{staff.image ? (
							<img
								src={staff.image}
								alt={staff.name}
								className="size-9 rounded-xl object-cover border shadow-2xs shrink-0"
							/>
						) : (
							<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300 text-xs font-bold shadow-2xs">
								{initials}
							</div>
						)}

						<div className="flex flex-col min-w-0">
							<h4 className="text-xs font-bold text-foreground truncate leading-tight">
								{staff.name}
							</h4>
							<span className="text-[10px] text-muted-foreground truncate">
								{roleTitle}
							</span>
						</div>
					</div>

					{/* شارة النشاط */}
					<span
						className={cn(
							"inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border",
							isActive
								? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
								: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
						)}
					>
						<span
							className={cn(
								"size-1.5 rounded-full",
								isActive ? "bg-emerald-500" : "bg-slate-400",
							)}
						/>
						{isActive ? "نشط" : "غير نشط"}
					</span>
				</div>

				{/* 2. بيانات التواصل والتفاصيل المهنية */}
				<div className="space-y-1.5 py-2.5 border-b border-border/50 text-xs">
					{/* رقم الهاتف والواتساب */}
					{staff.phone && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconPhone className="size-3.5 text-primary shrink-0" />
								<span>رقم الهاتف:</span>
							</span>
							<div className="flex items-center gap-1.5">
								<a
									href={`tel:${staff.phone}`}
									onClick={(e) => e.stopPropagation()}
									className="font-mono text-foreground hover:text-primary font-medium"
									dir="ltr"
								>
									{staff.phone}
								</a>
								<a
									href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, "")}`}
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
					{staff.email && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconMail className="size-3.5 text-muted-foreground shrink-0" />
								<span>البريد:</span>
							</span>
							<a
								href={`mailto:${staff.email}`}
								onClick={(e) => e.stopPropagation()}
								className="text-foreground hover:text-primary truncate max-w-[150px] font-mono text-[10px]"
								title={staff.email}
							>
								{staff.email}
							</a>
						</div>
					)}

					{/* الفرع */}
					{staff.branch && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconBuilding className="size-3.5 text-muted-foreground shrink-0" />
								<span>الفرع:</span>
							</span>
							<span className="text-foreground truncate max-w-[150px]">
								{staff.branch}
							</span>
						</div>
					)}

					{/* نوع الدوام */}
					{staff.employmentType && (
						<div className="flex items-center justify-between text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<IconBriefcase className="size-3.5 text-muted-foreground shrink-0" />
								<span>نوع الدوام:</span>
							</span>
							<span className="text-foreground font-medium truncate max-w-[150px]">
								{EMPLOYMENT_TRANSLATION[staff.employmentType] || staff.employmentType}
							</span>
						</div>
					)}
				</div>

			</HoverCardContent>
		</HoverCard>
	);
}

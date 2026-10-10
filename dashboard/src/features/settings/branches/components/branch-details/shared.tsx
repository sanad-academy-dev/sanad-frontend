import {
	IconArrowRight,
	IconCheck,
	IconChevronLeft,
	IconCirclePlus,
	IconX,
} from "@tabler/icons-react";
import { Link, type LinkProps, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ── هيكل الصفحة: زر عودة + مسار التنقل ─────────────────────────────────────

export function BranchDetailsShell({
	branchName,
	branchId,
	section,
	sectionTo,
	subSection,
	wide,
	children,
}: {
	branchName: string;
	branchId?: string;
	section?: string;
	/** مسار القسم — يحوّل فتات القسم إلى رابط حين تكون الصفحة قسمًا فرعيًا */
	sectionTo?: LinkProps["to"];
	/** القسم الفرعي (المستوى الرابع) — مثل «أجهزة التحليل» تحت «التحليلات» */
	subSection?: string;
	/** صفحات الجداول الكاملة تمتد بعرض الشاشة بدل العمود الضيق */
	wide?: boolean;
	children: ReactNode;
}) {
	const router = useRouter();
	return (
		<div
			className={cn(
				"mx-auto flex w-full flex-col gap-4 px-4 pb-10 pt-4",
				!wide && "max-w-195",
			)}
		>
			<div className="flex flex-col gap-3">
				<div className="flex justify-start">
					<Button
						variant="outline"
						size="sm"
						onClick={() => router.history.back()}
						className="h-6 gap-1 rounded-lg px-2 text-[11px]"
					>
						عودة
						<IconArrowRight className="size-3" />
					</Button>
				</div>
				<div className="flex items-center gap-1.5 text-sm">
					<Link
						to="/management/settings/branches-teams"
						className="font-bold text-foreground hover:text-primary"
					>
						الفروع
					</Link>
					<IconChevronLeft className="size-3.5 text-muted-foreground" />
					{section && branchId ? (
						<>
							<Link
								to="/management/settings/branch/$branchId"
								params={{ branchId }}
								className="font-bold text-foreground hover:text-primary"
							>
								{branchName}
							</Link>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							{subSection && sectionTo ? (
								<>
									<Link
										to={sectionTo}
										params={{ branchId }}
										className="font-bold text-foreground hover:text-primary"
									>
										{section}
									</Link>
									<IconChevronLeft className="size-3.5 text-muted-foreground" />
									<span className="text-muted-foreground">{subSection}</span>
								</>
							) : (
								<span className="text-muted-foreground">{section}</span>
							)}
						</>
					) : (
						<span className="font-bold text-foreground">{branchName}</span>
					)}
				</div>
			</div>
			{children}
		</div>
	);
}

// ── عناوين الأقسام والبطاقات ────────────────────────────────────────────────

export function SectionHeading({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<p className="text-xs font-bold text-foreground">{title}</p>
			{description && <p className="text-[11px] text-muted-foreground">{description}</p>}
		</div>
	);
}

export function SettingsCard({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return <div className={cn("rounded-[4px] border bg-card px-5", className)}>{children}</div>;
}

// ── صف إعداد: أيقونة + عنوان + وصف/حالة + عنصر تحكم ────────────────────────

export function SettingRow({
	icon,
	title,
	description,
	status,
	trailing,
	highlighted,
	className,
}: {
	icon?: ReactNode;
	title: string;
	description?: string;
	status?: ReactNode;
	trailing?: ReactNode;
	highlighted?: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex min-h-13 items-center justify-between gap-4 border-b py-3 last:border-b-0",
				highlighted && "-mx-5 bg-muted/50 px-5",
				className,
			)}
		>
			<div className="flex items-start gap-2">
				{icon && (
					<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
						{icon}
					</span>
				)}
				<span className="flex flex-col gap-0.5">
					<span className="text-xs font-bold text-foreground">{title}</span>
					{description && (
						<span className="max-w-96 text-[11px] text-muted-foreground">{description}</span>
					)}
					{status}
				</span>
			</div>
			{trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
		</div>
	);
}

export function StatusDot({
	on,
	onLabel = "مفعل",
	offLabel = "معطل",
}: {
	on: boolean;
	onLabel?: string;
	offLabel?: string;
}) {
	return (
		<span className="flex items-center gap-1.5">
			<span
				className={cn("size-1.5 rounded-full", on ? "bg-green-500" : "bg-muted-foreground/50")}
			/>
			<span className={cn("text-[11px]", on ? "text-foreground" : "text-muted-foreground")}>
				{on ? onLabel : offLabel}
			</span>
		</span>
	);
}

export function ComingSoonPill() {
	return (
		<span className="rounded-lg border bg-muted/50 px-2.5 py-1 text-[10px] text-muted-foreground">
			متاح قريبًا
		</span>
	);
}

// ── صف تنقل داخل بطاقة (عام / الموظفين / القاعات / الدورات...) ───────────────

export function NavRow({
	icon,
	title,
	description,
	meta,
	to,
	params,
	disabled,
}: {
	icon: ReactNode;
	title: string;
	description: string;
	meta?: ReactNode;
	to?: LinkProps["to"];
	params?: LinkProps["params"];
	disabled?: boolean;
}) {
	const content = (
		<>
			<div className="flex items-start gap-2">
				<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
					{icon}
				</span>
				<span className="flex flex-col gap-0.5">
					<span className="text-xs font-bold text-foreground">{title}</span>
					<span className="max-w-96 text-[11px] text-muted-foreground">{description}</span>
				</span>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				{meta}
				{!disabled && <IconChevronLeft className="size-3.5 text-muted-foreground" />}
			</div>
		</>
	);

	const rowClassName =
		"flex min-h-13 items-center justify-between gap-4 border-b py-3 last:border-b-0";

	if (disabled || !to) {
		return <div className={cn(rowClassName, "opacity-80")}>{content}</div>;
	}
	return (
		<Link
			to={to}
			params={params}
			className={cn(rowClassName, "group transition-colors hover:bg-muted/30")}
		>
			{content}
		</Link>
	);
}

// ── اختيار أيقونة الفرع ─────────────────────────────────────────────────────

export const BRANCH_ICONS = [
	"🏥",
	"🐾",
	"🐶",
	"🐱",
	"🐦",
	"🐰",
	"🐴",
	"🦜",
	"🐢",
	"🐹",
	"🦴",
	"🩺",
	"💉",
	"⭐",
	"📍",
	"🌿",
];

export function BranchIconPicker({
	value,
	onChange,
	disabled,
	placeholder,
}: {
	value: string | null | undefined;
	onChange: (icon: string) => void;
	disabled?: boolean;
	placeholder?: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="اختر أيقونة الفرع"
					disabled={disabled}
					className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm hover:bg-muted/70 disabled:opacity-60"
				>
					{value ?? placeholder}
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-2"
				align="start"
			>
				<div className="grid grid-cols-8 gap-1">
					{BRANCH_ICONS.map((emoji) => (
						<button
							type="button"
							key={emoji}
							onClick={() => {
								onChange(emoji);
								setOpen(false);
							}}
							className={cn(
								"flex size-7 items-center justify-center rounded-md text-sm hover:bg-muted",
								value === emoji && "bg-muted",
							)}
						>
							{emoji}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

// ── اختيار عدة مستخدمين (مسؤولون) ──────────────────────────────────────────

export function UserAvatarBadge({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[9px] font-semibold text-primary">
			{initials}
		</span>
	);
}

export function UserMultiPicker({
	users,
	selectedIds,
	onChange,
	disabled,
}: {
	users: { id: string; name: string }[];
	selectedIds: string[];
	onChange: (ids: string[]) => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const toggle = (id: string) =>
		onChange(
			selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id],
		);

	return (
		<div className="flex flex-wrap items-center justify-end gap-1.5">
			{selectedIds.map((id) => {
				const user = users.find((u) => u.id === id);
				if (!user) return null;
				return (
					<span
						key={id}
						className="flex items-center gap-1.5 rounded-full border bg-muted/40 py-0.5 pe-2 ps-1 text-[11px]"
					>
						<UserAvatarBadge name={user.name} />
						{user.name}
						<button
							type="button"
							aria-label={`إزالة ${user.name}`}
							disabled={disabled}
							onClick={() => toggle(id)}
							className="text-muted-foreground hover:text-foreground"
						>
							<IconX className="size-3" />
						</button>
					</span>
				);
			})}
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						disabled={disabled}
						className="flex h-7 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-[11px] hover:bg-muted/50 disabled:opacity-50"
					>
						إضافة مسؤول
						<IconCirclePlus className="size-3.5 text-muted-foreground" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="w-56 p-1"
				>
					<div className="flex max-h-64 flex-col overflow-y-auto">
						{users.map((user) => (
							<button
								type="button"
								key={user.id}
								onClick={() => toggle(user.id)}
								className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted"
							>
								<UserAvatarBadge name={user.name} />
								<span className="flex-1 text-start">{user.name}</span>
								{selectedIds.includes(user.id) && (
									<IconCheck className="size-3.5 text-primary" />
								)}
							</button>
						))}
						{users.length === 0 && (
							<p className="px-2 py-1.5 text-[11px] text-muted-foreground">لا يوجد مستخدمون</p>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

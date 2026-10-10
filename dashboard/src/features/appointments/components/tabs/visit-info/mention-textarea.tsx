import { useEffect, useMemo, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface MentionUser {
	id: string;
	name: string;
}

interface MentionTextareaProps {
	value: string;
	onChange: (value: string) => void;
	users: MentionUser[];
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	autoFocus?: boolean;
	// يُستدعى عند تغيّر مجموعة المُشار إليهم المتطابقة مع النص الحالي
	onMentionsChange?: (userIds: string[]) => void;
}

// الحرف الفاصل قبل @ (بداية النص أو مسافة) — حتى لا يُفعَّل داخل كلمة
const TRIGGER_BOUNDARY = /(^|\s)@([\p{L}\p{N}_]*)$/u;

const initials = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

// إشارة داخل النص: @اسم — نُطابقها لاحقًا لاستخراج المعرّفات المذكورة فعلًا
function mentionToken(name: string) {
	return `@${name}`;
}

export function MentionTextarea({
	value,
	onChange,
	users,
	placeholder,
	disabled,
	className,
	autoFocus,
	onMentionsChange,
}: MentionTextareaProps) {
	const ref = useRef<HTMLTextAreaElement>(null);
	// خريطة الاسم → المعرّف لكل مستخدم أُدرج عبر @ (لاستخراج المعرّفات عند الإرسال)
	const insertedRef = useRef<Map<string, string>>(new Map());
	const [query, setQuery] = useState<string | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const matches = useMemo(() => {
		if (query === null) return [];
		const q = query.trim().toLowerCase();
		const list = q ? users.filter((u) => u.name.toLowerCase().includes(q)) : users;
		return list.slice(0, 6);
	}, [query, users]);

	const isOpen = query !== null && matches.length > 0;

	// أبلغ الأب بالمعرّفات المذكورة التي ما زال رمزها (@الاسم) موجودًا في النص
	useEffect(() => {
		if (!onMentionsChange) return;
		const ids: string[] = [];
		for (const [name, id] of insertedRef.current) {
			if (value.includes(mentionToken(name)) && !ids.includes(id)) ids.push(id);
		}
		onMentionsChange(ids);
	}, [value, onMentionsChange]);

	const detectTrigger = (text: string, caret: number) => {
		const before = text.slice(0, caret);
		const match = before.match(TRIGGER_BOUNDARY);
		if (match) {
			setQuery(match[2] ?? "");
			setActiveIndex(0);
		} else {
			setQuery(null);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const next = e.target.value;
		onChange(next);
		detectTrigger(next, e.target.selectionStart ?? next.length);
	};

	const insertMention = (user: MentionUser) => {
		const el = ref.current;
		const caret = el?.selectionStart ?? value.length;
		const before = value.slice(0, caret);
		const after = value.slice(caret);
		// استبدل الجزء "@جزئي" الذي يسبق المؤشر باسم كامل + مسافة
		const replaced = before.replace(
			TRIGGER_BOUNDARY,
			(_m, lead: string) => `${lead}@${user.name} `,
		);
		const next = replaced + after;
		insertedRef.current.set(user.name, user.id);
		onChange(next);
		setQuery(null);
		// أعد المؤشر إلى ما بعد الإشارة المُدرجة
		requestAnimationFrame(() => {
			el?.focus();
			const pos = replaced.length;
			el?.setSelectionRange(pos, pos);
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!isOpen) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((i) => (i + 1) % matches.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
		} else if (e.key === "Enter" || e.key === "Tab") {
			e.preventDefault();
			const user = matches[activeIndex];
			if (user) insertMention(user);
		} else if (e.key === "Escape") {
			e.preventDefault();
			setQuery(null);
		}
	};

	return (
		<div className="relative">
			<Textarea
				ref={ref}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={() => {
					// أغلق القائمة بعد مهلة بسيطة كي يُسجَّل النقر على عنصر
					setTimeout(() => setQuery(null), 120);
				}}
				placeholder={placeholder}
				disabled={disabled}
				className={className}
				autoFocus={autoFocus}
			/>
			{isOpen && (
				<div className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover shadow-md">
					<ul className="max-h-52 overflow-y-auto py-1">
						{matches.map((user, i) => (
							<li key={user.id}>
								<button
									type="button"
									// onMouseDown قبل blur حتى لا تُغلق القائمة قبل الإدراج
									onMouseDown={(e) => {
										e.preventDefault();
										insertMention(user);
									}}
									className={cn(
										"flex w-full items-center gap-2 px-2.5 py-1.5 text-start text-sm",
										i === activeIndex ? "bg-accent" : "hover:bg-accent/60",
									)}
								>
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[9px] font-semibold text-primary">
										{initials(user.name)}
									</span>
									<span className="truncate">{user.name}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

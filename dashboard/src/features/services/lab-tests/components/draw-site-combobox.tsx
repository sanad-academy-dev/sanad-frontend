import { useMemo, useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { DRAW_SITE_GROUPS } from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";

// موقع السحب: قائمة مقترحة قابلة للبحث، مع إبقاء إمكانية إدخال موقع مخصّص
// (الحقل كان نصًا حرًا — لا نريد أن يمنع المستخدم من كتابة موقع غير مدرج).
export function DrawSiteCombobox({
	value,
	onChange,
	disabled,
}: {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}) {
	const [query, setQuery] = useState("");

	const groups = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return DRAW_SITE_GROUPS;
		return DRAW_SITE_GROUPS.map((group) => ({
			...group,
			options: group.options.filter((option) => option.toLowerCase().includes(q)),
		})).filter((group) => group.options.length > 0);
	}, [query]);

	const hasMatches = groups.length > 0;
	const trimmed = query.trim();
	// موقع مخصّص غير موجود في القائمة — نتيح استخدامه كما هو
	const customOption =
		trimmed &&
		!DRAW_SITE_GROUPS.some((g) =>
			g.options.some((o) => o.toLowerCase() === trimmed.toLowerCase()),
		)
			? trimmed
			: null;

	return (
		<Combobox
			value={value}
			onValueChange={(next) => {
				onChange(typeof next === "string" ? next : "");
				setQuery("");
			}}
		>
			<ComboboxTrigger
				className={cn(
					"flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 text-sm",
					"text-right",
				)}
				disabled={disabled}
			>
				<ComboboxValue
					placeholder="اختر موقع السحب..."
					className="truncate"
				>
					{value}
				</ComboboxValue>
			</ComboboxTrigger>

			<ComboboxContent dir="rtl">
				<div className="p-1">
					<ComboboxInput
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="ابحث عن موقع..."
						showTrigger={false}
						className="w-full"
					/>
				</div>

				<ComboboxList>
					{!hasMatches && !customOption && <ComboboxEmpty>لا نتائج</ComboboxEmpty>}

					{customOption && (
						<ComboboxGroup>
							<ComboboxItem value={customOption}>
								<span className="truncate">استخدام «{customOption}»</span>
							</ComboboxItem>
						</ComboboxGroup>
					)}

					{groups.map((group) => (
						<ComboboxGroup key={group.label}>
							<ComboboxLabel>{group.label}</ComboboxLabel>
							{group.options.map((option) => (
								<ComboboxItem
									key={option}
									value={option}
								>
									<span className="truncate">{option}</span>
								</ComboboxItem>
							))}
						</ComboboxGroup>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

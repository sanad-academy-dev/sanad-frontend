/**
 * PageTableOfContents
 * فهرس الصفحة المستخرج من عناوين BlockNote
 * يعرض H1 / H2 / H3 مع indent وscroll ناعم عند الضغط
 */
import { IconList } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface TocHeading {
	id: string;
	level: 1 | 2 | 3;
	text: string;
}

interface Props {
	headings: TocHeading[];
	activeId?: string;
}

export function PageTableOfContents({ headings, activeId }: Props) {
	if (headings.length === 0) return null;

	const handleClick = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<aside className="sticky top-4 w-56 shrink-0 hidden lg:flex flex-col gap-2">
			<div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
				<IconList className="size-3.5" />
				الفهرس
			</div>
			<nav className="flex flex-col gap-0.5">
				{headings.map((h) => (
					<button
						key={h.id}
						type="button"
						onClick={() => handleClick(h.id)}
						className={cn(
							"text-right text-[12px] leading-5 py-1 px-2 rounded-md transition-colors truncate",
							h.level === 1 && "font-semibold",
							h.level === 2 && "pr-4 text-muted-foreground",
							h.level === 3 && "pr-7 text-muted-foreground/70 text-[11px]",
							activeId === h.id
								? "bg-primary/10 text-primary"
								: "hover:bg-muted text-foreground/70 hover:text-foreground",
						)}
					>
						{h.text}
					</button>
				))}
			</nav>
		</aside>
	);
}

/**
 * استخراج العناوين من مستند BlockNote
 */
export function extractHeadings(
	// biome-ignore lint/suspicious/noExplicitAny: BlockNote document
	blocks: any[],
): TocHeading[] {
	const headings: TocHeading[] = [];

	// biome-ignore lint/suspicious/noExplicitAny: BlockNote nested block
	function walk(block: any) {
		if (block.type === "heading" && block.props?.level && block.content?.length > 0) {
			const text = block.content
				// biome-ignore lint/suspicious/noExplicitAny: inline content
				.map((inline: any) => inline.text ?? "")
				.join("");

			if (text.trim()) {
				headings.push({
					id: block.id,
					level: block.props.level as 1 | 2 | 3,
					text: text.trim(),
				});
			}
		}
		if (block.children?.length) {
			for (const child of block.children) walk(child);
		}
	}

	for (const block of blocks ?? []) walk(block);
	return headings;
}

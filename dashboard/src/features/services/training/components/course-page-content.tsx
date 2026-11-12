"use client";

import type { PartialBlock } from "@blocknote/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { readPages } from "./course-page-inline-editor";

type ReaderComponent = typeof import("./course-blocknote-editor").CourseBlockNoteReader;

export function CoursePageContent({
	content,
	preferredPageId,
	className,
}: {
	content: string;
	preferredPageId?: string | null;
	className?: string;
}) {
	const pages = useMemo(() => readPages(content), [content]);
	const [activePageId, setActivePageId] = useState<string | null>(null);
	const [Reader, setReader] = useState<ReaderComponent | null>(null);
	const lastPreferredRef = useRef<string | null | undefined>(null);

	// مزامنة الصفحة النشطة في المعاينة عند تغيير الصفحة المختارة داخل المحرر
	useEffect(() => {
		if (!preferredPageId || preferredPageId === lastPreferredRef.current) return;
		lastPreferredRef.current = preferredPageId;
		if (pages.some((p) => p.id === preferredPageId)) {
			setActivePageId(preferredPageId);
		}
	}, [preferredPageId, pages]);

	const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];

	useEffect(() => {
		let cancelled = false;
		void import("./course-blocknote-editor").then((module) => {
			if (!cancelled) setReader(() => module.CourseBlockNoteReader);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div
			className={cn("space-y-3", className)}
			dir="rtl"
		>
			{pages.length > 1 && (
				<div
					className="flex items-center gap-1 overflow-x-auto border-b border-border/70"
					role="tablist"
					aria-label="صفحات الدرس"
				>
					{pages.map((page, index) => (
						<button
							key={page.id}
							type="button"
							role="tab"
							aria-selected={activePage?.id === page.id}
							onClick={() => setActivePageId(page.id)}
							className={cn(
								"shrink-0 border-b-2 px-3 py-2 text-xs",
								activePage?.id === page.id
									? "border-primary font-semibold text-primary"
									: "border-transparent text-muted-foreground",
							)}
						>
							{page.title || `الصفحة ${index + 1}`}
						</button>
					))}
				</div>
			)}
			{activePage && (
				<>
					{pages.length > 1 && <h4 className="text-sm font-semibold">{activePage.title}</h4>}
					{Reader ? (
						<Reader content={activePage.content as PartialBlock[]} />
					) : (
						<div className="py-5 text-center text-xs text-muted-foreground">
							جاري تحميل المحتوى...
						</div>
					)}
				</>
			)}
		</div>
	);
}

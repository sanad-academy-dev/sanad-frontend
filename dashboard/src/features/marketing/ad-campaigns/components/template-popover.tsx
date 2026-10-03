import { IconCircleCheck, IconSearch, IconTemplate } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdCopyTemplates } from "@/features/marketing/ad-campaigns/hooks/use-ad-creatives";
import type { AdTemplateCategory } from "@/generated/prisma/enums";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { AdCopyTemplateResponse } from "@/server/ad-creatives/ad-creatives.type";
import { AD_TEMPLATE_CATEGORIES } from "@sanad/contracts/runtime/server/ad-creatives/ad-creatives.type";

/**
 * لوحة القوالب ولوحة معاينتها (شاشتا 540226 و540738).
 *
 * لوحتان جنبًا إلى جنب: القائمة أولًا في DOM ⇒ يمينًا في RTL، والمعاينة تليها
 * ⇒ يسارًا — كما في التصميم. المعاينة لا تُغلق اللوحة ولا تُطبّق شيئًا؛ التطبيق
 * فعل صريح بزرّ «تأكيد القالب»، لأن النقر على قالب للاستطلاع لا يعني اختياره.
 */
export function TemplatePopover({
	onApply,
	disabled,
}: {
	onApply: (template: AdCopyTemplateResponse) => void;
	disabled?: boolean;
}) {
	const { isRtl } = useI18n();
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState<AdTemplateCategory>("SEO");
	const [search, setSearch] = useState("");
	const [preview, setPreview] = useState<AdCopyTemplateResponse | null>(null);

	const debouncedSearch = useDebouncedValue(search, 250);
	const { templates, isLoading } = useAdCopyTemplates(
		{
			// البحث يعمّ الفئات: من يكتب كلمة يبحث في القوالب كلها لا في التبويب المفتوح
			...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : { category }),
		},
		open,
	);

	const confirm = () => {
		if (!preview) return;
		onApply(preview);
		setOpen(false);
		setPreview(null);
	};

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) setPreview(null);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					size="xs"
					variant="outline"
					disabled={disabled}
				>
					<IconTemplate className="size-3.5" />
					قالب
				</Button>
			</PopoverTrigger>
			<PopoverContent
				dir={isRtl ? "rtl" : "ltr"}
				align="end"
				className="w-[620px] p-0"
			>
				<div className="grid grid-cols-[1fr_240px]">
					{/* القائمة — أولًا في DOM ⇒ يمينًا في RTL */}
					<div className="flex min-w-0 flex-col border-e">
						<div className="flex items-center justify-between gap-2 border-b px-3 py-2">
							<span className="font-medium text-sm">القوالب</span>
							<InputGroup className="w-48">
								<InputGroupAddon align="inline-start">
									<IconSearch />
								</InputGroupAddon>
								<InputGroupInput
									placeholder="البحث في القوالب..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</InputGroup>
						</div>

						<div className="flex flex-wrap items-center gap-1 border-b px-3 py-2">
							{AD_TEMPLATE_CATEGORIES.map((tab) => (
								<button
									key={tab.value}
									type="button"
									onClick={() => {
										setCategory(tab.value);
										setSearch("");
									}}
									className={cn(
										"rounded-[4px] px-2.5 py-1 text-xs transition-colors",
										!debouncedSearch.trim() && category === tab.value
											? "border border-border bg-muted font-medium text-foreground"
											: "text-muted-foreground hover:bg-muted/60",
									)}
								>
									{tab.label}
								</button>
							))}
						</div>

						<div className="grid max-h-[280px] grid-cols-2 gap-2 overflow-y-auto p-3">
							{isLoading && (
								<p className="col-span-2 py-6 text-center text-muted-foreground text-xs">
									جارٍ التحميل...
								</p>
							)}
							{!isLoading && templates.length === 0 && (
								<p className="col-span-2 py-6 text-center text-muted-foreground text-xs">
									لا توجد قوالب مطابقة
								</p>
							)}
							{templates.map((template) => (
								<button
									key={template.id}
									type="button"
									onClick={() => setPreview(template)}
									className={cn(
										"rounded-[4px] border p-2 text-start transition-colors hover:bg-muted/60",
										preview?.id === template.id && "border-primary bg-primary/5",
									)}
								>
									<span className="mb-1 block truncate font-medium text-xs">
										{template.title}
									</span>
									<span className="line-clamp-3 block text-[11px] text-muted-foreground leading-4">
										{template.body}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* المعاينة — تالية في DOM ⇒ يسارًا في RTL */}
					<div className="flex min-w-0 flex-col">
						<div className="border-b px-3 py-2">
							<span className="font-medium text-sm">معاينة القالب</span>
							<span className="block text-[11px] text-muted-foreground">
								{preview
									? `${preview.body.length} شخصية · ${preview.body.trim().split(/\s+/u).length} كلمة`
									: "اختر قالبًا لمعاينته"}
							</span>
						</div>

						<div className="min-h-[200px] flex-1 overflow-y-auto p-3">
							{preview ? (
								<p className="whitespace-pre-wrap text-xs leading-relaxed">{preview.body}</p>
							) : (
								<p className="text-muted-foreground text-xs">لم تختر قالبًا بعد.</p>
							)}
						</div>

						<div className="border-t px-3 py-2">
							<Button
								size="sm"
								className="w-full"
								onClick={confirm}
								disabled={!preview}
							>
								<IconCircleCheck className="size-4" />
								تأكيد القالب
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

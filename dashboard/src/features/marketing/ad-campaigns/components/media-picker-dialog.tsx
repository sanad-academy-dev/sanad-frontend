import { IconRefresh, IconSearch, IconSparkles, IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/features/appointments/hooks/use-upload-file";
import {
	useAdImageLibrary,
	useGenerateAdImage,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-creatives";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import { AD_IMAGE_STYLES } from "@sanad/contracts/runtime/server/ad-creatives/ad-creatives.type";

type Tab = "library" | "ai" | "upload" | "unsplash";

const TABS: { value: Tab; label: string; disabledReason?: string }[] = [
	{ value: "library", label: "المكتبة" },
	{ value: "ai", label: "توليد بالذكاء الاصطناعي" },
	{ value: "upload", label: "رفع صورة" },
	// معطّل في التصميم نفسه — يحتاج مفتاح Unsplash، وهو خارج نطاق الإصدار الأول
	{
		value: "unsplash",
		label: "Unsplash",
		disabledReason: "يتطلب ربط حساب Unsplash — غير مفعّل",
	},
];

/**
 * [MK4] منتقي وسائط الإعلان (شاشات 543191 · 543700 · 544742 · 545251).
 *
 * التبويبات أزرار عادية لا Radix Tabs عمدًا: جذر Tabs يفرض `dir="ltr"` على شجرته
 * (انظر ملاحظة radix-tabs-forces-ltr)، ومحتوى هذه اللوحة عربي بالكامل — فالتفافُ
 * `dir` على كل تبويب أعقد من صفّ أزرار بسيط يفعل الشيء نفسه.
 */
export function MediaPickerDialog({
	open,
	onOpenChange,
	onSelect,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (
		url: string,
		meta: { source: "LIBRARY" | "UPLOAD" | "AI_GENERATED"; prompt?: string; style?: string },
	) => void;
}) {
	const { isRtl } = useI18n();
	const [tab, setTab] = useState<Tab>("library");
	const [search, setSearch] = useState("");
	const [prompt, setPrompt] = useState("");
	const [style, setStyle] = useState("none");
	const [generated, setGenerated] = useState<string | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

	const { images, isLoading } = useAdImageLibrary(open);
	const { generateImage, isPending: isGenerating } = useGenerateAdImage();
	// الرفع يمرّ بالمسار الموحّد للمرفقات — لا نداء fetch يدوي يكرّر عقد الخادم
	const { uploadFile, isPending: isUploading } = useUploadFile();

	const filtered = search.trim()
		? images.filter((url) => url.toLowerCase().includes(search.trim().toLowerCase()))
		: images;

	const runGenerate = async () => {
		if (!prompt.trim()) return;
		try {
			const url = await generateImage({ prompt: prompt.trim(), style });
			setGenerated(url);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر توليد الصورة");
		}
	};

	const handleUpload = async (file: File) => {
		try {
			const uploaded = await uploadFile(file);
			onSelect(uploaded.url, { source: "UPLOAD" });
			onOpenChange(false);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "فشل رفع الصورة");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir={isRtl ? "rtl" : "ltr"}
				className="max-h-[86vh] w-[min(720px,94vw)] gap-0 overflow-hidden p-0 sm:max-w-[720px]"
			>
				<DialogTitle className="sr-only">اختيار صورة الإعلان</DialogTitle>

				<div className="flex items-center gap-1 border-b px-4 py-2">
					{TABS.map((item) => {
						const button = (
							<button
								key={item.value}
								type="button"
								disabled={!!item.disabledReason}
								onClick={() => setTab(item.value)}
								className={cn(
									"rounded-[4px] px-3 py-1.5 text-xs transition-colors",
									tab === item.value
										? "border border-border bg-muted font-medium text-foreground"
										: "text-muted-foreground hover:bg-muted/60",
									item.disabledReason && "cursor-not-allowed opacity-50 hover:bg-transparent",
								)}
							>
								{item.label}
							</button>
						);
						return item.disabledReason ? (
							<DisabledReasonTooltip
								key={item.value}
								reason={item.disabledReason}
							>
								{button}
							</DisabledReasonTooltip>
						) : (
							button
						);
					})}
				</div>

				<div className="max-h-[62vh] overflow-y-auto p-4">
					{tab === "library" && (
						<>
							<InputGroup className="mb-3 w-full">
								<InputGroupAddon align="inline-start">
									<IconSearch />
								</InputGroupAddon>
								<InputGroupInput
									placeholder="البحث..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</InputGroup>

							{isLoading && (
								<p className="py-8 text-center text-muted-foreground text-xs">
									جارٍ التحميل...
								</p>
							)}
							{!isLoading && filtered.length === 0 && (
								<p className="py-8 text-center text-muted-foreground text-xs">
									لا توجد صور بعد — ولّد صورة أو ارفع واحدة، وستظهر هنا في المرّات القادمة.
								</p>
							)}

							<div className="grid grid-cols-3 gap-2">
								{filtered.map((url) => (
									<button
										key={url}
										type="button"
										onClick={() => {
											onSelect(url, { source: "LIBRARY" });
											onOpenChange(false);
										}}
										className="overflow-hidden rounded-[4px] border transition-opacity hover:opacity-90"
									>
										<img
											src={getFileUrl(url) ?? url}
											alt=""
											className="aspect-square w-full object-cover"
										/>
									</button>
								))}
							</div>
						</>
					)}

					{tab === "ai" && (
						<div className="flex flex-col gap-3">
							<Textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								rows={3}
								disabled={isGenerating}
								placeholder="صف الصورة التي تريدها — مثل: مدرّبة بيطرية تفحص قطة صغيرة في أكاديمية مضيئة"
								className="resize-none"
							/>

							<div className="flex flex-wrap gap-1.5">
								{AD_IMAGE_STYLES.map((item) => (
									<button
										key={item.value}
										type="button"
										disabled={isGenerating}
										onClick={() => setStyle(item.value)}
										className={cn(
											"rounded-[4px] border px-2.5 py-1 text-xs transition-colors",
											style === item.value
												? "border-primary bg-primary/10 text-primary"
												: "border-border text-muted-foreground hover:bg-muted/60",
										)}
									>
										{item.label}
									</button>
								))}
							</div>

							{isGenerating && (
								<div className="flex flex-col items-center gap-2 rounded-[4px] border border-dashed py-10">
									<Spinner className="size-5" />
									<p className="text-muted-foreground text-xs">جارٍ انشاء الصورة...</p>
								</div>
							)}

							{!isGenerating && generated && (
								<div className="flex flex-col gap-2">
									<img
										src={getFileUrl(generated) ?? generated}
										alt=""
										className="max-h-[320px] w-full rounded-[4px] border object-contain"
									/>
									{/* «تطبيق» أولًا ⇒ يمينًا في RTL */}
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											onClick={() => {
												onSelect(generated, {
													source: "AI_GENERATED",
													prompt: prompt.trim(),
													style,
												});
												onOpenChange(false);
											}}
										>
											تطبيق
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setGenerated(null);
												void runGenerate();
											}}
										>
											<IconRefresh className="size-4" />
											اعادة
										</Button>
									</div>
								</div>
							)}

							{!isGenerating && !generated && (
								<Button
									size="sm"
									className="self-start"
									onClick={runGenerate}
									disabled={!prompt.trim()}
								>
									<IconSparkles className="size-4" />
									انشاء الصورة
								</Button>
							)}
						</div>
					)}

					{tab === "upload" && (
						<div className="flex flex-col items-center gap-3 rounded-[4px] border border-dashed py-12">
							<IconUpload className="size-6 text-muted-foreground" />
							<p className="text-muted-foreground text-xs">
								اختر صورة من جهازك (JPG أو PNG أو WebP)
							</p>
							<input
								ref={fileInput}
								type="file"
								accept="image/jpeg,image/png,image/webp"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) void handleUpload(file);
									e.target.value = "";
								}}
							/>
							<Button
								size="sm"
								variant="outline"
								disabled={isUploading}
								onClick={() => fileInput.current?.click()}
							>
								{isUploading ? (
									<Spinner className="size-4" />
								) : (
									<IconUpload className="size-4" />
								)}
								اختر ملفًا
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

import {
	IconAngle,
	IconArrowsMaximize,
	IconChartDots,
	IconChevronLeft,
	IconChevronRight,
	IconCircleDot,
	IconContrast,
	IconFlipVertical,
	IconHandMove,
	IconRefresh,
	IconRotate,
	IconRuler,
	IconSparkles,
	IconSquare,
	IconSun,
	IconX,
	IconZoomIn,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAskRadiologyAi } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { ensureCornerstone } from "@/features/services/radiology/viewer/cornerstone";
import { cn } from "@/lib/utils";

// عارض DICOM — Cornerstone3D بمواصفات العارض الطبي القياسية: نافذة/مستوى،
// تكبير وتحريك، تمرير المقاطع بالعجلة، أدوات قياس (طول/زاوية/مساحة)،
// عكس وقلب وتدوير، وإعدادات نافذة CT الجاهزة.

type ToolName =
	| "WindowLevel"
	| "Pan"
	| "Zoom"
	| "Length"
	| "Angle"
	| "RectangleROI"
	| "EllipticalROI"
	| "Probe"
	| "PlanarRotate";

const TOOL_BUTTONS: { name: ToolName; label: string; icon: typeof IconSun }[] = [
	{ name: "WindowLevel", label: "نافذة/مستوى", icon: IconSun },
	{ name: "Pan", label: "تحريك", icon: IconHandMove },
	{ name: "Zoom", label: "تكبير", icon: IconZoomIn },
	{ name: "Length", label: "قياس طول", icon: IconRuler },
	{ name: "Angle", label: "قياس زاوية", icon: IconAngle },
	{ name: "RectangleROI", label: "منطقة مستطيلة", icon: IconSquare },
	{ name: "EllipticalROI", label: "منطقة بيضوية", icon: IconCircleDot },
	{ name: "Probe", label: "قيمة نقطة", icon: IconChartDots },
	{ name: "PlanarRotate", label: "تدوير", icon: IconRotate },
];

/** إعدادات نافذة CT الشائعة — عرض/مركز بالوحدات الهاونسفيلدية */
const CT_PRESETS: { label: string; width: number; center: number }[] = [
	{ label: "أنسجة رخوة", width: 350, center: 50 },
	{ label: "رئة", width: 1500, center: -600 },
	{ label: "عظم", width: 1800, center: 400 },
	{ label: "دماغ", width: 80, center: 40 },
];

let viewportCounter = 0;

export function DicomStackViewer({
	imageIds,
	isCt = false,
	itemId,
}: {
	imageIds: string[];
	isCt?: boolean;
	/** معرّف الفحص — وجوده يفعّل «اسأل الذكاء الاصطناعي» عن منطقة مختارة */
	itemId?: string | null;
}) {
	const elementRef = useRef<HTMLDivElement>(null);
	// biome-ignore lint/suspicious/noExplicitAny: أنواع Cornerstone تُحمَّل ديناميكيًا
	const viewportRef = useRef<any>(null);
	// biome-ignore lint/suspicious/noExplicitAny: كذلك
	const toolGroupRef = useRef<any>(null);
	const idsRef = useRef<{ engine: string; viewport: string; toolGroup: string } | null>(null);

	const [ready, setReady] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTool, setActiveTool] = useState<ToolName>("WindowLevel");
	const [imageIndex, setImageIndex] = useState(0);
	const [voi, setVoi] = useState<{ ww: number; wc: number } | null>(null);
	// مساعد الذكاء الاصطناعي: يُفتح بلوحة جانبية، ويقرأ آخر مستطيل رسمه المدرّب
	const [aiOpen, setAiOpen] = useState(false);
	const [aiQuestion, setAiQuestion] = useState("");
	const [aiAnswer, setAiAnswer] = useState<string | null>(null);
	const [aiError, setAiError] = useState<string | null>(null);
	const { askAi, isPending: isAsking } = useAskRadiologyAi();

	// تهيئة المحرك والأدوات وربطهما بالعنصر — مرة لكل مجموعة صور
	useEffect(() => {
		let cancelled = false;

		const setup = async () => {
			try {
				await ensureCornerstone();
				if (cancelled || !elementRef.current) return;

				const core = await import("@cornerstonejs/core");
				const tools = await import("@cornerstonejs/tools");

				viewportCounter += 1;
				const ids = {
					engine: `radiology-engine-${viewportCounter}`,
					viewport: `radiology-viewport-${viewportCounter}`,
					toolGroup: `radiology-tools-${viewportCounter}`,
				};
				idsRef.current = ids;

				const renderingEngine = new core.RenderingEngine(ids.engine);
				renderingEngine.enableElement({
					viewportId: ids.viewport,
					type: core.Enums.ViewportType.STACK,
					element: elementRef.current,
				});

				// تسجيل الأدوات عالميًا — التسجيل المكرّر عبر عمر الصفحة يُتجاهل
				const toolClasses = [
					tools.WindowLevelTool,
					tools.PanTool,
					tools.ZoomTool,
					tools.StackScrollTool,
					tools.LengthTool,
					tools.AngleTool,
					tools.RectangleROITool,
					tools.EllipticalROITool,
					tools.ProbeTool,
					tools.PlanarRotateTool,
				];
				for (const toolClass of toolClasses) {
					try {
						tools.addTool(toolClass);
					} catch {
						// مسجَّلة سابقًا
					}
				}

				const toolGroup = tools.ToolGroupManager.createToolGroup(ids.toolGroup);
				if (!toolGroup) throw new Error("تعذّر إنشاء مجموعة الأدوات");
				for (const toolClass of toolClasses) {
					toolGroup.addTool(toolClass.toolName);
				}
				toolGroup.addViewport(ids.viewport, ids.engine);

				const { MouseBindings } = tools.Enums;
				// الافتراضي: يسار نافذة/مستوى، يمين تحريك، العجلة تمرير المقاطع
				toolGroup.setToolActive(tools.WindowLevelTool.toolName, {
					bindings: [{ mouseButton: MouseBindings.Primary }],
				});
				toolGroup.setToolActive(tools.PanTool.toolName, {
					bindings: [{ mouseButton: MouseBindings.Secondary }],
				});
				toolGroup.setToolActive(tools.StackScrollTool.toolName, {
					bindings: [{ mouseButton: MouseBindings.Wheel }],
				});

				const viewport = renderingEngine.getViewport(ids.viewport);
				viewportRef.current = viewport;
				toolGroupRef.current = toolGroup;

				// نفتح على منتصف المكدّس: طرفا حجم الرنين/المقطعية شرائح شبه فارغة،
				// فالبدء من الأولى يبدو شاشةً سوداء وإن كان العرض سليمًا
				const startIndex = imageIds.length > 2 ? Math.floor(imageIds.length / 2) : 0;
				// biome-ignore lint/suspicious/noExplicitAny: setStack خاص بعارض المقاطع
				await (viewport as any).setStack(imageIds, startIndex);
				viewport.render();
				setImageIndex(startIndex);

				// قراءة النافذة الأولية من الملف — حدث VOI_MODIFIED لا يقع قبل أول تعديل
				try {
					// biome-ignore lint/suspicious/noExplicitAny: قراءة خصائص العارض
					const initial = (viewport as any).getProperties()?.voiRange;
					if (initial) {
						setVoi({
							ww: Math.round(initial.upper - initial.lower),
							wc: Math.round((initial.upper + initial.lower) / 2),
						});
					}
				} catch {
					// تجاهُل — قراءة العرض فقط
				}

				// مؤشرا الصورة الحالية والنافذة — يُقرآن من أحداث العارض
				elementRef.current.addEventListener(core.Enums.Events.STACK_NEW_IMAGE, ((
					e: CustomEvent<{ imageIdIndex: number }>,
				) => {
					setImageIndex(e.detail.imageIdIndex ?? 0);
				}) as EventListener);
				elementRef.current.addEventListener(core.Enums.Events.VOI_MODIFIED, (() => {
					try {
						// biome-ignore lint/suspicious/noExplicitAny: قراءة خصائص العارض
						const range = (viewport as any).getProperties()?.voiRange;
						if (range) {
							const ww = Math.round(range.upper - range.lower);
							const wc = Math.round((range.upper + range.lower) / 2);
							setVoi({ ww, wc });
						}
					} catch {
						// تجاهُل — قراءة العرض فقط
					}
				}) as EventListener);

				if (!cancelled) setReady(true);
			} catch (e) {
				console.error("[radiology-viewer] فشل تهيئة العارض:", e);
				if (!cancelled) setError("تعذّر تشغيل عارض DICOM — تحقّق من الملفات والمتصفح");
			}
		};

		void setup();

		return () => {
			cancelled = true;
			const ids = idsRef.current;
			if (!ids) return;
			void import("@cornerstonejs/tools").then((tools) => {
				try {
					tools.ToolGroupManager.destroyToolGroup(ids.toolGroup);
				} catch {
					// أُتلفت سابقًا
				}
			});
			void import("@cornerstonejs/core").then((core) => {
				try {
					core.getRenderingEngine(ids.engine)?.destroy();
				} catch {
					// أُتلف سابقًا
				}
			});
		};
	}, [imageIds]);

	/** تفعيل أداة الزر الأيسر — البقية تحتفظ بارتباطاتها الثابتة */
	const activateTool = async (name: ToolName) => {
		const toolGroup = toolGroupRef.current;
		if (!toolGroup) return;
		const tools = await import("@cornerstonejs/tools");
		const { MouseBindings } = tools.Enums;
		// تعطيل الأداة الأساسية السابقة ثم تفعيل الجديدة على الزر الأيسر
		for (const { name: toolName } of TOOL_BUTTONS) {
			if (toolGroup.getToolInstance(toolName)) {
				toolGroup.setToolPassive(toolName);
			}
		}
		toolGroup.setToolActive(name === "Pan" ? tools.PanTool.toolName : name, {
			bindings: [{ mouseButton: MouseBindings.Primary }],
		});
		// التحريك بالزر الأيمن والتمرير بالعجلة يبقيان دائمًا
		toolGroup.setToolActive(tools.PanTool.toolName, {
			bindings: [{ mouseButton: MouseBindings.Secondary }],
		});
		toolGroup.setToolActive(tools.StackScrollTool.toolName, {
			bindings: [{ mouseButton: MouseBindings.Wheel }],
		});
		setActiveTool(name);
	};

	const withViewport = (fn: (viewport: NonNullable<typeof viewportRef.current>) => void) => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		try {
			fn(viewport);
			viewport.render();
		} catch (e) {
			console.error("[radiology-viewer] فشل تنفيذ الإجراء:", e);
		}
	};

	const invert = () =>
		withViewport((vp) => {
			const props = vp.getProperties();
			vp.setProperties({ invert: !props.invert });
		});

	const flipHorizontal = () =>
		withViewport((vp) => {
			const camera = vp.getCamera();
			vp.setCamera({ flipHorizontal: !camera.flipHorizontal });
		});

	/**
	 * إعادة ضبط شاملة: النافذة والعكس والتكبير والتحريك والتدوير والقلب،
	 * إضافةً إلى مسح القياسات المرسومة — «كما فُتحت الدراسة أول مرة».
	 */
	const reset = async () => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		try {
			const tools = await import("@cornerstonejs/tools");
			tools.annotation.state.removeAllAnnotations();
		} catch (e) {
			console.error("[radiology-viewer] تعذّر مسح القياسات:", e);
		}
		withViewport((vp) => {
			vp.resetCamera();
			vp.resetProperties?.();
			// resetCamera لا يُرجع القلب ولا التدوير — نصفّرهما صراحةً
			vp.setCamera({ flipHorizontal: false, flipVertical: false });
			vp.setViewPresentation?.({ rotation: 0 });
		});
		// إعادة قراءة النافذة الأصلية بعد التصفير
		try {
			// biome-ignore lint/suspicious/noExplicitAny: قراءة خصائص العارض
			const range = (viewport as any).getProperties()?.voiRange;
			if (range) {
				setVoi({
					ww: Math.round(range.upper - range.lower),
					wc: Math.round((range.upper + range.lower) / 2),
				});
			}
		} catch {
			// تجاهُل — قراءة العرض فقط
		}
	};

	/**
	 * يقتطع آخر مستطيل رسمه المدرّب من لوحة العرض ويرسله مع سؤاله.
	 * نقرأ المستطيل من حالة القياسات لا من حالة محلية، فما يراه هو ما يُرسَل.
	 */
	const handleAsk = async () => {
		if (!itemId) return;
		setAiError(null);
		setAiAnswer(null);
		const viewport = viewportRef.current;
		const element = elementRef.current;
		if (!viewport || !element) return;

		try {
			const tools = await import("@cornerstonejs/tools");
			const annotations =
				tools.annotation.state.getAnnotations(tools.RectangleROITool.toolName, element) ?? [];
			const last = annotations.at(-1);
			// biome-ignore lint/suspicious/noExplicitAny: شكل نقاط المقبض داخلي
			const points = (last as any)?.data?.handles?.points as number[][] | undefined;
			if (!points || points.length < 2) {
				setAiError("ارسم مستطيلًا على المنطقة التي تسأل عنها أولًا");
				return;
			}

			// نقاط العالم → إحداثيات اللوحة، ثم صندوق محيط بها
			const canvasPoints = points.map((p) =>
				viewport.worldToCanvas(p as [number, number, number]),
			);
			const xs = canvasPoints.map((p: number[]) => p[0]);
			const ys = canvasPoints.map((p: number[]) => p[1]);
			const left = Math.max(0, Math.floor(Math.min(...xs)));
			const top = Math.max(0, Math.floor(Math.min(...ys)));
			const width = Math.ceil(Math.max(...xs) - Math.min(...xs));
			const height = Math.ceil(Math.max(...ys) - Math.min(...ys));
			if (width < 8 || height < 8) {
				setAiError("المنطقة المحدّدة صغيرة جدًا — ارسم مستطيلًا أوسع");
				return;
			}

			const source: HTMLCanvasElement = viewport.getCanvas();
			const crop = document.createElement("canvas");
			crop.width = width;
			crop.height = height;
			const ctx = crop.getContext("2d");
			if (!ctx) {
				setAiError("تعذّر اقتطاع المنطقة من الصورة");
				return;
			}
			ctx.drawImage(source, left, top, width, height, 0, 0, width, height);

			const result = await askAi({
				itemId,
				imageDataUrl: crop.toDataURL("image/png"),
				question: aiQuestion.trim(),
			});
			setAiAnswer(result.answer);
		} catch (e) {
			console.error("[radiology-viewer] فشل سؤال الذكاء الاصطناعي:", e);
			setAiError(e instanceof Error ? e.message : "تعذّر الحصول على إجابة");
		}
	};

	/** يفتح المساعد ويفعّل أداة المستطيل مباشرةً ليبدأ التحديد */
	const openAiPanel = () => {
		setAiOpen(true);
		void activateTool("RectangleROI");
	};

	/** الانتقال إلى صورة بعينها — يغذّيه الشريط المنزلق وأزرار السهمين */
	const goToImage = (index: number) => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		const clamped = Math.min(imageIds.length - 1, Math.max(0, index));
		setImageIndex(clamped);
		try {
			// biome-ignore lint/suspicious/noExplicitAny: setImageIdIndex خاص بعارض المقاطع
			void (viewport as any).setImageIdIndex(clamped);
		} catch (e) {
			console.error("[radiology-viewer] تعذّر الانتقال إلى الصورة:", e);
		}
	};

	const applyPreset = (width: number, center: number) =>
		withViewport((vp) => {
			vp.setProperties({
				voiRange: { lower: center - width / 2, upper: center + width / 2 },
			});
		});

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-2">
			{/* شريط الأدوات */}
			<div className="flex flex-wrap items-center gap-1">
				{TOOL_BUTTONS.map(({ name, label, icon: Icon }) => (
					<button
						key={name}
						type="button"
						title={label}
						aria-pressed={activeTool === name}
						className={cn(
							"flex size-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 transition-colors hover:bg-neutral-800",
							activeTool === name && "border-indigo-500 bg-indigo-600/30 text-white",
						)}
						onClick={() => void activateTool(name)}
					>
						<Icon className="size-4" />
					</button>
				))}
				<span className="mx-1 h-5 w-px bg-neutral-700" />
				<button
					type="button"
					title="عكس الألوان"
					className="flex size-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
					onClick={invert}
				>
					<IconContrast className="size-4" />
				</button>
				<button
					type="button"
					title="قلب أفقي"
					className="flex size-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
					onClick={flipHorizontal}
				>
					<IconFlipVertical className="size-4 rotate-90" />
				</button>
				<button
					type="button"
					title="إرجاع الصورة كما فُتحت: النافذة والتكبير والتحريك والتدوير والقلب، ومسح القياسات"
					className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-700 px-2.5 text-[11px] text-neutral-300 hover:bg-neutral-800"
					onClick={() => void reset()}
				>
					<IconRefresh className="size-4" />
					إعادة الضبط
				</button>
				{itemId && (
					<button
						type="button"
						aria-pressed={aiOpen}
						title="حدّد منطقة من الصورة واسأل الذكاء الاصطناعي عنها"
						className={cn(
							"flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px]",
							aiOpen
								? "border-indigo-500 bg-indigo-600/30 text-white"
								: "border-neutral-700 text-neutral-300 hover:bg-neutral-800",
						)}
						onClick={() => (aiOpen ? setAiOpen(false) : openAiPanel())}
					>
						<IconSparkles className="size-4" />
						اسأل الذكاء الاصطناعي
					</button>
				)}
				<button
					type="button"
					title="ملء الشاشة"
					className="flex size-8 items-center justify-center rounded-md border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
					onClick={() => void elementRef.current?.parentElement?.requestFullscreen()}
				>
					<IconArrowsMaximize className="size-4" />
				</button>
				{isCt && (
					<>
						<span className="mx-1 h-5 w-px bg-neutral-700" />
						{CT_PRESETS.map((preset) => (
							<button
								key={preset.label}
								type="button"
								className="rounded-md border border-neutral-700 px-2 py-1.5 text-[11px] text-neutral-300 hover:bg-neutral-800"
								onClick={() => applyPreset(preset.width, preset.center)}
							>
								{preset.label}
							</button>
						))}
					</>
				)}
			</div>

			{/* منفذ العرض ولوحة المساعد جنبًا إلى جنب */}
			<div className="flex min-h-0 flex-1 gap-2">
				{/* منفذ العرض — القائمة اليمنى معطّلة ليعمل التحريك بالزر الأيمن */}
				<div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-neutral-800 bg-black">
					<div
						ref={elementRef}
						// منفذ عرض تفاعلي (أدوات الفأرة كلها) — القائمة اليمنى معطّلة للتحريك
						role="application"
						className="absolute inset-0"
						onContextMenu={(e) => e.preventDefault()}
					/>
					{!ready && !error && (
						<div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
							جارٍ تحميل الصور...
						</div>
					)}
					{error && (
						<div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-red-400">
							{error}
						</div>
					)}

					{/* معلومات التراكب — الصورة الحالية والنافذة، بأسلوب العارض القياسي */}
					{ready && (
						<>
							<div
								className="pointer-events-none absolute bottom-2 left-2 text-[11px] text-emerald-400"
								dir="ltr"
							>
								{voi ? `WW ${voi.ww} / WL ${voi.wc}` : ""}
							</div>
							<div
								className="pointer-events-none absolute bottom-2 right-2 text-[11px] tabular-nums text-neutral-300"
								dir="ltr"
							>
								{imageIndex + 1} / {imageIds.length}
							</div>
						</>
					)}
				</div>

				{/* مساعد الذكاء الاصطناعي — يقرأ المنطقة المرسومة ويجيب عن سؤال المدرّب */}
				{aiOpen && itemId && (
					<aside
						dir="rtl"
						className="flex w-72 shrink-0 flex-col gap-2 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 p-3"
					>
						<div className="flex items-center justify-between gap-2">
							<span className="flex items-center gap-1.5 text-sm font-semibold text-white">
								<IconSparkles className="size-4 text-indigo-400" />
								اسأل عن منطقة
							</span>
							<button
								type="button"
								aria-label="إغلاق المساعد"
								className="rounded p-1 text-neutral-400 hover:text-white"
								onClick={() => setAiOpen(false)}
							>
								<IconX className="size-4" />
							</button>
						</div>

						<p className="rounded border border-neutral-800 bg-neutral-950 p-2 text-[11px] leading-relaxed text-neutral-400">
							ارسم مستطيلًا على المنطقة التي تسأل عنها (أداة المستطيل مفعّلة)، ثم اكتب سؤالك.
							تُرسل تلك المنطقة وحدها مع سياق الفحص.
						</p>

						<Textarea
							rows={3}
							dir="rtl"
							value={aiQuestion}
							onChange={(e) => setAiQuestion(e.target.value)}
							placeholder="مثال: ما طبيعة هذه الكتلة؟ وهل حدودها منتظمة؟"
							className="border-neutral-700 bg-neutral-950 text-sm primaryplaceholder:text-neutral-500"
						/>

						<Button
							type="button"
							size="sm"
							disabled={isAsking || !aiQuestion.trim()}
							className="bg-indigo-600 primaryhover:bg-indigo-700"
							onClick={() => void handleAsk()}
						>
							{isAsking ? "جارٍ التحليل..." : "اسأل"}
						</Button>

						{aiError && (
							<p className="rounded border border-amber-700 bg-amber-950/40 p-2 text-[11px] text-amber-300">
								{aiError}
							</p>
						)}

						{aiAnswer && (
							<div className="flex flex-col gap-1.5">
								<p className="whitespace-pre-wrap rounded border border-neutral-800 bg-neutral-950 p-2 text-[12px] leading-relaxed text-neutral-200">
									{aiAnswer}
								</p>
								{/* رأي مساعد لا تشخيص — المدرّب ينقل ما يراه صحيحًا لتقريره */}
								<p className="text-[10px] text-neutral-500">
									رأي مساعد للقراءة فقط — التشخيص والتقرير من مسؤولية المدرّب.
								</p>
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
									onClick={() => void navigator.clipboard.writeText(aiAnswer)}
								>
									نسخ النص
								</Button>
							</div>
						)}
					</aside>
				)}
			</div>

			{/* شريط تصفّح الصور — بديل عجلة الفأرة لمن لا يملكها (لوحة لمس/قلم) */}
			{imageIds.length > 1 && (
				<div
					className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5"
					dir="ltr"
				>
					<button
						type="button"
						aria-label="الصورة السابقة"
						disabled={imageIndex === 0}
						className="flex size-7 shrink-0 items-center justify-center rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30"
						onClick={() => goToImage(imageIndex - 1)}
					>
						<IconChevronLeft className="size-4" />
					</button>
					<input
						type="range"
						min={0}
						max={imageIds.length - 1}
						step={1}
						value={imageIndex}
						aria-label="تصفّح صور الدراسة"
						className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-700 accent-indigo-500"
						onChange={(e) => goToImage(Number(e.target.value))}
					/>
					<button
						type="button"
						aria-label="الصورة التالية"
						disabled={imageIndex === imageIds.length - 1}
						className="flex size-7 shrink-0 items-center justify-center rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30"
						onClick={() => goToImage(imageIndex + 1)}
					>
						<IconChevronRight className="size-4" />
					</button>
					<span className="shrink-0 text-[11px] tabular-nums text-neutral-400">
						{imageIndex + 1} / {imageIds.length}
					</span>
				</div>
			)}
		</div>
	);
}

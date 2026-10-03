import { IconMicrophone, IconPlus, IconSparkles } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { RequiredMark } from "@/components/common/required-mark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AdPreviewCard } from "@/features/marketing/ad-campaigns/components/ad-preview-card";
import { AddAudienceDialog } from "@/features/marketing/ad-campaigns/components/add-audience-dialog";
import { AiSuggestionCard } from "@/features/marketing/ad-campaigns/components/ai-suggestion-card";
import { AudienceCard } from "@/features/marketing/ad-campaigns/components/audience-card";
import { LaunchingDialog } from "@/features/marketing/ad-campaigns/components/launching-dialog";
import { MediaPickerDialog } from "@/features/marketing/ad-campaigns/components/media-picker-dialog";
import {
	type BudgetState,
	durationDays,
	StepBudget,
} from "@/features/marketing/ad-campaigns/components/step-budget";
import { TemplatePopover } from "@/features/marketing/ad-campaigns/components/template-popover";
import {
	DEFAULT_TONE,
	TonePopover,
	type ToneState,
} from "@/features/marketing/ad-campaigns/components/tone-popover";
import {
	type WizardStepKey,
	WizardStepper,
} from "@/features/marketing/ad-campaigns/components/wizard-stepper";
import {
	type SuggestedAudienceView,
	useAdAudiences,
	useCreateAdAudience,
	useSuggestAudiences,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-audiences";
import {
	useCreateAdCampaign,
	useLaunchAdCampaign,
	useSaveAdCreative,
	useSetAdCampaignSchedule,
	useUpdateAdCampaign,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-campaign-mutations";
import {
	type AdCopySuggestionView,
	useGenerateAdCopy,
} from "@/features/marketing/ad-campaigns/hooks/use-ad-creatives";
import {
	useEnsureDefaultAccount,
	useMarketingAccounts,
} from "@/features/marketing/ad-campaigns/hooks/use-marketing-accounts";
import type { AdCreativeSource, AdObjective } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import {
	AD_OBJECTIVE_LABELS,
	type SupportedAdPlatform,
} from "@sanad/contracts/runtime/server/ad-campaigns/ad-campaigns.type";

const OBJECTIVES = Object.entries(AD_OBJECTIVE_LABELS) as [AdObjective, string][];

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_BUDGET: BudgetState = {
	startsAt: "",
	endsAt: "",
	budgetKind: "DAILY",
	budgetAmount: "",
};

/**
 * [MK2–MK6] معالج إنشاء الحملة، ثلاث خطوات.
 *
 * التخطيط لوحتان: المعاينة الحيّة بصريًّا **يسارًا**، والنموذج **يمينًا**. الحوار
 * يرث `rtl`، فأوّل ابن في DOM يقع يمينًا — النموذج يُكتب أولًا ثم المعاينة، ولا
 * نصحّح الجهات بـ `justify-*` (قاعدة RTL رقم 1).
 *
 * الحملة تُنشأ فعليًّا عند مغادرة الخطوة الأولى لا عند الإطلاق: الخطوتان التاليتان
 * تحفظان على سجل قائم، ومسوّدة محفوظة تنجو من إغلاق النافذة بالخطأ.
 */
export function CampaignWizardDialog({
	platform,
	open,
	onOpenChange,
	onLaunched,
}: {
	platform: SupportedAdPlatform | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onLaunched?: (summary: string) => void;
}) {
	const { isRtl } = useI18n();

	const [step, setStep] = useState<WizardStepKey>("ad");
	const [campaignId, setCampaignId] = useState<string | null>(null);

	// الخطوة 1
	const [accountId, setAccountId] = useState("");
	const [objective, setObjective] = useState<AdObjective | "">("");
	const [primaryText, setPrimaryText] = useState("");
	const [tone, setTone] = useState<ToneState>(DEFAULT_TONE);
	const [suggestions, setSuggestions] = useState<AdCopySuggestionView[]>([]);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageMeta, setImageMeta] = useState<{
		source: AdCreativeSource;
		prompt?: string;
		style?: string;
	}>({ source: "TEMPLATE" });
	const [mediaOpen, setMediaOpen] = useState(false);

	// الخطوة 2
	const [audienceId, setAudienceId] = useState<string | null>(null);
	const [aiAudiences, setAiAudiences] = useState<SuggestedAudienceView[]>([]);
	const [addAudienceOpen, setAddAudienceOpen] = useState(false);

	// الخطوة 3
	const [budget, setBudget] = useState<BudgetState>(EMPTY_BUDGET);
	const [launchOpen, setLaunchOpen] = useState(false);

	const { accounts } = useMarketingAccounts(platform ?? undefined, !!platform && open);
	const { ensureDefault } = useEnsureDefaultAccount();
	const { audiences } = useAdAudiences(open);

	const { createCampaign, isPending: isCreating } = useCreateAdCampaign();
	const { saveCreative, isPending: isSavingCreative } = useSaveAdCreative();
	const { updateCampaign } = useUpdateAdCampaign();
	const { setSchedule, isPending: isSavingSchedule } = useSetAdCampaignSchedule();
	const { generateCopy, isPending: isGeneratingCopy } = useGenerateAdCopy();
	const { suggest, isPending: isSuggesting } = useSuggestAudiences();
	const { createAudience } = useCreateAdAudience();
	const { launch, isPending: isLaunching, error: launchError } = useLaunchAdCampaign();

	useEffect(() => {
		if (open && platform) void ensureDefault(platform).catch(() => {});
	}, [open, platform, ensureDefault]);

	// أعِد كل شيء عند الفتح — حوار يحتفظ بمدخلات حملة سابقة يُنشئ حملة لا يقصدها أحد
	useEffect(() => {
		if (!open) return;
		setStep("ad");
		setCampaignId(null);
		setAccountId("");
		setObjective("");
		setPrimaryText("");
		setTone(DEFAULT_TONE);
		setSuggestions([]);
		setImageUrl(null);
		setImageMeta({ source: "TEMPLATE" });
		setAudienceId(null);
		setAiAudiences([]);
		setBudget({ ...EMPTY_BUDGET, startsAt: today() });
	}, [open]);

	// قائمة إلزامية بخيار واحد هي نقرة بلا قرار
	useEffect(() => {
		if (accounts.length === 1 && !accountId) setAccountId(accounts[0].id);
	}, [accounts, accountId]);

	const selectedAccount = accounts.find((a) => a.id === accountId);
	const selectedAudience = audiences.find((a) => a.id === audienceId);
	const isBusy =
		isCreating || isSavingCreative || isSavingSchedule || isGeneratingCopy || isLaunching;

	const step1Complete = !!platform && !!accountId && !!objective && !!primaryText.trim();
	const budgetDays = durationDays(budget.startsAt, budget.endsAt);
	const step3Complete = !!budgetDays && Number(budget.budgetAmount) > 0;

	const missingForLaunch = useMemo(() => {
		const missing: string[] = [];
		if (!imageUrl) missing.push("صورة الإعلان");
		if (!audienceId) missing.push("الجمهور");
		if (!step3Complete) missing.push("الجدولة والميزانية");
		return missing;
	}, [imageUrl, audienceId, step3Complete]);

	/**
	 * يحفظ نصّ الإعلان وصورته، ويُنشئ الحملة إن لم تكن أُنشئت بعد.
	 *
	 * تُستدعى عند مغادرة الخطوة الأولى **وقبل الإطلاق**. الثانية ليست احتياطًا:
	 * لوحة المعاينة ظاهرة في الخطوات الثلاث كلّها وزرّ اختيار الصورة فيها، فمن
	 * يختار صورةً وهو في خطوة الجمهور أو الميزانية كان يراها في المعاينة بينما
	 * الخادم لا يعلم بها — فيرفض الإطلاق بحجّة «ينقصها صورة الإعلان» أمام مستخدم
	 * يرى الصورة أمامه.
	 */
	const persistCreative = async (): Promise<string | null> => {
		if (!platform || !objective) return null;
		let id = campaignId;

		if (!id) {
			const created = await createCampaign({
				// اسم الحملة = تسمية الهدف، كما يعرض عمود «اسم الحملة الاعلانية»
				name: AD_OBJECTIVE_LABELS[objective as AdObjective],
				platform,
				objective: objective as AdObjective,
				socialAccountId: accountId,
			});
			id = (created as { id?: string } | undefined)?.id ?? null;
			if (!id) return null;
			setCampaignId(id);
		}

		await saveCreative({
			id,
			primaryText: primaryText.trim(),
			imageUrl,
			source: imageMeta.source,
			aiPrompt: imageMeta.prompt ?? null,
			aiStyle: imageMeta.style ?? null,
			toneFormal: tone.formal,
			toneFriendly: tone.friendly,
			toneOptimist: tone.optimist,
		});

		return id;
	};

	const goToAudience = async () => {
		try {
			const id = await persistCreative();
			if (!id) return;
			setStep("audience");
			// نولّد الاقتراحات مرّة واحدة عند أول دخول — إعادة التوليد في كل رجوع
			// تُبدّل ما تحت يد المستخدم بلا سبب
			if (aiAudiences.length === 0 && objective) {
				suggest({ objective: objective as AdObjective })
					.then(setAiAudiences)
					.catch(() => {});
			}
		} catch {
			// الإشعار يعرض السبب؛ يبقى الحوار مفتوحًا كي لا تضيع المدخلات
		}
	};

	const goToBudget = () => setStep("budget");

	const runGenerateCopy = async (seedText?: string) => {
		if (!platform || !objective) return;
		try {
			const result = await generateCopy({
				objective: objective as AdObjective,
				platform,
				brief: primaryText.trim() || null,
				seedText: seedText ?? null,
				toneFormal: tone.formal,
				toneFriendly: tone.friendly,
				toneOptimist: tone.optimist,
			});
			setSuggestions(result);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "تعذّر توليد نصّ الإعلان");
		}
	};

	const handleLaunch = async () => {
		if (!campaignId) return;
		setLaunchOpen(true);
		try {
			// الصورة قد تكون اختيرت من لوحة المعاينة وهي ظاهرة في خطوةٍ لاحقة، فلم
			// يمرّ بها أي حفظ. نُثبّت المادّة الإعلانية أولًا كي يطابق الخادمُ ما يراه
			// المستخدم قبل أن يفحص الجاهزية.
			await persistCreative();

			await setSchedule({
				id: campaignId,
				startsAt: budget.startsAt,
				endsAt: budget.endsAt,
				budgetKind: budget.budgetKind,
				budgetAmount: Number(budget.budgetAmount),
			});
			// الجمهور يُربط بالحملة قبل الإطلاق — فحص الجاهزية في الخادم يطلبه
			if (audienceId) await updateCampaign({ id: campaignId, audienceId });
			const result = await launch(campaignId);
			setLaunchOpen(false);
			onLaunched?.(result.summary);
			onOpenChange(false);
		} catch {
			// النافذة تبقى مفتوحة وتعرض الخطأ ومسار إعادة المحاولة
		}
	};

	const footer = (
		<div className="flex items-center gap-2 border-t px-4 py-2">
			{step === "ad" && (
				<Button
					size="sm"
					onClick={goToAudience}
					disabled={!step1Complete || isBusy}
				>
					{isCreating || isSavingCreative ? <Spinner className="size-4" /> : null}
					التالي
				</Button>
			)}

			{step === "audience" && (
				<>
					<Button
						size="sm"
						onClick={goToBudget}
						disabled={!audienceId || isBusy}
					>
						التالي
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setStep("ad")}
						disabled={isBusy}
					>
						السابق
					</Button>
				</>
			)}

			{step === "budget" && (
				<>
					<DisabledReasonTooltip
						reason={
							missingForLaunch.length
								? `ينقص الحملة: ${missingForLaunch.join("، ")}`
								: undefined
						}
					>
						<Button
							size="sm"
							onClick={handleLaunch}
							disabled={missingForLaunch.length > 0 || isBusy}
						>
							إطلاق الحملة
						</Button>
					</DisabledReasonTooltip>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setStep("audience")}
						disabled={isBusy}
					>
						السابق
					</Button>
				</>
			)}

			<Button
				size="sm"
				variant="ghost"
				onClick={() => onOpenChange(false)}
				disabled={isBusy}
			>
				إلغاء
			</Button>
		</div>
	);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={onOpenChange}
			>
				{/* محتوى Radix في portal — الاتجاه صراحةً. `DialogContent` شبكة أصلًا:
				    نلتزم max-h + تمرير الجسم ولا نفرض flex فوقها (قاعدة RTL رقم 7) */}
				<DialogContent
					dir={isRtl ? "rtl" : "ltr"}
					showCloseButton={false}
					className="max-h-[88vh] w-[min(1060px,95vw)] gap-0 overflow-hidden p-0 sm:max-w-[1060px]"
				>
					<DialogTitle className="sr-only">إنشاء حملة إعلانية</DialogTitle>

					<div className="grid max-h-[88vh] grid-cols-1 overflow-hidden md:grid-cols-2">
						{/* النموذج أولًا في DOM ⇒ يمينًا في RTL */}
						<div className="flex min-h-0 flex-col overflow-hidden border-s">
							<div className="border-b px-4 py-2">
								<h2 className="font-semibold text-base">إنشاء حملة إعلانية</h2>
								<p className="text-muted-foreground text-xs">
									أنشئ حملات تُشرك جمهورك وتُلهم وتُحقق النتائج
								</p>
							</div>

							<div className="border-b px-4 py-3">
								<WizardStepper current={step} />
							</div>

							<div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
								{step === "ad" && (
									<>
										<div>
											<h3 className="mb-2 font-medium text-sm">تفاصيل الإعلان</h3>
											<div className="grid grid-cols-2 gap-3">
												<FormField
													label={platform === "INSTAGRAM" ? "حساب إنستغرام" : "حساب فيسبوك"}
												>
													<Select
														value={accountId}
														onValueChange={setAccountId}
														disabled={isBusy}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="اختر صفحة المنصّة" />
														</SelectTrigger>
														<SelectContent position="popper">
															{accounts.map((account) => (
																<SelectItem
																	key={account.id}
																	value={account.id}
																>
																	{account.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormField>

												<FormField label="الهدف">
													<Select
														value={objective}
														onValueChange={(v) => setObjective(v as AdObjective)}
														disabled={isBusy}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="اختر الهدف" />
														</SelectTrigger>
														<SelectContent position="popper">
															{OBJECTIVES.map(([value, label]) => (
																<SelectItem
																	key={value}
																	value={value}
																>
																	{label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormField>
											</div>
										</div>

										<div>
											<h3 className="font-medium text-sm">صف إعلانك</h3>
											<p className="mb-2 text-muted-foreground text-xs">
												تفاصيل الإعلان تم إنشاؤها بناءً على الهدف المختار
											</p>

											<div className="rounded-[4px] border">
												<div className="flex items-center justify-end gap-2 border-b px-2 py-1.5">
													<TonePopover
														tone={tone}
														onChange={setTone}
														disabled={isBusy}
													/>
													<TemplatePopover
														disabled={isBusy}
														onApply={(template) => setPrimaryText(template.body)}
													/>
												</div>

												<Textarea
													value={primaryText}
													onChange={(e) => setPrimaryText(e.target.value)}
													disabled={isBusy}
													rows={5}
													placeholder="أدخل وصف الإعلان هنا..."
													className="resize-none rounded-none border-0 shadow-none focus-visible:ring-0"
												/>

												<div className="flex items-center justify-between border-t px-2 py-1.5">
													<DisabledReasonTooltip reason="الإدخال الصوتي غير مفعّل بعد">
														<Button
															size="xs"
															variant="ghost"
															disabled
														>
															<IconMicrophone className="size-3.5" />
														</Button>
													</DisabledReasonTooltip>

													<DisabledReasonTooltip
														reason={objective ? undefined : "اختر هدف الحملة أولًا"}
													>
														<Button
															size="xs"
															variant="ghost"
															className="text-primary"
															disabled={!objective || isBusy}
															onClick={() => void runGenerateCopy()}
														>
															{isGeneratingCopy ? (
																<Spinner className="size-3.5" />
															) : (
																<IconSparkles className="size-3.5" />
															)}
															انشاء بالذكاء الاصطناعي
														</Button>
													</DisabledReasonTooltip>
												</div>
											</div>
										</div>

										{isGeneratingCopy && (
											<div className="flex flex-col items-center gap-2 rounded-[4px] border border-dashed py-8">
												<Spinner className="size-5" />
												<p className="text-muted-foreground text-xs">
													جارٍ توليد نص الإعلان...
												</p>
											</div>
										)}

										{!isGeneratingCopy && suggestions.length > 0 && (
											<div>
												<h3 className="mb-2 font-medium text-sm">النتيجة المُوَلَّدة</h3>
												<div className="flex flex-col gap-2">
													{suggestions.map((suggestion) => (
														<AiSuggestionCard
															key={suggestion.text}
															suggestion={suggestion}
															isBusy={isBusy}
															onApply={() => setPrimaryText(suggestion.text)}
															onSimilar={() => void runGenerateCopy(suggestion.text)}
														/>
													))}
												</div>
											</div>
										)}
									</>
								)}

								{step === "audience" && (
									<>
										<div>
											<div className="mb-2 flex items-center justify-between gap-2">
												<h3 className="font-medium text-sm">توصيات الذكاء الاصطناعي</h3>
												{isSuggesting && <Spinner className="size-4" />}
											</div>

											{!isSuggesting && aiAudiences.length === 0 && (
												<p className="rounded-[4px] border border-dashed p-3 text-muted-foreground text-xs">
													لا توجد توصيات — اختر من الجماهير المحفوظة أو أضف جمهورًا جديدًا.
												</p>
											)}

											<div className="flex flex-col gap-2">
												{aiAudiences.map((suggestion) => (
													<AudienceCard
														key={suggestion.name}
														audience={{
															name: suggestion.name,
															ageMin: suggestion.ageMin,
															ageMax: suggestion.ageMax,
															locations: suggestion.locations,
															languages: suggestion.languages,
															estimatedReach: null,
															isAiSuggested: true,
															aiRationale: suggestion.rationale,
														}}
														onSelect={() => {
															// الاقتراح يُحفظ عند اختياره: الحملة ترتبط بسجل
															// جمهور، ولا يمكن ربطها باقتراح عابر في الذاكرة
															void createAudience({
																...suggestion,
																isAiSuggested: true,
																aiRationale: suggestion.rationale,
															}).then((saved) => setAudienceId(saved.id));
														}}
													/>
												))}
											</div>
										</div>

										<div>
											<div className="mb-2 flex items-center justify-between gap-2">
												<h3 className="font-medium text-sm">الجمهور المتاح</h3>
												<Button
													size="xs"
													variant="outline"
													onClick={() => setAddAudienceOpen(true)}
												>
													<IconPlus className="size-3.5" />
													إضافة جمهور جديد
												</Button>
											</div>

											{audiences.length === 0 && (
												<p className="rounded-[4px] border border-dashed p-3 text-muted-foreground text-xs">
													لم تحفظ جماهير بعد.
												</p>
											)}

											<div className="flex flex-col gap-2">
												{audiences.map((audience) => (
													<AudienceCard
														key={audience.id}
														audience={audience}
														selected={audienceId === audience.id}
														onSelect={() => setAudienceId(audience.id)}
													/>
												))}
											</div>
										</div>
									</>
								)}

								{step === "budget" && (
									<StepBudget
										value={budget}
										onChange={setBudget}
										disabled={isBusy}
									/>
								)}
							</div>

							{footer}
						</div>

						{/* المعاينة — تالية في DOM ⇒ يسارًا في RTL */}
						<div className="flex min-h-0 flex-col overflow-hidden bg-muted/30">
							<div className="border-b px-4 py-2">
								<h2 className="font-semibold text-base">معاينة الاعلان</h2>
							</div>
							<div className="min-h-0 flex-1 overflow-y-auto p-4">
								<AdPreviewCard
									pageName={selectedAccount?.name}
									primaryText={primaryText}
									imageUrl={imageUrl ? (getFileUrl(imageUrl) ?? imageUrl) : null}
									onPickImage={() => setMediaOpen(true)}
								/>

								{step === "audience" && selectedAudience && (
									<p className="mt-3 text-muted-foreground text-xs">
										الجمهور المختار: {selectedAudience.name}
									</p>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<MediaPickerDialog
				open={mediaOpen}
				onOpenChange={setMediaOpen}
				onSelect={(url, meta) => {
					setImageUrl(url);
					setImageMeta({
						source: meta.source,
						...(meta.prompt ? { prompt: meta.prompt } : {}),
						...(meta.style ? { style: meta.style } : {}),
					});
				}}
			/>

			<AddAudienceDialog
				open={addAudienceOpen}
				onOpenChange={setAddAudienceOpen}
				onCreated={setAudienceId}
			/>

			<LaunchingDialog
				open={launchOpen}
				isPending={isLaunching || isSavingSchedule}
				error={launchError?.message ?? null}
				onCancel={() => setLaunchOpen(false)}
				onRetry={() => void handleLaunch()}
			/>
		</>
	);
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			{/* التسمية أولًا ⇒ يمينًا في RTL، والعلامة تليها كما في التصميم */}
			<span className="flex items-center gap-1 text-xs">
				{label}
				<RequiredMark />
			</span>
			{children}
		</div>
	);
}

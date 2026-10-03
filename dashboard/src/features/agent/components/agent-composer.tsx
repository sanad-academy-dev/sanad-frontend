import {
	IconArrowUp,
	IconAt,
	IconChevronDown,
	IconLibrary,
	IconMicrophone,
	IconX,
} from "@tabler/icons-react";
import { type KeyboardEvent, useEffect, useState } from "react";

import { CommandLibrary } from "@/features/agent/components/command-library";
import { InlinePrompt } from "@/features/agent/components/inline-prompt";
import { useRouteContext } from "@/features/agent/hooks/use-route-context";
import type { ActionPreset, SlotValues } from "@/features/agent/types/preset.types";
import { useI18n } from "@/hooks/use-i18n";

// المُحرّر — RTL بالكامل (frame 4060): شريط سياق ملتصق أعلى صندوق إدخال أبيض،
// وأسفله مبدّل النموذج + أزرار الإجراءات، ثم ملاحظة صغيرة.
// عند وجود أمر جاهز (activePreset) نعرض فراغاته القابلة للتعبئة بدل حقل النصّ.
export const AgentComposer = ({
	input,
	setInput,
	onSend,
	disabled,
	activePreset,
	slotValues,
	onSlotChange,
	onClearPreset,
}: {
	input: string;
	setInput: (v: string) => void;
	onSend: () => void;
	disabled: boolean;
	activePreset: ActionPreset | null;
	slotValues: SlotValues;
	onSlotChange: (v: SlotValues) => void;
	onClearPreset: () => void;
}) => {
	const { t } = useI18n();
	const { label: contextLabel } = useRouteContext();
	// السياق قابل للإزالة يدويًا؛ يعود للظهور عند تغيّر الصفحة (تغيّر التسمية)
	const [contextDismissed, setContextDismissed] = useState(false);
	useEffect(() => {
		setContextDismissed(false);
	}, []);

	const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSend();
		}
	};

	return (
		<div className="flex flex-col gap-2.5 p-4">
			<div>
				{/* شريط السياق الملتصق — النص يبدأ من اليمين (السياق أولًا ثم الأيقونة)،
				    وزر الإزالة (X) في أقصى اليسار. يُخفى عند إزالته ويعود مع تغيّر الصفحة */}
				{!contextDismissed && (
					<div className="flex h-8 items-center justify-start gap-1.5 rounded-t-[4px] bg-[#f2f2f2] px-3 text-[12px] text-[#08090a]">
						<IconLibrary className="size-4 text-[#08090a]" />
						<span>{contextLabel}</span>
						<button
							type="button"
							onClick={() => setContextDismissed(true)}
							className="ms-auto shrink-0 text-[#4a5565] hover:text-[#08090a]"
							aria-label={t("common.actions.remove")}
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				)}

				{/* صندوق الإدخال */}
				<div className="flex flex-col gap-2.5 rounded-b-[4px] border-[0.75px] border-[#e5e5e5] bg-white px-3 pt-2.5 pb-2.5">
					{activePreset ? (
						// وضع الأمر الجاهز: جملة بفراغات قابلة للتعبئة داخل الحقل نفسه
						<div className="flex items-start justify-between gap-2">
							<InlinePrompt
								preset={activePreset}
								values={slotValues}
								onChange={onSlotChange}
							/>
							<button
								type="button"
								onClick={onClearPreset}
								className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
								aria-label={t("common.actions.hide")}
							>
								<IconX className="size-4" />
							</button>
						</div>
					) : (
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder={t("agent.placeholder")}
							disabled={disabled}
							rows={2}
							className="w-full resize-none bg-transparent text-start text-[14px] text-[#08090a] outline-none placeholder:text-[rgba(8,9,10,0.5)]"
						/>
					)}

					{/* التذييل: في RTL أول عنصر إلى اليمين. حسب التصميم: أزرار @/المكتبة يمينًا،
					    ومبدّل النموذج (سهم + ميكروفون + Sonnet + إرسال) يسارًا */}
					<div className="flex items-center justify-between">
						{/* أول (يمين): أزرار @ ، مكتبة الأوامر */}
						<div className="flex items-center gap-1.5">
							<button
								type="button"
								className="flex size-[22px] items-center justify-center rounded-[4px] border-[0.75px] border-[#e5e5e5]"
								aria-label="mention"
							>
								<IconAt className="size-3.5 text-[#4a5565]" />
							</button>
							<CommandLibrary
								trigger={
									<button
										type="button"
										className="flex size-[22px] items-center justify-center rounded-[4px] border-[0.75px] border-[#e5e5e5]"
										aria-label={t("agent.allCommands")}
									>
										<IconLibrary className="size-3.5 text-[#4a5565]" />
									</button>
								}
							/>
						</div>

						{/* آخر (يسار): مبدّل النموذج + ميكروفون + إرسال */}
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="flex items-center gap-1 text-[13px] font-medium text-[#4a5565]"
							>
								<IconChevronDown className="size-3.5" />
								Sonnet 4.2
							</button>
							<IconMicrophone className="size-5 text-[#4a5565]" />
							<button
								type="button"
								onClick={onSend}
								disabled={disabled || (!activePreset && !input.trim())}
								className="flex items-center justify-center rounded-full border-[0.75px] border-[#e5e5e5] p-1.5 text-[#08090a] disabled:opacity-40 enabled:border-indigo-600 enabled:bg-indigo-600 enabled:primaryenabled:hover:bg-indigo-700"
								aria-label={t("agent.send")}
							>
								<IconArrowUp className="size-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* ملاحظة "ما زال يتعلم" */}
			<p className="text-center text-[11px] text-[#4a5565]">{t("agent.learningNote")}</p>
		</div>
	);
};

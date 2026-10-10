import { IconDroplet, IconFlame, IconScissors, IconWind } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BranchDetailsShell,
	NavRow,
	SectionHeading,
	SettingRow,
	SettingsCard,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useGroomingCapacity } from "@/features/settings/grooming/hooks/use-grooming-catalog";

/**
 * إعدادات التجميل للفرع.
 *
 * القيد ثلاثي وليس واحدًا: دقائق المُجمِّل، والمحطة، وفتحات التجفيف. الأخيرة هي
 * عنق الزجاجة الذي لا تنمذجه أنظمة الصالونات، ولذلك لها حقلها المستقل هنا —
 * ومعه سقف الأطفال الممنوعة من الحرارة، لأن تجفيفها يدوي يستهلك إنسانًا لا آلة.
 */
export function BranchGroomingPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { capacity, saveCapacity, isSaving } = useGroomingCapacity(branchId);

	const [draft, setDraft] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!capacity) return;
		setDraft({
			stations: String(capacity.stations),
			dryerSlots: String(capacity.dryerSlots),
			maxHeatSensitiveConcurrent: String(capacity.maxHeatSensitiveConcurrent),
			dropOffWindowMin: String(capacity.dropOffWindowMin),
			seniorAgeYears: String(capacity.seniorAgeYears),
			quoteReapprovalPercent: String(Number(capacity.quoteReapprovalPercent)),
			requireDepositPercent:
				capacity.requireDepositPercent != null
					? String(Number(capacity.requireDepositPercent))
					: "",
		});
	}, [capacity]);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const commit = (key: string, value: string) => {
		setDraft((prev) => ({ ...prev, [key]: value }));
	};

	const persist = () => {
		void saveCapacity({
			stations: Number(draft.stations || 1),
			dryerSlots: Number(draft.dryerSlots || 1),
			maxHeatSensitiveConcurrent: Number(draft.maxHeatSensitiveConcurrent || 1),
			dropOffWindowMin: Number(draft.dropOffWindowMin || 30),
			seniorAgeYears: Number(draft.seniorAgeYears || 8),
			quoteReapprovalPercent: Number(draft.quoteReapprovalPercent || 15),
			requireDepositPercent:
				draft.requireDepositPercent === "" ? null : Number(draft.requireDepositPercent),
		}).catch(() => {});
	};

	const numberField = (key: string, suffix?: string) => (
		<div className="flex items-center gap-1.5">
			<Input
				type="number"
				className="h-8 w-20"
				value={draft[key] ?? ""}
				disabled={isSaving}
				onChange={(e) => commit(key, e.target.value)}
				onBlur={persist}
			/>
			{suffix && <span className="text-muted-foreground text-xs">{suffix}</span>}
		</div>
	);

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="التجميل"
		>
			<SectionHeading
				title="التجميل"
				description="كتالوج الدورات وسعة الفرع وبوابات السلامة. الكتالوج على مستوى المنشأة، والسعة لكل فرع على حدة."
			/>

			<SettingsCard>
				<NavRow
					icon={<IconScissors className="size-4" />}
					title="كتالوج التجميل"
					description="دورات التجميل وأسعارها الأساسية ومددها، ومصفوفة السعر حسب السلالة والحجم ونوع الفرو."
					to="/management/settings/branch/$branchId/grooming/catalog"
					params={{ branchId: branch.id }}
				/>
			</SettingsCard>

			<SectionHeading
				title="سعة الفرع"
				description="ثلاثة موارد تُحجز معًا لكل جلسة: المُجمِّل والمحطة وفتحة التجفيف."
			/>

			<SettingsCard>
				<SettingRow
					icon={<IconScissors className="size-4" />}
					title="عدد محطات التجميل"
					description="القاعات من نوع «تجميل» المتاحة للعمل في آنٍ واحد."
					trailing={numberField("stations")}
				/>
				<SettingRow
					icon={<IconWind className="size-4" />}
					title="فتحات التجفيف"
					description="عنق الزجاجة الحقيقي — الجلسة تحجز فتحة تجفيف مستقلة عن المُجمِّل."
					trailing={numberField("dryerSlots")}
				/>
				<SettingRow
					icon={<IconFlame className="size-4" />}
					title="سقف الأطفال الممنوعة من الحرارة معًا"
					description="تجفيفها يدوي بإشراف مستمر، فهو يستهلك إنسانًا لا آلة."
					trailing={numberField("maxHeatSensitiveConcurrent")}
				/>
				<SettingRow
					icon={<IconDroplet className="size-4" />}
					title="نافذة الاستلام"
					description="تباعد أوقات وصول أولياء الأمور بدل تكدّسهم في الساعة نفسها."
					trailing={numberField("dropOffWindowMin", "دقيقة")}
				/>
			</SettingsCard>

			<SectionHeading
				title="بوابات السلامة والتسعير"
				description="عتبات تقرأها البوابات المفروضة على الخادم. بوابتا التجفيف وأمر المدرّب لا تقبلان تجاوزًا ولا عتبة."
			/>

			<SettingsCard>
				<SettingRow
					title="عمر «المسنّ»"
					description="من هذا العمر فأعلى يُمنع التجفيف الحارّ ويُطبَّق رسم المسنّ."
					trailing={numberField("seniorAgeYears", "سنة")}
				/>
				<SettingRow
					title="زيادة تستوجب إقرار وليّ الأمر"
					description="ارتفاع التسعيرة بعد الفحص القبلي فوق هذه النسبة يُلغي الإقرار السابق ويطلب إقرارًا جديدًا."
					trailing={numberField("quoteReapprovalPercent", "٪")}
				/>
				<SettingRow
					title="دفعة مقدَّمة قبل التسليم"
					description="اتركه فارغًا لتعطيل بوابة السداد (الافتراضي)."
					trailing={numberField("requireDepositPercent", "٪")}
				/>
			</SettingsCard>
		</BranchDetailsShell>
	);
}

import { IconCopy, IconWorld } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCloneProtocol,
	useVaccinationProtocols,
} from "@/features/services/vaccinations/hooks/use-vaccinations";
import { DOSE_KIND_LABELS } from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

const SPECIES_LABELS: Record<string, string> = {
	DOG: "كلاب",
	CAT: "قطط",
	HORSE: "خيول",
	CATTLE: "أبقار",
	SHEEP: "أغنام",
	GOAT: "ماعز",
	CAMEL: "إبل",
	POULTRY: "دواجن وطيور",
	RABBIT: "أرانب",
	SWINE: "خنازير",
	FISH: "أسماك",
	BEE: "نحل",
};

const timing = (dose: {
	ageWeeksMin: number | null;
	ageWeeksMax: number | null;
	intervalDaysFromPrev: number | null;
	boosterIntervalDays: number | null;
}) => {
	const parts: string[] = [];
	if (dose.ageWeeksMin != null) {
		parts.push(
			dose.ageWeeksMax != null && dose.ageWeeksMax !== dose.ageWeeksMin
				? `العمر ${dose.ageWeeksMin}–${dose.ageWeeksMax} أسبوعًا`
				: `العمر ${dose.ageWeeksMin} أسبوعًا`,
		);
	}
	if (dose.intervalDaysFromPrev != null) {
		parts.push(`بعد ${dose.intervalDaysFromPrev} يومًا من السابقة`);
	}
	if (dose.boosterIntervalDays != null) {
		parts.push(`ثم كل ${dose.boosterIntervalDays} يومًا`);
	}
	return parts.join(" · ") || "—";
};

export function ProtocolsPanel() {
	const { protocols, isLoading } = useVaccinationProtocols();
	const { cloneProtocol, isPending } = useCloneProtocol();

	if (isLoading) {
		return <p className="p-6 text-center text-sm text-muted-foreground">جارٍ التحميل...</p>;
	}

	return (
		<div className="space-y-4 p-4">
			<p className="text-xs text-muted-foreground">
				البروتوكول جدول طبي بحت: مرتبط بالعمر، مدى الحياة، بلا سعر. الباقة المبيعة تعيش في
				«الخطط العلاجية» ويمكنها الإشارة إلى جرعة من هنا — أمّا ما أُعطي فعلًا فهو سجل التطعيم
				دائمًا.
			</p>

			{protocols.map((protocol) => (
				<section
					key={protocol.id}
					className="rounded-[4px] border"
				>
					<header className="flex items-center justify-between gap-2 border-b px-4 py-2">
						<div className="flex min-w-0 items-center gap-2">
							<h3 className="truncate text-sm font-semibold">{protocol.name}</h3>
							<Badge variant="secondary">
								{SPECIES_LABELS[protocol.species] ?? protocol.species}
							</Badge>
							{protocol.isCore ? (
								<Badge variant="primary">أساسي</Badge>
							) : (
								<Badge variant="outline">غير أساسي</Badge>
							)}
							{/* البروتوكول العالمي مشترك بين كل الأكاديميات: تعديله من هنا كان سيغيّره
							    للجميع، فيُنسخ بدل أن يُعدَّل. */}
							{!protocol.clinicId && (
								<Badge
									variant="outline"
									className="gap-1"
								>
									<IconWorld className="size-3" />
									افتراضي عالمي
								</Badge>
							)}
						</div>

						{!protocol.clinicId && (
							<Button
								size="sm"
								variant="outline"
								disabled={isPending}
								onClick={() => void cloneProtocol(protocol.id)}
							>
								<IconCopy className="size-4" />
								انسخ إلى أكاديميتي
							</Button>
						)}
					</header>

					{protocol.notes && (
						<p className="px-4 pt-2 text-xs text-muted-foreground">{protocol.notes}</p>
					)}

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المُستضِدّ</TableHead>
								<TableHead>الجرعة</TableHead>
								<TableHead>النوع</TableHead>
								<TableHead>التوقيت</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{protocol.doses.map((dose) => (
								<TableRow key={dose.id}>
									<TableCell>{dose.antigen.nameAr}</TableCell>
									<TableCell>{dose.label}</TableCell>
									<TableCell className="text-muted-foreground">
										{DOSE_KIND_LABELS[dose.kind]}
									</TableCell>
									<TableCell className="text-muted-foreground">{timing(dose)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</section>
			))}

			{protocols.length === 0 && (
				<p className="p-6 text-center text-sm text-muted-foreground">لا بروتوكولات متاحة.</p>
			)}
		</div>
	);
}

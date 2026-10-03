import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useFormularyMutations, useMonograph } from "@/features/pharmacy/hooks/use-pharmacy";
import { FREQUENCY_OPTIONS, ROUTE_OPTIONS } from "@sanad/contracts/runtime/server/pharmacy/prescribing.rules";

export const SPECIES_LABELS: Record<string, string> = {
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

/**
 * [PH14.2] جرعات النشرة — صفٌّ لكل (نوع، طريق إعطاء).
 *
 * هذه هي البيانات التي تجعل الحاسبة تنطق فعلًا: رأس النشرة وحده لا يُنتج جرعة.
 *
 * قاعدتان تُفرضان هنا كما في الخادم (BR-P3.3.1/2)، والواجهة تمنعهما قبل الرحلة:
 * **مانع الاستعمال لا يحمل مدى جرعة** — صفٌّ يقول «ممنوع» ويعرض رقمًا بجانبه أسوأ
 * صفّ في الجدول، يقرؤه المدرّب «ممنوع لكن…» بينما لا جرعة آمنة أصلًا. و**الحدّ
 * الأدنى لا يتجاوز الأقصى**.
 */
export function MonographDoses({ monographId }: { monographId: string }) {
	const { monograph, isLoading } = useMonograph(monographId);
	const { saveDose, isPending } = useFormularyMutations();
	const [adding, setAdding] = useState(false);

	if (isLoading || !monograph)
		return <p className="p-4 text-center text-muted-foreground text-xs">جارٍ التحميل…</p>;

	return (
		<div className="flex flex-col gap-3 border-t bg-muted/20 p-4">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-xs">
					جرعات {monograph.genericNameAr ?? monograph.genericName}
				</span>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setAdding((v) => !v)}
				>
					<IconPlus className="size-4" />
					{adding ? "إغلاق" : "جرعة لنوع"}
				</Button>
			</div>

			<div className="rounded-[4px] border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>النوع</TableHead>
							<TableHead>المدى</TableHead>
							<TableHead>الطريق</TableHead>
							<TableHead>التواتر</TableHead>
							<TableHead>تحذير</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{monograph.doses.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-6 text-center text-muted-foreground text-xs"
								>
									لا جرعات — النشرة بلا جرعة لا تُنتج حسابًا
								</TableCell>
							</TableRow>
						) : (
							monograph.doses.map((d) => (
								<TableRow key={d.id}>
									<TableCell>{SPECIES_LABELS[d.species] ?? d.species}</TableCell>
									<TableCell className="tabular-nums">
										{d.contraindicated ? (
											<Badge variant="destructive">مانع استعمال</Badge>
										) : (
											`${d.doseMin ?? "—"}–${d.doseMax ?? "—"} ${d.doseUnit ?? ""}`
										)}
									</TableCell>
									<TableCell>{d.route || "—"}</TableCell>
									<TableCell>{d.frequency ?? "—"}</TableCell>
									<TableCell className="max-w-56 truncate text-muted-foreground text-xs">
										{d.warningAr ?? "—"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{adding && (
				<DoseForm
					monographId={monographId}
					isPending={isPending}
					onSave={async (body) => {
						await saveDose(body);
						setAdding(false);
					}}
				/>
			)}
		</div>
	);
}

function DoseForm({
	monographId,
	isPending,
	onSave,
}: {
	monographId: string;
	isPending: boolean;
	onSave: (body: {
		monographId: string;
		species: string;
		contraindicated?: boolean;
		doseMin?: string;
		doseMax?: string;
		doseUnit?: string;
		route?: string;
		frequency?: string;
		warningAr?: string;
	}) => Promise<unknown>;
}) {
	const [species, setSpecies] = useState("DOG");
	const [contraindicated, setContraindicated] = useState(false);
	const [doseMin, setDoseMin] = useState("");
	const [doseMax, setDoseMax] = useState("");
	const [route, setRoute] = useState("");
	const [frequency, setFrequency] = useState("");
	const [warningAr, setWarningAr] = useState("");

	// BR-P3.3.2 — يُفحص هنا وفي الخادم: الواجهة توفّر الرحلة، والخادم هو الحارس
	const rangeInverted = !!doseMin && !!doseMax && Number(doseMin) > Number(doseMax);
	const canSave = !rangeInverted && (contraindicated || !!doseMin || !!doseMax);

	return (
		<div className="flex flex-col gap-3 rounded-[4px] border bg-background p-3">
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<div className="flex flex-col gap-1.5">
					<Label>النوع</Label>
					<Select
						value={species}
						onValueChange={setSpecies}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue />
						</SelectTrigger>
						<SelectContent position="popper">
							{Object.entries(SPECIES_LABELS).map(([code, label]) => (
								<SelectItem
									key={code}
									value={code}
								>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>الطريق</Label>
					<Select
						value={route}
						onValueChange={setRoute}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue placeholder="اختياري" />
						</SelectTrigger>
						<SelectContent position="popper">
							{ROUTE_OPTIONS.map((r) => (
								<SelectItem
									key={r.code}
									value={r.code}
								>
									{r.labelAr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label>التواتر</Label>
					<Select
						value={frequency}
						onValueChange={setFrequency}
					>
						<SelectTrigger className="w-full min-w-0">
							<SelectValue placeholder="اختياري" />
						</SelectTrigger>
						<SelectContent position="popper">
							{FREQUENCY_OPTIONS.map((f) => (
								<SelectItem
									key={f.code}
									value={f.code}
								>
									{f.labelAr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-end gap-2 pb-2">
					<Checkbox
						id="dose-contra"
						checked={contraindicated}
						onCheckedChange={(v) => {
							const on = v === true;
							setContraindicated(on);
							// مانع الاستعمال يمسح المدى بدل أن يتعايش معه (BR-P3.3.1)
							if (on) {
								setDoseMin("");
								setDoseMax("");
							}
						}}
					/>
					<Label
						htmlFor="dose-contra"
						className="text-xs"
					>
						مانع استعمال
					</Label>
				</div>
			</div>

			{!contraindicated && (
				<div className="grid grid-cols-3 gap-3">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="dose-min">أدنى (mg/kg)</Label>
						<Input
							id="dose-min"
							value={doseMin}
							onChange={(e) => setDoseMin(e.target.value)}
							placeholder="0.1"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="dose-max">أقصى (mg/kg)</Label>
						<Input
							id="dose-max"
							value={doseMax}
							onChange={(e) => setDoseMax(e.target.value)}
							placeholder="0.2"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="dose-warn">تحذير</Label>
						<Input
							id="dose-warn"
							value={warningAr}
							onChange={(e) => setWarningAr(e.target.value)}
						/>
					</div>
				</div>
			)}

			{contraindicated && (
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="dose-warn-c">سبب المنع</Label>
					<Input
						id="dose-warn-c"
						value={warningAr}
						onChange={(e) => setWarningAr(e.target.value)}
						placeholder="مثال: لا جرعة آمنة موثّقة لهذا النوع"
					/>
				</div>
			)}

			{rangeInverted && (
				<p className="flex items-center gap-1.5 text-destructive text-xs">
					<IconAlertTriangle className="size-3.5" />
					الحدّ الأدنى أكبر من الأقصى
				</p>
			)}

			<Button
				size="sm"
				className="self-end"
				disabled={!canSave || isPending}
				onClick={() =>
					void onSave({
						monographId,
						species,
						contraindicated,
						...(doseMin ? { doseMin } : {}),
						...(doseMax ? { doseMax } : {}),
						...(doseMin || doseMax ? { doseUnit: "mg/kg" } : {}),
						...(route ? { route } : {}),
						...(frequency ? { frequency } : {}),
						...(warningAr ? { warningAr } : {}),
					})
				}
			>
				حفظ الجرعة
			</Button>
		</div>
	);
}

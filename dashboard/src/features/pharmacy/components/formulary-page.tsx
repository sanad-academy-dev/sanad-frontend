import { IconBook, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MonographDoses } from "@/features/pharmacy/components/monograph-doses";
import {
	useFormulary,
	useFormularyCoverage,
	useFormularyMutations,
	usePharmacySettings,
} from "@/features/pharmacy/hooks/use-pharmacy";

/**
 * [PH13.1] تأليف النشرات الدوائية — الطبقة الثانية، BRD §3 و§11.3.
 *
 * الشاشة التي تجعل حاسبة الجرعات تنطق. الطبقة الثانية تُشحن **فارغة** بالتصميم
 * (§2.2: صفر صفوف)، فبدون هذه الشاشة يبقى المحرّك صحيحًا وصامتًا إلى الأبد — وهو
 * ما يراه المدرّب اليوم: «لا توجد نشرة دوائية لهذه المادة» على كل دواء.
 *
 * **لا استيراد ولا توليد آلي هنا، في أي مرحلة** (§3.4، §0.4): الصفوف تُدخَل من مرجع
 * معتمد بيد مدرّب مرخَّص، و`sourceCitation` إلزامي. الحقل ليس شكليًّا — هو ما يجعل
 * الرقم قابلًا للمراجعة بعد سنة.
 */
export function FormularyPage() {
	const { enabled } = usePharmacySettings();
	const [search, setSearch] = useState("");
	const [creating, setCreating] = useState(false);
	// النشرة المفتوحة لتحرير جرعاتها — رأس النشرة وحده لا يُنتج حسابًا
	const [openId, setOpenId] = useState<string | null>(null);

	const { monographs, isLoading } = useFormulary(search || undefined);
	const { coverage } = useFormularyCoverage(enabled);

	if (!enabled)
		return (
			<div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
				<IconBook className="size-6 text-muted-foreground/50" />
				<p className="text-muted-foreground text-xs">وحدة الصيدلية غير مفعّلة</p>
			</div>
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="px-4">
				<Stats
					variant="inventory"
					stats={[
						{
							title: "نشرات مؤلَّفة",
							value: coverage?.totalMonographs ?? 0,
							tooltip: "المواد الفعّالة التي لها نشرة سريرية — على مستوى النظام لا الأكاديمية",
						},
						{
							title: "صفوف جرعات",
							value: coverage?.totalDoseRows ?? 0,
							tooltip: "جرعة لكل (مادة، نوع، طريق إعطاء)",
						},
						{
							title: "أصناف مخزونك المربوطة",
							value: coverage?.stockedGenerics ?? 0,
							tooltip: "أصناف الأكاديمية المرتبطة بمستحضر مسجَّل — وحدها تقبل الربط بنشرة",
						},
						{
							title: "منها بلا نشرة",
							value: coverage?.missing.length ?? 0,
							tooltip: "تُوصف بجرعة يدوية حتى تُؤلَّف نشرتها",
						},
					]}
				/>
			</div>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث باسم المادة الفعّالة"
				actions={
					<Button
						size="sm"
						onClick={() => setCreating(true)}
					>
						<IconPlus className="size-4" />
						نشرة جديدة
					</Button>
				}
			/>

			{creating && (
				<MonographForm
					defaultName={search}
					onDone={() => setCreating(false)}
				/>
			)}

			<div className="min-h-0 flex-1 overflow-y-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>المادة الفعّالة</TableHead>
							<TableHead>المفتاح</TableHead>
							<TableHead>الجرعات</TableHead>
							<TableHead>المصدر</TableHead>
							<TableHead>المراجِع</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-8 text-center text-muted-foreground text-xs"
								>
									جارٍ التحميل…
								</TableCell>
							</TableRow>
						) : monographs.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-10 text-center text-muted-foreground text-xs"
								>
									لا نشرات بعد — الحاسبة تبقى صامتة حتى تُؤلَّف أولى النشرات
								</TableCell>
							</TableRow>
						) : (
							monographs.map((m) => (
								<TableRow
									key={m.id}
									className="cursor-pointer"
									onClick={() => setOpenId(openId === m.id ? null : m.id)}
								>
									<TableCell className="font-medium">
										{m.genericNameAr ?? m.genericName}
									</TableCell>
									<TableCell className="text-muted-foreground text-xs">
										{m.genericKey}
									</TableCell>
									<TableCell className="tabular-nums">{m._count.doses}</TableCell>
									<TableCell className="max-w-64 truncate text-muted-foreground text-xs">
										{m.sourceCitation}
									</TableCell>
									<TableCell className="text-muted-foreground text-xs">
										{m.reviewedBy ?? "—"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{openId && <MonographDoses monographId={openId} />}
			</div>
		</div>
	);
}

/** إنشاء نشرة — `sourceCitation` إلزامي ولا يُقبل حفظ بدونه (BR-P3.2.1) */
function MonographForm({ defaultName, onDone }: { defaultName: string; onDone: () => void }) {
	const { saveMonograph, isPending } = useFormularyMutations();
	const [genericName, setGenericName] = useState(defaultName);
	const [genericNameAr, setGenericNameAr] = useState("");
	const [sourceCitation, setSourceCitation] = useState("");
	const [summaryAr, setSummaryAr] = useState("");

	const canSave = genericName.trim().length > 0 && sourceCitation.trim().length > 0;

	return (
		<div className="mx-4 mb-3 flex flex-col gap-3 rounded-[4px] border bg-muted/30 p-4">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="mono-name">المادة الفعّالة (إنجليزي)</Label>
					<Input
						id="mono-name"
						value={genericName}
						onChange={(e) => setGenericName(e.target.value)}
						placeholder="Meloxicam"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="mono-name-ar">الاسم بالعربية</Label>
					<Input
						id="mono-name-ar"
						value={genericNameAr}
						onChange={(e) => setGenericNameAr(e.target.value)}
						placeholder="ميلوكسيكام"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="mono-source">المصدر المرجعي (إلزامي)</Label>
				<Input
					id="mono-source"
					value={sourceCitation}
					onChange={(e) => setSourceCitation(e.target.value)}
					placeholder="BSAVA Small Animal Formulary, 10th ed., p. 212"
				/>
				<p className="text-[11px] text-muted-foreground">
					لا صفّ سريري بلا مصدر — هو ما يجعل الرقم قابلًا للمراجعة بعد سنة.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="mono-summary">ملخّص (اختياري)</Label>
				<Textarea
					id="mono-summary"
					className="min-h-16 resize-none"
					value={summaryAr}
					onChange={(e) => setSummaryAr(e.target.value)}
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<Button
					size="sm"
					variant="ghost"
					onClick={onDone}
				>
					إلغاء
				</Button>
				<Button
					size="sm"
					disabled={!canSave || isPending}
					onClick={async () => {
						await saveMonograph({
							// المفتاح يُطبَّع في الخادم بنفس قاعدة حزم الكتالوج
							genericKey: genericName.trim().toLowerCase(),
							genericName: genericName.trim(),
							...(genericNameAr ? { genericNameAr } : {}),
							...(summaryAr ? { summaryAr } : {}),
							sourceCitation: sourceCitation.trim(),
						});
						onDone();
					}}
				>
					حفظ النشرة
				</Button>
			</div>
		</div>
	);
}

import { IconArrowRight, IconExternalLink, IconSearch } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { TablePagination } from "@/components/common/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CATALOG_SPECIES_OPTIONS } from "@/features/inventory/data/catalog-species-options";
import { useStandardProducts } from "@/features/settings/drug-standards/hooks/use-standard-products";
import { formatDataVersion } from "@/features/settings/drug-standards/utils/format-data-version";
import type { CatalogSpecies } from "@/generated/prisma/enums";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useI18n } from "@/hooks/use-i18n";
import { THERAPEUTIC_CLASSES } from "@sanad/contracts/runtime/server/drug-catalog/drug-catalog.classes";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/drug-standards_/$standardId",
)({
	component: RouteComponent,
});

const PAGE_SIZE = 25;
const ALL = "ALL";

function RouteComponent() {
	const { standardId } = Route.useParams();
	const { lang } = useI18n();
	const isAr = lang === "ar";

	const [search, setSearch] = useState("");
	const [species, setSpecies] = useState<string>(ALL);
	const [therapeuticClass, setTherapeuticClass] = useState<string>(ALL);
	const [includeSuspended, setIncludeSuspended] = useState(false);
	const [page, setPage] = useState(1);

	const debouncedSearch = useDebouncedValue(search, 300);

	const { products, standard, total, isLoading, isFetching } = useStandardProducts({
		standardId,
		q: debouncedSearch || undefined,
		species: species === ALL ? undefined : (species as CatalogSpecies),
		therapeuticClass: therapeuticClass === ALL ? undefined : therapeuticClass,
		includeSuspended,
		page,
		pageSize: PAGE_SIZE,
	});

	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const fromRow = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const toRow = Math.min(page * PAGE_SIZE, total);

	return (
		<div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 px-6 pb-8">
			<div className="flex flex-col gap-2">
				<Link
					to="/management/settings/drug-standards"
					className="flex w-fit items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
				>
					{/* السهم يشير لجهة الرجوع؛ ينعكس تلقائيًا في الإنجليزية */}
					<IconArrowRight className="size-3.5 ltr:rotate-180" />
					العودة إلى معايير الأدوية
				</Link>

				<div className="flex flex-wrap items-center gap-2">
					<h2 className="font-bold text-lg">
						{standard ? (isAr ? standard.nameAr : standard.nameEn) : "—"}
					</h2>
					{standard && <Badge variant="secondary">{standard.countryCode}</Badge>}
				</div>

				{standard && (
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
						<span>{isAr ? standard.authorityAr : standard.authorityEn}</span>
						<span>·</span>
						<span>{standard.productCount} مستحضر</span>
						<span>·</span>
						<span>إصدار البيانات {formatDataVersion(standard.dataVersion)}</span>
						<a
							href={standard.sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-primary hover:underline"
						>
							<IconExternalLink className="size-3.5" />
							المصدر الرسمي
						</a>
					</div>
				)}

				{/* حدود الكتالوج تُذكر فوق القائمة نفسها، لا في صفحة أخرى */}
				{standard?.coverageNoteAr && (
					<p className="rounded-[4px] border border-border bg-muted/40 px-3 py-2 text-muted-foreground text-xs leading-relaxed">
						{isAr ? standard.coverageNoteAr : standard.coverageNoteEn}
					</p>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-56 flex-1">
					<IconSearch className="pointer-events-none absolute top-1/2 start-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						placeholder="ابحث بالاسم التجاري أو العلمي أو الشركة الصانعة..."
						className="ps-8 text-sm"
					/>
				</div>

				<Select
					value={species}
					onValueChange={(value) => {
						setSpecies(value);
						setPage(1);
					}}
					dir="rtl"
				>
					<SelectTrigger className="w-44 text-sm">
						<SelectValue placeholder="كل الأنواع" />
					</SelectTrigger>
					{/* position="popper" — الافتراضي item-aligned يخرج خارج الشاشة في RTL */}
					<SelectContent
						dir="rtl"
						position="popper"
					>
						<SelectItem value={ALL}>كل الأنواع</SelectItem>
						{CATALOG_SPECIES_OPTIONS.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={therapeuticClass}
					onValueChange={(value) => {
						setTherapeuticClass(value);
						setPage(1);
					}}
					dir="rtl"
				>
					<SelectTrigger className="w-48 text-sm">
						<SelectValue placeholder="كل الفئات" />
					</SelectTrigger>
					<SelectContent
						dir="rtl"
						position="popper"
					>
						<SelectItem value={ALL}>كل الفئات</SelectItem>
						{THERAPEUTIC_CLASSES.map((option) => (
							<SelectItem
								key={option.code}
								value={option.code}
							>
								{option.nameAr}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Radix Switch يُصيّر زرًا لا حقل إدخال، فالتسمية عبر aria-label لا <label> */}
				<div className="flex items-center gap-2 text-xs">
					<Switch
						checked={includeSuspended}
						onCheckedChange={(checked) => {
							setIncludeSuspended(checked);
							setPage(1);
						}}
						aria-label="إظهار التسجيلات الموقوفة"
					/>
					<span>إظهار الموقوفة</span>
				</div>
			</div>

			<div className="overflow-x-auto rounded-[4px] border">
				{isLoading ? (
					<div className="flex items-center justify-center py-16">
						<Spinner />
					</div>
				) : products.length === 0 ? (
					<p className="py-16 text-center text-muted-foreground text-xs">
						لا توجد مستحضرات مطابقة
					</p>
				) : (
					<Table className={isFetching ? "opacity-60" : undefined}>
						{/* أربعة أعمدة فقط: الجدول يعيش داخل لوحة الإعدادات الضيّقة، وكل عمود
						    إضافي يدفع النصوص اللاتينية الطويلة خارج الإطار (جُرّب بستة فانقصّت
						    الفئة والحالة). التفاصيل الثانوية — رقم التسجيل، التركيز، الشركة،
						    الحالة — تنزل أسطرًا داخل خلاياها بدل أعمدة مستقلة. */}
						<TableHeader>
							<TableRow>
								<TableHead>الاسم التجاري</TableHead>
								<TableHead>المادة الفعّالة</TableHead>
								<TableHead>الفئة العلاجية</TableHead>
								<TableHead>الأنواع المستهدفة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => {
								const strength = [product.strength, product.strengthUnit]
									.filter(Boolean)
									.join(" ");
								const speciesLabels = product.species
									.map(
										(row) =>
											CATALOG_SPECIES_OPTIONS.find((o) => o.value === row.species)?.label,
									)
									.filter(Boolean) as string[];

								return (
									<TableRow key={product.id}>
										{/* أسماء المستحضرات لاتينية — جزر LTR داخل جدول عربي */}
										{/* الحاوية تبقى RTL لتلتصق بحافة البداية (اليمين) مثل رأس العمود،
										    وdir="ltr" على النص نفسه فقط ليُعرض اللاتيني بترتيب صحيح */}
										<TableCell className="max-w-64 align-top whitespace-normal">
											<div className="flex flex-col items-start gap-1">
												<span
													dir="ltr"
													className="font-medium"
												>
													{product.tradeName}
												</span>
												<div className="flex flex-wrap items-center gap-1">
													{product.authorizationStatus === "Suspended" ? (
														<Badge variant="destructive">موقوف</Badge>
													) : (
														<Badge variant="secondary">ساري</Badge>
													)}
													{product.legalStatus === "Controlled" && (
														<Badge variant="outline">مراقَب</Badge>
													)}
													<span
														dir="ltr"
														className="text-[10px] text-muted-foreground"
													>
														{product.registerNumber}
													</span>
												</div>
											</div>
										</TableCell>
										{/* TableCell أساسه whitespace-nowrap، وبدون إلغائه لا يلتف الاسم
										    العلمي الطويل فيطفح فوق الخلية المجاورة */}
										<TableCell className="max-w-64 align-top whitespace-normal">
											<div className="flex flex-col items-start gap-0.5">
												<span
													dir="ltr"
													className="line-clamp-2 text-muted-foreground"
													title={product.genericName}
												>
													{product.genericName}
												</span>
												<span
													dir="ltr"
													className="text-[10px] text-muted-foreground"
												>
													{[strength, product.dosageForm].filter(Boolean).join(" · ") || "—"}
												</span>
												{/* الشركة/صاحب التسجيل سطرٌ ثالث بدل عمود مستقل. APVMA ينشر
												    صاحب التسجيل لا المصنّع، لذا نعرض المتاح منهما */}
												{(product.manufacturerName ?? product.marketingCompany) && (
													<span
														dir="ltr"
														className="line-clamp-1 text-[10px] text-muted-foreground"
														title={
															product.manufacturerName ?? product.marketingCompany ?? undefined
														}
													>
														{product.manufacturerName ?? product.marketingCompany}
													</span>
												)}
											</div>
										</TableCell>
										<TableCell className="align-top whitespace-normal">
											{product.therapeuticClass ? (
												<Badge variant="secondary">{product.therapeuticClass.nameAr}</Badge>
											) : (
												<span className="text-muted-foreground text-xs">غير مصنّف</span>
											)}
										</TableCell>
										<TableCell className="align-top">
											{product.allSpecies ? (
												<Badge variant="outline">كل الأنواع</Badge>
											) : speciesLabels.length > 0 ? (
												<div className="flex flex-wrap gap-1">
													{speciesLabels.map((label) => (
														<Badge
															key={label}
															variant="outline"
														>
															{label}
														</Badge>
													))}
												</div>
											) : (
												// فراغ السجل ليس إذنًا لكل نوع
												<span className="text-muted-foreground text-xs">غير مذكورة</span>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>

			{total > 0 && (
				<TablePagination
					page={page - 1}
					pageCount={pageCount}
					totalRows={total}
					fromRow={fromRow}
					toRow={toRow}
					onPageChange={(index) => setPage(index + 1)}
					showPageSize={false}
				/>
			)}
		</div>
	);
}

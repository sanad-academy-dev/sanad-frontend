import { getFileUrl } from "@/lib/file-url";
import type { ClinicSettingsResponse } from "@/server/settings/settings.type";
import type {
	CampaignRequestItem,
	RegistrationContractSnapshot,
	RegistrationContractStatus,
} from "../../types/campaign-request.types";
import { computeAgeLabel } from "../../utils/date-format";
import { resolveClinicCurrencySymbol } from "../../utils/payment-helpers";

export interface ContractFormConfig {
	representativeName: string;
	showStamp: boolean;
	programStartDate: string;
	programEndDate: string;
	includeMedicalDeclaration: boolean;
	additionalTerms: string;
}

export function getContractStatusMeta(status?: RegistrationContractStatus | null): {
	label: string;
	shortLabel: string;
	badgeClass: string;
	dotClass: string;
} {
	switch (status) {
		case "AWAITING_UPLOAD":
			return {
				label: "بانتظار رفع النسخة الموقّعة",
				shortLabel: "بانتظار الرفع",
				badgeClass:
					"bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
				dotClass: "bg-zinc-500",
			};
		case "PENDING_REVIEW":
			return {
				label: "مرفوع وبانتظار المراجعة",
				shortLabel: "بانتظار المراجعة",
				badgeClass:
					"bg-amber-50 text-amber-800 border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/70",
				dotClass: "bg-amber-500",
			};
		case "REJECTED_REUPLOAD":
			return {
				label: "طُلب إعادة رفع النموذج",
				shortLabel: "إعادة رفع",
				badgeClass:
					"bg-rose-50 text-rose-700 border-rose-300/80 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800/70",
				dotClass: "bg-rose-500",
			};
		case "APPROVED":
			return {
				label: "معتمد ومقفل نهائياً",
				shortLabel: "معتمد",
				badgeClass:
					"bg-emerald-50 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/70",
				dotClass: "bg-emerald-600",
			};
		default:
			return {
				label: "لم يُرسل بعد",
				shortLabel: "لم يُرسل",
				badgeClass:
					"bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700",
				dotClass: "bg-zinc-400",
			};
	}
}

export function formatPaymentMethodArabic(method?: string | null): string {
	switch (method?.toUpperCase()) {
		case "CASH":
			return "نقدي في مقر الأكاديمية";
		case "CARD":
			return "بطاقة بنكية (دفع إلكتروني)";
		case "WALLET":
			return "محفظة إلكترونية";
		case "INSTAPAY":
			return "إنستا باي (InstaPay)";
		case "BANK_TRANSFER":
			return "تحويل بنكي";
		default:
			return method || "سداد موثق";
	}
}

export function resolveContractAcademyName(
	settingsName?: string | null,
	clinicName?: string | null,
): string {
	const raw = (settingsName || clinicName || "").trim();
	if (!raw || /^مدير النظام/i.test(raw) || /^(dev|sanad)$/i.test(raw)) {
		return "أكاديمية سند التعليمية";
	}
	return raw;
}

export function resolveRepresentativeName(
	explicitName?: string | null,
	reviewerName?: string | null,
	staffName?: string | null,
): string {
	const candidates = [explicitName, reviewerName, staffName];
	for (const candidate of candidates) {
		const trimmed = (candidate || "").trim();
		if (trimmed && !/^مدير النظام/i.test(trimmed)) {
			return trimmed;
		}
	}
	return "إدارة القبول والتسجيل";
}

export function formatContractShiftArabic(shift?: string | null): string | null {
	const raw = (shift || "").trim();
	if (!raw) return null;
	switch (raw.toUpperCase()) {
		case "MORNING":
			return "صباحي";
		case "EVENING":
			return "مسائي";
		case "AFTERNOON":
			return "بعد الظهر";
		case "FULL_DAY":
			return "دوام كامل";
		case "FLEXIBLE":
			return "مرن";
		default:
			return raw;
	}
}

export function formatProgramDatesText(
	startDate?: string | null,
	endDate?: string | null,
): string {
	const start = startDate ? formatDateText(startDate) : null;
	const end = endDate ? formatDateText(endDate) : null;
	if (start && end && start !== "غير محدد" && end !== "غير محدد") {
		return `من ${start} إلى ${end}`;
	}
	if (start && start !== "غير محدد") {
		return `بدءاً من ${start}`;
	}
	if (end && end !== "غير محدد") {
		return `حتى ${end}`;
	}
	return "وفق التقويم الأكاديمي المعتمد";
}

function formatDateText(value?: string | null): string {
	if (!value) return "غير محدد";
	try {
		const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (dateOnlyMatch) {
			return `${dateOnlyMatch[3]}/${dateOnlyMatch[2]}/${dateOnlyMatch[1]}`;
		}
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return value;
		return new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			timeZone: "Africa/Cairo",
		}).format(d);
	} catch {
		return value;
	}
}

export function buildLiveContractSnapshot({
	request,
	clinicInfo,
	config,
}: {
	request: CampaignRequestItem;
	clinicInfo?: ClinicSettingsResponse | null;
	config: ContractFormConfig;
}): RegistrationContractSnapshot {
	if (request.contractStatus === "APPROVED" && request.contractData) {
		return request.contractData;
	}

	const existing = request.contractData;
	const currency =
		existing?.payment?.currency || resolveClinicCurrencySymbol(clinicInfo?.currencyCode);

	return {
		agreementCode:
			existing?.agreementCode ||
			`AGR-${(request.code || request.id.slice(-6).toUpperCase()).replace(/^APP-/, "")}`,
		issuedAt: request.contractIssuedAt || existing?.issuedAt || new Date().toISOString(),
		representativeName: resolveRepresentativeName(
			config.representativeName,
			existing?.representativeName,
			request.reviewerName || request.assignedStaff?.name,
		),
		showStamp: config.showStamp,
		programStartDate: config.programStartDate.trim() || null,
		programEndDate: config.programEndDate.trim() || null,
		includeMedicalDeclaration: config.includeMedicalDeclaration,
		additionalTerms: config.additionalTerms.trim() || null,
		academy: {
			name: resolveContractAcademyName(clinicInfo?.name, existing?.academy?.name),
			phone: clinicInfo?.phone || existing?.academy?.phone || null,
			email: clinicInfo?.email || existing?.academy?.email || null,
			address: clinicInfo?.address || existing?.academy?.address || null,
			logoUrl: clinicInfo?.logo || existing?.academy?.logoUrl || null,
		},
		guardian: {
			name: request.guardianName || existing?.guardian?.name || "ولي الأمر",
			phone: request.guardianPhone || existing?.guardian?.phone || "",
			email: request.guardianEmail ?? existing?.guardian?.email ?? null,
			nationalId: request.guardianNationalId ?? existing?.guardian?.nationalId ?? null,
		},
		student: {
			requestCode: request.code || request.id,
			convertedPatientCode:
				request.convertedPatientCode ?? existing?.student?.convertedPatientCode ?? null,
			name: request.patientName || request.name || "الطالب",
			gender: request.gender,
			birthDate: request.birthDate ?? null,
			ageLabel: computeAgeLabel(request.birthDate, request.ageLabel),
			targetClass: request.targetClass ?? null,
			proposedTrack: request.proposedTrack ?? null,
			learningMode: request.learningMode ?? null,
			preferredShift: formatContractShiftArabic(request.preferredShift),
			experienceLevel: request.experienceLevel ?? null,
			medical: config.includeMedicalDeclaration
				? {
						bloodType: request.bloodType ?? null,
						allergies: request.allergies ?? null,
						allergiesList: Array.isArray(request.allergiesList) ? request.allergiesList : [],
						hasChronicDiseases: Boolean(request.hasChronicDiseases),
						chronicDiseases: request.chronicDiseases ?? null,
						medications: Array.isArray(request.medications)
							? request.medications.map((m) => (typeof m === "string" ? m : m?.name || "")).filter(Boolean)
							: [],
				  }
				: null,
		},
		payment: {
			planId: request.subscriptionPlanId ?? existing?.payment?.planId ?? null,
			planName: request.subscriptionPlanName ?? existing?.payment?.planName ?? "الباقة المعتمدة",
			includeMeals: Boolean(request.includeMeals),
			enableDailyStipend: Boolean(request.enableDailyStipend),
			amount:
				request.subscriptionAmount !== null && request.subscriptionAmount !== undefined
					? Number(request.subscriptionAmount)
					: existing?.payment?.amount ?? null,
			currency,
			currencyCode: clinicInfo?.currencyCode || existing?.payment?.currencyCode || "EGP",
			paidAt: request.paidAt ?? existing?.payment?.paidAt ?? null,
			paymentMethodType: request.paymentMethodType ?? existing?.payment?.paymentMethodType ?? null,
			paymentMethodLabel: formatPaymentMethodArabic(
				request.paymentMethodType ?? existing?.payment?.paymentMethodType,
			),
			paymentReference: request.paymentReference ?? existing?.payment?.paymentReference ?? null,
			paymentGateway: request.paymentGateway ?? existing?.payment?.paymentGateway ?? null,
		},
	};
}

interface ServiceAgreementPrintDocumentProps {
	snapshot: RegistrationContractSnapshot;
	contractStatus?: RegistrationContractStatus | null;
	reviewedBy?: string | null;
	reviewedAt?: string | null;
}

export function ServiceAgreementPrintDocument({
	snapshot,
	contractStatus,
	reviewedBy,
	reviewedAt,
}: ServiceAgreementPrintDocumentProps) {
	const isFemale = snapshot.student.gender === "FEMALE";
	const studentNoun = isFemale ? "الطالبة" : "الطالب";
	const genderLabel =
		snapshot.student.gender === "MALE"
			? "ذكر"
			: isFemale
				? "أنثى"
				: "غير محدد";
	const academyName = resolveContractAcademyName(snapshot.academy.name);
	const shiftArabic = formatContractShiftArabic(snapshot.student.preferredShift);
	const programDatesLabel = formatProgramDatesText(
		snapshot.programStartDate,
		snapshot.programEndDate,
	);

	const academyLogoUrl = snapshot.academy.logoUrl
		? snapshot.academy.logoUrl.startsWith("http") || snapshot.academy.logoUrl.startsWith("/")
			? snapshot.academy.logoUrl
			: getFileUrl(snapshot.academy.logoUrl)
		: null;

	const formattedAmount =
		snapshot.payment?.amount !== null &&
		snapshot.payment?.amount !== undefined &&
		Number.isFinite(snapshot.payment.amount)
			? `${snapshot.payment.amount.toLocaleString("en-US")} ${snapshot.payment.currency}`
			: "غير محدد";

	return (
		<div
			className="w-full max-w-[210mm] mx-auto bg-white text-zinc-900 p-6 sm:p-7 print:p-0 text-right leading-relaxed"
			dir="rtl"
			style={{
				fontFamily: "'IBM Plex Sans Arabic', 'Inter Variable', Arial, sans-serif",
			}}
		>
			{/* 1. الترويسة الرسمية الكلاسيكية */}
			<header className="border-b-2 border-zinc-900 pb-3.5 mb-4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-3">
						{academyLogoUrl ? (
							<img
								src={academyLogoUrl}
								alt={academyName}
								className="size-10 rounded-md object-contain border border-zinc-200 bg-white p-0.5 shrink-0"
							/>
						) : (
							<div className="size-10 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
								سند
							</div>
						)}
						<div>
							<h1 className="text-[15px] font-bold text-zinc-900 leading-tight">
								{academyName}
							</h1>
							<p className="text-[11px] text-zinc-600 mt-0.5">
								إدارة القبول والتسجيل والخدمات التعليمية
							</p>
							{(snapshot.academy.address || snapshot.academy.phone) && (
								<p className="text-[10px] text-zinc-500 mt-1">
									{[snapshot.academy.address, snapshot.academy.phone].filter(Boolean).join(" • ")}
								</p>
							)}
						</div>
					</div>

					<div className="text-center shrink-0">
						<div className="inline-block px-3.5 py-1.5 bg-zinc-100 border border-zinc-300 rounded text-[13px] font-bold text-zinc-900">
							نموذج تقديم الخدمة التعليمية
						</div>
						<p className="text-[9.5px] text-zinc-500 font-mono tracking-wide mt-1">
							EDUCATIONAL SERVICE AGREEMENT
						</p>
					</div>

					<div className="text-right text-[11px] bg-zinc-50 border border-zinc-200 rounded p-2.5 min-w-[185px] space-y-1">
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">رقم الاتفاقية:</span>
							<span className="font-mono font-bold text-zinc-900" dir="ltr">
								{snapshot.agreementCode}
							</span>
						</div>
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">كود الطلب:</span>
							<span className="font-mono font-semibold text-zinc-900" dir="ltr">
								#{snapshot.student.requestCode}
							</span>
						</div>
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">تاريخ الإصدار:</span>
							<span className="font-mono text-zinc-800" dir="ltr">
								{formatDateText(snapshot.issuedAt)}
							</span>
						</div>
						{contractStatus === "APPROVED" && (
							<div className="pt-1 border-t border-zinc-200 flex justify-between gap-2 text-[10px]">
								<span className="text-zinc-500 font-medium">الحالة:</span>
								<span className="font-bold text-zinc-900">معتمد وموثّق</span>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* 2. الديباجة الرسمية */}
			<p className="text-[11.5px] text-zinc-700 bg-zinc-50/70 border border-zinc-200 rounded px-3.5 py-2 mb-3.5">
				عزيزي ولي الأمر / <strong className="text-zinc-900">{snapshot.guardian.name}</strong>،
				يسعدنا اعتماد قبول التحاق {studentNoun} /{" "}
				<strong className="text-zinc-900">{snapshot.student.name}</strong> في{" "}
				<strong className="text-zinc-900">{academyName}</strong>. توثّق هذه الوثيقة
				تفاصيل الخطة الأكاديمية والرسوم المسددة والضوابط التعاقدية المنظمة للخدمة التعليمية بين
				الطرفين، ويُعمل بها فور توقيعها يدوياً واعتمادها من إدارة الأكاديمية.
			</p>

			{/* 3. أولاً: أطراف الاتفاقية */}
			<section className="mb-3.5 break-inside-avoid">
				<div className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold rounded-t flex items-center justify-between">
					<span>أولاً: بيانات أطراف الاتفاقية</span>
					<span className="text-[10px] font-normal text-zinc-300 font-mono">PARTIES DETAILS</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الطرف الأول (مقدم الخدمة)
							</th>
							<td className="w-1/4 p-2 text-zinc-900 font-bold border-l border-zinc-200">
								{academyName}
							</td>
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								ممثل الأكاديمية
							</th>
							<td className="w-1/4 p-2 text-zinc-900 font-medium">
								{snapshot.representativeName}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الطرف الثاني (ولي الأمر)
							</th>
							<td className="p-2 text-zinc-900 font-bold border-l border-zinc-200">
								{snapshot.guardian.name}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								رقم الهوية / الإقامة
							</th>
							<td className="p-2 text-zinc-800 font-mono" dir="ltr">
								{snapshot.guardian.nationalId || "غير مسجل"}
							</td>
						</tr>
						<tr>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								رقم التواصل (ولي الأمر)
							</th>
							<td className="p-2 text-zinc-800 font-mono border-l border-zinc-200" dir="ltr">
								{snapshot.guardian.phone || "غير مسجل"}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								البريد الإلكتروني
							</th>
							<td className="p-2 text-zinc-800 font-mono" dir="ltr">
								{snapshot.guardian.email || "غير مسجل"}
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* 4. ثانياً: بيانات الطالب والخطة الأكاديمية والسداد الفعلي */}
			<section className="mb-3.5 break-inside-avoid">
				<div className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold rounded-t flex items-center justify-between">
					<span>ثانياً: بيانات {studentNoun} والخطة التعليمية وتفاصيل السداد الفعلي</span>
					<span className="text-[10px] font-normal text-zinc-300 font-mono">ENROLLMENT & PAYMENT</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								اسم {studentNoun}
							</th>
							<td className="w-1/4 p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{snapshot.student.name}
							</td>
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								تاريخ الميلاد / العمر
							</th>
							<td className="w-1/4 p-2 text-zinc-800">
								{snapshot.student.birthDate ? (
									<span className="font-mono" dir="ltr">
										{formatDateText(snapshot.student.birthDate)}
									</span>
								) : null}
								{snapshot.student.birthDate && snapshot.student.ageLabel ? " • " : ""}
								{snapshot.student.ageLabel || (!snapshot.student.birthDate ? "غير محدد" : "")}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الجنس / الفصل المقترح
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{genderLabel}
								{snapshot.student.targetClass ? ` • ${snapshot.student.targetClass}` : ""}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								المسار الأكاديمي
							</th>
							<td className="p-2 text-zinc-800 font-medium">
								{snapshot.student.proposedTrack || snapshot.student.targetClass || "المسار العام"}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								نظام الحضور والفترة
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{[snapshot.student.learningMode, shiftArabic]
									.filter(Boolean)
									.join(" • ") || "حضوري في مقر الأكاديمية"}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								فترة البرنامج
							</th>
							<td className="p-2 text-zinc-800 text-[11px]">
								{programDatesLabel}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الباقة المعتمدة
							</th>
							<td className="p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{snapshot.payment?.planName || "الباقة المعتمدة"}
								<span className="block text-[10px] font-normal text-zinc-500 mt-0.5">
									{[
										snapshot.payment?.includeMeals ? "شامل الوجبات" : "بدون وجبات",
										snapshot.payment?.enableDailyStipend ? "مع المصروف اليومي" : null,
									]
										.filter(Boolean)
										.join(" • ")}
								</span>
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								إجمالي الرسوم المسددة
							</th>
							<td className="p-2 font-bold font-mono text-zinc-900">
								{formattedAmount}
							</td>
						</tr>
						<tr>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								طريقة وتاريخ السداد
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{snapshot.payment?.paymentMethodLabel ||
									formatPaymentMethodArabic(snapshot.payment?.paymentMethodType)}
								{snapshot.payment?.paidAt ? ` (${formatDateText(snapshot.payment.paidAt)})` : ""}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								مرجع السداد الموثّق
							</th>
							<td className="p-2 font-mono text-zinc-800 text-[11px]" dir="ltr">
								{snapshot.payment?.paymentReference || snapshot.student.requestCode}
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* 5. ثالثاً: الإقرار الصحي (اختياري عبر ضبط النموذج) */}
			{snapshot.includeMedicalDeclaration && (
				<section className="mb-4">
					<div className="bg-zinc-100 border border-b-0 border-zinc-300 text-zinc-900 px-3 py-1.5 text-xs font-bold rounded-t flex items-center justify-between">
						<span>ثالثاً: البيانات الصحية وإقرار السلامة</span>
						<span className="text-[10px] font-normal text-zinc-500 font-mono">MEDICAL DECLARATION</span>
					</div>
					<table className="w-full border-collapse border border-zinc-300 text-xs">
						<tbody>
							<tr>
								<th scope="row" className="w-1/6 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
									فصيلة الدم
								</th>
								<td className="w-1/6 p-2 font-mono text-zinc-900 border-l border-zinc-200" dir="ltr">
									{snapshot.student.medical?.bloodType || "غير مسجلة"}
								</td>
								<th scope="row" className="w-1/6 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
									الحساسيات
								</th>
								<td className="w-1/6 p-2 text-zinc-800 border-l border-zinc-200">
									{snapshot.student.medical?.allergies ||
										snapshot.student.medical?.allergiesList?.join("، ") ||
										"لا توجد حساسية مسجلة"}
								</td>
								<th scope="row" className="w-1/6 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
									ملاحظات صحية
								</th>
								<td className="w-1/6 p-2 text-zinc-800">
									{snapshot.student.medical?.hasChronicDiseases &&
									snapshot.student.medical?.chronicDiseases
										? snapshot.student.medical.chronicDiseases
										: "لا توجد أمراض مزمنة"}
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			)}

			{/* 6. الشروط والتعهدات */}
			<section className="mb-5 border border-zinc-300 rounded p-3.5 bg-zinc-50/40">
				<h2 className="text-xs font-bold text-zinc-900 mb-2">
					{snapshot.includeMedicalDeclaration ? "رابعاً" : "ثالثاً"}: الشروط العامة وتعهد ولي الأمر
				</h2>
				<ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-700">
					<li>
						تلتزم الأكاديمية بتقديم البرنامج التعليمي والتأهيلي الموضح أعلاه وفق معايير الجودة
						والخطة الأكاديمية المعتمدة للطالب.
					</li>
					<li>
						يقر ولي الأمر بصحة جميع البيانات الشخصية والصحية المقدمة في ملف الطالب، ويلتزم
						بإخطار الأكاديمية فوراً بأي مستجدات صحية أو طارئة.
					</li>
					<li>
						يلتزم ولي الأمر باللوائح التنظيمية لمواعيد الحضور والانصراف وسياسات التواصل المعتمدة
						داخل الأكاديمية.
					</li>
					<li>
						لا تُعد هذه الوثيقة سارية بشكلها النهائي إلا بعد توقيع ولي الأمر يدوياً وإعادة رفعها
						واعتمادها من إدارة القبول والتسجيل.
					</li>
				</ol>
				{snapshot.additionalTerms && (
					<div className="mt-2.5 pt-2 border-t border-zinc-200 text-[11px] text-zinc-800">
						<span className="font-bold text-zinc-900">بنود وشروط إضافية: </span>
						<span className="whitespace-pre-line">{snapshot.additionalTerms}</span>
					</div>
				)}
			</section>

			{/* 7. مربع التوقيع اليدوي والختم الرسمي */}
			<footer className="grid grid-cols-2 gap-6 pt-3 border-t-2 border-zinc-300 text-xs">
				{/* توقيع الطرف الأول */}
				<div className="border border-zinc-200 rounded p-3.5 bg-zinc-50/50 space-y-2 relative">
					<p className="font-bold text-zinc-900">توقيع الطرف الأول (عن الأكاديمية)</p>
					<p className="text-[11px] text-zinc-700">
						الاسم / الصفة: <span className="font-semibold text-zinc-900">{snapshot.representativeName}</span>
					</p>
					{reviewedBy && contractStatus === "APPROVED" && (
						<p className="text-[10.5px] text-zinc-600">
							تم الاعتماد بواسطة: <span className="font-semibold">{reviewedBy}</span>
							{reviewedAt ? ` (${formatDateText(reviewedAt)})` : ""}
						</p>
					)}
					<div className="pt-4 border-b border-dashed border-zinc-400" />
					<div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
						<span>التوقيع والاعتماد</span>
						<span>التاريخ: {formatDateText(snapshot.issuedAt)}</span>
					</div>
					{snapshot.showStamp && (
						<div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 border border-zinc-400 rounded text-[10px] font-bold text-zinc-700 tracking-wide">
							<span>ختم رسمي: {academyName}</span>
						</div>
					)}
				</div>

				{/* توقيع الطرف الثاني */}
				<div className="border border-zinc-200 rounded p-3.5 bg-white space-y-2">
					<p className="font-bold text-zinc-900">توقيع الطرف الثاني (ولي الأمر)</p>
					<p className="text-[11px] text-zinc-700">
						الاسم: <span className="font-semibold text-zinc-900">{snapshot.guardian.name}</span>
					</p>
					<p className="text-[11px] text-zinc-700">
						رقم الهوية:{" "}
						<span className="font-mono" dir="ltr">
							{snapshot.guardian.nationalId || "........................"}
						</span>
					</p>
					<div className="pt-4 border-b border-dashed border-zinc-400" />
					<div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
						<span>التوقيع اليدوي</span>
						<span>التاريخ: .... / .... / 202..</span>
					</div>
				</div>
			</footer>
		</div>
	);
}

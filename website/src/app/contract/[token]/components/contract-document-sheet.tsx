"use client";

import type { PublicContractSnapshot, PublicContractStatus } from "../types";

function formatDisplayDate(value?: string | null): string {
	if (!value) return "غير محدد";
	try {
		const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (dateOnly) {
			return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
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

function formatContractShiftArabic(shift?: string | null): string | null {
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

function formatProgramDatesText(startDate?: string | null, endDate?: string | null): string {
	const start = startDate ? formatDisplayDate(startDate) : null;
	const end = endDate ? formatDisplayDate(endDate) : null;
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

export function ContractDocumentSheet({
	contract,
	contractStatus,
	isPrintPortal = false,
}: {
	contract: PublicContractSnapshot;
	contractStatus: PublicContractStatus;
	isPrintPortal?: boolean;
}) {
	const isFemale = contract.student.gender === "FEMALE";
	const studentNoun = isFemale ? "الطالبة" : "الطالب";
	const genderLabel =
		contract.student.gender === "MALE"
			? "ذكر"
			: isFemale
				? "أنثى"
				: "غير محدد";
	const shiftArabic = formatContractShiftArabic(contract.student.preferredShift);
	const programDatesLabel = formatProgramDatesText(
		contract.programStartDate,
		contract.programEndDate,
	);

	const hasHttpLogo = Boolean(
		contract.academy.logoUrl && /^https?:\/\//i.test(contract.academy.logoUrl),
	);

	const formattedAmount =
		contract.payment.amount !== null && Number.isFinite(contract.payment.amount)
			? `${contract.payment.amount.toLocaleString("en-US")} ${contract.payment.currency}`
			: "غير محدد";

	return (
		<article
			className={
				isPrintPortal
					? "w-full max-w-[210mm] mx-auto bg-white text-zinc-900 p-0 text-right leading-relaxed"
					: "w-full bg-white text-zinc-900 border border-zinc-200 rounded-2xl p-5 sm:p-8 text-right leading-relaxed"
			}
			dir="rtl"
		>
			{/* 1. الترويسة الرسمية */}
			<header className="border-b-2 border-zinc-900 pb-4 mb-5">
				<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
					<div className="flex items-start gap-3">
						{hasHttpLogo && contract.academy.logoUrl ? (
							<img
								src={contract.academy.logoUrl}
								alt={contract.academy.name}
								className="h-11 w-11 rounded-md object-contain border border-zinc-200 bg-white p-0.5 shrink-0"
							/>
						) : (
							<div className="h-10 w-10 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
								سند
							</div>
						)}
						<div>
							<h2 className="text-base font-bold text-zinc-900 leading-tight">
								{contract.academy.name}
							</h2>
							<p className="text-[11px] text-zinc-600 mt-0.5">
								إدارة القبول والتسجيل والخدمات التعليمية
							</p>
							{(contract.academy.address || contract.academy.phone) && (
								<p className="text-[10.5px] text-zinc-500 mt-1">
									{[contract.academy.address, contract.academy.phone].filter(Boolean).join(" • ")}
								</p>
							)}
						</div>
					</div>

					<div className="sm:text-center">
						<div className="inline-block px-3.5 py-1.5 bg-zinc-100 border border-zinc-300 rounded text-xs font-bold text-zinc-900">
							نموذج تقديم الخدمة التعليمية
						</div>
						<p className="text-[9.5px] text-zinc-500 font-mono tracking-wide mt-1">
							EDUCATIONAL SERVICE AGREEMENT
						</p>
					</div>

					<div className="w-full sm:w-auto text-right text-[11px] bg-zinc-50 border border-zinc-200 rounded p-2.5 sm:min-w-[185px] space-y-1">
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">رقم الاتفاقية:</span>
							<bdi dir="ltr" className="font-mono font-bold text-zinc-900">
								{contract.agreementCode}
							</bdi>
						</div>
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">كود الطلب:</span>
							<bdi dir="ltr" className="font-mono font-semibold text-zinc-900">
								#{contract.student.requestCode}
							</bdi>
						</div>
						<div className="flex justify-between gap-2">
							<span className="text-zinc-500 font-medium">تاريخ الإصدار:</span>
							<bdi dir="ltr" className="font-mono text-zinc-800">
								{formatDisplayDate(contract.issuedAt)}
							</bdi>
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

			{/* 2. المقدمة */}
			<p className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded px-3.5 py-2.5 mb-4">
				عزيزي ولي الأمر / <strong className="text-zinc-900">{contract.guardian.name}</strong>،
				مبارك قبول التحاق {studentNoun} /{" "}
				<strong className="text-zinc-900">{contract.student.name}</strong> في{" "}
				<strong className="text-zinc-900">{contract.academy.name}</strong>. توثّق هذه الوثيقة
				تفاصيل الخطة الأكاديمية والرسوم المسددة والشروط المنظمة للخدمة التعليمية، ويُرجى طباعتها
				وتوقيعها يدوياً ثم إعادة رفعها عبر هذه البوابة.
			</p>

			{/* 3. أولاً: بيانات أطراف الاتفاقية */}
			<section className="mb-4 overflow-x-auto">
				<div className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold rounded-t flex items-center justify-between">
					<span>أولاً: بيانات أطراف الاتفاقية</span>
					<span className="text-[10px] font-normal text-zinc-300 font-mono">PARTIES DETAILS</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الطرف الأول (الأكاديمية)
							</th>
							<td className="w-1/4 p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{contract.academy.name}
							</td>
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								ممثل الأكاديمية
							</th>
							<td className="w-1/4 p-2 font-medium text-zinc-900">
								{contract.representativeName}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الطرف الثاني (ولي الأمر)
							</th>
							<td className="p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{contract.guardian.name}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								رقم الهوية / الإقامة
							</th>
							<td className="p-2 font-mono text-zinc-800">
								<bdi dir="ltr">{contract.guardian.nationalId || "غير مسجل"}</bdi>
							</td>
						</tr>
						<tr>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								رقم الجوال المسجل
							</th>
							<td className="p-2 font-mono text-zinc-800 border-l border-zinc-200">
								<bdi dir="ltr">{contract.guardian.phone || "غير مسجل"}</bdi>
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								البريد الإلكتروني
							</th>
							<td className="p-2 font-mono text-zinc-800">
								<bdi dir="ltr">{contract.guardian.email || "غير مسجل"}</bdi>
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* 4. ثانياً: الطالب والخطة والسداد الفعلي */}
			<section className="mb-4 overflow-x-auto break-inside-avoid">
				<div className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold rounded-t flex items-center justify-between">
					<span>ثانياً: بيانات {studentNoun} والخطة الأكاديمية والسداد الفعلي</span>
					<span className="text-[10px] font-normal text-zinc-300 font-mono">ENROLLMENT & PAYMENT</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								اسم {studentNoun}
							</th>
							<td className="w-1/4 p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{contract.student.name}
							</td>
							<th scope="row" className="w-1/4 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								تاريخ الميلاد / العمر
							</th>
							<td className="w-1/4 p-2 text-zinc-800">
								{contract.student.birthDate ? (
									<bdi dir="ltr" className="font-mono">
										{formatDisplayDate(contract.student.birthDate)}
									</bdi>
								) : null}
								{contract.student.birthDate && contract.student.ageLabel ? " • " : ""}
								{contract.student.ageLabel || (!contract.student.birthDate ? "غير محدد" : "")}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الجنس / الفصل المقترح
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{genderLabel}
								{contract.student.targetClass ? ` • ${contract.student.targetClass}` : ""}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								المسار الأكاديمي
							</th>
							<td className="p-2 font-medium text-zinc-800">
								{contract.student.proposedTrack || contract.student.targetClass || "المسار العام"}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								نظام الحضور والفترة
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{[contract.student.learningMode, shiftArabic]
									.filter(Boolean)
									.join(" • ") || "حضوري في مقر الأكاديمية"}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								فترة البرنامج
							</th>
							<td className="p-2 text-[11px] text-zinc-800">
								{programDatesLabel}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								الباقة المعتمدة
							</th>
							<td className="p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{contract.payment.planName || "الباقة المعتمدة"}
								<span className="block text-[10px] font-normal text-zinc-500 mt-0.5">
									{[
										contract.payment.includeMeals ? "شامل الوجبات" : "بدون وجبات",
										contract.payment.enableDailyStipend ? "مع المصروف اليومي" : null,
									]
										.filter(Boolean)
										.join(" • ")}
								</span>
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								إجمالي الرسوم المسددة
							</th>
							<td className="p-2 font-bold font-mono text-zinc-900">{formattedAmount}</td>
						</tr>
						<tr>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								طريقة وتاريخ السداد
							</th>
							<td className="p-2 text-zinc-800 border-l border-zinc-200">
								{contract.payment.paymentMethodLabel}
								{contract.payment.paidAt ? ` (${formatDisplayDate(contract.payment.paidAt)})` : ""}
							</td>
							<th scope="row" className="bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
								مرجع السداد الموثّق
							</th>
							<td className="p-2 font-mono text-[11px] text-zinc-800">
								<bdi dir="ltr">{contract.payment.paymentReference || contract.student.requestCode}</bdi>
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* 5. الإقرار الصحي */}
			{contract.includeMedicalDeclaration && contract.student.medical && (
				<section className="mb-4 overflow-x-auto">
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
								<td className="w-1/6 p-2 font-mono text-zinc-900 border-l border-zinc-200">
									<bdi dir="ltr">{contract.student.medical.bloodType || "غير مسجلة"}</bdi>
								</td>
								<th scope="row" className="w-1/6 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
									الحساسيات
								</th>
								<td className="w-1/6 p-2 text-zinc-800 border-l border-zinc-200">
									{contract.student.medical.allergies ||
										contract.student.medical.allergiesList?.join("، ") ||
										"لا توجد حساسية مسجلة"}
								</td>
								<th scope="row" className="w-1/6 bg-zinc-50 p-2 text-right font-semibold text-zinc-700 border-l border-zinc-200">
									ملاحظات صحية
								</th>
								<td className="w-1/6 p-2 text-zinc-800">
									{contract.student.medical.hasChronicDiseases &&
									contract.student.medical.chronicDiseases
										? contract.student.medical.chronicDiseases
										: "لا توجد أمراض مزمنة"}
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			)}

			{/* 6. الشروط والتعهدات */}
			<section className="mb-5 border border-zinc-300 rounded p-3.5 bg-zinc-50/40">
				<h3 className="text-xs font-bold text-zinc-900 mb-2">
					{contract.includeMedicalDeclaration ? "رابعاً" : "ثالثاً"}: الشروط العامة وتعهد ولي الأمر
				</h3>
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
				{contract.additionalTerms && (
					<div className="mt-2.5 pt-2 border-t border-zinc-200 text-[11px] text-zinc-800">
						<span className="font-bold text-zinc-900">بنود وشروط إضافية: </span>
						<span className="whitespace-pre-line">{contract.additionalTerms}</span>
					</div>
				)}
			</section>

			{/* 7. مربعات التوقيع اليدوي */}
			<footer className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 sm:gap-6 pt-3 border-t-2 border-zinc-300 text-xs">
				<div className="border border-zinc-200 rounded p-3.5 bg-zinc-50/50 space-y-2">
					<p className="font-bold text-zinc-900">توقيع الطرف الأول (عن الأكاديمية)</p>
					<p className="text-[11px] text-zinc-700">
						الاسم / الصفة: <span className="font-semibold text-zinc-900">{contract.representativeName}</span>
					</p>
					<div className="pt-4 border-b border-dashed border-zinc-400" />
					<div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
						<span>التوقيع والاعتماد</span>
						<bdi dir="ltr">{formatDisplayDate(contract.issuedAt)}</bdi>
					</div>
					{contract.showStamp && (
						<div className="mt-2 inline-flex items-center px-2.5 py-1 border border-zinc-400 rounded text-[10px] font-bold text-zinc-700">
							ختم رسمي: {contract.academy.name}
						</div>
					)}
				</div>

				<div className="border border-zinc-200 rounded p-3.5 bg-white space-y-2">
					<p className="font-bold text-zinc-900">توقيع الطرف الثاني (ولي الأمر)</p>
					<p className="text-[11px] text-zinc-700">
						الاسم: <span className="font-semibold text-zinc-900">{contract.guardian.name}</span>
					</p>
					<p className="text-[11px] text-zinc-700">
						رقم الهوية:{" "}
						<bdi dir="ltr" className="font-mono">
							{contract.guardian.nationalId || "........................"}
						</bdi>
					</p>
					<div className="pt-4 border-b border-dashed border-zinc-400" />
					<div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
						<span>التوقيع اليدوي</span>
						<span>التاريخ: .... / .... / 202..</span>
					</div>
				</div>
			</footer>
		</article>
	);
}

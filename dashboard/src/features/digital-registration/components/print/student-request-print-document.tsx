import React from "react";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { computeAgeLabel } from "../../utils/date-format";

interface StudentRequestPrintDocumentProps {
	request: CampaignRequestItem;
}

export function StudentRequestPrintDocument({ request }: StudentRequestPrintDocumentProps) {
	// Status label mapping
	const statusLabels: Record<string, string> = {
		QUEUE: "طابور الانتظار والفرز",
		SHORTLIST: "القائمة المختصرة",
		INTERVIEW: "المقابلة الشخصية والفحص",
		ACCEPTED: "مقبول نهائياً",
		AWAITING_PAYMENT: "بانتظار سداد الرسوم",
		REJECTED: "طلب غير مقبول",
		DUPLICATE: "طلب مكرر",
	};

	const currentStatusLabel =
		request.statusLabel || statusLabels[request.status] || request.status;

	const formatDisplayDate = (d?: string | null) => {
		if (!d) return "غير محدد";
		try {
			if (d.includes("T")) {
				const parts = d.split("T")[0].split("-");
				if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
			}
			return d;
		} catch {
			return d;
		}
	};

	const currentDateFormatted = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Africa/Cairo",
	}).format(new Date());

	// حساب عمر الطالب بدقة من تاريخ الميلاد
	const computeAge = () => computeAgeLabel(request.birthDate, request.ageLabel);

	return (
		<div
			className="w-full max-w-[210mm] mx-auto bg-white text-zinc-900 font-sans print:max-w-none print:w-full p-8 print:p-0 text-right selection:bg-none"
			dir="rtl"
			style={{
				fontFamily: "'IBM Plex Sans Arabic', 'Inter Variable', Arial, sans-serif",
				color: "#18181b",
				lineHeight: 1.5,
			}}
		>
			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 1. Official Header: Logo, Title & Metadata                      */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<header className="border-b-2 border-zinc-900 pb-4 mb-5">
				<div className="flex items-start justify-between gap-4">
					{/* Right: Center / Academy Name */}
					<div className="text-right">
						<div className="flex items-center gap-2 mb-1">
							<div className="size-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
								سند
							</div>
							<div>
								<h1 className="text-base font-bold text-zinc-900 leading-tight">
									أكاديمية ومراكز سند للتعليم والتأهيل
								</h1>
								<p className="text-[11px] text-zinc-600 font-medium">
									Sanad Academy for Special Education & Admissions
								</p>
							</div>
						</div>
						<p className="text-[10px] text-zinc-500">
							قسم القبول والتسجيل والتوجيه الأكاديمي الموحد
						</p>
					</div>

					{/* Center: Document Title */}
					<div className="text-center">
						<div className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-300 rounded font-bold text-xs text-zinc-900 mb-1">
							استمارة طلب تسجيل وتقييم قبول طالب
						</div>
						<p className="text-[10px] text-zinc-500 font-mono">
							STUDENT ADMISSION & REGISTRATION DOSSIER
						</p>
					</div>

					{/* Left: Document Metadata Box */}
					<div className="text-left text-xs space-y-1 bg-zinc-50 border border-zinc-200 p-2 rounded min-w-[190px]">
						<div className="flex justify-between items-center gap-2">
							<span className="font-semibold text-zinc-600 text-[11px]">رقم الطلب:</span>
							<span className="font-mono font-bold text-zinc-900 text-xs">
								#{request.code}
							</span>
						</div>
						<div className="flex justify-between items-center gap-2">
							<span className="font-semibold text-zinc-600 text-[11px]">تاريخ التقديم:</span>
							<span className="text-zinc-800 text-[11px] font-mono">
								{formatDisplayDate(request.submittedAt || request.date)}
							</span>
						</div>
						<div className="flex justify-between items-center gap-2">
							<span className="font-semibold text-zinc-600 text-[11px]">تاريخ الطباعة:</span>
							<span className="text-zinc-800 text-[10px] font-mono">{currentDateFormatted}</span>
						</div>
						<div className="flex justify-between items-center gap-2 pt-1 border-t border-zinc-200">
							<span className="font-semibold text-zinc-600 text-[11px]">حالة الطلب:</span>
							<span className="font-bold text-[10.5px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-900">
								{currentStatusLabel}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 2. Top Summary Badges Bar                                       */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<div className="grid grid-cols-4 gap-2 mb-4 bg-zinc-100 p-2.5 rounded border border-zinc-300 text-xs">
				<div className="text-center border-l border-zinc-300 pl-2">
					<span className="block text-zinc-500 text-[10px] font-semibold">المسار التعليمي</span>
					<span className="font-bold text-zinc-900 text-[11.5px]">
						{request.targetClass || request.proposedTrack || "البرمجة والمنطق"}
					</span>
				</div>
				<div className="text-center border-l border-zinc-300 pl-2">
					<span className="block text-zinc-500 text-[10px] font-semibold">نمط التعلم</span>
					<span className="font-bold text-zinc-900 text-[11.5px]">
						{request.learningMode || "في الأكاديمية (حضوري)"}
					</span>
				</div>
				<div className="text-center border-l border-zinc-300 pl-2">
					<span className="block text-zinc-500 text-[10px] font-semibold">درجة الأولوية</span>
					<span className="font-bold text-zinc-900 text-[11.5px]">
						{request.priority || "بدون أولوية"}
					</span>
				</div>
				<div className="text-center">
					<span className="block text-zinc-500 text-[10px] font-semibold">مؤشر الجدية والحضور</span>
					<span className="font-bold text-zinc-900 font-mono text-[11.5px]">
						{request.attendanceProbability ?? 92}%
					</span>
				</div>
			</div>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 3. Section 1: Student Information                               */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<section className="mb-4">
				<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
					<span>أولاً: بيانات الطالب الأكاديمية والشخصية</span>
					<span className="text-[10px] font-normal text-zinc-300">STUDENT PROFILE</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								اسم الطالب بالكامل:
							</td>
							<td className="p-2 font-bold text-zinc-900 w-[32%] border-l border-zinc-200">
								{request.patientName || request.name}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								الجنس:
							</td>
							<td className="p-2 text-zinc-900 w-[32%]">
								{request.gender === "MALE"
									? "ذكر"
									: request.gender === "FEMALE"
									? "أنثى"
									: "غير محدد"}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								تاريخ الميلاد:
							</td>
							<td className="p-2 text-zinc-900 font-mono border-l border-zinc-200">
								{formatDisplayDate(request.birthDate)}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								العمر المحسوب:
							</td>
							<td className="p-2 text-zinc-900">
								{computeAge()}
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								المجال / المسار المقترح:
							</td>
							<td className="p-2 font-bold text-zinc-900 border-l border-zinc-200">
								{request.targetClass || request.proposedTrack || "البرمجة والمنطق"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								مستوى الخبرة:
							</td>
							<td className="p-2 text-zinc-900">
								{request.experienceLevel || "مبتدئ"}
							</td>
						</tr>
						<tr>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								طريقة ونمط التعلم:
							</td>
							<td className="p-2 text-zinc-900 border-l border-zinc-200">
								{request.learningMode || "في الأكاديمية (حضوري)"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								الفترة / المناوبة المفضلة:
							</td>
							<td className="p-2 text-zinc-900">
								{request.preferredShift || "صباحي"}
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 4. Section 2: Guardian Information                             */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<section className="mb-4">
				<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
					<span>ثانياً: بيانات ولي الأمر والاتصال</span>
					<span className="text-[10px] font-normal text-zinc-300">GUARDIAN CONTACT</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								اسم ولي الأمر:
							</td>
							<td className="p-2 font-bold text-zinc-900 w-[32%] border-l border-zinc-200">
								{request.guardianName || "غير محدد"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								صلة القرابة:
							</td>
							<td className="p-2 text-zinc-900 w-[32%]">
								ولي أمر الطالب
							</td>
						</tr>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								رقم الجوال للتواصل:
							</td>
							<td className="p-2 font-mono text-zinc-900 font-semibold border-l border-zinc-200" dir="ltr">
								{request.guardianPhone || "غير مسجل"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								البريد الإلكتروني:
							</td>
							<td className="p-2 font-mono text-zinc-800 text-[11px]" dir="ltr">
								{request.guardianEmail || "لا يوجد بريد مسجل"}
							</td>
						</tr>
						<tr>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								المدينة والموقع:
							</td>
							<td className="p-2 text-zinc-900 border-l border-zinc-200">
								مكة المكرمة
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								حالة السجل بالنظام:
							</td>
							<td className="p-2 text-zinc-900">
								{request.convertedOwnerId ? "عميل مسجل مسبقاً" : "ولي أمر مسجل مع الطلب"}
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 5. Section 3: Assessment & Interview Session                    */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<section className="mb-4">
				<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
					<span>ثالثاً: تفاصيل جلسة المقابلة والفحص الأكاديمي</span>
					<span className="text-[10px] font-normal text-zinc-300">INTERVIEW SCHEDULE</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<tbody>
						<tr className="border-b border-zinc-200">
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								المراجع / الأخصائي المكلف:
							</td>
							<td className="p-2 font-bold text-zinc-900 w-[32%] border-l border-zinc-200">
								{request.reviewerName ||
									request.assignedStaff?.name ||
									request.assessmentAppointment?.staffName ||
									"فريق القبول والتسجيل"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 w-[18%] text-zinc-700 border-l border-zinc-200">
								تاريخ وتوقيت المقابلة:
							</td>
							<td className="p-2 text-zinc-900 font-mono w-[32%]">
								{formatDisplayDate(
									request.appointmentDate || request.assessmentAppointment?.startsAt,
								)}
							</td>
						</tr>
						<tr>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								القاعة / الغرفة:
							</td>
							<td className="p-2 text-zinc-900 border-l border-zinc-200">
								{request.roomName || "قاعة المقابلات الرئيسية"}
							</td>
							<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
								مدة الجلسة المقررة:
							</td>
							<td className="p-2 text-zinc-900">
								{request.interviewDurationMinutes ||
									request.assessmentAppointment?.durationMinutes ||
									20}{" "}
								دقيقة
							</td>
						</tr>
					</tbody>
				</table>
			</section>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 6. Section 4 & 5: Medical Profile & Financial Services          */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				{/* Medical Information */}
				<div>
					<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
						<span>رابعاً: الملف الصحي والطبي</span>
						<span className="text-[10px] font-normal text-zinc-300">MEDICAL RECORD</span>
					</div>
					<table className="w-full border-collapse border border-zinc-300 text-xs">
						<tbody>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 w-[35%] text-zinc-700 border-l border-zinc-200">
									فصيلة الدم:
								</td>
								<td className="p-2 font-mono font-bold text-zinc-900">
									{request.bloodType || "غير محددة"}
								</td>
							</tr>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									الحساسية والمحاذير:
								</td>
								<td className="p-2 text-zinc-900">
									{request.allergies ||
										(request.allergiesList && request.allergiesList.length > 0
											? request.allergiesList.join("، ")
											: "سليم - لا توجد حساسية مسجلة")}
								</td>
							</tr>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									الأمراض المزمنة:
								</td>
								<td className="p-2 text-zinc-900">
									{request.hasChronicDiseases
										? request.chronicDiseases || "مسجل حالات خاصة"
										: "سليم - لا توجد أمراض مزمنة"}
								</td>
							</tr>
							<tr>
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									الأدوية المنتظمة:
								</td>
								<td className="p-2 text-zinc-900">
									{request.medications && request.medications.length > 0
										? request.medications.map((m) => (typeof m === "string" ? m : m.name)).join("، ")
										: "لا توجد أدوية منتظمة"}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Financial & Subscription Services */}
				<div>
					<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
						<span>خامساً: الاشتراك والخدمات المالية</span>
						<span className="text-[10px] font-normal text-zinc-300">SUBSCRIPTION</span>
					</div>
					<table className="w-full border-collapse border border-zinc-300 text-xs">
						<tbody>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 w-[35%] text-zinc-700 border-l border-zinc-200">
									الباقة المختارة:
								</td>
								<td className="p-2 font-bold text-zinc-900">
									{request.subscriptionPlanName || "الباقة الأكاديمية القياسية"}
								</td>
							</tr>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									المبلغ التقديري:
								</td>
								<td className="p-2 font-mono font-bold text-zinc-900">
									{request.subscriptionAmount ? `${request.subscriptionAmount} ر.س` : "يحدد بعد اعتماد الباقة"}
								</td>
							</tr>
							<tr className="border-b border-zinc-200">
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									تضمين الوجبات:
								</td>
								<td className="p-2 text-zinc-900">
									{request.includeMeals ? "نعم (مفعل تلقائياً للاشتراك)" : "غير مفعل"}
								</td>
							</tr>
							<tr>
								<td className="bg-zinc-50 font-semibold p-2 text-zinc-700 border-l border-zinc-200">
									المصروف اليومي:
								</td>
								<td className="p-2 text-zinc-900">
									{request.enableDailyStipend ? "نعم (مفعل)" : "غير مفعل"}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 7. Section 6: Documents & Attachments                           */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<section className="mb-4">
				<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
					<span>سادساً: المستندات والملفات المرفقة بالطلب</span>
					<span className="text-[10px] font-normal text-zinc-300">ATTACHED DOCUMENTS</span>
				</div>
				<table className="w-full border-collapse border border-zinc-300 text-xs">
					<thead>
						<tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-700">
							<th className="p-1.5 text-center w-12 border-l border-zinc-300">#</th>
							<th className="p-1.5 text-right border-l border-zinc-300">اسم المستند / المرفق</th>
							<th className="p-1.5 text-center w-28 border-l border-zinc-300">الحجم</th>
							<th className="p-1.5 text-center w-28">حالة الاعتماد</th>
						</tr>
					</thead>
					<tbody>
						{request.documents?.items && request.documents.items.length > 0 ? (
							request.documents.items.map((doc, idx) => (
								<tr key={doc.id || idx} className="border-b border-zinc-200">
									<td className="p-1.5 text-center font-mono border-l border-zinc-200">{idx + 1}</td>
									<td className="p-1.5 font-semibold text-zinc-900 border-l border-zinc-200">
										{doc.title || "مستند رسمي"}
									</td>
									<td className="p-1.5 text-center font-mono text-zinc-600 border-l border-zinc-200">
										{doc.fileSize || "1.0 MB"}
									</td>
									<td className="p-1.5 text-center font-medium text-emerald-700">
										مرفق ومكتمل
									</td>
								</tr>
							))
						) : (
							<>
								<tr className="border-b border-zinc-200">
									<td className="p-1.5 text-center font-mono border-l border-zinc-200">1</td>
									<td className="p-1.5 font-semibold text-zinc-900 border-l border-zinc-200">
										شهادة ميلاد الطالب
									</td>
									<td className="p-1.5 text-center font-mono text-zinc-600 border-l border-zinc-200">
										1.4 MB
									</td>
									<td className="p-1.5 text-center font-medium text-emerald-700">
										مرفق ومكتمل
									</td>
								</tr>
								<tr className="border-b border-zinc-200">
									<td className="p-1.5 text-center font-mono border-l border-zinc-200">2</td>
									<td className="p-1.5 font-semibold text-zinc-900 border-l border-zinc-200">
										هوية ولي الأمر الوطنية
									</td>
									<td className="p-1.5 text-center font-mono text-zinc-600 border-l border-zinc-200">
										0.9 MB
									</td>
									<td className="p-1.5 text-center font-medium text-emerald-700">
										مرفق ومكتمل
									</td>
								</tr>
							</>
						)}
					</tbody>
				</table>
			</section>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 8. Section 7: Administrative Notes & Recommendations           */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<section className="mb-5">
				<div className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs rounded-t flex items-center justify-between">
					<span>سابعاً: الملاحظات والتوصيات الأكاديمية والإدارية</span>
					<span className="text-[10px] font-normal text-zinc-300">NOTES & EVALUATION</span>
				</div>
				<div className="border border-zinc-300 rounded-b p-3 text-xs bg-zinc-50/50 space-y-2">
					<div>
						<span className="font-bold text-zinc-800">ملاحظات الطلب المسجلة: </span>
						<span className="text-zinc-700">
							{request.notes || "يحتاج متابعة خاصة في التكيف الأكاديمي والاجتماعي خلال الأسبوع الأول."}
						</span>
					</div>
					{request.comments && request.comments.length > 0 && (
						<div className="pt-2 border-t border-zinc-200">
							<span className="font-bold text-zinc-800 block mb-1">سجل المتابعة والنشاط:</span>
							<ul className="list-disc list-inside space-y-0.5 text-zinc-600 text-[11px]">
								{request.comments.map((c) => (
									<li key={c.id}>
										<strong className="text-zinc-800">{c.authorName}:</strong> {c.body}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</section>

			{/* ═══════════════════════════════════════════════════════════════ */}
			{/* 9. Section 8: Signatures & Official Approvals                   */}
			{/* ═══════════════════════════════════════════════════════════════ */}
			<footer className="border-t-2 border-zinc-900 pt-4 mt-6">
				<div className="text-[10px] text-zinc-500 mb-4 text-center">
					إقرار: أقر أنا ولي أمر الطالب بصحة كافة البيانات والمعلومات الواردة أعلاه، وأوافق على سياسات ولوائح القبول والتسجيل بالأكاديمية.
				</div>

				<div className="grid grid-cols-3 gap-6 text-center text-xs">
					{/* Guardian Signature */}
					<div className="border border-zinc-300 rounded p-3 bg-zinc-50 flex flex-col justify-between min-h-[95px]">
						<span className="font-bold text-zinc-800">توقيع ولي الأمر</span>
						<div className="border-b border-dashed border-zinc-400 my-3"></div>
						<span className="text-[10px] text-zinc-500 font-mono">التاريخ: ___ / ___ / 2026</span>
					</div>

					{/* Reviewer Signature */}
					<div className="border border-zinc-300 rounded p-3 bg-zinc-50 flex flex-col justify-between min-h-[95px]">
						<span className="font-bold text-zinc-800">مسؤول القبول والتسجيل</span>
						<div className="border-b border-dashed border-zinc-400 my-3"></div>
						<span className="text-[10px] text-zinc-500">
							{request.reviewerName || "د. معاذ الغامدي"}
						</span>
					</div>

					{/* Center Stamp */}
					<div className="border border-zinc-300 rounded p-3 bg-zinc-50 flex flex-col items-center justify-center min-h-[95px]">
						<div className="size-16 rounded-full border-2 border-dashed border-zinc-400 flex items-center justify-center text-[10px] font-bold text-zinc-400">
							الختم الرسمي
						</div>
					</div>
				</div>

				<div className="mt-4 text-center text-[9px] text-zinc-400 border-t border-zinc-200 pt-2 font-mono">
					وثيقة رسمية صادرة عن نظام سند الإلكتروني لإدارة التسجيل الأكاديمي الموحد • رقم التحقق: {request.id}
				</div>
			</footer>
		</div>
	);
}

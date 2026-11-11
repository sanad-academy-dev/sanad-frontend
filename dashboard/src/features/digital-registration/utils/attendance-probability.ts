/**
 * دالة حساب احتمالية حضور المقابلة بذكاء وتدرج زمني منطقي
 * بناءً على دورة حياة الطلب والمرحلة الحالية وقرب موعد المقابلة:
 * 
 * 1. الطابور (QUEUE) والقائمة المختصرة (SHORTLIST):
 *    - غير منطقي عرض احتمالية الحضور قبل تحديد مسار وموعد، لذا تُخفى تماماً (shouldShow = false).
 * 2. قائمة الانتظار (WAITLIST):
 *    - تُخفى شارة الاحتمالية لصالح شارة رتبة الانتظار والوقت المتوقع.
 * 3. المقابلة الشخصية (INTERVIEW):
 *    - كلما اقترب موعد المقابلة ترتفع النسبة ديناميكياً (من 65% إلى 98%).
 *    - إذا تم تسجيل الحضور أو إتمام المقابلة ترتفع النسبة إلى 100%.
 *    - إذا فات الموعد المحدد دون حضور ولم ينتقل للمرحلة التالية تنخفض النسبة إلى 15% ("لم يحضر / فائت").
 *    - إذا ألغي الموعد تكون النسبة 0%.
 * 4. انتظار الدفع (AWAITING_PAYMENT):
 *    - اجتاز المقابلة بنجاح فتكون النسبة 100% ثابتة.
 * 5. الاعتماد والقبول (ACCEPTED):
 *    - قُبل الطالب نهائياً بعد الحضور فتكون النسبة 100%.
 * 6. الرفض (REJECTED):
 *    - رُفض الطلب ولا أمل في حضوره فتكون النسبة 0% صراحة.
 */

export interface AttendanceProbabilityResult {
	/** هل يجب إظهار شارة احتمالية الحضور في هذه البطاقة/المرحلة؟ */
	shouldShow: boolean;
	/** النسبة المئوية المحسوبة (0 إلى 100) */
	percentage: number;
	/** النص المعروض باللغة العربية */
	label: string;
	/** التصنيف اللوني للمظهر */
	variant: "emerald" | "blue" | "amber" | "rose" | "zinc";
	/** سبب أو تفصيل النسبة للـ Tooltip */
	reason?: string;
}

export function getAttendanceProbability(item: {
	status?: string | null;
	column?: string | null;
	appointmentDate?: string | null;
	assessmentAppointment?: {
		startsAt?: string | null;
		status?: string | null;
	} | null;
	attendanceProbability?: number | null;
}): AttendanceProbabilityResult {
	const rawStatus = (item.status || item.column || "").toUpperCase();
	const rawColumn = (item.column || "").toLowerCase();

	// 1. الطابور والقائمة المختصرة: غير منطقي إظهار احتمالية الحضور
	if (
		rawStatus === "QUEUE" ||
		rawStatus === "SHORTLIST" ||
		rawColumn === "queue" ||
		rawColumn === "shortlist" ||
		rawStatus === "DUPLICATE"
	) {
		return {
			shouldShow: false,
			percentage: 0,
			label: "",
			variant: "zinc",
		};
	}

	// 2. قائمة الانتظار: تعرض شارة الرتبة ووقت الانتظار المتوقع بدلاً من احتمالية الحضور
	if (rawStatus === "WAITLIST" || rawColumn === "waitlist") {
		return {
			shouldShow: false,
			percentage: 0,
			label: "",
			variant: "amber",
		};
	}

	// 3. حالة الرفض: النسبة 0% لأنه لا أمل في الحضور
	if (rawStatus === "REJECTED" || rawColumn === "rejected") {
		return {
			shouldShow: true,
			percentage: 0,
			label: "احتمالية الحضور: 0%",
			variant: "rose",
			reason: "تم رفض الطلب - لا يوجد أمل في الحضور",
		};
	}

	// 4. انتظار الدفع والقبول النهائي: حضر واجتاز المقابلة بنسبة 100%
	if (
		rawStatus === "AWAITING_PAYMENT" ||
		rawStatus === "ACCEPTED" ||
		rawColumn === "awaiting_payment" ||
		rawColumn === "accepted"
	) {
		return {
			shouldShow: true,
			percentage: 100,
			label: "احتمالية الحضور: 100%",
			variant: "emerald",
			reason: rawStatus === "ACCEPTED" ? "تم قبول الطالب رسمياً" : "حضر المقابلة واجتازها بنجاح",
		};
	}

	// 5. مرحلة المقابلة الشخصية (INTERVIEW): تتدرج حسب قرب الموعد وحالة الحضور
	if (rawStatus === "INTERVIEW" || rawColumn === "interview") {
		const appointmentStatus = item.assessmentAppointment?.status?.toUpperCase();

		// حضور مؤكد أو تم فحص الحضور
		if (
			appointmentStatus === "DONE" ||
			appointmentStatus === "CHECK_IN" ||
			appointmentStatus === "IN_SERVICE"
		) {
			return {
				shouldShow: true,
				percentage: 100,
				label: "حضر المقابلة: 100%",
				variant: "emerald",
				reason: "تم تسجيل حضور الطالب للمقابلة بنجاح",
			};
		}

		// موعد ملغي
		if (appointmentStatus === "CANCELLED") {
			return {
				shouldShow: true,
				percentage: 0,
				label: "احتمالية الحضور: 0%",
				variant: "rose",
				reason: "تم إلغاء موعد المقابلة",
			};
		}

		// التحقق من موعد المقابلة
		const rawDate = item.assessmentAppointment?.startsAt || item.appointmentDate;
		if (!rawDate) {
			return {
				shouldShow: true,
				percentage: 50,
				label: "احتمالية الحضور: 50%",
				variant: "blue",
				reason: "في مرحلة المقابلة - بانتظار تحديد وتأكيد الموعد",
			};
		}

		const appointmentTime = new Date(rawDate);
		if (isNaN(appointmentTime.getTime())) {
			return {
				shouldShow: true,
				percentage: 50,
				label: "احتمالية الحضور: 50%",
				variant: "blue",
				reason: "بانتظار تحديد موعد صالح",
			};
		}

		const now = new Date();
		const diffMs = appointmentTime.getTime() - now.getTime();
		const diffHours = diffMs / (1000 * 60 * 60);

		// إذا مر الموعد المحدد بأكثر من ساعتين ولم يحضر الطالب وما زال في عمود المقابلة
		if (diffHours < -2) {
			return {
				shouldShow: true,
				percentage: 15,
				label: "لم يحضر / متغيب: 15%",
				variant: "amber",
				reason: "فات موعد المقابلة المحدد ولم يتم تسجيل حضور",
			};
		}

		// وقت الموعد الآن (ضمن نافذة الموعد: من قبلها بدقائق حتى ساعتين بعد البداية)
		if (diffHours <= 0 && diffHours >= -2) {
			return {
				shouldShow: true,
				percentage: 98,
				label: "احتمالية الحضور: 98%",
				variant: "emerald",
				reason: "حان موعد المقابلة الآن",
			};
		}

		// الموعد خلال اليوم الحالي (أقل من 6 ساعات)
		if (diffHours <= 6) {
			return {
				shouldShow: true,
				percentage: 95,
				label: "احتمالية الحضور: 95%",
				variant: "emerald",
				reason: "الموعد اليوم خلال ساعات قليلة",
			};
		}

		// الموعد خلال 24 ساعة (غداً أو لاحقاً اليوم)
		if (diffHours <= 24) {
			return {
				shouldShow: true,
				percentage: 90,
				label: "احتمالية الحضور: 90%",
				variant: "blue",
				reason: "الموعد مجدول خلال أقل من 24 ساعة",
			};
		}

		// الموعد خلال يومين (24 إلى 48 ساعة)
		if (diffHours <= 48) {
			return {
				shouldShow: true,
				percentage: 85,
				label: "احتمالية الحضور: 85%",
				variant: "blue",
				reason: "الموعد مجدول بعد يومين",
			};
		}

		// الموعد خلال 3 أيام (48 إلى 72 ساعة)
		if (diffHours <= 72) {
			return {
				shouldShow: true,
				percentage: 80,
				label: "احتمالية الحضور: 80%",
				variant: "blue",
				reason: "الموعد مجدول بعد 3 أيام",
			};
		}

		// الموعد خلال 4 إلى 5 أيام
		if (diffHours <= 120) {
			return {
				shouldShow: true,
				percentage: 75,
				label: "احتمالية الحضور: 75%",
				variant: "blue",
				reason: "الموعد مجدول بعد 4 إلى 5 أيام",
			};
		}

		// الموعد بعد أكثر من 5 أيام
		return {
			shouldShow: true,
			percentage: 65,
			label: "احتمالية الحضور: 65%",
			variant: "blue",
			reason: "موعد المقابلة مجدول مستقبلاً (أكثر من 5 أيام)",
		};
	}

	// أي حالة أخرى غير معرّفة: لا نعرض شارة
	return {
		shouldShow: false,
		percentage: 0,
		label: "",
		variant: "zinc",
	};
}

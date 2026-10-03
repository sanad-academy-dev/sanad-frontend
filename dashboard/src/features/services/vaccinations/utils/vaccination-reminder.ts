import type { VaccinationDueRow } from "@/server/vaccinations/vaccinations.type";

/**
 * تذكير واتساب — رابط `wa.me` يفتح المحادثة برسالة جاهزة.
 *
 * لماذا رابط لا إرسال آلي: لا يوجد ناقل واتساب في هذا النظام. لا مزوّد، ولا مهمة
 * مجدولة، و`Appointment.whatsappReminderEnabled` يُكتب من معالج الحجز ولا يقرأه أي
 * مسار إرسال. الرابط يعمل اليوم بلا بنية تحتية، والإرسال يبقى فعلًا بشريًا موثّقًا
 * في سجل المحادثة لدى الموظف — لا وعدًا بإرسال لا يحدث.
 */

const arabicDate = new Intl.DateTimeFormat("ar", { dateStyle: "long" });

/** يطبّع الهاتف إلى صيغة دولية بلا رموز — `wa.me` لا يقبل مسافات ولا `+`. */
export const normalizePhone = (phone: string, defaultCountryCode = "966"): string => {
	const digits = phone.replace(/\D/g, "");
	if (digits.startsWith("00")) return digits.slice(2);
	// رقم محلي يبدأ بصفر: استبدل الصفر برمز الدولة
	if (digits.startsWith("0")) return `${defaultCountryCode}${digits.slice(1)}`;
	if (digits.startsWith(defaultCountryCode)) return digits;
	return digits;
};

export const buildReminderMessage = (row: VaccinationDueRow, clinicName: string): string => {
	const greeting = row.ownerName ? `مرحبًا ${row.ownerName}،` : "مرحبًا،";
	const when =
		row.status === "OVERDUE"
			? `تأخّر موعد التطعيم${row.dueAt ? ` المستحق في ${arabicDate.format(new Date(row.dueAt))}` : ""}`
			: row.status === "NOT_STARTED"
				? "حان وقت بدء برنامج التطعيم"
				: row.dueAt
					? `موعد التطعيم القادم في ${arabicDate.format(new Date(row.dueAt))}`
					: "هناك جرعة تطعيم مستحقة";

	const antigens = row.dueAntigens.length
		? `\nالجرعات المطلوبة: ${row.dueAntigens.join("، ")}.`
		: "";

	return [
		greeting,
		`${when} للطفل «${row.patientName}».${antigens}`,
		"",
		`يسعدنا حجز موعد لكم — ${clinicName}.`,
	].join("\n");
};

/** يبني رابط `wa.me`. يعيد `null` إذا لم يكن للوليّ أمر رقم — لا رابط بلا وجهة. */
export const buildWhatsAppLink = (
	row: VaccinationDueRow,
	clinicName: string,
): string | null => {
	if (!row.ownerPhone?.trim()) return null;
	const phone = normalizePhone(row.ownerPhone);
	if (phone.length < 8) return null;
	return `https://wa.me/${phone}?text=${encodeURIComponent(buildReminderMessage(row, clinicName))}`;
};

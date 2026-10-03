import { describe, expect, it } from "vitest";

import {
	buildReminderMessage,
	buildWhatsAppLink,
	normalizePhone,
} from "@/features/services/vaccinations/utils/vaccination-reminder";
import type { VaccinationDueRow } from "@/server/vaccinations/vaccinations.type";

const row = (overrides: Partial<VaccinationDueRow> = {}): VaccinationDueRow => ({
	patientId: "p1",
	patientCode: "PT-0001",
	patientName: "لولو",
	animalTypeName: "كلب",
	ownerId: "o1",
	ownerName: "أحمد",
	ownerPhone: "0501234567",
	status: "OVERDUE",
	dueAt: new Date("2026-08-01T00:00:00"),
	daysUntilDue: -16,
	dueAntigens: ["فيروس الديستمبر الكلبي", "داء الكَلَب (السُّعار)"],
	dueAntigenCodes: ["CDV", "RABIES"],
	lastGivenAt: null,
	...overrides,
});

describe("normalizePhone", () => {
	it("يستبدل الصفر المحلي برمز الدولة", () => {
		expect(normalizePhone("0501234567")).toBe("966501234567");
	});

	it("يزيل بادئة 00 الدولية", () => {
		expect(normalizePhone("00966501234567")).toBe("966501234567");
	});

	it("يترك الرقم الدولي كما هو ويُسقط الرموز", () => {
		expect(normalizePhone("+966 50 123 4567")).toBe("966501234567");
	});
});

describe("buildWhatsAppLink", () => {
	it("يبني رابطًا برسالة مُرمَّزة", () => {
		const link = buildWhatsAppLink(row(), "أكاديمية النخبة");
		expect(link).toContain("https://wa.me/966501234567?text=");
		expect(decodeURIComponent(link as string)).toContain("لولو");
		expect(decodeURIComponent(link as string)).toContain("أكاديمية النخبة");
	});

	it("لا رابط بلا رقم — الوجهة شرط لا تفصيل", () => {
		expect(buildWhatsAppLink(row({ ownerPhone: null }), "أكاديمية")).toBeNull();
		expect(buildWhatsAppLink(row({ ownerPhone: "  " }), "أكاديمية")).toBeNull();
	});

	it("لا رابط لرقم أقصر من أن يكون صالحًا", () => {
		expect(buildWhatsAppLink(row({ ownerPhone: "123" }), "أكاديمية")).toBeNull();
	});
});

describe("buildReminderMessage", () => {
	it("المتأخّر يذكر التأخّر وتاريخ الاستحقاق", () => {
		const message = buildReminderMessage(row(), "أكاديمية النخبة");
		expect(message).toContain("تأخّر موعد التطعيم");
		expect(message).toContain("الجرعات المطلوبة");
	});

	it("من لم يبدأ يُدعى لبدء البرنامج لا لتدارُك تأخّر", () => {
		const message = buildReminderMessage(row({ status: "NOT_STARTED" }), "أكاديمية");
		expect(message).toContain("حان وقت بدء برنامج التطعيم");
		expect(message).not.toContain("تأخّر");
	});

	it("يحيّي بلا اسم حين لا وليّ أمر مسجَّل", () => {
		const message = buildReminderMessage(
			row({ ownerName: null, status: "DUE_SOON" }),
			"أكاديمية",
		);
		expect(message.startsWith("مرحبًا،")).toBe(true);
	});
});

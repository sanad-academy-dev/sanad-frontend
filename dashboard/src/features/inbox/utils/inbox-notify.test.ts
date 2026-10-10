import { describe, expect, it } from "vitest";

import { formatAlertContent, shouldAlert } from "@/features/inbox/utils/inbox-notify";
import type { InboxPushPayload } from "@/server/inbox/inbox.type";
import { DEFAULT_INBOX_SETTINGS } from "@sanad/contracts/runtime/server/inbox-settings/inbox-settings.type";

const ME = "user_me";

function payload(overrides: Partial<InboxPushPayload> = {}): InboxPushPayload {
	return {
		id: "itm_1",
		clinicId: "cln_1",
		kind: "NOTIFICATION",
		type: "LAB",
		importance: "NORMAL",
		title: "نتيجة تحليل جاهزة",
		recipientUserId: null,
		appointmentId: null,
		taskId: null,
		createdAt: "2026-08-06T09:00:00.000Z",
		...overrides,
	};
}

describe("shouldAlert", () => {
	it("ينبّه بالإعدادات الافتراضية لإشعار على مستوى الأكاديمية", () => {
		expect(shouldAlert(payload(), DEFAULT_INBOX_SETTINGS, ME)).toBe(true);
	});

	it("لا ينبّه إطلاقًا عند إطفاء المفتاح الرئيسي", () => {
		const settings = { ...DEFAULT_INBOX_SETTINGS, liveEnabled: false };
		expect(shouldAlert(payload({ importance: "HIGH" }), settings, ME)).toBe(false);
	});

	it("يكتم عنصرًا موجّهًا لمستخدم آخر", () => {
		expect(
			shouldAlert(payload({ recipientUserId: "user_other" }), DEFAULT_INBOX_SETTINGS, ME),
		).toBe(false);
	});

	it("ينبّه لعنصر موجّه للمستخدم نفسه", () => {
		expect(shouldAlert(payload({ recipientUserId: ME }), DEFAULT_INBOX_SETTINGS, ME)).toBe(
			true,
		);
	});

	it("يحترم فلتر الأهمية العالية", () => {
		const settings = { ...DEFAULT_INBOX_SETTINGS, onlyHighImportance: true };
		expect(shouldAlert(payload({ importance: "NORMAL" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ importance: "HIGH" }), settings, ME)).toBe(true);
	});

	it("يكتم النوع المُطفأ ويُبقي غيره", () => {
		const settings = { ...DEFAULT_INBOX_SETTINGS, typeLab: false };
		expect(shouldAlert(payload({ type: "LAB" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ type: "RADIOLOGY" }), settings, ME)).toBe(true);
	});

	it("يجمع أنواع الجلسات الأربعة تحت مفتاح واحد", () => {
		const settings = { ...DEFAULT_INBOX_SETTINGS, typeAppointments: false };
		expect(shouldAlert(payload({ type: "APPOINTMENT_NEW" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ type: "APPOINTMENT_CANCELLED" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ type: "APPOINTMENT_PENDING" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ type: "APPOINTMENT_CONFIRMED" }), settings, ME)).toBe(false);
	});

	it("يحكم الموافقات بمفتاحها الخاص لا بنوع المستند تحتها", () => {
		// موافقة من نوع TASK: مفتاح المهام مطفأ لكن مفتاح الموافقات مُشغّل
		const settings = { ...DEFAULT_INBOX_SETTINGS, typeTasks: false, typeApprovals: true };
		expect(shouldAlert(payload({ kind: "APPROVAL", type: "TASK" }), settings, ME)).toBe(true);

		const muted = { ...DEFAULT_INBOX_SETTINGS, typeTasks: true, typeApprovals: false };
		expect(shouldAlert(payload({ kind: "APPROVAL", type: "TASK" }), muted, ME)).toBe(false);
	});

	it("يعامل CARE و SYSTEM تحت مفتاح النظام", () => {
		const settings = { ...DEFAULT_INBOX_SETTINGS, typeSystem: false };
		expect(shouldAlert(payload({ type: "CARE" }), settings, ME)).toBe(false);
		expect(shouldAlert(payload({ type: "SYSTEM" }), settings, ME)).toBe(false);
	});
});

describe("formatAlertContent", () => {
	it("يعرض عنوان العنصر ووصفه عندما يكون وحيدًا في دفعته", () => {
		const content = formatAlertContent(payload({ title: "نتيجة تحليل" }), 1);
		expect(content).toEqual({
			title: "نتيجة تحليل",
			description: "إشعار جديد في صندوق الوارد",
		});
	});

	it("يميّز وصف الإشعار المهم عن العادي", () => {
		expect(formatAlertContent(payload({ importance: "HIGH" }), 1).description).toBe(
			"إشعار مهم في صندوق الوارد",
		);
		expect(formatAlertContent(payload({ kind: "APPROVAL" }), 1).description).toBe(
			"طلب موافقة جديد بانتظار مراجعتك",
		);
	});

	it("يجمع الدفعة في عدّاد واحد مع آخر عنوان كوصف", () => {
		const content = formatAlertContent(payload({ title: "آخر إشعار" }), 3);
		expect(content).toEqual({ title: "3 إشعارات جديدة", description: "آخر إشعار" });
	});

	it("يستخدم صيغة الجمع العربية الصحيحة", () => {
		expect(formatAlertContent(payload(), 2).title).toBe("إشعاران جديدان");
		expect(formatAlertContent(payload(), 10).title).toBe("10 إشعارات جديدة");
		expect(formatAlertContent(payload(), 11).title).toBe("11 إشعارًا جديدًا");
	});
});

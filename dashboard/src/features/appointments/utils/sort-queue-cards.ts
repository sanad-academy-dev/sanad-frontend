import { priorityRank } from "@/features/appointments/data/status-meta";
import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";
import type { BranchSettings } from "@/server/branches/branches.type";

/** إعدادات الطابور لكل فرع (مفتاح branchId) — تُبنى من قائمة الفروع في اللوحة */
export type QueueSettingsByBranch = Record<string, BranchSettings["queue"]>;

/**
 * يرتّب بطاقات عمود الطابور (WAITING) حسب إعدادات فرع كل بطاقة:
 * 1) الحالات الطارئة أولًا (عند تفعيل emergencyToFront)
 * 2) الأولوية الطبية تنازليًا (عند تفعيل medicalPriority)
 * 3) وقت البدء تصاعديًا (السلوك الافتراضي دائمًا)
 * البطاقات خارج عمود الطابور تبقى بترتيب الخادم (وقتيًا).
 */
export function sortQueueCards(
	cards: AppointmentCardData[],
	settingsByBranch: QueueSettingsByBranch,
): AppointmentCardData[] {
	const queueCards = cards.filter((c) => c.column === "queue");
	if (queueCards.length < 2) return cards;

	const sortedQueue = [...queueCards].sort((a, b) => {
		const aSettings = settingsByBranch[a.branchId];
		const bSettings = settingsByBranch[b.branchId];

		// عامل الطوارئ — مشترك عندما يكون مفعّلًا لأي من الفرعين
		const emergencyOn = !!aSettings?.emergencyToFront || !!bSettings?.emergencyToFront;
		if (emergencyOn && a.isEmergency !== b.isEmergency) {
			return a.isEmergency ? -1 : 1;
		}

		// الأولوية الطبية — تنازليًا
		const priorityOn = !!aSettings?.medicalPriority || !!bSettings?.medicalPriority;
		if (priorityOn) {
			const diff = priorityRank(b.priority) - priorityRank(a.priority);
			if (diff !== 0) return diff;
		}

		// الوقت — تصاعديًا
		return a.startsAt.getTime() - b.startsAt.getTime();
	});

	// أعِد دمج الطابور المرتَّب في مكانه مع الحفاظ على ترتيب باقي الأعمدة
	let queueIndex = 0;
	return cards.map((card) => (card.column === "queue" ? sortedQueue[queueIndex++] : card));
}

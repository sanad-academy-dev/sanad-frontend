import { treaty } from "@elysiajs/eden";

import type { App } from "@sanad/contracts/types/server/app";
import { backendUrl } from "@/lib/backend-fetch";

/**
 * عنوان خدمة الـ API المستقلة.
 *
 * لا تعتمد لوحة الإدارة على `window.location.origin`: هذا الأصل يخص واجهة الـDashboard
 * بعد الفصل، بينما الـAPI يعيش في خدمة مستقلة (محليًا: http://localhost:5180).
 * نُبقي نوع App مستوردًا مؤقتًا من المصدر المحلي لكي تظل Eden Treaty مكتوبة الأنواع
 * أثناء مرحلة الترحيل؛ أما الطلبات الفعلية فتذهب إلى sanad-backend.
 */
const baseUrl = backendUrl("");

export const api = treaty<App>(baseUrl, {
	fetch: { credentials: "include" },
}).api;

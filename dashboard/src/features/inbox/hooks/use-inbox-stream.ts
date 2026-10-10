import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { useInboxSettings } from "@/features/inbox/hooks/use-inbox-settings";
import { deliverInboxAlert, shouldAlert } from "@/features/inbox/utils/inbox-notify";
import { useSession } from "@/lib/auth/client";
import { backendUrl } from "@/lib/backend-fetch";
import type { InboxPushPayload } from "@/server/inbox/inbox.type";

/**
 * يفتح قناة SSE واحدة على /api/inbox/stream ويحوّل كل عنصر وارد جديد إلى
 * تنبيه لحظي (نافذة/صوت/سطح المكتب) + تحديث للشارة والقوائم.
 *
 * يُركّب مرّة واحدة في تخطيط الصفحات المحميّة — لا تستدعِه في أكثر من مكان،
 * وإلّا فُتحت قنوات متعدّدة وتكرّر التنبيه.
 */
export function useInboxStream(): void {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: session } = useSession();
	const { settings } = useInboxSettings();

	// مراجع حيّة: تتغيّر التفضيلات والهويّة دون إعادة فتح القناة.
	// المزامنة داخل useEffect لا أثناء الرسم — الكتابة على ref في جسم المكوّن
	// أثر جانبي في طور الرسم يحذّر منه React.
	const settingsRef = useRef(settings);
	const userIdRef = useRef<string | null>(session?.user.id ?? null);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	useEffect(() => {
		userIdRef.current = session?.user.id ?? null;
	}, [session]);

	useEffect(() => {
		if (typeof window === "undefined" || typeof EventSource === "undefined") return;

		const source = new EventSource(backendUrl("/api/inbox/stream"), { withCredentials: true });

		const onNew = (event: MessageEvent<string>) => {
			let payload: InboxPushPayload;
			try {
				payload = JSON.parse(event.data);
			} catch {
				return;
			}

			// حدّث دائمًا: الشارة والقوائم تعكس الأكاديمية كاملةً بغضّ النظر عن التنبيه
			queryClient.invalidateQueries({ queryKey: ["inbox"] });

			if (!shouldAlert(payload, settingsRef.current, userIdRef.current)) return;

			deliverInboxAlert(payload, settingsRef.current, () => {
				navigate({ to: "/inbox" });
			});
		};

		source.addEventListener("inbox.new", onNew);
		// EventSource يعيد الاتصال تلقائيًا وفق retry المُرسل من الخادم — لا نتدخّل

		return () => {
			source.removeEventListener("inbox.new", onNew);
			source.close();
		};
	}, [queryClient, navigate]);
}

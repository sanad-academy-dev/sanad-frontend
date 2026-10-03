import { useEffect, useState } from "react";

import type { LiveState } from "@/components/common/live-badge";
import {
	LAB_TESTS_CLIENT_TICK_MS,
	LAB_TESTS_REFETCH_INTERVAL_MS,
} from "@/features/services/lab-tests/hooks/use-lab-tests-list";

type LiveQueryMeta = {
	isError: boolean;
	failureCount: number;
	dataUpdatedAt: number;
};

// حالة "مباشر" لشريط التنبيهات — تصبح "غير متصل" عند فشل الجلب أو تقادم آخر تحديث
export const useLabTestsLive = ({ isError, failureCount, dataUpdatedAt }: LiveQueryMeta) => {
	const [nowMs, setNowMs] = useState(() => Date.now());

	useEffect(() => {
		const id = setInterval(() => setNowMs(Date.now()), LAB_TESTS_CLIENT_TICK_MS);
		return () => clearInterval(id);
	}, []);

	const isStale =
		dataUpdatedAt > 0 && nowMs - dataUpdatedAt > LAB_TESTS_REFETCH_INTERVAL_MS * 2;
	const liveState: LiveState =
		isError || failureCount >= 2 || isStale ? "disconnected" : "live";

	return { liveState };
};

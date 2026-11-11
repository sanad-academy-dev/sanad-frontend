"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
	expiresAt: string | null;
	onExpired?: () => void;
}

export function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState<{
		hours: number;
		minutes: number;
		seconds: number;
		isExpired: boolean;
	}>({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

	useEffect(() => {
		if (!expiresAt) return;

		const target = new Date(expiresAt).getTime();

		const update = () => {
			const now = Date.now();
			const diff = target - now;

			if (diff <= 0) {
				setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
				onExpired?.();
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft({ hours, minutes, seconds, isExpired: false });
		};

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, [expiresAt, onExpired]);

	if (!expiresAt || timeLeft.isExpired) {
		return (
			<div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
				<AlertTriangle className="h-4 w-4 shrink-0" />
				<span>انتهت مهلة الحجز المحددة لهذا الرابط. يرجى التواصل مع الأكاديمية للتجديد.</span>
			</div>
		);
	}

	const isUrgent = timeLeft.hours < 12;

	return (
		<div
			className={`flex flex-col items-stretch gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between transition-colors ${
				isUrgent
					? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
					: "border-primary/20 bg-primary/5 text-primary"
			}`}
		>
			<div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold sm:text-sm min-w-0">
				<Clock className="h-4 w-4 shrink-0 animate-pulse" aria-hidden="true" />
				<span>مهلة سداد الرسوم وحجز المقعد:</span>
			</div>
			<div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs font-bold sm:text-sm tabular-nums shrink-0" dir="ltr">
				<span className="inline-flex items-baseline gap-1 rounded-lg bg-background px-2.5 py-1.5 border border-border">
					<span>{String(timeLeft.hours).padStart(2, "0")}</span>
					<span className="text-[11px] font-medium text-muted-foreground">س</span>
				</span>
				<span className="text-muted-foreground">:</span>
				<span className="inline-flex items-baseline gap-1 rounded-lg bg-background px-2.5 py-1.5 border border-border">
					<span>{String(timeLeft.minutes).padStart(2, "0")}</span>
					<span className="text-[11px] font-medium text-muted-foreground">د</span>
				</span>
				<span className="text-muted-foreground">:</span>
				<span className="inline-flex items-baseline gap-1 rounded-lg bg-background px-2.5 py-1.5 border border-border">
					<span>{String(timeLeft.seconds).padStart(2, "0")}</span>
					<span className="text-[11px] font-medium text-muted-foreground">ث</span>
				</span>
			</div>
		</div>
	);
}

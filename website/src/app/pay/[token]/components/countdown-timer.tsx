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
			className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${
				isUrgent
					? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
					: "border-primary/20 bg-primary/5 text-primary"
			}`}
		>
			<div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
				<Clock className="h-4 w-4 shrink-0 animate-pulse" />
				<span>مهلة سداد الرسوم وحجز المقعد:</span>
			</div>
			<div className="flex items-center gap-1.5 font-mono text-xs font-bold sm:text-sm" dir="ltr">
				<span className="rounded-lg bg-background/80 px-2.5 py-1 shadow-sm border border-border">
					{String(timeLeft.hours).padStart(2, "0")} <span className="text-[10px] text-muted-foreground">س</span>
				</span>
				<span>:</span>
				<span className="rounded-lg bg-background/80 px-2.5 py-1 shadow-sm border border-border">
					{String(timeLeft.minutes).padStart(2, "0")} <span className="text-[10px] text-muted-foreground">د</span>
				</span>
				<span>:</span>
				<span className="rounded-lg bg-background/80 px-2.5 py-1 shadow-sm border border-border">
					{String(timeLeft.seconds).padStart(2, "0")} <span className="text-[10px] text-muted-foreground">ث</span>
				</span>
			</div>
		</div>
	);
}

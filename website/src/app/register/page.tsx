"use client";

import Link from "next/link";
import { MultiStepForm } from "@/components/multi-step-form";

/** Generic public intake URL used by the dashboard. Campaign codes remain optional legacy links. */
export default function RegisterPage() {
	return (
		<main className="min-h-screen bg-muted/30 px-4 py-10" dir="rtl">
			<div className="mx-auto mb-5 max-w-[540px] text-center">
				<Link href="/" className="text-sm font-semibold text-primary hover:underline">سند</Link>
				<h1 className="mt-2 text-2xl font-bold text-foreground">طلب التسجيل الرقمي</h1>
				<p className="mt-1 text-sm text-muted-foreground">أكمل البيانات وسيتواصل معك فريق القبول.</p>
			</div>
			<MultiStepForm className="mx-auto" />
		</main>
	);
}

import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const response = await fetch(`${getSanadBackendUrl()}/public/registration/payment/checkout`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ message: data?.message || "تعذر بدء جلسة الدفع" },
				{ status: response.status }
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[pay-checkout-api] خطأ أثناء تجهيز جلسة الدفع:", error);
		return NextResponse.json(
			{ message: "تعذر الاتصال بخادم الأكاديمية لبدء الدفع" },
			{ status: 500 }
		);
	}
}

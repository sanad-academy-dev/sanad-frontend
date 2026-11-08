import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const response = await fetch(`${getSanadBackendUrl()}/public/registration/payment/manual-transfer`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ message: data?.message || "فشل تسجيل إيصال السداد" },
				{ status: response.status }
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[pay-manual-api] خطأ أثناء إرسال إيصال السداد:", error);
		return NextResponse.json(
			{ message: "حدث خطأ غير متوقع أثناء إرسال الإيصال، يرجى المحاولة مرة أخرى" },
			{ status: 500 }
		);
	}
}

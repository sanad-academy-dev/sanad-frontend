import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
) {
	try {
		const { token } = await params;
		if (!token) {
			return NextResponse.json({ message: "رمز نموذج تقديم الخدمة مطلوب" }, { status: 400 });
		}

		const backendUrl = getSanadBackendUrl();
		const response = await fetch(
			`${backendUrl}/public/registration/contract/${encodeURIComponent(token)}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
				cache: "no-store",
			},
		);

		const data = await response.json().catch(() => null);
		if (!response.ok) {
			return NextResponse.json(
				{ message: data?.message || "رابط نموذج تقديم الخدمة غير صحيح أو غير موجود" },
				{ status: response.status },
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[contract-api] خطأ أثناء استرجاع نموذج تقديم الخدمة:", error);
		return NextResponse.json(
			{ message: "تعذر الاتصال بخادم الأكاديمية، يرجى المحاولة لاحقاً" },
			{ status: 500 },
		);
	}
}

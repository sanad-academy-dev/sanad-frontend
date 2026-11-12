import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
) {
	try {
		const { token } = await params;
		if (!token) {
			return NextResponse.json({ message: "رمز نموذج تقديم الخدمة مطلوب" }, { status: 400 });
		}

		const body = await req.json();
		const backendUrl = getSanadBackendUrl();
		const response = await fetch(
			`${backendUrl}/public/registration/contract/${encodeURIComponent(token)}/submit`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileUrl: body?.fileUrl,
					fileName: body?.fileName,
					fileSize: body?.fileSize,
					mimeType: body?.mimeType,
				}),
			},
		);

		const data = await response.json().catch(() => null);
		if (!response.ok) {
			return NextResponse.json(
				{ message: data?.message || "تعذر إرسال النسخة الموقّعة" },
				{ status: response.status },
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("[contract-submit-api] خطأ أثناء تسليم النسخة الموقّعة:", error);
		return NextResponse.json(
			{ message: "حدث خطأ غير متوقع أثناء إرسال الملف، يرجى المحاولة لاحقاً" },
			{ status: 500 },
		);
	}
}

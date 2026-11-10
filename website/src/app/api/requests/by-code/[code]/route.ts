import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const code = resolvedParams.code;
    if (!code) {
      return NextResponse.json({ message: "كود الطلب غير متوفر" }, { status: 400 });
    }

    const response = await fetch(`${getSanadBackendUrl()}/public/requests/by-code/${encodeURIComponent(code)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "طلب التسجيل غير موجود" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[requests-by-code-api] خطأ أثناء جلب بيانات الطلب:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}

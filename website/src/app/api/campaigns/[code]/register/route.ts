import { NextRequest, NextResponse } from "next/server";
import { SANAD_BACKEND_URL } from "@/lib/api-config";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();

    const response = await fetch(`${SANAD_BACKEND_URL}/public/campaigns/${code}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "تعذر إرسال طلب التسجيل في الحملة" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[campaign-register-api] خطأ أثناء التسجيل بالحملة:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}

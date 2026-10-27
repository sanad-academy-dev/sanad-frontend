import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${getSanadBackendUrl()}/public/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "تعذر إرسال طلب التسجيل" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[register-api] خطأ أثناء إرسال طلب التسجيل:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع في الخادم، يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

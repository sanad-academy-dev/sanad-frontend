import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const response = await fetch(`${getSanadBackendUrl()}/public/campaigns/${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "تعذر العثور على الحملة" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[campaign-get-api] خطأ أثناء جلب الحملة:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}

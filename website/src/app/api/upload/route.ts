import { NextRequest, NextResponse } from "next/server";
import { SANAD_BACKEND_URL } from "@/lib/api-config";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "لم يتم تحديد أي ملف للرفع" },
        { status: 400 }
      );
    }

    const outgoingFormData = new FormData();
    outgoingFormData.append("file", file);

    const response = await fetch(`${SANAD_BACKEND_URL}/public/upload`, {
      method: "POST",
      body: outgoingFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "فشل رفع الملف إلى الخادم" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[upload-api] خطأ أثناء رفع الملف:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع أثناء معالجة رفع الملف" },
      { status: 500 }
    );
  }
}

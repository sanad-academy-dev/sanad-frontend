import { NextRequest, NextResponse } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";
import {
  getSafeUploadName,
  validateUploadedFile,
} from "@/lib/upload-validation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "لم يتم تحديد أي ملف للرفع" },
        { status: 400 }
      );
    }

    const validationError = await validateUploadedFile(file);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const outgoingFormData = new FormData();
    outgoingFormData.append("file", file, getSafeUploadName(file));

    const response = await fetch(`${getSanadBackendUrl()}/public/upload`, {
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

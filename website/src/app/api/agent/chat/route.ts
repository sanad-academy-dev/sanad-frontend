import { NextRequest } from "next/server";
import { getSanadBackendUrl } from "@/lib/api-config";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;

const ipRequests = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return new Response(
        "لقد تجاوزت الحد المسموح به من الرسائل مؤقتاً. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
        { status: 429 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${getSanadBackendUrl()}/public/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return new Response(errText || "Error connecting to AI assistant", {
        status: response.status,
      });
    }

    if (!response.body) {
      return new Response("No response stream available", { status: 500 });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    console.error("[website/api/agent] Error proxying chat:", err);
    const message = err instanceof Error ? err.message : "Unknown proxy error";
    return new Response(
      message || "Failed to reach Sanad AI backend",
      { status: 500 }
    );
  }
}

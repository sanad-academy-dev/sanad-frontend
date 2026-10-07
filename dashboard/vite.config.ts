import { createLogger, defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const logger = createLogger();
const loggerWarn = logger.warn;
logger.warn = (message, options) => {
  if (
    message.includes("Module level directives cause errors when bundled") &&
    message.includes('"use client"') &&
    message.includes("node_modules/")
  ) {
    return;
  }

  loggerWarn(message, options);
};

export default defineConfig(({ mode }) => ({
  customLogger: logger,
  resolve: {
    alias: [
      {
        find: "@/generated",
        replacement: fileURLToPath(new URL("./contracts/generated", import.meta.url)),
      },
      {
        find: "@/server",
        replacement: fileURLToPath(new URL("./contracts/types/src/server", import.meta.url)),
      },
    ],
  },
  server: {
    // الهاتف يصل بعنوان الشبكة (192.168.x.x) عند تشغيل bun run dev:lan. وفيت يرفض المضيفات غير
    // المعروفة، فيسقط الطلب إلى معالج SSR ويعود HTML مكان وحدة JS.
    allowedHosts: true,
    watch: {
      /**
       * مجلّدات المخرجات خارج المراقبة — **وإلّا مات خادم التطوير**.
       *
		 * هذه المجلّدات مخرجات بناء يعيد Vite إنشاءها. المراقب على ويندوز يقرؤها في
		 * لحظة إعادة إنشائها فيرمي
       * `UNKNOWN` (errno -4094) من `scandir` أو `lstat`، وهو حدث `error` **غير
       * مُلتقَط** على FSWatcher — فلا يُسجَّل تحذيرًا بل يُسقط العملية كلّها.
       *
		 * حدث ذلك سابقًا مع مخرجات البناء؛ تجاهلها يمنع تعطل خادم التطوير على ويندوز.
       *
		 * ولا خسارة في تجاهلها: لا أحد يحرّرها يدويًا.
       */
      ignored: ["**/.tanstack/**", "**/.output/**"],
    },
  },
  plugins: [
    // consolePiping مُطفأ: كان يفتح اتصالَي SSE/long-poll لكل تبويب، ومع بثّ الوارد والدردشة
    // يبلغ التبويب الواحد ٤ اتصالات دائمة من أصل ٦ يسمح بها كروم لكل مضيف (HTTP/1.1).
    // تبويبان مفتوحان = لا مقبس متاح لأي طلب جديد ⇒ الصفحات تدور بلا نهاية والخادم لا
    // يرى الطلب أصلًا (آخر سطر في سجلّه GET /api/inbox/stream). أُثبت بـCDP في 2026-08-30.
    ...(mode === "development" ? [devtools({ consolePiping: { enabled: false } })] : []),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  optimizeDeps: {
    include: [
      "@tabler/icons-react",
      "fast-deep-equal",
      "seedrandom",
      "spark-md5",
      "xmlbuilder2",
      "lodash.get",
      "lodash.clonedeep",
      "lodash.debounce",
      "pako",
      "utif",
      "dicom-parser",
      "react-phone-number-input",
      "react-phone-number-input/flags",
      "react-phone-number-input/locale/ar.json",
      "react-hook-form",
      "@hookform/resolvers/zod",
      "better-auth/react",
      "better-auth/client/plugins",
      "@better-auth/i18n/client",
      // مفكّكات الضغط تُشحن بصيغة UMD، والمحمّل يستوردها ديناميكيًا. بلا تحويلها
      // مسبقًا يقرأها المتصفح كوحدة ESM بلا تصدير default فينهار فكّ ضغط الصور.
      "@cornerstonejs/codec-charls/decodewasmjs",
      "@cornerstonejs/codec-libjpeg-turbo-8bit/decodewasmjs",
      "@cornerstonejs/codec-openjpeg/decodewasmjs",
      "@cornerstonejs/codec-openjph/wasmjs",
    ],
    // محمّل DICOM يشحن Web Workers ووحدات WASM خاصة به — التحسين المسبق يكسرها
    //
    // [MC3.5] وMapLibre مثله: يشحن عاملًا يفكّ البلاطات المتّجهة. بعد التحسين المسبق كان
    // العامل يُحمَّل ولا يعمل، فتظهر الخريطة بلون الخلفية وشريط الإسناد فقط بلا أي بلاطة
    // وبلا خطأ. القياس: المصدر النقطي (ne2_shaded) يصل loaded=true، والمتّجه
    // (openmaptiles) يبقى loaded=false إلى الأبد — والفرق بينهما أنّ المتّجه وحده يمرّ
    // بالعامل.
    exclude: ["@cornerstonejs/dicom-image-loader", "@cornerstonejs/core", "@cornerstonejs/tools", "@cornerstonejs/metadata", "maplibre-gl"],
  },
  ssr: {
    noExternal: ["@livekit/components-styles"],
  },
  worker: {
    format: "es" as const,
  },
  build: {
    reportCompressedSize: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.id?.includes("node_modules") &&
          warning.message.includes('"use client"')
        ) {
          return;
        }

        warn(warning);
      },
    },
  },
}));

import { Metadata } from "next";
import Support from "./components/support";

export const metadata: Metadata = {
  title: "تحدث معنا | أكاديمية سند",
  description: "تواصل مع فريق سند للحصول على الدعم والمساعدة عبر الواتساب أو البريد الإلكتروني.",
};

export default function ContactPage() {
  return <Support />;
}

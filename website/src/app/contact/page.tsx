import { Metadata } from "next";
import Support from "./components/support";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "تواصل معنا | سند",
  description: "تواصل مع فريق سند للحصول على الدعم والمساعدة عبر الواتساب أو البريد الإلكتروني.",
};

export default function ContactPage() {
  return (
    <main className=" min-h-screen mt-20">
      <Container  >
        <Support />
      </Container>
    </main>
  );
}
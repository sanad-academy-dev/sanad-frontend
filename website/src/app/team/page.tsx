import type { Metadata } from "next";
import TeamView from "./components/team-view";

export const metadata: Metadata = {
  title: "فريق العمل | أكاديمية سند",
  description: "نخبة من المعلمين والخبراء المتخصصين في تعليم البرمجة والذكاء الاصطناعي للأطفال واليافعين في أكاديمية سند.",
};

export default function TeamPage() {
  return <TeamView />;
}

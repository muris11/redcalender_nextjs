import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Onboarding Kesehatan",
  description:
    "Lengkapi profil kesehatan Anda untuk pengalaman tracking menstruasi yang personal dan akurat dengan Red Calender.",
};

const OnboardingContent = dynamic(() => import("./OnboardingContent"));

export default function OnboardingPage() {
  return <OnboardingContent />;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Red Calendar",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edukasi Kesehatan - Red Calendar",
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analisis Kesehatan - Red Calendar",
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

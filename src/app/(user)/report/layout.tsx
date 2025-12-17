import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Kesehatan - Red Calendar",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

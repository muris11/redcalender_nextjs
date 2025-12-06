import { PageLoading } from "@/components/ui/loading";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Laporan Kesehatan Menstruasi Lengkap",
  description:
    "Laporan kesehatan menstruasi lengkap dengan analisis tren siklus, statistik periode, grafik kesehatan, dan wawasan personal untuk konsultasi dokter.",
  keywords: [
    "laporan kesehatan menstruasi",
    "report siklus haid",
    "statistik periode",
    "grafik kesehatan wanita",
    "laporan untuk dokter",
  ],
};

const ReportPage = dynamic(() => import("./ReportContent"), {
  loading: () => <PageLoading />,
});

export default function Page() {
  return <ReportPage />;
}

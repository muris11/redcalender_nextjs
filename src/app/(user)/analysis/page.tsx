import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const AnalysisPage = dynamic(() => import("./AnalysisContent"), {
  loading: () => <PageLoading />,
});

export const metadata = {
  title: "Analisis Kesehatan Menstruasi & Siklus Haid",
  description:
    "Analisis mendalam pola menstruasi, durasi siklus, gejala berulang, dan insight kesehatan reproduksi berdasarkan data riwayat periode Anda.",
  keywords: [
    "analisis menstruasi",
    "pola siklus haid",
    "insight kesehatan",
    "analisis reproduksi",
    "tren menstruasi",
  ],
};

export default function Page() {
  return <AnalysisPage />;
}

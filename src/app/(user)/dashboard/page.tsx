import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("./DashboardContent"), {
  loading: () => <PageLoading />,
});

export const metadata = {
  title: "Dashboard Kesehatan Menstruasi",
  description:
    "Pantau kesehatan menstruasi Anda dengan dashboard interaktif. Lihat prediksi siklus, masa subur, analisis kesehatan, dan riwayat lengkap periode menstruasi Anda.",
  keywords: [
    "dashboard menstruasi",
    "pantau siklus haid",
    "kesehatan reproduksi",
    "prediksi periode",
  ],
};

export default function Page() {
  return <DashboardPage />;
}

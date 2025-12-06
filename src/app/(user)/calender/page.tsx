import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const CalendarContent = dynamic(() => import("./CalendarContent"), {
  loading: () => <PageLoading />,
});

export const metadata = {
  title: "Kalender Menstruasi - Pantau Siklus Haid Anda",
  description:
    "Kalender menstruasi interaktif untuk memantau siklus haid, prediksi periode berikutnya, masa subur, dan ovulasi. Catat gejala dan mood setiap hari dengan mudah.",
  keywords: [
    "kalender menstruasi",
    "kalender haid",
    "tracker periode",
    "prediksi masa subur",
    "siklus menstruasi",
  ],
};

export default function Page() {
  return <CalendarContent />;
}

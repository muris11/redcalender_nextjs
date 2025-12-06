import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const LogPage = dynamic(() => import("./LogContent"), {
  loading: () => <PageLoading />,
});

export const metadata = {
  title: "Log Harian Kesehatan Menstruasi",
  description:
    "Catat gejala, mood, aliran darah, nyeri, dan kondisi kesehatan harian Anda. Tracking lengkap untuk pemantauan kesehatan menstruasi yang lebih akurat.",
  keywords: [
    "log harian menstruasi",
    "catat gejala haid",
    "mood tracker",
    "tracking kesehatan",
    "jurnal menstruasi",
  ],
};

export default function Page() {
  return <LogPage />;
}

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const EducationPage = dynamic(() => import("./EducationContent"), {
  loading: () => <PageLoading />,
});

export const metadata = {
  title: "Edukasi Kesehatan Menstruasi & Reproduksi Wanita",
  description:
    "Artikel dan panduan lengkap tentang kesehatan menstruasi, reproduksi wanita, tips menjaga kesehatan saat haid, nutrisi, dan gaya hidup sehat untuk wanita Indonesia.",
  keywords: [
    "edukasi kesehatan wanita",
    "artikel menstruasi",
    "kesehatan reproduksi",
    "tips haid sehat",
    "nutrisi wanita",
  ],
};

export default function Page() {
  return <EducationPage />;
}

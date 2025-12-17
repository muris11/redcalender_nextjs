import { Metadata } from "next";
import GuestHome from "./GuestHome";

export const metadata: Metadata = {
  title: "Beranda - Aplikasi Kesehatan Wanita Terlengkap",
  description:
    "Red Calender adalah aplikasi kesehatan wanita terlengkap untuk memantau siklus menstruasi, prediksi masa subur, dan kesehatan reproduksi dengan teknologi AI.",
  keywords: [
    "aplikasi kesehatan wanita",
    "kalender menstruasi",
    "tracker haid",
    "kesehatan reproduksi",
    "masa subur",
    "ovulasi",
    "red calender",
  ],
  alternates: {
    canonical: "https://redcalender.my.id",
  },
};

export default function Page() {
  return <GuestHome />;
}

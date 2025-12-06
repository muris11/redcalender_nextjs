import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - Buat Akun Red Calender Gratis",
  description:
    "Daftar gratis di Red Calender dan mulai pantau siklus menstruasi, prediksi masa subur, catat gejala harian, dan dapatkan insight kesehatan reproduksi personal.",
  keywords: [
    "daftar red calender",
    "register akun",
    "sign up gratis",
    "buat akun menstruasi",
    "aplikasi tracker haid gratis",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

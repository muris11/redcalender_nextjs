import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Masuk ke Akun Red Calender",
  description:
    "Login ke akun Red Calender untuk memantau siklus menstruasi, prediksi masa subur, dan mengakses fitur kesehatan reproduksi lengkap.",
  keywords: [
    "login red calender",
    "masuk akun",
    "sign in",
    "login aplikasi menstruasi",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

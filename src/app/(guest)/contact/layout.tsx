import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - Red Calender Support",
  description:
    "Hubungi tim support Red Calender untuk pertanyaan, saran, atau bantuan seputar aplikasi kesehatan wanita kami.",
  keywords: [
    "kontak red calender",
    "support red calender",
    "bantuan aplikasi",
    "customer service",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

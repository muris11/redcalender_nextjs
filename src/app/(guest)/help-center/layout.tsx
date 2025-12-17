import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Bantuan - FAQ & Panduan Red Calender",
  description:
    "Temukan jawaban atas pertanyaan umum seputar penggunaan aplikasi Red Calender, fitur kesehatan, dan akun pengguna.",
  keywords: [
    "pusat bantuan",
    "faq red calender",
    "panduan penggunaan",
    "help center",
  ],
};

export default function HelpCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

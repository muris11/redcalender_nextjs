import { PageLoading } from "@/components/ui/loading";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Profil Kesehatan",
  description:
    "Kelola profil kesehatan Anda, lihat riwayat siklus menstruasi, dan atur preferensi aplikasi Red Calendar.",
};

const ProfileContent = dynamic(() => import("./ProfileContent"), {
  loading: () => <PageLoading />,
});

export default function ProfilePage() {
  return <ProfileContent />;
}

"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const ProfileContent = dynamic(() => import("./ProfileContent"), {
  ssr: false,
  loading: () => <PageLoading />,
});

export default function ProfilePage() {
  return <ProfileContent />;
}

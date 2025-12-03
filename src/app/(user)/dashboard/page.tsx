"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("./DashboardContent"), {
  loading: () => <PageLoading />,
  ssr: false,
});

export default function Page() {
  return <DashboardPage />;
}

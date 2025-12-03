"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const ReportPage = dynamic(() => import("./ReportContent"), {
  loading: () => <PageLoading />,
  ssr: false,
});

export default function Page() {
  return <ReportPage />;
}

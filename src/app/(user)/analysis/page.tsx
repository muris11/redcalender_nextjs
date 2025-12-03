"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const AnalysisPage = dynamic(() => import("./AnalysisContent"), {
  loading: () => <PageLoading />,
  ssr: false,
});

export default function Page() {
  return <AnalysisPage />;
}

"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const LogPage = dynamic(() => import("./LogContent"), {
  loading: () => <PageLoading />,
  ssr: false,
});

export default function Page() {
  return <LogPage />;
}

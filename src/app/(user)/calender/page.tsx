"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const CalendarContent = dynamic(() => import("./CalendarContent"), {
  ssr: false,
  loading: () => <PageLoading />,
});

export default function Page() {
  return <CalendarContent />;
}

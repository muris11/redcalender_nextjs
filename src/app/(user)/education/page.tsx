"use client";

import { PageLoading } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const EducationPage = dynamic(() => import("./EducationContent"), {
  loading: () => <PageLoading />,
  ssr: false,
});

export default function Page() {
  return <EducationPage />;
}

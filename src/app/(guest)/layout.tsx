"use client";

import GuestFooter from "@/components/GuestFooter";
import { GuestNavbar } from "@/components/GuestNavbar";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GuestNavbar />
      <main className="flex-1 pt-16">{children}</main>
      <GuestFooter />
    </div>
  );
}

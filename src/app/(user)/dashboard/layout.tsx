import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Red Calender",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

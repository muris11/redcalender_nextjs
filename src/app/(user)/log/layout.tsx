import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log Harian - Red Calendar",
};

export default function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

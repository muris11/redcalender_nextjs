import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender - Red Calendar",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

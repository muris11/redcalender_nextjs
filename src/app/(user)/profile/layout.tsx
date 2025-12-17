import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya - Red Calendar",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

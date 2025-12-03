import UserLayout from "@/components/UserLayout";

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}

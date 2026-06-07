import { Shell } from "@/components/shell";
import { getProfile } from "@/lib/data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  return (
    <Shell
      name={profile?.name ?? "Advisor"}
      role={profile?.role ?? "Financial Advisor"}
      avatarSeed={profile?.avatarSeed ?? "Advisor"}
    >
      {children}
    </Shell>
  );
}

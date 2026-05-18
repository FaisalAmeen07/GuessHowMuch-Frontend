import { MobileNav } from "@/components/layout/MobileNav";
import { AuthProvider } from "@/providers/AuthProvider";
import { getSession } from "@/lib/auth/session";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <AuthProvider session={session}>
      {children}
      <MobileNav />
    </AuthProvider>
  );
}

import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { ProfileScreen } from "@/features/profile/components/ProfileScreen";
import { getSession } from "@/lib/auth/session";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect(`${routes.login}?returnTo=${encodeURIComponent(routes.profile)}`);
  }

  return <ProfileScreen />;
}

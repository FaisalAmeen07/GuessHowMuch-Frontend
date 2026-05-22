type AuthorUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
} | null | undefined;

export function displayCommunityAuthor(user: AuthorUser): string {
  const name = user?.name?.trim();
  if (name) return name;

  const email = user?.email?.trim();
  if (email) {
    const local = email.split("@")[0]?.replace(/[._-]/g, " ").trim();
    if (local) {
      return local
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }

  return "Member";
}

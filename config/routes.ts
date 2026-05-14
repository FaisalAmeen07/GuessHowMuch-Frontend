export const routes = {
  /** Ranked list (Top cheap eats). */
  rankings: "/rankings",
  map: "/map",
  restaurant: (id: string) => `/restaurant/${id}`,
  hotDeals: "/hot-deals",
  community: "/community",
  saved: "/saved",
  login: "/login",
} as const;

export type PendingSubmission = {
  id: string;
  restaurant: string;
  price: number;
  dish: string;
  suburb: string;
};

export type FlaggedListing = {
  id: string;
  restaurant: string;
  reason: string;
  flagCount: number;
};

export const PENDING_SUBMISSIONS: PendingSubmission[] = [
  {
    id: "sub-1",
    restaurant: "Momo House",
    price: 10,
    dish: "8pc steamed momos",
    suburb: "South Bank",
  },
  {
    id: "sub-2",
    restaurant: "Sushi d'Lite",
    price: 11,
    dish: "10pc salmon nigiri box",
    suburb: "South Bank",
  },
];

export const FLAGGED_LISTINGS: FlaggedListing[] = [
  {
    id: "flag-1",
    restaurant: "Pho Thanh Long",
    reason: "Price has gone up",
    flagCount: 4,
  },
];

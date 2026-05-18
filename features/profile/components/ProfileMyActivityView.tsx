"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import {
  MOCK_USER_COMMENTS,
  MOCK_USER_POSTS,
} from "@/features/profile/data/mock-activities";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils/cn";

const ACCENT = "#FF5722";

type Tab = "writing" | "comments";

type ProfileMyActivityViewProps = {
  onBack: () => void;
  variant?: "page" | "sidebar";
};

export function ProfileMyActivityView({
  onBack,
  variant = "page",
}: ProfileMyActivityViewProps) {
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>("writing");
  const isSidebar = variant === "sidebar";

  const posts = MOCK_USER_POSTS;
  const comments = MOCK_USER_COMMENTS;
  const nickname = session?.nickname ?? "you";

  return (
    <div className={cn("w-full", !isSidebar && "max-w-sm")}>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
        style={{ color: ACCENT }}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Account settings
      </button>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Setting
      </p>
      <h2 className="mt-0.5 text-lg font-bold tracking-tight text-neutral-900">
        My activities
      </h2>
      <p className="mt-1.5 text-xs leading-snug text-neutral-500">
        View your written posts and comments by tab.
      </p>

      <div className="mt-4 flex gap-2">
        {(["writing", "comments"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-full px-2.5 py-2 text-xs font-semibold transition",
              tab === key
                ? "text-white shadow-sm shadow-orange-500/20"
                : "bg-orange-50 text-[#FF5722] hover:bg-orange-100/80",
            )}
            style={tab === key ? { backgroundColor: ACCENT } : undefined}
          >
            {key === "writing" ? "My writing" : "My comment"}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-orange-50/80 px-3 py-6 ring-1 ring-orange-100/80">
        {tab === "writing" ? (
          posts.length === 0 ? (
            <p className="text-center text-xs leading-relaxed text-neutral-600">
              There are no posts written with the member nickname yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {posts.map((post) => (
                <li key={post.id} className="rounded-lg bg-white p-2.5 shadow-sm ring-1 ring-neutral-100">
                  <p className="text-sm font-semibold text-neutral-900">{post.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-600">{post.body}</p>
                </li>
              ))}
            </ul>
          )
        ) : comments.length === 0 ? (
          <p className="text-center text-xs leading-relaxed text-neutral-600">
            There are no comments written with the member nickname &ldquo;{nickname}&rdquo; yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-white p-2.5 shadow-sm ring-1 ring-neutral-100">
                <p className="text-[10px] font-semibold text-neutral-500">{c.postTitle}</p>
                <p className="mt-0.5 text-xs text-neutral-800">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

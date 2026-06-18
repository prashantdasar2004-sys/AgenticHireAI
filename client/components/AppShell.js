"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, BriefcaseBusiness, GitBranch, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Button } from "./ui";
import { useAuthStore } from "../store/authStore";
import { getToken } from "../lib/api";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export function AppShell({ children }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <main className="grid min-h-screen place-items-center p-5 text-sm text-muted">Loading...</main>;
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border bg-white p-4 md:block">
        <div className="mb-6 text-lg font-semibold">AgenticHireAI</div>
        <nav className="grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink">
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="secondary"
          className="absolute bottom-4 left-4 right-4"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut size={16} /> Logout
        </Button>
      </aside>
      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}

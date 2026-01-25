"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <nav className="flex gap-1">
                <Link href="/admin">
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    size="sm"
                  >
                    Submissions
                  </Button>
                </Link>
                <Link href="/admin/add">
                  <Button
                    variant={isActive("/admin/add") ? "default" : "ghost"}
                    size="sm"
                  >
                    Add Tool
                  </Button>
                </Link>
              </nav>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}

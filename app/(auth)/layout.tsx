import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Minimal Auth Header */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-foreground tracking-tight">
          <div className="h-6 w-6 rounded-md bg-foreground text-background flex items-center justify-center text-sm font-black">N</div>
          Nexus
        </Link>
        <ThemeToggle />
      </header>

      {/* Auth Page Content */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nexus Engine, Inc. ·{" "}
        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>{" "}
        ·{" "}
        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
      </footer>
    </div>
  );
}

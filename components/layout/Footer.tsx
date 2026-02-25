import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-8 grid gap-8 lg:grid-cols-4">
        <div>
          <Link href="/" className="font-bold text-xl tracking-tight">
            Enterprise UI
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            A beautiful, modern, and high-performance landing page boilerplate built for enterprise clients.
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-foreground">Product</h3>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="#changelog" className="text-sm text-muted-foreground hover:text-foreground">Changelog</Link>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-foreground">Resources</h3>
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
          <Link href="#community" className="text-sm text-muted-foreground hover:text-foreground">Community</Link>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold text-foreground">Legal</h3>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 sm:px-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">© 2026 Enterprise UI. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-muted-foreground">
          {/* Social Icons would go here */}
          <Link href="#" className="hover:text-foreground">Twitter</Link>
          <Link href="#" className="hover:text-foreground">GitHub</Link>
          <Link href="#" className="hover:text-foreground">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}

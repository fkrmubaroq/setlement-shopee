

import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-primary">Blogify</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A modern blog platform for sharing ideas and stories.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Explore</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/authors"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Authors
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Tags
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Company</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

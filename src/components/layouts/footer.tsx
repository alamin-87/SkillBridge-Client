import Link from "next/link";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  className,
  tagline = "Connect with expert tutors. Learn anything, anytime.",
  menuItems = [
    {
      title: "Platform",
      links: [
        { text: "Browse Tutors", url: "/tutors" },
        { text: "Categories", url: "/categories" },
        { text: "How It Works", url: "/#how-it-works" },
        { text: "Featured Tutors", url: "/#featured" },
      ],
    },
    {
      title: "Account",
      links: [
        { text: "Login", url: "/login" },
        { text: "Register", url: "/register" },
        { text: "Student Dashboard", url: "/dashboard" },
        { text: "Tutor Dashboard", url: "/tutor/dashboard" },
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Contact", url: "/#contact" },
        { text: "FAQ", url: "/#faq" },
        { text: "Help Center", url: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Terms of Service", url: "/terms" },
        { text: "Privacy Policy", url: "/privacy" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} SkillBridge. All rights reserved.`,
  bottomLinks = [
    { text: "Terms", url: "/terms" },
    { text: "Privacy", url: "/privacy" },
  ],
}: FooterProps) => {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  SkillBridge
                </span>
              </Link>
            </div>

            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {tagline}
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/tutors"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Find a Tutor
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/register"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Become a Tutor
              </Link>
            </div>
          </div>

          {/* Menus */}
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx} className="lg:col-span-1">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.url}
                      className="hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>

          <ul className="flex flex-wrap gap-4">
            {bottomLinks.map((link, idx) => (
              <li key={idx}>
                <Link href={link.url} className="hover:text-primary underline">
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export { Footer };

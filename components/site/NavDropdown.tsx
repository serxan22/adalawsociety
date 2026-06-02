"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavDropdownItem = {
  label: string;
  href: string;
};

export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NavDropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = items.some((item) => pathname === item.href);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "nav-underline inline-flex items-center gap-1 text-sm font-semibold text-als-blue transition hover:text-als-red",
          active && "text-als-red",
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 z-50 mt-4 w-64 -translate-x-1/2 rounded-lg border border-als-line bg-white p-2 shadow-xl shadow-als-blue/10"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-semibold text-als-blue transition hover:bg-als-red/[0.08] hover:text-als-red",
                  pathname === item.href && "bg-als-red/10 text-als-red",
                )}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SubdomainHeaderProps {
  subdomain: string;
}

export function SubdomainHeader({ subdomain }: SubdomainHeaderProps) {
  return (
    <div className="flex items-baseline gap-0 font-serif text-2xl tracking-tight sm:text-3xl">
      <AnimatePresence mode="wait">
        <motion.span
          key={subdomain}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-primary"
        >
          {subdomain}
        </motion.span>
      </AnimatePresence>
      <span className="text-muted-foreground">.cartergrove.me</span>
    </div>
  );
}

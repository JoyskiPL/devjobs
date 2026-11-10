
"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

type ProfileMenuProps = {
  name: string;
  children: React.ReactNode;
};

export default function ProfileMenu({ name, children }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 font-medium text-white transition hover:border-emerald-500/50 hover:bg-zinc-900"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
          {name.charAt(0).toUpperCase()}
        </span>

        <span className="max-w-32 truncate">{name}</span>

        <span
          className={`text-xs text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl transition-all duration-200 ${
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="border-b border-zinc-800 px-3 py-3">
          <p className="text-xs text-zinc-500">Zalogowano jako</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {name}
          </p>
        </div>

        <div className="space-y-1 py-2">
          {children}
        </div>

        <div className="border-t border-zinc-800 pt-2">
          <button
            type="button"
            onClick={() => signOut({ redirectTo: "/login" })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <span>↪</span>
            Wyloguj się
          </button>
        </div>
      </div>
    </div>
  );
}

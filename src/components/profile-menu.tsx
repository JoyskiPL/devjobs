
"use client";

import { useEffect, useRef, useState } from "react";

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="rounded-lg border border-zinc-700 px-4 py-2 hover:border-emerald-400"
      >
        {name} ▾
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
          <div onClick={() => setIsOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

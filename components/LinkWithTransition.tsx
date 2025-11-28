"use client";

import { useRouter } from "next/navigation";

export default function LinkWithTransition({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}

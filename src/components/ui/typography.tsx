"use client"

import { useState } from "react"

export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`}>
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
      {children}
    </h4>
  );
}

export function TypographyP({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-zinc-400 leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  );
}

export function ExternalLink({ children, className, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [hover, setHover] = useState(false);
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={`text-green-500 font-bold hover:text-green-700 ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? 'var(--tw-prose-links-hover)' : 'var(--tw-prose-links)'
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

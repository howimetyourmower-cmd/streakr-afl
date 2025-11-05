'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { name: 'Picks', href: '/picks' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Rewards', href: '/rewards' },
  { name: 'Sign In', href: '/auth/signin' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/streakrlogo1.jpg"
            alt="Streakr Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-accent">streakr</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-medium text-foreground transition-colors hover:text-accent ${isActive ? 'text-accent' : ''}`}>
                {link.name}
                {isActive && (
                  <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-accent"></span>
                )}
              </Link>
            )
          })}
        </nav>
        {/* Mobile menu can be added here */}
      </div>
    </header>
  )
}
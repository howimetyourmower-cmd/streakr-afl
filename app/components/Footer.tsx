import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-background py-6 text-center text-foreground">
      <div className="container mx-auto">
        <p className="text-sm">&copy; 2026 Streakr. All Rights Reserved. |
          <Link href="/privacy" className="hover:text-accent"> Privacy</Link> | 
          <Link href="/terms" className="hover:text-accent"> Terms</Link>
        </p>
      </div>
    </footer>
  )
}
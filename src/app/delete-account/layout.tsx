import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delete Your Account | knowyourwomen App',
  description: 'Request permanent deletion of your account and personal data from the knowyourwomen app.',
}

export default function DeleteAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

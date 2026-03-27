import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { getDefaultBranding } from '@/lib/config/tenantBranding'

const branding = getDefaultBranding()

export const metadata: Metadata = {
  title: `${branding.appName} - Omnichannel`,
  description: `CRM Omnichannel da ${branding.companyName}`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

